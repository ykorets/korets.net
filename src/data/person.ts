// The site's single source of truth for who Yaro is, used in structured data on every page.
import { SOCIAL } from './site';

export const SITE = 'https://korets.net';
export const PERSON_ID = `${SITE}/#person`;
export const NAME = 'Yaro Korets';
export const FULL_NAME = 'Yaroslav (Yaro) Korets';
export const ALT_NAMES = ['Yaroslav Korets', 'Yaroslav (Yaro) Korets', 'Yaro Korets', 'Ярослав Корец', 'Ярослав Корець', 'Яро Корец'];

export const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: NAME,
  alternateName: ALT_NAMES.filter((n) => n !== NAME),
  givenName: 'Yaroslav',
  familyName: 'Korets',
  url: `${SITE}/`,
  image: `${SITE}/img/yaro-portrait.jpg`,
  jobTitle: 'AI Implementation Engineer',
  description: 'AI implementation engineer in Los Angeles. Helps business owners improve margins with AI across marketing, sales, finance and operations. Founder of Growth Control and CTO & Co-Founder of Stretch Tent.',
  address: { '@type': 'PostalAddress', addressLocality: 'Los Angeles', addressRegion: 'CA', addressCountry: 'US' },
  knowsAbout: ['AI implementation', 'AI agents', 'Business process automation', 'Marketing automation', 'Sales automation', 'CRM', 'Lead follow-up', 'Operations', 'Growth marketing'],
  worksFor: [
    { '@type': 'Organization', name: 'Growth Control', url: 'https://growthcontrol.app/' },
    { '@type': 'Organization', name: 'Stretch Tent', url: 'https://www.stretch-tent.net/' },
  ],
  memberOf: [{ '@type': 'Organization', name: 'Ukrainian Burners Inc.', url: 'https://kurenivka.com/' }],
  sameAs: [SOCIAL.linkedin, SOCIAL.instagram, SOCIAL.facebook, SOCIAL.x, 'https://growthcontrol.app/', 'https://www.producthunt.com/@yaroslav_korets'],
};

export const website = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  name: 'Yaro Korets',
  alternateName: 'Yaroslav Korets',
  url: `${SITE}/`,
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
  about: { '@id': PERSON_ID },
};

export function breadcrumbs(items: [string, string][]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE}${path}` })),
  };
}
