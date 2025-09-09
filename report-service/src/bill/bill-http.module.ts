import { Module } from '@nestjs/common';
import { BillModule } from './bill.module';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { S3Service } from 's3/s3.service';

@Module({
  imports: [BillModule],
  providers: [BillService, S3Service],
  controllers: [BillController],
})
export class BillHttpModule {}
