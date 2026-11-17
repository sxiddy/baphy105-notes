# Interactive widgets ("Try it", Pro)

Written in `viz-paid/viz-<module>.js` with `VIZ.register('<id>', { ... })` (see `app/js/viz-core.js` and SPEC.md §3, §5).
Content agents place `<div data-viz="<id>"></div>` where the widget explains the text around it, each id once.
Every widget must work at 375 px wide (phone first), use the theme colours from viz-core (`C`), use the numbers of the
course examples as presets, and show the working, not only the answer. Labels: plain words.
Widgets are only for hard topics (processes, look-alike concepts, input-driven numbers). Built: see the list below.

## Candidates (BAPHY105)

- `m1` `planck-spectrum`: sliders T (three curves); Planck against Rayleigh–Jeans and Wien, peak marker from Wien's displacement law.
- `m1` `compton`: angle slider; Δλ = (h/m<sub>e</sub>c)(1 − cos θ), λ′, scattered-photon and electron energies (preset 90 keV at 60°).
- `m3` `seq-sg`: chain of z/x/z Stern–Gerlach magnets with block toggles and particle counts (preset 2000 atoms).
- `m4` `box-levels`: n and L sliders; ψ<sub>n</sub>, |ψ<sub>n</sub>|<sup>2</sup>, E<sub>n</sub> in eV for an electron.
- `m4` `tunnel`: E, U, L sliders; exact and approximate T with the three-region wavefunction.
- `m5` `bloch`: θ, φ sliders and X/Y/Z/H buttons moving the Bloch vector, with the state written out.

## Built (BAPHY105)

- `m3` `seq-sg` (viz-paid/viz-m3.js): topic m3-seq-sg, tab "z → x → z, stage by stage". Three magnets with axis x/y/z and pass +/−; Fire 1000 atoms (binomial draws with P = |⟨out|in⟩|²) against expected counts; explanation line.
- `m4` `box-levels` (viz-paid/viz-m4.js): topic m4-box1d, tab "Levels and densities". n 1–8, a 0.2–2 nm, ψ / |ψ|² toggle, nodes, energy ladder; 1 nm gives E₁ = 0.377 eV.
- `m4` `tunnel` (viz-paid/viz-m4.js): topic m4-tunnelling, tab "The three regions". E, U, L sliders; Re ψ from exact value-and-slope matching; exact T (sinh, or sin when E ≥ U) and 16(E/U)(1 − E/U)e^{−2k₂L}; 5 eV, 10 eV, 0.2 nm gives T = 0.0403.
- `m5` `bloch` (viz-paid/viz-m5.js): topic m5-bloch, tab "Geometry". θ, φ sliders, drag to turn the view, X/Y/Z/H gates (animated 180° turns), Reset, six presets, α, β, P(0), P(1), Bloch vector.
