/* One shared glossary for static copy, live results and financing controls. */
(() => {
 const definitions = [
  [['AICPA'], 'American Institute of Certified Public Accountants, a professional association. Survey findings describe the participants and the stated reference year.'],
  [['CBP'], 'County Business Patterns: a US Census Bureau dataset counting employer establishments, employment and payroll. An establishment is a location, not necessarily a separate firm.'],
  [['CFO'], 'Chief Financial Officer. CFO advisory provides financial planning and decision support beyond routine bookkeeping.'],
  [['AI'], 'Artificial intelligence: software used here to assist accounting tasks. Task-level time savings do not automatically equal company-wide cost savings.'],
  [['CAS'], 'Client Advisory Services: recurring outsourced accounting, controller and business advisory services. Scope and client mix vary by firm.'],
  [['SDE'], 'Seller’s Discretionary Earnings: owner-oriented earnings with specified add-backs, often including one owner’s compensation. Unlike normalized platform EBITDA, it may not deduct the market cost of replacing that owner.'],
  [['NAICS'], 'North American Industry Classification System. Code 5412 covers accounting, tax preparation, bookkeeping and payroll; 541211 is the CPA-office subset.'],
  [['FTE'], 'Full-time equivalent: a unit of staffing capacity. Professional capacity estimates do not include all administrative employees.'],
  [['earn-outs'], 'Contingent acquisition payments tied to agreed future performance. The current calculator uses fixed seller loans and does not simulate earn-outs.'],
  [['attest'], 'Professional assurance work on financial information, subject to licensing and independence requirements. It is distinct from ordinary bookkeeping.'],
  [['Unicorn'], 'Here: a private-company planning scenario reaching at least $1 billion of shareholder equity value. Calculated as enterprise value minus debt plus cash. This is an illustrative valuation, not an observed fundraising price or guaranteed outcome.'],
  [['Annual revenue per client'], 'Assumed annual fees per client. Estimated active client equivalents = annualized revenue divided by this amount. It changes the estimated count, not the revenue engine; client mix, duplicate accounts and fee inflation are not modeled.'],
  [['Estimated active clients','Est. clients','client equivalents'], 'An estimate from annualized revenue divided by assumed annual revenue per client, rounded up. Not a verified count of unique client accounts.'],
  [['Extra monthly overhead per acquired firm'], 'Incremental central support and management costs per acquired firm per month, added to the fixed platform overhead from the acquisition month. Practice operating costs are already deducted in practice EBITDA.'],
  [['Acquisitions per year'], 'Annual purchase capacity, constrained by cash and an overhead reserve. A separate capacity applies from month25. Above12 per year, multiple acquisitions may close in one month.'],
  [['cliff'], 'A minimum service period before any of a share grant vests. This draft uses 12 months for the schedule that credits service from launch.'],
  [['dilution'], 'A reduction in an existing shareholder’s percentage when new shares are issued. In a priced round, the new investor share is investment divided by post-money valuation.'],
  [['CPA'], 'Certified Public Accountant. A licensed accounting professional; this model acquires accounting practices.'],
  [['rollup'], 'Acquiring several businesses and combining them under a shared ownership and operating platform.'],
  [['KPI'], 'Key Performance Indicator. A measurable condition used here to decide when a proposed funding tranche can be released.'],
  [['DSCR','debt-service coverage'], 'Debt Service Coverage Ratio. In this model: practice EBITDA ÷ scheduled principal and interest payments for the same period. 1.25× means $1.25 of practice EBITDA per $1 of debt payments. This excludes platform overhead and customer acquisition costs; a lender may use a different definition.'],
  [['Annualized EBITDA','Platform EBITDA'], 'Earnings Before Interest, Taxes, Depreciation and Amortization. The model uses practice revenue × EBITDA margin, less platform overhead and customer acquisition costs. The year-end value is the current monthly run rate × 12, not earnings earned over the entire year. It excludes acquisition closing costs and is not net income or a cash balance.'],
  [['Practice EBITDA','firm EBITDA'], 'Earnings Before Interest, Taxes, Depreciation and Amortization at practice level: revenue less practice operating costs, before platform overhead, customer acquisition costs and debt payments. The launch budget sums the actual modeled months.'],
  [['EBITDA'], 'Earnings Before Interest, Taxes, Depreciation and Amortization. A modeled operating earnings measure, not net income or cash flow. Firm figures exclude platform costs; platform figures deduct overhead and customer acquisition costs.'],
  [['IRR','Annualized return','Annualized IRR'], 'Internal Rate of Return. The annual discount rate that makes the net present value of the investor’s monthly contributions and receipts equal zero. Payment timing matters; this is a modeled pre-tax return, not a guaranteed yield.'],
  [['MOIC','Investment multiple'], 'Multiple on Invested Capital. Total investor distributions plus exit proceeds divided by capital invested. 2× means $2 received for each $1 invested, including the original $1. It does not measure time.'],
  [['Closing cash balance','Cash balance','Opening cash balance','Closing cash','Opening cash'], 'Money held by the company at the stated point in time. Opening cash is the start-of-period balance; closing cash is after funding, acquisitions, operating expenses, debt service and distributions. It is a balance, not revenue, EBITDA, net income or cash generated during the period.'],
  [['Cash flow','cash flows'], 'Money entering or leaving the business during a period. Net cash flow is inflows minus outflows; the cash balance is the accumulated amount remaining at a point in time.'],
  [['Investor proceeds','Total investor receipts','Investor receipts'], 'Money received by the investor: distributions during ownership plus the investor’s share of sale proceeds at exit. The final-year table includes both. This is not company revenue or net income.'],
  [['Investor distributions','Cumulative investor distributions','Platform distribution','distribution','distributions'], 'Payments from available company cash to shareholders. The model distributes a selected share of cash above the overhead reserve at eligible year ends; the investor receives their ownership share. Cumulative distributions add all earlier payments.'],
  [['Investor exit proceeds','Investor exit share'], 'The investor’s ownership share of exit equity value: enterprise value minus outstanding debt plus remaining cash, floored at zero.'],
  [['Investment gain (pre-tax)','Net profit'], 'For the investment shown here: total investor receipts minus the seed capital actually funded. This is a pre-tax investment gain, not the acquired businesses’ accounting net income.'],
  [['Enterprise value'], 'Value of the operating business before deducting debt and adding cash. Here: non-negative annualized platform EBITDA × the exit EBITDA multiple.'],
  [['Exit equity','Equity value','net equity'], 'Value attributable to shareholders at exit: enterprise value − outstanding acquisition debt + closing cash balance, floored at zero in this model.'],
  [['Exit EBITDA multiple','exit multiple'], 'The assumed enterprise value divided by annualized platform EBITDA at exit. For example, 8× means enterprise value is eight times that EBITDA run rate.'],
  [['Exit horizon','exit'], 'The modeled time when the combined business is sold and the investor receives their share of equity value. The 24-month launch budget does not assume an exit.'],
  [['Annualized revenue'], 'The current month’s revenue × 12. This is a run rate, not total revenue earned during the year. The 24-month budget instead sums monthly revenue.'],
  [['Annual practice revenue','Revenue per acquired firm','revenue'], 'Income from providing client services before operating expenses, debt service and taxes. The model assumes revenue is collected in the same month; collection delays are not modeled.'],
  [['Entry EBITDA margin','Entry operating margin'], 'Practice EBITDA as a percentage of revenue when a firm is acquired, before platform overhead and customer acquisition costs.'],
  [['Integrated EBITDA margin','Integrated operating margin','EBITDA margin','operating margin'], 'Practice EBITDA as a percentage of revenue. The integrated margin is the target reached gradually during integration. It is before platform overhead, customer acquisition costs and debt payments.'],
  [['Integration period','integration'], 'The months over which a purchased practice moves from its entry EBITDA margin to the target margin. The model assumes a straight-line improvement.'],
  [['Annual revenue churn','churn'], 'The assumed annual rate of client revenue lost. It is applied monthly and offsets new-client revenue growth. It measures revenue, not the number of clients.'],
  [['Annual new-client revenue','new-client growth'], 'Additional annual client revenue as a percentage of existing revenue. The model applies it monthly and subtracts revenue churn.'],
  [['Customer acquisition costs','Acquisition cost / new revenue','CAC'], 'Customer Acquisition Cost. Here, marketing and sales spending is a percentage of gross new client revenue, rather than a dollar cost per customer. This is separate from buying a company.'],
  [['Monthly platform overhead','Platform overhead','overhead'], 'Shared company operating costs, such as central management and systems, in addition to practice operating expenses. The first 24 months use a fixed total central budget. From month 25 the later base budget and per-firm overhead apply; annual base-budget growth begins in month 37.'],
  [['Annual overhead growth'], 'The annual increase in the central operating budget, applied as a step at the beginning of each model year.'],
  [['Acquisition capacity'], 'The maximum planned firm purchases per year, subject to spacing and the available cash reserve. It is a cap, not a promise that every purchase will be funded.'],
  [['Acquisition equity contributions','Acquisition equity contribution','Cash down before bank financing','Cash down after bank financing','down payment'], 'The buyer’s own cash portion of the practice purchase price, excluding closing costs. Seller financing and any eligible bank borrowing fund the remainder.'],
  [['Acquisition cash required'], 'The buyer’s cash contribution to the practice purchase price plus transaction closing costs. This is a use of cash at closing, not the company’s remaining cash balance.'],
  [['Closing costs'], 'Transaction costs paid when acquiring a practice, modeled as a percentage of its purchase price. They reduce cash in the acquisition month and are separate from the purchase price.'],
  [['Purchase price'], 'The amount paid for a practice, modeled as annual practice revenue × the purchase-price multiple. It is funded by buyer equity, seller financing and, only when available, bank borrowing.'],
  [['Seller financing','seller note','seller notes','seller-note'], 'A loan from the seller: part of the purchase price is paid later with interest. It remains debt and requires monthly principal and interest payments. It is allowed during the first 24 months; bank financing is not.'],
  [['Seller debt service','Monthly total debt service','Annual total debt service','debt service','debt payments'], 'Scheduled principal repayments plus interest for the stated period. Principal reduces debt; interest is the cost of borrowing. The launch plan has seller debt only.'],
  [['Loan amortization','amortization'], 'For loans: gradual repayment of principal through regular payments. In this model both bank and seller loans are fully amortizing over the selected term, with no balloon payment. In EBITDA, amortization refers to the accounting expense for intangible assets.'],
  [['Seller note principal','principal'], 'The amount borrowed that must be repaid, excluding interest. Principal repayments reduce the loan balance and cash but are not an EBITDA expense.'],
  [['interest'], 'The cost of borrowing. Annual loan rates are divided by 12 and applied to the outstanding balance each month.'],
  [['Debt outstanding','Less debt','debt'], 'Unpaid principal on bank loans and seller notes. The model repays it monthly. This is a balance at a point in time, not the debt payments made during a year.'],
  [['Cash reserve','overhead reserve'], 'A minimum acquisition buffer equal to the selected number of months of current platform overhead. It does not cover all practice expenses or debt service and is not a guarantee of runway.'],
  [['surplus cash'], 'Cash above the modeled platform overhead reserve. Eligible year-end distributions use a selected percentage of that excess.'],
  [['Operating surplus'], 'Practice EBITDA less platform overhead and customer acquisition costs for the period, before principal and interest payments. Taxes, capital expenditure and working-capital changes are not included.'],
  [['Bank financing starts','Bank financing','Bank funding','Bank share of purchase price','Bank borrowing'], 'Assumed bank funding of new acquisitions. Unavailable in months 1–24; month 25 is the earliest allowed start, not a committed credit facility. Existing seller loans are not refinanced automatically.'],
  [['Pre-seed'], 'The initial equity investment used to launch the acquisition platform. The main investor model assumes $1.5 million committed in milestone tranches: $600,000 at launch and two conditional $450,000 drawdowns. Ownership is a separate modeling assumption.'],
  [['post-money','post-money valuation'], 'The equity valuation immediately after a new investment. New investor ownership = investment ÷ post-money valuation; existing owners are diluted accordingly.'],
  [['pre-money'], 'Equity valuation immediately before new investment: post-money valuation minus new capital.'],
  [['Additional equity','Equity received','Starting equity'], 'Investor capital contributed in exchange for ownership; it is funding, not revenue. Later capital is included in the business cash forecast; its investment terms and effect on seed-investor returns are outside this model. Proposed KPI tranches are drawdowns of one committed seed round.'],
  [['dilution','dilutes'], 'A reduction in an existing investor’s percentage ownership when new shares are issued to another investor.'],
  [['tranche','tranches','drawdowns'], 'A portion of committed funding paid separately. In the launch illustration, later portions are released only after the stated KPI is met. Undrawn commitments are not available cash.'],
  [['working capital'], 'Operating funds tied up in items such as receivables and payables. Changes in working capital can consume cash even when a business reports a profit; this model excludes those changes.'],
  [['Capital expenditures'], 'Cash spent on longer-lived assets rather than current operating expenses. They can reduce cash without reducing EBITDA in the same period; this model excludes them.'],
  [['preferred return'], 'A contractual priority return paid to certain investors before other distributions. Not modeled here.'],
  [['liquidation preference'], 'A contractual priority for recovering investment when a company is sold or liquidated. Not modeled here.'],
  [['equity'], 'The ownership capital of a business. In the funding budget it means capital supplied by investors, not revenue or debt. At exit, equity value is the residual value after debt is deducted and cash is added.'],
  [['net income'], 'Accounting profit after all expenses, including interest, taxes, depreciation and amortization. This model does not calculate company net income; it calculates EBITDA and a simplified cash budget.'],
  [['CSV'], 'Comma-Separated Values. A plain-text table that can be opened in spreadsheet software.'],
 ];
 const terms=new Map();for(const [aliases,definition] of definitions)for(const alias of aliases)terms.set(alias.toLowerCase(),definition);
 const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const matcher=new RegExp('\\b('+[...terms.keys()].sort((a,b)=>b.length-a.length).map(escape).join('|')+')(?![\\w])','gi');
 const tooltip=document.createElement('div');tooltip.id='financial-tooltip';tooltip.className='financial-tooltip';tooltip.setAttribute('role','tooltip');tooltip.hidden=true;document.body.append(tooltip);
 let active=null,timer;
 function close(){if(active)active.removeAttribute('aria-describedby');active=null;tooltip.hidden=true;}
 function position(){if(!active||!active.isConnected){close();return;}const r=active.getBoundingClientRect(),w=tooltip.offsetWidth,h=tooltip.offsetHeight;tooltip.style.left=Math.max(12,Math.min(r.left,innerWidth-w-12))+'px';tooltip.style.top=Math.max(12,r.bottom+h+12<=innerHeight?r.bottom+8:r.top-h-8)+'px';}
 function show(button){clearTimeout(timer);if(active&&active!==button)active.removeAttribute('aria-describedby');active=button;tooltip.textContent=terms.get(button.dataset.term);tooltip.hidden=false;button.setAttribute('aria-describedby',tooltip.id);position();}
 function later(){clearTimeout(timer);timer=setTimeout(close,180);}
 function annotate(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return !node.parentElement||node.parentElement.closest('script,style,svg,button,a,summary,select,option,textarea,label,h1,footer,.tag,.financial-tooltip,.financial-term')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;}}),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){const text=node.nodeValue;matcher.lastIndex=0;const matches=[...text.matchAll(matcher)];if(!matches.length)continue;const frag=document.createDocumentFragment();let end=0;
   for(const match of matches){frag.append(text.slice(end,match.index));const button=document.createElement('button');button.type='button';button.className='financial-term';button.dataset.term=match[0].toLowerCase();button.textContent=match[0];button.setAttribute('aria-label','Explain '+match[0]);frag.append(button);end=match.index+match[0].length;}
   frag.append(text.slice(end));node.replaceWith(frag);
  }
 }
 document.addEventListener('pointerover',e=>{const b=e.target.closest('.financial-term');if(b)show(b);else if(tooltip.contains(e.target))clearTimeout(timer);});
 document.addEventListener('pointerout',e=>{if(e.target.closest('.financial-term')||tooltip.contains(e.target))later();});
 document.addEventListener('focusin',e=>{const b=e.target.closest('.financial-term');if(b)show(b);else close();});
 document.addEventListener('focusout',e=>{if(e.target.closest('.financial-term'))later();});
 document.addEventListener('click',e=>{const b=e.target.closest('.financial-term');if(b){e.preventDefault();show(b);}else if(!tooltip.contains(e.target))close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
 window.addEventListener('resize',position);window.addEventListener('scroll',position,true);
 const observer=new MutationObserver(changes=>{observer.disconnect();for(const change of changes)for(const node of change.addedNodes)if(node.nodeType===1&&!node.closest('.financial-term,.financial-tooltip'))annotate(node);else if(node.nodeType===3&&node.parentElement&&!node.parentElement.closest('.financial-term,.financial-tooltip'))annotate(node.parentElement);if(active&&!active.isConnected)close();observe();});
 function observe(){observer.observe(document.body,{childList:true,subtree:true});}
 annotate(document.body);observe();
})();
