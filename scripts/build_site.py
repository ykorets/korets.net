"""Package only explicitly listed public files; never publish repository metadata."""
from pathlib import Path
import json, shutil, hashlib, subprocess

ROOT = Path(__file__).resolve().parents[1]
subprocess.run(['node', 'scripts/export_cpa_data.cjs'], cwd=ROOT, check=True)
subprocess.run(['node', 'scripts/check_cpa_exports.cjs'], cwd=ROOT, check=True)
paths = json.loads((ROOT / 'public-files.json').read_text())
assert len(paths) == len(set(paths)), 'Duplicate public path'
out = ROOT / 'dist'
if out.exists():
    shutil.rmtree(out)
out.mkdir()
manifest = {}
for name in paths:
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
required = ['index.html', '_headers', '_redirects', 'cpa/index.html', 'andy/index.html',
            'blackincdashboard/index.html', 'growthcontroldemo/index.html', 'sanctuary/index.html']
assert all(p in manifest for p in required), 'Existing page missing'
commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
(out / 'release.json').write_text(json.dumps({'commit': commit, 'files': len(manifest)}, indent=2) + '\n')
print(f'Packaged {len(manifest)} public files plus release.json for {commit}')
