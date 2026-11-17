# Interactive widgets ("Try it", Pro)

Written in `viz-paid/viz-<module>.js` with `VIZ.register('<id>', { ... })` (see `app/js/viz-core.js` and SPEC.md §3, §5).
Content agents place `<div data-viz="<id>"></div>` where the widget explains the text around it, each id once.
Every widget must work at 375 px wide (phone first), use the theme colours from viz-core (`C`), use the numbers of the
course examples as presets, and show the working, not only the answer. Labels: plain words.
Widgets are only for hard topics (processes, look-alike concepts, input-driven numbers). None is built yet.

## Candidates (BAPHY105)

- `m1` `planck-spectrum`: sliders T (three curves); Planck against Rayleigh–Jeans and Wien, peak marker from Wien's displacement law.
- `m1` `compton`: angle slider; Δλ = (h/m<sub>e</sub>c)(1 − cos θ), λ′, scattered-photon and electron energies (preset 90 keV at 60°).
- `m3` `seq-sg`: chain of z/x/z Stern–Gerlach magnets with block toggles and particle counts (preset 2000 atoms).
- `m4` `box-levels`: n and L sliders; ψ<sub>n</sub>, |ψ<sub>n</sub>|<sup>2</sup>, E<sub>n</sub> in eV for an electron.
- `m4` `tunnel`: E, U, L sliders; exact and approximate T with the three-region wavefunction.
- `m5` `bloch`: θ, φ sliders and X/Y/Z/H buttons moving the Bloch vector, with the state written out.
