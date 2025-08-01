import { Decimal } from "decimal.js";
import {
  ANNUAL_INTEREST_RATES,
  PLAN_DAY_REQUIREMENTS,
  PlanType,
} from "../models/plan.enum";
import { TimeDeposit } from "../models/time-deposit.model";
import { IPlanCalculationStrategy } from "./plan-calculation-strategy.interface";

/**
 * Premium plan calculation strategy
 * Implements the specific rules and calculations for Premium plans
 */
export class PremiumPlanStrategy implements IPlanCalculationStrategy {
  /**
   * Calculates interest for a premium plan time deposit
   * Premium plans use 5% annual interest rate
   * @param deposit The time deposit to calculate interest for
   * @returns The calculated interest amount as a Decimal
   */
  calculateInterest(deposit: TimeDeposit): Decimal {
    if (!this.isEligibleForInterest(deposit)) {
      return new Decimal(0);
    }

    // Premium plan uses 5% annual rate
    const annualRate = ANNUAL_INTEREST_RATES[PlanType.PREMIUM];

    // Calculate monthly interest: principal * (annual_rate / 12)
    // Note: annualRate is already in decimal form (0.05 = 5%)
    const monthlyRate = new Decimal(annualRate).div(12);
    return deposit.balance.mul(monthlyRate).toDecimalPlaces(2);
  }

  /**
   * Determines if a premium plan deposit is eligible for interest
   * Premium plans need more than 45 days to be eligible
   * @param deposit The time deposit to check eligibility for
   * @returns boolean indicating if deposit is eligible for interest
   */
  isEligibleForInterest(deposit: TimeDeposit): boolean {
    return deposit.days > PLAN_DAY_REQUIREMENTS[PlanType.PREMIUM];
  }
}
