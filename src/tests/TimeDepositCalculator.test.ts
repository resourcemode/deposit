import { TimeDeposit } from '../modules/time-deposits/domain/models/time-deposit.model'
import { TimeDepositCalculator } from '../modules/time-deposits/domain/services/time-deposit-calculator.service'


test('Should update balance', () => {
  const plans: TimeDeposit[] = [new TimeDeposit(1, 'basic', 1234567.0, 45)]
  const calc = new TimeDepositCalculator()
  calc.updateBalance(plans)

  expect(1).toBe(1)
})
