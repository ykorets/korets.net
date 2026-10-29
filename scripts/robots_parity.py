"""Accept only the owned robots bytes, optionally behind one exact provider prefix."""
from pathlib import Path


# Cloudflare prepends managed policy to the origin's robots.txt. This is the
# exact public prefix observed on korets.net on 2026-10-28 (America/Los_Angeles).
# Unknown policy or owned-file changes must still fail release verification.
# https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/
KNOWN_CLOUDFLARE_PREFIX = (
    Path(__file__).parent / 'fixtures' / 'cloudflare-robots-prefix.txt'
).read_bytes()


def robots_match(actual: bytes, owned: bytes) -> bool:
    return actual == owned or actual == KNOWN_CLOUDFLARE_PREFIX + owned
