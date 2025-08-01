import { TimeDepositCalculator } from "../../../src/modules/time-deposits/domain/services/time-deposit-calculator.service";
import { TimeDeposit } from "../../../src/modules/time-deposits/domain/models/time-deposit.model";
import { PlanType } from "../../../src/modules/time-deposits/domain/models/plan.enum";
import { Decimal } from "decimal.js";

describe("TimeDepositCalculator", () => {
  let calculator: TimeDepositCalculator;

  beforeEach(() => {
    calculator = new TimeDepositCalculator();
  });

  describe("updateBalance", () => {
    it("should not apply interest for deposits with days <= 30", () => {
      // Arrange
      const deposit = new TimeDeposit(1, PlanType.BASIC, "1000", 30);
      const initialBalance = deposit.balance;

      // Act
      calculator.updateBalance([deposit]);

      // Assert
      expect(deposit.balance.equals(initialBalance)).toBeTruthy();
    });

    it("should apply 1% annual interest (monthly) for basic plan with > 30 days", () => {
      // Arrange
      const deposit = new TimeDeposit(1, PlanType.BASIC, "1000", 31);

      // Act
      calculator.updateBalance([deposit]);

      // Assert
      // Formula-based calculation: principal * (annual_rate / 100 / 12)
      const principal = new Decimal("1000");
      const annualRate = 1; // 1% for BASIC plan
      const monthlyInterest = principal
        .mul(new Decimal(annualRate).div(100).div(12))
        .toDecimalPlaces(2);
      const expectedBalance = principal.plus(monthlyInterest);

      expect(deposit.balance.equals(expectedBalance)).toBeTruthy();
      // Calculate value for documentation: 1000 * 0.01 / 12 = 0.833... → 0.83 → 1000.83
      expect(deposit.balance.toString()).toEqual("1000.83");
    });

    it("should apply 5% annual interest (monthly) for premium plan with > 45 days", () => {
      // Arrange
      const deposit = new TimeDeposit(1, PlanType.PREMIUM, "1000", 46);

      // Act
      calculator.updateBalance([deposit]);

      // Assert
      // Formula-based calculation: principal * (annual_rate / 100 / 12)
      const principal = new Decimal("1000");
      const annualRate = 5; // 5% for PREMIUM plan
      const monthlyInterest = principal
        .mul(new Decimal(annualRate).div(100).div(12))
        .toDecimalPlaces(2);
      const expectedBalance = principal.plus(monthlyInterest);

      expect(deposit.balance.equals(expectedBalance)).toBeTruthy();
      // Calculate value for documentation: 1000 * 0.05 / 12 = 4.166... → 4.17 → 1004.17
      expect(deposit.balance.toString()).toEqual("1004.17");
    });

    it("should not apply interest for premium plan with <= 45 days", () => {
      // Arrange
      const deposit = new TimeDeposit(1, PlanType.PREMIUM, "1000", 45);
      const initialBalance = deposit.balance;

      // Act
      calculator.updateBalance([deposit]);

      // Assert
      expect(deposit.balance.equals(initialBalance)).toBeTruthy();
    });

    it("should apply 3% annual interest (monthly) for student plan with > 30 days and < 366 days", () => {
      // Arrange
      const deposit = new TimeDeposit(1, PlanType.STUDENT, "1000", 365);

      // Act
      calculator.updateBalance([deposit]);

      // Assert
      // Formula-based calculation: principal * (annual_rate / 100 / 12)
      const principal = new Decimal("1000");
      const annualRate = 3; // 3% for STUDENT plan
      const monthlyInterest = principal
        .mul(new Decimal(annualRate).div(100).div(12))
        .toDecimalPlaces(2);
      const expectedBalance = principal.plus(monthlyInterest);

      expect(deposit.balance.equals(expectedBalance)).toBeTruthy();
      // Calculate value for documentation: 1000 * 0.03 / 12 = 2.5 → 2.50 → 1002.50
      expect(deposit.balance.toString()).toEqual("1002.5");
    });

    it("should not apply interest for student plan with >= 366 days", () => {
      // Arrange
      const deposit = new TimeDeposit(1, PlanType.STUDENT, "1000", 366);
      const initialBalance = deposit.balance;

      // Act
      calculator.updateBalance([deposit]);

      // Assert
      expect(deposit.balance.equals(initialBalance)).toBeTruthy();
    });

    it("should handle multiple deposits correctly", () => {
      // Arrange
      const deposits = [
        new TimeDeposit(1, PlanType.BASIC, "1000", 31),
        new TimeDeposit(2, PlanType.PREMIUM, "2000", 46),
        new TimeDeposit(3, PlanType.STUDENT, "3000", 60),
        new TimeDeposit(4, PlanType.BASIC, "4000", 30), // No interest case
      ];

      // Act
      calculator.updateBalance(deposits);

      // Assert
      // Basic plan (1%): 1000 * 0.01 / 12 = 0.833... rounded to 2 decimal places = 0.83
      const basicInterest = new Decimal("1000")
        .mul(new Decimal("0.01").div(12))
        .toDecimalPlaces(2);
      expect(
        deposits[0].balance.equals(new Decimal("1000").plus(basicInterest)),
      ).toBeTruthy();

      // Premium plan (5%): 2000 * 0.05 / 12 = 8.333... rounded to 2 decimal places = 8.33
      const premiumInterest = new Decimal("2000")
        .mul(new Decimal("0.05").div(12))
        .toDecimalPlaces(2);
      expect(
        deposits[1].balance.equals(new Decimal("2000").plus(premiumInterest)),
      ).toBeTruthy();

      // Student plan (3%): 3000 * 0.03 / 12 = 7.5 rounded to 2 decimal places = 7.50
      const studentInterest = new Decimal("3000")
        .mul(new Decimal("0.03").div(12))
        .toDecimalPlaces(2);
      expect(
        deposits[2].balance.equals(new Decimal("3000").plus(studentInterest)),
      ).toBeTruthy();

      // No interest for deposit with <= 30 days
      expect(deposits[3].balance.equals(new Decimal("4000"))).toBeTruthy();
    });

    it("should not apply interest for unknown plan types", () => {
      // Arrange
      const deposit = new TimeDeposit(1, "unknown-plan", "1000", 100);
      const initialBalance = deposit.balance;

      // Act
      calculator.updateBalance([deposit]);

      // Assert
      expect(deposit.balance.equals(initialBalance)).toBeTruthy();
    });
  });
});
