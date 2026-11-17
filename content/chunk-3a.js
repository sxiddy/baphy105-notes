CHUNK({
  chunk: '3a',
  module: 'm3',
  topics: [
    {
      id: 'm3-observables',
      title: 'Postulates of quantum mechanics and observables',
      short: 'Observables',
      blurb: 'The postulates (state, observables, measurement, expectation values, time evolution) with their significance, operators for position, momentum and energy, and why observables are Hermitian.',
      source: 'Module 3 notes §3.2, postulates notes',
      tabs: [
        { title: 'The postulates', html: `
<p class="lead">Quantum mechanics is built on a few <b>postulates</b>: rules taken as starting points, justified because their predictions match experiment.</p>
<ol>
<li><b>State.</b> The state of a system is completely described by a wavefunction Ψ(r, t) (a vector |ψ⟩ in Hilbert space). Ψ*Ψ dτ is the probability of finding the particle in the volume dτ at time t, so ∫|Ψ|² dτ = 1. Ψ must be <b>single-valued, continuous and finite</b>.<br><b>Significance:</b> replaces the classical position and momentum with a probability amplitude.</li>
<li><b>Observables.</b> Every observable corresponds to a <b>linear, Hermitian operator</b>.<br><b>Significance:</b> Hermitian operators have real eigenvalues, so measured values are real.</li>
<li><b>Measurement.</b> The only possible results of measuring an observable Â are its <b>eigenvalues</b> aₙ (Âψₙ = aₙψₙ). Immediately after the measurement the state <b>collapses</b> to the matching eigenstate.<br><b>Significance:</b> explains quantised results (two Stern–Gerlach spots, discrete energy levels).</li>
<li><b>Expectation value.</b> The average of many measurements on identically prepared systems is ⟨Â⟩ = ⟨ψ|Â|ψ⟩ = ∫ψ*Âψ dτ (for normalised ψ). The probability of result aₙ is |⟨ψₙ|ψ⟩|² (<b>Born rule</b>).<br><b>Significance:</b> connects the theory to averages measured in the lab.</li>
<li><b>Time evolution.</b> The state evolves by the time-dependent Schrödinger equation iℏ ∂Ψ/∂t = ĤΨ.<br><b>Significance:</b> the quantum “equation of motion”, replacing Newton’s second law.</li>
</ol>
<div class="note exam"><p>“State the postulates and their significance” (10 marks): answer keys give <b>1 mark per postulate</b> (state, observables, expectation values, measurement, time evolution) and 1 mark for each significance. Some books split them into six by giving “eigenvalues are the only results” and “collapse” separate numbers; either is accepted.</p></div>` },
        { title: 'Operators', html: `
<p class="lead">An <b>observable</b> is a measurable physical quantity (position, momentum, energy, spin). Each one is represented by a Hermitian operator.</p>
<table class="tbl"><thead><tr><th>Observable</th><th>Operator</th><th>Action</th></tr></thead><tbody>
<tr><td>Position x</td><td>x̂ = x</td><td>multiply by x</td></tr>
<tr><td>Momentum pₓ</td><td>p̂ₓ = −iℏ ∂/∂x</td><td>differentiate</td></tr>
<tr><td>Kinetic energy</td><td>T̂ = −(ℏ²/2m)∇²</td><td>second derivatives</td></tr>
<tr><td>Potential energy</td><td>V̂ = V(r)</td><td>multiply by V</td></tr>
<tr><td>Total energy (Hamiltonian)</td><td>Ĥ = −(ℏ²/2m)∇² + V(r), also iℏ ∂/∂t</td><td></td></tr>
<tr><td>Angular momentum</td><td>L̂<sub>z</sub> = −iℏ(x ∂/∂y − y ∂/∂x)</td><td></td></tr>
<tr><td>Spin</td><td>Ŝᵢ = (ℏ/2)σᵢ</td><td>Pauli matrices</td></tr>
</tbody></table>
<h3>Eigenstates of momentum and energy</h3>
<ul>
<li>Momentum: −iℏ dψ/dx = pψ ⇒ <b>ψₚ = A e<sup>ikx</sup></b> with p = ℏk. A plane wave has a definite momentum.</li>
<li>Energy: iℏ dψ/dt = Eψ ⇒ <b>ψ<sub>E</sub> = B e<sup>−iωt</sup></b> with E = ℏω.</li>
<li>Both together: <b>ψ(x, t) = C e<sup>i(kx − ωt)</sup></b>. Here the vectors are functions, so the eigenvectors are called <b>eigenfunctions</b>.</li>
</ul>
<h3>Proof: the momentum operator is Hermitian</h3>
<div class="solve"><p>⟨f|p̂|g⟩ = ∫f*(−iℏ dg/dx)dx. Integrate by parts:</p>
<p>= [−iℏf*g]<sub>−∞</sub><sup>∞</sup> + ∫(iℏ df*/dx) g dx.</p>
<p>The boundary term vanishes because physical wavefunctions go to zero at ±∞. The rest is ∫(−iℏ df/dx)* g dx = ⟨g|p̂|f⟩*.</p>
<p>So p̂† = p̂: momentum is Hermitian (the factor i is essential; d/dx alone is not Hermitian).</p></div>` }
      ],
      flashcards: [
        { front: 'Five postulates of QM', back: 'State (wavefunction), observables (Hermitian operators), measurement (eigenvalues, collapse), expectation values (⟨ψ|A|ψ⟩), time evolution (TDSE).' },
        { front: 'Momentum operator', back: 'p̂ₓ = −iℏ ∂/∂x' },
        { front: 'Energy operator', back: 'Ĥ = −(ℏ²/2m)∇² + V, or iℏ ∂/∂t' },
        { front: 'Momentum eigenfunction', back: 'ψ = A e^(ikx), eigenvalue p = ℏk (a plane wave).' },
        { front: 'Why must observables be Hermitian?', back: 'Measured values (eigenvalues) must be real, and Hermitian operators have real eigenvalues.' }
      ],
      oneLiners: [
        'A good wavefunction is single-valued, continuous, finite and normalisable.',
        'Measurement can only give an eigenvalue of the operator.',
        'p̂ is Hermitian because the boundary term vanishes for physical wavefunctions.'
      ],
      formulas: [
        { name: 'Operators', html: `x̂ = x,  p̂ = −iℏ ∂/∂x,  Ĥ = −(ℏ²/2m) ∂²/∂x² + V`, note: '' },
        { name: 'Plane wave', html: `ψ = C e<sup>i(kx − ωt)</sup>,  p = ℏk,  E = ℏω`, note: '' }
      ]
    },
    {
      id: 'm3-expectation',
      title: 'Expectation values',
      short: 'Expectation values',
      blurb: 'Mean, variance and standard deviation for discrete and continuous variables, Born’s rule, ⟨Q⟩ = ⟨ψ|Q|ψ⟩ for matrices and wavefunctions, with worked problems.',
      source: 'Module 3 notes §3.1, exercises 1–5, problems 1, 4, 5',
      tabs: [
        { title: 'Probability basics', html: `
<p class="lead">Measurements in quantum mechanics give random results, so we need the language of probability.</p>
<h3>Discrete variable j</h3>
<ul>
<li>P(j) = N(j)/N, with Σ P(j) = 1.</li>
<li><b>Mean (expectation value):</b> ⟨j⟩ = Σ j P(j), the average over many repeats.</li>
<li><b>Median:</b> half the outcomes lie below, half above. <b>Most probable value:</b> where P(j) is largest.</li>
<li><b>Variance:</b> σ² = ⟨(j − ⟨j⟩)²⟩ = <b>⟨j²⟩ − ⟨j⟩²</b>; <b>standard deviation</b> σ = √σ² (same units as j).</li>
</ul>
<div class="worked"><div class="given">14 students: ages 14 (1), 15 (1), 16 (3), 22 (2), 24 (2), 25 (5). Find ⟨j⟩, σ², σ.</div>
<div class="solve"><p>⟨j⟩ = (14 + 15 + 48 + 44 + 48 + 125)/14 = 294/14 = 21.</p>
<p>⟨j²⟩ = (196 + 225 + 768 + 968 + 1152 + 3125)/14 = 6434/14 ≈ 459.57.</p>
<p>σ² = 459.57 − 441 = 130/7 ≈ 18.57, σ ≈ 4.31.</p></div>
<div class="result">⟨j⟩ = 21, σ² ≈ 18.57, σ ≈ 4.31</div></div>
<div class="worked"><div class="given">A fair die: find ⟨j⟩ and σ².</div>
<div class="solve"><p>P(j) = 1/6. ⟨j⟩ = 21/6 = 3.5. ⟨j²⟩ = 91/6 ≈ 15.17. σ² = 91/6 − 12.25 = 35/12 ≈ 2.92.</p></div>
<div class="result">⟨j⟩ = 3.5, σ² = 35/12 ≈ 2.92</div></div>
<h3>Continuous variable x</h3>
<p>A probability density ρ(x): P(a ≤ x ≤ b) = ∫<sub>a</sub><sup>b</sup>ρ dx, ∫ρ dx = 1, ⟨x⟩ = ∫xρ dx, ⟨f(x)⟩ = ∫f(x)ρ dx, σ² = ⟨x²⟩ − ⟨x⟩².</p>` },
        { title: 'In quantum mechanics', html: `
<p class="lead"><b>Born’s rule:</b> the probability density for position is ρ(x, t) = |ψ(x, t)|².</p>
<div class="eq">P(a ≤ x ≤ b) = ∫<sub>a</sub><sup>b</sup> |ψ|² dx,   ∫|ψ|² dx = 1,   ⟨x⟩ = ∫ x|ψ|² dx</div>
<p>For any observable the expectation value is always</p>
<div class="eq">⟨Q̂⟩ = ⟨ψ|Q̂|ψ⟩ = ∫ ψ*(x) Q̂ ψ(x) dx</div>
<p>(sums for discrete spaces, integrals for continuous ones). Example: ⟨p⟩ = ∫ψ*(−iℏ dψ/dx)dx. The operator acts on ψ <b>first</b>; then multiply by ψ* and integrate.</p>
<div class="note"><p>If the state is not normalised, divide by ⟨ψ|ψ⟩: ⟨Q⟩ = ⟨ψ|Q|ψ⟩/⟨ψ|ψ⟩.</p></div>
<h3>Two-state system</h3>
<p>For |ψ⟩ = α|0⟩ + β|1⟩ and a Hermitian Â = [a b; b* d] (a, d real):</p>
<div class="eq">⟨Â⟩ = a|α|² + d|β|² + α*bβ + β*b*α</div>
<p>The last two terms are complex conjugates of each other, so ⟨Â⟩ is <b>always real</b>.</p>
<h3>Expansion in eigenstates</h3>
<p>If |ψ⟩ = Σcₙ|ψₙ⟩ with Â|ψₙ⟩ = aₙ|ψₙ⟩ (orthonormal), then ⟨Â⟩ = Σ aₙ|cₙ|² / Σ|cₙ|²: each eigenvalue weighted by its probability.</p>` },
        { title: 'Worked problems', html: `
<div class="worked"><div class="given">Past paper: A = [1 i; −i 1] acts on |ψ⟩ = (1/√2)(1, 1). Find ⟨A⟩.</div>
<div class="solve"><p>A|ψ⟩ = (1/√2)(1 + i, −i + 1).</p>
<p>⟨ψ|A|ψ⟩ = (1/√2)(1, 1) · (1/√2)(1 + i, 1 − i) = ½[(1 + i) + (1 − i)] = 1.</p></div>
<div class="result">⟨A⟩ = 1 (real, since A is Hermitian)</div></div>
<div class="worked"><div class="given">A = [2 1; 1 3], |ψ⟩ = (|0⟩ + |1⟩)/√2. Find ⟨A⟩.</div>
<div class="solve"><p>A|ψ⟩ = (1/√2)(3, 4). ⟨A⟩ = ½(3 + 4) = 7/2.</p></div>
<div class="result">⟨A⟩ = 3.5</div></div>
<div class="worked"><div class="given">A = σ<sub>z</sub> = [1 0; 0 −1], |ψ⟩ = (|0⟩ + |1⟩)/√2.</div>
<div class="solve"><p>A|ψ⟩ = (1/√2)(1, −1); ⟨A⟩ = ½(1 − 1) = 0.</p></div>
<div class="result">⟨A⟩ = 0: up and down equally likely.</div></div>
<div class="worked"><div class="given">|ψ⟩ = 3|E₁⟩ + 4i|E₂⟩ (energy eigenstates). Find ⟨E⟩.</div>
<div class="solve"><p>⟨ψ|ψ⟩ = 9 + 16 = 25, so normalise with 1/5.</p>
<p>⟨E⟩ = (9E₁ + 16E₂)/25.</p></div>
<div class="result">⟨E⟩ = (9E₁ + 16E₂)/25 = 0.36E₁ + 0.64E₂</div></div>
<div class="worked"><div class="given">Past paper: |ψ⟩ = (|φ₁⟩ + |φ₂⟩ + |φ₃⟩)/√3 with B|φₙ⟩ = n|φₙ⟩. Find ⟨B⟩.</div>
<div class="solve"><p>Each |cₙ|² = 1/3. ⟨B⟩ = 1(1/3) + 2(1/3) + 3(1/3) = 2.</p></div>
<div class="result">⟨B⟩ = 2 (for other coefficients use ⟨B⟩ = Σ n|cₙ|² / Σ|cₙ|²)</div></div>
<div class="worked"><div class="given">ρ(x) = A e<sup>−2|x|</sup>. Normalise, find ⟨x⟩ and ⟨x²⟩.</div>
<div class="solve"><p>∫ρ dx = 2A∫<sub>0</sub><sup>∞</sup>e<sup>−2x</sup>dx = 2A(½) = A = 1.</p>
<p>⟨x⟩ = 0 (odd integrand over symmetric limits). ⟨x²⟩ = 2∫<sub>0</sub><sup>∞</sup>x²e<sup>−2x</sup>dx = 2 × 2/2³ = ½.</p></div>
<div class="result">A = 1, ⟨x⟩ = 0, ⟨x²⟩ = ½</div></div>
<div class="worked"><div class="given">ψ = √(3/2a³)(a − |x|) for |x| ≤ a, 0 outside. Check normalisation, find ⟨x⟩ and ⟨x²⟩.</div>
<div class="solve"><p>∫|ψ|² = (3/2a³) × 2∫<sub>0</sub><sup>a</sup>(a − x)²dx = (3/a³)(a³/3) = 1.</p>
<p>ψ is even, so x|ψ|² is odd: ⟨x⟩ = 0.</p>
<p>⟨x²⟩ = (3/a³)∫<sub>0</sub><sup>a</sup>x²(a − x)²dx = (3/a³)(a⁵/30) = a²/10.</p></div>
<div class="result">Normalised; ⟨x⟩ = 0; ⟨x²⟩ = a²/10</div></div>
<div class="worked"><div class="given">ρ(x) = e<sup>−x²</sup>/√π. Find ⟨x⟩, ⟨x²⟩, σ².</div>
<div class="solve"><p>∫e<sup>−x²</sup>dx = √π, so it is normalised. ⟨x⟩ = 0 (even ρ). ⟨x²⟩ = (1/√π)(√π/2) = ½.</p></div>
<div class="result">⟨x⟩ = 0, σ² = ⟨x²⟩ = ½</div></div>` }
      ],
      flashcards: [
        { front: 'Expectation value of an operator', back: '⟨Q⟩ = ⟨ψ|Q|ψ⟩ = ∫ψ* Q ψ dx (normalised ψ).' },
        { front: 'Variance identity', back: 'σ² = ⟨x²⟩ − ⟨x⟩²' },
        { front: 'Born’s rule', back: 'Probability density of position = |ψ(x, t)|².' },
        { front: '⟨x⟩ for an even |ψ|²', back: 'Zero: x|ψ|² is odd over symmetric limits.' },
        { front: '⟨A⟩ for A = [1 i; −i 1], ψ = (1,1)/√2', back: '1' }
      ],
      oneLiners: [
        'The expectation value is the average over many identical systems, not the result of one measurement.',
        'The expectation value of a Hermitian operator is always real.',
        'Divide by ⟨ψ|ψ⟩ if the state is not normalised.'
      ],
      formulas: [
        { name: 'Mean and variance', html: `⟨j⟩ = Σ jP(j),  σ² = ⟨j²⟩ − ⟨j⟩²`, note: '' },
        { name: 'Expectation value', html: `⟨Q⟩ = ⟨ψ|Q|ψ⟩ = ∫ψ*Qψ dx`, note: '' },
        { name: 'From eigen-expansion', html: `⟨A⟩ = Σ aₙ|cₙ|²`, note: 'normalised state' }
      ]
    },
    {
      id: 'm3-measurement',
      title: 'Measurement, collapse and uncertainty',
      short: 'Measurement',
      blurb: 'Outcomes are eigenvalues, probabilities are |⟨n|ψ⟩|², the state collapses, commuting and non-commuting observables, [x, p] = iℏ and the uncertainty principle.',
      source: 'Module 3 notes §3.3, §3.5, problems 2 and 6',
      tabs: [
        { title: 'Measuring spin', html: `
<p class="lead">The possible results of a measurement are the <b>eigenvalues</b> of the operator, and right after the measurement the state <b>collapses</b> to the matching eigenvector.</p>
<p><b>Example: S<sub>z</sub> = (ℏ/2)[1 0; 0 −1].</b> S<sub>z</sub>|0⟩ = +(ℏ/2)|0⟩ and S<sub>z</sub>|1⟩ = −(ℏ/2)|1⟩. An electron sent through a Stern–Gerlach magnet along z is always deflected up or down, never in between.</p>
<p>For |ψ⟩ = α|0⟩ + β|1⟩ (|α|² + |β|² = 1):</p>
<div class="eq">P(+ℏ/2) = |⟨0|ψ⟩|² = |α|²,   P(−ℏ/2) = |⟨1|ψ⟩|² = |β|²</div>
<p><b>Collapse:</b> after the measurement |ψ⟩ → |0⟩ (probability |α|²) or |1⟩ (probability |β|²). The superposition is gone; measuring S<sub>z</sub> again at once gives the same answer.</p>
<p><b>Expectation value:</b> ⟨S<sub>z</sub>⟩ = (ℏ/2)(|α|² − |β|²). A single measurement still gives only ±ℏ/2; the average over many identical systems approaches this value.</p>
<div class="worked"><div class="given">|ψ⟩ = (1/√3)|0⟩ + √(2/3)|1⟩. Find the probabilities and ⟨S<sub>z</sub>⟩.</div>
<div class="solve"><p>P(+ℏ/2) = 1/3, P(−ℏ/2) = 2/3.</p>
<p>⟨S<sub>z</sub>⟩ = (ℏ/2)(1/3 − 2/3) = −ℏ/6.</p></div>
<div class="result">P(+) = 1/3, P(−) = 2/3, ⟨S<sub>z</sub>⟩ = −ℏ/6</div></div>
<div class="worked"><div class="given">Give two vectors with a definite value 5 of 3X + 4Z (X = σₓ, Z = σ<sub>z</sub>).</div>
<div class="solve"><p>A = 3σₓ + 4σ<sub>z</sub> = [4 3; 3 −4]. det(A − λI) = λ² − 16 − 9 = 0 ⇒ λ = ±5.</p>
<p>λ = 5: (A − 5I)v = 0 ⇒ −v₁ + 3v₂ = 0 ⇒ v = (3, 1).</p></div>
<div class="result">Any multiple of (3, 1), for example (3, 1) and (6, 2) (or (3, 1)/√10). (λ = −5 gives (1, −3).)</div></div>` },
        { title: 'Commutators and uncertainty', html: `
<p class="lead">Two operators <b>commute</b> if [Â, B̂] = ÂB̂ − B̂Â = 0. Then they share eigenstates, and both observables can have sharp values at the same time (<b>compatible</b>). If the commutator is not zero they are <b>incompatible</b>: measuring one disturbs the other.</p>
<p>Spin components do not commute: [S<sub>z</sub>, Sₓ] = iℏS<sub>y</sub> ≠ 0. Measuring z then z gives the same result again, but z then x randomises the z value.</p>
<h3>Proof: [x, p] = iℏ</h3>
<div class="solve"><p>Act on any ψ(x): x p ψ = −iℏ x dψ/dx.</p>
<p>p x ψ = −iℏ d(xψ)/dx = −iℏ(ψ + x dψ/dx).</p>
<p>[x, p]ψ = −iℏx dψ/dx + iℏψ + iℏx dψ/dx = iℏψ, for every ψ.</p></div>
<div class="result">[x, p] = iℏ</div>
<p>In 3D: [xᵢ, pⱼ] = iℏδᵢⱼ, [xᵢ, xⱼ] = [pᵢ, pⱼ] = 0 (so [x, p<sub>y</sub>] = 0).</p>
<p>Past paper: [x², p] = x[x, p] + [x, p]x = <b>2iℏx</b>.</p>
<h3>Uncertainty principle</h3>
<div class="eq">ΔA ΔB ≥ ½ |⟨[Â, B̂]⟩|   ⇒   Δx Δp ≥ ℏ/2</div>
<p>No state has both position and momentum sharply defined. It is a consequence of non-commuting operators, not of clumsy instruments.</p>
<div class="worked"><div class="given">Δx = 0.1 nm. Find the minimum Δp.</div>
<div class="solve"><p>ℏ = h/2π = 1.055 × 10<sup>−34</sup> J s.</p>
<p>Δp ≥ ℏ/(2Δx) = 1.055 × 10<sup>−34</sup>/(2 × 1.0 × 10<sup>−10</sup>) = 5.27 × 10<sup>−25</sup> kg m/s.</p></div>
<div class="result">Δp ≥ 5.27 × 10<sup>−25</sup> kg m/s: pinning down x makes p very uncertain.</div></div>
<h3>Commutator rules</h3>
<ul>
<li>[A, B] = −[B, A];  [A, B + C] = [A, B] + [A, C];  [A, λB] = λ[A, B]</li>
<li>[AB, C] = A[B, C] + [A, C]B</li>
<li>Jacobi: [A, [B, C]] + [B, [C, A]] + [C, [A, B]] = 0</li>
</ul>` }
      ],
      flashcards: [
        { front: 'Possible results of measuring A', back: 'Only the eigenvalues of A.' },
        { front: 'What happens to the state after a measurement?', back: 'It collapses to the eigenstate of the result.' },
        { front: '[x, p]', back: 'iℏ' },
        { front: 'Heisenberg uncertainty (x, p)', back: 'Δx Δp ≥ ℏ/2' },
        { front: 'Compatible observables', back: 'Commuting operators: common eigenstates, both can be sharp at once.' },
        { front: '[x², p]', back: '2iℏx' }
      ],
      oneLiners: [
        'P(aₙ) = |⟨ψₙ|ψ⟩|².',
        'Repeating the same measurement at once gives the same result.',
        'Uncertainty comes from non-commuting operators.'
      ],
      formulas: [
        { name: 'Canonical commutator', html: `[xᵢ, pⱼ] = iℏδᵢⱼ`, note: '' },
        { name: 'General uncertainty', html: `ΔA ΔB ≥ ½|⟨[A, B]⟩|`, note: '' },
        { name: 'Spin expectation', html: `⟨S<sub>z</sub>⟩ = (ℏ/2)(|α|² − |β|²)`, note: '' }
      ]
    },
    {
      id: 'm3-seq-sg',
      title: 'Sequential Stern–Gerlach experiment',
      short: 'Sequential Stern–Gerlach',
      blurb: 'Spin eigenstates along x, y and z, the z → x → z experiment stage by stage with beam counts, and what it proves about measurement and non-commuting spin.',
      source: 'Module 3 notes §3.4, §3.5.1, problem 7',
      tabs: [
        { title: 'Spin states along x, y, z', html: `
<p class="lead">For spin-½, Ŝᵢ = (ℏ/2)σᵢ with eigenvalues ±ℏ/2 along every axis. The eigenstates, written in the z-basis:</p>
<table class="tbl"><thead><tr><th>Axis</th><th>Spin up</th><th>Spin down</th></tr></thead><tbody>
<tr><td>z</td><td>|+z⟩ = (1, 0)</td><td>|−z⟩ = (0, 1)</td></tr>
<tr><td>x</td><td>|+x⟩ = (|+z⟩ + |−z⟩)/√2</td><td>|−x⟩ = (|+z⟩ − |−z⟩)/√2</td></tr>
<tr><td>y</td><td>|+y⟩ = (|+z⟩ + i|−z⟩)/√2</td><td>|−y⟩ = (|+z⟩ − i|−z⟩)/√2</td></tr>
</tbody></table>
<p>A definite state along one axis is an <b>equal superposition</b> along another. For example |+z⟩ = (|+y⟩ + |−y⟩)/√2, so P(+y) = |⟨+y|+z⟩|² = ½ and P(−y) = ½.</p>
<div class="worked"><div class="given">Atoms in |+z⟩ pass through an SG magnet along x. Give the outcomes and probabilities.</div>
<div class="solve"><p>⟨+x|+z⟩ = (1/√2)(1·1 + 1·0) = 1/√2 and ⟨−x|+z⟩ = 1/√2.</p></div>
<div class="result">+ℏ/2 along x (state |+x⟩) and −ℏ/2 (state |−x⟩), each with probability ½.</div></div>` },
        { title: 'z → x → z, stage by stage', html: `
<figure data-fig="m3-seq-sg"></figure>
<ol>
<li><b>First SG along z:</b> an unpolarised beam (say 2000 atoms) splits into |+z⟩ and |−z⟩, about 1000 each. The |−z⟩ beam is blocked.</li>
<li><b>Second SG along x:</b> the 1000 atoms in |+z⟩ split into |+x⟩ and |−x⟩, about 500 each (probability ½ each). Keep |+x⟩.</li>
<li><b>Third SG along z again:</b> the 500 atoms in |+x⟩ split into |+z⟩ and |−z⟩, about 250 each.</li>
</ol>
<p><b>The surprise:</b> |−z⟩ atoms reappear, although every atom left the first magnet as |+z⟩. The x measurement collapsed the state to |+x⟩ = (|+z⟩ + |−z⟩)/√2, which has <b>forgotten</b> the earlier z result.</p>
<h3>Conclusions</h3>
<ul>
<li>Measurement <b>collapses</b> the state into an eigenstate of the measured observable.</li>
<li>Spin components do <b>not commute</b>: [Ŝ<sub>z</sub>, Ŝₓ] = iℏŜ<sub>y</sub>, so S<sub>z</sub> and Sₓ cannot both be sharp.</li>
<li>A definite state along one axis is a superposition along another.</li>
<li>The <b>order</b> of measurements matters; results are probabilistic.</li>
<li>Without the x magnet, a second z magnet would pass all |+z⟩ atoms as |+z⟩ (repeatable).</li>
</ul>
<div class="note exam"><p>“Describe sequential SG along z, x, z; give the output of each section” (6–10 marks): draw the three magnets with blocked beams, give counts (2000 → 1000 → 500 → 250 + 250), then the four conclusions above. For the single SG experiment (silver atoms, inhomogeneous field, two spots, spin ±ℏ/2) see Module 1.</p></div>` }
      ],
      flashcards: [
        { front: '|+x⟩ in the z-basis', back: '(|+z⟩ + |−z⟩)/√2' },
        { front: '|+y⟩ in the z-basis', back: '(|+z⟩ + i|−z⟩)/√2' },
        { front: 'z → x → z with 2000 atoms', back: '1000 pass +z, 500 pass +x, then 250 +z and 250 −z.' },
        { front: 'Why does −z reappear after the x magnet?', back: 'Measuring Sₓ collapses the state to |+x⟩, an equal mix of |+z⟩ and |−z⟩; Sz and Sx do not commute.' }
      ],
      oneLiners: [
        'P(+x | +z) = ½.',
        '[Sz, Sx] = iℏSy ≠ 0.',
        'z then z again: the result repeats; z then x then z: it is scrambled.'
      ],
      formulas: [
        { name: 'x eigenstates', html: `|±x⟩ = (|+z⟩ ± |−z⟩)/√2`, note: '' },
        { name: 'y eigenstates', html: `|±y⟩ = (|+z⟩ ± i|−z⟩)/√2`, note: '' }
      ]
    },
    {
      id: 'm3-tdse',
      title: 'Time-dependent Schrödinger equation',
      short: 'Time-dependent equation',
      blurb: 'The TDSE, its derivation from the free-particle plane wave and E = p²/2m + V, the dispersion relation, its meaning and importance.',
      source: 'Module 3 notes §3.2.3, §3.6, problems 9–10',
      tabs: [
        { title: 'Equation and derivation', html: `
<p class="lead">The fundamental law of non-relativistic quantum mechanics:</p>
<div class="eq">iℏ ∂Ψ/∂t = ĤΨ = −(ℏ²/2m) ∂²Ψ/∂x² + V(x, t)Ψ</div>
<h3>Derivation (using the plane wave)</h3>
<div class="solve"><p><b>1.</b> A free particle with definite p and E is a plane wave: Ψ = A e<sup>i(kx − ωt)</sup> = A e<sup>i(px − Et)/ℏ</sup> (de Broglie p = ℏk, Planck E = ℏω).</p>
<p><b>2.</b> Differentiate in time: ∂Ψ/∂t = −(iE/ℏ)Ψ ⇒ <b>iℏ ∂Ψ/∂t = EΨ</b>.</p>
<p><b>3.</b> Differentiate twice in space: ∂²Ψ/∂x² = −(p²/ℏ²)Ψ ⇒ <b>−(ℏ²/2m) ∂²Ψ/∂x² = (p²/2m)Ψ</b>.</p>
<p><b>4.</b> The total energy is E = p²/2m + V. Multiply by Ψ: EΨ = (p²/2m)Ψ + VΨ.</p>
<p><b>5.</b> Replace EΨ and (p²/2m)Ψ by steps 2 and 3:</p></div>
<div class="result">iℏ ∂Ψ/∂t = −(ℏ²/2m) ∂²Ψ/∂x² + VΨ</div>
<p>The identification E → iℏ ∂/∂t and p → −iℏ ∂/∂x gives the operators of the postulates.</p>
<h3>Dispersion relation</h3>
<p>For V = 0, put the plane wave in the TDSE: ℏω = ℏ²k²/2m, that is <b>E = p²/2m</b>, the energy–momentum relation of a free non-relativistic particle.</p>
<h3>Meaning</h3>
<ul>
<li>The TDSE governs the <b>full time evolution</b> of a quantum state (first order in time: knowing Ψ now fixes Ψ later).</li>
<li>|Ψ(x, t)|² is the probability density.</li>
<li>If V depends on time, the full TDSE must be solved; if not, it separates into the TISE (next topic).</li>
<li>It is linear, so superpositions of solutions are solutions.</li>
</ul>` },
        { title: 'Worked problems', html: `
<div class="worked"><div class="given">A free electron has p = 4.50 × 10<sup>−24</sup> kg m/s along x. Write its wavefunction.</div>
<div class="solve"><p>k = p/ℏ = 4.50 × 10<sup>−24</sup>/1.055 × 10<sup>−34</sup> = 4.27 × 10<sup>10</sup> m<sup>−1</sup>.</p>
<p>E = p²/2m = (4.50 × 10<sup>−24</sup>)²/(2 × 9.11 × 10<sup>−31</sup>) = 1.11 × 10<sup>−17</sup> J (≈ 69 eV).</p>
<p>ω = E/ℏ = 1.05 × 10<sup>17</sup> rad/s.</p></div>
<div class="result">Ψ(x, t) = A e<sup>i(kx − ωt)</sup>, k = 4.27 × 10<sup>10</sup> m<sup>−1</sup>, ω = 1.05 × 10<sup>17</sup> rad/s</div></div>
<div class="worked"><div class="given">Ψ = A e<sup>i(k₁x − ω₁t)</sup> + A e<sup>i(k₂x − ω₂t)</sup>. (a) Show it solves the free TDSE. (b) Find |Ψ|².</div>
<div class="solve"><p>(a) iℏ ∂Ψ/∂t = ℏω₁(term 1) + ℏω₂(term 2); −(ℏ²/2m)∂²Ψ/∂x² = (ℏ²k₁²/2m)(term 1) + (ℏ²k₂²/2m)(term 2). They match when ωᵢ = ℏkᵢ²/2m (the dispersion relation), so it is a solution: superposition works because the TDSE is linear.</p>
<p>(b) |Ψ|² = A²[2 + 2cos((k₁ − k₂)x − (ω₁ − ω₂)t)] = 4A²cos²[((k₁ − k₂)x − (ω₁ − ω₂)t)/2].</p></div>
<div class="result">|Ψ|² = 4A² cos²[((k₁ − k₂)x − (ω₁ − ω₂)t)/2]: beats that move in time</div></div>
<div class="worked"><div class="given">ψ = A cos kx + B sin kx and ψ₂ = 2e<sup>ikx</sup> − e<sup>−ikx</sup>. What relation makes them the same state?</div>
<div class="solve"><p>Use cos kx = (e<sup>ikx</sup> + e<sup>−ikx</sup>)/2 and sin kx = (e<sup>ikx</sup> − e<sup>−ikx</sup>)/2i:</p>
<p>ψ = (A/2 + B/2i)e<sup>ikx</sup> + (A/2 − B/2i)e<sup>−ikx</sup>.</p>
<p>Same state means ψ = Cψ₂ for some constant C: A/2 + B/2i = 2C and A/2 − B/2i = −C.</p>
<p>Add: A = C. Subtract: B/i = 3C ⇒ B = 3iC = 3iA.</p>
<p>Check: A/2 + 3iA/2i = 2A = 2C and A/2 − 3A/2 = −A = −C (correct).</p></div>
<div class="result">B = 3iA</div>
<div class="note heads-up"><p>The course solution swaps the two coefficients in its expansion (it writes A/2 − B/2i in front of e<sup>ikx</sup>) but reaches the same final answer, B = 3iA.</p></div></div>` }
      ],
      flashcards: [
        { front: 'Time-dependent Schrödinger equation', back: 'iℏ ∂Ψ/∂t = −(ℏ²/2m)∂²Ψ/∂x² + VΨ' },
        { front: 'Free-particle dispersion relation', back: 'ℏω = ℏ²k²/2m, i.e. E = p²/2m.' },
        { front: 'Operator replacements in the derivation', back: 'E → iℏ ∂/∂t,  p → −iℏ ∂/∂x' },
        { front: 'Why is the TDSE important?', back: 'It is the equation of motion of quantum mechanics: it gives Ψ at all later times.' }
      ],
      oneLiners: [
        'The TDSE is linear, so superpositions of solutions are solutions.',
        'Plane wave: Ψ = A e^(i(kx − ωt)).',
        'If V depends on t the TDSE cannot be separated.'
      ],
      formulas: [
        { name: 'TDSE', html: `iℏ ∂Ψ/∂t = −(ℏ²/2m) ∂²Ψ/∂x² + VΨ`, note: '' },
        { name: 'Dispersion', html: `E = ℏω = ℏ²k²/2m = p²/2m`, note: 'free particle' }
      ]
    },
    {
      id: 'm3-tise',
      title: 'Time-independent Schrödinger equation and stationary states',
      short: 'Time-independent eq.',
      blurb: 'Separation of variables from the TDSE, why E is real, stationary states with time-independent |Ψ|², and ⟨H⟩ = E with zero spread.',
      source: 'Module 3 notes §3.7',
      tabs: [
        { title: 'Derivation', html: `
<p class="lead">When the potential does not depend on time, V(x, t) = V(x), the TDSE can be separated.</p>
<div class="solve"><p><b>1.</b> Try Ψ(x, t) = ψ(x)ϕ(t).</p>
<p><b>2.</b> Substitute: iℏ ψ dϕ/dt = [−(ℏ²/2m) d²ψ/dx² + Vψ] ϕ.</p>
<p><b>3.</b> Divide by ψϕ: iℏ (1/ϕ) dϕ/dt = −(ℏ²/2m)(1/ψ) d²ψ/dx² + V.</p>
<p><b>4.</b> The left side depends only on t, the right only on x. They can be equal for all x and t only if both equal the <b>same constant</b>, called E.</p>
<p><b>5.</b> Time part: dϕ/dt = −(iE/ℏ)ϕ ⇒ <b>ϕ(t) = e<sup>−iEt/ℏ</sup></b>.</p>
<p><b>6.</b> Space part:</p></div>
<div class="result">−(ℏ²/2m) d²ψ/dx² + V(x)ψ = Eψ,   i.e. Ĥψ = Eψ</div>
<p>This is the <b>time-independent Schrödinger equation</b> (TISE): an eigenvalue equation for the Hamiltonian. The separation constant E is the <b>energy</b>.</p>
<h3>E is real</h3>
<p>Multiply the TISE by ψ* and integrate: ∫ψ*Ĥψ dx = E∫|ψ|²dx = E (normalised). Ĥ is Hermitian for a real potential, so the left side is real, hence <b>E is real</b>.</p>
<p>In 3D: −(ℏ²/2m)∇²ψ + Vψ = Eψ, or ∇²ψ + (2m/ℏ²)(E − V)ψ = 0.</p>` },
        { title: 'Stationary states', html: `
<p class="lead">A separable solution Ψ(x, t) = ψ(x)e<sup>−iEt/ℏ</sup> is a <b>stationary state</b>.</p>
<ul>
<li><b>Probability density is constant in time:</b> |Ψ|² = ψ*e<sup>+iEt/ℏ</sup>ψe<sup>−iEt/ℏ</sup> = |ψ(x)|².</li>
<li>Every expectation value of a time-independent operator is constant.</li>
<li><b>Definite energy:</b> ⟨H⟩ = ∫ψ*Ĥψ dx = E and ⟨H²⟩ = E², so σ<sub>H</sub>² = E² − E² = 0. Every energy measurement gives exactly E.</li>
</ul>
<p>Solving the TISE for a given V(x) (box, harmonic oscillator, step) gives the energies Eₙ and eigenfunctions ψₙ: Module 4. The general solution is a superposition Σcₙψₙe<sup>−iEₙt/ℏ</sup>.</p>
<div class="note exam"><p>“Derive the TISE from the TDSE” (5–10 marks): state the assumption V = V(x), write Ψ = ψϕ, separate, set both sides to E, solve ϕ = e<sup>−iEt/ℏ</sup>, write the TISE, and add one line on stationary states.</p></div>
<div class="worked"><div class="given">ψ = A sin kx (k = 2π/λ). Where is the particle most likely and where never found?</div>
<div class="solve"><p>|ψ|² = A²sin²kx. Maximum where sin kx = ±1: kx = π/2 + nπ ⇒ x = (2n + 1)π/2k = (2n + 1)λ/4.</p>
<p>Zero where sin kx = 0: x = nπ/k = nλ/2.</p></div>
<div class="result">Most likely at x = λ/4, 3λ/4, …; never at x = 0, λ/2, λ, …</div></div>` }
      ],
      flashcards: [
        { front: 'TISE', back: '−(ℏ²/2m) d²ψ/dx² + Vψ = Eψ (Ĥψ = Eψ)' },
        { front: 'Condition to separate the TDSE', back: 'V must not depend on time.' },
        { front: 'Time part of a stationary state', back: 'e^(−iEt/ℏ)' },
        { front: 'Stationary state', back: 'Ψ = ψ(x)e^(−iEt/ℏ): |Ψ|² does not change with time and the energy is exactly E.' },
        { front: 'Why is E real?', back: 'E = ∫ψ*Ĥψ dx and Ĥ is Hermitian.' }
      ],
      oneLiners: [
        'The separation constant in the TISE is the energy.',
        'Energy spread in a stationary state is zero.',
        'The TISE is an eigenvalue equation for Ĥ.'
      ],
      formulas: [
        { name: 'TISE (1D)', html: `d²ψ/dx² + (2m/ℏ²)(E − V)ψ = 0`, note: '' },
        { name: 'Stationary state', html: `Ψ(x, t) = ψ(x) e<sup>−iEt/ℏ</sup>`, note: '' }
      ]
    }
  ],
  figures: [
    { id: 'm3-seq-sg', src: 'pages/vtop__FALL2026-27_Lecture-notes-BAPHY105-Module-3/p11.png', crop: null, caption: 'Sequential Stern–Gerlach (z, x, z) with 2000 atoms: the −z beam comes back after the x magnet.', alt: 'An oven sends 2000 atoms into an SG z magnet; 1000 go on as +z and 1000 −z are blocked; an SG x magnet passes 500 +x and blocks 500 −x; a final SG z magnet splits them into 250 +z and 250 −z.' }
  ]
});
