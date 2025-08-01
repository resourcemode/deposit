import { Decimal } from "decimal.js";
import {
  ANNUAL_INTEREST_RATES,
  MIN_DAYS_FOR_INTEREST,
  PlanType,
} from "../models/plan.enum";
import { TimeDeposit } from "../models/time-deposit.model";
import { IPlanCalculationStrategy } from "./plan-calculation-strategy.interface";

/**
 * Basic plan calculation strategy
 * Implements the specific rules and calculations for Basic plans
 */
export class BasicPlanStrategy implements IPlanCalculationStrategy {
  /**
   * Calculates interest for a basic plan time deposit
   * Basic plans use 1% annual interest rate
   * @param deposit The time deposit to calculate interest for
   * @returns The calculated interest amount as a Decimal
   */
  calculateInterest(deposit: TimeDeposit): Decimal {
    if (!this.isEligibleForInterest(deposit)) {
      return new Decimal(0);
    }

    // Basic plan uses 1% annual rate
    const annualRate = ANNUAL_INTEREST_RATES[PlanType.BASIC];

    // Calculate monthly interest: principal * (annual_rate / 12)
    // Note: annualRate is already in decimal form (0.01 = 1%)
    const monthlyRate = new Decimal(annualRate).div(12);
    return deposit.balance.mul(monthlyRate).toDecimalPlaces(2);
  }

  /**
   * Determines if a basic plan deposit is eligible for interest
   * Basic plans just need to meet the minimum days requirement
   * @param deposit The time deposit to check eligibility for
   * @returns boolean indicating if deposit is eligible for interest
   */
  isEligibleForInterest(deposit: TimeDeposit): boolean {
    return deposit.days > MIN_DAYS_FOR_INTEREST;
  }
}
