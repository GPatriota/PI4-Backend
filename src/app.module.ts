import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { databaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Uncomment and configure .env when database is ready:
    // TypeOrmModule.forRootAsync({ useFactory: databaseConfig }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
