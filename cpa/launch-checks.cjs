const assert=require('node:assert/strict');
const {run,launch,defaults}=require('./model.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`);
const scenarios=[defaults,{...defaults,deals:1},{...defaults,deals:16},{...defaults,hq:80000},{...defaults,down1:100},{...defaults,sellerRate:0},{...defaults,entry:10,target:20,growth:0,churn:30},{...defaults,creditMonth:1}];
for(const p of scenarios){const plan=launch(p);
 for(const key of ['upfront','staged','delayed','fundedSchedule']){const r=plan[key];let previous=r.initial,totalReceived=r.initial;
  for(const x of r.rows){near(x.openingCash,previous);near(x.cash,x.openingCash+x.equityIn+x.firmEbitda-x.downPayment-x.closingCosts-x.overhead-x.cac-x.service-x.distribution);near(x.firmRevenue-x.firmOperatingCosts,x.firmEbitda);near(x.purchasePrice,x.downPayment+x.bankDraw+x.sellerDraw);near(x.service,x.principalPaid+x.interestPaid);assert.equal(x.bankDraw,0);for(const n of Object.values(x))assert.ok(Number.isFinite(n));totalReceived+=x.equityIn;previous=x.cash;}
  assert.ok(totalReceived<=r.initial+(r.gates.length?p.capital*.6:0)+1e-6);
  for(const g of r.gates){if(g.paid!==null){assert.ok(g.paid>g.earned);const prior=r.rows[g.earned-1];assert.ok(prior.firms>=g.firms);assert.ok(prior.firmEbitda>=prior.service*g.coverage);assert.ok(prior.firmEbitda*12>=prior.revenue*g.margin/100);assert.ok(r.rows[g.paid-1].equityIn>=g.amount);}}
 }
 assert.equal(plan.fundedSchedule.failed,null);assert.equal(plan.fundedSchedule.end.firms,plan.plannedFirms);
 assert.ok(plan.fundedSchedule.rows.every(r=>r.cash+1e-5>=r.reserve&&r.postAcquisitionCash+1e-5>=r.reserve));
}
const x=launch(defaults);assert.equal(x.upfront.end.firms,4);assert.equal(x.needed,1489863);near(x.upfront.end.cash,287665.5065744351);assert.deepEqual(x.staged.gates.map(g=>g.paid),[4,12]);assert.deepEqual(x.delayed.gates.map(g=>g.paid),[7,15]);assert.ok(x.delayed.minCash<x.staged.minCash);
const unmet=launch({...defaults,entry:10,target:20});assert.ok(unmet.staged.gates.some(g=>g.paid===null));
const bank=run({...defaults,capital:10000000,creditMonth:1});assert.ok(bank.rows.filter(r=>r.month<=24).every(r=>r.bankDraw===0));assert.ok(bank.rows.some(r=>r.month>=25&&r.bankDraw>0));
console.log('Launch cash conservation, funding sources, debt reconciliation, 24-month bank exclusion, prior-month KPI gates, delay stress, unfunded gates and full-pace capital requirement passed.');
