import { Deposit } from '../models/deposit.model';

export const TIME_DEPOSIT_REPOSITORY = 'TIME_DEPOSIT_REPOSITORY';

export interface ITimeDepositRepository {
  findAll(): Promise<Deposit[]>;
  findById(id: number): Promise<Deposit | null>;
  save(timeDeposit: Deposit): Promise<Deposit>;
  saveMany(timeDeposits: Deposit[]): Promise<Deposit[]>;
  updateAll(): Promise<Deposit[]>;
}
