import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TimeDepositEntity } from "../../domain/entities/time-deposit.entity";
import { Withdrawal } from "../../domain/entities/withdrawal.entity";
import { TimeDepositSeeder } from "./time-deposit.seeder";
import { SeederService } from "./seeder.service";

@Module({
  imports: [TypeOrmModule.forFeature([TimeDepositEntity, Withdrawal])],
  providers: [TimeDepositSeeder, SeederService],
  exports: [SeederService],
})
export class SeederModule {}
