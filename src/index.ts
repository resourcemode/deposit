import { TimeDeposit } from "./modules/time-deposits/domain/models/time-deposit.model";
import { TimeDepositCalculator } from "./modules/time-deposits/domain/services/time-deposit-calculator.service";

const calc = new TimeDepositCalculator();
const plans: TimeDeposit[] = [new TimeDeposit(1, "basic", 1234567.0, 45)];
const interest = calc.updateBalance(plans);
console.log({ interest });
