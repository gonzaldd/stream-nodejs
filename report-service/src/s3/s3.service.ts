import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    const S3Vars = this.configService.get<{
      region: string;
      endpoint: string;
      port: number;
      accessKey: string;
      secretKey: string;
    }>('S3_BUCKET') as {
      region: string;
      endpoint: string;
      port: number;
      accessKey: string;
      secretKey: string;
    };

    this.s3Client = new S3Client({
      region: S3Vars.region,
      endpoint: `http://${S3Vars.endpoint}:${S3Vars.port}`,
      forcePathStyle: true,
      credentials: {
        accessKeyId: S3Vars.accessKey,
        secretAccessKey: S3Vars.secretKey,
      },
    });
  }

  async uploadFile(
    bucket: string,
    key: string,
    body: Buffer,
    contentType: string,
    acl: ObjectCannedACL = 'public-read',
  ): Promise<string> {
    const uploadParams = {
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ContentLength: body.length,
      ACL: acl,
    };

    await this.s3Client.send(new PutObjectCommand(uploadParams));
    return `reports/${key}`;
  }

  async getPresignedUrl(
    bucket: string,
    key: string,
    expiresIn: number = 3600,
    customEndpoint?: string,
  ): Promise<string> {
    const s3Client = customEndpoint
      ? new S3Client({
          region: await this.s3Client.config.region(),
          endpoint: customEndpoint,
          forcePathStyle: this.s3Client.config.forcePathStyle,
          credentials: await this.s3Client.config.credentials(),
        })
      : this.s3Client;

    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(s3Client, command, { expiresIn });
  }
}
