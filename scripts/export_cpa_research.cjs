// Build public research context only from explicitly reviewed, publication-safe files.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dir=path.resolve(__dirname,'../cpa/data');
const names={library:'research-library.json',implementations:'implementation-catalog.json',evidenceMap:'evidence-map.json',founder:'founder-context.json'};
const data=Object.fromEntries(Object.entries(names).map(([k,f])=>[k,JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'))]));
const counts={reviewedResearchRecords:data.library.records.length,implementationRecords:data.implementations.records.length};
const provenance=Object.entries(names).map(([key,file])=>({key,url:'https://korets.net/cpa/data/'+file,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,file))).digest('hex')}));
const context={schemaVersion:1,updated:'2026-10-12',counts,readingOrder:['founder','library','evidenceMap','implementations'],interpretation:'Research context, not underwriting proof. Investor opinions, vendor claims, founder statements, archived notes and measured outcomes retain separate labels. Repeated sources are not independent evidence.',provenance,...data};
fs.writeFileSync(path.join(dir,'research-context.json'),JSON.stringify(context,null,2)+'\n');
const lines=['# Accounting Growth Partners — research context','',`Updated ${context.updated}. ${counts.reviewedResearchRecords} reviewed research records; ${counts.implementationRecords} implementation/reference records including adjacent and historical examples. Counts are records, not independent studies or unique firms.`,
'','## Read and reproduce','', 'Use [model-bundle.json](https://korets.net/cpa/data/model-bundle.json) for the complete model plus this context, or [research-context.json](https://korets.net/cpa/data/research-context.json) for research only. The original publishers’ full articles are linked, not redistributed. Archived cases have not all been reverified; fresh reviews take precedence.','',
'## Founder and current pilot','',data.founder.summary,'', 'Biography source: [public CV](https://korets.net/cv/). Self-published background, with AGP relevance interpreted separately.'];
for(const x of data.founder.facts)lines.push('',`### ${x.id}`,x.fact,`Period: ${x.period}.`,`Relevance: ${x.relevance}`,`Boundary: ${x.boundary}`);
lines.push('','### Tax-company pilot',data.founder.pilot.publicDescription,`Status: ${data.founder.pilot.status}; ${data.founder.pilot.statusSource}.`,data.founder.pilot.scopeSourceStatus,'Scope: '+data.founder.pilot.scope.join(' '),'No measured AGP pilot savings, revenue or EBITDA results are supplied. All result fields are null, not zero.',`[Published pilot scope](${data.founder.pilot.publicScopeUrl})`,'','## Evidence mapped to the model');
for(const x of data.evidenceMap.assumptions)lines.push('',`### ${x.assumption}`,`Evidence status: ${x.evidenceStatus}. Research IDs: ${x.researchIds.join(', ')||'None established in this packet'}.`,x.interpretationLimit,'Still needed: '+x.validationNeeded.join(' '));
lines.push('','## Reviewed sources');
for(const x of data.library.records)lines.push('',`### ${x.id} · ${x.title}`,`[${x.publisher}](${x.url}) · ${x.evidenceType} · Published: ${x.published||'not established'} · Reviewed: ${x.reviewed}`,x.findings.join(' '),'AGP relevance: '+x.agpRelevance,'Limits: '+x.limitations.join(' '));
lines.push('','## Conflicts and version notes');
for(const x of data.evidenceMap.reconciliations)lines.push('',`- ${x.id}: ${x.issue} ${x.resolution}`);
lines.push('','## Prior implementation catalog','',data.implementations.evidencePolicy.join(' '));
for(const x of data.implementations.records){lines.push('',`### ${x.id} · ${x.title}`,`Category: ${x.category}. Status: ${x.reviewStatus}. Archive: ${x.archiveDate}.`);for(const k of ['context','before','workflow','humanRole','reportedOutcome','limitations'])if(x[k])lines.push(`${k}: ${x[k]}`);if(x.freshReviewId)lines.push('Fresh review takes precedence: '+x.freshReviewId);lines.push(...x.sourceUrls.map((url,i)=>`[Source ${i+1}](${url})`));}
lines.push('','## Excluded or weakened claims');
for(const x of data.implementations.excludedOrWeakenedClaims)lines.push(`- ${x.claim}: ${x.reason}`);
lines.push('','## Pilot measurement plan','',data.founder.pilot.economicRule);
for(const x of data.evidenceMap.pilotScorecard)lines.push(`- ${x.metric} (${x.unit}): ${x.measurementRule} Current value: unavailable.`);
fs.writeFileSync(path.join(dir,'research-notes.md'),lines.join('\n\n')+'\n');
module.exports=context;
