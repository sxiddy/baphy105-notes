# BAPHY105 Notes — shared build spec

Study notes for **Engineering Physics (BAPHY105, VIT)**. The notes are free; Pro features (all flashcards, formula sheet,
answers, widgets, quiz…) are split out server-side by `tools/build.js`, so content files simply contain everything.

| Module | Source | Title |
|---|---|---|
| `m1` | VTOP lecture notes Module 1, Planck/Compton/de Broglie/wavefunction notes (`src/text/vtop__*`) | Wave–particle duality |
| `m2` | VTOP Module 2 lecture notes, Basics of linear algebra, Pauli matrices | Mathematical foundations of quantum mechanics |
| `m3` | VTOP Module 3 lecture notes, postulates, expectation values, sequential SG | Postulates of quantum mechanics |
| `m4` | VTOP Module 4 lecture notes, particle in a box, tunnelling and STM | Applications of quantum mechanics |
| `m5` | VTOP Module 5 lecture notes | Elements of quantum computing |

Page renders: `src/<m>/pages/pNN.png` (open with Read to see diagrams). Render missing ones with PyMuPDF
(Python only for rendering into src/; every repo file is written with Node or the Write tool).

Never put on the site: registration numbers, faculty names, class numbers, or the slide author's name. Never say
"slide"/"slides" in notes text (say "the course material" if you must refer to it).

## 1. Content files (written by content agents)

One file per chunk: `content/chunk-<X>.js` (X like `1a`, `1b`). Plain JavaScript calling a global. **Use backtick
template strings for all HTML** (never a backtick or `${` inside the HTML).

```js
CHUNK({
  chunk: '1a',
  module: 'm1',
  topics: [
    {
      id: 'm1-ydse',                    // unique, kebab-case, prefixed with the module id
      title: 'Mesh analysis',
      short: 'Mesh analysis',           // sidebar label, <= 24 chars
      blurb: 'One or two plain sentences on what the topic covers.',
      source: 'Pages 10–15',
      tabs: [ { title: 'The idea', html: `<p class="lead">...</p>` } ],   // 3–7 tabs
      flashcards: [ { front: '...?', back: '...' } ],   // 6–12; the first 3 are the free samples, so make them the best
      oneLiners: [ '...' ],                              // 4–10 exam one-liners
      formulas: [ { name: 'de Broglie wavelength', html: `λ = h/p`, note: '...' } ]   // may be []
    }
  ],
  figures: [
    { id: 'm1-ydse', src: 'm1/pages/p11.png', crop: null, caption: 'What to notice, one or two sentences.', alt: 'Description for screen readers.' }
  ]
});
```

### Figures: redrawn SVGs

Every meaningful diagram, set-up, graph or table-as-image in the source is **redrawn** as `figs-svg/<figure id>.svg`
(rules in `figs-svg/README.md`: 600-wide viewBox, transparent, colours only via the dt/ds/df classes, smallest text 22,
labels 24–26, stack panels vertically, nothing overlapping). In figures[], `src` is the page render the drawing comes
from (it must exist), `crop` is null. The app credits the VIT course material under the caption. Place with
`<figure data-fig="id"></figure>` (once each). Apparatus and plots: every element labelled (source, slits, magnets, axes with units), values
and state labels (|+z⟩, ψ<sub>n</sub>, E<sub>n</sub>) exactly as in the source. Fix clear source mistakes in the drawing
and say so in a heads-up note. Look at your SVG: render it to PNG (e.g. headless Chrome, or
`node tools/figs/phone-preview.js`) and open the PNG with Read before you call it done.

### Tab HTML vocabulary

Only these tags: `p h3 h4 b em sub sup br ul ol li table thead tbody tr th td div span figure details summary small code`. Only these classes/attributes:

| Markup | Use |
|---|---|
| `<p class="lead">` | First paragraph of a tab: the idea in 1–2 sentences. At most one per tab. |
| `<p>`, `<ul>`, `<ol>` | Normal text. Keep list items short (one line where possible). |
| `<b>` | **Must-remember** term, value or phrase. Rendered white; blanked in Recall mode. Bold a noun phrase or number, never a whole sentence. Roughly one per sentence or bullet, not more. Do not use `<strong>`. |
| `<h3>` | Sub-heading inside a tab (use sparingly; tab title is already the heading). |
| `<div class="eq">…</div>` | A displayed equation / reaction. Optional `data-label="At anode"`. Use `→`, `⇌`, `⟶`, `Δ`, `°`, `<sub>`, `<sup>` (e.g. `Zn → Zn<sup>2+</sup> + 2e<sup>−</sup>`). One reaction per `.eq`. |
| `<span class="frac"><span>top</span><span>bottom</span></span>` | Stacked fraction inside `.eq` (e.g. Nernst `0.0591/n`, Scherrer `Kλ/(β cos θ)`). |
| `<table class="tbl">` | Comparisons (with `<thead>`). Great for "A vs B vs C". |
| `<div class="kv"><div><span>Label</span><b>Value</b></div>…</div>` | Spec sheet / fact grid (operating temperature, electrolyte, efficiency…). |
| `<div class="vs"><div class="side"><h4>…</h4>…</div><div class="side"><h4>…</h4>…</div></div>` | Two-up contrast (2 or 3 `.side`). |
| `<ol class="steps"><li><b>Step name</b> what happens</li>…</ol>` | A real process/sequence (numbered, animated). Only for true sequences. |
| `<div class="chips"><span class="chip">…</span>…</div>` | Short example lists (materials, applications). |
| `<div class="note why">` | Intuition: the reason behind a fact. |
| `<div class="note exam">` | How this gets asked / what to write in an exam. |
| `<div class="note trap">` | A common mix-up. |
| `<div class="note heads-up">` | The course material gives a value/statement that differs from the textbook standard. Keep the source's version in the main text (it's what the exam expects) and explain the standard value here. |
| `<div class="note example">` | A named example / case. |
| `<div class="worked"><div class="given">…</div><div class="solve">…</div><div class="result">…</div></div>` | Worked numerical: given values, steps (use `<p>` / `.eq` inside), boxed result. |
| `<div class="mnemonic">` | A memory hook (only if genuinely useful). |
| `<details class="more"><summary>…</summary>…</details>` | Optional extra depth, collapsed. |
| `<figure data-fig="id"></figure>` | Source diagram (see Figures). |
| `<div data-viz="id"></div>` | Interactive/animated diagram from the list in §3. Place it where it explains the text around it. Each viz at most once across the whole app. |

Notes (`.note`) take a `<p>` or plain text inside; the app adds the label. Do not use inline styles, ids, other classes, links, images, or emoji.

### Writing style (important: the user explicitly does not want AI-sounding text)

Write like the sharpest student in the class explaining it to a friend the night before the exam: plain words, short sentences, concrete, confident, a little warm. Concise, but **nothing from the source is dropped**.

- Every source fact must survive: every definition, list item, example, material, number, unit, equation, advantage, disadvantage, application, named person/year. Compress wording, not content. Merge repeated slides.
- Order inside a topic: what it is → how it works → why it behaves that way → where it's used / pros & cons → how it's examined.
- Explain the *why* when the source only states the *what*, briefly and correctly (e.g. why electrons can't cross the electrolyte, why a smaller quantum dot emits bluer light). Keep added explanation accurate to standard engineering; do not invent facts, numbers or examples that contradict the source.
- Use tables, `.kv`, `.vs`, `.steps`, `.chips` to replace walls of text. A tab should be readable in 1–3 minutes.
- Banned: "delve", "crucial", "pivotal", "vital role", "landscape", "realm", "harness", "leverage", "seamless", "robust", "unlock", "game-changer", "In summary", "In conclusion", "In essence", "It's worth noting", "It is important to note", "Let's dive", "Moreover", "Furthermore", "Additionally", "not only … but also", "isn't just … it's", rhetorical questions as openers, em-dash (—) asides, emoji, exclamation marks, "Imagine…" openers. Headings/tab titles are plain nouns ("Why lithium", "Charge & discharge"), not clever.
- Voice: second person is fine ("you'll see", "notice that"). No hedging filler.
- Physics formatting: "6.626 × 10<sup>−34</sup> J s", "0.071 nm", "5 eV", kets |ψ⟩, bras ⟨φ|, ℏ; subscripts E<sub>n</sub>, k<sub>B</sub>, m<sub>e</sub>; real minus sign −; en dash for ranges; × for multiplication.
- **Tables only for comparisons** (A vs B). Lists of facts go in lists, `.kv` or `.steps`.
- Anything beyond the course material (extra depth, a standard value, a real-world link) is labelled **Extra:** — a `details.more` whose summary starts "Extra:", or a paragraph starting <b>Extra:</b>. A short `.note why` that only explains a source fact needs no label.
- Worked numericals: every number comes from a script check (`node tools/check-numericals.js` covers every module, the MCQs and the paper answers). Where the source has a slip, keep the source's question, give the correct working, and explain the slip in `.note heads-up`. Known slips are recorded in heads-up notes and in `src/PAPER-MAP.md`.

---

## 2. Questions files (written by question agents)

`content/q-<X>.js`:

```js
QUESTIONS({
  chunk: 'B',
  questions: [
    {
      id: 'm2-b-01',
      module: 'm2',
      topic: 'm2-fuel-cells-sofc',          // a topic id from the chunk (or 'summary' for module-wide/cross questions)
      type: 'decide',                        // decide | predict | explain | troubleshoot | design | numerical | interpret
      level: 2,                              // 1 warm-up, 2 solid, 3 stretch
      q: `<p>A steel plant wants on-site power from its <b>coal gas</b> (H<sub>2</sub> + CO with traces of sulphur) and also needs process heat. The engineers are choosing between a PEMFC stack and an SOFC stack. Which should they pick?</p>`,
      options: [ 'PEMFC: it starts fast and runs cool', 'SOFC: it takes CO as fuel, tolerates some sulphur and its hot exhaust can be reused', 'Either: both need pure H₂', 'Neither: fuel cells cannot use coal gas' ],  // 4 options or null
      correct: 1,                            // index into options, or null
      answer: `<p><b>SOFC.</b> ...one or two sentence verdict...</p>`,
      explain: `<p>...the reasoning, tied to specific facts from the notes...</p>`,
      points: [ 'SOFC runs at 800–1000 °C and accepts H₂ and CO', 'Relatively tolerant of small amounts of sulphur → usable with coal gas', 'PEMFC needs pure H₂ (Pt catalyst poisoned; low temperature)', 'High-grade waste heat → cogeneration' ]   // what an examiner wants to see
    }
  ]
});
```

- **Understanding-based, not recall.** Never "Define…", "List…", "State…", "Differentiate A and B", "What is…". Instead put the student in a situation: an engineer choosing between two systems, a lab result to interpret, a device that misbehaves, a design constraint, a "what happens if we change X", a numerical embedded in a real context. The student has to use the concept to answer.
- Example of the right flavour: "A workshop on a 230 V supply must pick between two motors… which should it pick and why?"
- Answers must be correct and consistent with the notes/source. The verdict comes first, then reasoning, then `points`.
- Numericals: show full working in `explain` (use `.worked` blocks), with units, sensible significant figures, and the source's conventions (the formulas and conventions of the course material).
- Give `options` (4, one correct, plausible distractors that reflect real misconceptions) to roughly **half** the questions; the rest are open (options: null, correct: null).
- Same HTML vocabulary as tabs. Same style rules.

---

## 3. Interactive widgets (`data-viz` ids)

All widgets are Pro: `viz-paid/viz-<m>.js`, each one `VIZ.register('id', {...})` (read `app/js/viz-core.js`). Content
agents place `<div data-viz="id"></div>` only for ids listed in `WIDGETS.md` (free readers see a small locked card
there). Validation accepts only ids that a widget file registers.

## 4. Design tokens (single dark theme)

```
--bg #151517      page         --text #b3b3bb   body text
--bg-2 #1b1b1e    sidebar      --text-dim #80808a
--surface #202024 cards        --text-faint #5c5c66
--surface-2 #27272c raised     --white #f4f4f6  highlights / headings
--line #2f2f35    borders      --line-2 #3a3a41
Science colours (diagrams): electron #7cc0ff · cation / Li⁺ / H⁺ #ffb56b · anion / O²⁻ #c7a4ff · hole #ff8da1 · photon #ffe07a · heat #ff7b5c · good #86d4a9 · warn #e9c46a · bad #f08c8c · metal #9aa0a8 · graphite #5a5f66
Fonts: display "Source Serif 4" (headings), body "Hanken Grotesk", mono "JetBrains Mono" (numbers, labels, readouts)
```

---

## 5. Tooling (use node; Node for repo files)

- `node tools/validate.js content/<file>.js` — schema, allowed HTML, figure/viz references, style warnings. Get it to **0 errors** and clear the style warnings.
- `node tools/viz-snap.js app/js/viz/<file>.js <viz-id> [--wait ms] [--click "button text"] [--set "label=value"] [--select "label=value"] [--out name]` — mounts a diagram headlessly (jsdom), runs its animation, and writes `tmp/viz/<name>.png` of each `svg.viz-svg`, plus a dump of buttons/sliders/readouts/caption and runtime errors. Layout APIs (`getBBox`, `getTotalLength`, `getPointAtLength`) are stubbed to zero there, so compute geometry yourself (parametric paths / polylines) instead of relying on them.
- SVG rendering rules for diagrams: the `svg.viz-svg` root inherits `fill: #b3b3bb`; give every shape an explicit `fill` (`none` for strokes-only). Text inherits the body font (Hanken Grotesk); for numbers/readouts inside SVG use `font-family="JetBrains Mono, ui-monospace, monospace"`. Minimum font-size 13 in a ~640-wide viewBox.
- `node --check <file.js>` for syntax.
