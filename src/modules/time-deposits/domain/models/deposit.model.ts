import { TimeDeposit } from './time-deposit.model';
import { Withdrawal } from '../entities/withdrawal.entity';
import { Decimal } from 'decimal.js';

/**
 * Domain model for TimeDeposit
 * This extends the original TimeDeposit class to ensure compatibility
 * while adding the functionality we need for the API
 * 
 * We're careful not to modify the original TimeDeposit class behavior
 * as per the refactoring constraints in the requirements.
 */
export class Deposit extends TimeDeposit {
  withdrawals: Withdrawal[] = [];

  constructor(id: number, planType: string, balance: number | string | Decimal, days: number, withdrawals: Withdrawal[] = []) {
    super(id, planType, balance, days);
    this.withdrawals = withdrawals;
  }

  /**
   * Creates a Deposit instance from a database entity
   */
  static fromEntity(entity: any): Deposit {
    // Entity balance should already be a Decimal thanks to TypeORM transformer
    return new Deposit(
      entity.id,
      entity.planType,
      entity.balance, // No need to convert, TypeORM transformer handles this
      entity.days,
      entity.withdrawals || []
    );
  }

  /**
   * Converts this domain model to a format suitable for database storage
   */
  toEntity(): any {
    return {
      id: this.id,
      planType: this.planType,
      balance: this.balance,
      days: this.days,
      withdrawals: this.withdrawals
    };
  }
}
