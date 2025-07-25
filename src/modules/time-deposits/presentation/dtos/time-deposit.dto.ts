import { Deposit } from '../../domain/models/deposit.model';
import { Decimal } from 'decimal.js';

/**
 * DTO for time deposit response
 * According to the requirements, the response should include:
 * - id
 * - planType
 * - balance
 * - days
 * - withdrawals
 */
export class TimeDepositDto {
  id: number;
  planType: string;
  balance: string; // Serialized as string for precise financial values
  days: number;
  withdrawals: WithdrawalDto[];

  static fromDomain(timeDeposit: Deposit): TimeDepositDto {
    const dto = new TimeDepositDto();
    dto.id = timeDeposit.id;
    dto.planType = timeDeposit.planType;
    dto.balance = timeDeposit.balance.toString(); // Convert Decimal to string for API response
    dto.days = timeDeposit.days;
    dto.withdrawals = timeDeposit.withdrawals?.map(withdrawal => {
      const dto = new WithdrawalDto();
      dto.id = withdrawal.id;
      // Safe conversion to string regardless of type
      dto.amount = withdrawal.amount instanceof Decimal 
        ? withdrawal.amount.toString() 
        : String(withdrawal.amount);
      dto.date = withdrawal.date;
      dto.timeDepositId = withdrawal.timeDepositId;
      return dto;
    }) || [];
    
    return dto;
  }
}

/**
 * DTO for withdrawal response
 */
export class WithdrawalDto {
  id: number;
  timeDepositId: number;
  amount: string; // Serialized as string for precise financial values
  date: Date;
}
