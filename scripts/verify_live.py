"""Verify the deployed commit and representative existing routes without submitting forms."""
from pathlib import Path
import concurrent.futures, json, re, subprocess, sys, time
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
    # Use curl's standard HTTP client: Cloudflare rejects Python urllib's default
    # client signature with 403/1010 even for these public, unauthenticated files.
    return subprocess.check_output([
        'curl', '--fail', '--silent', '--show-error', '--location',
        '--max-time', '30', '--header', 'Cache-Control: no-cache',
        BASE + '/' + path + '?release=' + expected['commit'],
    ])

expected = json.loads((ROOT / 'dist/release.json').read_text())
last_error = 'Published commit differs from expected commit'
for attempt in range(12):
    try:
        actual = json.loads(fetch('release.json'))
        if actual == expected:
            break
    except Exception as exc:
        last_error = str(exc)
    time.sleep(5)
else:
    raise SystemExit('Cannot verify expected release: ' + last_error)

paths = ['index.html','cpa/index.html','cpa/model.js','cpa/app.js','cpa/scenarios.js','cpa/glossary.js','cpa/audit/index.html','cpa/structures/index.html','cpa/overview/index.html','cpa/overview/plan.js','cpa/market/index.html','cpa/market/app.js','cpa/market/style.css','cpa/market/data.json','andy/index.html','andy/sw.js',
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
