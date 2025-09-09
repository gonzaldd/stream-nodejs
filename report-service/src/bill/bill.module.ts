import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

import { Bill } from './bill.entity';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Bill])],
  exports: [TypeOrmModule, 'PG_POOL'],
  controllers: [BillController],
  providers: [
    BillService,
    {
      provide: 'PG_POOL',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Pool({
          user: configService.get<string>('DATABASE_USER'),
          host: configService.get<string>('DATABASE_HOST'),
          database: configService.get<string>('DATABASE_DB'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          port: configService.get<number>('DATABASE_PORT', 5432),
        });
      },
    },
  ],
})
export class BillModule {}
