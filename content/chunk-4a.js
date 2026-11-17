CHUNK({
  chunk: '4a',
  module: 'm4',
  topics: [
    {
      id: 'm4-box1d',
      title: 'Particle in a one-dimensional infinite potential well',
      short: '1D potential well',
      blurb: 'Full derivation of the energy eigenvalues Eₙ = n²h²/8ma² and normalised eigenfunctions √(2/a) sin(nπx/a), with the first three levels and probability densities drawn.',
      source: 'Module 4 notes §4.1.1–4.1.5, particle-in-a-box notes',
      tabs: [
        { title: 'Derivation', html: `
<p class="lead">A particle of mass m moves freely between two walls it can never cross: an <b>infinite square well</b> (a “particle in a box”).</p>
<div class="eq">V(x) = 0 for 0 ≤ x ≤ a;   V(x) = ∞ elsewhere</div>
<div class="solve"><p><b>1. TISE inside</b> (V = 0): −(ℏ²/2m) d²ψ/dx² = Eψ ⇒ d²ψ/dx² + k²ψ = 0, with <b>k = √(2mE)/ℏ</b>.</p>
<p><b>2. General solution</b> (simple-harmonic type): ψ(x) = A sin kx + B cos kx.</p>
<p><b>3. Boundary conditions:</b> the particle cannot be where V = ∞, so ψ = 0 outside, and ψ is continuous: ψ(0) = 0 and ψ(a) = 0.</p>
<p><b>4.</b> ψ(0) = B = 0 ⇒ ψ = A sin kx.</p>
<p><b>5.</b> ψ(a) = A sin ka = 0 with A ≠ 0 ⇒ <b>ka = nπ</b>, n = 1, 2, 3, … so kₙ = nπ/a.</p>
<p>(n = 0 gives ψ = 0 everywhere, no particle; negative n only flips the sign, the same state.)</p>
<p><b>6. Energy:</b> Eₙ = ℏ²kₙ²/2m:</p></div>
<div class="result">Eₙ = n²π²ℏ²/2ma² = n²h²/8ma²,   n = 1, 2, 3, …</div>
<div class="solve"><p><b>7. Normalise:</b> |A|²∫<sub>0</sub><sup>a</sup>sin²(nπx/a)dx = |A|²(a/2) = 1 ⇒ A = √(2/a).</p></div>
<div class="result">ψₙ(x) = √(2/a) sin(nπx/a),  and Ψₙ(x, t) = ψₙ(x) e<sup>−iEₙt/ℏ</sup></div>
<div class="note exam"><p>The 10-mark question “derive energy eigenvalues and eigenfunctions of a particle in a 1D box” needs: potential with sketch, TISE, general solution, both boundary conditions, ka = nπ, Eₙ, normalisation, ψₙ, and the level/probability diagram. If the box is 0 ≤ x ≤ 3L, put a = 3L: Eₙ = n²π²ℏ²/18mL², ψₙ = √(2/3L) sin(nπx/3L).</p></div>` },
        { title: 'Levels and densities', html: `
<figure data-fig="m4-box"></figure>
<div data-viz="box-levels"></div>
<ul>
<li><b>Ground state</b> n = 1: E₁ = π²ℏ²/2ma² = h²/8ma². It is <b>not zero</b>: a confined particle can never be at rest (zero-point energy, linked to Δx Δp ≥ ℏ/2).</li>
<li><b>First excited</b> n = 2: E₂ = 4E₁. <b>Second excited</b> n = 3: E₃ = 9E₁. The n-th eigenfunction is the (n − 1)-th excited state.</li>
<li>Energies are <b>discrete</b> and grow as <b>n²</b>; the gaps widen: Eₙ₊₁ − Eₙ = (2n + 1)E₁.</li>
<li>Smaller box or lighter particle ⇒ larger energies (E ∝ 1/ma²). For an electron in a 1 nm box E₁ ≈ 0.377 eV; in a 1 Å box ≈ 37.7 eV.</li>
<li>ψₙ has <b>n − 1 nodes</b> inside the box (fitting n half-wavelengths: a = nλ/2, which is de Broglie’s standing-wave condition).</li>
<li>|ψ₁|² is largest in the middle; |ψ₂|² is <b>zero at the centre</b>, so a particle in the first excited state is never found at x = a/2. Classically every point is equally likely.</li>
<li>For large n the peaks crowd together and the average density becomes uniform: the classical limit (correspondence principle).</li>
</ul>` }
      ],
      flashcards: [
        { front: 'Energy levels of a 1D infinite well', back: 'Eₙ = n²π²ℏ²/2ma² = n²h²/8ma², n = 1, 2, 3, …' },
        { front: 'Normalised eigenfunctions of a 1D infinite well', back: 'ψₙ = √(2/a) sin(nπx/a)' },
        { front: 'Boundary conditions in the infinite well', back: 'ψ(0) = 0 and ψ(a) = 0.' },
        { front: 'Why is n = 0 not allowed?', back: 'It gives ψ = 0 everywhere: no particle.' },
        { front: 'Ratio E₁ : E₂ : E₃', back: '1 : 4 : 9' },
        { front: 'Number of nodes inside the box for ψₙ', back: 'n − 1' }
      ],
      oneLiners: [
        'Zero-point energy E₁ = h²/8ma² is never zero.',
        'Eₙ ∝ n²/ma².',
        'In the first excited state the particle is never found at the centre.'
      ],
      formulas: [
        { name: 'Energy', html: `Eₙ = n²h²/8ma²`, note: 'a = box width' },
        { name: 'Eigenfunction', html: `ψₙ = √(2/a) sin(nπx/a)`, note: '' },
        { name: 'Wave number', html: `kₙ = nπ/a = √(2mEₙ)/ℏ`, note: '' }
      ]
    },
    {
      id: 'm4-box3d',
      title: 'Particle in a three-dimensional box',
      short: '3D potential well',
      blurb: 'Separation of variables in a cubic box, the eigenfunctions (2/a)^{3/2} sin sin sin and energies E = (π²ℏ²/2ma²)(nₓ² + n_y² + n_z²).',
      source: 'Module 4 notes §4.2',
      tabs: [
        { title: 'Derivation', html: `
<p class="lead">Extend the well to a cube of side a: V = 0 for 0 ≤ x, y, z ≤ a and ∞ outside.</p>
<div class="solve"><p><b>1. TISE:</b> −(ℏ²/2m)(∂²ψ/∂x² + ∂²ψ/∂y² + ∂²ψ/∂z²) = Eψ.</p>
<p><b>2. Separate:</b> ψ = X(x)Y(y)Z(z). Substitute and divide by XYZ:</p>
<p>(1/X)X″ + (1/Y)Y″ + (1/Z)Z″ = −2mE/ℏ².</p>
<p><b>3.</b> Each term depends on a different variable, so each is a constant: X″ = −kₓ²X, Y″ = −k<sub>y</sub>²Y, Z″ = −k<sub>z</sub>²Z, with E = (ℏ²/2m)(kₓ² + k<sub>y</sub>² + k<sub>z</sub>²).</p>
<p><b>4. Boundary conditions</b> X(0) = X(a) = 0 and the same for Y and Z: each is a 1D box. So kₓ = nₓπ/a etc. and X = √(2/a) sin(nₓπx/a).</p></div>
<div class="result">ψ = (2/a)<sup>3/2</sup> sin(nₓπx/a) sin(n<sub>y</sub>πy/a) sin(n<sub>z</sub>πz/a)<br>E = (π²ℏ²/2ma²)(nₓ² + n<sub>y</sub>² + n<sub>z</sub>²) = (h²/8ma²)(nₓ² + n<sub>y</sub>² + n<sub>z</sub>²),  nₓ, n<sub>y</sub>, n<sub>z</sub> = 1, 2, 3, …</div>
<ul>
<li>Three quantum numbers, one for each direction, and none can be zero.</li>
<li>Ground state (1, 1, 1): E = 3π²ℏ²/2ma² = 3h²/8ma².</li>
<li>For a rectangular box a × b × c: E = (h²/8m)(nₓ²/a² + n<sub>y</sub>²/b² + n<sub>z</sub>²/c²).</li>
</ul>` },
        { title: 'Worked example', html: `
<div class="worked"><div class="given">An electron is in a cubic box of side 1 nm. Find the ground-state and first-excited energies.</div>
<div class="solve"><p>E₀ = h²/8ma² = (6.626 × 10<sup>−34</sup>)²/(8 × 9.1 × 10<sup>−31</sup> × 10<sup>−18</sup>) = 6.03 × 10<sup>−20</sup> J = 0.377 eV.</p>
<p>Ground state (1,1,1): E = 3E₀ = 1.13 eV.</p>
<p>First excited (2,1,1), (1,2,1), (1,1,2): E = 6E₀ = 2.26 eV, three states.</p></div>
<div class="result">1.13 eV (one state) and 2.26 eV (three states)</div></div>
<div class="note"><p>Compare the 1D box of the same width: E₁ = E₀ = 0.377 eV. In 3D the particle is confined in all three directions, so its lowest energy is three times larger.</p></div>` }
      ],
      flashcards: [
        { front: 'Energy in a cubic box', back: 'E = (h²/8ma²)(nₓ² + n_y² + n_z²)' },
        { front: 'Eigenfunction in a cubic box', back: '(2/a)^{3/2} sin(nₓπx/a) sin(n_yπy/a) sin(n_zπz/a)' },
        { front: 'Ground-state energy of a cubic box', back: '3h²/8ma² (state 1,1,1).' },
        { front: 'Why can none of nₓ, n_y, n_z be zero?', back: 'A zero makes one sine factor vanish everywhere, so ψ = 0: no particle.' }
      ],
      oneLiners: [
        'A 3D box separates into three 1D boxes.',
        'Each quantum number starts at 1.',
        'Rectangular box: E = (h²/8m)(nₓ²/a² + n_y²/b² + n_z²/c²).'
      ],
      formulas: [
        { name: '3D box energy', html: `E = (π²ℏ²/2ma²)(nₓ² + n<sub>y</sub>² + n<sub>z</sub>²)`, note: '' }
      ]
    },
    {
      id: 'm4-eigen',
      title: 'Energy eigenvalues and eigenfunctions: orthonormality and expansions',
      short: 'Eigenfunctions',
      blurb: 'Proof that the box eigenfunctions are orthonormal, completeness, expanding a starting wavefunction in them, and probabilities |cₙ|² of each energy.',
      source: 'Module 4 notes §4.1.6–4.1.7, problems 1–2',
      tabs: [
        { title: 'Orthonormal and complete', html: `
<h3>Proof of orthonormality</h3>
<div class="solve"><p>Iₘₙ = ∫<sub>0</sub><sup>a</sup>ψₘψₙ dx = (2/a)∫<sub>0</sub><sup>a</sup>sin(mπx/a) sin(nπx/a)dx.</p>
<p>Use sin α sin β = ½[cos(α − β) − cos(α + β)]: Iₘₙ = (1/a)∫<sub>0</sub><sup>a</sup>[cos((m − n)πx/a) − cos((m + n)πx/a)]dx.</p>
<p>Each integral gives (a/(m ± n)π) sin((m ± n)πx/a) from 0 to a, and sin(integer × π) = 0. So <b>Iₘₙ = 0 for m ≠ n</b>.</p>
<p>For m = n: Iₙₙ = (2/a)(a/2) = 1.</p></div>
<div class="result">∫ψₘψₙ dx = δₘₙ: the eigenfunctions form an orthonormal set.</div>
<h3>Completeness</h3>
<p>Any acceptable wavefunction f(x) on [0, a] can be expanded as</p>
<div class="eq">f(x) = Σ<sub>n=1</sub><sup>∞</sup> cₙψₙ(x),   cₙ = ∫<sub>0</sub><sup>a</sup> ψₙ*(x) f(x) dx</div>
<p><b>|cₙ|²</b> is the probability that an energy measurement gives <b>Eₙ</b>, and Σ|cₙ|² = 1. The state then evolves as Ψ(x, t) = Σcₙψₙe<sup>−iEₙt/ℏ</sup>.</p>
<p>These are the Module 2 ideas (orthonormal basis, completeness, Hermitian Ĥ) applied to functions.</p>` },
        { title: 'Worked expansions', html: `
<div class="worked"><div class="given">Ψ(x, 0) = A x(a − x) for 0 ≤ x ≤ a. Find A, the coefficients cₙ and P(E₁).</div>
<div class="solve"><p>Normalise: |A|²∫<sub>0</sub><sup>a</sup>x²(a − x)²dx = |A|²a⁵/30 = 1 ⇒ A = √(30/a⁵).</p>
<p>cₙ = √(2/a)A∫<sub>0</sub><sup>a</sup>x(a − x) sin(nπx/a)dx (integrate by parts twice) = 8√15/(nπ)³ for odd n, and 0 for even n (the function is symmetric about a/2, the even-n sines are antisymmetric).</p>
<p>c₁ = 8√15/π³ ≈ 0.9993, so P(E₁) = |c₁|² ≈ 0.9986.</p></div>
<div class="result">A = √(30/a⁵); cₙ = 8√15/(nπ)³ (odd n), 0 (even n); P(E₁) ≈ 0.999: the shape is almost the ground state.</div></div>
<div class="worked"><div class="given">At t = 0 the particle is equally likely anywhere in the left half: Ψ = A for 0 ≤ x ≤ a/2, 0 for the right half. Find A, cₙ and P(E₁).</div>
<div class="solve"><p>|A|²(a/2) = 1 ⇒ A = √(2/a).</p>
<p>cₙ = (2/a)∫<sub>0</sub><sup>a/2</sup>sin(nπx/a)dx = (2/nπ)[1 − cos(nπ/2)].</p>
<p>c₁ = 2/π, c₂ = 2/π, c₃ = 2/3π, c₄ = 0, c₅ = 2/5π.</p></div>
<div class="result">P(E₁) = (2/π)² = 4/π² ≈ 0.405</div></div>
<div class="worked"><div class="given">Past paper: probability of finding the particle between x = 0 and x = a/4 in the ground state.</div>
<div class="solve"><p>P = (2/a)∫<sub>0</sub><sup>a/4</sup>sin²(πx/a)dx = (2/a)[x/2 − (a/4π) sin(2πx/a)]<sub>0</sub><sup>a/4</sup> = (2/a)[a/8 − a/4π].</p></div>
<div class="result">P = 1/4 − 1/2π ≈ 0.091 (only 9 %, although the strip is a quarter of the box). For n = 2 the same strip gives exactly 1/4.</div></div>` }
      ],
      flashcards: [
        { front: 'Orthonormality of box eigenfunctions', back: '∫₀ᵃ ψₘψₙ dx = δₘₙ' },
        { front: 'Expansion coefficient cₙ', back: 'cₙ = ∫ψₙ* f dx; |cₙ|² = probability of measuring Eₙ.' },
        { front: 'P(0 ≤ x ≤ a/4), ground state', back: '1/4 − 1/2π ≈ 0.091' },
        { front: 'Why do even cₙ vanish for f = x(a − x)?', back: 'f is symmetric about a/2 while the even-n sines are antisymmetric about a/2.' }
      ],
      oneLiners: [
        'Σ|cₙ|² = 1.',
        'Ψ(x, t) = Σ cₙψₙ e^(−iEₙt/ℏ).',
        'Use sin α sin β = ½[cos(α − β) − cos(α + β)] for orthogonality.'
      ],
      formulas: [
        { name: 'Expansion', html: `f = Σcₙψₙ,  cₙ = ∫ψₙ*f dx`, note: '' },
        { name: 'Useful integral', html: `∫sin²(nπx/a)dx = x/2 − (a/4nπ) sin(2nπx/a)`, note: '' }
      ]
    },
    {
      id: 'm4-degeneracy',
      title: 'Degeneracy of energy levels',
      short: 'Degeneracy',
      blurb: 'Why different (nₓ, n_y, n_z) give the same energy in a cubic box, the degeneracy of the first levels (1, 3, 3, 3, 1, 6) and why symmetry causes it.',
      source: 'Module 4 notes §4.2.5',
      tabs: [
        { title: 'Degenerate levels', html: `
<p class="lead">An energy level is <b>degenerate</b> when two or more <b>different</b> eigenfunctions have the <b>same energy</b>. The number of such states is the <b>degree of degeneracy</b> g.</p>
<p>In a cubic box E depends only on nₓ² + n<sub>y</sub>² + n<sub>z</sub>², so different triplets with the same sum have the same energy, but different wavefunctions.</p>
<figure data-fig="m4-3d-levels"></figure>
<table class="tbl"><thead><tr><th>nₓ² + n<sub>y</sub>² + n<sub>z</sub>²</th><th>States</th><th>Degeneracy</th></tr></thead><tbody>
<tr><td>3</td><td>(1,1,1)</td><td>1 (non-degenerate, ground state)</td></tr>
<tr><td>6</td><td>(2,1,1), (1,2,1), (1,1,2)</td><td>3</td></tr>
<tr><td>9</td><td>(2,2,1), (2,1,2), (1,2,2)</td><td>3</td></tr>
<tr><td>11</td><td>(3,1,1), (1,3,1), (1,1,3)</td><td>3</td></tr>
<tr><td>12</td><td>(2,2,2)</td><td>1</td></tr>
<tr><td>14</td><td>(1,2,3) and its 5 rearrangements</td><td>6</td></tr>
</tbody></table>
<p>Energies in units of E₀ = h²/8ma²: first excited level 6E₀ (g = 3), second excited 9E₀ (g = 3).</p>
<ul>
<li>Degeneracy comes from <b>symmetry</b>: in a cube the x, y and z directions are equivalent, so swapping quantum numbers cannot change the energy.</li>
<li>If the box is not a cube (a ≠ b ≠ c), the symmetry is broken and the degeneracy is <b>lifted</b>.</li>
<li>A 1D box has no degeneracy: one quantum number, one state per energy.</li>
</ul>
<div class="note exam"><p>Count rule: three equal numbers → g = 1; two equal → g = 3; all different → g = 6.</p></div>` },
        { title: 'Worked examples', html: `
<div class="worked"><div class="given">Find the degeneracy of the level E = 14E₀ in a cubic box.</div>
<div class="solve"><p>Need nₓ² + n<sub>y</sub>² + n<sub>z</sub>² = 14 = 1 + 4 + 9, so the numbers are 1, 2, 3 in some order.</p>
<p>All three are different: 3 × 2 × 1 = 6 orders: (1,2,3), (1,3,2), (2,1,3), (2,3,1), (3,1,2), (3,2,1).</p></div>
<div class="result">g = 6</div></div>
<div class="worked"><div class="given">Find the degeneracy of E = 27E₀.</div>
<div class="solve"><p>27 = 9 + 9 + 9 → (3,3,3): 1 state.</p>
<p>27 = 25 + 1 + 1 → (5,1,1), (1,5,1), (1,1,5): 3 states.</p></div>
<div class="result">g = 4. Two different sets of numbers happen to give the same sum: an “accidental” degeneracy on top of the symmetry one.</div></div>
<div class="worked"><div class="given">A box has sides a, a and 2a. Is the level (1,1,2) still degenerate with (2,1,1)?</div>
<div class="solve"><p>E = (h²/8ma²)(nₓ² + n<sub>y</sub>² + n<sub>z</sub>²/4).</p>
<p>(1,1,2): 1 + 1 + 1 = 3. (2,1,1): 4 + 1 + 0.25 = 5.25. (1,2,1): 5.25.</p></div>
<div class="result">No: stretching one side breaks the symmetry. (2,1,1) and (1,2,1) stay together (x and y are still equal), so g drops from 3 to 2.</div></div>` }
      ],
      flashcards: [
        { front: 'Degenerate energy level', back: 'One energy shared by two or more different eigenfunctions.' },
        { front: 'Degeneracy of the first excited level of a cubic box', back: '3: (2,1,1), (1,2,1), (1,1,2), energy 6h²/8ma².' },
        { front: 'Degeneracy of (1,2,3)', back: '6 (all numbers different).' },
        { front: 'What causes degeneracy in a cube?', back: 'Symmetry: x, y, z are equivalent; a non-cubic box lifts it.' }
      ],
      oneLiners: [
        'Ground state (1,1,1) of a cube is non-degenerate.',
        '(2,2,2) at 12E₀ is non-degenerate.',
        'Three equal numbers: 1 state; two equal: 3; all different: 6.'
      ],
      formulas: [
        { name: 'Cubic box', html: `E = E₀(nₓ² + n<sub>y</sub>² + n<sub>z</sub>²),  E₀ = h²/8ma²`, note: '' }
      ]
    },
    {
      id: 'm4-tunnelling',
      title: 'Quantum tunnelling through a barrier',
      short: 'Quantum tunnelling',
      blurb: 'A particle with E < U crossing a rectangular barrier: Schrödinger equation in the three regions, the decaying wave inside, boundary conditions and the result.',
      source: 'Module 4 notes §4.3, tunnelling notes',
      tabs: [
        { title: 'The three regions', html: `
<p class="lead">Classically, a particle with energy E meeting a barrier of height U > E is always reflected. Quantum mechanically its wavefunction leaks into the barrier, so there is a <b>finite probability</b> of finding it on the far side: <b>tunnelling</b>.</p>
<div class="eq">V = 0 (x &lt; 0, region I);  V = U (0 ≤ x ≤ L, region II);  V = 0 (x &gt; L, region III);  E &lt; U</div>
<figure data-fig="m4-tunnel"></figure>
<div data-viz="tunnel"></div>
<p>TISE in each region: d²ψ/dx² + (2m/ℏ²)(E − V)ψ = 0.</p>
<ul>
<li><b>Region I:</b> d²ψ/dx² + k₁²ψ = 0, k₁ = √(2mE)/ℏ. ψ<sub>I</sub> = e<sup>ik₁x</sup> + r e<sup>−ik₁x</sup>: incident plus reflected wave (r = reflection amplitude).</li>
<li><b>Region II:</b> d²ψ/dx² − k₂²ψ = 0, <b>k₂ = √(2m(U − E))/ℏ</b> (real, because U > E). ψ<sub>II</sub> = A e<sup>k₂x</sup> + B e<sup>−k₂x</sup>: <b>not oscillating</b> but exponential. The decaying part is the <b>evanescent wave</b>, a non-zero amplitude in the classically forbidden region.</li>
<li><b>Region III:</b> ψ<sub>III</sub> = t e<sup>ik₁x</sup>: the transmitted wave only (nothing comes back from +∞). t = transmission amplitude.</li>
</ul>
<h3>Boundary conditions</h3>
<p>ψ and dψ/dx are continuous at x = 0 and x = L: four equations for r, A, B, t. Solving them gives</p>
<div class="eq">T = |t|² = [1 + U² sinh²(k₂L) / 4E(U − E)]<sup>−1</sup>,   R = |r|² = 1 − T</div>
<p>The wave in region III has the same wavelength (same energy) but a smaller amplitude.</p>` },
        { title: 'Meaning and examples', html: `
<ul>
<li>Tunnelling comes from the <b>wave nature</b> of matter and the <b>continuity</b> of ψ: ψ cannot drop to zero suddenly at the wall.</li>
<li>Inside the barrier the amplitude falls as e<sup>−k₂x</sup>; the probability |ψ|² falls as e<sup>−2k₂x</sup>.</li>
<li>Kinetic energy E − U is negative in the barrier: impossible classically, allowed only as an evanescent wave.</li>
<li>Inside the barrier ψ is a real exponential, not a complex travelling wave e<sup>ikx</sup>, because k would be imaginary.</li>
</ul>
<h3>Examples</h3>
<ul>
<li><b>α-decay:</b> α particles escape the nucleus through the Coulomb barrier; tiny changes in barrier width give huge differences in half-life.</li>
<li><b>Scanning tunnelling microscope (STM)</b> (next topic).</li>
<li><b>Tunnel diode</b> and field (cold) emission of electrons from metals.</li>
<li>Nuclear fusion in the Sun: protons tunnel through their mutual repulsion.</li>
</ul>
<div class="note exam"><p>“Explain tunnelling” (5–10 marks): barrier sketch with the wave in three regions, the three solutions with k₁ and k₂, boundary conditions, T formula, and two applications.</p></div>` }
      ],
      flashcards: [
        { front: 'Quantum tunnelling', back: 'A particle with E < U has a finite probability of crossing the barrier.' },
        { front: 'k₂ inside the barrier', back: 'k₂ = √(2m(U − E))/ℏ' },
        { front: 'Form of ψ inside the barrier', back: 'A e^(k₂x) + B e^(−k₂x): exponential (evanescent), not oscillating.' },
        { front: 'Boundary conditions at the barrier walls', back: 'ψ and dψ/dx continuous at x = 0 and x = L.' },
        { front: 'Three applications of tunnelling', back: 'α-decay, STM, tunnel diode (also field emission, fusion in stars).' }
      ],
      oneLiners: [
        'R + T = 1.',
        'The transmitted wave has the same wavelength but smaller amplitude.',
        'Region III has no reflected wave.'
      ],
      formulas: [
        { name: 'Wave numbers', html: `k₁ = √(2mE)/ℏ,  k₂ = √(2m(U − E))/ℏ`, note: '' },
        { name: 'Exact transmission', html: `T = [1 + U² sinh²(k₂L)/4E(U − E)]<sup>−1</sup>`, note: '' }
      ]
    },
    {
      id: 'm4-tunnel-prob',
      title: 'Tunnelling probability and the STM',
      short: 'Tunnelling probability',
      blurb: 'The thick-barrier approximation T ≈ 16(E/U)(1 − E/U)e^(−2k₂L), how T depends on width, height and mass, plots, and the scanning tunnelling microscope.',
      source: 'Module 4 notes §4.3, tunnelling and STM notes',
      tabs: [
        { title: 'Approximation and factors', html: `
<p class="lead">For a thick or high barrier, k₂L ≫ 1 and sinh(k₂L) ≈ ½e<sup>k₂L</sup>. The exact formula becomes</p>
<div class="eq">T ≈ [4√(E(U − E))/U]² e<sup>−2k₂L</sup> = 16 (E/U)(1 − E/U) e<sup>−2k₂L</sup>   ⇒   T ∝ e<sup>−2k₂L</sup></div>
<figure data-fig="m4-tplots"></figure>
<h3>What T depends on</h3>
<ul>
<li><b>Barrier width L:</b> T falls exponentially; doubling L roughly squares the small factor e<sup>−2k₂L</sup>.</li>
<li><b>Height above the energy, U − E:</b> k₂ ∝ √(U − E), so a higher barrier (or slower particle) tunnels much less.</li>
<li><b>Mass m:</b> k₂ ∝ √m, so electrons tunnel easily, protons far less, and everyday objects never noticeably.</li>
</ul>
<div class="note"><p>The plots above are computed from the exact formula for an electron with E = 5 eV: left, U = 10 eV and width from 0 to 0.6 nm; right, width 0.2 nm and U − E from 0 to 10 eV.</p></div>` },
        { title: 'STM', html: `
<p class="lead">The <b>scanning tunnelling microscope</b> images surfaces atom by atom using tunnelling.</p>
<ul>
<li>A very sharp metal tip (ideally one atom at the end) is brought a few ångströms from a conducting surface. The vacuum gap is a barrier whose height is about the work function ϕ.</li>
<li>A small voltage makes electrons <b>tunnel</b> across the gap, giving a current I ∝ e<sup>−2k₂L</sup>, with k₂ = √(2mϕ)/ℏ.</li>
<li>Because of the exponential, a change of only 0.1 nm in the gap changes the current by about an order of magnitude (for ϕ = 4 eV, k₂ ≈ 1.02 × 10<sup>10</sup> m<sup>−1</sup> and e<sup>2k₂(0.1 nm)</sup> ≈ 7.7).</li>
<li>A piezoelectric scanner moves the tip across the surface. In <b>constant-current mode</b> a feedback loop raises or lowers the tip to keep I fixed; the tip height traces the surface contour with atomic resolution.</li>
</ul>
<p>Invented by Binnig and Rohrer (Nobel Prize 1986).</p>` }
      ],
      flashcards: [
        { front: 'Thick-barrier tunnelling probability', back: 'T ≈ 16(E/U)(1 − E/U)e^(−2k₂L) ∝ e^(−2k₂L)' },
        { front: 'Three factors that reduce T', back: 'Wider barrier, higher U − E, heavier particle.' },
        { front: 'STM current dependence', back: 'I ∝ e^(−2k₂L), k₂ = √(2mϕ)/ℏ: 0.1 nm changes I about tenfold.' },
        { front: 'Doubling the barrier width (bare exponential)', back: 'T becomes T²: 10 % → 1 %.' }
      ],
      oneLiners: [
        'T falls exponentially with width and with √(U − E).',
        'STM constant-current mode traces the surface height.',
        'Electrons tunnel far more easily than protons.'
      ],
      formulas: [
        { name: 'Opaque barrier', html: `T ≈ 16(E/U)(1 − E/U) e<sup>−2k₂L</sup>`, note: 'k₂L ≫ 1' },
        { name: 'STM', html: `I ∝ e<sup>−2k₂L</sup>,  k₂ = √(2mϕ)/ℏ`, note: 'ϕ = work function' }
      ]
    },
    {
      id: 'm4-numericals',
      title: 'Numerical problems: box and tunnelling',
      short: 'Numerical problems',
      blurb: 'Past-paper numericals worked in full: electron in a 2 Å box, energy and frequency gaps, tunnelling through 0.2 nm, and two barriers of different widths.',
      source: 'Module 4 notes, past FAT and CAT papers',
      tabs: [
        { title: 'Box problems', html: `
<div class="worked"><div class="given">Past paper: an electron is in an infinite box of length 2 Å. Find the frequency difference between the eighth and the sixth excited states. (h = 6.626 × 10<sup>−34</sup> J s, m = 9.1 × 10<sup>−31</sup> kg)</div>
<div class="solve"><p>The k-th excited state has n = k + 1: eighth excited n = 9, sixth excited n = 7.</p>
<p>E₁ = h²/8mL² = (6.626 × 10<sup>−34</sup>)²/(8 × 9.1 × 10<sup>−31</sup> × (2 × 10<sup>−10</sup>)²) = 1.508 × 10<sup>−18</sup> J = 9.42 eV.</p>
<p>ΔE = (9² − 7²)E₁ = 32E₁ = 4.82 × 10<sup>−17</sup> J = 301.5 eV.</p>
<p>Δν = ΔE/h = 32h/(8mL²) = 7.28 × 10<sup>16</sup> Hz.</p></div>
<div class="result">Δν ≈ 7.28 × 10<sup>16</sup> Hz (ΔE ≈ 301.5 eV)</div></div>
<div class="worked"><div class="given">Ground-state energy of an electron in a 1 nm box and in a 1 Å box.</div>
<div class="solve"><p>E₁ = h²/8mL²: 1 nm → 6.03 × 10<sup>−20</sup> J = 0.377 eV; 1 Å (100 times smaller L²) → 37.7 eV.</p></div>
<div class="result">0.377 eV and 37.7 eV: energy grows as 1/L².</div></div>
<div class="worked"><div class="given">Box of width 3L: write Eₙ and ψₙ.</div>
<div class="solve"><p>Put a = 3L in the 1D results: k = nπ/3L.</p></div>
<div class="result">Eₙ = n²π²ℏ²/18mL² = n²h²/72mL²;  ψₙ = √(2/3L) sin(nπx/3L)</div></div>` },
        { title: 'Tunnelling problems', html: `
<div class="worked"><div class="given">Past paper: an electron with E = 5 eV meets a barrier U = 10 eV, width 0.2 nm. Find the tunnelling probability.</div>
<div class="solve"><p>k₂ = √(2m(U − E))/ℏ = √(2 × 9.1 × 10<sup>−31</sup> × 5 × 1.6 × 10<sup>−19</sup>)/1.055 × 10<sup>−34</sup> = 1.144 × 10<sup>10</sup> m<sup>−1</sup>.</p>
<p>2k₂L = 2 × 1.144 × 10<sup>10</sup> × 0.2 × 10<sup>−9</sup> = 4.58; e<sup>−4.58</sup> = 0.0103.</p>
<p>With the prefactor 16(E/U)(1 − E/U) = 16 × 0.5 × 0.5 = 4: T ≈ 4 × 0.0103 = 0.041.</p>
<p>Exact formula: T = [1 + 100 sinh²(2.29)/(4 × 5 × 5)]<sup>−1</sup> = 0.040.</p></div>
<div class="result">T ≈ 0.04 (4 %). If only T ≈ e<sup>−2k₂L</sup> is used, T ≈ 0.010 (1 %): state which formula you use.</div></div>
<div class="worked"><div class="given">Past paper: two electrons of the same energy meet barriers of the same height, widths 0.5 nm and 1.0 nm. T = 10 % for the first. Find T for the second.</div>
<div class="solve"><p>T ∝ e<sup>−2k₂L</sup> with the same k₂. T₁ = e<sup>−2k₂(0.5 nm)</sup> = 0.1.</p>
<p>T₂ = e<sup>−2k₂(1.0 nm)</sup> = [e<sup>−2k₂(0.5 nm)</sup>]² = 0.1² = 0.01.</p></div>
<div class="result">T₂ ≈ 1 %: doubling the width squares the probability.</div></div>` }
      ],
      flashcards: [
        { front: 'n for the k-th excited state', back: 'n = k + 1 (eighth excited → n = 9).' },
        { front: 'E₁ for an electron in a 1 nm box', back: '≈ 0.377 eV' },
        { front: 'T for E = 5 eV, U = 10 eV, L = 0.2 nm', back: '≈ 0.04 with the prefactor (≈ 0.01 with e^(−2k₂L) alone).' },
        { front: 'Frequency gap between eighth and sixth excited states, 2 Å box', back: 'Δν = 32h/8mL² ≈ 7.28 × 10¹⁶ Hz' }
      ],
      oneLiners: [
        'Δν = ΔE/h.',
        'Eighth and sixth excited states: n = 9 and 7, ΔE = 32E₁.',
        'Same k₂, double width: T → T².'
      ],
      formulas: [
        { name: 'Box energy', html: `Eₙ = n²h²/8mL²`, note: '' },
        { name: 'Tunnelling', html: `T ≈ 16(E/U)(1 − E/U)e<sup>−2k₂L</sup>`, note: '' }
      ]
    }
  ],
  figures: [
    { id: 'm4-box', src: 'pages/vtop__FALL2026-27_Lecture-notes-BAPHY105-Module-4/p03.png', crop: null, caption: 'First three states of the infinite well, drawn on their energy levels (E ∝ n²): wavefunctions (left) and probability densities (right).', alt: 'Two boxes of width a. In each, three dashed levels at E1, 4E1 and 9E1 carry one, two and three half sine loops; the right box shows the squared curves, with the n = 2 curve zero at the centre.' },
    { id: 'm4-3d-levels', src: 'pages/vtop__FALL2026-27_Lecture-notes-BAPHY105-Module-4/p05.png', crop: null, caption: 'Lowest levels of a cubic box in units of E₀ = h²/8ma², with the quantum-number sets and degeneracy g.', alt: 'A vertical energy ladder with lines at 3, 6, 9, 11, 12 and 14, labelled (1,1,1) g = 1, (2,1,1) ×3, (2,2,1) ×3, (3,1,1) ×3, (2,2,2) g = 1, (1,2,3) ×6.' },
    { id: 'm4-tunnel', src: 'pages/vtop__FALL2026-27_Lecture-notes-BAPHY105-Module-4/p09.png', crop: null, caption: 'Tunnelling: the wave oscillates before the barrier, decays inside it and leaves with a smaller amplitude (value and slope matched at both walls).', alt: 'A rectangular barrier of height U above a dashed energy line E. A wave oscillates on the left, falls off smoothly inside the barrier, and continues on the right with the same wavelength but much smaller amplitude.' },
    { id: 'm4-tplots', src: 'pages/vtop__FALL2026-27_Lecture-notes-BAPHY105-Module-4/p09.png', crop: null, caption: 'Tunnelling probability of a 5 eV electron from the exact formula: against barrier width (U = 10 eV) and against U − E (width 0.2 nm).', alt: 'Two graphs of T. Left: T falls steeply from near 1 as width increases to 0.6 nm. Right: T falls steeply as U − E increases to 10 eV.' }
  ]
});
