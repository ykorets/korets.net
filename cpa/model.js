(function(root){
const defaults={capital:1500000,tranches:true,clientRevenue:5000,scaleDeals:0,hqPerFirm:0,years:8,rev:550000,price:1,entry:25,target:45,ramp:12,churn:8,growth:12,cac:25,hq:20000,hqGrowth:10,deals:4,down1:50,down2:20,bank:30,creditMonth:25,bankRate:15,sellerRate:6,term:5,reserve:6,close:5,multiple:8,div:30,divStart:5,raise:0,raiseMonth:24};
// Scenario values are editable hypotheses, not market forecasts or agreed terms.
const presets={
 down:{name:'Pessimistic',changes:{target:35,churn:10,growth:8,ramp:24,multiple:6,hq:15000,bankRate:18,deals:2,creditMonth:37,hqPerFirm:500}},
 base:{name:'Base',changes:{}},
 up:{name:'Optimistic',changes:{target:50,churn:6,growth:15,ramp:9,multiple:10,deals:6,scaleDeals:12,hqPerFirm:500,div:15}},
 unicorn:{name:'Unicorn',changes:{years:10,deals:4,scaleDeals:30,hqPerFirm:1000,growth:18,churn:6,target:45,multiple:12,div:0,raise:5000000,raiseMonth:25}}
};
function scenario(key){if(!presets[key])throw new Error('Unknown scenario');return {...defaults,...presets[key].changes};}
function scaleSummary(p,r){
 const value=x=>Math.max(0,Math.max(0,x.ebitda)*p.multiple-x.debt+x.cash);
 const hit=r.returnsAvailable?r.rows.find(x=>value(x)>=1e9):null;
 const averageFee=p.clientRevenue||5000,margin=r.end.revenue>0?r.end.ebitda/r.end.revenue:0;
 const requiredEbitda=Math.max(0,(1e9+r.end.debt-r.end.cash)/p.multiple);
 const requiredRevenue=margin>0?requiredEbitda/margin:null;
 return {clients:Math.ceil(r.end.revenue/averageFee),firstBillion:hit?.month??null,hit,requiredEbitda,requiredRevenue,requiredClients:requiredRevenue===null?null:Math.ceil(requiredRevenue/averageFee),requiredFirms:requiredRevenue===null||!r.end.firms?null:Math.ceil(requiredRevenue/(r.end.revenue/r.end.firms)),peakDebt:Math.max(...r.rows.map(x=>x.debt)),laterCapital:r.rows.reduce((s,x)=>s+x.equityIn-x.seedIn,0)};
}
const payment=(p,r,n)=>r===0?p/n:p*r/(1-(1+r)**(-n));
function irr(flows){if(!flows.some(x=>x>0))return null;const npv=r=>flows.reduce((s,v,i)=>s+v/(1+r)**(i/12),0);let lo=-.9999,hi=1;while(npv(hi)>0&&hi<1e6)hi=hi*2+1;if(npv(lo)*npv(hi)>0)return null;for(let i=0;i<150;i++){const mid=(lo+hi)/2;if(npv(mid)>0)lo=mid;else hi=mid;}return (lo+hi)/2;}
// Loan proceeds pay the seller directly. The cash ledger therefore deducts only
// the buyer's equity contribution and closing costs, never the full price twice.
function run(p,options={}){
 const H=Math.round(p.years*12),firms=[],rows=[],flows=Array(H+1).fill(0);
 const useTranches=options.tranches??p.tranches??false;
 const initial=useTranches?p.capital*.4:p.capital;
 flows[0]=-initial;
 let fundedCapital=initial;
 let cash=initial,stake=.5,dividends=0,minCash=cash,failed=null,last=-99,yearDeals=0,yr=0;
 const gates=useTranches?[
  {amount:p.capital*.3,firms:1,margin:0,coverage:1.25,earned:null,paid:null},
  {amount:p.capital*.3,firms:2,margin:35,coverage:1.25,earned:null,paid:null}
 ]:[];
 for(let mo=1;mo<=H;mo++){
  if(Math.floor((mo-1)/12)!==yr){yr=Math.floor((mo-1)/12);yearDeals=0;}
  const openingCash=cash;let equityIn=0,seedIn=0;
  const previous=rows.at(-1);
  for(let i=0;i<gates.length;i++){
   const g=gates[i];
   // KPI uses a completed month's results, never the acquisition it would fund.
   if(g.earned===null&&previous&&(i===0||gates[i-1].paid!==null)&&previous.firms>=g.firms&&previous.firmEbitda*12>=previous.revenue*g.margin/100&&previous.firmEbitda>=previous.service*g.coverage)g.earned=mo-1;
   if(g.earned!==null&&g.paid===null&&mo>=g.earned+1+(options.delay||0)){cash+=g.amount;equityIn+=g.amount;seedIn+=g.amount;fundedCapital+=g.amount;flows[mo]-=g.amount;g.paid=mo;}
  }
  if(p.raise>0&&mo===p.raiseMonth){cash+=p.raise;equityIn+=p.raise;/* Funding affects business cash; future investor terms are outside this model. */}
  const capacity=mo<=24?p.deals:(p.scaleDeals||p.deals);
  let overhead=p.hq*(1+p.hqGrowth/100)**yr+firms.length*(p.hqPerFirm||0);const price=p.rev*p.price;
  const creditMonth=Math.max(25,p.creditMonth),down=mo>=creditMonth?p.down2/100:p.down1/100,bank=mo>=creditMonth?Math.min(p.bank/100,1-down):0,seller=1-down-bank,cost=price*(down+p.close/100);
  let downPayment=0,closingCosts=0,bankDraw=0,sellerDraw=0,purchasePrice=0,newFirms=0;
  const monthSlots=capacity<=12?(mo-last>=Math.ceil(12/capacity)?1:0):Math.floor((mo%12||12)*capacity/12)-Math.floor(((mo%12||12)-1)*capacity/12);
  for(let slot=0;mo>=3&&slot<monthSlots&&yearDeals<capacity&&(options.unconstrained||cash>=cost+(overhead+(p.hqPerFirm||0))*p.reserve);slot++){
   const loan=(amount,rate)=>({balance:amount,rate:rate/1200,pmt:payment(amount,rate/1200,p.term*12)});
   firms.push({rev:p.rev,age:0,loans:[loan(price*bank,p.bankRate),loan(price*seller,p.sellerRate)]});
   downPayment+=price*down;closingCosts+=price*p.close/100;bankDraw+=price*bank;sellerDraw+=price*seller;purchasePrice+=price;newFirms++;overhead+=(p.hqPerFirm||0);
   cash-=cost;last=mo;yearDeals++;
  }
  const postAcquisitionCash=cash;
  let ebitda=0,revenue=0,service=0,acquisition=0,interestPaid=0,principalPaid=0;
  for(const f of firms){
   if(f.age>0)f.rev*=1+(p.growth-p.churn)/1200;
   const margin=(p.entry+(p.target-p.entry)*Math.min(f.age/p.ramp,1))/100;
   ebitda+=f.rev*margin;revenue+=f.rev;acquisition+=f.rev*p.growth/1200*p.cac/100;
   for(const loan of f.loans)if(loan.balance>0){const interest=loan.balance*loan.rate,pay=Math.min(loan.pmt,loan.balance+interest);service+=pay;interestPaid+=interest;principalPaid+=pay-interest;loan.balance=Math.max(0,loan.balance+interest-pay);}
   f.age++;
  }
  const firmEbitda=ebitda/12,operatingSurplus=firmEbitda-acquisition-overhead;
  cash+=operatingSurplus-service;
  let distribution=0;
  if(fundedCapital>=p.capital-1e-6&&cash>=0&&mo%12===0&&mo>=p.divStart*12){distribution=Math.max(0,cash-overhead*p.reserve)*p.div/100;cash-=distribution;const investor=distribution*stake;dividends+=investor;flows[mo]+=investor;}
  minCash=Math.min(cash,minCash);
  rows.push({month:mo,cash,openingCash,postAcquisitionCash,equityIn,seedIn,newFirms,downPayment,closingCosts,purchasePrice,bankDraw,sellerDraw,firms:firms.length,revenue,firmRevenue:revenue/12,firmEbitda,firmOperatingCosts:revenue/12-firmEbitda,overhead,cac:acquisition,service,interestPaid,principalPaid,operatingSurplus,ebitda:ebitda-overhead*12-acquisition*12,debt:firms.reduce((s,f)=>s+f.loans.reduce((s,l)=>s+l.balance,0),0),distribution,reserve:overhead*p.reserve});
  if(cash<0&&!options.unconstrained){failed=mo;break;}
 }
 const fundingComplete=fundedCapital>=p.capital-1e-6,returnsAvailable=failed===null&&fundingComplete;
 const laterCapital=rows.reduce((sum,row)=>sum+row.equityIn-row.seedIn,0),investorReturnsAvailable=returnsAvailable&&laterCapital===0;
 const end=rows.at(-1),ev=Math.max(0,end.ebitda)*p.multiple,equity=Math.max(0,ev-end.debt+end.cash),exit=investorReturnsAvailable?equity*stake:0;flows[H]+=exit;const total=dividends+exit;
 return {rows,failed,minCash,stake,dividends:laterCapital?null:dividends,ev,equity,exit:laterCapital?null:exit,total:investorReturnsAvailable?total:null,profit:investorReturnsAvailable?total-fundedCapital:null,moic:investorReturnsAvailable?total/fundedCapital:null,irr:investorReturnsAvailable?irr(flows):null,end,initial,gates,fundedCapital,fundingComplete,returnsAvailable,investorReturnsAvailable,laterCapital,flows:laterCapital?null:flows};
}
function launch(p){
 // The launch comparison retains operating assumptions but excludes an exit,
 // investor distributions and later third-party equity; committed seed uses the selected budget.
 const q={...p,years:2,div:0,raise:0,creditMonth:Math.max(25,p.creditMonth)};
 const upfront=run(q,{tranches:false}),staged=run(q,{tranches:true}),delayed=run(q,{tranches:true,delay:3});
 // Financing need for the full capacity schedule: fixed acquisitions independent
 // of available cash, with the reserve maintained at closing AND month end.
 const schedule=run({...q,capital:0},{unconstrained:true,tranches:false});
 const needed=Math.ceil(Math.max(0,...schedule.rows.flatMap(r=>[r.reserve-r.cash,r.reserve-r.postAcquisitionCash])));
 const fundedSchedule=run({...q,capital:needed},{tranches:false});
 return {upfront,staged,delayed,needed,fundedSchedule,plannedFirms:schedule.end.firms};
}
root.CPA={defaults,presets,scenario,scaleSummary,run,launch,irr,payment};if(typeof module!=='undefined')module.exports=root.CPA;
})(typeof window!=='undefined'?window:globalThis);
