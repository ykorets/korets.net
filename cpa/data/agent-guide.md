# Accounting Growth Partners — public model analysis

This is a working investment illustration, not operating data from acquired firms. The project name is provisional.

## Start here

Download https://korets.net/cpa/data/model-bundle.json . It contains the model inputs, four scenarios, monthly and annual results, field definitions, Census extract, a source catalog, reference facts, limitations and the JavaScript model source. No login or API key is required. Alternatively use the separate files linked at https://korets.net/cpa/data/ .

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

“Analyze the Accounting Growth Partners model bundle. Separate sourced facts from assumptions. Reproduce the Base scenario, reconcile monthly cash and financing, and explain annual earned revenue versus year-end run rate. Compare all four scenarios. Stress debt availability, seller financing, margins, retention, central costs and acquisition capacity. Identify how retained local seller equity would change the buyer's cash and terminal value. List missing inputs before estimating that effect. Do not invent financing terms or recommend an investment solely from the illustrative returns. Cite source URLs and identify the model hash used.”
