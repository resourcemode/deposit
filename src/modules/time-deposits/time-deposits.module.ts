import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeDepositEntity } from './domain/entities/time-deposit.entity';
import { Withdrawal } from './domain/entities/withdrawal.entity';
import { TimeDepositService } from './application/services/time-deposit.service';
import { TimeDepositController } from './presentation/controllers/time-deposit.controller';
import { TimeDepositRepository } from './infrastructure/repositories/time-deposit.repository';
import { TIME_DEPOSIT_REPOSITORY } from './domain/repositories/time-deposit.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeDepositEntity, Withdrawal]),
  ],
  controllers: [TimeDepositController],
  providers: [
    TimeDepositService,
    {
      provide: TIME_DEPOSIT_REPOSITORY,
      useClass: TimeDepositRepository,
    },
  ],
  exports: [TimeDepositService],
})
export class TimeDepositsModule {}
