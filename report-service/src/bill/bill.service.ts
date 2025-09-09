import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pool, PoolClient } from 'pg';
import QueryStream from 'pg-query-stream';
import { stringify } from 'csv-stringify';
import { PassThrough } from 'stream';
import { ConfigService } from '@nestjs/config';

import { Bill } from './bill.entity';
import { S3Service } from '../s3/s3.service';
@Injectable()
export class BillService {
  constructor(
    @Inject('PG_POOL') private readonly pool: Pool,
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,
    private s3Service: S3Service,
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

  async streamBillsToS3(): Promise<{ fileUrl: string; downloadURL: string }> {
    console.log('Starting to stream bills to Bucket...');

    let client: PoolClient | null = null;
    try {
      client = await this.pool.connect();
      if (!client) {
        throw new Error('Failed to acquire a database client');
      }

      const query = new QueryStream('SELECT * FROM bill');
      if (typeof client.query !== 'function') {
        throw new Error('Invalid database client: query method not found');
      }
      const dbStream = client.query(query) as NodeJS.ReadableStream;

      const csvStream = stringify();
      const passThrough = new PassThrough();
      const chunks: Buffer[] = [];

      passThrough.on('data', (chunk: Buffer) => chunks.push(chunk));

      dbStream.pipe(csvStream).pipe(passThrough);

      await new Promise<void>((resolve, reject) => {
        passThrough.on('end', resolve);
        passThrough.on('error', reject);
      });

      const csvBuffer = Buffer.concat(chunks);
      const key = `bills-${new Date().toISOString()}-${Math.random().toString(36).substring(2, 15)}.csv`;

      const fileUrl = await this.s3Service.uploadFile(
        'reports',
        key,
        csvBuffer,
        'text/csv',
      );
      const downloadURL = await this.s3Service.getPresignedUrl(
        'reports',
        key,
        this.configService.get<number>('S3_BUCKET.ttl'),
        this.configService.get<string>('S3_BUCKET.customEndpoint'),
      );

      console.log('Data successfully uploaded to S3');
      return { fileUrl, downloadURL };
    } catch (error) {
      console.error('Error during streaming or uploading to S3:', error);
      throw new Error('Failed to stream bills to S3');
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
