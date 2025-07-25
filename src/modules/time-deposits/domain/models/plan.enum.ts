/**
 * Enum for different plan types
 */
export enum PlanType {
  // Database/seeder plan types
  A = 'A',
  B = 'B',
  C = 'C',
  
  // Business logic plan types
  BASIC = 'basic',
  PREMIUM = 'premium',
  STUDENT = 'student',
}

/**
 * Interest rates by plan type
 */
export const ANNUAL_INTEREST_RATES = {
  [PlanType.BASIC]: 0.01,   // 1% annual interest
  [PlanType.PREMIUM]: 0.05, // 5% annual interest
  [PlanType.STUDENT]: 0.03, // 3% annual interest
};

/**
 * Minimum days required for interest calculation
 */
export const MIN_DAYS_FOR_INTEREST = 30;

/**
 * Additional day requirements by plan type
 */
export const PLAN_DAY_REQUIREMENTS = {
  [PlanType.PREMIUM]: 45,     // Premium plans need > 45 days
  [PlanType.STUDENT]: 366,    // Student plans need < 366 days
};
