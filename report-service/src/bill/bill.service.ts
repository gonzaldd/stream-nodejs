import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './bill.entity';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,
  ) {}

  findAll(): Promise<Bill[]> {
    return this.billsRepository.find();
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
}
