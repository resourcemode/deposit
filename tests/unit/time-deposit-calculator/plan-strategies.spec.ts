import { Decimal } from "decimal.js";
import { TimeDeposit } from "../../../src/modules/time-deposits/domain/models/time-deposit.model";
import { PlanType } from "../../../src/modules/time-deposits/domain/models/plan.enum";
import { BasicPlanStrategy } from "../../../src/modules/time-deposits/domain/strategies/basic-plan-strategy";
import { PremiumPlanStrategy } from "../../../src/modules/time-deposits/domain/strategies/premium-plan-strategy";
import { StudentPlanStrategy } from "../../../src/modules/time-deposits/domain/strategies/student-plan-strategy";
import { PlanStrategyFactory } from "../../../src/modules/time-deposits/domain/strategies/plan-strategy-factory";
import { TimeDepositCalculator } from "../../../src/modules/time-deposits/domain/services/time-deposit-calculator.service";

describe("Plan Strategy Tests", () => {
  describe("BasicPlanStrategy", () => {
    const strategy = new BasicPlanStrategy();

    it("should apply interest for deposits with > 30 days", () => {
      const deposit = new TimeDeposit(
        1,
        PlanType.BASIC,
        new Decimal("1000"),
        31,
      );
      const interest = strategy.calculateInterest(deposit);

      // Formula-based calculation: principal * (annual_rate / 12)
      // 1000 * (0.01 / 12) = 1000 * 0.000833... = 0.833... → 0.83
      const expectedInterest = new Decimal("1000")
        .mul(new Decimal("0.01").div(12))
        .toDecimalPlaces(2);
      expect(interest.equals(expectedInterest)).toBeTruthy();
      expect(interest.toString()).toEqual("0.83");
    });

    it("should not apply interest for deposits with <= 30 days", () => {
      const deposit = new TimeDeposit(
        1,
        PlanType.BASIC,
        new Decimal("1000"),
        30,
      );
      const interest = strategy.calculateInterest(deposit);

      expect(interest.toNumber()).toBe(0);
    });
  });

  describe("PremiumPlanStrategy", () => {
    const strategy = new PremiumPlanStrategy();

    it("should apply interest for deposits with > 45 days", () => {
      const deposit = new TimeDeposit(
        1,
        PlanType.PREMIUM,
        new Decimal("1000"),
        46,
      );
      const interest = strategy.calculateInterest(deposit);

      // Formula-based calculation: principal * (annual_rate / 12)
      // 1000 * (0.05 / 12) = 1000 * 0.004166... = 4.166... → 4.17
      const expectedInterest = new Decimal("1000")
        .mul(new Decimal("0.05").div(12))
        .toDecimalPlaces(2);
      expect(interest.equals(expectedInterest)).toBeTruthy();
      expect(interest.toString()).toEqual("4.17");
    });

    it("should not apply interest for deposits with <= 45 days", () => {
      const deposit = new TimeDeposit(
        1,
        PlanType.PREMIUM,
        new Decimal("1000"),
        45,
      );
      const interest = strategy.calculateInterest(deposit);

      expect(interest.toNumber()).toBe(0);
    });
  });

  describe("StudentPlanStrategy", () => {
    const strategy = new StudentPlanStrategy();

    it("should apply interest for deposits with > 30 days and < 366 days", () => {
      const deposit = new TimeDeposit(
        1,
        PlanType.STUDENT,
        new Decimal("1000"),
        100,
      );
      const interest = strategy.calculateInterest(deposit);

      // Formula-based calculation: principal * (annual_rate / 12)
      // 1000 * (0.03 / 12) = 1000 * 0.0025 = 2.5 → 2.50
      const expectedInterest = new Decimal("1000")
        .mul(new Decimal("0.03").div(12))
        .toDecimalPlaces(2);
      expect(interest.equals(expectedInterest)).toBeTruthy();
      expect(interest.toString()).toEqual("2.5");
    });

    it("should not apply interest for deposits with >= 366 days", () => {
      const deposit = new TimeDeposit(
        1,
        PlanType.STUDENT,
        new Decimal("1000"),
        366,
      );
      const interest = strategy.calculateInterest(deposit);

      expect(interest.toNumber()).toBe(0);
    });

    it("should not apply interest for deposits with <= 30 days", () => {
      const deposit = new TimeDeposit(
        1,
        PlanType.STUDENT,
        new Decimal("1000"),
        30,
      );
      const interest = strategy.calculateInterest(deposit);

      expect(interest.toNumber()).toBe(0);
    });
  });

  describe("PlanStrategyFactory", () => {
    it("should return BasicPlanStrategy for BASIC plan type", () => {
      const strategy = PlanStrategyFactory.getStrategy(PlanType.BASIC);
      expect(strategy).toBeInstanceOf(BasicPlanStrategy);
    });

    it("should return PremiumPlanStrategy for PREMIUM plan type", () => {
      const strategy = PlanStrategyFactory.getStrategy(PlanType.PREMIUM);
      expect(strategy).toBeInstanceOf(PremiumPlanStrategy);
    });

    it("should return StudentPlanStrategy for STUDENT plan type", () => {
      const strategy = PlanStrategyFactory.getStrategy(PlanType.STUDENT);
      expect(strategy).toBeInstanceOf(StudentPlanStrategy);
    });

    it("should return null for unknown plan type", () => {
      // @ts-ignore - Testing invalid input
      const strategy = PlanStrategyFactory.getStrategy("unknown");
      expect(strategy).toBeNull();
    });
  });

  describe("TimeDepositCalculator with Strategies", () => {
    it("should update balances for multiple deposits of different plan types", () => {
      const calculator = new TimeDepositCalculator();
      const deposits = [
        new TimeDeposit(1, PlanType.BASIC, new Decimal("1000"), 31),
        new TimeDeposit(2, PlanType.PREMIUM, new Decimal("2000"), 60),
        new TimeDeposit(3, PlanType.STUDENT, new Decimal("500"), 100),
        new TimeDeposit(4, PlanType.BASIC, new Decimal("1500"), 30), // No interest case
      ];

      // Get initial balances for comparison
      const initialBalances = deposits.map((d) => d.balance.toString());

      // Update balances
      calculator.updateBalance(deposits);

      // Check basic plan with > 30 days gets interest
      expect(
        deposits[0].balance.greaterThan(new Decimal(initialBalances[0])),
      ).toBeTruthy();
      // Formula: 1000 * (0.01 / 12) = 0.83
      const basicInterest = new Decimal("1000")
        .mul(new Decimal("0.01").div(12))
        .toDecimalPlaces(2);
      expect(
        deposits[0].balance.equals(new Decimal("1000").plus(basicInterest)),
      ).toBeTruthy();

      // Check premium plan gets interest
      expect(
        deposits[1].balance.greaterThan(new Decimal(initialBalances[1])),
      ).toBeTruthy();
      // Formula: 2000 * (0.05 / 12) = 8.33
      const premiumInterest = new Decimal("2000")
        .mul(new Decimal("0.05").div(12))
        .toDecimalPlaces(2);
      expect(
        deposits[1].balance.equals(new Decimal("2000").plus(premiumInterest)),
      ).toBeTruthy();

      // Check student plan gets interest
      expect(
        deposits[2].balance.greaterThan(new Decimal(initialBalances[2])),
      ).toBeTruthy();
      // Formula: 500 * (0.03 / 12) = 1.25
      const studentInterest = new Decimal("500")
        .mul(new Decimal("0.03").div(12))
        .toDecimalPlaces(2);
      expect(
        deposits[2].balance.equals(new Decimal("500").plus(studentInterest)),
      ).toBeTruthy();

      // Check basic plan with <= 30 days doesn't get interest
      expect(
        deposits[3].balance.equals(new Decimal(initialBalances[3])),
      ).toBeTruthy();
    });
  });
});
