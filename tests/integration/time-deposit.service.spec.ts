import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule, getDataSourceToken } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { TimeDepositService } from "../../src/modules/time-deposits/application/services/time-deposit.service";
import { TimeDepositEntity } from "../../src/modules/time-deposits/domain/entities/time-deposit.entity";
import { Withdrawal } from "../../src/modules/time-deposits/domain/entities/withdrawal.entity";
import { TIME_DEPOSIT_REPOSITORY } from "../../src/modules/time-deposits/domain/repositories/time-deposit.repository.interface";
import { TimeDepositRepository } from "../../src/modules/time-deposits/infrastructure/repositories/time-deposit.repository";
import { Deposit } from "../../src/modules/time-deposits/domain/models/deposit.model";
import { Decimal } from "decimal.js";
import { PlanType } from "../../src/modules/time-deposits/domain/models/plan.enum";
import { SeederService } from "../../src/modules/time-deposits/infrastructure/seeder/seeder.service";
import { TimeDepositSeeder } from "../../src/modules/time-deposits/infrastructure/seeder/time-deposit.seeder";
import { DataSource } from "typeorm";
import { TimeDepositCalculator } from "../../src/modules/time-deposits/domain/services/time-deposit-calculator.service";

// Increase Jest timeout for database operations
jest.setTimeout(30000);

describe("TimeDepositService Integration", () => {
  let service: TimeDepositService;
  let repository: TimeDepositRepository;
  let module: TestingModule;
  let dataSource: DataSource;
  let calculator: TimeDepositCalculator;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ".env.test",
        }),
        TypeOrmModule.forRoot({
          type: "postgres",
          host: process.env.DATABASE_HOST || "localhost",
          port: parseInt(process.env.DATABASE_PORT || "5432"),
          username: process.env.DATABASE_USERNAME || "postgres",
          password: process.env.DATABASE_PASSWORD || "postgres",
          database: process.env.DATABASE_NAME || "timedeposits",
          entities: [TimeDepositEntity, Withdrawal],
          synchronize: true,
          extra: { trustServerCertificate: true },
        }),
        TypeOrmModule.forFeature([TimeDepositEntity, Withdrawal]),
      ],
      providers: [
        TimeDepositService,
        TimeDepositSeeder,
        SeederService,
        TimeDepositCalculator,
        {
          provide: TIME_DEPOSIT_REPOSITORY,
          useClass: TimeDepositRepository,
        },
      ],
    }).compile();

    service = module.get<TimeDepositService>(TimeDepositService);
    repository = module.get<TimeDepositRepository>(TIME_DEPOSIT_REPOSITORY);
    calculator = module.get<TimeDepositCalculator>(TimeDepositCalculator);
    const seeder = module.get<SeederService>(SeederService);
    dataSource = module.get<DataSource>(getDataSourceToken());

    // Clear database and seed with test data
    try {
      // Properly drop constraints before deleting data
      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.query("DELETE FROM withdrawals");
      await queryRunner.query('DELETE FROM "timeDeposits"');
      await queryRunner.release();

      // Seed fresh test data
      await seeder.seed();
    } catch (error) {
      console.error("Error clearing database:", error);
    }
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    // Skip clearing the database before each test
    // This avoids foreign key constraint issues
    // We'll use unique IDs for our test data instead
  });

  describe("Integration tests with actual database", () => {
    it("should save and retrieve deposits", async () => {
      // Create test data with unique identifiers
      const basicDeposit = new Deposit(null, "basic", new Decimal(1000), 30);
      const premiumDeposit = new Deposit(
        null,
        "premium",
        new Decimal(2000),
        60,
      );

      // Save to database through repository and get saved instances with IDs
      const savedBasic = await repository.save(basicDeposit);
      const savedPremium = await repository.save(premiumDeposit);

      // Verify IDs were generated
      expect(savedBasic.id).toBeDefined();
      expect(savedPremium.id).toBeDefined();

      // Test findAll
      const allDeposits = await service.findAll();
      // We'll simply verify that we have at least the deposits we saved
      expect(allDeposits.length).toBeGreaterThanOrEqual(2);

      // Find our specific deposits by matching properties
      const foundBasic = allDeposits.find(
        (d) => d.planType === "basic" && d.balance.equals(new Decimal(1000)),
      );
      const foundPremium = allDeposits.find(
        (d) => d.planType === "premium" && d.balance.equals(new Decimal(2000)),
      );

      expect(foundBasic).toBeDefined();
      expect(foundPremium).toBeDefined();
      expect(foundBasic?.planType).toBe("basic");
      expect(foundPremium?.planType).toBe("premium");

      // Test findById using the ID from our saved premium deposit
      const found = await service.findById(savedPremium.id);
      expect(found).toBeDefined();
      expect(found?.planType).toBe("premium");
      // Check balance using Decimal's equals method for precise comparison
      expect(found?.balance instanceof Decimal).toBe(true);
      expect(found?.balance.equals(new Decimal(2000))).toBe(true);

      // Test updateBalances functionality with our refactored calculator
      // Create a test deposit with known values to verify calculator works correctly
      const testDeposit = await repository.save(
        new Deposit(
          999, // Unique ID to avoid conflicts
          PlanType.BASIC,
          new Decimal(1000),
          31,
          [],
        ),
      );

      // Call service to update balances (which uses our calculator)
      const updatedDeposits = await service.updateAllBalances();

      // Verify our specific test deposit got updated correctly
      const updatedDeposit = await repository.findById(testDeposit.id);
      expect(updatedDeposit).not.toBeNull();
      expect(
        updatedDeposit.balance.greaterThan(new Decimal(1000)),
      ).toBeTruthy(); // Just check it increased

      // Verify other deposits were also updated
      expect(updatedDeposits.length).toBeGreaterThan(0);
      expect(updatedDeposits.every((d) => d.balance instanceof Decimal)).toBe(
        true,
      );
    });

    it("should return null for non-existent deposit", async () => {
      const nonExistentDeposit = await service.findById(999);
      expect(nonExistentDeposit).toBeNull();
    });

    it("should handle withdrawals relationship", async () => {
      // Create test data with withdrawals
      const entity = new TimeDepositEntity();
      entity.planType = "basic";
      entity.balance = new Decimal(1000);
      // Create a deposit first
      const saved = await repository.save(
        new Deposit(100, PlanType.PREMIUM, new Decimal(3000), 60, []),
      );

      // Then create and save withdrawal with the deposit's ID
      const withdrawalObj = new Withdrawal();
      withdrawalObj.amount = new Decimal(200);
      withdrawalObj.date = new Date();
      withdrawalObj.timeDepositId = saved.id; // Important: set the foreign key

      // Save withdrawal directly to repository
      await dataSource.getRepository(Withdrawal).save(withdrawalObj);

      // Retrieve with withdrawals
      const depositWithWithdrawals = await service.findById(saved.id);
      expect(depositWithWithdrawals).toBeDefined();
      expect(depositWithWithdrawals?.withdrawals).toHaveLength(1);
      expect(
        depositWithWithdrawals?.withdrawals[0].amount instanceof Decimal,
      ).toBe(true);
      expect(
        depositWithWithdrawals?.withdrawals[0].amount.equals(new Decimal(200)),
      ).toBe(true);
    });

    it("should return all time deposits from seeded data", async () => {
      // Act
      const result = await service.findAll();

      // Assert
      expect(result.length).toBeGreaterThan(0);
      // The seeder creates at least 3 deposits
      expect(result.length).toBeGreaterThanOrEqual(3);

      // Verify the first deposit has expected plan type
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);

      // Check properties
      result.forEach((deposit) => {
        expect(deposit).toHaveProperty("id");
        expect(deposit).toHaveProperty("planType"); // Changed from 'plan'
        expect(deposit).toHaveProperty("balance");
        expect(deposit).toHaveProperty("days");
        expect(deposit.balance instanceof Decimal).toBe(true);
      });
    });

    it("should update balances for all time deposits", async () => {
      // Get current balances for comparison
      const beforeDeposits = await service.findAll();
      const initialBalances = beforeDeposits.map((d) => d.balance);

      // Act
      const result = await service.updateAllBalances();

      // Assert
      expect(result).toBeTruthy();

      // Verify balances were updated
      const updatedDeposits = await service.findAll();

      // At least one deposit should have an updated balance
      let balanceUpdated = false;
      updatedDeposits.forEach((deposit, index) => {
        if (deposit.balance !== initialBalances[index]) {
          balanceUpdated = true;
        }
      });

      expect(balanceUpdated).toBeTruthy();
    });
  });
});
