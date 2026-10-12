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
const funded=run({...defaults,raise:1000000,raiseMonth:12});assert.equal(funded.stake,.5);
assert.equal(funded.rows[11].equityIn-funded.rows[11].seedIn,1000000);
assert.equal(funded.returnsAvailable,true);assert.equal(funded.investorReturnsAvailable,false);
for(const key of ['dividends','exit','total','profit','moic','irr','flows'])assert.equal(funded[key],null);
assert.ok(funded.equity>0);
const afterHorizon=run({...defaults,raise:5000000,raiseMonth:121});assert.equal(afterHorizon.investorReturnsAvailable,true);assert.equal(afterHorizon.total,r.total);
assert.equal(run({...defaults,stake:10,post:1}).total,r.total); // Retired deal-term inputs cannot alter the illustration.
const failure=run({...defaults,hq:80000});assert.notEqual(failure.failed,null);assert.equal(failure.exit,0);assert.equal(failure.irr,null);
assert.equal(run({...defaults,capital:1000000,tranches:false,target:35,churn:14,growth:8,ramp:24,multiple:6,hq:25000,bankRate:18,deals:2}).failed,29);
assert.equal(run(defaults).total,r.total);
for(const changes of [{term:2},{term:10},{bankRate:0,sellerRate:0},{div:100},{growth:0,churn:30},{down1:100,down2:100},{years:2}]){
 const out=run({...defaults,...changes});for(const row of out.rows)for(const value of Object.values(row))assert.ok(Number.isFinite(value));assert.ok(out.rows.every(x=>x.debt>=0));
}
console.log('Illustrative participation, receipt reconciliation, timed IRR, zero-interest loan, amortization, later-funding return suppression, insolvency, downside and finite stress-case checks passed.');

assert.equal(r.initial,600000);assert.equal(r.fundedCapital,1500000);
assert.deepEqual(r.gates.map(g=>g.paid),[4,12]);
assert.ok(Math.abs(r.flows.reduce((s,v,i)=>s+v/(1+r.irr)**(i/12),0))<1e-5);
const partial=run({...defaults,entry:10,target:20});assert.equal(partial.fundingComplete,false);assert.equal(partial.moic,null);assert.equal(partial.irr,null);assert.equal(partial.exit,0);
console.log('Staged investment timing, incomplete funding, future funding boundaries and ignored legacy terms passed.');
