# Interactive widgets ("Try it", Pro)

Written in `viz-paid/viz-<module>.js` with `VIZ.register('<id>', { ... })` (see `app/js/viz-core.js` and SPEC.md §3, §5).
Content agents place `<div data-viz="<id>"></div>` where the widget explains the text around it, each id once.
Every widget must work at 375 px wide (phone first), use the theme colours from viz-core (`C`), use the numbers of the
course examples as presets, and show the working, not only the answer. Labels: plain words.

## Module 1 — `viz-paid/viz-m1.js`

- `series-parallel` — Up to 3 resistors (sliders/inputs, Ω) and a supply V. Toggle **Series / Parallel**. Draws the
  circuit, shows R<sub>eq</sub> with the formula filled in, total current, and the voltage across / current through each
  resistor (voltage division in series, current division in parallel). Checks that KVL (series) or KCL (parallel) adds up.
- `source-convert` — Voltage source V in series with R ⇄ current source I = V/R in parallel with R. Edit either side; the
  other updates. A load R<sub>L</sub> slider shows the same load current and voltage from both forms.
- `mesh-solver` — The course's two- and three-mesh examples as presets (values from `src/m1/source-notes.md`, verified by
  `tools/check-m1.js`), editable values. Shows the mesh equations, the determinant (Cramer's rule) step by step, the mesh
  currents and the branch currents with direction arrows on the circuit.
- `thevenin` — A preset network from the course (the Thevenin example) reduced step by step: remove load → V<sub>th</sub> →
  kill sources → R<sub>th</sub> → equivalent circuit. Load slider: I<sub>L</sub> = V<sub>th</sub>/(R<sub>th</sub>+R<sub>L</sub>) and the power
  curve with the maximum at R<sub>L</sub> = R<sub>th</sub> (label that as Extra).
- `ac-wave` — Sinusoid v = V<sub>m</sub> sin(ωt + φ). Sliders V<sub>m</sub>, f, φ. Readouts: T, ω, V<sub>rms</sub> = 0.707 V<sub>m</sub>, V<sub>avg</sub> (half cycle)
  = 0.637 V<sub>m</sub>, form factor 1.11, peak factor 1.414. A second wave for phase difference (leading / lagging), with a
  rotating phasor beside it.
- `rlc-phasor` — Series circuit picker **RL / RC / RLC**. Sliders R, L, C, f (V fixed or editable). Readouts: X<sub>L</sub>, X<sub>C</sub>,
  Z, I, phase angle, power factor (lagging/leading), P, Q, S with the power triangle, and the phasor diagram. RLC: resonance
  marker at f<sub>r</sub> = 1/(2π√LC) and the current-vs-frequency curve. Presets: the course RL/RC/RLC examples.
- `dc-machine` — DC machine EMF E = PφZN/(60A) with lap (A = P) / wave (A = 2) toggle; Generator mode: V = E − I<sub>a</sub>R<sub>a</sub>
  (shunt / series / long- or short-shunt compound); Motor mode: E<sub>b</sub> = V − I<sub>a</sub>R<sub>a</sub>, speed and torque. Presets: the course
  generator and motor examples (use the corrected values in source-notes).
- `transformer` — Core with two windings. Sliders N<sub>1</sub>, N<sub>2</sub>, V<sub>1</sub>, f, load. Readouts: K, V<sub>2</sub>, I<sub>1</sub>/I<sub>2</sub>, E = 4.44 f N Φ<sub>m</sub>,
  step-up / step-down label; animated alternating flux in the core.
- `induction-motor` — Three stator phases with the rotating magnetic field animated; sliders f and poles P give
  N<sub>s</sub> = 120f/P; a slip slider gives rotor speed N = N<sub>s</sub>(1 − s) and rotor frequency s·f; the rotor visibly lags the field.

## Module 2 — `viz-paid/viz-m2.js`

- `opamp-gain` — Toggle **Inverting / Non-inverting**. Sliders for the two resistors and the input amplitude; draws the input and
  output waves (output inverted for the inverting circuit), readouts gain, output amplitude and phase, with the working.
  Presets are the course examples (10 kΩ / 100 kΩ gives −10; 10 kΩ / 90 kΩ gives +10). Placed in `m2-opamp-apps`.
- `bjt-currents` — Sliders β and I<sub>B</sub>. Bars for I<sub>B</sub>, I<sub>C</sub>, I<sub>E</sub>; readouts α and the I<sub>B</sub> share; working
  with I<sub>C</sub> = βI<sub>B</sub>, I<sub>E</sub> = (1 + β)I<sub>B</sub>. Preset β = 100, I<sub>B</sub> = 50 µA. Placed in `m2-bjt-gains`.
- `radar-range` — Echo time slider (µs); draws the pulse out and back and the target; R = ct/2 with working. Preset 100 µs = 15 km.
  Placed in `m2-radar`.

## Module 4 — `viz-paid/viz-m4.js`

- `rolling-draft` — Sliders t0, t1, L0 (width unchanged). Draws the strip before and after the rolls; readouts draft = t0 − t1, new length from t0·L0 = t1·L1, and reduction %. Preset 20 mm to 17 mm gives 3 mm. Placed in `m4-rolling`.
- `mech-dof` — Sliders N, P1, P2. Big F readout from F = 3(N − 1) − 2P1 − P2 with the working and a mechanism / structure / over-constrained label. Preset slider crank N = 4, P1 = 4 gives F = 1. Placed in `m4-links-dof`.

## Module 3 — `viz-paid/viz-m3.js`

- `scale-calc` — Actual length (mm) and a scale (2:1, 5:1, 1:1, 1:2, 1:5, 1:10, 1:100). Bars for actual and drawn length,
  readouts scale factor, drawn length and kind (enlarged / full / reduced), working line, reminder that the true size is written.
  Preset 250 mm at 1:5 = 50 mm (slide L1-20). Placed in `m3-sheets`.
- `ortho-angle` — Animation. Toggle **First angle / Third angle** and a mode: **Views** (the slide-18 block with front, top and left side views around XY), **Turn the HP** (side view of VP and HP; the HP swings 90° about XY into the VP, carrying the top view down in first angle or up in third angle) and **Unfold the box** (the glass box opens out around the front view, rear view last). Progress slider and Replay; jumps to the end under reduced motion. Placed in `m3-ortho-basics`.
- `solid-views` — Pick a solid standing on its base on the HP (hexagonal pyramid 30/60, square pyramid 40/60, triangular
  prism 40/50, square prism 35/50, pentagonal prism 30/60) and the angle of a base edge to the VP. Draws the top view and the
  projected front view with hidden edges dashed (computed from face directions, same method as tools/figs/m3d.js); readouts
  hidden edge count and front view width. Placed in `m3-solids-hp`.
