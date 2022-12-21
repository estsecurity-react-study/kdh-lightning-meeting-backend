import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  poolSize: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10),
  dropSchema: false,
  migrationsRun: false,
  logging: process.env.NODE_ENV !== 'production',
};

export default new DataSource(dataSourceOptions);
