CHUNK({
  chunk: '2a',
  module: 'm2',
  topics: [
    {
      id: 'm2-vector-space',
      title: 'Linear vector spaces',
      short: 'Linear vector space',
      blurb: 'What a vector space is, the eight rules it must obey, and how to test whether a set (polynomials, matrices, functions) is one.',
      source: 'Module 2 notes §2.1, Table 2.1',
      tabs: [
        { title: 'Definition and rules', html: `
<p class="lead">Quantum mechanics describes a state by a <b>vector</b> |α⟩ (a “ket”). The vectors live in a <b>linear vector space</b>: a collection of vectors |α⟩, |β⟩, |γ⟩ … together with a set of <b>scalars</b> a, b, c … (real or complex numbers).</p>
<p>The space must be <b>closed</b> under two operations:</p>
<ul>
<li><b>Vector addition:</b> |α⟩ + |β⟩ = |γ⟩, and |γ⟩ is again in the space.</li>
<li><b>Scalar multiplication:</b> a|α⟩ = |γ⟩, again in the space.</li>
</ul>
<h3>Rules for addition</h3>
<ol>
<li><b>Commutative:</b> |α⟩ + |β⟩ = |β⟩ + |α⟩</li>
<li><b>Associative:</b> |α⟩ + (|β⟩ + |γ⟩) = (|α⟩ + |β⟩) + |γ⟩</li>
<li><b>Zero vector:</b> there is a |0⟩ with |α⟩ + |0⟩ = |α⟩</li>
<li><b>Inverse:</b> every |α⟩ has a −|α⟩ with |α⟩ + (−|α⟩) = |0⟩</li>
</ol>
<h3>Rules for scalar multiplication</h3>
<ol>
<li><b>Distributive over vectors:</b> a(|α⟩ + |β⟩) = a|α⟩ + a|β⟩</li>
<li><b>Distributive over scalars:</b> (a + b)|α⟩ = a|α⟩ + b|α⟩</li>
<li><b>Associative:</b> a(b|α⟩) = (ab)|α⟩</li>
<li><b>Unit and zero:</b> 1|α⟩ = |α⟩ and 0|α⟩ = |0⟩</li>
</ol>
<p>A <b>linear combination</b> is a|α⟩ + b|β⟩ + c|γ⟩ + … : multiply vectors by scalars and add them.</p>
<div class="note exam"><p>“What is a linear vector space?” (5 marks): define it as a set of vectors with scalars, closed under addition and scalar multiplication, then list the eight rules above with one line each. Past papers give 1 mark per rule.</p></div>` },
        { title: 'Examples and a test', html: `
<p class="lead">Very different objects can form vector spaces. The rules matter, not what the “vectors” look like.</p>
<table class="tbl">
<tr><th>Space</th><th>3D arrows</th><th>Polynomials, degree ≤ 5</th><th>Complex 2 × 2 matrices</th></tr>
<tr><td>Vectors</td><td>(x, y, z)</td><td>a₀ + a₁x + … + a₅x⁵</td><td>[a b; c d]</td></tr>
<tr><td>Scalars</td><td>real</td><td>real</td><td>complex</td></tr>
<tr><td>Zero vector</td><td>(0, 0, 0)</td><td>the zero polynomial</td><td>the zero matrix</td></tr>
<tr><td>Basis</td><td>î, ĵ, k̂</td><td>1, x, x², …, x⁵</td><td>four matrices with a single 1</td></tr>
<tr><td>Dimension</td><td>3</td><td>6</td><td>4</td></tr>
</table>
<h3>Testing a set: is it a vector space?</h3>
<p>Check closure and the zero vector first. One failure is enough to say “no”.</p>
<div class="worked"><div class="given">Past paper: does the set of all real polynomials p(x) with p(0) = 1 form a vector space?</div>
<div class="solve"><p>Take p(x) = 1 + x and q(x) = 1 + x², both with value 1 at x = 0.</p>
<p>Their sum p + q = 2 + x + x² has value <b>2</b> at x = 0, so it is <b>not in the set</b>: the set is not closed under addition.</p>
<p>Also the zero polynomial has value 0 at x = 0, so the <b>zero vector is missing</b>; and 3p(x) has value 3.</p></div>
<div class="result">No. It fails closure and has no zero vector. (Polynomials with p(0) = 0 would form a vector space.)</div></div>` }
      ],
      flashcards: [
        { front: 'Two operations a vector space must be closed under', back: 'Vector addition and scalar multiplication: both results stay in the space.' },
        { front: 'Four rules of vector addition', back: 'Commutative, associative, a zero vector exists, every vector has an additive inverse.' },
        { front: 'Four rules of scalar multiplication', back: 'Distributive over vector addition, distributive over scalar addition, associative, 1|α⟩ = |α⟩ and 0|α⟩ = |0⟩.' },
        { front: 'Is {p(x) : p(0) = 1} a vector space?', back: 'No: the sum of two such polynomials has value 2 at x = 0, and the zero polynomial is not in the set.' }
      ],
      oneLiners: [
        'Dimension of polynomials of degree ≤ 5 is 6 (basis 1, x, …, x⁵).',
        'Complex 2 × 2 matrices form a 4-dimensional space over ℂ.',
        'One failed rule is enough to show a set is not a vector space.'
      ],
      formulas: [
        { name: 'Closure', html: `|α⟩ + |β⟩ = |γ⟩,  a|α⟩ = |γ⟩  (|γ⟩ in the space)`, note: 'a is a scalar' }
      ]
    },
    {
      id: 'm2-basis',
      title: 'Linear independence, basis vectors and dimension',
      short: 'Basis vectors',
      blurb: 'When vectors are independent, what a basis and the dimension are, how components work, and the determinant test with worked paper questions.',
      source: 'Module 2 notes §2.1, practice problems 1–3',
      tabs: [
        { title: 'Independence, span, basis', html: `
<ul>
<li>A set of vectors is <b>linearly independent</b> if no vector in it can be written as a linear combination of the others. Equivalently, c₁|v₁⟩ + c₂|v₂⟩ + … = 0 only when every cᵢ = 0.</li>
<li>A set <b>spans</b> the space if every vector in the space is a linear combination of them.</li>
<li>A <b>basis</b> is a set that is <b>linearly independent</b> and <b>spans</b> the whole space.</li>
<li>The <b>dimension</b> is the number of vectors in any basis (every basis of a space has the same count).</li>
</ul>
<p>Any vector is written <b>uniquely</b> in a basis {|eᵢ⟩}:</p>
<div class="eq">|v⟩ = Σ<sub>i</sub> cᵢ|eᵢ⟩</div>
<p>The numbers cᵢ are the <b>components</b>, so the vector can be listed as |α⟩ ↔ (a₁, a₂, …, aₙ). Then</p>
<ul>
<li>|α⟩ + |β⟩ ↔ (a₁ + b₁, a₂ + b₂, …) and c|α⟩ ↔ (ca₁, ca₂, …)</li>
<li>|0⟩ ↔ (0, 0, …, 0) and −|α⟩ ↔ (−a₁, −a₂, …, −aₙ)</li>
</ul>
<div class="note"><p>The <b>same vector</b> has <b>different components</b> in different bases. Components are easy to work with, but they depend on the basis chosen.</p></div>
<h3>Tests for independence</h3>
<ul>
<li><b>Two vectors:</b> dependent if and only if one is a scalar multiple of the other.</li>
<li><b>n vectors in n dimensions:</b> put them as the columns of a matrix. det ≠ 0 → independent; det = 0 → dependent.</li>
<li><b>Direct method:</b> try |v₃⟩ = a|v₁⟩ + b|v₂⟩; solve two component equations and check the third.</li>
</ul>` },
        { title: 'Worked problems', html: `
<div class="worked"><div class="given">Past paper: are A = (3, 0, 0), B = (0, −2, 0), C = (0, 0, −1) linearly dependent or independent?</div>
<div class="solve"><p>det [3 0 0; 0 −2 0; 0 0 −1] = 3 × (−2) × (−1) = 6.</p>
<p>The determinant is not zero, so the only solution of aA + bB + cC = 0 is a = b = c = 0.</p></div>
<div class="result">Linearly independent (det = 6 ≠ 0). They point along x, y and z, so they also form a basis of 3D space.</div></div>
<div class="worked"><div class="given">Are |v₁⟩ = (2, 3) and |v₂⟩ = (4, 6) independent?</div>
<div class="solve"><p>Try |v₂⟩ = c|v₁⟩: first component 4 = 2c → c = 2; second 6 = 3c → c = 2. The same c works.</p></div>
<div class="result">Dependent: |v₂⟩ = 2|v₁⟩.</div></div>
<div class="worked"><div class="given">Are (1, 0, 2), (0, 1, 3), (2, 1, 7) independent?</div>
<div class="solve"><p>Try |v₃⟩ = a|v₁⟩ + b|v₂⟩: first component 2 = a; second 1 = b; third 7 = 2a + 3b = 4 + 3 = 7  (correct).</p>
<p>Check: det of the column matrix = 0.</p></div>
<div class="result">Dependent: |v₃⟩ = 2|v₁⟩ + |v₂⟩.</div></div>
<div class="worked"><div class="given">Past paper: |ψ⟩ = (1 + i)|e₁⟩ − 3|e₂⟩ and |ω⟩ = 2|e₁⟩ − 3(1 − i)|e₂⟩ in an orthonormal basis. Are they independent? Find ⟨ψ|ω⟩ and then ⟨ω|ψ⟩ without calculating again.</div>
<div class="solve"><p>Ratio of first components: 2/(1 + i) = 2(1 − i)/2 = 1 − i.</p>
<p>Ratio of second components: −3(1 − i)/(−3) = 1 − i. Same ratio, so |ω⟩ = (1 − i)|ψ⟩.</p>
<p>⟨ψ|ω⟩ = (1 + i)* × 2 + (−3)* × (−3)(1 − i) = 2(1 − i) + 9(1 − i) = 11 − 11i.</p>
<p>⟨ω|ψ⟩ = ⟨ψ|ω⟩* = 11 + 11i (the inner product swaps to its complex conjugate).</p></div>
<div class="result">Dependent (|ω⟩ = (1 − i)|ψ⟩); ⟨ψ|ω⟩ = 11 − 11i, ⟨ω|ψ⟩ = 11 + 11i.</div></div>` }
      ],
      flashcards: [
        { front: 'Basis', back: 'A set of vectors that is linearly independent and spans the whole space.' },
        { front: 'Dimension', back: 'The number of vectors in any basis of the space.' },
        { front: 'Determinant test for independence', back: 'Put n vectors as columns of an n × n matrix: det ≠ 0 → independent, det = 0 → dependent.' },
        { front: 'Two vectors are dependent when…', back: 'one is a scalar multiple of the other (the component ratios are all equal).' }
      ],
      oneLiners: [
        'n vectors in n dimensions are independent if the determinant of their column matrix is not zero.',
        'Components of a vector change when the basis changes; the vector does not.',
        'In a basis every vector has exactly one set of components.'
      ],
      formulas: [
        { name: 'Expansion in a basis', html: `|v⟩ = Σ<sub>i</sub> cᵢ|eᵢ⟩`, note: 'cᵢ = components' }
      ]
    },
    {
      id: 'm2-orthonormal',
      title: 'Inner product, norm and orthonormal sets',
      short: 'Orthonormal sets',
      blurb: 'The three rules of the inner product, the norm, orthogonality, orthonormal bases, the Kronecker delta and the Schwarz inequality.',
      source: 'Module 2 notes §2.2, §2.4',
      tabs: [
        { title: 'Inner product and norm', html: `
<p class="lead">The dot product of 3D vectors generalises to the <b>inner product</b> ⟨α|β⟩: a <b>complex number</b> defined in any dimension, for complex vectors too.</p>
<h3>The three rules</h3>
<ol>
<li><b>Conjugate symmetry:</b> ⟨β|α⟩ = ⟨α|β⟩*</li>
<li><b>Positive:</b> ⟨α|α⟩ ≥ 0, and ⟨α|α⟩ = 0 only if |α⟩ = |0⟩</li>
<li><b>Linear in the ket:</b> ⟨α|bβ + cγ⟩ = b⟨α|β⟩ + c⟨α|γ⟩</li>
</ol>
<p>A vector space with an inner product is an <b>inner product space</b>.</p>
<ul>
<li><b>Norm (length):</b> ‖α‖ = √⟨α|α⟩.</li>
<li><b>Normalised (unit) vector:</b> norm 1. To normalise, divide by the norm: |α̃⟩ = |α⟩/‖α‖.</li>
<li><b>Orthogonal:</b> ⟨α|β⟩ = 0.</li>
<li><b>Orthonormal set:</b> ⟨αᵢ|αⱼ⟩ = δᵢⱼ, where the <b>Kronecker delta</b> δᵢⱼ = 1 if i = j and 0 otherwise. Each vector has length 1 and each pair is orthogonal.</li>
</ul>
<h3>In an orthonormal basis</h3>
<div class="eq">⟨α|β⟩ = a₁*b₁ + a₂*b₂ + … + aₙ*bₙ,   ⟨α|α⟩ = |a₁|² + |a₂|² + … + |aₙ|²,   aᵢ = ⟨eᵢ|α⟩</div>
<p>These reduce to a·b = aₓbₓ + a<sub>y</sub>b<sub>y</sub> + a<sub>z</sub>b<sub>z</sub> for real 3D vectors. The complex conjugate on the first vector is what keeps ⟨α|α⟩ real and positive.</p>
<p><b>Schwarz (Cauchy–Schwarz) inequality:</b> |⟨α|β⟩|² ≤ ⟨α|α⟩⟨β|β⟩.</p>` },
        { title: 'Geometric meaning', html: `
<p class="lead">The inner product measures the <b>overlap</b> of two vectors: how much of one lies along the other.</p>
<figure data-fig="m2-projection"></figure>
<p>With an orthonormal basis |i⟩, |j⟩, |k⟩ and |ψ⟩ = a|i⟩ + b|j⟩ + c|k⟩, the components are inner products: ⟨i|ψ⟩ = a, ⟨j|ψ⟩ = b, ⟨k|ψ⟩ = c. Each is the <b>projection</b> (“shadow”) of |ψ⟩ on that axis, and the vector is rebuilt from them:</p>
<div class="eq">|ψ⟩ = Σ<sub>i</sub> cᵢ|eᵢ⟩ = Σ<sub>i</sub> ⟨eᵢ|ψ⟩|eᵢ⟩</div>
<p><b>Proof that cⱼ = ⟨eⱼ|ψ⟩:</b> ⟨eⱼ|ψ⟩ = ⟨eⱼ| Σᵢ cᵢ|eᵢ⟩ = Σᵢ cᵢ⟨eⱼ|eᵢ⟩ = Σᵢ cᵢδᵢⱼ = cⱼ (only the i = j term survives).</p>
<div class="note exam"><p>“Explain orthonormal basis and dimensionality with an example”: define orthonormal (⟨eᵢ|eⱼ⟩ = δᵢⱼ), give î, ĵ, k̂ (dimension 3) or |0⟩ = (1, 0), |1⟩ = (0, 1) (dimension 2), show cᵢ = ⟨eᵢ|ψ⟩, and state dimension = number of basis vectors.</p></div>` },
        { title: 'Worked problems', html: `
<div class="worked"><div class="given">|α⟩ = (2, i). Find ⟨α|α⟩, ‖α‖ and the normalised vector.</div>
<div class="solve"><p>⟨α|α⟩ = 2* × 2 + i* × i = 4 + (−i)(i) = 4 + 1 = 5, so ‖α‖ = √5.</p>
<p>|α̃⟩ = (1/√5)(2, i). Check: 4/5 + 1/5 = 1.</p></div>
<div class="result">⟨α|α⟩ = 5, ‖α‖ = √5, |α̃⟩ = (2/√5, i/√5)</div></div>
<div class="worked"><div class="given">Are |ϕ⟩ = (1, −1) and |χ⟩ = (1, 1) orthogonal?</div>
<div class="solve"><p>⟨ϕ|χ⟩ = 1 × 1 + (−1) × 1 = 0.</p></div>
<div class="result">Yes, orthogonal.</div></div>
<div class="worked"><div class="given">Past paper: |ψ⟩ = 3i|φ₁⟩ − 7i|φ₂⟩ and |χ⟩ = −|φ₁⟩ + 2i|φ₂⟩ with |φ₁⟩, |φ₂⟩ orthonormal. Find ⟨ψ|χ⟩ and ⟨χ|ψ⟩.</div>
<div class="solve"><p>The bra takes complex conjugates: ⟨ψ| = −3i⟨φ₁| + 7i⟨φ₂|.</p>
<p>⟨ψ|χ⟩ = (−3i)(−1) + (7i)(2i) = 3i + 14i² = 3i − 14.</p>
<p>⟨χ|ψ⟩ = ⟨ψ|χ⟩* = −14 − 3i. (Direct: (−1)(3i) + (−2i)(−7i) = −3i + 14i² = −14 − 3i  (correct))</p></div>
<div class="result">⟨ψ|χ⟩ = −14 + 3i,  ⟨χ|ψ⟩ = −14 − 3i</div></div>` }
      ],
      flashcards: [
        { front: 'Three rules of the inner product', back: '⟨β|α⟩ = ⟨α|β⟩*; ⟨α|α⟩ ≥ 0 with equality only for the zero vector; linear in the ket.' },
        { front: 'Norm of a vector', back: '‖α‖ = √⟨α|α⟩' },
        { front: 'Orthonormal set', back: '⟨αᵢ|αⱼ⟩ = δᵢⱼ: unit length and mutually orthogonal.' },
        { front: 'Kronecker delta', back: 'δᵢⱼ = 1 if i = j, 0 if i ≠ j.' },
        { front: 'Schwarz inequality', back: '|⟨α|β⟩|² ≤ ⟨α|α⟩⟨β|β⟩' }
      ],
      oneLiners: [
        'Swapping bra and ket complex-conjugates the inner product.',
        'In an orthonormal basis the component is cᵢ = ⟨eᵢ|ψ⟩.',
        'Normalise by dividing a vector by its norm.'
      ],
      formulas: [
        { name: 'Inner product (orthonormal basis)', html: `⟨α|β⟩ = Σ aᵢ* bᵢ`, note: 'conjugate the first vector' },
        { name: 'Norm', html: `‖α‖ = √⟨α|α⟩ = √(Σ|aᵢ|²)`, note: '' },
        { name: 'Schwarz inequality', html: `|⟨α|β⟩|² ≤ ⟨α|α⟩⟨β|β⟩`, note: '' }
      ]
    },
    {
      id: 'm2-hilbert',
      title: 'Hilbert space',
      short: 'Hilbert space',
      blurb: 'A complete inner product space: why quantum states live in one, square-integrable functions (L²), and how to test a wavefunction.',
      source: 'Module 2 notes §2.3, appendix A1, practice problem 7',
      tabs: [
        { title: 'What and why', html: `
<p class="lead">A <b>Hilbert space</b> is a <b>complex vector space</b> with an <b>inner product</b> that is also <b>complete</b> with respect to the norm the inner product defines.</p>
<ul>
<li><b>Complex vector space:</b> we can add states and multiply them by complex numbers.</li>
<li><b>Inner product</b> ⟨ϕ|ψ⟩: gives length, angle and orthogonality.</li>
<li><b>Complete:</b> every Cauchy sequence of vectors (a sequence whose members get closer and closer to each other) converges to a vector that is <b>inside</b> the space. No limits “fall out” of it.</li>
</ul>
<h3>Why quantum mechanics needs it</h3>
<p>A particle’s state is a wavefunction ψ(x), a complex function of position. We want to treat such functions as vectors: add them, take inner products, expand them in bases, and act on them with operators. Since |ψ(x)|² is a probability density, the total probability must be finite:</p>
<div class="eq">∫<sub>−∞</sub><sup>∞</sup> |ψ(x)|² dx &lt; ∞</div>
<p>Such functions are <b>square-integrable</b>. They form the space <b>L²(ℝ)</b>, which with the inner product</p>
<div class="eq">⟨ϕ|ψ⟩ = ∫<sub>−∞</sub><sup>∞</sup> ϕ*(x) ψ(x) dx</div>
<p>is a Hilbert space. From now on, “the space of quantum states” means a Hilbert space.</p>
<div class="note"><p>ψ(x) = ⟨x|ψ⟩ is the state |ψ⟩ written in the <b>position basis</b>: it plays the role of the components ⟨eᵢ|ψ⟩, with the sum replaced by an integral, |ψ⟩ = ∫⟨x|ψ⟩|x⟩dx, and ⟨x|x′⟩ = δ(x − x′) (the Dirac delta replaces the Kronecker delta).</p></div>` },
        { title: 'Square-integrable?', html: `
<div class="worked"><div class="given">Which are square-integrable on ℝ: (a) 1/(1 + x²), (b) sin x, (c) e<sup>−x²</sup>?</div>
<div class="solve"><p>(a) |ψ|² = 1/(1 + x²)², finite at x = 0 and falls like 1/x⁴ at large |x|, so the integral converges. <b>Yes.</b></p>
<p>(b) |ψ|² = sin²x oscillates between 0 and 1 and never decays, so the integral over ℝ diverges. <b>No.</b></p>
<p>(c) |ψ|² = e<sup>−2x²</sup>, a Gaussian: ∫e<sup>−2x²</sup>dx = √(π/2) ≈ 1.253, finite. <b>Yes.</b></p></div>
<div class="result">(a) and (c) are square-integrable; (b) is not.</div></div>
<div class="note exam"><p>A Hilbert-space answer needs all three words: <b>complex</b> vector space, <b>inner product</b>, <b>complete</b>; then the L² condition and ⟨ϕ|ψ⟩ = ∫ϕ*ψ dx.</p></div>` }
      ],
      flashcards: [
        { front: 'Hilbert space', back: 'A complex vector space with an inner product that is complete in the norm from that inner product.' },
        { front: 'Square-integrable', back: '∫|ψ(x)|² dx is finite; these functions form L²(ℝ).' },
        { front: 'Inner product of two wavefunctions', back: '⟨ϕ|ψ⟩ = ∫ ϕ*(x) ψ(x) dx' },
        { front: 'What is ψ(x) in Dirac notation?', back: 'ψ(x) = ⟨x|ψ⟩, the component of |ψ⟩ along the position basis vector |x⟩.' }
      ],
      oneLiners: [
        'L²(ℝ) with ⟨ϕ|ψ⟩ = ∫ϕ*ψ dx is the Hilbert space of wavefunctions.',
        'Complete = every Cauchy sequence converges inside the space.',
        'sin x is not square-integrable; e^(−x²) is.'
      ],
      formulas: [
        { name: 'Square-integrability', html: `∫<sub>−∞</sub><sup>∞</sup> |ψ(x)|² dx &lt; ∞`, note: '' },
        { name: 'Function inner product', html: `⟨ϕ|ψ⟩ = ∫ ϕ*(x) ψ(x) dx`, note: '' }
      ]
    },
    {
      id: 'm2-dirac',
      title: 'Dirac notation: kets, bras and probability amplitudes',
      short: 'Dirac notation',
      blurb: 'Kets as columns, bras as conjugate-transpose rows, inner products as row × column, amplitudes, probabilities and normalisation with worked paper questions.',
      source: 'Module 2 notes §2.4.1, §2.5',
      tabs: [
        { title: 'Kets and bras', html: `
<p class="lead">Dirac split the inner product ⟨ϕ|ψ⟩ into two halves: a <b>bra</b> ⟨ϕ| and a <b>ket</b> |ψ⟩.</p>
<ul>
<li>A <b>ket</b> |ψ⟩ is a state vector in Hilbert space. In a basis it is a <b>column</b> of its components cᵢ = ⟨eᵢ|ψ⟩.</li>
<li>A <b>bra</b> ⟨ψ| is the <b>Hermitian adjoint</b> of the ket: ⟨ψ| = (|ψ⟩)† = (|ψ⟩*)<sup>T</sup>, the <b>conjugate transpose</b>, a <b>row</b> (c₁* c₂* …). Bras live in the <b>dual space</b>.</li>
<li>A bra acting on a ket gives a <b>complex number</b>: ⟨ϕ|ψ⟩ ∈ ℂ, the <b>overlap</b> of the two states.</li>
</ul>
<div class="eq">|ψ⟩ = (c₁, c₂, c₃)<sup>T</sup>, |ϕ⟩ = (b₁, b₂, b₃)<sup>T</sup> ⇒ ⟨ϕ|ψ⟩ = b₁*c₁ + b₂*c₂ + b₃*c₃</div>
<p>For functions: ⟨ϕ|ψ⟩ = ∫ϕ*(x)ψ(x)dx.</p>
<table class="tbl"><tr><th>Symbol</th><th>Name</th><th>What it is</th></tr>
<tr><td>|ψ⟩</td><td>ket</td><td>state vector (column)</td></tr>
<tr><td>⟨ϕ|</td><td>bra</td><td>adjoint of a ket (row)</td></tr>
<tr><td>⟨ϕ|ψ⟩</td><td>bracket</td><td>complex number (overlap)</td></tr>
<tr><td>|ψ⟩⟨ϕ|</td><td>outer product</td><td>operator (matrix)</td></tr></table>` },
        { title: 'Amplitudes and probability', html: `
<p class="lead">In quantum mechanics the component ⟨eᵢ|ψ⟩ is the <b>probability amplitude</b> for finding outcome |eᵢ⟩ when the system is measured in that basis. Its modulus squared is the <b>probability</b>.</p>
<p><b>Spin-½ example.</b> |e₁⟩ = (1, 0) and |e₂⟩ = (0, 1) can be spin-up and spin-down along z. A general state is |ψ⟩ = c₁|e₁⟩ + c₂|e₂⟩ = (c₁, c₂) with complex amplitudes c₁ = ⟨e₁|ψ⟩, c₂ = ⟨e₂|ψ⟩.</p>
<div class="eq">P(e₁) = |c₁|²,  P(e₂) = |c₂|²,  |c₁|² + |c₂|² = 1 ⇔ ⟨ψ|ψ⟩ = 1</div>
<h3>Normalising</h3>
<p>If ⟨ψ|ψ⟩ = N ≠ 1, use |ψ′⟩ = |ψ⟩/√N. Then P(e₁) = |c₁|²/N and P(e₂) = |c₂|²/N.</p>
<div class="worked"><div class="given">Normalise |ψ⟩ = (2 + i, 1) and find the probabilities.</div>
<div class="solve"><p>|2 + i|² = 2² + 1² = 5 and |1|² = 1, so N = 6.</p>
<p>|ψ′⟩ = (1/√6)(2 + i, 1).</p></div>
<div class="result">P(e₁) = 5/6, P(e₂) = 1/6</div></div>
<div class="worked"><div class="given">Past paper: |ψ⟩ = (√2/3)|α⟩ + (a/√3)|β⟩ + (2/3)|γ⟩ with |α⟩, |β⟩, |γ⟩ orthonormal. Find a if |ψ⟩ is normalised, and the probability of each state.</div>
<div class="solve"><p>⟨ψ|ψ⟩ = 2/9 + a²/3 + 4/9 = 1 ⇒ a²/3 = 1 − 6/9 = 1/3 ⇒ a² = 1.</p></div>
<div class="result">a = 1 (taking a real and positive); P(α) = 2/9, P(β) = 1/3, P(γ) = 4/9 (sum = 1)</div></div>
<div class="worked"><div class="given">|ψ⟩ = (1/√2)|e₁⟩ + (i/√2)|e₂⟩. Find its norm and P(e₂).</div>
<div class="solve"><p>‖ψ‖² = 1/2 + |i|²/2 = 1, already normalised. P(e₂) = |i/√2|² = 1/2.</p></div>
<div class="result">‖ψ‖ = 1, P(e₂) = 1/2</div></div>` }
      ],
      flashcards: [
        { front: 'Bra from a ket', back: '⟨ψ| = (|ψ⟩)†: conjugate every component and write it as a row.' },
        { front: 'What does ⟨eᵢ|ψ⟩ mean physically?', back: 'The probability amplitude for outcome |eᵢ⟩; |⟨eᵢ|ψ⟩|² is its probability.' },
        { front: 'Normalisation condition', back: '⟨ψ|ψ⟩ = Σ|cᵢ|² = 1 (the probabilities add to 1).' },
        { front: 'How to normalise', back: 'Divide by √N where N = ⟨ψ|ψ⟩.' }
      ],
      oneLiners: [
        'Probability of outcome eᵢ is |⟨eᵢ|ψ⟩|² for a normalised state.',
        'Ket = column, bra = conjugate-transpose row, bracket = number.',
        '|2 + i|² = 5, not 3: square both real and imaginary parts.'
      ],
      formulas: [
        { name: 'Bra', html: `⟨ψ| = (|ψ⟩*)<sup>T</sup> = (c₁* c₂* …)`, note: '' },
        { name: 'Probability', html: `P(eᵢ) = |⟨eᵢ|ψ⟩|² / ⟨ψ|ψ⟩`, note: 'denominator is 1 if normalised' }
      ]
    },
    {
      id: 'm2-outer',
      title: 'Outer products, projection operators and completeness',
      short: 'Inner and outer products',
      blurb: 'Outer product |w⟩⟨v| as a matrix, projectors |i⟩⟨i| with P² = P and P† = P, the completeness relation and matrix elements Aᵢⱼ = ⟨eᵢ|A|eⱼ⟩.',
      source: 'Module 2 notes §2.10–2.12',
      tabs: [
        { title: 'Outer product', html: `
<p class="lead">A ket times a bra, |w⟩⟨v|, is not a number: it is an <b>operator</b> (a matrix). It acts on any |x⟩ by</p>
<div class="eq">(|w⟩⟨v|)|x⟩ = ⟨v|x⟩ |w⟩</div>
<p>It takes the overlap of |x⟩ with |v⟩ and returns that multiple of |w⟩.</p>
<div class="note trap"><p>Do not confuse the <b>outer product</b> |w⟩⟨v| (an operator) with the <b>inner product</b> ⟨w|v⟩ (a number).</p></div>
<p>In ℂ²: |w⟩⟨v| = (w₁, w₂)<sup>T</sup>(v₁* v₂*) = [w₁v₁* w₁v₂*; w₂v₁* w₂v₂*]. If |v⟩ ∈ ℂⁿ and |w⟩ ∈ ℂᵐ, then |w⟩⟨v| is an <b>m × n</b> matrix (for example, |w⟩ = (0, 1, 0) ∈ ℂ³ and |v⟩ = (1, 0) ∈ ℂ² give a 3 × 2 matrix).</p>
<p>Linear combinations work as expected: (Σᵢ aᵢ|wᵢ⟩⟨vᵢ|)|x⟩ = Σᵢ aᵢ⟨vᵢ|x⟩|wᵢ⟩.</p>
<div class="worked"><div class="given">|v⟩ = (1, i), |w⟩ = (2, 0). Find |w⟩⟨v| and its action on |x⟩ = (1, 1).</div>
<div class="solve"><p>⟨v| = (1, −i). |w⟩⟨v| = [2·1 2·(−i); 0 0] = [2 −2i; 0 0].</p>
<p>[2 −2i; 0 0](1, 1) = (2 − 2i, 0). Check: ⟨v|x⟩ = 1 − i, times |w⟩ = (2 − 2i, 0)  (correct)</p></div>
<div class="result">|w⟩⟨v| = [2 −2i; 0 0];  (|w⟩⟨v|)|x⟩ = (2 − 2i, 0)</div></div>` },
        { title: 'Projection operators', html: `
<p class="lead">Pairing a <b>normalised</b> vector with itself gives the <b>projection operator</b> onto its direction:</p>
<div class="eq">P = |i⟩⟨i|,   P|v⟩ = |i⟩⟨i|v⟩</div>
<p>For a vector |u⟩ that is not normalised: P = |u⟩⟨u| / ⟨u|u⟩.</p>
<h3>Properties</h3>
<ul>
<li><b>P² = P</b>: projecting twice is the same as projecting once. Proof: P² = |i⟩⟨i|i⟩⟨i| = |i⟩(1)⟨i| = P.</li>
<li><b>P† = P</b>: projectors are Hermitian. Proof: (|i⟩⟨i|)† = (⟨i|)†(|i⟩)† = |i⟩⟨i|.</li>
<li>Eigenvalues are only 0 and 1.</li>
</ul>
<p><b>Example.</b> |i⟩ = (1, 0): P = [1 0; 0 0] and P(v₁, v₂) = (v₁, 0): the projection onto the x-axis. P(1, −1) = (1, 0).</p>
<p><b>Example.</b> |+⟩ = (|0⟩ + |1⟩)/√2: P = |+⟩⟨+| = ½[1 1; 1 1].</p>
<div class="note exam"><p>“Define projection and unitary operators and their significance”: projection P = |i⟩⟨i| with P² = P, P† = P; it picks out the part of a state along |i⟩, and measurement collapses a state by a projector. Unitary: U†U = I, preserves norms and probabilities, describes time evolution and quantum gates.</p></div>` },
        { title: 'Completeness and matrix elements', html: `
<p class="lead">For an orthonormal basis {|eᵢ⟩}, the sum of all the projectors is the identity:</p>
<div class="eq">Σ<sub>i</sub> |eᵢ⟩⟨eᵢ| = I   (completeness relation)</div>
<p><b>Proof:</b> (Σᵢ|eᵢ⟩⟨eᵢ|)|v⟩ = Σᵢ⟨eᵢ|v⟩|eᵢ⟩ = |v⟩ for every |v⟩.</p>
<p>Example: |e₁⟩⟨e₁| + |e₂⟩⟨e₂| = [1 0; 0 0] + [0 0; 0 1] = I. So |v⟩ = (3, 4) = 3|e₁⟩ + 4|e₂⟩.</p>
<div class="worked"><div class="given">|u₁⟩ = (1, 1), |u₂⟩ = (1, 0). Is M = |u₁⟩⟨u₁| + |u₂⟩⟨u₂| the identity?</div>
<div class="solve"><p>|u₁⟩⟨u₁| = [1 1; 1 1], |u₂⟩⟨u₂| = [1 0; 0 0], so M = [2 1; 1 1].</p></div>
<div class="result">No. |u₁⟩ is not normalised and not orthogonal to |u₂⟩; completeness needs an orthonormal basis.</div></div>
<h3>Matrix elements</h3>
<p>Insert I on both sides of an operator: Â = IÂI = Σᵢⱼ |eᵢ⟩⟨eᵢ|Â|eⱼ⟩⟨eⱼ|. So</p>
<div class="eq">Aᵢⱼ = ⟨eᵢ|Â|eⱼ⟩,   Â = Σᵢⱼ Aᵢⱼ |eᵢ⟩⟨eⱼ|,   c′ᵢ = Σⱼ Aᵢⱼ cⱼ</div>
<p>The bra ⟨eⱼ| takes the j-th input component, Aᵢⱼ weights it, and |eᵢ⟩ puts it in the i-th output slot: this is ordinary matrix multiplication.</p>
<p>Example: A = 5|e₁⟩⟨e₁| − 3|e₂⟩⟨e₂| = [5 0; 0 −3]: Hermitian (real diagonal), eigenvalues 5 and −3 with eigenvectors |e₁⟩ and |e₂⟩.</p>` }
      ],
      flashcards: [
        { front: 'Outer product |w⟩⟨v| acting on |x⟩', back: '⟨v|x⟩|w⟩. It is an operator (matrix), not a number.' },
        { front: 'Size of |w⟩⟨v| for |v⟩ ∈ ℂⁿ, |w⟩ ∈ ℂᵐ', back: 'm × n' },
        { front: 'Two properties of a projection operator', back: 'P² = P and P† = P.' },
        { front: 'Completeness relation', back: 'Σᵢ |eᵢ⟩⟨eᵢ| = I for an orthonormal basis.' },
        { front: 'Matrix element Aᵢⱼ', back: '⟨eᵢ|Â|eⱼ⟩' }
      ],
      oneLiners: [
        'Completeness: the projectors onto an orthonormal basis add up to I.',
        'Projector onto |i⟩: P = |i⟩⟨i|; for unnormalised |u⟩ divide by ⟨u|u⟩.',
        'A projector’s eigenvalues are 0 and 1.'
      ],
      formulas: [
        { name: 'Projector', html: `P = |u⟩⟨u| / ⟨u|u⟩,  P² = P,  P† = P`, note: '' },
        { name: 'Completeness', html: `Σ<sub>i</sub> |eᵢ⟩⟨eᵢ| = I`, note: 'orthonormal basis only' },
        { name: 'Matrix element', html: `Aᵢⱼ = ⟨eᵢ|Â|eⱼ⟩`, note: '' }
      ]
    },
    {
      id: 'm2-tensor',
      title: 'Tensor product of vector spaces',
      short: 'Tensor product',
      blurb: 'Combining two spaces into one (dimension m·n), tensor products of vectors and the Kronecker product of matrices, two-qubit states.',
      source: 'Module 2 notes §2.13',
      tabs: [
        { title: 'Tensor product', html: `
<p class="lead">The <b>tensor product</b> V ⊗ W combines two vector spaces into a larger one. It describes <b>composite systems</b>: two particles, or two qubits, together.</p>
<p>If V has dimension m (basis |eᵢ⟩) and W has dimension n (basis |fⱼ⟩), then V ⊗ W has <b>dimension m·n</b> with basis {|eᵢ⟩ ⊗ |fⱼ⟩}, written |eᵢfⱼ⟩ or |ij⟩.</p>
<figure data-fig="m2-tensor"></figure>
<h3>Vectors</h3>
<p>Multiply each component of the first vector by the <b>whole</b> second vector:</p>
<div class="eq">(a, b) ⊗ (c, d) = (ac, ad, bc, bd)</div>
<p>(1, 2) ⊗ (3, 4) = (3, 4, 6, 8) and (1, 2) ⊗ (0, 3) = (0, 3, 0, 6).</p>
<div class="worked"><div class="given">Past paper: |u⟩ = (1, 2) ∈ ℝ² and |v⟩ = (3, 4, 5) ∈ ℝ³. Find u ⊗ v and its dimension.</div>
<div class="solve"><p>u ⊗ v = (1·3, 1·4, 1·5, 2·3, 2·4, 2·5).</p></div>
<div class="result">u ⊗ v = (3, 4, 5, 6, 8, 10), in ℝ⁶: dimension 2 × 3 = 6</div></div>
<h3>Two qubits</h3>
<p>ℂ² ⊗ ℂ² = ℂ⁴ with basis |00⟩, |01⟩, |10⟩, |11⟩. A general two-qubit state is |Ψ⟩ = c₀₀|00⟩ + c₀₁|01⟩ + c₁₀|10⟩ + c₁₁|11⟩. (States that cannot be split into a product are <b>entangled</b>: Module 5.)</p>` },
        { title: 'Operators: Kronecker product', html: `
<p>If A acts on V and B on W, then A ⊗ B acts on V ⊗ W by</p>
<div class="eq">(A ⊗ B)(|v⟩ ⊗ |w⟩) = (A|v⟩) ⊗ (B|w⟩)</div>
<p>Its matrix is the <b>Kronecker product</b>: replace each entry aᵢⱼ of A by the block aᵢⱼB.</p>
<div class="worked"><div class="given">A = [1 2; 3 4], B = [0 5; 6 7]. Find A ⊗ B.</div>
<div class="solve"><p>A ⊗ B = [1B 2B; 3B 4B].</p></div>
<div class="result">A ⊗ B = [0 5 0 10; 6 7 12 14; 0 15 0 20; 18 21 24 28]</div></div>
<div class="note exam"><p>“Illustrate the tensor product with an example” (5 marks): define V ⊗ W, state dimension m·n and the product basis, then work one vector example such as (1, 2) ⊗ (3, 4) = (3, 4, 6, 8), and mention two qubits |00⟩ … |11⟩.</p></div>` }
      ],
      flashcards: [
        { front: 'Dimension of V ⊗ W', back: 'dim V × dim W (m·n).' },
        { front: '(a, b) ⊗ (c, d)', back: '(ac, ad, bc, bd)' },
        { front: 'Kronecker product A ⊗ B', back: 'Replace each entry aᵢⱼ of A by the block aᵢⱼB.' },
        { front: 'Two-qubit basis', back: '|00⟩, |01⟩, |10⟩, |11⟩ (ℂ² ⊗ ℂ² = ℂ⁴).' }
      ],
      oneLiners: [
        'A ⊗ B is the Kronecker product: each entry aᵢⱼ of A becomes the block aᵢⱼB.',
        '(1, 2) ⊗ (3, 4, 5) = (3, 4, 5, 6, 8, 10), dimension 6.',
        'Tensor products describe composite systems such as two qubits.'
      ],
      formulas: [
        { name: 'Tensor product of vectors', html: `(a, b) ⊗ (c, d) = (ac, ad, bc, bd)`, note: '' },
        { name: 'Operators', html: `(A ⊗ B)(|v⟩ ⊗ |w⟩) = A|v⟩ ⊗ B|w⟩`, note: '' }
      ]
    },
    {
      id: 'm2-operators',
      title: 'Linear operators and matrix algebra',
      short: 'Linear operators',
      blurb: 'Operators as n × n matrices, transpose, conjugate, adjoint, symmetric and Hermitian matrices, inverse, commutator, and the product rules.',
      source: 'Module 2 notes §2.6',
      tabs: [
        { title: 'Operators as matrices', html: `
<p class="lead">A <b>linear operator</b> Â is a rule that takes a vector and returns another vector in the same space, with Â(a|α⟩ + b|β⟩) = aÂ|α⟩ + bÂ|β⟩. In an n-dimensional space it is an <b>n × n matrix</b> acting on the column of components.</p>
<div class="eq">Â|ψ⟩ = |ϕ⟩ ⇔ ϕᵢ = Σⱼ Aᵢⱼψⱼ</div>
<div class="worked"><div class="given">Â = [1 2; 0 1] acts on |ψ⟩ = (2, 3).</div>
<div class="solve"><p>Â|ψ⟩ = (1×2 + 2×3, 0×2 + 1×3) = (8, 3).</p></div>
<div class="result">|ϕ⟩ = (8, 3): the vector is the input, the matrix the machine, the output a new vector in the same space.</div></div>
<p>The inner product is a matrix product too: ⟨ϕ|ψ⟩ = (ϕ₁* … ϕₙ*)(ψ₁, …, ψₙ)<sup>T</sup> = Σϕᵢ*ψᵢ.</p>` },
        { title: 'Matrix operations', html: `
<table class="tbl">
<tr><th>Operation</th><th>Definition</th><th>Special matrix</th></tr>
<tr><td>Transpose T<sup>T</sup></td><td>swap rows and columns</td><td>symmetric T<sup>T</sup> = T; antisymmetric T<sup>T</sup> = −T</td></tr>
<tr><td>Conjugate T*</td><td>conjugate every entry</td><td>real T* = T; purely imaginary T* = −T</td></tr>
<tr><td>Adjoint T†</td><td>T† = (T*)<sup>T</sup></td><td><b>Hermitian T† = T</b>; skew-Hermitian T† = −T</td></tr>
<tr><td>Inverse T⁻¹</td><td>TT⁻¹ = T⁻¹T = I</td><td>exists only if square with det ≠ 0</td></tr>
<tr><td>Unitary</td><td>U†U = UU† = I</td><td>U⁻¹ = U†</td></tr>
</table>
<p><b>Commutator:</b> [A, B] = AB − BA. Matrices usually do not commute, so the order matters. <b>Anticommutator:</b> {A, B} = AB + BA.</p>
<h3>Product rules (order reverses)</h3>
<ul>
<li>(A<sup>T</sup>)<sup>T</sup> = A, (A*)* = A, (A†)† = A</li>
<li>(AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup>, (AB)* = A*B*, <b>(AB)† = B†A†</b></li>
<li>(A⁻¹)<sup>T</sup> = (A<sup>T</sup>)⁻¹, (A⁻¹)† = (A†)⁻¹, (AB)⁻¹ = B⁻¹A⁻¹</li>
</ul>
<div class="worked"><div class="given">Past paper: find the complex conjugate transpose (adjoint) of a matrix.</div>
<div class="solve"><p>Method: (1) replace i by −i in every entry; (2) swap rows and columns. Example: A = [1 2i; −i 4] → A* = [1 −2i; i 4] → A† = [1 i; −2i 4].</p></div>
<div class="result">A† = (A*)<sup>T</sup>; here A† = [1 i; −2i 4], and A is not Hermitian because A† ≠ A.</div></div>
<div class="note"><p>Operator commutators (Module 3): [x̂, p̂] = iℏ and [x̂², p̂] = x̂[x̂, p̂] + [x̂, p̂]x̂ = 2iℏx̂, using [AB, C] = A[B, C] + [A, C]B.</p></div>` }
      ],
      flashcards: [
        { front: 'Adjoint (Hermitian conjugate)', back: 'T† = (T*)ᵀ: conjugate then transpose.' },
        { front: '(AB)†', back: 'B†A† (the order reverses).' },
        { front: 'Commutator', back: '[A, B] = AB − BA' },
        { front: 'When does T⁻¹ exist?', back: 'T square and det T ≠ 0.' },
        { front: 'Hermitian vs skew-Hermitian', back: 'T† = T vs T† = −T.' }
      ],
      oneLiners: [
        '(AB)† = B†A†: the order reverses, as for the transpose and the inverse.',
        'A linear operator on an n-dimensional space is an n × n matrix.',
        '[x̂, p̂] = iℏ; [x̂², p̂] = 2iℏx̂.'
      ],
      formulas: [
        { name: 'Adjoint', html: `T† = (T*)<sup>T</sup>,  (AB)† = B†A†`, note: '' },
        { name: 'Commutator', html: `[A, B] = AB − BA,  {A, B} = AB + BA`, note: '' }
      ]
    },
    {
      id: 'm2-hermitian',
      title: 'Hermitian, unitary and projection operators',
      short: 'Hermitian and unitary',
      blurb: 'Proofs that Hermitian eigenvalues are real and eigenvectors orthogonal, why observables are Hermitian, unitary operators preserve norms, and the paper checks AA† and B.',
      source: 'Module 2 notes §2.8, §2.9, §2.11',
      tabs: [
        { title: 'Hermitian operators', html: `
<p class="lead">An operator is <b>Hermitian</b> (self-adjoint) if ⟨α|T̂|β⟩ = ⟨β|T̂|α⟩* for all states; as a matrix, <b>T† = T</b>. Hermitian operators represent <b>physical observables</b> (energy, momentum, spin).</p>
<h3>1. Eigenvalues are real</h3>
<div class="solve"><p>Let T̂|α⟩ = λ|α⟩ with |α⟩ ≠ 0. Then ⟨α|T̂|α⟩ = λ⟨α|α⟩.</p>
<p>Since T̂† = T̂: ⟨α|T̂|α⟩ = ⟨α|T̂|α⟩* = λ*⟨α|α⟩.</p>
<p>So λ⟨α|α⟩ = λ*⟨α|α⟩, and ⟨α|α⟩ ≠ 0 gives <b>λ = λ*: λ is real</b>.</p></div>
<h3>2. Eigenvectors with different eigenvalues are orthogonal</h3>
<div class="solve"><p>Let T̂|α⟩ = λ|α⟩, T̂|β⟩ = μ|β⟩, λ ≠ μ (both real).</p>
<p>⟨α|T̂|β⟩ = μ⟨α|β⟩, and using Hermiticity ⟨α|T̂|β⟩ = ⟨β|T̂|α⟩* = λ⟨α|β⟩.</p>
<p>So (μ − λ)⟨α|β⟩ = 0, and λ ≠ μ gives <b>⟨α|β⟩ = 0</b>.</p></div>
<h3>3. Eigenvectors span the space</h3>
<p>A Hermitian operator can always be diagonalised: its eigenvectors form a complete basis, so <b>any state can be expanded in eigenstates of an observable</b>. (Guaranteed in finite dimensions; infinite dimensions need the spectral theorem.)</p>
<div class="note exam"><p>Why observables must be Hermitian: measured values are real (property 1), different outcomes are distinguishable (orthogonal, property 2), and every state can be written as a combination of the possible outcomes (property 3).</p></div>
<div class="worked"><div class="given">Past paper: show that AA† is Hermitian for any operator A.</div>
<div class="solve"><p>(AA†)† = (A†)†A† (the order reverses) = AA†.</p></div>
<div class="result">AA† equals its own adjoint, so it is Hermitian. (The same steps show A†A and A + A† are Hermitian.)</div></div>` },
        { title: 'Unitary operators', html: `
<p class="lead">U is <b>unitary</b> if <b>U†U = UU† = I</b>, so U⁻¹ = U†.</p>
<ul>
<li><b>Norm-preserving:</b> ‖U|ψ⟩‖ = ‖|ψ⟩‖, since ⟨ψ|U†U|ψ⟩ = ⟨ψ|ψ⟩.</li>
<li><b>Inner-product preserving:</b> with |ϕ′⟩ = U|ϕ⟩, |ψ′⟩ = U|ψ⟩: ⟨ϕ′|ψ′⟩ = ⟨ϕ|U†U|ψ⟩ = ⟨ϕ|ψ⟩. Angles and overlaps do not change.</li>
<li>Examples: rotation matrices; the time evolution U(t) = e<sup>−iĤt/ℏ</sup>; quantum gates.</li>
</ul>
<p>Unitary operators describe how <b>isolated quantum states evolve</b>, because total probability must stay 1.</p>
<p><b>U(t) = e<sup>−iĤt/ℏ</sup> is unitary:</b> U† = e<sup>+iĤ†t/ℏ</sup> = e<sup>+iĤt/ℏ</sup> (Ĥ Hermitian, t real), so U†U = e<sup>0</sup> = I.</p>
<div class="worked"><div class="given">Past paper: is B = (1/√2)[1 i; i 1] unitary?</div>
<div class="solve"><p>B† = (1/√2)[1 −i; −i 1].</p>
<p>B†B = ½[1·1 + (−i)(i)  1·i + (−i)·1; (−i)·1 + 1·i  (−i)(i) + 1·1] = ½[2 0; 0 2] = I.</p></div>
<div class="result">Yes, B is unitary (B†B = I).</div></div>
<div class="worked"><div class="given">Is U = (1/√2)[1 1; −1 1] unitary?</div>
<div class="solve"><p>U is real, so U† = U<sup>T</sup> = (1/√2)[1 −1; 1 1]. U†U = ½[1+1 1−1; 1−1 1+1] = I.</p></div>
<div class="result">Yes: it is a rotation by 45°, which keeps lengths.</div></div>` },
        { title: 'Hermitian eigen example', html: `
<div class="worked"><div class="given">A = [2 1+i; 1−i 3]. Show A is Hermitian, find its eigenvalues and eigenvectors and check orthogonality.</div>
<div class="solve"><p>A* = [2 1−i; 1+i 3], transpose: A† = [2 1+i; 1−i 3] = A  (correct) Hermitian.</p>
<p>det(A − λI) = (2 − λ)(3 − λ) − (1 + i)(1 − i) = λ² − 5λ + 6 − 2 = λ² − 5λ + 4 = 0 ⇒ λ = 1, 4 (real, as proved).</p>
<p>λ = 1: x + (1 + i)y = 0 ⇒ v₁ = (−(1 + i), 1), ‖v₁‖² = 2 + 1 = 3.</p>
<p>λ = 4: −2x + (1 + i)y = 0 ⇒ v₂ = ((1 + i)/2, 1), ‖v₂‖² = ½ + 1 = 3/2.</p>
<p>⟨v₁|v₂⟩ = (−(1 − i))(1 + i)/2 + 1 = −(1 − i)(1 + i)/2 + 1 = −2/2 + 1 = 0  (correct)</p></div>
<div class="result">λ = 1, 4; normalised v₁ = (1/√3)(−1−i, 1), v₂ = √(2/3)((1+i)/2, 1); orthogonal.</div></div>` }
      ],
      flashcards: [
        { front: 'Hermitian operator', back: 'T† = T; equivalently ⟨α|T|β⟩ = ⟨β|T|α⟩*.' },
        { front: 'Eigenvalues of a Hermitian operator are…', back: 'real.' },
        { front: 'Eigenvectors of a Hermitian operator with different eigenvalues are…', back: 'orthogonal.' },
        { front: 'Unitary operator', back: 'U†U = UU† = I; preserves norms and inner products.' },
        { front: 'Why is AA† Hermitian?', back: '(AA†)† = (A†)†A† = AA†.' },
        { front: 'Why is time evolution unitary?', back: 'Total probability ⟨ψ|ψ⟩ must stay 1; U = e^(−iHt/ℏ) with H Hermitian gives U†U = I.' }
      ],
      oneLiners: [
        'Observables are Hermitian: real eigenvalues, orthogonal eigenvectors, complete basis.',
        'Unitary: U⁻¹ = U†.',
        'Projector: P² = P, P† = P.'
      ],
      formulas: [
        { name: 'Hermitian', html: `T† = T`, note: 'observables' },
        { name: 'Unitary', html: `U†U = UU† = I`, note: 'evolution, gates' },
        { name: 'Projector', html: `P = |i⟩⟨i|,  P² = P = P†`, note: '' }
      ]
    },
    {
      id: 'm2-eigen',
      title: 'Eigenvalues and eigenvectors',
      short: 'Eigenvalues',
      blurb: 'The eigenvalue equation, the characteristic equation det(T − λI) = 0, degeneracy, and fully worked 2 × 2 and 3 × 3 problems from the notes and past papers.',
      source: 'Module 2 notes §2.7, exercises 1 and 8',
      tabs: [
        { title: 'Meaning and method', html: `
<p class="lead">An <b>eigenvector</b> of T̂ is a non-zero vector whose <b>direction does not change</b> when T̂ acts: it is only stretched (or reversed).</p>
<div class="eq">T̂|α⟩ = λ|α⟩,  |α⟩ ≠ 0</div>
<p>λ is the <b>eigenvalue</b> (possibly complex). Any multiple of an eigenvector is an eigenvector with the same λ. Example: for a rotation about an axis, a vector along the axis is unchanged (λ = 1).</p>
<figure data-fig="m2-eigen"></figure>
<h3>Method</h3>
<ol>
<li>Write (T − λI)a = 0. A non-zero solution needs <b>det(T − λI) = 0</b>: the <b>characteristic equation</b>.</li>
<li>Expanding gives a polynomial of degree n, so an n × n matrix has <b>n eigenvalues</b> (counting repeats). Their set is the <b>spectrum</b>.</li>
<li>For each λ, solve (T − λI)a = 0 for the eigenvector; choose one free component.</li>
<li><b>Normalise</b>: divide by the norm.</li>
</ol>
<p>If more than one independent eigenvector shares an eigenvalue, the eigenvalue is <b>degenerate</b>.</p>
<p>Quick checks: the sum of the eigenvalues = trace; their product = determinant.</p>
<p>Example: T = [2 0; 0 3] gives (1, 0) with λ = 2 and (0, 1) with λ = 3 (a diagonal matrix’s eigenvalues are its diagonal entries).</p>` },
        { title: 'Worked 2 × 2', html: `
<div class="worked"><div class="given">T = [2 1; 1 3]. Find the eigenvalues, the eigenvectors, normalise them and check they are orthogonal.</div>
<div class="solve"><p>det[2 − λ 1; 1 3 − λ] = (2 − λ)(3 − λ) − 1 = λ² − 5λ + 5 = 0.</p>
<p>λ = (5 ± √(25 − 20))/2 = (5 ± √5)/2: λ₁ ≈ 3.618, λ₂ ≈ 1.382 (sum 5 = trace, product 5 = det  (correct)).</p>
<p>First row: (2 − λ)a₁ + a₂ = 0 ⇒ a₂ = (λ − 2)a₁. Take a₁ = 1: a⁽¹⁾ = (1, λ₁ − 2) ≈ (1, 1.618), a⁽²⁾ = (1, λ₂ − 2) ≈ (1, −0.618).</p>
<p>Norms: √(1 + 1.618²) ≈ 1.902 and √(1 + 0.618²) ≈ 1.176.</p>
<p>Orthogonality: 1 + (λ₁ − 2)(λ₂ − 2) = 1 + (λ₁λ₂ − 2(λ₁ + λ₂) + 4) = 1 + (5 − 10 + 4) = 0  (correct) (T is real symmetric, so Hermitian).</p></div>
<div class="result">λ = (5 ± √5)/2; normalised eigenvectors ≈ (0.526, 0.851) and (0.851, −0.526)</div></div>` },
        { title: 'Worked 3 × 3', html: `
<div class="worked"><div class="given">Past paper: find the eigenvalues and normalised eigenvectors of [2 −3 0; 2 −5 0; 0 0 3].</div>
<div class="solve"><p>The third row and column are separate, so λ = 3 with eigenvector (0, 0, 1).</p>
<p>The upper 2 × 2 block: det[2 − λ −3; 2 −5 − λ] = (2 − λ)(−5 − λ) + 6 = λ² + 3λ − 4 = (λ + 4)(λ − 1) = 0 ⇒ λ = 1, −4.</p>
<p>λ = 1: (2 − 1)x − 3y = 0 ⇒ x = 3y ⇒ (3, 1, 0). Check: (2·3 − 3·1, 2·3 − 5·1) = (3, 1)  (correct)</p>
<p>λ = −4: (2 + 4)x − 3y = 0 ⇒ y = 2x ⇒ (1, 2, 0). Check: (2 − 6, 2 − 10) = (−4, −8) = −4(1, 2)  (correct)</p></div>
<div class="result">λ = 1: (3, 1, 0)/√10; λ = −4: (1, 2, 0)/√5; λ = 3: (0, 0, 1). (The matrix is not symmetric, so these need not be orthogonal.)</div></div>
<div class="worked"><div class="given">B = [2 0 1; 0 3 0; 1 0 2] (Hermitian). Find the eigenvalues and an orthonormal set of eigenvectors.</div>
<div class="solve"><p>det(B − λI) = (3 − λ)[(2 − λ)² − 1] = (3 − λ)(λ − 1)(λ − 3) = 0 ⇒ λ = 1, 3, 3.</p>
<p>λ = 1: B(1, 0, −1) = (1, 0, −1)  (correct). λ = 3: B(1, 0, 1) = (3, 0, 3)  (correct) and B(0, 1, 0) = (0, 3, 0)  (correct).</p></div>
<div class="result">λ = 1: (1, 0, −1)/√2; λ = 3 (degenerate, twice): (1, 0, 1)/√2 and (0, 1, 0). All three are orthonormal.</div></div>` }
      ],
      flashcards: [
        { front: 'Eigenvalue equation', back: 'T|α⟩ = λ|α⟩ with |α⟩ ≠ 0.' },
        { front: 'Characteristic equation', back: 'det(T − λI) = 0' },
        { front: 'Degenerate eigenvalue', back: 'One eigenvalue with more than one linearly independent eigenvector.' },
        { front: 'Checks on eigenvalues', back: 'Sum = trace, product = determinant.' },
        { front: 'Eigenvalues of [2 1; 1 3]', back: '(5 ± √5)/2 ≈ 3.618 and 1.382' }
      ],
      oneLiners: [
        'An n × n matrix has n eigenvalues, counting repeats.',
        'Any non-zero multiple of an eigenvector is an eigenvector.',
        'Diagonal matrix: eigenvalues are the diagonal entries.'
      ],
      formulas: [
        { name: 'Characteristic equation', html: `det(T − λI) = 0`, note: '' },
        { name: '2 × 2 shortcut', html: `λ² − (tr T)λ + det T = 0`, note: '' }
      ]
    },
    {
      id: 'm2-pauli',
      title: 'Pauli matrices and commutation relations',
      short: 'Pauli matrices',
      blurb: 'σx, σy, σz, their properties, commutators [σi, σj] = 2iεijkσk, anticommutators, eigenvectors, and the link to spin and Stern–Gerlach.',
      source: 'Module 2 notes §2.14, Pauli matrices notes',
      tabs: [
        { title: 'Matrices and properties', html: `
<div class="eq">σₓ = [0 1; 1 0],   σ<sub>y</sub> = [0 −i; i 0],   σ<sub>z</sub> = [1 0; 0 −1]</div>
<ul>
<li><b>σᵢ² = I</b> (squaring gives the identity).</li>
<li><b>Tr σᵢ = 0</b> (traceless).</li>
<li><b>Hermitian:</b> σᵢ† = σᵢ, so they are observables. Check σ<sub>y</sub>: conjugate → [0 i; −i 0], transpose → [0 −i; i 0] = σ<sub>y</sub>  (correct). σ<sub>z</sub> is real and symmetric, so Hermitian.</li>
<li>Also unitary (σᵢ†σᵢ = σᵢ² = I); eigenvalues ±1 (det = −1, trace 0).</li>
</ul>
<h3>Commutators and anticommutators</h3>
<div class="eq">[σᵢ, σⱼ] = 2i εᵢⱼₖ σₖ,   {σᵢ, σⱼ} = 2δᵢⱼ I</div>
<p>The <b>Levi-Civita symbol</b> εᵢⱼₖ = +1 for an even (cyclic) order of (x, y, z), −1 for an odd order, 0 if an index repeats.</p>
<ul>
<li>[σₓ, σ<sub>y</sub>] = 2iσ<sub>z</sub>, [σ<sub>y</sub>, σ<sub>z</sub>] = 2iσₓ, [σ<sub>z</sub>, σₓ] = 2iσ<sub>y</sub> (cyclic order).</li>
<li>Reversing the order flips the sign: [σₓ, σ<sub>z</sub>] = −2iσ<sub>y</sub>.</li>
</ul>` },
        { title: 'Proofs from papers', html: `
<div class="worked"><div class="given">Past paper: prove [σₓ, σ<sub>y</sub>] = 2iσ<sub>z</sub>.</div>
<div class="solve"><p>σₓσ<sub>y</sub> = [0 1; 1 0][0 −i; i 0] = [i 0; 0 −i] = iσ<sub>z</sub>.</p>
<p>σ<sub>y</sub>σₓ = [0 −i; i 0][0 1; 1 0] = [−i 0; 0 i] = −iσ<sub>z</sub>.</p>
<p>[σₓ, σ<sub>y</sub>] = iσ<sub>z</sub> − (−iσ<sub>z</sub>) = 2iσ<sub>z</sub> = [2i 0; 0 −2i].</p></div>
<div class="result">[σₓ, σ<sub>y</sub>] = 2iσ<sub>z</sub></div></div>
<div class="worked"><div class="given">Past paper: compute [σₓ, σ<sub>z</sub>].</div>
<div class="solve"><p>σₓσ<sub>z</sub> = [0 1; 1 0][1 0; 0 −1] = [0 −1; 1 0]; σ<sub>z</sub>σₓ = [0 1; −1 0].</p>
<p>[σₓ, σ<sub>z</sub>] = [0 −2; 2 0] = −2i[0 −i; i 0] = −2iσ<sub>y</sub>.</p></div>
<div class="result">[σₓ, σ<sub>z</sub>] = −2iσ<sub>y</sub></div></div>
<div class="worked"><div class="given">Verify σₓ² = I and show σ<sub>z</sub>|0⟩ = +|0⟩, σ<sub>z</sub>|1⟩ = −|1⟩.</div>
<div class="solve"><p>σₓ² = [0·0 + 1·1  0; 0  1·1 + 0·0] = I.</p>
<p>σ<sub>z</sub>(1, 0) = (1, 0) and σ<sub>z</sub>(0, 1) = (0, −1).</p></div>
<div class="result">σₓ² = I; |0⟩, |1⟩ are σ<sub>z</sub> eigenvectors with +1, −1.</div></div>` },
        { title: 'Eigenvectors and spin', html: `
<table class="tbl"><tr><th>Matrix</th><th>λ = +1</th><th>λ = −1</th></tr>
<tr><td>σ<sub>z</sub></td><td>|0⟩ = (1, 0)</td><td>|1⟩ = (0, 1)</td></tr>
<tr><td>σₓ</td><td>|+⟩ = (1, 1)/√2</td><td>|−⟩ = (1, −1)/√2</td></tr>
<tr><td>σ<sub>y</sub></td><td>(1, i)/√2</td><td>(1, −i)/√2</td></tr></table>
<p>Check σ<sub>y</sub>: [0 −i; i 0](1, i) = (−i·i, i) = (1, i)  (correct) and (1, −i) → (−1, i) = −(1, −i)  (correct).</p>
<h3>Connection to spin</h3>
<p>For a spin-½ particle the z-basis |0⟩<sub>z</sub> = (1, 0), |1⟩<sub>z</sub> = (0, 1) means spin-up and spin-down along z. The spin operator is</p>
<div class="eq">S<sub>z</sub> = (ℏ/2)σ<sub>z</sub>,  eigenvalues ±ℏ/2</div>
<p>These two eigenvalues are exactly the <b>two spots</b> of the Stern–Gerlach experiment (Module 1): silver atoms split into spin-up (+ℏ/2) and spin-down (−ℏ/2) beams.</p>
<div class="note"><p>Non-zero commutators mean S<sub>x</sub>, S<sub>y</sub>, S<sub>z</sub> cannot be known together: measuring S<sub>x</sub> after S<sub>z</sub> scrambles S<sub>z</sub> (sequential Stern–Gerlach, Module 3).</p></div>` }
      ],
      flashcards: [
        { front: 'σₓ, σ_y, σ_z', back: '[0 1; 1 0], [0 −i; i 0], [1 0; 0 −1]' },
        { front: 'Three properties of Pauli matrices', back: 'σᵢ² = I, trace 0, Hermitian.' },
        { front: '[σₓ, σ_y]', back: '2iσ_z' },
        { front: '[σₓ, σ_z]', back: '−2iσ_y' },
        { front: 'Anticommutator of Pauli matrices', back: '{σᵢ, σⱼ} = 2δᵢⱼI' },
        { front: 'Eigenvalues of S_z', back: '±ℏ/2 (S_z = (ℏ/2)σ_z): the two Stern–Gerlach spots.' }
      ],
      oneLiners: [
        'Cyclic order x → y → z gives +2i; reversed order gives −2i.',
        'Eigenvectors of σₓ are (|0⟩ ± |1⟩)/√2.',
        'Every Pauli matrix has eigenvalues +1 and −1.'
      ],
      formulas: [
        { name: 'Pauli commutator', html: `[σᵢ, σⱼ] = 2i εᵢⱼₖ σₖ`, note: '' },
        { name: 'Anticommutator', html: `{σᵢ, σⱼ} = 2δᵢⱼ I`, note: '' },
        { name: 'Spin', html: `S<sub>z</sub> = (ℏ/2)σ<sub>z</sub>`, note: 'eigenvalues ±ℏ/2' }
      ]
    }
  ],
  figures: [
    { id: 'm2-projection', src: 'pages/vtop__FALL2026-27_Lecture-notes-BAPHY105-Module-2/p06.png', crop: null, caption: 'Each component of |ψ⟩ is its projection on a basis vector: c₁ = ⟨e₁|ψ⟩, c₂ = ⟨e₂|ψ⟩.', alt: 'Two perpendicular unit vectors e1 and e2 and a vector psi = (3, 2) with dashed lines dropping to each axis, labelled c1 = 3 and c2 = 2.' },
    { id: 'm2-eigen', src: 'pages/vtop__FALL2026-27_Lecture-notes-BAPHY105-Module-2/p17.png', crop: null, caption: 'T = [2 1; 1 2] stretches (1, 1) by 3 and leaves (1, −1) as it is, but turns (1, 0) to a new direction.', alt: 'Three faint vectors (1,1), (1,−1), (1,0) and arrows showing where T sends each: the first two stay on their lines, the third points in a new direction.' },
    { id: 'm2-tensor', src: 'pages/vtop__FALL2026-27_Lecture-notes-BAPHY105-Module-2/p26.png', crop: null, caption: 'Two qubits: each pair of basis states gives one basis state of the 4-dimensional tensor product space.', alt: 'A 2 by 2 grid with rows |0⟩, |1⟩ of qubit A and columns |0⟩, |1⟩ of qubit B, filled with |00⟩, |01⟩, |10⟩, |11⟩, and the rule (a,b)⊗(c,d) = (ac, ad, bc, bd).' }
  ]
});
