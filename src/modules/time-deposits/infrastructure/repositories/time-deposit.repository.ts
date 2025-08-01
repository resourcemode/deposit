import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TimeDepositEntity } from "../../domain/entities/time-deposit.entity";
import { Deposit } from "../../domain/models/deposit.model";
import { ITimeDepositRepository } from "../../domain/repositories/time-deposit.repository.interface";
import { TimeDepositCalculator } from "../../domain/services/time-deposit-calculator.service";

@Injectable()
export class TimeDepositRepository implements ITimeDepositRepository {
  private timeDepositCalculator: TimeDepositCalculator;

  constructor(
    @InjectRepository(TimeDepositEntity)
    private timeDepositRepository: Repository<TimeDepositEntity>,
  ) {
    this.timeDepositCalculator = new TimeDepositCalculator();
  }

  async findAll(): Promise<Deposit[]> {
    const entities = await this.timeDepositRepository.find({
      relations: ["withdrawals"],
    });
    return entities.map((entity) => Deposit.fromEntity(entity));
  }

  async findById(id: number): Promise<Deposit | null> {
    const entity = await this.timeDepositRepository.findOne({
      where: { id },
      relations: ["withdrawals"],
    });

    if (!entity) {
      return null;
    }

    return Deposit.fromEntity(entity);
  }

  async save(timeDeposit: Deposit): Promise<Deposit> {
    const entity = this.timeDepositRepository.create(timeDeposit.toEntity());
    const savedEntity = await this.timeDepositRepository.save(entity);
    return Deposit.fromEntity(savedEntity);
  }

  async saveMany(timeDeposits: Deposit[]): Promise<Deposit[]> {
    // Convert domain models to entity objects
    const entityData = timeDeposits.map((timeDeposit) =>
      timeDeposit.toEntity(),
    );
    // Save entities and convert back to domain models
    const savedEntities = await this.timeDepositRepository.save(entityData);
    return savedEntities.map((entity) => Deposit.fromEntity(entity));
  }

  async updateAll(): Promise<Deposit[]> {
    // Get all time deposits
    const timeDeposits = await this.findAll();

    // Use the original TimeDepositCalculator to update balances
    // This adheres to the requirement not to modify the updateBalance method signature
    // The method is called as-is, maintaining compatibility
    this.timeDepositCalculator.updateBalance(timeDeposits);

    // Save the updated time deposits back to the database
    return await this.saveMany(timeDeposits);
  }
}
