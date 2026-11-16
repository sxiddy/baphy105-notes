# Adding a new module

Everything about which modules exist, and which are free, lives in one file: `content/modules.json`.

## 1. Register the module

Add an entry to `content/modules.json`:

```json
{
  "id": "m5",
  "num": "05",
  "title": "Polymers",
  "free": false,
  "chunks": ["H", "I"],
  "questions": "q-M5.js",
  "syllabus": "One or two sentences from the syllabus slide."
}
```

- `id` is `m` + the module number. Every topic, figure and question id in that module starts with it (`m5-...`).
- `free: true` opens it to everyone; `false` puts it behind the ₹50 payment together with the other paid modules.
- `chunks` are the content files for the module, in reading order (`content/chunk-H.js`, `content/chunk-I.js`).
- Modules appear in the sidebar in the order they are listed.

## 2. Add the content

| File | What goes in it | Format |
|---|---|---|
| `content/chunk-<X>.js` | topics, tabs, figures, flashcards | `CHUNK({...})`, see SPEC.md §1 |
| `content/q-M5.js` | scenario questions | `QUESTIONS({...})`, SPEC.md §2 |
| `content/summary-m5.js` | module summary page | `SUMMARY({...})` |
| `src/m5/…` | slide renders and images used for figures | from the PPTX/PDF |

Interactive diagrams: put the code for a **free** module in `app/js/viz/`, for a **paid** module in `viz-paid/` (so it is only sent to paying users). Place them in notes with `<div data-viz="id"></div>`.

## 3. Build, check, publish

```bash
node tools/fig.js content/chunk-H.js      # crop figures, check tmp/preview/
node tools/validate.js --all              # 0 errors
node tools/build.js                       # regenerates app/ and protected/
node tools/qa.js                          # every route, tab and diagram loads
git add -A && git commit -m "Add Module 5" && git push
```

Vercel deploys on push. Nothing in `app/js/app.js`, `gate.js` or `api/` needs editing: the sidebar, home page, lock cards, paywall text, free/paid file lists and image access all follow `content/modules.json`.
