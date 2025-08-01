import { Decimal } from "decimal.js";
import {
  ANNUAL_INTEREST_RATES,
  PLAN_DAY_REQUIREMENTS,
  PlanType,
} from "../models/plan.enum";
import { TimeDeposit } from "../models/time-deposit.model";
import { IPlanCalculationStrategy } from "./plan-calculation-strategy.interface";

/**
 * Student plan calculation strategy
 * Implements the specific rules and calculations for Student plans
 */
export class StudentPlanStrategy implements IPlanCalculationStrategy {
  /**
   * Calculates interest for a student plan time deposit
   * Student plans use 3% annual interest rate
   * @param deposit The time deposit to calculate interest for
   * @returns The calculated interest amount as a Decimal
   */
  calculateInterest(deposit: TimeDeposit): Decimal {
    if (!this.isEligibleForInterest(deposit)) {
      return new Decimal(0);
    }

    // Student plan uses 3% annual rate
    const annualRate = ANNUAL_INTEREST_RATES[PlanType.STUDENT];

    // Calculate monthly interest: principal * (annual_rate / 12)
    // Note: annualRate is already in decimal form (0.03 = 3%)
    const monthlyRate = new Decimal(annualRate).div(12);
    return deposit.balance.mul(monthlyRate).toDecimalPlaces(2);
  }

  /**
   * Determines if a student plan deposit is eligible for interest
   * Student plans need > 30 days but < 366 days to be eligible
   * @param deposit The time deposit to check eligibility for
   * @returns boolean indicating if deposit is eligible for interest
   */
  isEligibleForInterest(deposit: TimeDeposit): boolean {
    // Student plans need < 366 days and more than minimum days
    return (
      deposit.days < PLAN_DAY_REQUIREMENTS[PlanType.STUDENT] &&
      deposit.days > 30
    ); // Minimum days requirement
  }
}
