# korets.net

Canonical source for the existing Cloudflare Pages website (`korets-net`).

## Publish

Push to `main`. GitHub Actions validates the public file allowlist, packages the site, deploys to the existing Pages production branch `korets.net`, then verifies the release commit and twelve public routes. Pull requests validate without production credentials. Concurrent production runs are serialized.

Run `npm ci && npm run build` locally. The generated `dist/` folder contains only paths listed in `public-files.json` and a generated `release.json`; repository files, scripts and credentials are excluded. Add any new public asset to the allowlist. Existing `_headers` and `_redirects` are retained. This is a static-only deployment, with no Functions bundle.

The dedicated Cloudflare credential is configured in encrypted GitHub environment `production` as `CLOUDFLARE_API_TOKEN`. Only `main` may use this environment. Never commit credentials or export a personal OAuth session to CI. The Cloudflare account ID is public configuration.

## Verify and recover

`npm run verify:live` compares the published commit and homepage, CPA, Andy, Black Inc dashboard, Black Ink, Growth Control demo, Sanctuary, AI, CV, robots and sitemap against the local build. It ignores only Cloudflare's known email encoding and injected analytics in HTML. It performs GET requests only.

For rollback, revert the incorrect source commit and push `main`; the same workflow redeploys and verifies it. The pre-pipeline production deployment is `515ffb41-635a-42bf-89f2-b2e474ebe482`. Direct local deployment is outside the normal publishing process.

All 143 pre-existing public source/config files were reconciled from the preserved October 8 production package before enabling CI. The initial homepage update groups Growth Control and Stretch-Tent.net under My Businesses, and Behind the Watt and Kurenivka Camp under Pet Projects & Hobbies.

Deployment access configured October 9, 2026: account-owned token `korets-net-github-deploy`, Pages Write only, native expiration October 10, 2027. The production environment permits the `main` branch only and no tags. This setup commit triggers the first credentialed main-push acceptance run.
