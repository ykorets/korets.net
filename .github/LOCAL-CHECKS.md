# Local checks — korets.net

Runtime used by CI: Node 22; Python 3. Run from a task worktree.

```sh
# Once per new checkout or changed dependency lockfile:
bash .github/check-local.sh install
# Before a reviewable push (use focused tests during individual edits):
bash .github/check-local.sh quick
# Before marking a candidate ready for review:
bash .github/check-local.sh full
```

The full command stops on failure. Database checks require local Docker and synthetic disposable databases; they must never receive a live database URL or production secrets. For runtime compatibility changes, repeat on each supported Node version. This command checks source only and never authorizes deployment.

Keep the PR draft while iterating. Changing it to ready for review starts independent GitHub validation on its current source. Every later push to a ready PR runs again: return it to draft for prolonged iteration. A skipped draft check, local test result or cancelled run is not release evidence. Check the exact final commit and deployed version after an authorized release.

Record local results in the PR body: commit, Node version, commands, outcomes and untested risks. Do not upload logs containing private data. Recheck changed code/dependencies; do not repeat an unrelated full suite after a documentation-only edit. No blanket test-count targets.
