const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const C=require('../cpa/model.js'),b=require('../cpa/data/model-bundle.json');
assert.equal(b.meta.modelSha256,crypto.createHash('sha256').update(fs.readFileSync(require.resolve('../cpa/model.js'))).digest('hex'));
for(const [id,s] of Object.entries(b.scenarios)){
 const r=C.run(C.scenario(id));assert.deepEqual(s.monthly,r.rows);assert.deepEqual(s.inputs,C.scenario(id));assert.equal(s.monthly.length,120);
 for(const x of s.monthly){for(const v of Object.values(x))assert.ok(Number.isFinite(v));const near=(a,z)=>assert.ok(Math.abs(a-z)<.0001);
 near(x.openingCash+x.equityIn-x.downPayment-x.closingCosts+x.operatingSurplus-x.service-x.distribution,x.cash);near(x.downPayment+x.bankDraw+x.sellerDraw,x.purchasePrice);near(x.interestPaid+x.principalPaid,x.service);}
 for(const y of s.annual){const rows=s.monthly.slice((y.year-1)*12,y.year*12);assert.equal(y.revenueEarned,rows.reduce((n,x)=>n+x.firmRevenue,0));assert.equal(y.platformEbitdaEarned,rows.reduce((n,x)=>n+x.operatingSurplus,0));}
 const lines=fs.readFileSync(require.resolve('../cpa/data/'+id+'-monthly.csv'),'utf8').trim().split('\n');assert.equal(lines.length,121);assert.equal(lines[0].split(',').length,Object.keys(b.dictionary.monthly).length);
 if(s.summary.laterCapital>0){assert.equal(s.summary.investorMoic,null);assert.equal(s.illustrativeSeedInvestorMonthlyCashFlows,null);}
}
console.log('Public exports reproduce all five scenarios; monthly cash, purchase funding and debt reconcile.');

assert.deepEqual(b.ventureAnalysis,C.ventureAnalysis());assert.equal(Object.keys(b.scenarios).length,5);

// Verify the evidence graph and the downloadable packet agree, including explicit unknown pilot results.
const context=require('../cpa/data/research-context.json');
assert.deepEqual(b.researchContext,context);
const ids=new Set(context.library.records.map(x=>x.id));assert.equal(ids.size,context.library.records.length);
const caseIds=new Set(context.implementations.records.map(x=>x.id));assert.equal(caseIds.size,context.implementations.records.length);
assert.equal(context.counts.implementationRecords,context.implementations.records.length);
for(const r of context.library.records){assert.ok(r.url.startsWith('https://'));assert.ok(r.findings.length);assert.ok(r.limitations.length);assert.equal(r.endorsesAGP,false);}
for(const r of context.implementations.records){assert.ok(r.sourceUrls.length,r.id);if(r.freshReviewId)assert.ok(ids.has(r.freshReviewId),r.id);assert.ok(r.limitations,r.id);}
for(const a of context.evidenceMap.assumptions)for(const id of a.researchIds)assert.ok(ids.has(id),id);
for(const a of context.evidenceMap.reconciliations)for(const id of a.researchIds)assert.ok(ids.has(id),id);
for(const p of context.provenance){const file=require('node:path').basename(p.url);assert.equal(p.sha256,crypto.createHash('sha256').update(fs.readFileSync(require.resolve('../cpa/data/'+file))).digest('hex'));}
assert.ok(Object.values(context.founder.pilot.results).every(x=>x===null));
assert.equal(context.implementations.records.find(x=>x.id==='impl-10-8').reviewStatus,'superseded_by_fresh_review');
assert.equal(context.library.records.find(x=>x.id==='salesforce-1800').metrics[0].status,'projected');
console.log('Research packet, source graph, component hashes, archive overrides and unknown pilot outcomes verified.');
