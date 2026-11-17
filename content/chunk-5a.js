CHUNK({
  chunk: '5a',
  module: 'm5',
  topics: [
    {
      id: 'm5-qubits',
      title: 'Introduction to qubits: classical bits versus quantum bits',
      short: 'Qubits',
      blurb: 'What a qubit is, how it differs from a classical bit (the five-difference answer), and the physical systems used to build one.',
      source: 'Module 5 notes §5.1–5.2, Module 5 lecture deck (classical bit, quantum bit)',
      tabs: [
        { title: 'Bit and qubit', html: `
<p class="lead">Quantum computing processes information using the rules of quantum mechanics. Its basic unit is the <b>qubit</b> (quantum bit), the quantum counterpart of the classical bit.</p>
<p>A <b>classical bit</b> is a physical system with exactly two distinguishable states, ON and OFF, written 1 and 0. Every problem a conventional computer solves, however complicated, is translated into long strings of such bits and manipulated by logic gates. At any instant a bit is either 0 or 1, never both.</p>
<p>A <b>qubit</b> is a two-level quantum system. Its two basis states are written |0⟩ and |1⟩ (the <b>computational basis</b>), and they are represented by the column vectors</p>
<div class="eq">|0⟩ = (1, 0)ᵀ,   |1⟩ = (0, 1)ᵀ</div>
<p>Because the Schrödinger equation is linear, any linear combination of allowed states is also an allowed state. So besides |0⟩ and |1⟩ a qubit can be in a <b>superposition</b></p>
<div class="eq">|ψ⟩ = α|0⟩ + β|1⟩,   α, β complex,   |α|² + |β|² = 1</div>
<p>α and β are <b>probability amplitudes</b>: a measurement gives 0 with probability |α|² and 1 with probability |β|². After the measurement the qubit has collapsed to the state found, so a classical bit can be thought of as a collapsed qubit.</p>
<p>The two other ingredients that give quantum computers their power are <b>entanglement</b> (qubits whose joint state cannot be split into separate single-qubit states) and <b>interference</b> (amplitudes, being complex numbers, can add or cancel).</p>` },
        { title: 'Five differences', html: `
<div class="worked"><div class="given">List and explain at least five key differences between classical bits and quantum bits (qubits). [5 marks]</div>
<div class="solve">
<table class="tbl"><thead><tr><th>Feature</th><th>Classical bit</th><th>Qubit</th></tr></thead><tbody>
<tr><td>1. Possible states</td><td>Exactly one of two values, 0 or 1, at any time.</td><td>|0⟩, |1⟩ or any superposition α|0⟩ + β|1⟩, a continuum of states.</td></tr>
<tr><td>2. Description</td><td>A single binary number.</td><td>A unit vector in the complex space ℂ², with complex amplitudes α, β and |α|² + |β|² = 1; geometrically a point on the Bloch sphere.</td></tr>
<tr><td>3. Reading it</td><td>Reading does not change the bit; the value is certain.</td><td>Measurement is probabilistic (0 with probability |α|², 1 with |β|²) and collapses the superposition to the result.</td></tr>
<tr><td>4. Several units</td><td>n bits hold one of 2ⁿ values at a time; bits are always independent.</td><td>n qubits are described by 2ⁿ amplitudes at once and can be entangled, so the state of one cannot be described without the others.</td></tr>
<tr><td>5. Gates</td><td>Logic gates such as AND and OR can be irreversible and lose information.</td><td>Quantum gates are unitary matrices, always reversible, and conserve total probability.</td></tr>
<tr><td>6. Copying and phase</td><td>A bit can be copied freely; there is no phase.</td><td>An unknown qubit cannot be copied (no-cloning), and the relative phase between |0⟩ and |1⟩ carries information that produces interference.</td></tr>
<tr><td>7. Physical form</td><td>A transistor voltage, a magnetised domain, a charge.</td><td>An electron or nuclear spin, a photon’s polarisation, two atomic levels, a superconducting circuit, a trapped ion.</td></tr>
</tbody></table></div>
<div class="result">Any five of these rows, each with a sentence of explanation, answer the question.</div></div>
<div class="note exam"><p>For 5 marks write five points as full sentences that state both sides (bit, then qubit). The strongest five are: states (0 or 1 versus superposition), mathematical description (number versus vector in ℂ²), measurement (deterministic versus probabilistic with collapse), entanglement and 2ⁿ amplitudes, reversibility of gates.</p></div>` },
        { title: 'Making a qubit', html: `
<p class="lead">Any well-isolated quantum system with two distinguishable levels can serve as a qubit. The usual choices:</p>
<table class="tbl"><thead><tr><th>System</th><th>|0⟩</th><th>|1⟩</th></tr></thead><tbody>
<tr><td>Nuclear spin (NMR)</td><td>spin up ↑</td><td>spin down ↓</td></tr>
<tr><td>Photons in a cavity</td><td>no photon</td><td>one photon</td></tr>
<tr><td>Atomic energy levels</td><td>ground state</td><td>excited state</td></tr>
<tr><td>Photon polarisation</td><td>horizontal</td><td>vertical</td></tr>
<tr><td>Others</td><td colspan="2">superconducting circuits, trapped ions, electron spins</td></tr>
</tbody></table>
<p>Electrons are generally preferred over protons as spin qubits: a proton sits inside the nucleus and is much harder to reach and control, while an electron’s spin can be addressed with magnetic and microwave fields.</p>
<p>The main practical difficulty is <b>decoherence</b>: interaction with the surroundings destroys superposition and entanglement. Current research aims at longer coherence times through error correction and better materials (superconducting circuits, trapped ions).</p>` }
      ],
      flashcards: [
        { front: 'What is a qubit?', back: 'A two-level quantum system; its state is a unit vector α|0⟩ + β|1⟩ in ℂ².' },
        { front: 'Computational basis vectors', back: '|0⟩ = (1, 0)ᵀ, |1⟩ = (0, 1)ᵀ' },
        { front: 'Why can a qubit be in a superposition?', back: 'The Schrödinger equation is linear, so any combination of solutions is a solution.' },
        { front: 'Effect of measuring a qubit', back: 'Gives 0 with probability |α|² or 1 with |β|², and collapses the state to the result.' },
        { front: 'Photon-polarisation qubit', back: 'Horizontal = |0⟩, vertical = |1⟩.' },
        { front: 'NMR qubit', back: 'Nuclear spin up = |0⟩, spin down = |1⟩.' }
      ],
      oneLiners: [
        'A bit is 0 or 1; a qubit can be α|0⟩ + β|1⟩.',
        'n qubits need 2ⁿ complex amplitudes.',
        'Quantum gates are reversible; AND is not.',
        'Decoherence is the enemy of every qubit.'
      ],
      formulas: [
        { name: 'Qubit state', html: `|ψ⟩ = α|0⟩ + β|1⟩`, note: 'α, β complex' },
        { name: 'Normalisation', html: `|α|² + |β|² = 1`, note: '' }
      ]
    },
    {
      id: 'm5-single-qubit',
      title: 'Single-qubit states: amplitudes, normalisation and phase',
      short: 'Single-qubit states',
      blurb: 'The general state α|0⟩ + β|1⟩, why only two real parameters matter (normalisation and global phase), |+⟩ and |−⟩, and measurement probabilities with worked examples.',
      source: 'Module 5 notes §5.2, Module 5 lecture deck (quantum superposition, probability vectors)',
      tabs: [
        { title: 'The general state', html: `
<p class="lead">A qubit is a vector in the two-dimensional complex Hilbert space ℂ² = Span{|0⟩, |1⟩}.</p>
<div class="eq">|ψ⟩ = α|0⟩ + β|1⟩ = (α, β)ᵀ</div>
<div class="solve"><p><b>Counting parameters.</b> α and β are complex, so they carry 4 real numbers.</p>
<p><b>1. Normalisation</b> |α|² + |β|² = 1 (total probability 1) removes one: 3 left.</p>
<p><b>2. Global phase.</b> e<sup>iχ</sup>|ψ⟩ and |ψ⟩ give identical probabilities for every measurement, so they are the same physical state. Removing the overall phase leaves 2.</p>
<p><b>3.</b> The two that remain are the <b>relative size</b> of the amplitudes and their <b>relative phase</b>. Taking α real and positive, write α = cos(θ/2), β = e<sup>iφ</sup> sin(θ/2):</p></div>
<div class="result">|ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩,   0 ≤ θ ≤ π,  0 ≤ φ &lt; 2π</div>
<p>The relative phase φ does not change the probabilities in the {|0⟩, |1⟩} basis, but it is physical: it decides how the amplitudes interfere after a gate such as H.</p>
<h3>Important superpositions</h3>
<div class="eq">|+⟩ = (|0⟩ + |1⟩)/√2,   |−⟩ = (|0⟩ − |1⟩)/√2,   |±i⟩ = (|0⟩ ± i|1⟩)/√2</div>
<p>All of them give 0 or 1 with probability ½ each, yet they are different states: they differ only in relative phase (φ = 0, π, π/2, 3π/2).</p>` },
        { title: 'Worked examples', html: `
<div class="worked"><div class="given">Normalise |ψ⟩ = A(3|0⟩ + 4i|1⟩) and find the measurement probabilities.</div>
<div class="solve"><p>|A|²(|3|² + |4i|²) = |A|²(9 + 16) = 25|A|² = 1 ⇒ A = 1/5.</p>
<p>P(0) = |3/5|² = 9/25,  P(1) = |4i/5|² = 16/25. Check: 9/25 + 16/25 = 1.</p></div>
<div class="result">|ψ⟩ = (3|0⟩ + 4i|1⟩)/5,  P(0) = 0.36,  P(1) = 0.64</div></div>
<div class="worked"><div class="given">Is |ψ⟩ = (|0⟩ + |1⟩)/2 normalised?</div>
<div class="solve"><p>|½|² + |½|² = ¼ + ¼ = ½ ≠ 1. Multiply by √2: (|0⟩ + |1⟩)/√2 = |+⟩.</p></div>
<div class="result">No; the normalised state is |+⟩ = (|0⟩ + |1⟩)/√2</div></div>
<div class="worked"><div class="given">A qubit is (√3/2)|0⟩ + (1/2)|1⟩. Find P(0), P(1).</div>
<div class="solve"><p>P(0) = 3/4, P(1) = 1/4, sum 1.</p></div>
<div class="result">P(0) = 0.75, P(1) = 0.25</div></div>
<div class="worked"><div class="given">Show that |ψ⟩ and −|ψ⟩ (or i|ψ⟩) are the same physical state.</div>
<div class="solve"><p>Probabilities depend on |amplitude|², and |e<sup>iχ</sup>α|² = |α|², |e<sup>iχ</sup>β|² = |β|² for any real χ (χ = π gives −1, χ = π/2 gives i).</p></div>
<div class="result">A global phase changes no measurable quantity</div></div>` },
        { title: 'Picturing the amplitudes', html: `
<p class="lead">If the phase is ignored (α, β real and positive), the state is a unit arrow in a plane with |0⟩ along one axis and |1⟩ along the other, making angle θ/2 with the |0⟩ axis: α = cos(θ/2), β = sin(θ/2).</p>
<ul>
<li>Equal probabilities, |α|² = |β|² = ½: tan(θ/2) = 1, the arrow is at <b>45°</b> between the |0⟩ and |1⟩ axes.</li>
<li>|1⟩ twice as likely as |0⟩: β² = 2α², tan(θ/2) = √2, θ/2 ≈ 54.7° from the |0⟩ axis, that is about <b>35.3°</b> from the |1⟩ axis.</li>
<li>On measurement the arrow snaps to one axis: the result is a definite 0 or 1, as for a classical bit.</li>
</ul>
<div class="note heads-up"><p>The lecture deck describes the “twice as likely” arrow as tilted at about 30°. The exact angle is arctan(1/√2) ≈ 35.3° from the |1⟩ axis (54.7° from |0⟩); use the exact value if asked to compute it. The deck also says qubits “overlap without interference”; in fact amplitudes do interfere, and that interference is what quantum algorithms exploit.</p></div>` }
      ],
      flashcards: [
        { front: 'Real parameters in a physical qubit state', back: 'Two (θ and φ): 4 real numbers − normalisation − global phase.' },
        { front: 'Bloch parametrisation of a qubit', back: '|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩' },
        { front: '|+⟩ and |−⟩', back: '(|0⟩ ± |1⟩)/√2' },
        { front: 'Normalise A(3|0⟩ + 4i|1⟩)', back: 'A = 1/5; P(0) = 9/25, P(1) = 16/25.' },
        { front: 'Is the global phase measurable?', back: 'No. The relative phase is.' }
      ],
      oneLiners: [
        'P(0) = |α|², P(1) = |β|².',
        'e^{iχ}|ψ⟩ is the same state as |ψ⟩.',
        '|+⟩ and |−⟩ have equal probabilities but opposite relative phase.'
      ],
      formulas: [
        { name: 'General state', html: `|ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩`, note: '' },
        { name: 'Probabilities', html: `P(0) = cos²(θ/2),  P(1) = sin²(θ/2)`, note: '' }
      ]
    },
    {
      id: 'm5-bloch',
      title: 'The Bloch sphere',
      short: 'Bloch sphere',
      blurb: 'Every single-qubit state as a point on a unit sphere: θ and φ, the Bloch vector from Pauli expectation values, positions of |0⟩, |1⟩, |±⟩, |±i⟩, and finding the angles of a given state.',
      source: 'Module 5 notes §5.3, Fig. 5.1',
      tabs: [
        { title: 'Geometry', html: `
<p class="lead">Since a qubit state has exactly two real parameters, it can be drawn as a point on the surface of a unit sphere, the <b>Bloch sphere</b>.</p>
<figure data-fig="m5-bloch"></figure>
<ul>
<li><b>θ</b> is the polar angle from the +z axis, 0 ≤ θ ≤ π. <b>φ</b> is the azimuthal angle about z, measured from the x axis, 0 ≤ φ &lt; 2π.</li>
<li>North pole (θ = 0): |0⟩. South pole (θ = π): |1⟩. These are the computational basis states.</li>
<li>Equator (θ = π/2): equal superpositions. φ = 0 is |+⟩ (on +x), φ = π is |−⟩ (−x), φ = π/2 is |+i⟩ (+y), φ = 3π/2 is |−i⟩ (−y).</li>
<li>Orthogonal states sit at <b>opposite</b> points (|0⟩ and |1⟩, |+⟩ and |−⟩): angles on the sphere are twice the angles between state vectors, which is why θ/2 appears in the state.</li>
<li>Pure states lie on the surface. The Bloch sphere uses ordinary spherical coordinates with r = 1: x = sin θ cos φ, y = sin θ sin φ, z = cos θ.</li>
</ul>` },
        { title: 'Bloch vector', html: `
<p class="lead">The point is the unit vector n whose components are the expectation values of the Pauli matrices.</p>
<div class="eq">n = (⟨σₓ⟩, ⟨σ<sub>y</sub>⟩, ⟨σ<sub>z</sub>⟩),   ⟨σᵢ⟩ = ⟨ψ|σᵢ|ψ⟩</div>
<div class="eq">σₓ = [0 1; 1 0],   σ<sub>y</sub> = [0 −i; i 0],   σ<sub>z</sub> = [1 0; 0 −1]</div>
<div class="solve"><p><b>Derivation.</b> Let α = cos(θ/2), β = e<sup>iφ</sup> sin(θ/2).</p>
<p>σₓ|ψ⟩ = (β, α)ᵀ, so ⟨σₓ⟩ = α*β + β*α = 2Re(α*β) = 2 cos(θ/2) sin(θ/2) cos φ = <b>sin θ cos φ</b>.</p>
<p>σ<sub>y</sub>|ψ⟩ = (−iβ, iα)ᵀ, so ⟨σ<sub>y</sub>⟩ = −iα*β + iβ*α = 2Im(α*β) = 2 cos(θ/2) sin(θ/2) sin φ = <b>sin θ sin φ</b>.</p>
<p>σ<sub>z</sub>|ψ⟩ = (α, −β)ᵀ, so ⟨σ<sub>z</sub>⟩ = |α|² − |β|² = cos²(θ/2) − sin²(θ/2) = <b>cos θ</b>.</p>
<p>(using 2 sin(θ/2) cos(θ/2) = sin θ and cos²(θ/2) − sin²(θ/2) = cos θ)</p></div>
<div class="result">n = (sin θ cos φ, sin θ sin φ, cos θ),   |n| = 1</div>
<p>So the z component tells the bias between 0 and 1 (P(0) − P(1) = cos θ), and the x and y components carry the relative phase.</p>` },
        { title: 'Finding θ and φ', html: `
<p class="lead">Method: remove any global phase so the |0⟩ amplitude is real and positive, then match cos(θ/2) to |α| and φ to the phase of β.</p>
<div class="worked"><div class="given">Find the Bloch angles and vector of |ψ⟩ = (|0⟩ + i|1⟩)/√2.</div>
<div class="solve"><p>cos(θ/2) = 1/√2 ⇒ θ/2 = 45°, θ = 90°. e<sup>iφ</sup> = i ⇒ φ = 90°.</p>
<p>n = (sin 90° cos 90°, sin 90° sin 90°, cos 90°) = (0, 1, 0).</p></div>
<div class="result">θ = π/2, φ = π/2: the state |+i⟩ on the +y axis</div></div>
<div class="worked"><div class="given">Find the position of |ψ⟩ = (√3/2)|0⟩ + (1/2)|1⟩.</div>
<div class="solve"><p>cos(θ/2) = √3/2 ⇒ θ/2 = 30°, θ = 60°. β is real and positive ⇒ φ = 0.</p>
<p>n = (sin 60°, 0, cos 60°) = (0.866, 0, 0.5).</p></div>
<div class="result">θ = 60°, φ = 0; n = (0.866, 0, 0.5)</div></div>
<div class="worked"><div class="given">Find the position of |−⟩ = (|0⟩ − |1⟩)/√2.</div>
<div class="solve"><p>θ = 90°; −1 = e<sup>iπ</sup> ⇒ φ = π. n = (−1, 0, 0).</p></div>
<div class="result">|−⟩ lies on the −x axis</div></div>
<div class="worked"><div class="given">Write the state at θ = 120°, φ = 0 and its probabilities.</div>
<div class="solve"><p>|ψ⟩ = cos 60°|0⟩ + sin 60°|1⟩ = ½|0⟩ + (√3/2)|1⟩. P(0) = ¼, P(1) = ¾ (check: cos θ = −½ = P(0) − P(1)).</p></div>
<div class="result">|ψ⟩ = ½|0⟩ + (√3/2)|1⟩, P(1) = 0.75</div></div>` }
      ],
      flashcards: [
        { front: 'Bloch vector components', back: '(sin θ cos φ, sin θ sin φ, cos θ) = (⟨σx⟩, ⟨σy⟩, ⟨σz⟩)' },
        { front: 'Where are |0⟩ and |1⟩ on the Bloch sphere?', back: 'North pole and south pole.' },
        { front: 'Where are |+⟩, |−⟩, |+i⟩, |−i⟩?', back: 'On the equator at +x, −x, +y, −y.' },
        { front: 'Bloch angles of (|0⟩ + i|1⟩)/√2', back: 'θ = 90°, φ = 90°' },
        { front: 'Why θ/2 in the state?', back: 'Orthogonal states must be antipodal (180° apart) on the sphere.' },
        { front: '⟨σz⟩ in terms of probabilities', back: 'P(0) − P(1) = cos θ' }
      ],
      oneLiners: [
        'Bloch sphere = spherical coordinates with r = 1.',
        'Orthogonal qubit states are antipodal points.',
        'θ sets the probabilities, φ the relative phase.'
      ],
      formulas: [
        { name: 'Bloch vector', html: `n = (sin θ cos φ, sin θ sin φ, cos θ)`, note: '' },
        { name: 'Pauli expectations', html: `⟨σₓ⟩ = 2Re(α*β),  ⟨σ<sub>y</sub>⟩ = 2Im(α*β),  ⟨σ<sub>z</sub>⟩ = |α|² − |β|²`, note: '' }
      ]
    },
    {
      id: 'm5-two-qubit',
      title: 'Two-qubit systems and the tensor product',
      short: 'Two-qubit systems',
      blurb: 'The four-dimensional space ℂ² ⊗ ℂ², the basis |00⟩…|11⟩, general two-qubit states, joint probabilities, and the ad − bc test for product states.',
      source: 'Module 5 notes §5.4, Module 5 lecture deck (two-qubit system)',
      tabs: [
        { title: 'Tensor product space', html: `
<p class="lead">Two qubits together live in the tensor product ℂ² ⊗ ℂ², which is <b>four</b>-dimensional (2 × 2).</p>
<p>Its computational basis is formed from products of single-qubit basis states, first symbol for qubit 1:</p>
<div class="eq">|00⟩ = |0⟩⊗|0⟩ = (1,0,0,0)ᵀ,  |01⟩ = (0,1,0,0)ᵀ,  |10⟩ = (0,0,1,0)ᵀ,  |11⟩ = (0,0,0,1)ᵀ</div>
<p>The column vectors follow from the Kronecker product (a, b)ᵀ ⊗ (c, d)ᵀ = (ac, ad, bc, bd)ᵀ.</p>
<div class="eq">|Ψ⟩ = a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩,   |a|² + |b|² + |c|² + |d|² = 1</div>
<p>Measuring both qubits gives 00, 01, 10, 11 with probabilities |a|², |b|², |c|², |d|². Conversely, from measured probabilities one can recover the sizes of the amplitudes by taking square roots. With n qubits the space has 2ⁿ dimensions, which is the source of the exponential size of a quantum register.</p>` },
        { title: 'Product states', html: `
<p class="lead">A two-qubit state is <b>separable</b> (a product state) if it equals (α|0⟩ + β|1⟩) ⊗ (γ|0⟩ + δ|1⟩).</p>
<div class="solve"><p><b>1.</b> Expand: αγ|00⟩ + αδ|01⟩ + βγ|10⟩ + βδ|11⟩.</p>
<p><b>2.</b> Compare with the general state: a = αγ, b = αδ, c = βγ, d = βδ.</p>
<p><b>3.</b> ad = αβγδ and bc = αβγδ, so for every product state:</p></div>
<div class="result">separable ⇒ ad − bc = 0;   ad − bc ≠ 0 ⇒ entangled</div>
<p>(For two qubits the converse also holds: if ad − bc = 0 the state can be factorised.)</p>
<div class="worked"><div class="given">Two independent qubits are each in |+⟩. Write the joint state and the probability of each outcome.</div>
<div class="solve"><p>|+⟩⊗|+⟩ = ½(|0⟩ + |1⟩)(|0⟩ + |1⟩) = ½(|00⟩ + |01⟩ + |10⟩ + |11⟩).</p>
<p>Each probability = (½)² = ¼ (independent events: ½ × ½). Test: ad − bc = ¼ − ¼ = 0, separable as expected.</p></div>
<div class="result">P(00) = P(01) = P(10) = P(11) = 1/4</div></div>
<div class="worked"><div class="given">Is (|00⟩ + |01⟩)/√2 entangled?</div>
<div class="solve"><p>a = b = 1/√2, c = d = 0: ad − bc = 0 − 0 = 0. Indeed it equals |0⟩ ⊗ (|0⟩ + |1⟩)/√2 = |0⟩|+⟩.</p></div>
<div class="result">No, it is the product state |0⟩|+⟩</div></div>
<div class="worked"><div class="given">Is (|00⟩ + |11⟩)/√2 entangled?</div>
<div class="solve"><p>a = d = 1/√2, b = c = 0: ad − bc = ½ ≠ 0.</p></div>
<div class="result">Yes, it is entangled (the Bell state |Φ⁺⟩)</div></div>` }
      ],
      flashcards: [
        { front: 'Dimension of the two-qubit space', back: '4 (ℂ² ⊗ ℂ²); n qubits: 2ⁿ.' },
        { front: 'Two-qubit computational basis', back: '|00⟩, |01⟩, |10⟩, |11⟩' },
        { front: 'Kronecker product (a, b) ⊗ (c, d)', back: '(ac, ad, bc, bd)' },
        { front: 'Product-state test for a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩', back: 'ad − bc = 0; if ad − bc ≠ 0 the state is entangled.' },
        { front: 'Probabilities for |+⟩|+⟩', back: '1/4 each for 00, 01, 10, 11.' }
      ],
      oneLiners: [
        'Two qubits need four amplitudes.',
        'Product state ⇔ ad = bc.',
        'Independent qubits multiply probabilities.'
      ],
      formulas: [
        { name: 'Two-qubit state', html: `|Ψ⟩ = a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩`, note: 'Σ|·|² = 1' },
        { name: 'Entanglement test', html: `ad − bc ≠ 0`, note: 'two qubits' }
      ]
    },
    {
      id: 'm5-entanglement',
      title: 'Quantum entanglement',
      short: 'Entanglement',
      blurb: 'What entanglement means, the electron–positron example, how entangled pairs are made in the laboratory, and where they are used: the full answer to the entanglement essay question.',
      source: 'Module 5 notes §5.4, Module 5 lecture deck (quantum entanglement)',
      tabs: [
        { title: 'What it is', html: `
<p class="lead"><b>Entanglement</b> is a correlation between two or more quantum systems such that their joint state cannot be written as a product of the individual states. The parts lose their separate identities: the state of one depends inseparably on the others, however far apart they are.</p>
<p>Example: α|00⟩ + β|11⟩ with α, β both non-zero has ad − bc = αβ ≠ 0, so it is entangled. With |α| = |β| = 1/√2 it becomes (|00⟩ + |11⟩)/√2, a maximally entangled Bell state.</p>
<p>In such a state neither qubit has a definite value of its own: each alone shows 0 or 1 at random with probability ½. But the outcomes are perfectly correlated: in (|00⟩ + |11⟩)/√2, if qubit 1 gives 0, qubit 2 is certain to give 0; if qubit 1 gives 1, qubit 2 gives 1. Measuring one immediately fixes the other, even when they are spatially separated. These <b>nonlocal correlations</b> are stronger than any classical correlation, as shown by experimental violations of Bell inequalities. (They cannot be used to send a signal faster than light, because each individual result is random.)</p>
<div class="note"><p><b>Coin analogy.</b> Two separate fair coins both show heads with probability ¼. If the coins were “linked” so that they always agree, both-heads happens with probability ½: knowing one tells you the other. Entanglement behaves like this, though the quantum correlations hold in every measurement basis, which no pair of ordinary coins can mimic.</p></div>` },
        { title: 'Physical example', html: `
<p class="lead">A spin-zero particle decaying into an electron–positron pair.</p>
<div class="solve"><p><b>1.</b> Angular momentum is conserved, so the total spin of e⁻ and e⁺ must stay zero.</p>
<p><b>2.</b> The only two-spin-½ state with total spin zero is the singlet:</p></div>
<div class="result">|ψ⟩ = (1/√2)(|↑⟩<sub>e⁻</sub>|↓⟩<sub>e⁺</sub> − |↓⟩<sub>e⁻</sub>|↑⟩<sub>e⁺</sub>)</div>
<div class="solve"><p><b>3.</b> Before measurement neither particle has a definite spin direction. If the electron is found spin up, the positron is certainly spin down, and vice versa, no matter how far apart they have travelled.</p>
<p><b>4.</b> With ↑ = |0⟩, ↓ = |1⟩ this is (|01⟩ − |10⟩)/√2 = |Ψ⁻⟩, one of the four Bell states.</p></div>` },
        { title: 'Making it in the lab', html: `
<p class="lead">Entanglement occurs naturally (atomic cascades, particle decays) and can be produced on demand.</p>
<ul>
<li><b>Spontaneous parametric down-conversion (SPDC):</b> a laser photon passing through a nonlinear crystal (such as BBO) occasionally splits into two lower-energy photons. Energy and momentum conservation make the pair’s polarisations entangled, for example (|HV⟩ + |VH⟩)/√2. This is the standard source for quantum-optics experiments and quantum communication.</li>
<li><b>Quantum gates:</b> in a quantum computer, a Hadamard gate on one qubit followed by a CNOT gate entangles two qubits, |00⟩ → (|00⟩ + |11⟩)/√2 (see Generation of entangled states).</li>
<li><b>Laser or microwave control:</b> trapped ions, neutral atoms and superconducting qubits are entangled by shared vibrational modes or couplings driven by precisely timed laser or microwave pulses.</li>
<li><b>Natural processes:</b> atomic cascade decays emit polarisation-entangled photon pairs; particle decays give spin-entangled pairs, as in the e⁻e⁺ example.</li>
</ul>` },
        { title: 'Applications', html: `
<ul>
<li><b>Quantum computing:</b> entangling gates (CNOT) are needed for universal computation; algorithms draw their speed-up from entangled superpositions over 2ⁿ states.</li>
<li><b>Quantum teleportation:</b> a shared Bell pair plus two classical bits transfers an unknown qubit state from one place to another.</li>
<li><b>Superdense coding:</b> sending one qubit of a shared Bell pair transmits two classical bits.</li>
<li><b>Quantum cryptography (QKD, e.g. E91):</b> correlations of entangled pairs produce a secret key; any eavesdropping disturbs the correlations and is detected.</li>
<li><b>Quantum networks and repeaters:</b> distributing Bell pairs over long distances, including by satellite (the Micius experiments).</li>
<li><b>Precision measurement:</b> entangled states improve the sensitivity of atomic clocks, interferometers and sensors.</li>
<li><b>Tests of quantum mechanics:</b> Bell-inequality experiments rule out local hidden-variable theories.</li>
</ul>
<div class="note exam"><p><b>Essay answer plan</b> (“Describe entanglement with an example; how it is created in the lab; applications”): definition (non-factorisable joint state) with the ad − bc test; the e⁻e⁺ singlet or |Φ⁺⟩ with the measurement correlation; SPDC, H + CNOT circuit, laser/microwave control of ions and superconducting qubits; then four or five applications (teleportation, superdense coding, QKD, computing, networks, sensing).</p></div>` }
      ],
      flashcards: [
        { front: 'Define entanglement', back: 'A joint state of two or more systems that cannot be written as a product of individual states.' },
        { front: 'Spin state of e⁻e⁺ from a spin-zero decay', back: '(|↑↓⟩ − |↓↑⟩)/√2, the singlet |Ψ⁻⟩.' },
        { front: 'Main optical method for entangled photons', back: 'Spontaneous parametric down-conversion in a nonlinear crystal.' },
        { front: 'Circuit that entangles two qubits', back: 'H on qubit 1, then CNOT with qubit 1 as control.' },
        { front: 'Can entanglement send signals faster than light?', back: 'No; each individual outcome is random.' },
        { front: 'Name three uses of entanglement', back: 'Teleportation, superdense coding, quantum key distribution (also computing, networks, sensing).' }
      ],
      oneLiners: [
        'Entangled qubits have no individual states.',
        'Each qubit of a Bell pair alone is a 50:50 coin.',
        'SPDC, H + CNOT, laser/microwave pulses make entanglement.'
      ],
      formulas: [
        { name: 'Singlet', html: `(|↑↓⟩ − |↓↑⟩)/√2`, note: 'total spin zero' },
        { name: 'Test', html: `ad − bc ≠ 0 ⇒ entangled`, note: '' }
      ]
    },
    {
      id: 'm5-bell',
      title: 'Bell states',
      short: 'Bell states',
      blurb: 'The four Bell states, their forms, why they are maximally entangled, their orthonormality, and what measuring one qubit does to the other.',
      source: 'Module 5 notes §5.4 and §5.6.1, Module 5 lecture deck (Bell states)',
      tabs: [
        { title: 'The four states', html: `
<p class="lead">The <b>Bell states</b> (EPR pairs) are four specific maximally entangled two-qubit states.</p>
<div class="eq">|Φ⁺⟩ = (|00⟩ + |11⟩)/√2,   |Φ⁻⟩ = (|00⟩ − |11⟩)/√2</div>
<div class="eq">|Ψ⁺⟩ = (|01⟩ + |10⟩)/√2,   |Ψ⁻⟩ = (|01⟩ − |10⟩)/√2</div>
<ul>
<li>Φ states: the two qubits always <b>agree</b> (00 or 11). Ψ states: they always <b>disagree</b> (01 or 10).</li>
<li>The sign (+ or −) is the relative phase; it is invisible in a single Z-basis measurement but distinguishes the states in other bases.</li>
<li>They are <b>orthonormal</b>: each has norm (1/√2)² + (1/√2)² = 1, and ⟨Φ⁺|Φ⁻⟩ = ½(1 − 1) = 0, while Φ and Ψ states share no basis kets so their overlap is 0. Being four orthonormal vectors in a four-dimensional space, they form a <b>basis</b> (the Bell basis) of the two-qubit space.</li>
<li>|Ψ⁻⟩ is the spin singlet (total spin 0); the other three are total-spin-1 combinations.</li>
</ul>` },
        { title: 'Why maximally entangled', html: `
<div class="solve"><p><b>1. Not a product.</b> For |Φ⁺⟩, a = d = 1/√2, b = c = 0: ad − bc = ½ ≠ 0. For |Ψ±⟩, ad − bc = ∓½. Every Bell state fails the product test, so none can be written as |a⟩⊗|b⟩.</p>
<p><b>2. |ad − bc| is as large as possible.</b> For normalised states |ad − bc| ≤ ½ (twice it is the “concurrence”, which runs from 0 for product states to 1). The Bell states reach ½: the maximum.</p>
<p><b>3. Each qubit alone is completely random.</b> In |Φ⁺⟩ qubit 1 gives 0 or 1 with probability ½ each, and so does qubit 2: individually they carry no information at all. All the information sits in the correlation between them.</p>
<p><b>4. Perfect correlation.</b> Measuring one qubit fixes the other with certainty, and (unlike classical correlation) this holds in every measurement basis; the states maximally violate the Bell (CHSH) inequality.</p></div>
<div class="result">Bell states: equal-weight superpositions of two perfectly correlated terms; individual qubits completely undetermined, joint state completely determined</div>` },
        { title: 'Measuring one qubit', html: `
<div class="worked"><div class="given">Two qubits share |Φ⁺⟩ = (|00⟩ + |11⟩)/√2. Explain how a measurement on qubit 1 affects qubit 2. [3 marks]</div>
<div class="solve"><p>Qubit 1 gives 0 with probability |1/√2|² = ½. The state then collapses to the terms consistent with that result: |00⟩, so qubit 2 is now definitely |0⟩.</p>
<p>Qubit 1 gives 1 with probability ½; the state collapses to |11⟩ and qubit 2 is definitely |1⟩.</p>
<p>Before the measurement qubit 2 had no definite value; afterwards it is fixed, instantaneously and regardless of distance. The result itself is random, so no message is sent.</p></div>
<div class="result">Outcome of qubit 2 = outcome of qubit 1, each with probability ½</div></div>
<div class="worked"><div class="given">The same for |Ψ⁻⟩ = (|01⟩ − |10⟩)/√2.</div>
<div class="solve"><p>Qubit 1 = 0 (probability ½) ⇒ state |01⟩, qubit 2 = 1. Qubit 1 = 1 (probability ½) ⇒ −|10⟩, qubit 2 = 0.</p></div>
<div class="result">Anti-correlated: the qubits always give opposite results</div></div>
<div class="note exam"><p>For “What are Bell states? Forms, properties that make them maximally entangled” write all four states, then: not factorisable (ad − bc ≠ 0), equal weights, each qubit alone random, perfect correlation in any basis, Bell-inequality violation, orthonormal basis of the two-qubit space. Add the H + CNOT circuit if part (ii) asks for generation.</p></div>` }
      ],
      flashcards: [
        { front: '|Φ⁺⟩ and |Φ⁻⟩', back: '(|00⟩ ± |11⟩)/√2' },
        { front: '|Ψ⁺⟩ and |Ψ⁻⟩', back: '(|01⟩ ± |10⟩)/√2' },
        { front: 'Which Bell states give agreeing results?', back: 'Φ⁺ and Φ⁻ (00 or 11).' },
        { front: 'ad − bc for |Φ⁺⟩', back: '1/2, the maximum possible magnitude.' },
        { front: 'Probability of 0 for one qubit of a Bell pair', back: '1/2' },
        { front: 'Which Bell state is the spin singlet?', back: '|Ψ⁻⟩' }
      ],
      oneLiners: [
        'Four Bell states form an orthonormal basis.',
        'Maximal entanglement: |ad − bc| = 1/2.',
        'Measuring one qubit of a Bell pair fixes the other.'
      ],
      formulas: [
        { name: 'Φ states', html: `|Φ<sup>±</sup>⟩ = (|00⟩ ± |11⟩)/√2`, note: '' },
        { name: 'Ψ states', html: `|Ψ<sup>±</sup>⟩ = (|01⟩ ± |10⟩)/√2`, note: '' }
      ]
    },
    {
      id: 'm5-gates',
      title: 'Single-qubit gates and reversible logic',
      short: 'Single-qubit gates',
      blurb: 'Why quantum gates must be reversible, the AND-gate counter-example, unitary matrices and what unitarity guarantees, and the table of single-qubit gates.',
      source: 'Module 5 notes §5.5.1, Table 5.1, Module 5 lecture deck (reversible logic)',
      tabs: [
        { title: 'Reversibility', html: `
<p class="lead">Quantum gates are the operations that change qubit states; circuits are built from them. Unlike ordinary logic gates, every quantum gate must be <b>reversible</b>: the input must be recoverable from the output.</p>
<p>A classical <b>AND</b> gate is not reversible:</p>
<table class="tbl"><thead><tr><th>A</th><th>B</th><th>A AND B</th></tr></thead><tbody>
<tr><td>0</td><td>0</td><td>0</td></tr><tr><td>0</td><td>1</td><td>0</td></tr><tr><td>1</td><td>0</td><td>0</td></tr><tr><td>1</td><td>1</td><td>1</td></tr>
</tbody></table>
<p>Three different inputs give the same output 0, so from the output alone the input cannot be found: information is destroyed. Erasing information dissipates heat (Landauer’s principle), and in a quantum device it would disturb the fragile superposition. Quantum gates therefore map each input to a unique output.</p>` },
        { title: 'Unitary matrices', html: `
<p class="lead">A single-qubit gate is a 2 × 2 <b>unitary</b> matrix U acting on the column vector (α, β)ᵀ.</p>
<div class="eq">U†U = UU† = I,   U† = (Uᵀ)*</div>
<ul>
<li><b>Reversibility:</b> U† = U⁻¹, so the inverse gate always exists and |ψ⟩ = U†(U|ψ⟩).</li>
<li><b>Norm preservation:</b> ‖U|ψ⟩‖² = ⟨ψ|U†U|ψ⟩ = ⟨ψ|ψ⟩ = 1, so total probability stays 1; no probability is created or lost.</li>
<li>Geometrically every single-qubit gate is a <b>rotation of the Bloch sphere</b> (up to a global phase).</li>
</ul>
<div class="worked"><div class="given">Show that the Hadamard matrix H = (1/√2)[1 1; 1 −1] is unitary.</div>
<div class="solve"><p>H is real and symmetric, so H† = H.</p>
<p>H†H = H² = ½[1·1 + 1·1, 1·1 + 1·(−1); 1·1 + (−1)·1, 1·1 + (−1)(−1)] = ½[2 0; 0 2] = I.</p></div>
<div class="result">H†H = I: H is unitary and is its own inverse</div></div>
<div class="note heads-up"><p>The course notes list CNOT among “reversible single-qubit gates” next to X and H. CNOT is reversible but acts on <b>two</b> qubits; the single-qubit examples are X, Y, Z, H and T.</p></div>` },
        { title: 'Gate table', html: `
<table class="tbl"><thead><tr><th>Gate</th><th>Matrix</th><th>Action on α|0⟩ + β|1⟩</th><th>Bloch sphere</th></tr></thead><tbody>
<tr><td>X (NOT)</td><td>[0 1; 1 0]</td><td>β|0⟩ + α|1⟩</td><td>π about x</td></tr>
<tr><td>Y</td><td>[0 −i; i 0]</td><td>−iβ|0⟩ + iα|1⟩</td><td>π about y</td></tr>
<tr><td>Z (phase flip)</td><td>[1 0; 0 −1]</td><td>α|0⟩ − β|1⟩</td><td>π about z</td></tr>
<tr><td>H (Hadamard)</td><td>(1/√2)[1 1; 1 −1]</td><td>((α + β)/√2)|0⟩ + ((α − β)/√2)|1⟩</td><td>(x, y, z) → (z, −y, x)</td></tr>
<tr><td>T (π/8)</td><td>[1 0; 0 e<sup>iπ/4</sup>]</td><td>α|0⟩ + e<sup>iπ/4</sup>β|1⟩</td><td>π/4 about z</td></tr>
</tbody></table>
<p>X, Y, Z and H are each their own inverse (X² = Y² = Z² = H² = I). A small <b>universal set</b> (for example H, T and CNOT) is enough to approximate any quantum computation.</p>` }
      ],
      flashcards: [
        { front: 'Why must quantum gates be reversible?', back: 'Losing information creates heat and destroys superposition; quantum evolution is unitary.' },
        { front: 'Unitary condition', back: 'U†U = UU† = I' },
        { front: 'Two consequences of unitarity', back: 'Reversibility (U⁻¹ = U†) and norm (probability) preservation.' },
        { front: 'Why is AND irreversible?', back: 'Inputs 00, 01, 10 all give 0, so the input cannot be recovered.' },
        { front: 'H²', back: 'I' }
      ],
      oneLiners: [
        'Every quantum gate is a unitary matrix.',
        'Single-qubit gates are rotations of the Bloch sphere.',
        'X, Y, Z, H are self-inverse.'
      ],
      formulas: [
        { name: 'Unitarity', html: `U†U = I`, note: '' },
        { name: 'Norm', html: `‖U|ψ⟩‖ = ‖|ψ⟩‖`, note: '' }
      ]
    },
    {
      id: 'm5-pauli-h',
      title: 'Pauli and Hadamard gates',
      short: 'Pauli and Hadamard',
      blurb: 'X, Y, Z and H in detail: matrices, action on basis and general states, the Bloch-sphere rotations (with the (θ, φ) proof for X), Z on |+⟩, H|0⟩ = |+⟩ and HZH = X.',
      source: 'Module 5 notes §5.5.2–5.5.5, Module 5 lecture deck (single qubit operations)',
      tabs: [
        { title: 'Pauli X', html: `
<p class="lead">The X (NOT, bit-flip) gate swaps the amplitudes of |0⟩ and |1⟩.</p>
<div class="eq">X = [0 1; 1 0],   X|0⟩ = |1⟩,  X|1⟩ = |0⟩,   X(α|0⟩ + β|1⟩) = β|0⟩ + α|1⟩</div>
<p>On superpositions: X|+⟩ = |+⟩ and X|−⟩ = (|1⟩ − |0⟩)/√2 = −|−⟩. So |±⟩ are the eigenvectors of X with eigenvalues ±1; X leaves |+⟩ alone and gives |−⟩ a (global) phase −1.</p>
<figure data-fig="m5-gate-actions"></figure>
<h3>X is a half-turn about the x axis</h3>
<div class="solve"><p><b>1.</b> Start from |ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩.</p>
<p><b>2.</b> X|ψ⟩ = e<sup>iφ</sup> sin(θ/2)|0⟩ + cos(θ/2)|1⟩ = e<sup>iφ</sup>[sin(θ/2)|0⟩ + e<sup>−iφ</sup> cos(θ/2)|1⟩].</p>
<p><b>3.</b> Drop the global phase e<sup>iφ</sup>, and use sin(θ/2) = cos((π − θ)/2), cos(θ/2) = sin((π − θ)/2):</p>
<p>X|ψ⟩ ≅ cos((π − θ)/2)|0⟩ + e<sup>−iφ</sup> sin((π − θ)/2)|1⟩.</p>
<p><b>4.</b> So (θ, φ) → (π − θ, −φ), and the Bloch vector (sin θ cos φ, sin θ sin φ, cos θ) → (sin θ cos φ, −sin θ sin φ, −cos θ).</p></div>
<div class="result">X: (x, y, z) → (x, −y, −z), a rotation by π about the x axis</div>` },
        { title: 'Pauli Y and Z', html: `
<h3>Y gate</h3>
<div class="eq">Y = [0 −i; i 0],   Y|0⟩ = i|1⟩,  Y|1⟩ = −i|0⟩</div>
<div class="worked"><div class="given">Find the state after a Pauli-Y gate acts on |ψ⟩ = α|0⟩ + β|1⟩. [3 marks]</div>
<div class="solve"><p>Y(α, β)ᵀ = (0·α + (−i)β, iα + 0·β)ᵀ = (−iβ, iα)ᵀ.</p></div>
<div class="result">Y|ψ⟩ = −iβ|0⟩ + iα|1⟩</div></div>
<p>Y flips the bit like X and also adds phases. On the Bloch sphere (θ, φ) → (π − θ, π − φ), so</p>
<div class="result">Y: (x, y, z) → (−x, y, −z), a rotation by π about the y axis</div>
<h3>Z gate (phase flip)</h3>
<div class="eq">Z = [1 0; 0 −1],   Z|0⟩ = |0⟩,  Z|1⟩ = −|1⟩,   Z(α|0⟩ + β|1⟩) = α|0⟩ − β|1⟩</div>
<p>Z does not flip the bit; it changes the <b>relative phase</b> by π: φ → φ + π with θ unchanged, so</p>
<div class="result">Z: (x, y, z) → (−x, −y, z), a rotation by π about the z axis</div>
<div class="worked"><div class="given">A qubit is in |ψ⟩ = (|0⟩ + |1⟩)/√2. Find the new state after a Pauli-Z gate. [5 marks]</div>
<div class="solve"><p>In vectors: Z(1/√2)(1, 1)ᵀ = (1/√2)(1·1 + 0·1, 0·1 + (−1)·1)ᵀ = (1/√2)(1, −1)ᵀ.</p>
<p>So Z|ψ⟩ = (|0⟩ − |1⟩)/√2 = |−⟩.</p>
<p>Probabilities are unchanged (P(0) = P(1) = ½) but the relative phase has changed from 0 to π: on the Bloch sphere the vector moves from +x (θ = 90°, φ = 0) to −x (θ = 90°, φ = 180°), a half-turn about z. The new state is orthogonal to the old one: ⟨+|−⟩ = ½(1 − 1) = 0.</p></div>
<div class="result">Z|+⟩ = |−⟩ = (|0⟩ − |1⟩)/√2</div></div>
<div class="note exam"><p>“Write the matrices of X, Y, Z and explain their action on a general state on the Bloch sphere”: give the three matrices, their effect on |0⟩, |1⟩ and on α|0⟩ + β|1⟩, then the three rotations (x, −y, −z), (−x, y, −z), (−x, −y, z) with a sphere sketch, and the (θ, φ) proof for X.</p></div>` },
        { title: 'Hadamard', html: `
<p class="lead">The Hadamard gate creates equal superpositions from basis states, and undoes them.</p>
<div class="eq">H = (1/√2)[1 1; 1 −1]</div>
<div class="worked"><div class="given">Show that H|0⟩ = |+⟩ and H|1⟩ = |−⟩. [6 marks]</div>
<div class="solve"><p>H|0⟩ = (1/√2)[1 1; 1 −1](1, 0)ᵀ = (1/√2)(1·1 + 1·0, 1·1 + (−1)·0)ᵀ = (1/√2)(1, 1)ᵀ = (|0⟩ + |1⟩)/√2 = |+⟩.</p>
<p>H|1⟩ = (1/√2)[1 1; 1 −1](0, 1)ᵀ = (1/√2)(1·0 + 1·1, 1·0 + (−1)·1)ᵀ = (1/√2)(1, −1)ᵀ = (|0⟩ − |1⟩)/√2 = |−⟩.</p>
<p>Since H² = I, also H|+⟩ = |0⟩ and H|−⟩ = |1⟩.</p></div>
<div class="result">H|0⟩ = |+⟩,  H|1⟩ = |−⟩</div></div>
<p>General state: H(α|0⟩ + β|1⟩) = ((α + β)/√2)|0⟩ + ((α − β)/√2)|1⟩.</p>
<p><b>Bloch sphere:</b> (x, y, z) → (z, −y, x). It swaps the x and z components and reverses y: a half-turn about the axis midway between x and z, so it carries the poles (|0⟩, |1⟩) to the equator (|+⟩, |−⟩) and back.</p>
<div class="worked"><div class="given">Show that HZH = X (and similarly HXH = Z).</div>
<div class="solve"><p>ZH = (1/√2)[1 1; −1 1]. Then H(ZH) = ½[1·1 + 1·(−1), 1·1 + 1·1; 1·1 + (−1)(−1), 1·1 + (−1)·1] = ½[0 2; 2 0] = [0 1; 1 0].</p></div>
<div class="result">HZH = X: a phase flip seen in the |±⟩ basis is a bit flip</div></div>
<h3>T gate</h3>
<p>T = [1 0; 0 e<sup>iπ/4</sup>] multiplies only the |1⟩ amplitude by e<sup>iπ/4</sup>: T(α|0⟩ + β|1⟩) = α|0⟩ + e<sup>iπ/4</sup>β|1⟩, a rotation by π/4 about z. T² = S = [1 0; 0 i] and T⁴ = Z.</p>` }
      ],
      flashcards: [
        { front: 'X, Y, Z matrices', back: 'X = [0 1; 1 0], Y = [0 −i; i 0], Z = [1 0; 0 −1]' },
        { front: 'Bloch action of X, Y, Z', back: 'X: (x, −y, −z); Y: (−x, y, −z); Z: (−x, −y, z); half-turns about x, y, z.' },
        { front: 'Y(α|0⟩ + β|1⟩)', back: '−iβ|0⟩ + iα|1⟩' },
        { front: 'Z|+⟩', back: '|−⟩' },
        { front: 'H|0⟩ and H|1⟩', back: '|+⟩ and |−⟩' },
        { front: 'HZH', back: 'X' },
        { front: 'Effect of X on (θ, φ)', back: '(π − θ, −φ)' }
      ],
      oneLiners: [
        'X flips bits, Z flips phase, Y does both.',
        'H turns poles into equator points.',
        'Z leaves probabilities unchanged.',
        'H(α, β) = ((α + β)/√2, (α − β)/√2).'
      ],
      formulas: [
        { name: 'Hadamard', html: `H = (1/√2)[1 1; 1 −1]`, note: '' },
        { name: 'H on Bloch sphere', html: `(x, y, z) → (z, −y, x)`, note: '' },
        { name: 'T gate', html: `T = diag(1, e<sup>iπ/4</sup>)`, note: '' }
      ]
    },
    {
      id: 'm5-cnot',
      title: 'Two-qubit gates: the CNOT gate',
      short: 'CNOT gate',
      blurb: 'Control and target, the truth table, the 4 × 4 matrix, action on a general two-qubit state, the circuit symbol, and how CNOT on a superposed control creates entanglement.',
      source: 'Module 5 notes §5.6, Module 5 lecture deck (two qubit operations)',
      tabs: [
        { title: 'Definition', html: `
<p class="lead">The <b>controlled-NOT (CNOT)</b> gate acts on two qubits: a <b>control</b> (first) and a <b>target</b> (second). If the control is |1⟩ the target is flipped (X is applied); if the control is |0⟩ nothing happens.</p>
<table class="tbl"><thead><tr><th>Input |c t⟩</th><th>Output</th></tr></thead><tbody>
<tr><td>|00⟩</td><td>|00⟩</td></tr><tr><td>|01⟩</td><td>|01⟩</td></tr><tr><td>|10⟩</td><td>|11⟩</td></tr><tr><td>|11⟩</td><td>|10⟩</td></tr>
</tbody></table>
<p>Compactly CNOT|c, t⟩ = |c, t ⊕ c⟩ (⊕ = addition mod 2, the classical XOR). Each output occurs once, so the gate is reversible; applying it twice gives back the input (CNOT² = I).</p>
<p><b>Circuit symbol:</b> a filled dot on the control line joined by a vertical line to ⊕ on the target line (see the Bell-circuit figure in Generation of entangled states).</p>` },
        { title: 'Matrix', html: `
<p class="lead">In the ordered basis {|00⟩, |01⟩, |10⟩, |11⟩}:</p>
<div class="eq">U<sub>CNOT</sub> = [1 0 0 0; 0 1 0 0; 0 0 0 1; 0 0 1 0] = [I 0; 0 X]</div>
<div class="worked"><div class="given">Apply CNOT to the general state a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩.</div>
<div class="solve"><p>U<sub>CNOT</sub>(a, b, c, d)ᵀ = (a, b, d, c)ᵀ.</p>
<p>Only the last two amplitudes swap, because only in |10⟩ and |11⟩ is the control 1.</p></div>
<div class="result">CNOT|Ψ⟩ = a|00⟩ + b|01⟩ + d|10⟩ + c|11⟩</div></div>
<p>U<sub>CNOT</sub> is real and symmetric and U<sub>CNOT</sub>² = I, so it is unitary.</p>` },
        { title: 'Creating entanglement', html: `
<div class="worked"><div class="given">The control is in (|0⟩ + |1⟩)/√2 and the target in |0⟩. Find the output of CNOT.</div>
<div class="solve"><p>Input: (1/√2)(|0⟩ + |1⟩)|0⟩ = (1/√2)(|00⟩ + |10⟩), vector (1/√2)(1, 0, 1, 0)ᵀ.</p>
<p>CNOT leaves |00⟩ and turns |10⟩ into |11⟩: output (1/√2)(1, 0, 0, 1)ᵀ.</p>
<p>Test: a = d = 1/√2, b = c = 0, ad − bc = ½ ≠ 0, so it is not a product state.</p></div>
<div class="result">CNOT[(|0⟩ + |1⟩)|0⟩/√2] = (|00⟩ + |11⟩)/√2 = |Φ⁺⟩, entangled</div></div>
<p>A product input has become entangled: single-qubit gates alone can never do this, which is why a two-qubit gate such as CNOT is essential for universal quantum computation.</p>` }
      ],
      flashcards: [
        { front: 'CNOT rule', back: 'Flip the target if the control is |1⟩; otherwise do nothing.' },
        { front: 'CNOT|10⟩ and CNOT|11⟩', back: '|11⟩ and |10⟩' },
        { front: 'CNOT matrix', back: '[1 0 0 0; 0 1 0 0; 0 0 0 1; 0 0 1 0]' },
        { front: 'CNOT on (a, b, c, d)', back: '(a, b, d, c)' },
        { front: 'CNOT on (|0⟩ + |1⟩)|0⟩/√2', back: '(|00⟩ + |11⟩)/√2' }
      ],
      oneLiners: [
        'CNOT|c, t⟩ = |c, t ⊕ c⟩.',
        'Dot = control, ⊕ = target.',
        'CNOT² = I.'
      ],
      formulas: [
        { name: 'CNOT', html: `U<sub>CNOT</sub> = [I 0; 0 X]`, note: 'basis 00, 01, 10, 11' },
        { name: 'Rule', html: `|c, t⟩ → |c, t ⊕ c⟩`, note: '' }
      ]
    },
    {
      id: 'm5-bell-gen',
      title: 'Generation of entangled states',
      short: 'Generating entanglement',
      blurb: 'The Hadamard-then-CNOT circuit, the state after each step in Dirac and matrix form, all four Bell states from the four inputs, and open questions.',
      source: 'Module 5 notes §5.6.1 and §5.7, Module 5 lecture deck (entangled states generation, open questions)',
      tabs: [
        { title: 'H then CNOT', html: `
<p class="lead">Two gates turn |00⟩ into a Bell state: a Hadamard on qubit 1, then a CNOT with qubit 1 as control and qubit 2 as target.</p>
<figure data-fig="m5-bell-circuit"></figure>
<div class="worked"><div class="given">Explain, with a quantum circuit, how a Bell state is generated using a Hadamard gate and a CNOT gate, giving the state after each step.</div>
<div class="solve"><p><b>Step 0.</b> |ψ₀⟩ = |00⟩ = (1, 0, 0, 0)ᵀ.</p>
<p><b>Step 1 (H on qubit 1).</b> |ψ₁⟩ = (H ⊗ I)|00⟩ = (H|0⟩)|0⟩ = (1/√2)(|0⟩ + |1⟩)|0⟩ = (1/√2)(|00⟩ + |10⟩) = (1/√2)(1, 0, 1, 0)ᵀ. Still a product state (ad − bc = 0): qubit 1 is in |+⟩, qubit 2 in |0⟩.</p>
<p><b>Step 2 (CNOT).</b> The |00⟩ term has control 0: unchanged. The |10⟩ term has control 1: the target flips, |10⟩ → |11⟩.</p>
<p>|ψ₂⟩ = U<sub>CNOT</sub>|ψ₁⟩ = (1/√2)(|00⟩ + |11⟩) = (1/√2)(1, 0, 0, 1)ᵀ.</p>
<p><b>Check.</b> Norm ½ + ½ = 1; ad − bc = ½ ≠ 0, so the output is entangled.</p></div>
<div class="result">|00⟩ → (|00⟩ + |10⟩)/√2 → (|00⟩ + |11⟩)/√2 = |Φ⁺⟩</div></div>
<p>The Hadamard supplies the superposition; the CNOT copies the control’s basis value onto the target term by term, correlating the two qubits. Neither gate alone can entangle: H acts on one qubit, and CNOT on the product input |00⟩ just gives |00⟩.</p>` },
        { title: 'All four Bell states', html: `
<p class="lead">The same circuit acting on the other three basis inputs produces the other three Bell states: the circuit maps the computational basis onto the Bell basis.</p>
<table class="tbl"><thead><tr><th>Input</th><th>After H on qubit 1</th><th>After CNOT</th></tr></thead><tbody>
<tr><td>|00⟩</td><td>(|00⟩ + |10⟩)/√2</td><td>(|00⟩ + |11⟩)/√2 = |Φ⁺⟩</td></tr>
<tr><td>|01⟩</td><td>(|01⟩ + |11⟩)/√2</td><td>(|01⟩ + |10⟩)/√2 = |Ψ⁺⟩</td></tr>
<tr><td>|10⟩</td><td>(|00⟩ − |10⟩)/√2</td><td>(|00⟩ − |11⟩)/√2 = |Φ⁻⟩</td></tr>
<tr><td>|11⟩</td><td>(|01⟩ − |11⟩)/√2</td><td>(|01⟩ − |10⟩)/√2 = |Ψ⁻⟩</td></tr>
</tbody></table>
<p>Running the circuit backwards (CNOT then H) turns each Bell state back into a basis state, which is how Bell states are measured in teleportation and superdense coding.</p>` },
        { title: 'Open questions', html: `
<ul>
<li><b>Stable qubits:</b> how to preserve superposition and entanglement for long times. Work continues on quantum error correction and on platforms with long coherence times (superconducting circuits, trapped ions).</li>
<li><b>Distributing entanglement:</b> how to generate Bell pairs reliably and share them over long distances for quantum communication, using quantum networks, repeaters and satellites (such as Micius) with entangled photon pairs.</li>
<li><b>Efficient circuits:</b> finding minimal universal gate sets and compiling algorithms into short circuits of H, Pauli and CNOT gates suitable for today’s noisy intermediate-scale quantum (NISQ) devices.</li>
</ul>` }
      ],
      flashcards: [
        { front: 'Circuit that makes |Φ⁺⟩ from |00⟩', back: 'H on qubit 1, then CNOT (control 1, target 2).' },
        { front: 'State after the H step', back: '(|00⟩ + |10⟩)/√2' },
        { front: 'State after the CNOT step', back: '(|00⟩ + |11⟩)/√2' },
        { front: 'Input |11⟩ through H + CNOT gives', back: '(|01⟩ − |10⟩)/√2 = |Ψ⁻⟩' },
        { front: 'What is NISQ?', back: 'Noisy intermediate-scale quantum: today’s devices of tens to hundreds of imperfect qubits.' }
      ],
      oneLiners: [
        'H makes the superposition, CNOT makes the correlation.',
        'H + CNOT maps the computational basis to the Bell basis.',
        'After H alone the state is still a product.'
      ],
      formulas: [
        { name: 'Bell circuit', html: `|Φ⁺⟩ = U<sub>CNOT</sub>(H ⊗ I)|00⟩`, note: '' }
      ]
    }
  ],
  figures: [
    { id: 'm5-bloch', src: 'pages/vtop__FALL2026-27_Lecture-notes-BAPHY105-Module-5/p04.png', crop: null, caption: 'Bloch sphere: |0⟩ and |1⟩ at the poles, |±⟩ and |±i⟩ on the equator, and a state |ψ⟩ at polar angle θ from z and azimuth φ from x.', alt: 'A sphere with z up, x toward the viewer and y to the right. |0⟩ at the top, |1⟩ at the bottom, |+⟩ and |−⟩ on the equator along x, |+i⟩ and |−i⟩ along y. A red arrow |ψ⟩ from the centre, with angle θ marked from the z axis and angle φ marked in the equatorial plane from x to the arrow’s dashed projection.' },
    { id: 'm5-bell-circuit', src: 'pages/vtop__FALL2026-27_Lecture-notes-BAPHY105-Module-5/p11.png', crop: null, caption: 'Bell-state circuit: Hadamard on qubit 1, then CNOT with qubit 1 as control; the state is shown at ψ₀, ψ₁ and ψ₂.', alt: 'Two horizontal wires starting in |0⟩. The top wire has an H box, then a filled control dot joined by a vertical line to a circled plus on the bottom wire. Dashed markers ψ0, ψ1, ψ2 sit before H, between the gates and after CNOT. Below: ψ0 = |00⟩, ψ1 = (|00⟩ + |10⟩)/√2, ψ2 = (|00⟩ + |11⟩)/√2.' },
    { id: 'm5-gate-actions', src: 'pages/vtop__FALL2026-27_Lecture-notes-BAPHY105-Module-5/p07.png', crop: null, caption: 'Gate actions in the x–z plane of the Bloch sphere: X swaps |0⟩ and |1⟩, Z swaps |+⟩ and |−⟩, H mirrors in the line midway between z and x.', alt: 'A circle with z up and x right; |0⟩ top, |1⟩ bottom, |+⟩ right, |−⟩ left. A vertical double arrow labelled X joins |0⟩ and |1⟩, a horizontal double arrow labelled Z joins |−⟩ and |+⟩, and a dashed diagonal line labelled H mirror with a curved arrow carrying |0⟩ to |+⟩.' }
  ]
});
