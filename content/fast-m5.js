FAST({
  module: 'm5',
  minutes: 25,
  hy: ['m5-bell-gen', 'm5-entanglement', 'm5-bell', 'm5-pauli-h', 'm5-bloch'],
  facts: [
    /* 1 */ { t: 'm5-qubits', star: false, html: '<b>Bit vs qubit</b>: a bit is 0 <b>or</b> 1; a qubit is <b>|ψ⟩ = α|0⟩ + β|1⟩</b>, α, β complex, <b>|α|<sup>2</sup> + |β|<sup>2</sup> = 1</b>. Measuring gives 0 with P = |α|<sup>2</sup>, 1 with |β|<sup>2</sup>, and collapses the state. n qubits need <b>2<sup>n</sup></b> amplitudes.' },
    /* 2 */ { t: 'm5-qubits', star: false, html: '<b>Five differences</b>: (1) two states vs continuum of superpositions; (2) read freely vs measurement disturbs; (3) copyable vs no-cloning; (4) independent vs <b>entanglement</b>; (5) irreversible gates (AND) vs <b>reversible unitary</b> gates. Enemy: <b>decoherence</b>.' },
    /* 3 */ { t: 'm5-single-qubit', star: false, html: '<b>General qubit</b>: |ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩ (global phase dropped, 2 real parameters). |±⟩ = (|0⟩ ± |1⟩)/√2: same probabilities, opposite <b>relative phase</b>.' },
    /* 4 */ { t: 'm5-bloch', star: true, html: '<b>Bloch sphere</b>: unit sphere, state ↔ point at polar angle <b>θ</b>, azimuth <b>φ</b>; Bloch vector (sin θ cos φ, sin θ sin φ, cos θ). <b>North pole |0⟩, south pole |1⟩</b> (definite outcomes); <b>equator</b>: equal 50:50 superpositions (|+⟩ on +x, |+i⟩ on +y) differing only in phase. Orthogonal states are <b>antipodal</b>.' },
    /* 5 */ { t: 'm5-two-qubit', star: false, html: '<b>Two qubits</b>: |Ψ⟩ = a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩, Σ|·|<sup>2</sup> = 1, built with the tensor product (|10⟩ = (0, 0, 1, 0)). <b>Product state ⇔ ad = bc</b>.' },
    /* 6 */ { t: 'm5-entanglement', star: true, html: '<b>Entangled</b>: cannot be written as |ψ<sub>1</sub>⟩ ⊗ |ψ<sub>2</sub>⟩; test <b>ad − bc ≠ 0</b>. <b>Maximally entangled</b>: |ad − bc| = ½, each qubit alone is a 50:50 coin (the four Bell states). Measuring one fixes the other instantly.' },
    /* 7 */ { t: 'm5-entanglement', star: true, html: '<b>Physical realisations</b>: photon pairs from <b>spontaneous parametric down-conversion</b>; electron–positron from a spin-0 decay (singlet); trapped ions / superconducting qubits with laser or microwave pulses; circuit H + CNOT. Uses: teleportation, superdense coding, QKD.' },
    /* 8 */ { t: 'm5-bell', star: true, html: '<b>Bell states</b>: <b>|Φ<sup>±</sup>⟩ = (|00⟩ ± |11⟩)/√2</b> (same results), <b>|Ψ<sup>±</sup>⟩ = (|01⟩ ± |10⟩)/√2</b> (opposite results). Orthonormal basis of two-qubit space. β<sub>00</sub> = Φ<sup>+</sup>: measure → 00 or 11, each ½.' },
    /* 9 */ { t: 'm5-gates', star: false, html: '<b>Gates</b> are <b>unitary</b> matrices (U†U = I): reversible, norm-preserving, rotations of the Bloch sphere. Single-qubit: X, Y, Z, H, T = diag(1, e<sup>iπ/4</sup>); two-qubit: CNOT.' },
    /* 10 */ { t: 'm5-pauli-h', star: true, html: '<b>X</b> = [0 1; 1 0]: <b>bit flip</b>, α|0⟩ + β|1⟩ → β|0⟩ + α|1⟩ (π rotation about x, N ↔ S pole). <b>Z</b> = diag(1, −1): <b>phase flip</b>, → α|0⟩ − β|1⟩, Z|+⟩ = |−⟩. <b>Y</b> = [0 −i; i 0]: both, → −iβ|0⟩ + iα|1⟩.' },
    /* 11 */ { t: 'm5-pauli-h', star: true, html: '<b>Hadamard H = (1/√2)[1 1; 1 −1]</b>: <b>H|0⟩ = |+⟩</b>, <b>H|1⟩ = |−⟩</b>, H<sup>2</sup> = I, HZH = X. Turns poles into equator points (creates superposition).' },
    /* 12 */ { t: 'm5-cnot', star: false, html: '<b>CNOT</b>: |c, t⟩ → |c, t ⊕ c⟩: flips the target only when the control is 1. 00 → 00, 01 → 01, <b>10 → 11, 11 → 10</b>. Matrix [I 0; 0 X]; CNOT<sup>2</sup> = I.' },
    /* 13 */ { t: 'm5-bell-gen', star: true, html: '<b>Bell circuit</b>: <b>H on qubit 1, then CNOT</b> (control 1). |00⟩ → (|0⟩ + |1⟩)|0⟩/√2 → <b>|Φ<sup>+</sup>⟩</b>; |01⟩ → (|01⟩ + |11⟩)/√2 → <b>(|01⟩ + |10⟩)/√2 = |Ψ<sup>+</sup>⟩</b>; |10⟩ → |Φ<sup>−</sup>⟩; |11⟩ → |Ψ<sup>−</sup>⟩. H makes the superposition, CNOT the correlation; neither alone entangles.' },
    /* 14 */ { t: 'm5-bell-gen', star: true, html: '<b>Input a|01⟩ + b|11⟩</b> = (a|0⟩ + b|1⟩)|1⟩: H → [(a + b)|0⟩ + (a − b)|1⟩]|1⟩/√2; CNOT → <b>[(a + b)|01⟩ + (a − b)|10⟩]/√2</b> = a|Ψ<sup>+</sup>⟩ + b|Ψ<sup>−</sup>⟩ (linearity).' }
  ],
  mcqs: ['m5-5a-01', 'm5-5a-11', 'm5-5a-12', 'm5-5a-17', 'm5-5a-20', 'm5-5a-25', 'm5-5a-31', 'm5-5a-32', 'm5-5a-35', 'm5-5a-37'],
  practice: [
    { q: 'Five differences between a bit and a qubit', from: ['fat-d1-f25'], f: [1, 2] },
    { q: 'Bloch sphere with diagram: meaning of the poles and equator; Pauli X on any state', from: ['fat-c1'], f: [4, 3, 10] },
    { q: 'Pauli-Z on |+⟩', from: ['fat-d1-f25'], f: [10] },
    { q: 'Condition for entanglement; maximal entanglement and possibilities; two physical realisations', from: ['fat-c1'], f: [5, 6, 7, 8] },
    { q: 'Superposition vs entanglement; measuring β00; Y gate; H|0⟩ and H|1⟩', from: ['fat-d1-f25'], f: [6, 8, 10, 11] },
    { q: 'Create a Bell state from |01⟩ with gates (calculation + circuit); start from a|01⟩ + b|11⟩', from: ['fat-c1'], f: [12, 13, 14] }
  ]
});
