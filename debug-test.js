const { Decimal } = require('decimal.js');

// Let's calculate what the actual values should be
console.log('=== DEBUGGING FORMULA CALCULATIONS ===');

// Basic plan: 1000 * (1 / 100 / 12)
const basicPrincipal = new Decimal('1000');
const basicRate = new Decimal('1').div(100).div(12);
const basicInterest = basicPrincipal.mul(basicRate).toDecimalPlaces(2);
const basicFinalBalance = basicPrincipal.plus(basicInterest);

console.log('Basic Plan (1% annual):');
console.log(`  Principal: ${basicPrincipal.toString()}`);
console.log(`  Monthly rate: ${basicRate.toString()}`);
console.log(`  Interest: ${basicInterest.toString()}`);
console.log(`  Final balance: ${basicFinalBalance.toString()}`);

// Premium plan: 2000 * (5 / 100 / 12)
const premiumPrincipal = new Decimal('2000');
const premiumRate = new Decimal('5').div(100).div(12);
const premiumInterest = premiumPrincipal.mul(premiumRate).toDecimalPlaces(2);
const premiumFinalBalance = premiumPrincipal.plus(premiumInterest);

console.log('\nPremium Plan (5% annual):');
console.log(`  Principal: ${premiumPrincipal.toString()}`);
console.log(`  Monthly rate: ${premiumRate.toString()}`);
console.log(`  Interest: ${premiumInterest.toString()}`);
console.log(`  Final balance: ${premiumFinalBalance.toString()}`);

// Student plan: 500 * (3 / 100 / 12)
const studentPrincipal = new Decimal('500');
const studentRate = new Decimal('3').div(100).div(12);
const studentInterest = studentPrincipal.mul(studentRate).toDecimalPlaces(2);
const studentFinalBalance = studentPrincipal.plus(studentInterest);

console.log('\nStudent Plan (3% annual):');
console.log(`  Principal: ${studentPrincipal.toString()}`);
console.log(`  Monthly rate: ${studentRate.toString()}`);
console.log(`  Interest: ${studentInterest.toString()}`);
console.log(`  Final balance: ${studentFinalBalance.toString()}`);

console.log('\n=== EXPECTED TEST VALUES ===');
console.log(`Basic (1000): ${basicFinalBalance.toString()}`);
console.log(`Premium (2000): ${premiumFinalBalance.toString()}`);
console.log(`Student (500): ${studentFinalBalance.toString()}`);
