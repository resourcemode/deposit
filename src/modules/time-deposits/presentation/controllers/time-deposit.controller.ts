import { Controller, Get, Post } from '@nestjs/common';
import { TimeDepositService } from '../../application/services/time-deposit.service';
import { TimeDepositDto } from '../dtos/time-deposit.dto';
import { Deposit } from '../../domain/models/deposit.model';

@Controller('time-deposits')
export class TimeDepositController {
  constructor(private readonly timeDepositService: TimeDepositService) {}

  /**
   * GET /time-deposits
   * Returns all time deposits
   */
  @Get()
  async findAll(): Promise<TimeDepositDto[]> {
    const timeDeposits = await this.timeDepositService.findAll();
    return timeDeposits.map(timeDeposit => TimeDepositDto.fromDomain(timeDeposit));
  }

  /**
   * POST /time-deposits/update-balances
   * Updates the balances of all time deposits
   */
  @Post('update-balances')
  async updateBalances(): Promise<TimeDepositDto[]> {
    const updatedTimeDeposits = await this.timeDepositService.updateAllBalances();
    return updatedTimeDeposits.map(timeDeposit => TimeDepositDto.fromDomain(timeDeposit));
  }
}
