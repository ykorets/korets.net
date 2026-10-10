(function(root){
const defaults={capital:1000000,stake:50,years:8,rev:550000,price:1,entry:25,target:45,ramp:12,churn:8,growth:12,cac:25,hq:20000,hqGrowth:10,deals:4,down1:30,down2:30,bank:40,creditMonth:13,bankRate:15,sellerRate:6,term:5,reserve:6,close:5,multiple:8,div:30,divStart:5,raise:0,raiseMonth:24,post:10000000};
const payment=(p,r,n)=>r===0?p/n:p*r/(1-(1+r)**(-n));
function irr(flows){if(!flows.some(x=>x>0))return null; const npv=r=>flows.reduce((s,v,i)=>s+v/(1+r)**(i/12),0);let lo=-.9999,hi=1;while(npv(hi)>0&&hi<1e6)hi=hi*2+1;if(npv(lo)*npv(hi)>0)return null;for(let i=0;i<150;i++){const mid=(lo+hi)/2;if(npv(mid)>0)lo=mid;else hi=mid;}return (lo+hi)/2;}
function run(p){const H=Math.round(p.years*12),firms=[],rows=[],flows=Array(H+1).fill(0);flows[0]=-p.capital;let cash=p.capital,stake=p.stake/100,dividends=0,minCash=cash,failed=null,last=-99,yearDeals=0,yr=0;
for(let mo=1;mo<=H;mo++){
if(Math.floor((mo-1)/12)!==yr){yr=Math.floor((mo-1)/12);yearDeals=0;}
if(p.raise>0&&mo===p.raiseMonth){cash+=p.raise;stake*=1-p.raise/p.post;}
const overhead=p.hq*(1+p.hqGrowth/100)**yr,price=p.rev*p.price;
const down=mo>=p.creditMonth?p.down2/100:p.down1/100,bank=mo>=p.creditMonth?Math.min(p.bank/100,1-down):0,seller=1-down-bank,cost=price*(down+p.close/100);
if(mo>=3&&mo-last>=12/p.deals&&yearDeals<p.deals&&cash>=cost+overhead*p.reserve){const loan=(amount,rate)=>({balance:amount,rate:rate/1200,pmt:payment(amount,rate/1200,p.term*12)});firms.push({rev:p.rev,age:0,loans:[loan(price*bank,p.bankRate),loan(price*seller,p.sellerRate)]});cash-=cost;last=mo;yearDeals++;}
let ebitda=0,revenue=0,service=0,acquisition=0;
for(const f of firms){if(f.age>0)f.rev*=1+(p.growth-p.churn)/1200;const margin=(p.entry+(p.target-p.entry)*Math.min(f.age/p.ramp,1))/100;ebitda+=f.rev*margin;revenue+=f.rev;acquisition+=f.rev*p.growth/1200*p.cac/100;
for(const loan of f.loans){if(loan.balance>0){const interest=loan.balance*loan.rate,pay=Math.min(loan.pmt,loan.balance+interest);service+=pay;loan.balance=Math.max(0,loan.balance+interest-pay);}}f.age++;}
cash+=ebitda/12-service-acquisition-overhead;minCash=Math.min(cash,minCash);
if(cash<0){failed=mo;rows.push({month:mo,cash,firms:firms.length,revenue,ebitda:ebitda-overhead*12-acquisition*12,debt:firms.reduce((s,f)=>s+f.loans.reduce((s,l)=>s+l.balance,0),0),distribution:0});break;}
let distribution=0;if(mo%12===0&&mo>=p.divStart*12){distribution=Math.max(0,cash-overhead*p.reserve)*p.div/100;cash-=distribution;const investor=distribution*stake;dividends+=investor;flows[mo]+=investor;}
rows.push({month:mo,cash,firms:firms.length,revenue,ebitda:ebitda-overhead*12-acquisition*12,debt:firms.reduce((s,f)=>s+f.loans.reduce((s,l)=>s+l.balance,0),0),distribution});
}
const end=rows.at(-1),ev=Math.max(0,end.ebitda)*p.multiple,equity=Math.max(0,ev-end.debt+end.cash),exit=failed===null?equity*stake:0;flows[H]+=exit;const total=dividends+exit;
return {rows,failed,minCash,stake,dividends,ev,equity,exit,total,profit:total-p.capital,moic:total/p.capital,irr:failed===null?irr(flows):null,end};}
root.CPA={defaults,run,irr,payment};if(typeof module!=='undefined')module.exports=root.CPA;
})(typeof window!=='undefined'?window:globalThis);
