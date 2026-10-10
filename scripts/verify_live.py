"""Verify the deployed commit and representative existing routes without submitting forms."""
from pathlib import Path
import concurrent.futures, json, re, sys, time, urllib.request
ROOT = Path(__file__).resolve().parents[1]
BASE = sys.argv[1].rstrip('/')

def normalize(data):
    s = data.decode('utf-8')
    s = re.sub(r'<script\b[^>]*\bsrc=["\']https://static\.cloudflareinsights\.com/beacon\.min\.js[^>]*>\s*</script>', '', s)
    s = re.sub(r'<!-- Cloudflare Web Analytics -->|<!-- End Cloudflare Web Analytics -->', '', s)
    def email(m):
        raw = bytes.fromhex(m.group(1))
        return 'mailto:' + ''.join(chr(x ^ raw[0]) for x in raw[1:])
    s = re.sub(r'/cdn-cgi/l/email-protection#([a-fA-F0-9]+)', email, s)
    s = re.sub(r'<script data-cfasync="false" src="/cdn-cgi/scripts/[^" ]+/cloudflare-static/email-decode.min.js"></script>', '', s)
    return s.strip()

def fetch(path):
    req = urllib.request.Request(BASE + '/' + path + '?release=' + expected['commit'], headers={'Cache-Control':'no-cache'})
    with urllib.request.urlopen(req, timeout=30) as r:
        assert r.status == 200, path
        return r.read()

expected = json.loads((ROOT / 'dist/release.json').read_text())
for attempt in range(12):
    try:
        actual = json.loads(fetch('release.json'))
        if actual == expected:
            break
    except Exception:
        pass
    time.sleep(5)
else:
    raise SystemExit('Expected release has not reached the requested hostname')

paths = ['index.html','cpa/index.html','andy/index.html','andy/sw.js',
         'blackincdashboard/index.html','blackink/index.html','growthcontroldemo/index.html',
         'sanctuary/index.html','ai/index.html','cv/index.html','robots.txt','sitemap.xml']
def check(path):
    expected_data = (ROOT / 'dist' / path).read_bytes()
    actual_data = fetch(path)
    assert (normalize(actual_data) == normalize(expected_data) if path.endswith('.html') else actual_data == expected_data), f'Content mismatch: {path}'
    return path
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for path in pool.map(check, paths):
        print('PASS', path)
print('Verified deployed commit', expected['commit'])
