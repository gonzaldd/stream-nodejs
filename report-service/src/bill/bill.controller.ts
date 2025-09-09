import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Query,
  Sse,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { BillService } from './bill.service';

@Controller('bill')
export class BillController {
  constructor(private readonly billsService: BillService) {}

  @Get()
  getAll(@Query('skip') skip: number, @Query('take') take: number): any {
    return this.billsService.findAll(Number(skip) || 0, Number(take) || 10);
  }

  @Get('stream-to-s3')
  async streamToS3(): Promise<{ fileUrl: string; downloadURL: string }> {
    return await this.billsService.streamBillsToS3();
  }

  @Sse('stream-to-s3-progress')
  streamToS3WithProgress(): Observable<{ progress: number }> {
    return new Observable((observer) => {
      this.billsService
        .streamBillsToS3WithProgress((progress) => {
          observer.next({ progress });
        })
        .then(() => {
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
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
