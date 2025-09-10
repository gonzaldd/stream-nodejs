import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BillHttpModule } from './bill/bill-http.module';
import Config from './configuration/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Config],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Config().database.host,
      port: Config().database.port,
      username: Config().database.user,
      password: Config().database.password,
      database: Config().database.db,
      synchronize: false,
      autoLoadEntities: true,
    }),
    BillHttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
