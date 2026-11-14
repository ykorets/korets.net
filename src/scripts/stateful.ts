// Minimal DOM morph: keeps existing elements (and their CSS transitions)
// and only patches attributes, text and structure that differ.
function morph(from: Node, to: Node) {
  // Headings in the hidden copies are rendered as <div data-h> so the page keeps one
  // real heading per section; treat them as the same element when morphing.
  const sameHeading = from instanceof Element && to instanceof Element && /^H[1-6]$/.test(from.nodeName) && to.hasAttribute('data-h');
  if (!sameHeading && (from.nodeType !== to.nodeType || from.nodeName !== to.nodeName)) {
    from.parentNode?.replaceChild(to.cloneNode(true), from);
    return;
  }
  if (from.nodeType === Node.TEXT_NODE || from.nodeType === Node.COMMENT_NODE) {
    if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue;
    return;
  }
  if (from instanceof Element && to instanceof Element) {
    for (const a of Array.from(from.attributes)) if (!to.hasAttribute(a.name)) from.removeAttribute(a.name);
    for (const a of Array.from(to.attributes)) if (a.name !== 'data-h' && from.getAttribute(a.name) !== a.value) from.setAttribute(a.name, a.value);
  }
  const f = Array.from(from.childNodes);
  const t = Array.from(to.childNodes);
  for (let i = 0; i < t.length; i++) {
    if (i < f.length) morph(f[i], t[i]);
    else from.appendChild(t[i].cloneNode(true));
  }
  for (let i = t.length; i < f.length; i++) from.removeChild(f[i]);
}

export type StatefulHandle = { go: (i: number) => void; stop: () => void; current: () => number };

export function initStateful() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll<HTMLElement>('[data-stateful]:not([data-ready])').forEach((root) => {
    root.dataset.ready = '1';
    const live = root.querySelector<HTMLElement>('[data-live]')!;
    // States wait either in <template> or, when they should be indexable, in hidden <div>s.
    const tpls = Array.from(root.querySelectorAll<HTMLElement>(':scope > [data-state]')).map((el) => (el instanceof HTMLTemplateElement ? el.content : el));
    const named: Record<string, number> = JSON.parse(root.dataset.named || '{}');
    let cur = 0;
    let timer = 0;
    let visible = false;
    const go = (i: number, keepFocus = false) => {
      if (i === cur || !tpls[i]) return;
      const active = document.activeElement as HTMLElement | null;
      const focusKey = keepFocus && active && live.contains(active) ? active.getAttribute('data-on-click') : null;
      const focusIdx = focusKey ? Array.from(live.querySelectorAll(`[data-on-click="${focusKey}"]`)).indexOf(active!) : -1;
      morph(live.firstElementChild!, tpls[i].firstElementChild!);
      cur = i;
      if (focusKey) (live.querySelectorAll<HTMLElement>(`[data-on-click="${focusKey}"]`)[focusIdx] as HTMLElement | undefined)?.focus();
      root.dispatchEvent(new CustomEvent('statechange', { detail: i }));
    };
    const stop = () => { window.clearInterval(timer); timer = 0; };
    const every = Number(root.dataset.autoplay || 0);
    if (every && !reduce) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.25 }).observe(root);
      timer = window.setInterval(() => { if (visible && !document.hidden) go((cur + 1) % tpls.length); }, every);
    }
    live.addEventListener('click', (ev) => {
      const el = (ev.target as Element).closest<HTMLElement>('[data-on-click]');
      if (!el || !live.contains(el)) return;
      const key = el.getAttribute('data-on-click')!;
      let i = named[key];
      if (i === undefined) i = Array.from(live.querySelectorAll(`[data-on-click="${key}"]`)).indexOf(el);
      stop();
      go(i, true);
    });
    (root as any).stateful = { go, stop, current: () => cur } satisfies StatefulHandle;
  });
}
