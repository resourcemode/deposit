import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Decimal } from 'decimal.js';

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  timeDepositId: number;

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
  amount: Decimal;

  @Column({ type: 'timestamp', nullable: false })
  date: Date;

  @ManyToOne('TimeDepositEntity', 'withdrawals')
  @JoinColumn({ name: 'timeDepositId' })
  timeDeposit: any;
}
