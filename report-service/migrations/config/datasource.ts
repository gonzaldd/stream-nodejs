import { DataSource } from 'typeorm';
import 'dotenv/config';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_DB || 'reportdb',
  entities: [],
  migrations: ['./migrations/*.ts'],
  synchronize: false, // Set to true only in development
  logging: true,
});

export default AppDataSource;
