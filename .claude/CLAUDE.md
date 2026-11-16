# BAPHY105 Notes (Engineering Physics study site): start here

Built 16-11-2026 from the baeee101-notes shell (see notes-roadmap/new-subjects/PIPELINE.md and
notes-roadmap/content-review/ALL-SITES-CHECKLIST.md: the owner's 10 conditions apply).

## Rules (owner's)
- Check the 5-hour limit (mcp__ccd_session_mgmt__get_usage) before each major step; stop at 95%.
- Never Haiku. One agent at a time.
- Never put on the site: registration numbers, faculty names, class numbers, or the word "slides".
- Before any summary: `node tools/build.js`, `node tools/validate.js --all`, `node tools/qa.js`, `node tools/syllabus-check.js`.
- Commit locally; never push until the owner types "push". Payments stay as `api/_mode.json` says.
- Sources: `src/vtop/` (VTOP downloads, gitignored, delete when finished), `src/papers/` (past papers),
  `content/vtop-syllabus.json` (VTOP "Course Syllabus Modules"). Preview: Projects launch.json `baphy105-notes-app` (port 4185).
