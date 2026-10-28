# Blog delivery flow review — 28 October 2026

The publication contains 117 indexable pages, 105 catalog guides, eight topic directories, ten supplement comparisons and two translated eSIM planning pages. The local checks cover search/topic/market/language filters, guide-first catalog links, static contents anchors, disclosures, metadata, local images, fonts, source manifests and sitemap consistency.

## Corrections

- Added a shared `npm run check` entry point grouping the checks already used by GitHub's SEO workflow. The existing `seo:live:test` entry point now includes the task-runner regression test, so CI covers it without a workflow-file change.
- Added `node scripts/run-task.js <task> [task ...]` for the Node-only scripts in `package.json`. It uses the running Node executable without npm or a shell, and stops at the first failing command. This also fixes the release simulation's dependency on resolving `npm` as a native executable on Windows.
- Used a directory junction for the isolated release test's dependencies on Windows, retaining a directory symlink on other platforms.
- Added cross-platform text line-ending rules to keep generated files at LF while retaining CRLF for Windows command files.
- Added regression coverage for task sequencing, failure propagation, missing tasks and unsupported non-Node commands.

## Verification

The production HTTP/HTML audit, performed before the browser attempt, passed all 117 sitemap URLs with no issues. The sitemap matches the checkout; listed URLs return HTTP 200 with static main content, matching canonicals and no indexing restrictions. Results are retained in `audits/sitemap-live-2026-10-28.json`. This is technical availability evidence, not a measurement of search indexing, traffic, sales or offer eligibility.

The full build completed, and generated HTML, assets, content data, redirects and sitemap matched the existing committed output. All six local validators passed. Three live-check unit tests, three publication tests and the task-runner regression test passed using the bundled Node 24 runtime. The release test replayed all three future articles in an isolated copy and validated the resulting pages at each step. GitHub CI remains configured for Node 22.

The older standalone `.tools/node22.exe` initially failed to create a directory in the default Windows temporary location (`EPERM`); the current bundled runtime completed that operation and the full test. A second run with Node 22.23.4 and a writable temporary directory also passed the task-runner test and all three publication tests. This environmental failure is distinct from the Windows npm invocation and symlink issues corrected in the test.

## Remaining operational limits

One editorial article is released and three complete drafts remain unreleased. Their historical dates do not trigger publication during a build. Each future release still needs current source review and the documented publication procedure; this maintenance does not refresh supplier review dates or release offers.

The browser approval gate denied opening the production site, so visual inspection was not completed and was not retried through another browser surface. Existing filter tests execute the actual client script, but do not replace a visual browser review. No current affiliate-account, checkout, Search Console or sales audit was performed. Successful push and deployment checks must be assessed separately from local validation.

GitHub's previous [SEO validation run](https://github.com/gabrielhp11/blog-travel/actions/runs/40686698270) failed before starting any steps. Its check annotation states: “The job was not started because your account is locked due to a billing issue.” Local checks can run independently, but restoring hosted Actions requires resolving that account issue. No billing settings were changed.

The first push was rejected because the configured token lacks `workflow` permission. The proposed workflow-file changes were restored to the existing remote version in a follow-up commit, without rewriting history. The portable tests remain integrated through `package.json`. The existing workflow still only checks tracked build differences; delivery must also inspect untracked generated files with `git status --short`.
