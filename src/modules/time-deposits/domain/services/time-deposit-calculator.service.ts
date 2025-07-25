import { TimeDeposit } from '../models/time-deposit.model';
import { Decimal } from 'decimal.js';
import { ANNUAL_INTEREST_RATES, MIN_DAYS_FOR_INTEREST, PLAN_DAY_REQUIREMENTS, PlanType } from '../models/plan.enum';

/**
 * Calculator for time deposit interest and balance updates
 */
export class TimeDepositCalculator {
  /**
   * Updates balances for all time deposits in the array
   * @param deposits Array of time deposits to update
   */
  public updateBalance(deposits: TimeDeposit[]): void {
    deposits.forEach(deposit => {
      const interestAmount = this.calculateInterest(deposit);
      
      // Round to 2 decimal places for currency calculations
      const roundedInterestAmount = interestAmount.toDecimalPlaces(2);
      
      // Add the interest to the balance
      deposit.balance = deposit.balance.plus(roundedInterestAmount);
    });
  }

  /**
   * Calculates interest for a single time deposit
   * @param deposit The time deposit to calculate interest for
   * @returns The calculated interest amount as a Decimal
   */
  private calculateInterest(deposit: TimeDeposit): Decimal {
    // Early exit if minimum days requirement not met
    if (deposit.days <= MIN_DAYS_FOR_INTEREST) {
      return new Decimal(0);
    }

    // Early exit if plan type doesn't exist in our interest rates
    const planType = deposit.planType as PlanType;
    if (!this.isEligibleForInterest(deposit)) {
      return new Decimal(0);
    }

    // Get annual rate and convert to monthly
    const annualRate = ANNUAL_INTEREST_RATES[planType];
    const monthlyRate = new Decimal(annualRate).div(new Decimal(12));
    
    // Calculate interest amount
    return deposit.balance.mul(monthlyRate);
  }

  /**
   * Determines if a deposit is eligible for interest based on plan type and days
   * @param deposit The time deposit to check eligibility for
   * @returns boolean indicating if deposit is eligible for interest
   */
  private isEligibleForInterest(deposit: TimeDeposit): boolean {
    const planType = deposit.planType as PlanType;
    
    // Check specific plan type requirements
    switch (planType) {
      case PlanType.STUDENT:
        // Student plans need < 366 days
        return deposit.days < PLAN_DAY_REQUIREMENTS[PlanType.STUDENT];
        
      case PlanType.PREMIUM:
        // Premium plans need > 45 days
        return deposit.days > PLAN_DAY_REQUIREMENTS[PlanType.PREMIUM];
        
      case PlanType.BASIC:
        // Basic plans just need to meet minimum days requirement (which we've already checked)
        return true;
        
      default:
        return false;
    }
  }
}
