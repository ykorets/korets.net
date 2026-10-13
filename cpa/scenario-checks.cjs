const assert=require('node:assert/strict');const C=require('./model');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-4,`${a} != ${b}`);
for(const key of Object.keys(C.presets)){
 const p=C.scenario(key),r=C.run(p),s=C.scaleSummary(p,r);let firms=0;
 for(const row of r.rows){firms+=row.newFirms;assert.equal(row.firms,firms);near(row.cash,row.openingCash+row.equityIn+row.firmEbitda-row.downPayment-row.closingCosts-row.overhead-row.cac-row.service-row.distribution);near(row.purchasePrice,row.downPayment+row.bankDraw+row.sellerDraw);near(row.service,row.interestPaid+row.principalPaid);if(row.month<=24)near(row.overhead,key==='down'&&row.month>=20?15000:25000);else near(row.overhead,C.overhead(p,row.month,row.firms));if(row.month<=24)assert.equal(row.bankDraw,0);}
 assert.equal(s.clients,Math.ceil(r.end.revenue/p.clientRevenue));
 if(r.returnsAvailable){near(r.equity,Math.max(0,r.ev-r.end.debt+r.end.cash));near(r.stake,.5);}
 for(let year=0;year<p.years;year++){const bought=r.rows.filter(x=>x.month>year*12&&x.month<=(year+1)*12).reduce((sum,x)=>sum+x.newFirms,0);assert.ok(bought<=(year<2?p.deals:p.scaleDeals||p.deals));}
}
const p=C.scenario('unicorn'),r=C.run(p),s=C.scaleSummary(p,r);assert.equal(r.failed,null);assert.ok(r.returnsAvailable);assert.equal(r.end.firms,89);assert.equal(s.firstBillion,106);const multi=C.run({...p,scaleDeals:30});assert.ok(multi.rows.some(x=>x.newFirms>1));assert.ok(r.equity>=1e9);assert.ok(r.end.ebitda*8-r.end.debt+r.end.cash<1e9);
assert.ok(r.rows[104].ebitda*p.multiple-r.rows[104].debt+r.rows[104].cash<1e9);assert.ok(s.hit.ebitda*p.multiple-s.hit.debt+s.hit.cash>=1e9);
assert.equal(s.laterCapital,5000000);assert.equal(r.investorReturnsAvailable,false);assert.equal(r.total,null);assert.equal(r.moic,null);assert.equal(r.irr,null);
near(s.requiredEbitda*p.multiple-r.end.debt+r.end.cash,1e9);
const baseFeeOnly=C.run({...p,clientRevenue:3600});near(baseFeeOnly.equity,r.equity);assert.equal(C.scaleSummary({...p,clientRevenue:3600},baseFeeOnly).clients,Math.ceil(r.end.revenue/3600));
const down=C.run(C.scenario('down'));assert.equal(down.failed,null);assert.equal(down.rows.length,120);assert.equal(down.fundingComplete,true);assert.equal(down.investorReturnsAvailable,true);assert.equal(down.end.firms,14);assert.ok(down.rows.every(x=>x.cash>0));assert.ok(down.minCash>100000);near(down.moic,3.2944582624108225);
const severe=C.run({...C.scenario('down'),hqAfter:25000});assert.equal(severe.failed,72);assert.equal(severe.investorReturnsAvailable,false);
assert.equal(C.scaleSummary(C.scenario('down'),down).firstBillion,null);
const partial=C.scenario('base');partial.years=99;assert.equal(C.scenario('base').years,10);
console.log('All five presets: cash conservation, multi-deal monthly scheduling, capacity limits, scale overhead, client estimates, first $1B equity crossing, valuation sensitivity and growth-capital funding passed.');

assert.equal(C.defaults.clientRevenue,5000);assert.equal(Math.ceil(C.defaults.rev/C.defaults.clientRevenue),110);assert.equal(s.clients,55586);assert.equal(Math.ceil(s.hit.revenue/p.clientRevenue),43157);

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

for(const key of Object.keys(C.presets)){const p=C.scenario(key),r=C.run(p);assert.equal(p.years,10);assert.equal(r.rows.length,120);assert.equal(r.rows.at(-1).month,120);}

const growthBase=C.run(C.scenario('base'));assert.equal(growthBase.end.firms,43);near(growthBase.end.revenue,92992541.25976785);near(growthBase.laterCapital,2500000);assert.equal(growthBase.investorReturnsAvailable,false);assert.equal(growthBase.rows[23].firms,4);assert.equal(growthBase.rows.filter(x=>x.distribution>0).length,0);

// A new cohort size does not rewrite existing firms or change launch financing.
const bp=C.scenario('base'),br=C.run(bp),old=C.run({...C.defaults,years:10});
assert.deepEqual(br.rows.slice(0,24),old.rows.slice(0,24));
for(const row of br.rows.filter(x=>x.newFirms)){near(row.purchasePrice/row.newFirms,row.month<=24?550000:2500000);}
const held={...bp,deals:1,scaleDeals:1,capital:10000000,tranches:false};
const a=C.run({...held,years:2}),b=C.run({...held,years:2,revAfter:4000000,targetAfter:25,priceAfter:2});assert.deepEqual(a.rows,b.rows);
near(br.end.ebitda,32403774.63701281);assert.ok(br.rows.slice(-12).reduce((s,x)=>s+x.operatingSurplus-x.service,0)>0);

// Venture buys integration capacity; it must not rewrite launch, organic growth or margins.
const vp=C.scenario('venture'),vr=C.run(vp),va=C.ventureAnalysis();
assert.deepEqual(vr.rows.slice(0,24),br.rows.slice(0,24));
for(const k of ['growth','churn','targetAfter','revAfter','priceAfter'])assert.equal(vp[k],bp[k]);
assert.equal(vr.rows[24].equityIn,25000000);assert.equal(vr.laterCapital,25000000);assert.equal(vr.investorReturnsAvailable,false);assert.equal(vr.end.firms,145);near(vr.end.revenue,334370992.4211697);near(vr.end.ebitda,114151923.03530635);
const bridge=va.capitalBridge;near(bridge.openingCash+bridge.equityReceived+bridge.cashAfterDebt-bridge.buyerPurchaseCash-bridge.closingCosts,bridge.closingCash);assert.equal(bridge.acquisitions,36);
for(const x of va.matureMarginSensitivity){near(x.platformEbitda,vr.end.revenue*x.practiceMargin/100-vr.end.overhead*12-vr.end.cac*12);assert.equal(x.revenueHeldFixed,vr.end.revenue);}near(va.matureMarginSensitivity[2].practiceCostPerClient,1000);
assert.equal(va.paths.find(x=>x.id==='capital-only').inputs.scaleDeals,6);
console.log('Venture launch preservation, explicit capital, earned cash bridge and static AI sensitivity passed.');

// Exit valuation must not change operating cash flows or the acquisition path.
assert.equal(vp.multiple,9);assert.equal(bp.multiple,8);
const vr8=C.run({...vp,multiple:8}),vs=C.scaleSummary(vp,vr);assert.deepEqual(vr.rows,vr8.rows);near(vr.equity-vr8.equity,vr.end.ebitda);
assert.ok(vs.firstBillion);const prior=vr.rows[vs.firstBillion-2];assert.ok(prior.ebitda*9-prior.debt+prior.cash<1e9);assert.ok(vs.hit.ebitda*9-vs.hit.debt+vs.hit.cash>=1e9);
for(const x of va.valuationSensitivity){near(x.enterpriseValue,vr.end.ebitda*x.multiple);near(x.equityValue,x.enterpriseValue-x.debt+x.cash);near(x.equityValue,x.multiple===9?vr.equity:vr8.equity);}
console.log('Venture 9× equity bridge, 8× comparison, unchanged operations and first $1B month passed.');
