import { Controller, Get, Patch } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from "@nestjs/swagger";
import { TimeDepositService } from "../../application/services/time-deposit.service";
import { TimeDepositDto } from "../dtos/time-deposit.dto";
import { Deposit } from "../../domain/models/deposit.model";

@ApiTags('time-deposits')
@Controller("time-deposits")
export class TimeDepositController {
  constructor(private readonly timeDepositService: TimeDepositService) {}

  @ApiOperation({
    summary: 'Get all time deposits',
    description: 'Retrieves all time deposits with their current balances, plan types, and withdrawal history'
  })
  @ApiOkResponse({
    description: 'List of all time deposits retrieved successfully',
    type: [TimeDepositDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred while retrieving time deposits'
  })
  @Get()
  async findAll(): Promise<TimeDepositDto[]> {
    const timeDeposits = await this.timeDepositService.findAll();
    return timeDeposits.map((timeDeposit) =>
      TimeDepositDto.fromDomain(timeDeposit),
    );
  }

  @ApiOperation({
    summary: 'Update all time deposit balances',
    description: 'Updates the balances of all time deposits based on their plan types and interest calculation strategies. Interest is calculated monthly according to each plan\'s specific rules.'
  })
  @ApiOkResponse({
    description: 'Time deposit balances updated successfully',
    type: [TimeDepositDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred while updating balances'
  })
  @Patch("update-balances")
  async updateBalances(): Promise<TimeDepositDto[]> {
    const updatedTimeDeposits =
      await this.timeDepositService.updateAllBalances();
    return updatedTimeDeposits.map((timeDeposit) =>
      TimeDepositDto.fromDomain(timeDeposit),
    );
  }
}
