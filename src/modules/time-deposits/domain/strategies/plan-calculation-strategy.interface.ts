import { Decimal } from "decimal.js";
import { TimeDeposit } from "../models/time-deposit.model";

/**
 * Interface for different plan calculation strategies
 * Follows the Strategy pattern to make calculation logic extensible
 */
export interface IPlanCalculationStrategy {
  /**
   * Calculates interest for a time deposit
   * @param deposit The time deposit to calculate interest for
   * @returns The calculated interest amount as a Decimal
   */
  calculateInterest(deposit: TimeDeposit): Decimal;

  /**
   * Determines if a deposit is eligible for interest based on plan-specific rules
   * @param deposit The time deposit to check eligibility for
   * @returns boolean indicating if deposit is eligible for interest
   */
  isEligibleForInterest(deposit: TimeDeposit): boolean;
}
