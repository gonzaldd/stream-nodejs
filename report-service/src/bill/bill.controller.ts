import { Controller, Get, Delete, Post, Body } from '@nestjs/common';
import { BillService } from './bill.service';

@Controller('bill')
export class BillController {
  constructor(private readonly billsService: BillService) {}

  @Get()
  getAll(): any {
    return this.billsService.findAll();
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
