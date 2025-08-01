import { PlanType } from "../models/plan.enum";
import { BasicPlanStrategy } from "./basic-plan-strategy";
import { IPlanCalculationStrategy } from "./plan-calculation-strategy.interface";
import { PremiumPlanStrategy } from "./premium-plan-strategy";
import { StudentPlanStrategy } from "./student-plan-strategy";

/**
 * Factory for creating plan-specific calculation strategies
 * Follows the Factory pattern to create the appropriate strategy based on plan type
 */
export class PlanStrategyFactory {
  /**
   * Returns the appropriate calculation strategy for the given plan type
   * @param planType The plan type to get a strategy for
   * @returns An implementation of IPlanCalculationStrategy for the given plan type
   * or null if no strategy is found for the plan type
   */
  static getStrategy(planType: PlanType): IPlanCalculationStrategy | null {
    switch (planType) {
      case PlanType.BASIC:
        return new BasicPlanStrategy();
      case PlanType.PREMIUM:
        return new PremiumPlanStrategy();
      case PlanType.STUDENT:
        return new StudentPlanStrategy();
      default:
        return null;
    }
  }
}
