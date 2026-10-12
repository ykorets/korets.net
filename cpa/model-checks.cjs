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
assert.equal(run({...defaults,capital:1000000,tranches:false,target:35,churn:14,growth:8,ramp:24,multiple:6,hq:25000,bankRate:18,deals:2}).failed,32);
assert.equal(run(defaults).total,r.total);
for(const changes of [{term:2},{term:10},{bankRate:0,sellerRate:0},{div:100},{growth:0,churn:30},{down1:100,down2:100},{years:2}]){
 const out=run({...defaults,...changes});for(const row of out.rows)for(const value of Object.values(row))assert.ok(Number.isFinite(value));assert.ok(out.rows.every(x=>x.debt>=0));
}
console.log('Ownership, allocation, timed IRR, zero-interest loan, amortization, dilution, insolvency, downside and finite stress-case checks passed.');

const {ownership,vested}=require('./model.js');
const cap=ownership(50,[{amount:3000000,post:7500000},{amount:1000000,post:10000000}]);
assert.deepEqual(cap.rows[1],{founder:30,seed:30,newInvestors:40});
assert.equal(cap.rows[2].founder,27);assert.equal(cap.capacity,40);
for(const row of cap.rows)assert.ok(Math.abs(row.founder+row.seed+row.newInvestors-100)<1e-8);
assert.throws(()=>ownership(50,[{amount:100,post:100}]));
assert.equal(vested(24,9,36,'after'),15/36);assert.equal(vested(45,9,36,'after'),1);
assert.equal(vested(11,9,36,'credit'),0);assert.equal(vested(12,9,36,'credit'),1/3);
assert.equal(vested(36,null,36,'credit'),0);assert.equal(vested(40,40,36,'credit'),1);
assert.equal(r.initial,600000);assert.equal(r.fundedCapital,1500000);
assert.deepEqual(r.gates.map(g=>g.paid),[4,15]);
assert.ok(Math.abs(r.flows.reduce((s,v,i)=>s+v/(1+r.irr)**(i/12),0))<1e-5);
const partial=run({...defaults,entry:10,target:20});assert.equal(partial.fundingComplete,false);assert.equal(partial.moic,null);assert.equal(partial.irr,null);assert.equal(partial.exit,0);
console.log('Staged investment timing, incomplete funding, two-round ownership conservation and both vesting interpretations passed.');
