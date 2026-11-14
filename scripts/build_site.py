"""Package the site: Astro pages plus explicitly listed legacy public files.

The redesigned pages (home, CV, writing, case study, 404) are built by Astro into
.astro-dist/. Legacy static pages (cpa, andy, dashboards, sanctuary, ...) are copied
from public-files.json; where Astro produces the same path, the Astro page wins.
Repository metadata and credentials are never published.
"""
from pathlib import Path
import json, shutil, hashlib, subprocess

ROOT = Path(__file__).resolve().parents[1]
ASTRO_OUT = ROOT / '.astro-dist'
subprocess.run(['npx', '--no-install', 'astro', 'build'], cwd=ROOT, check=True)
astro_files = sorted(p.relative_to(ASTRO_OUT).as_posix() for p in ASTRO_OUT.rglob('*') if p.is_file())
assert astro_files, 'Astro produced no files'
subprocess.run(['node', 'scripts/export_cpa_data.cjs'], cwd=ROOT, check=True)
subprocess.run(['node', 'scripts/check_cpa_exports.cjs'], cwd=ROOT, check=True)
paths = json.loads((ROOT / 'public-files.json').read_text())
assert len(paths) == len(set(paths)), 'Duplicate public path'
out = ROOT / 'dist'
if out.exists():
    shutil.rmtree(out)
out.mkdir()
manifest = {}
for name in astro_files:
    path = Path(name)
    assert not any(part.startswith('.') for part in path.parts), name
    assert name not in ['_worker.js', '_routes.json', '_headers', '_redirects'] and not name.startswith('functions/'), name
    src = ASTRO_OUT / path
    assert not src.is_symlink(), name
    dst = out / path
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dst)
    manifest[name] = hashlib.sha256(dst.read_bytes()).hexdigest()
for name in paths:
    if name in manifest:
        continue  # replaced by the Astro build
    path = Path(name)
    assert not path.is_absolute() and '..' not in path.parts
    assert not any(part.startswith('.') for part in path.parts)
    assert name not in ['_worker.js', '_routes.json'] and not name.startswith('functions/')
    src = ROOT / path
    assert src.is_file() and not src.is_symlink(), name
    dst = out / path
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dst)
    manifest[name] = hashlib.sha256(dst.read_bytes()).hexdigest()
required = ['index.html', '404.html', 'cv/index.html', 'writing/index.html', '_headers', '_redirects', 'cpa/index.html', 'andy/index.html',
            'blackincdashboard/index.html', 'growthcontroldemo/index.html', 'sanctuary/index.html']
assert all(p in manifest for p in required), 'Existing page missing'
commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
(out / 'release.json').write_text(json.dumps({'commit': commit, 'files': len(manifest)}, indent=2) + '\n')
print(f'Packaged {len(manifest)} public files ({len(astro_files)} from Astro) plus release.json for {commit}')
