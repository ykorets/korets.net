// Single place for links used across the site.
export const CAL_ORIGIN = 'https://book.korets.net';
// Event types on the self-hosted Cal.com (book.korets.net), in the order shown on the page.
// Business meeting comes in three lengths; the middle one is preselected.
export const CAL_TYPES = [
  { lengths: [
    { min: 30, link: 'korets/business-meeting-30' },
    { min: 45, link: 'korets/business-meeting' },
    { min: 60, link: 'korets/business-meeting-60' },
  ], initial: 1 },
  { lengths: [{ min: 15, link: 'korets/feedback-loop' }], initial: 0 },
];
export const CAL_EVENTS = CAL_TYPES.map((t) => t.lengths[t.initial].link);
export const NEWSLETTER_ENDPOINT = 'https://korets-subscribe.korets.workers.dev';
export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/yaroslavkorets/',
  instagram: 'https://www.instagram.com/yarokorets/',
  facebook: 'https://www.facebook.com/yaroslav.korets/',
  x: 'https://x.com/ykorets',
  email: 'mailto:yaroslav@korets.net',
};
