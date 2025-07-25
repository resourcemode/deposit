import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Decimal } from 'decimal.js';

@Entity('timeDeposits')
export class TimeDepositEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  planType: string;

  @Column({ type: 'integer', nullable: false })
  days: number;

  @Column({
    type: 'numeric',
    precision: 20, // Higher precision for large numbers
    scale: 6,     // Higher scale for more decimal places
    nullable: false,
    transformer: {
      to: (value: Decimal) => value ? value.toString() : '0',
      from: (value: string) => value ? new Decimal(value) : new Decimal(0),
    },
  })
  balance: Decimal;

  @OneToMany('Withdrawal', 'timeDeposit')
  withdrawals: any[];
}
