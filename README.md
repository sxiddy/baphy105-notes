# BAPHY105 Notes

Engineering Physics (BAPHY105, VIT) as a dark, tabbed study app covering all five modules of the quantum mechanics course: wave–particle duality, the mathematics of quantum mechanics (vector spaces, Dirac notation, operators), the postulates and the Schrödinger equation, potential wells and tunnelling, and quantum computing (qubits, Bloch sphere, entanglement, gates). Notes with redrawn diagrams, recall mode, highlights, personal notes, search, a question bank of balanced MCQs per module, quiz, flashcards, formula sheet and six recent CAT/FAT papers with model answers linked to the notes.

Run locally:

    node tools/build.js
    node tools/serve.js app 4173   # then open http://localhost:4173

- `content/` notes (`chunk-*.js`), questions (`q-*.js`), past papers (`papers-free.js` questions, `papers-pro.js` answers)
- `tools/check-numericals.js` recomputes every worked number in the notes, the MCQs and the paper answers
- `app/` the app (open `app/index.html`); `app/img/` figures
- `tools/` build, validation, figure and QA scripts (`npm install` inside `tools/` for sharp/jsdom)
