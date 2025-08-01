import { TimeDeposit } from "../models/time-deposit.model";
import { Decimal } from "decimal.js";
import { PlanType } from "../models/plan.enum";
import { PlanStrategyFactory } from "../strategies/plan-strategy-factory";

/**
 * Calculator for time deposit interest and balance updates
 */
export class TimeDepositCalculator {
  /**
   * Updates balances for all time deposits in the array
   * @param deposits Array of time deposits to update
   */
  public updateBalance(deposits: TimeDeposit[]): void {
    deposits.forEach((deposit) => {
      try {
        // Get the appropriate strategy based on plan type
        const planType = deposit.planType as PlanType;
        const strategy = PlanStrategyFactory.getStrategy(planType);

        // Skip calculation if no strategy exists for this plan type
        if (!strategy) {
          return;
        }

        // Calculate interest using the selected strategy
        const interestAmount = strategy.calculateInterest(deposit);

        // Round to 2 decimal places for currency calculations
        const roundedInterestAmount = interestAmount.toDecimalPlaces(2);

        // Add the interest to the balance
        deposit.balance = deposit.balance.plus(roundedInterestAmount);
      } catch (error) {
        console.error(
          `Error calculating interest for deposit: ${deposit.id}`,
          error,
        );
        // In case of error, don't modify the deposit balance
      }
    });
  }
}
