"""Release parity must keep both provider policy and owned rules exact."""
import unittest
from robots_parity import KNOWN_CLOUDFLARE_PREFIX as PREFIX, robots_match


class RobotsParityTests(unittest.TestCase):
    owned = b'User-agent: *\nAllow: /\n\nSitemap: https://korets.net/sitemap.xml\n'

    def test_unmodified_origin(self):
        self.assertTrue(robots_match(self.owned, self.owned))

    def test_exact_observed_provider_prefix(self):
        self.assertTrue(robots_match(PREFIX + self.owned, self.owned))

    def test_changed_owned_directive_fails(self):
        changed = self.owned.replace(b'Allow: /', b'Disallow: /')
        self.assertFalse(robots_match(PREFIX + changed, self.owned))

    def test_changed_provider_policy_fails(self):
        changed = PREFIX.replace(b'ai-train=no', b'ai-train=yes')
        self.assertNotEqual(changed, PREFIX)
        self.assertFalse(robots_match(changed + self.owned, self.owned))

    def test_duplicate_or_reordered_prefix_fails(self):
        self.assertFalse(robots_match(PREFIX + PREFIX + self.owned, self.owned))
        self.assertFalse(robots_match(self.owned + PREFIX, self.owned))

    def test_missing_origin_fails(self):
        self.assertFalse(robots_match(PREFIX, self.owned))

    def test_unknown_comment_or_whitespace_fails(self):
        for content in (b'# Unknown prefix\n' + self.owned,
                        PREFIX + b'\n' + self.owned,
                        PREFIX + self.owned + b'\n'):
            with self.subTest(content=content[:40]):
                self.assertFalse(robots_match(content, self.owned))


if __name__ == '__main__':
    unittest.main()
