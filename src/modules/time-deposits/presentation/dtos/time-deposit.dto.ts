import { ApiProperty } from "@nestjs/swagger";
import { Deposit } from "../../domain/models/deposit.model";
import { Decimal } from "decimal.js";

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
  @ApiProperty({
    description: 'Unique identifier for the time deposit',
    example: 1,
    type: 'integer'
  })
  id: number;

  @ApiProperty({
    description: 'Plan type determining interest calculation strategy',
    example: 'BASIC',
    enum: ['BASIC', 'PREMIUM', 'STUDENT']
  })
  planType: string;

  @ApiProperty({
    description: 'Current balance of the time deposit (serialized as string for precision)',
    example: '1002.50',
    type: 'string'
  })
  balance: string; // Serialized as string for precise financial values

  @ApiProperty({
    description: 'Number of days since deposit creation',
    example: 90,
    type: 'integer'
  })
  days: number;

  @ApiProperty({
    description: 'List of withdrawals made from this time deposit',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        timeDepositId: { type: 'integer', example: 1 },
        amount: { type: 'string', example: '100.00' },
        date: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' }
      }
    }
  })
  withdrawals: WithdrawalDto[];

  static fromDomain(timeDeposit: Deposit): TimeDepositDto {
    const dto = new TimeDepositDto();
    dto.id = timeDeposit.id;
    dto.planType = timeDeposit.planType;
    dto.balance = timeDeposit.balance.toString(); // Convert Decimal to string for API response
    dto.days = timeDeposit.days;
    dto.withdrawals =
      timeDeposit.withdrawals?.map((withdrawal) => {
        const dto = new WithdrawalDto();
        dto.id = withdrawal.id;
        // Safe conversion to string regardless of type
        dto.amount =
          withdrawal.amount instanceof Decimal
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
  @ApiProperty({
    description: 'Unique identifier for the withdrawal',
    example: 1,
    type: 'integer'
  })
  id: number;

  @ApiProperty({
    description: 'ID of the time deposit this withdrawal belongs to',
    example: 1,
    type: 'integer'
  })
  timeDepositId: number;

  @ApiProperty({
    description: 'Amount withdrawn (serialized as string for precision)',
    example: '100.00',
    type: 'string'
  })
  amount: string; // Serialized as string for precise financial values

  @ApiProperty({
    description: 'Date when the withdrawal was made',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  date: Date;
}
