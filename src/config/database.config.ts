import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || '',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || '',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || '',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  // Connection is inactive until DB_HOST is configured in .env
  ...(process.env.DB_HOST ? {} : { type: undefined as any }),
});
