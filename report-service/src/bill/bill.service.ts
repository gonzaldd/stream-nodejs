import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './bill.entity';
import { Pool, PoolClient } from 'pg';
import QueryStream from 'pg-query-stream';
import { stringify } from 'csv-stringify';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { PassThrough } from 'stream';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,
    private configService: ConfigService,
  ) {}

  async findAll(
    skip: number = 0,
    take: number = 10,
  ): Promise<{ data: Bill[]; total: number }> {
    const [data, total] = await this.billsRepository.findAndCount({
      skip,
      take,
    });
    return { data, total };
  }

  findOne(id: number): Promise<Bill | null> {
    return this.billsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.billsRepository.delete(id);
  }

  async createBill(userId: number, amount: string): Promise<Bill> {
    const bill = this.billsRepository.create({ userId, amount });
    return await this.billsRepository.save(bill);
  }

  async streamBillsToS3(): Promise<{ fileUrl: string }> {
    console.log('Starting to stream bills to Bucket...');

    const pool: Pool = new Pool({
      user: this.configService.get<string>('DATABASE_USER') || '',
      host: this.configService.get<string>('DATABASE_HOST') || '',
      database: this.configService.get<string>('DATABASE_DB') || '',
      password: this.configService.get<string>('DATABASE_PASSWORD') || '',
      port: this.configService.get<number>('DATABASE_PORT', 5432) || 5432,
    });

    let client: PoolClient | null = null;
    try {
      client = await pool.connect();
      if (!client) {
        throw new Error('Failed to acquire a database client');
      }

      const query = new QueryStream('SELECT * FROM bill');
      const dbStream = client.query(query) as unknown as NodeJS.ReadableStream;
      if (!dbStream) {
        throw new Error('Failed to create a database stream');
      }

      const csvStream = stringify();
      const passThrough = new PassThrough();
      const chunks: Buffer[] = [];

      passThrough.on('data', (chunk: Buffer) => chunks.push(chunk));

      dbStream.pipe(csvStream).pipe(passThrough);

      await new Promise((resolve, reject) => {
        passThrough.on('end', resolve);
        passThrough.on('error', reject);
      });

      const csvBuffer = Buffer.concat(chunks);
      const s3Client = new S3Client({
        region: 'us-east-1',
        endpoint: `http://${this.configService.get<string>('S3_ENDPOINT')}:${this.configService.get<string>('S3_PORT')}`,
        forcePathStyle: true,
        credentials: {
          accessKeyId: this.configService.get<string>(
            'S3_ACCESS_KEY',
          ) as string,
          secretAccessKey: this.configService.get<string>(
            'S3_SECRET_KEY',
          ) as string,
        },
      });

      const uploadParams = {
        Bucket: 'reports',
        Key: `bills-${new Date().toISOString()}-${Math.random().toString(36).substring(2, 15)}.csv`,
        Body: csvBuffer,
        ContentType: 'text/csv',
        ContentLength: csvBuffer.length,
        ACL: 'public-read' as ObjectCannedACL,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      console.log('Data successfully uploaded to MinIO');
      return { fileUrl: `reports/${uploadParams.Key}` };
    } catch (error) {
      console.error('Error during streaming or uploading to MinIO:', error);
      throw new Error('Failed to stream bills to MinIO');
    } finally {
      if (client) {
        try {
          client.release();
        } catch (releaseError) {
          console.error('Error releasing the database client:', releaseError);
        }
      }
    }
  }
}
