import { Decimal } from "decimal.js";

/**
 * Original TimeDeposit model
 * This is the core domain model for TimeDeposit
 */
export class TimeDeposit {
  public id: number;
  public planType: string;
  public balance: Decimal;
  public days: number;

  constructor(
    id: number,
    planType: string,
    balance: number | string | Decimal,
    days: number,
  ) {
    this.id = id;
    this.planType = planType;
    // Convert to Decimal for precise financial calculations
    this.balance = balance instanceof Decimal ? balance : new Decimal(balance);
    this.days = days;
  }

  /**
   * Helper method to get the balance as a regular number
   * @returns balance as a number with decimal precision
   */
  public getBalanceAsNumber(): number {
    return this.balance.toNumber();
  }

  /**
   * Helper method to get the balance as a string
   * @returns balance as a formatted string with 2 decimal places
   */
  public getBalanceAsString(): string {
    return this.balance.toFixed(2);
  }
}
