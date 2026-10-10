const assert=require('node:assert/strict');
const {run,defaults,irr,payment}=require('./model.js');
const r=run(defaults);
assert.equal(r.failed,null);assert.equal(r.stake,.5);
assert.ok(Math.abs(r.total-r.exit-r.dividends)<1e-6);
assert.ok(Math.abs(irr([-100,...Array(11).fill(0),110])-.1)<1e-8);
assert.equal(payment(60000,0,60),1000);
let balance=60000,rate=.01,pmt=payment(balance,rate,60);
for(let i=0;i<60;i++)balance=balance*(1+rate)-pmt;
assert.ok(Math.abs(balance)<1e-6);
const diluted=run({...defaults,raise:1000000,post:4000000,raiseMonth:12});assert.equal(diluted.stake,.375);
const failure=run({...defaults,hq:80000});assert.notEqual(failure.failed,null);assert.equal(failure.exit,0);assert.equal(failure.irr,null);
assert.equal(run({...defaults,target:35,churn:14,growth:8,ramp:24,multiple:6,hq:25000,bankRate:18,deals:2}).failed,32);
assert.equal(run(defaults).total,r.total);
for(const changes of [{term:2},{term:10},{bankRate:0,sellerRate:0},{div:100},{growth:0,churn:30},{down1:100,down2:100},{years:2}]){
 const out=run({...defaults,...changes});for(const row of out.rows)for(const value of Object.values(row))assert.ok(Number.isFinite(value));assert.ok(out.rows.every(x=>x.debt>=0));
}
console.log('Ownership, allocation, timed IRR, zero-interest loan, amortization, dilution, insolvency, downside and finite stress-case checks passed.');
