const assert=require('node:assert/strict');const C=require('./model');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-4,`${a} != ${b}`);
for(const key of Object.keys(C.presets)){
 const p=C.scenario(key),r=C.run(p),s=C.scaleSummary(p,r);let firms=0;
 for(const row of r.rows){firms+=row.newFirms;assert.equal(row.firms,firms);near(row.cash,row.openingCash+row.equityIn+row.firmEbitda-row.downPayment-row.closingCosts-row.overhead-row.cac-row.service-row.distribution);near(row.purchasePrice,row.downPayment+row.bankDraw+row.sellerDraw);near(row.service,row.interestPaid+row.principalPaid);if(row.month<=24)near(row.overhead,key==='down'&&row.month>=20?15000:25000);else near(row.overhead,C.overhead(p,row.month,row.firms));if(row.month<=24)assert.equal(row.bankDraw,0);}
 assert.equal(s.clients,Math.ceil(r.end.revenue/p.clientRevenue));
 if(r.returnsAvailable){near(r.equity,Math.max(0,r.ev-r.end.debt+r.end.cash));near(r.stake,.5);}
 for(let year=0;year<p.years;year++){const bought=r.rows.filter(x=>x.month>year*12&&x.month<=(year+1)*12).reduce((sum,x)=>sum+x.newFirms,0);assert.ok(bought<=(year<2?p.deals:p.scaleDeals||p.deals));}
}
const p=C.scenario('unicorn'),r=C.run(p),s=C.scaleSummary(p,r);assert.equal(r.failed,null);assert.ok(r.returnsAvailable);assert.equal(r.end.firms,244);assert.equal(s.firstBillion,113);assert.ok(r.rows.some(x=>x.newFirms>1));assert.ok(r.equity>=1e9);assert.ok(r.end.ebitda*8-r.end.debt+r.end.cash<1e9);
assert.ok(r.rows[111].ebitda*p.multiple-r.rows[111].debt+r.rows[111].cash<1e9);assert.ok(s.hit.ebitda*p.multiple-s.hit.debt+s.hit.cash>=1e9);
assert.equal(s.laterCapital,5000000);assert.equal(r.investorReturnsAvailable,false);assert.equal(r.total,null);assert.equal(r.moic,null);assert.equal(r.irr,null);
near(s.requiredEbitda*p.multiple-r.end.debt+r.end.cash,1e9);
const baseFeeOnly=C.run({...p,clientRevenue:3600});near(baseFeeOnly.equity,r.equity);assert.equal(C.scaleSummary({...p,clientRevenue:3600},baseFeeOnly).clients,Math.ceil(r.end.revenue/3600));
const down=C.run(C.scenario('down'));assert.equal(down.failed,null);assert.equal(down.rows.length,96);assert.equal(down.fundingComplete,true);assert.equal(down.investorReturnsAvailable,true);assert.equal(down.end.firms,10);assert.ok(down.rows.every(x=>x.cash>0));assert.ok(down.minCash>100000);near(down.moic,2.0882824946512653);
const severe=C.run({...C.scenario('down'),hqAfter:25000});assert.equal(severe.failed,72);assert.equal(severe.investorReturnsAvailable,false);
assert.equal(C.scaleSummary(C.scenario('down'),down).firstBillion,null);
const partial=C.scenario('base');partial.years=99;assert.equal(C.scenario('base').years,8);
console.log('All four presets: cash conservation, multi-deal monthly scheduling, capacity limits, scale overhead, client estimates, first $1B equity crossing, valuation sensitivity and growth-capital funding passed.');

assert.equal(C.defaults.clientRevenue,5000);assert.equal(Math.ceil(C.defaults.rev/C.defaults.clientRevenue),110);assert.equal(s.clients,45260);assert.equal(Math.ceil(s.hit.revenue/p.clientRevenue),40312);

// Every preset keeps seller debt at 50% and observes the two funding phases.
for(const key of Object.keys(C.presets)){
 const p=C.scenario(key),r=C.run(p);
 for(const row of r.rows){
  near(row.sellerDraw,row.purchasePrice*.5);
  near(row.downPayment,row.purchasePrice*(row.month<Math.max(25,p.creditMonth)?.5:.2));
  near(row.bankDraw,row.purchasePrice*(row.month<Math.max(25,p.creditMonth)?0:.3));
 }
}

// The launch central budget includes support for initial acquisitions; Pessimistic reduces its base from M20; per-firm costs still start M25.
for(const key of Object.keys(C.presets)){const p=C.scenario(key),r=C.run(p);near(r.rows.slice(0,24).reduce((sum,x)=>sum+x.overhead,0),key==='down'?550000:600000);}
const dp=C.scenario("down");near(C.overhead(dp,19,2),25000);near(C.overhead(dp,20,2),15000);near(C.overhead(dp,24,2),15000);near(C.overhead(dp,25,2),16000);near(C.overhead(dp,36,2),16000);near(C.overhead(dp,37,2),17500);assert.equal(down.rows.filter(x=>x.cash<x.reserve).length,1);

// Earlier savings preserve the launch acquisitions and add exactly $50K to M24 cash.
const laterCut=C.run({...dp,hqChangeMonth:25});
near(down.rows[23].cash-laterCut.rows[23].cash,50000);
assert.equal(down.rows[23].firms,laterCut.rows[23].firms);
assert.deepEqual(down.rows.filter(x=>x.cash<x.reserve).map(x=>x.month),[19]);
