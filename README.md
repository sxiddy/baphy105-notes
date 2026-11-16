# BAPHY105 Notes

Engineering Physics (BAPHY105) modules 2–4 as a dark, tabbed study app: notes with the slide diagrams, recall mode, highlights, personal notes, search, a scenario-based question bank, quiz, flashcards and formula sheet.

Run locally:

    node tools/build.js
    node tools/serve.js app 4173   # then open http://localhost:4173

- `content/` notes (`chunk-*.js`), questions (`q-*.js`), module summaries (`summary-*.js`)
- `app/` the app (open `app/index.html`); `app/img/` figures
- `tools/` build, validation, figure and QA scripts (`npm install` inside `tools/` for sharp/jsdom)
