import { Controller, Get, Delete, Post, Body, Query } from '@nestjs/common';
import { BillService } from './bill.service';

@Controller('bill')
export class BillController {
  constructor(private readonly billsService: BillService) {}

  @Get()
  getAll(@Query('skip') skip: number, @Query('take') take: number): any {
    return this.billsService.findAll(Number(skip) || 0, Number(take) || 10);
  }

  @Get('stream-to-s3')
  async streamToS3(): Promise<{ fileUrl: string }> {
    return await this.billsService.streamBillsToS3();
  }

  @Get(':id')
  getOne(id: number): any {
    return this.billsService.findOne(id);
  }

  @Delete(':id')
  deleteOne(id: number): any {
    return this.billsService.remove(id);
  }

  @Post()
  create(@Body() body: { userId: number; amount: string }) {
    return this.billsService.createBill(body.userId, body.amount);
  }
}
