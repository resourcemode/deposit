import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TimeDepositEntity } from "../../domain/entities/time-deposit.entity";
import { Withdrawal } from "../../domain/entities/withdrawal.entity";
import { Decimal } from "decimal.js";
import { PlanType } from "../../domain/models/plan.enum";

@Injectable()
export class TimeDepositSeeder {
  constructor(
    @InjectRepository(TimeDepositEntity)
    private readonly timeDepositRepository: Repository<TimeDepositEntity>,
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>,
  ) {}

  async seed(): Promise<void> {
    // Check if data already exists to avoid duplicate seeding
    const count = await this.timeDepositRepository.count();
    if (count > 0) {
      return;
    }

    // Create and save time deposits
    const deposits = await this.createTimeDeposits();

    // Create and save withdrawals
    await this.createWithdrawals(deposits);
  }

  private async createTimeDeposits(): Promise<TimeDepositEntity[]> {
    const deposits: TimeDepositEntity[] = [
      this.createTimeDeposit(PlanType.BASIC, 5000, 0, 30),
      this.createTimeDeposit(PlanType.PREMIUM, 10000, 0, 60),
      this.createTimeDeposit(PlanType.STUDENT, 15000, 0, 90),
    ];

    // Save all deposits
    return this.timeDepositRepository.save(deposits);
  }

  private createTimeDeposit(
    plan: string,
    principal: number,
    balance: number,
    days: number,
  ): TimeDepositEntity {
    const deposit = new TimeDepositEntity();
    deposit.planType = plan;
    // Convert to Decimal for precise financial calculations
    deposit.balance = new Decimal(balance || principal); // Use principal as balance if balance is 0
    deposit.days = days;
    deposit.withdrawals = [];
    return deposit;
  }

  private async createWithdrawals(
    deposits: TimeDepositEntity[],
  ): Promise<void> {
    if (!deposits.length) return;

    const withdrawals: Withdrawal[] = [];

    // Add a withdrawal for the first deposit
    const withdrawal1 = new Withdrawal();
    withdrawal1.amount = new Decimal(1000);
    withdrawal1.date = new Date();
    withdrawal1.timeDeposit = deposits[0];
    withdrawals.push(withdrawal1);

    // Add a withdrawal for the second deposit
    if (deposits.length > 1) {
      const withdrawal2 = new Withdrawal();
      withdrawal2.amount = new Decimal(2000);
      withdrawal2.date = new Date();
      withdrawal2.timeDeposit = deposits[1];
      withdrawals.push(withdrawal2);
    }

    // Save all withdrawals
    await this.withdrawalRepository.save(withdrawals);
  }
}
