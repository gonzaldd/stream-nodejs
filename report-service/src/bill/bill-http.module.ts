import { Module } from '@nestjs/common';
import { BillModule } from './bill.module';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';

@Module({
  imports: [BillModule],
  providers: [BillService],
  controllers: [BillController],
})
export class BillHttpModule {}
