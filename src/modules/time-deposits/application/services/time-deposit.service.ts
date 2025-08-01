import { Injectable, Inject } from "@nestjs/common";
import { Deposit } from "../../domain/models/deposit.model";
import {
  ITimeDepositRepository,
  TIME_DEPOSIT_REPOSITORY,
} from "../../domain/repositories/time-deposit.repository.interface";

@Injectable()
export class TimeDepositService {
  constructor(
    @Inject(TIME_DEPOSIT_REPOSITORY)
    private timeDepositRepository: ITimeDepositRepository,
  ) {}

  /**
   * Get all time deposits
   */
  async findAll(): Promise<Deposit[]> {
    return this.timeDepositRepository.findAll();
  }

  async findById(id: number): Promise<Deposit | null> {
    return this.timeDepositRepository.findById(id);
  }

  /**
   * Update balances for all time deposits
   */
  async updateAllBalances(): Promise<Deposit[]> {
    return this.timeDepositRepository.updateAll();
  }
}
