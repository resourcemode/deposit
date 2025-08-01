import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TimeDepositsModule } from "./modules/time-deposits/time-deposits.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host =
          process.env.DATABASE_HOST ||
          configService.get("DATABASE_HOST", "localhost");
        const port =
          parseInt(process.env.DATABASE_PORT) ||
          configService.get<number>("DATABASE_PORT", 5432);
        console.log(`Connecting to database at ${host}:${port}`);
        return {
          type: "postgres",
          host: host,
          port: port,
          username:
            process.env.DATABASE_USERNAME ||
            configService.get("DATABASE_USERNAME", "postgres"),
          password:
            process.env.DATABASE_PASSWORD ||
            configService.get("DATABASE_PASSWORD", "postgres"),
          database:
            process.env.DATABASE_NAME ||
            configService.get("DATABASE_NAME", "timedeposits"),
          entities: [__dirname + "/**/*.entity{.ts,.js}"],
          synchronize: true, // Only for development, should be false in production
          extra: { trustServerCertificate: true },
        };
      },
      inject: [ConfigService],
    }),
    TimeDepositsModule,
  ],
})
export class AppModule {}
