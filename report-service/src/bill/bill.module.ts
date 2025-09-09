import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './bill.entity';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bill])],
  exports: [TypeOrmModule],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
