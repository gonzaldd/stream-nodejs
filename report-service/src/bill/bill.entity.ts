import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
