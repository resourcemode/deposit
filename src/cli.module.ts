import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from './app.module';
import { CliCommandModule } from './modules/time-deposits/infrastructure/seeder/command.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'timedeposits',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      extra: { trustServerCertificate: true },
    }),
    AppModule,
    CliCommandModule,
  ],
})
export class CliModule {}
