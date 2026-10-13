# Accounting Growth Partners — public model analysis

This is a working investment illustration, not operating data from acquired firms. The project name is provisional.

## Start here

Download https://korets.net/cpa/data/model-bundle.json . It contains the model inputs, five scenarios, monthly and annual results, field definitions, Census extract, a source catalog, reference facts, limitations, the JavaScript model source, and a `researchContext` object containing the research library, implementation catalog, founder context and evidence map. No login or API key is required. Alternatively use the separate files linked at https://korets.net/cpa/data/ .

The bundle records the SHA-256 of the exact model source used. https://korets.net/release.json identifies the published site commit. Exports are generated from the same engine as the website, not a separate spreadsheet.

## Read the units first

- All monetary calculations are USD. Interest/growth/margin inputs use percentage points: 15 means 15%, not 0.15. Investor IRR uses a decimal fraction: 0.15 means 15%.
- `monthly.revenue` and `monthly.ebitda` are annualized month-end run rates. They are not monthly earned revenue or EBITDA.
- `monthly.firmRevenue` and `monthly.operatingSurplus` are monthly earned revenue and platform EBITDA. Sum these for earned-year totals. `annual` includes both earned totals and year-end run rates.
- `cash` and `debt` are balances. `bankDraw` and `sellerDraw` fund the purchase price directly, not cash received into the operating bank balance.
- Client equivalents are estimates, not verified unique clients. Census firms, offices/establishments and nonemployers are different units. The historical raw NES receipts remain in thousands of USD; the dataset notes explain conversion.
- `null` for investor returns means unavailable. A later equity round needs its own ownership terms; do not retain the illustrative 50% seed ownership through an unspecified financing.

## Reproduce and analyze

Download https://korets.net/cpa/model.js . In Node.js: `const C = require('./model.js'); const inputs = C.scenario('base'); const result = C.run(inputs);`. Compare `result.rows` with the bundle's monthly results and the source hash. `C.launch(inputs)` gives the separate 24-month funding and delayed-tranche sensitivities. `C.scaleSummary(inputs, result)` computes scale and the first billion-dollar equity-value crossing.

Useful checks: reconcile each month's cash; verify purchase price equals own cash + bank + seller debt; verify principal + interest equals debt service; inspect minimum cash and reserve breaches; compare earned annual revenue with annualized year-end revenue; stress margins, retention, acquisition pace, seller terms, bank delays and valuation. Capacity is a ceiling, not guaranteed closings. Ten years is a planning horizon, not a fund term.

From month 25, Base uses a count-weighted average of $2M entry revenue per acquisition, priced at 1.25x revenue and improving toward 40% practice EBITDA margin. Launch firms retain their $550K entry revenue, 1x price and 45% target. The blended size is an assumption rather than a distribution of actual transactions; stress individual large-deal cash timing separately.

## Important modeling boundaries

The calculator assumes full ownership of acquired businesses. The preferred continuing-partner strategy may retain local seller equity, but minority ownership, distributions and repurchases are not modeled. Do not infer buyer-attributable value from 100% group EBITDA without this adjustment. Salary, seller debt payments and equity distributions are separate.

Income tax, capex, working-capital changes, exit fees and transaction taxes are excluded. Model outputs are not net profit or fully distributable cash. A 25% to 45% margin increase alone gives 1.8x EBITDA on unchanged revenue, not 5x. Company-disclosed AI time savings are not established group profit improvements.

All acquisition criteria and model inputs are assumptions unless identified as sourced facts. Source observations retain their own dates. Do not treat an acquisition budget as price paid, a target as a completed purchase, or survey retirement intentions as future available inventory. No private customer data, target-company financials, confidential contracts or credentials are included.

## Suggested analysis request

“Analyze the Accounting Growth Partners model bundle. Separate sourced facts from assumptions. Reproduce the Base scenario, reconcile monthly cash and financing, and explain annual earned revenue versus year-end run rate. Compare all five scenarios. Stress debt availability, seller financing, margins, retention, central costs and acquisition capacity. Identify how retained local seller equity would change the buyer's cash and terminal value. List missing inputs before estimating that effect. Do not invent financing terms or recommend an investment solely from the illustrative returns. Cite source URLs and identify the model hash used.”

## Venture and AI sensitivity

The Venture preset keeps the first 24 months identical to Base and assumes $25M of growth equity in month 25, capacity of 18 purchases per year, a $100K monthly central base and $2,500 per firm from month 25. Base growth, purchase pricing and 40% later margins remain unchanged. Venture assumes a 9× exit EBITDA multiple; Base remains at 8×. `valuationSensitivity` holds Venture operations, cash and debt fixed and reports enterprise value and group equity value at 8× and 9×. The $1B threshold concerns group equity value, not enterprise value or a seed investor’s stake. `venture-analysis.json` compares capital alone, $15M/$25M/$40M rounds and downside sensitivities. Its capital bridge reconciles months 25–48; central costs are already deducted in cash after debt and must not be subtracted twice.

The 60–80% practice EBITDA margin illustration is a static, fully mature portfolio sensitivity with fixed revenue, central overhead and CAC. It is not an adoption forecast, valuation, cash-flow simulation or default operating assumption. It does not establish that 80% is achievable; at $5K/client it leaves only $1K per client for all practice costs.


## Use the research context

Start with `researchContext.founder`, then `library`, `evidenceMap`, and `implementations`. Research only: https://korets.net/cpa/data/research-context.json . Human-readable version: https://korets.net/cpa/data/research-notes.md . Both are generated from the same public records. File hashes in `provenance` identify the component versions.

- `library.records` contains 26 source-reviewed records. `published: null` means the date was not established; `reviewed` is our research-check date. Investor theses, company disclosures, vendor cases, surveys and academic working papers have different evidence types.
- `implementations.records` contains 100 reference records, not 100 independent studies or unique firms. Most were collected in an August 17, 2026 dossier and have not all been reverified. Their condensed notes retain the original Russian/English terminology. Categories separate international, corporate-finance, conventional-automation and US-oriented practice examples.
- `freshReviewId` links an archived record to the reviewed library; the fresh record takes precedence. `cluster` identifies repeated vendor/source families. Do not average savings percentages or count shared publishers as independent replications.
- `evidenceMap.assumptions` connects evidence to model inputs and lists missing validation. `reconciliations` documents conflicts and versions rather than hiding them. The journal article fetch timeout and unavailable release URL are disclosed in `library.accessLimits`.
- Founder background is sourced to Yaroslav Korets’s self-published biography; role relevance is analysis, not third-party verification. The founder confirms a tax-company pilot in progress. Its published scope describes intended work, and its results remain `null`. Do not invent a start date, paid invoice, completed cohort, savings, client endorsement or acquisition agreement.
- The research includes published facts and authored summaries, not copies of full copyrighted articles, private taxpayer records or proprietary survey microdata. Re-open original sources before using archived or disputed claims in an investment decision.

## Suggested extended AI request

“Read the AGP model bundle and its researchContext. Explain the investment thesis and founder fit using attributed facts. Separate investor opinion, company disclosure, vendor-reported results, academic evidence, founder statements and assumptions. Compare the public acquisition structures and implementation workflows. Check the evidence map and source conflicts. Reproduce all five financial scenarios without treating task-time savings as EBITDA. State what the current tax-company pilot must prove, including quality and full cost. Identify the five most consequential unsupported assumptions and propose evidence that could falsify them. Use source URLs, source dates and record IDs; do not infer endorsement, agreed deal terms, completed pilot outcomes or protected ownership through future rounds.”
