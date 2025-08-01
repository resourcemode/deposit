import { Injectable, Logger } from "@nestjs/common";
import { TimeDepositSeeder } from "./time-deposit.seeder";

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly timeDepositSeeder: TimeDepositSeeder) {}

  async seed() {
    this.logger.log("Starting database seeding...");

    try {
      await this.timeDepositSeeder.seed();
      this.logger.log("Database seeding completed successfully");
    } catch (error) {
      this.logger.error("Database seeding failed", error);
      throw error;
    }
  }
}
