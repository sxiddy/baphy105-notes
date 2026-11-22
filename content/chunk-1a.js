CHUNK({
  chunk: '1a',
  module: 'm1',
  topics: [
    {
      id: 'm1-dual-nature',
      title: 'Dual nature of radiation: waves, superposition and photons',
      short: 'Dual nature of radiation',
      blurb: 'Why light is treated as a wave (EM waves, superposition, interference) and why it also behaves as a stream of particles (photons with energy and momentum).',
      source: 'Module 1 notes §1.1, §1.2.5–1.2.6',
      tabs: [
        { title: 'Particles vs waves', html: `
<p class="lead">Classical physics keeps <b>particles</b> and <b>waves</b> in separate boxes. Quantum physics shows that both light and matter show <b>both behaviours</b>, depending on the experiment. This is called <b>wave–particle duality</b>.</p>
<ul>
<li>A stone dropped in water (particle) and the ripples it makes (wave) have only one thing in common classically: both <b>carry energy and momentum</b>. Particle mechanics and wave optics grew up as separate subjects, each with its own experiments.</li>
<li><b>Electrons</b> have charge and mass and obey particle mechanics, so we think of them as <b>particles</b>.</li>
<li><b>Electromagnetic waves</b> show <b>diffraction, interference and polarization</b>, so we think of them as <b>waves</b>.</li>
<li>This course shows the twist: a moving electron also behaves as a <b>wave</b>, and under other conditions EM waves behave as <b>streams of particles</b> (photons).</li>
</ul>
<div class="note exam"><p>"Explain the dual nature of radiation": write (1) wave evidence: interference and diffraction (Young’s double slit), Maxwell’s EM waves; (2) particle evidence: blackbody radiation (Planck’s quanta), photoelectric effect (Einstein’s photons, E = hν), Compton effect (photon momentum p = h/λ); (3) conclusion: light is neither only a wave nor only a particle.</p></div>` },
        { title: 'Waves and EM waves', html: `
<p class="lead">A <b>wave</b> is a disturbance that travels through a medium or space and <b>transfers energy</b> from one point to another <b>without permanently displacing the medium</b>.</p>
<h3>Types of waves</h3>
<ul>
<li><b>Mechanical waves</b> need a medium to travel: sound waves in air, water waves on water.</li>
<li><b>Electromagnetic waves</b>, like light and radio waves, can travel through a <b>vacuum</b>; they need no medium.</li>
</ul>
<p>Waves are described by <b>wavelength, amplitude, frequency and speed</b>.</p>
<p><b>Electromagnetic (EM) waves</b> are <b>coupled oscillations of electric and magnetic fields</b> that move at the speed of light and show typical wave behaviour. The electric field and the magnetic field are <b>perpendicular to each other</b> and both are perpendicular to the direction of travel.</p>
<figure data-fig="m1-em-wave"></figure>
<div class="eq">c = <span class="frac"><span>1</span><span>√(μ<sub>0</sub>ε<sub>0</sub>)</span></span> = 2.998 × 10<sup>8</sup> m/s</div>
<p>Here ε<sub>0</sub> is the <b>electric permittivity</b> of free space and μ<sub>0</sub> its <b>magnetic permeability</b>.</p>
<ul>
<li><b>James Clerk Maxwell</b> unified electricity and magnetism into <b>electromagnetism</b> and proposed EM waves.</li>
<li><b>Heinrich Hertz</b> (German physicist) showed experimentally that EM waves exist and behave exactly as Maxwell predicted.</li>
<li>The <b>visible</b> part of the EM spectrum runs from about <b>380 to 700 nm</b> and contains the colours of the rainbow.</li>
</ul>` },
        { title: 'Superposition and interference', html: `
<p class="lead"><b>Principle of superposition</b>: when two or more waves of the same nature pass a point at the same time, the <b>instantaneous amplitude</b> there is the <b>vector sum</b> of the instantaneous amplitudes of the individual waves.</p>
<p>The <b>instantaneous amplitude</b> is the value, at a given place and time, of the quantity whose variation makes up the wave:</p>
<ul>
<li>Stretched string: the <b>displacement</b> of the string from its normal position.</li>
<li>Water wave: the <b>height of the water surface</b> relative to its normal level.</li>
<li>Sound wave: the <b>change in pressure</b> relative to normal pressure.</li>
<li>Plane EM wave in vacuum: since <b>E = cB</b>, the amplitude can be taken as either E or B (magnitudes of the electric and magnetic fields).</li>
</ul>
<figure data-fig="m1-interference"></figure>
<ul>
<li><b>Constructive interference</b>: waves <b>in phase</b> (rise and fall together) add up to a <b>bigger</b> wave.</li>
<li><b>Destructive interference</b>: waves <b>out of phase</b> (rise and fall at opposite times) <b>cancel</b>, partly or completely.</li>
<li>If the waves have <b>different frequencies</b>, the result is a mix of constructive and destructive interference.</li>
</ul>
<div class="note why"><p>Interference is the fingerprint of a wave: two classical particles never cancel each other out, but two waves can.</p></div>` },
        { title: 'Photons and photon momentum', html: `
<p class="lead"><b>Einstein (1905)</b> took Planck’s quantisation seriously: light itself is made of particles, now called <b>photons</b>, each carrying energy <b>E = hν</b>.</p>
<ul>
<li>This explained the <b>photoelectric effect</b>, where light must deliver energy in <b>whole quanta</b> to individual electrons. Einstein got the <b>1921 Nobel Prize</b> for this.</li>
<li>So Einstein read Planck’s energy quantum as a <b>real particle of light</b>.</li>
</ul>
<h3>Momentum of a photon</h3>
<p>Special relativity links the energy E, momentum p and rest mass m of a free particle (no derivation needed):</p>
<div class="eq">E<sup>2</sup> = p<sup>2</sup>c<sup>2</sup> + m<sup>2</sup>c<sup>4</sup></div>
<p>A photon has <b>zero rest mass</b> (anything moving at c in vacuum must be massless), so:</p>
<ol class="steps">
<li><b>Set m = 0</b> E = pc</li>
<li><b>Solve for p</b> p = E/c</li>
<li><b>Use E = hν</b> p = hν/c</li>
<li><b>Use c = νλ</b> p = h/λ, so λ = h/p = hc/E</li>
</ol>
<div class="eq">p = <span class="frac"><span>h</span><span>λ</span></span>  ,  λ = <span class="frac"><span>h</span><span>p</span></span> = <span class="frac"><span>hc</span><span>E</span></span></div>
<p>A photon is <b>massless but carries momentum</b>, and that momentum depends on its wavelength.</p>
<div class="worked"><div class="given">Exercises: (1) frequency of λ = 600 nm; (2) momentum of a 700 nm photon; (3) momentum of a 6 × 10<sup>14</sup> Hz photon (c = 3 × 10<sup>8</sup> m/s, h = 6.626 × 10<sup>−34</sup> J s).</div>
<div class="solve"><p>(1) ν = c/λ = 3 × 10<sup>8</sup> / 600 × 10<sup>−9</sup> = 5.0 × 10<sup>14</sup> Hz.</p><p>(2) p = h/λ = 6.626 × 10<sup>−34</sup> / 700 × 10<sup>−9</sup> = 9.47 × 10<sup>−28</sup> kg m/s.</p><p>(3) p = hν/c = 6.626 × 10<sup>−34</sup> × 6 × 10<sup>14</sup> / 3 × 10<sup>8</sup> = 1.33 × 10<sup>−27</sup> kg m/s.</p></div>
<div class="result">5.0 × 10<sup>14</sup> Hz; 9.47 × 10<sup>−28</sup> kg m/s; 1.33 × 10<sup>−27</sup> kg m/s</div></div>` },
        { title: 'Compton effect', html: `
<div data-viz="compton"></div>
<p class="lead"><b>A. H. Compton (1923)</b> fired <b>X-rays</b> at a material with loosely bound electrons. The scattered X-rays had a slightly <b>longer wavelength</b> (lower energy) and <b>electrons were ejected</b>, like one particle recoiling when struck by another.</p>
<p>Classical wave theory cannot explain this. It makes sense only if light is made of photons with energy E = hν <b>and momentum</b>:</p>
<ul>
<li>A photon <b>collides with an electron at rest</b>.</li>
<li>Some <b>energy and momentum are transferred</b> to the electron.</li>
<li>The photon scatters with <b>lower energy (longer wavelength)</b> and the electron <b>recoils</b>.</li>
</ul>
<figure data-fig="m1-compton"></figure>
<p>Applying <b>conservation of energy and momentum</b> to this collision gives the <b>Compton shift</b>:</p>
<div class="eq">Δλ = λ′ − λ = <span class="frac"><span>h</span><span>m<sub>e</sub>c</span></span> (1 − cos θ)</div>
<ul>
<li>λ and λ′: wavelengths of the incident and scattered photon; θ: angle through which the photon is scattered.</li>
<li><b>h/m<sub>e</sub>c ≈ 2.43 × 10<sup>−12</sup> m</b> is the <b>Compton wavelength</b> of the electron.</li>
<li>The shift depends <b>only on θ</b>, not on the incident wavelength or the material: zero at θ = 0°, <b>maximum (2h/m<sub>e</sub>c ≈ 4.85 × 10<sup>−12</sup> m) at θ = 180°</b>.</li>
</ul>
<p>This proved that light <b>carries momentum like a particle</b> and, with the photoelectric effect, strongly supported the photon model.</p>
<div class="note exam"><p>For energies, convert with E = hc/λ: find λ from E, add Δλ, then E′ = hc/λ′. The electron’s kinetic energy is the energy the photon lost: K = hc/λ − hc/λ′.</p></div>` },
        { title: 'Compton numericals', html: `
<div class="worked"><div class="given">Compton shift at θ = 0°, 45°, 90°, 135°, 180°. Which angle gives the maximum and minimum shift? (h = 6.626 × 10<sup>−34</sup> J s, m<sub>e</sub> = 9.1 × 10<sup>−31</sup> kg, c = 3 × 10<sup>8</sup> m/s)</div>
<div class="solve"><p>h/m<sub>e</sub>c = 6.626 × 10<sup>−34</sup> / (9.1 × 10<sup>−31</sup> × 3 × 10<sup>8</sup>) = 2.427 × 10<sup>−12</sup> m.</p>
<p>0°: 0 · 45°: 2.427 × 10<sup>−12</sup> × 0.293 = 0.711 × 10<sup>−12</sup> m · 90°: 2.427 × 10<sup>−12</sup> m · 135°: 4.14 × 10<sup>−12</sup> m · 180°: 4.85 × 10<sup>−12</sup> m.</p></div>
<div class="result">Minimum (zero) at 0°, maximum (4.85 × 10<sup>−12</sup> m) at 180°. The 90° shift equals the Compton wavelength, 2.43 × 10<sup>−12</sup> m.</div></div>
<div class="worked"><div class="given">An X-ray photon of λ = 0.071 nm is scattered by a free electron through 60°. Find the shift, λ′ and the electron’s kinetic energy.</div>
<div class="solve"><p>Δλ = 2.427 × 10<sup>−12</sup> (1 − cos 60°) = 1.214 × 10<sup>−12</sup> m = 0.001214 nm.</p><p>λ′ = 0.071 + 0.001214 = 0.07221 nm.</p><p>K = hc/λ − hc/λ′ = hc (1/0.071 − 1/0.07221) × 10<sup>9</sup> = 4.71 × 10<sup>−17</sup> J ≈ 294 eV.</p></div>
<div class="result">Δλ = 1.21 × 10<sup>−12</sup> m, λ′ = 0.0722 nm, K ≈ 4.7 × 10<sup>−17</sup> J (294 eV)</div></div>
<div class="worked"><div class="given">A photon of initial energy 90 keV is Compton scattered by a static electron at 60°. Find the energy of the scattered photon. (asked in CAT-1)</div>
<div class="solve"><p>λ = hc/E = 6.626 × 10<sup>−34</sup> × 3 × 10<sup>8</sup> / (90 × 10<sup>3</sup> × 1.6 × 10<sup>−19</sup>) = 1.380 × 10<sup>−11</sup> m.</p><p>λ′ = λ + 1.214 × 10<sup>−12</sup> = 1.502 × 10<sup>−11</sup> m.</p><p>E′ = hc/λ′ = 1.323 × 10<sup>−14</sup> J = 82.7 keV.</p></div>
<div class="result">E′ ≈ 82.7 keV (the electron takes about 7.3 keV)</div></div>` }
      ],
      flashcards: [
        { front: 'What is wave–particle duality?', back: 'Light and matter show both wave behaviour (interference, diffraction) and particle behaviour (quanta with energy hν and momentum h/λ), depending on the experiment.' },
        { front: 'Compton shift formula', back: 'Δλ = λ′ − λ = (h/m<sub>e</sub>c)(1 − cos θ); h/m<sub>e</sub>c ≈ 2.43 × 10<sup>−12</sup> m is the Compton wavelength.' },
        { front: 'Momentum of a photon', back: 'p = E/c = hν/c = h/λ (from E² = p²c² + m²c⁴ with m = 0).' },
        { front: 'State the principle of superposition', back: 'When waves of the same nature pass a point together, the instantaneous amplitude there is the vector sum of their individual instantaneous amplitudes.' },
        { front: 'Constructive vs destructive interference', back: 'In phase → amplitudes add (bigger wave). Out of phase → they cancel partly or fully.' },
        { front: 'Speed of EM waves in free space', back: 'c = 1/√(μ<sub>0</sub>ε<sub>0</sub>) = 2.998 × 10<sup>8</sup> m/s.' },
        { front: 'At what angle is the Compton shift maximum?', back: 'θ = 180° (back-scattering): Δλ = 2h/m<sub>e</sub>c ≈ 4.85 × 10<sup>−12</sup> m. Zero at θ = 0°.' },
        { front: 'Who showed EM waves exist?', back: 'Heinrich Hertz, confirming Maxwell’s prediction.' }
      ],
      oneLiners: [
        'EM waves: E and B oscillate perpendicular to each other and to the direction of travel.',
        'Visible light: about 380–700 nm.',
        'Einstein (1905): light is made of photons, E = hν; explained the photoelectric effect (Nobel 1921).',
        'Compton (1923): X-rays scattered from loosely bound electrons come out with a longer wavelength.',
        'The Compton shift depends only on the scattering angle.'
      ],
      formulas: [
        { name: 'Speed of light', html: `c = 1/√(μ<sub>0</sub>ε<sub>0</sub>) = 2.998 × 10<sup>8</sup> m/s`, note: 'ε₀ permittivity, μ₀ permeability of free space' },
        { name: 'Photon energy and momentum', html: `E = hν,  p = h/λ = hν/c`, note: 'h = 6.626 × 10⁻³⁴ J s' },
        { name: 'Compton shift', html: `Δλ = (h/m<sub>e</sub>c)(1 − cos θ)`, note: 'h/mₑc = 2.43 × 10⁻¹² m' }
      ]
    },
    {
      id: 'm1-ydse',
      title: 'Young’s double slit experiment',
      short: 'Young’s double slit',
      blurb: 'Young’s 1801 experiment: two slits, bright and dark fringes, path-difference conditions, and why it proved light is a wave.',
      source: 'Module 1 notes §1.1.1; M1 numericals',
      tabs: [
        { title: 'The experiment', html: `
<p class="lead"><b>Thomas Young (1801)</b> first showed the interference of light. He lit <b>two narrow slits</b> with <b>monochromatic light from a single source</b>.</p>
<figure data-fig="m1-ydse"></figure>
<ul>
<li>Light from each slit spreads out as if the slit were itself a source. This spreading is <b>diffraction</b>, which, like interference, is a <b>wave property</b>.</li>
<li>Because of interference, the screen is <b>not uniformly lit</b>: it shows <b>alternating bright and dark fringes</b>.</li>
</ul>
<h3>Conditions on the path difference Δx</h3>
<table class="tbl"><thead><tr><th>Fringe</th><th>Path difference</th><th>What happens</th></tr></thead><tbody>
<tr><td>Bright</td><td>Δx = nλ (0, λ, 2λ, …), n = 0, 1, 2, …</td><td>The waves arrive in phase, so interference is constructive.</td></tr>
<tr><td>Dark</td><td>Δx = (2n + 1)λ/2 (λ/2, 3λ/2, 5λ/2, …)</td><td>The waves arrive out of phase, so interference is destructive.</td></tr>
<tr><td>In between</td><td>other values</td><td>Interference is partial, so brightness changes smoothly between dark and bright.</td></tr>
</tbody></table>` },
        { title: 'Why it proves light is a wave', html: `
<p class="lead">In classical physics, <b>interference and diffraction happen only with waves</b>. Classical particles never make such patterns.</p>
<ul>
<li>If light were a stream of classical particles, we would see only <b>two bright spots</b> behind the slits, not a fringe pattern.</li>
<li>So Young’s experiment showed that <b>light behaves like a wave</b>. Later, <b>Maxwell’s theory</b> explained that these waves are <b>electromagnetic</b>.</li>
<li>Until the late 19th century this wave picture of light was <b>fully accepted</b>; blackbody radiation, the photoelectric effect and the Compton effect then forced the particle picture back in.</li>
</ul>
<div class="note exam"><p>Draw the set-up (source, double slit S₁ S₂, screen with fringes), write the bright/dark conditions, then the conclusion. The same experiment done with electrons is in the Wavefunction topic: there it shows that particles also behave as waves.</p></div>` },
        { title: 'Formulas and numericals', html: `
<p class="lead">For slits a distance <b>d</b> apart, the <b>n-th maximum</b> is at angle θ with <b>d sin θ = nλ</b>. On a screen at distance <b>D</b>, neighbouring bright fringes are a <b>fringe width β = λD/d</b> apart.</p>
<div class="eq">d sin θ = nλ   (maxima, n = 0, 1, 2, …)</div>
<div class="eq">β = <span class="frac"><span>λD</span><span>d</span></span></div>
<div class="worked"><div class="given">λ = 500 nm gives a first-order maximum at θ = 12°. Find d.</div><div class="solve"><p>d = nλ/sin θ = 500 nm / sin 12° = 500 / 0.2079 nm.</p></div><div class="result">d ≈ 2405 nm ≈ 2.4 μm</div></div>
<div class="note heads-up"><p>The course worked solution prints 2403.8 nm; 500/sin 12° is 2404.9 nm. Either rounds to 2.40 μm.</p></div>
<div class="worked"><div class="given">d = 0.25 mm, λ = 650 nm. At what angle is the second-order maximum?</div><div class="solve"><p>sin θ = 2λ/d = 2 × 650 × 10<sup>−9</sup> / 0.25 × 10<sup>−3</sup> = 0.0052.</p></div><div class="result">θ = sin<sup>−1</sup>(0.0052) ≈ 0.298°</div></div>
<div class="worked"><div class="given">First-order maximum at θ = 8° with d = 0.30 mm. Find λ.</div><div class="solve"><p>λ = d sin θ = 0.30 × 10<sup>−3</sup> × sin 8° = 0.30 × 10<sup>−3</sup> × 0.1392.</p></div><div class="result">λ ≈ 4.18 × 10<sup>−5</sup> m (41.8 μm)</div></div>
<div class="worked"><div class="given">Electrons hit two slits 2 μm apart; screen at D = 1.5 m; fringe width 0.75 mm. Find the electron wavelength.</div><div class="solve"><p>λ = βd/D = 0.75 × 10<sup>−3</sup> × 2 × 10<sup>−6</sup> / 1.5.</p></div><div class="result">λ = 1.0 × 10<sup>−9</sup> m (1 nm)</div></div>` }
      ],
      flashcards: [
        { front: 'Condition for a bright fringe', back: 'Path difference Δx = nλ (n = 0, 1, 2, …): constructive interference. Equivalently d sin θ = nλ.' },
        { front: 'Condition for a dark fringe', back: 'Path difference Δx = (2n + 1)λ/2: destructive interference.' },
        { front: 'Fringe width', back: 'β = λD/d (D slit–screen distance, d slit separation).' },
        { front: 'What did Young’s experiment prove, and when?', back: '1801: light shows interference, so it behaves as a wave.' },
        { front: 'What would classical particles give behind two slits?', back: 'Two bright spots (one behind each slit), no fringes.' },
        { front: 'What is diffraction?', back: 'Spreading of a wave after passing through a narrow opening, as if the opening were a new source; a wave property.' }
      ],
      oneLiners: [
        'Young used monochromatic light from a single source on two narrow slits.',
        'Interference and diffraction are wave properties.',
        'Maxwell later showed the light waves are electromagnetic.'
      ],
      formulas: [
        { name: 'Double-slit maxima', html: `d sin θ = nλ`, note: 'n = 0, 1, 2, …' },
        { name: 'Fringe width', html: `β = λD/d`, note: '' }
      ]
    },
    {
      id: 'm1-blackbody',
      title: 'Blackbody radiation and the ultraviolet catastrophe',
      short: 'Blackbody radiation',
      blurb: 'What a blackbody is, the observed spectra, Stefan–Boltzmann and Wien laws, and why Rayleigh–Jeans and Wien’s radiation law each fail.',
      source: 'Module 1 notes §1.2.1–1.2.3; M1 numericals',
      tabs: [
        { title: 'Blackbody', html: `
<p class="lead">All objects <b>emit radiation continuously</b>, and the spectrum depends mainly on <b>temperature</b>. At room temperature most of it is <b>infrared</b>, so it is invisible.</p>
<ul>
<li>A body’s ability to <b>emit</b> radiation is closely linked to how well it <b>absorbs</b> it. At constant temperature (thermal equilibrium) a body must <b>absorb and emit at the same rate</b>.</li>
<li>A <b>blackbody</b> is an <b>ideal absorber</b>: it absorbs <b>all incident radiation, whatever the frequency</b>.</li>
<li>Lab model: a <b>hollow cavity with a small hole</b>. Radiation entering the hole reflects again and again and is almost entirely absorbed by the inner walls, which also emit radiation characteristic of their temperature.</li>
<li>The radiation coming out of the hole is <b>blackbody radiation</b>.</li>
</ul>
<p>The <b>spectral energy density u(ν) dν</b> is the energy per unit volume in the frequency interval ν to ν + dν.</p>
<figure data-fig="m1-blackbody"></figure>
<p>The shape of the spectrum depends <b>only on temperature</b>. Higher temperature gives <b>more radiation</b> and moves the <b>peak to higher frequency</b>.</p>` },
        { title: 'Stefan–Boltzmann and Wien laws', html: `
<h3>Observation 1: hotter bodies emit more</h3>
<p>The 1800 K curve lies <b>entirely above</b> the 1200 K curve. The <b>area under each curve</b> is the <b>total energy density</b> (energy per unit volume), which rises rapidly and is <b>proportional to T<sup>4</sup></b>.</p>
<p>The <b>Stefan–Boltzmann law</b> gives the total energy radiated per unit surface area per unit time:</p>
<div class="eq">P = σT<sup>4</sup>,   σ = 5.67 × 10<sup>−8</sup> W m<sup>−2</sup> K<sup>−4</sup></div>
<p>In general <b>P = εσT<sup>4</sup></b>, where ε is the <b>emissivity</b> (0 ≤ ε ≤ 1); a perfect blackbody has ε = 1.</p>
<p>Example: (1800/1200)<sup>4</sup> = (3/2)<sup>4</sup> = <b>5.06</b>, so a blackbody at 1800 K emits over five times as much energy per unit area as one at 1200 K.</p>
<h3>Observation 2: the peak shifts with temperature</h3>
<p>The peak moves to <b>higher frequencies (shorter wavelengths)</b> as T rises: a room-temperature object emits mostly <b>infrared</b>, a <b>red-hot</b> iron bar peaks in the visible red, a <b>white-hot</b> object emits across the whole visible spectrum. This is <b>Wien’s displacement law</b>:</p>
<div class="eq">ν<sub>max</sub> / T = a,   a ≈ 5.88 × 10<sup>10</sup> Hz/K</div>
<div class="eq">λ<sub>max</sub> T = b,   b ≈ 2.898 × 10<sup>−3</sup> m K</div>
<div class="note trap"><p><b>ν<sub>max</sub> ≠ c/λ<sub>max</sub></b>. Frequency and wavelength are related non-linearly, so the curves plotted against ν and against λ have different shapes and different peak positions.</p></div>
<div class="worked"><div class="given">A star emits most strongly at 480 nm. Find its surface temperature.</div><div class="solve"><p>T = b/λ<sub>max</sub> = 2.898 × 10<sup>−3</sup> / 480 × 10<sup>−9</sup>.</p></div><div class="result">T ≈ 6038 K (≈ 6025 K with the b = 2.892 × 10<sup>−3</sup> m K used in the course solution)</div></div>
<div class="worked"><div class="given">Total power radiated per unit area by a blackbody at 1200 K.</div><div class="solve"><p>P = σT<sup>4</sup> = 5.67 × 10<sup>−8</sup> × (1200)<sup>4</sup>.</p></div><div class="result">P ≈ 1.18 × 10<sup>5</sup> W m<sup>−2</sup></div></div>` },
        { title: 'Rayleigh–Jeans and the UV catastrophe', html: `
<div data-viz="planck-spectrum"></div>
<p class="lead"><b>Rayleigh and Jeans</b> used classical physics and statistical mechanics to derive the energy distribution:</p>
<div class="eq">u(ν) dν = <span class="frac"><span>8πk<sub>B</sub>T</span><span>c<sup>3</sup></span></span> ν<sup>2</sup> dν</div>
<p>ν: frequency; T: absolute temperature; k<sub>B</sub>: Boltzmann’s constant; c: speed of light.</p>
<ul>
<li>It works well at <b>low frequencies</b>.</li>
<li>Because u rises as <b>ν<sup>2</sup></b>, it predicts the energy becomes <b>infinite at high frequencies</b> (ultraviolet region), which experiments do not show.</li>
<li>This failure of classical physics is the <b>ultraviolet catastrophe</b>. It showed a new theory was needed.</li>
</ul>
<figure data-fig="m1-uv-catastrophe"></figure>
<p>The mismatch at 1500 K (classical formula predicting far too much energy at high frequency) was later seen as evidence for <b>Planck’s quantized energy exchange</b>.</p>
<div class="note exam"><p>"Explain the ultraviolet catastrophe with a diagram": draw the observed curve and the Rayleigh–Jeans curve shooting up, write the formula, say "fits at low ν, diverges as ν² at high ν", and that Planck’s law fixes it.</p></div>` },
        { title: 'Wien’s radiation law', html: `
<p class="lead"><b>Wilhelm Wien</b> proposed an <b>empirical</b> formula to fit the spectrum at <b>high frequencies</b>:</p>
<div class="eq">u(ν) dν = Aν<sup>3</sup> e<sup>−Bν/T</sup> dν</div>
<ul>
<li>A and B are constants found by fitting the data.</li>
<li>It fits well at <b>high frequencies (short wavelengths)</b> but <b>fails at low frequencies</b>: it <b>underestimates</b> the energy radiated in the infrared.</li>
<li>Planck later showed the constants are <b>A = 8πh/c<sup>3</sup></b> and <b>B = h/k<sub>B</sub></b>.</li>
</ul>
<table class="tbl"><thead><tr><th>Model</th><th>Valid at</th><th>Limitation</th></tr></thead><tbody>
<tr><td>Wien’s law</td><td>High frequencies (UV)</td><td>Fails at low frequencies.</td></tr>
<tr><td>Rayleigh–Jeans law</td><td>Low frequencies (IR)</td><td>Diverges at high frequencies (UV catastrophe).</td></tr>
<tr><td>Planck’s law</td><td>All frequencies</td><td>Matches experiment completely.</td></tr>
</tbody></table>
<p>In the <b>wavelength form</b>, Rayleigh–Jeans is valid at <b>long wavelengths</b> and Wien’s law at <b>short wavelengths</b>.</p>` }
      ],
      flashcards: [
        { front: 'What is a blackbody?', back: 'An ideal absorber that absorbs all incident radiation at every frequency (and, in equilibrium, emits at the same rate). Model: a cavity with a small hole.' },
        { front: 'What is the ultraviolet catastrophe?', back: 'Rayleigh–Jeans (u ∝ ν²T) predicts infinite energy at high frequencies, contradicting experiment: the failure of classical physics for blackbody radiation.' },
        { front: 'Wien’s displacement law (both forms)', back: 'ν<sub>max</sub>/T = 5.88 × 10<sup>10</sup> Hz/K; λ<sub>max</sub>T = 2.898 × 10<sup>−3</sup> m K.' },
        { front: 'Stefan–Boltzmann law', back: 'P = σT⁴ per unit area (σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴); in general P = εσT⁴.' },
        { front: 'Where does Wien’s radiation law fail?', back: 'At low frequencies (infrared): it underestimates the energy.' },
        { front: 'Is ν<sub>max</sub> = c/λ<sub>max</sub>?', back: 'No: the ν and λ curves have different shapes, so their peaks are not related by c = νλ.' },
        { front: 'Rayleigh–Jeans formula', back: 'u(ν)dν = (8πk<sub>B</sub>T/c³) ν² dν' }
      ],
      oneLiners: [
        'Blackbody spectrum shape depends only on temperature.',
        'Total energy density ∝ T⁴ (area under the curve).',
        'Red-hot iron peaks in the visible red; white-hot emits across the visible.',
        'Wien’s constants: A = 8πh/c³, B = h/k_B.'
      ],
      formulas: [
        { name: 'Stefan–Boltzmann', html: `P = εσT<sup>4</sup>`, note: 'σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴' },
        { name: 'Wien displacement', html: `λ<sub>max</sub>T = 2.898 × 10<sup>−3</sup> m K;  ν<sub>max</sub>/T = 5.88 × 10<sup>10</sup> Hz/K`, note: '' },
        { name: 'Rayleigh–Jeans', html: `u(ν)dν = (8πk<sub>B</sub>T/c<sup>3</sup>) ν<sup>2</sup> dν`, note: 'low ν only' },
        { name: 'Wien radiation law', html: `u(ν)dν = Aν<sup>3</sup>e<sup>−Bν/T</sup> dν`, note: 'high ν only' }
      ]
    },
    {
      id: 'm1-planck',
      title: 'Planck’s hypothesis and radiation formula',
      short: 'Planck’s hypothesis',
      blurb: 'Planck’s 1900 formula, the postulates of quantised energy exchange, and how it reduces to Wien and Rayleigh–Jeans in the two limits.',
      source: 'Module 1 notes §1.2.4',
      tabs: [
        { title: 'The formula', html: `
<p class="lead">In <b>1900</b> Max Planck proposed (he later called it a "<b>lucky guess</b>") a formula for the spectral energy density of blackbody radiation:</p>
<div class="eq">u(ν) dν = <span class="frac"><span>8πhν<sup>3</sup></span><span>c<sup>3</sup></span></span> · <span class="frac"><span>1</span><span>e<sup>hν/k<sub>B</sub>T</sup> − 1</span></span> dν</div>
<p>h = <b>6.626 × 10<sup>−34</sup> J s</b> is Planck’s constant. This formula:</p>
<ul>
<li><b>Matches experiment at all frequencies.</b></li>
<li><b>Reduces to Rayleigh–Jeans</b> at low frequencies.</li>
<li>Predicts <b>zero energy at very high frequencies</b>, solving the ultraviolet catastrophe.</li>
</ul>
<p>Planck received the <b>Nobel Prize in 1918</b> for the discovery of energy quanta. It was the <b>first step toward quantum theory</b>.</p>
<p>Both <b>Wien’s displacement law</b> (find the peak of the curve) and the <b>Stefan–Boltzmann law</b> (integrate over all frequencies) can be derived from Planck’s law.</p>
<div class="worked"><div class="solve"><div class="eq">U = ∫<sub>0</sub><sup>∞</sup> u(ν) dν = (8πh/c<sup>3</sup>) ∫<sub>0</sub><sup>∞</sup> ν<sup>3</sup> dν/(e<sup>hν/k<sub>B</sub>T</sup> − 1)</div><div class="eq">Put x = hν/k<sub>B</sub>T: U = (8πk<sub>B</sub><sup>4</sup>T<sup>4</sup>/h<sup>3</sup>c<sup>3</sup>) ∫<sub>0</sub><sup>∞</sup> x<sup>3</sup> dx/(e<sup>x</sup> − 1), and the integral is π<sup>4</sup>/15</div><div class="eq">U = (8π<sup>5</sup>k<sub>B</sub><sup>4</sup>/15h<sup>3</sup>c<sup>3</sup>) T<sup>4</sup> = 7.56 × 10<sup>−16</sup> T<sup>4</sup> J m<sup>−3</sup></div></div><div class="result"><p>U ∝ T<sup>4</sup>; the power per unit area (c/4)U = σT<sup>4</sup> with σ = 2π<sup>5</sup>k<sub>B</sub><sup>4</sup>/15h<sup>3</sup>c<sup>2</sup> = 5.67 × 10<sup>−8</sup> W m<sup>−2</sup> K<sup>−4</sup> (asked in CAT-1)</p></div></div>` },
        { title: 'Postulates', html: `
<p class="lead">Planck’s formula rests on the idea that energy is exchanged in <b>lumps</b>, not continuously.</p>
<ol>
<li><b>Energy exchange</b> between matter and radiation happens in <b>discrete units (quanta)</b>.</li>
<li>The energy of each quantum is <b>proportional to frequency: E = hν</b>.</li>
<li>The <b>oscillators</b> in the cavity walls can only have energies that are <b>integer multiples of hν</b> (0, hν, 2hν, …).</li>
<li>The probability of an energy state follows <b>Boltzmann statistics</b>: an oscillator is in a state of energy E with probability ∝ e<sup>−E/k<sub>B</sub>T</sup>. This weighting gives each oscillator’s average energy.</li>
</ol>
<div class="note why"><p>High-frequency oscillators need a large quantum hν to get excited. When hν ≫ k<sub>B</sub>T, the Boltzmann factor makes that very unlikely, so high frequencies carry almost no energy. That is how Planck kills the UV catastrophe.</p></div>` },
        { title: 'The two limits', html: `
<h3>High frequency (hν ≫ k<sub>B</sub>T) → Wien’s law</h3>
<ol class="steps">
<li><b>Exponential dominates</b> e<sup>hν/k<sub>B</sub>T</sup> ≫ 1, so e<sup>hν/k<sub>B</sub>T</sup> − 1 ≈ e<sup>hν/k<sub>B</sub>T</sup></li>
<li><b>Substitute</b> u(ν)dν ≈ (8πhν<sup>3</sup>/c<sup>3</sup>) e<sup>−hν/k<sub>B</sub>T</sup> dν</li>
<li><b>Compare</b> this is Wien’s law with A = 8πh/c<sup>3</sup>, B = h/k<sub>B</sub></li>
</ol>
<h3>Low frequency (hν ≪ k<sub>B</sub>T) → Rayleigh–Jeans</h3>
<ol class="steps">
<li><b>Taylor series</b> e<sup>x</sup> ≈ 1 + x + x<sup>2</sup>/2 + …, so e<sup>hν/k<sub>B</sub>T</sup> − 1 ≈ hν/k<sub>B</sub>T (terms of order (hν/k<sub>B</sub>T)<sup>2</sup> dropped)</li>
<li><b>Substitute</b> u(ν)dν ≈ (8πhν<sup>3</sup>/c<sup>3</sup>) · (k<sub>B</sub>T/hν) dν</li>
<li><b>Simplify</b> u(ν)dν = (8πν<sup>2</sup>k<sub>B</sub>T/c<sup>3</sup>) dν: the Rayleigh–Jeans law</li>
</ol>
<div class="note exam"><p>A 10-mark CAT question: "Write Planck’s formula and show under what condition it reduces to the Rayleigh–Jeans law; plot the spectra for T₁ &lt; T₂ &lt; T₃". Use the low-frequency steps above and the blackbody figure.</p></div>
<details class="more"><summary>Wavelength form (course exercise)</summary><p>With ν = c/λ, |dν| = (c/λ<sup>2</sup>) dλ (the minus sign is dropped since energy density is positive). Planck: u(λ)dλ = (8πhc/λ<sup>5</sup>) · 1/(e<sup>hc/λk<sub>B</sub>T</sup> − 1) dλ. Rayleigh–Jeans: u(λ)dλ = (8πk<sub>B</sub>T/λ<sup>4</sup>) dλ. Wien: u(λ)dλ = (8πhc/λ<sup>5</sup>) e<sup>−hc/λk<sub>B</sub>T</sup> dλ.</p></details>` },
        { title: 'Numerical: tuning fork vs atom', html: `
<div class="worked"><div class="given">Compare the energy quanta of (a) a 660 Hz tuning fork and (b) an atomic oscillator emitting orange light of 5.00 × 10<sup>14</sup> Hz. The fork’s total vibrational energy is 0.04 J. Is quantisation significant for the fork?</div>
<div class="solve"><p>(a) E = hν = 6.626 × 10<sup>−34</sup> × 660 = 4.37 × 10<sup>−31</sup> J.</p><p>(b) E = 6.626 × 10<sup>−34</sup> × 5.00 × 10<sup>14</sup> = 3.31 × 10<sup>−19</sup> J ≈ 2.07 eV.</p><p>Number of quanta in the fork: 0.04 / 4.37 × 10<sup>−31</sup> ≈ 9.1 × 10<sup>28</sup>.</p></div>
<div class="result">The fork’s quantum is far too small to notice: its energy changes in steps of one part in about 10<sup>29</sup>, so it looks continuous. For the atom, one quantum (≈ 2 eV) is the whole energy change, so quantisation matters.</div></div>` }
      ],
      flashcards: [
        { front: 'Planck’s radiation formula', back: 'u(ν)dν = (8πhν³/c³) · 1/(e<sup>hν/k<sub>B</sub>T</sup> − 1) dν' },
        { front: 'Postulates of Planck’s hypothesis', back: 'Energy exchanged in quanta; E = hν; oscillator energies are integer multiples of hν; occupation follows Boltzmann statistics (∝ e<sup>−E/k<sub>B</sub>T</sup>).' },
        { front: 'Planck’s formula at hν ≪ k<sub>B</sub>T', back: 'e<sup>x</sup> − 1 ≈ x → Rayleigh–Jeans: u = 8πν²k<sub>B</sub>T/c³.' },
        { front: 'Planck’s formula at hν ≫ k<sub>B</sub>T', back: 'e<sup>x</sup> − 1 ≈ e<sup>x</sup> → Wien’s law: u = (8πhν³/c³)e<sup>−hν/k<sub>B</sub>T</sup>.' },
        { front: 'Value of Planck’s constant', back: 'h = 6.626 × 10⁻³⁴ J s' },
        { front: 'Why is quantisation not noticed for a tuning fork?', back: 'Its quantum hν ≈ 4.4 × 10⁻³¹ J is about 10⁻²⁹ of its 0.04 J energy, so the steps are invisibly small.' }
      ],
      oneLiners: [
        'Planck, 1900; Nobel Prize 1918.',
        'Wien’s displacement law comes from the peak, Stefan–Boltzmann from integrating Planck’s law.',
        'Planck’s law predicts zero energy at very high ν.'
      ],
      formulas: [
        { name: 'Planck radiation law', html: `u(ν)dν = (8πhν<sup>3</sup>/c<sup>3</sup>) · 1/(e<sup>hν/k<sub>B</sub>T</sup> − 1) dν`, note: '' },
        { name: 'Energy quantum', html: `E = nhν,  n = 0, 1, 2, …`, note: 'oscillator energies' }
      ]
    },
    {
      id: 'm1-de-broglie',
      title: 'de Broglie hypothesis: matter waves',
      short: 'de Broglie hypothesis',
      blurb: 'λ = h/p for material particles, its relativistic and non-relativistic forms, the accelerated electron, and worked numericals.',
      source: 'Module 1 notes §1.3; M1 numericals',
      tabs: [
        { title: 'The hypothesis', html: `
<p class="lead">Planck and Einstein showed waves have particle properties. <b>Louis de Broglie (1924)</b> asked the reverse: do particles have wave properties? He proposed that <b>λ = h/p</b> is completely general and applies to <b>material particles</b> as well as photons.</p>
<div class="eq">λ = <span class="frac"><span>h</span><span>p</span></span> = <span class="frac"><span>h</span><span>mv</span></span></div>
<ul>
<li>The wavelength of a particle of momentum p is its <b>de Broglie wavelength</b>; the waves are called <b>matter waves</b>.</li>
<li>Everyday objects have <b>tiny</b> de Broglie wavelengths, so their wave nature is hard to see. <b>Electrons</b> have a tiny mass, so their wavelengths are relatively large and their wave behaviour is easy to detect.</li>
<li>De Broglie had no direct evidence at first, but his idea naturally explained why <b>atomic energy levels are restricted</b> to certain values, which <b>Bohr (1913)</b> had to simply postulate.</li>
<li>A few years later, <b>electrons passing through crystals produced diffraction patterns</b>, just like waves, confirming λ = h/p.</li>
</ul>` },
        { title: 'Relativistic and non-relativistic forms', html: `
<p class="lead">Start from E<sup>2</sup> = p<sup>2</sup>c<sup>2</sup> + m<sup>2</sup>c<sup>4</sup>, so p = √((E − mc<sup>2</sup>)(E + mc<sup>2</sup>)) / c, and</p>
<div class="eq">λ = <span class="frac"><span>hc</span><span>√((E − mc<sup>2</sup>)(E + mc<sup>2</sup>))</span></span></div>
<h3>Ultra-relativistic limit (E ≫ mc<sup>2</sup>)</h3>
<p>Neglect the mass term: <b>λ ≈ hc/E</b>, exactly the photon result. This makes sense: a photon is massless and always moves at c (mc<sup>2</sup> = 0).</p>
<h3>Non-relativistic limit (E<sub>K</sub> ≪ mc<sup>2</sup>)</h3>
<p>The total energy is E ≈ mc<sup>2</sup> + E<sub>K</sub> with <b>E<sub>K</sub> = p<sup>2</sup>/2m</b>, so <b>p = √(2mE<sub>K</sub>)</b> and</p>
<div class="eq">λ = <span class="frac"><span>h</span><span>√(2mE<sub>K</sub>)</span></span></div>
<details class="more"><summary>Why E ≈ mc² + p²/2m</summary><p>E = √(m<sup>2</sup>c<sup>4</sup> + p<sup>2</sup>c<sup>2</sup>) = mc<sup>2</sup>√(1 + p<sup>2</sup>/m<sup>2</sup>c<sup>2</sup>). For p ≪ mc use √(1 + ε) ≈ 1 + ε/2 with ε = p<sup>2</sup>/m<sup>2</sup>c<sup>2</sup>: E ≈ mc<sup>2</sup>(1 + p<sup>2</sup>/2m<sup>2</sup>c<sup>2</sup>) = mc<sup>2</sup> + p<sup>2</sup>/2m, and the second term is the classical kinetic energy ½mv<sup>2</sup>.</p></details>
<h3>Electron accelerated through a potential V</h3>
<p>It gains kinetic energy <b>E<sub>K</sub> = eV</b>, so (non-relativistic):</p>
<div class="eq">λ = <span class="frac"><span>h</span><span>√(2m<sub>e</sub>eV)</span></span> ≈ <span class="frac"><span>12.27</span><span>√V</span></span> Å</div>
<p>For any charge q: λ = h/√(2mqV).</p>` },
        { title: 'Numericals', html: `
<div class="worked"><div class="given">de Broglie wavelengths of (a) a 46 g golf ball at 30 m/s and (b) an electron at 10<sup>7</sup> m/s. Find their ratio.</div>
<div class="solve"><p>(a) λ = h/mv = 6.626 × 10<sup>−34</sup> / (0.046 × 30) = 4.80 × 10<sup>−34</sup> m.</p><p>(b) λ = 6.626 × 10<sup>−34</sup> / (9.1 × 10<sup>−31</sup> × 10<sup>7</sup>) = 7.28 × 10<sup>−11</sup> m.</p><p>Ratio λ<sub>e</sub>/λ<sub>ball</sub> = 1.5 × 10<sup>23</sup>.</p></div>
<div class="result">The ball’s wavelength is far smaller than any nucleus, so it never shows wave effects; the electron’s (0.73 Å) is comparable to atomic spacings, so electrons diffract in crystals.</div></div>
<div class="worked"><div class="given">An electron is accelerated through 150 V. Find its de Broglie wavelength.</div>
<div class="solve"><p>λ = h/√(2m<sub>e</sub>eV) = 6.63 × 10<sup>−34</sup> / √(2 × 9.1 × 10<sup>−31</sup> × 1.6 × 10<sup>−19</sup> × 150) = 6.63 × 10<sup>−34</sup> / 6.61 × 10<sup>−24</sup>.</p></div>
<div class="result">λ ≈ 1.0 × 10<sup>−10</sup> m (1 Å)</div></div>
<div class="note heads-up"><p>The course solution prints 0.998 × 10<sup>−10</sup> m (from 12.23/√V); the direct calculation gives 1.003 × 10<sup>−10</sup> m. Both round to 1.0 Å.</p></div>
<div class="worked"><div class="given">de Broglie wavelength of a proton accelerated through 5 kV (m<sub>p</sub> = 1.67 × 10<sup>−27</sup> kg).</div>
<div class="solve"><p>λ = 6.63 × 10<sup>−34</sup> / √(2 × 1.67 × 10<sup>−27</sup> × 1.6 × 10<sup>−19</sup> × 5000).</p></div>
<div class="result">λ ≈ 4.05 × 10<sup>−13</sup> m</div></div>
<div class="worked"><div class="given">Electrons accelerated through 150 V hit a double slit with d = 100 μm. At what angle is the first-order maximum?</div>
<div class="solve"><p>λ = 12.27/√150 Å ≈ 1.00 × 10<sup>−10</sup> m. sin θ = λ/d = 1.00 × 10<sup>−10</sup> / 100 × 10<sup>−6</sup> = 1.0 × 10<sup>−6</sup>.</p></div>
<div class="result">θ ≈ 5.7 × 10<sup>−5</sup> degrees (tiny: electron fringes need very narrow slits)</div></div>
<div class="note heads-up"><p>The course solution writes sin θ = 0.01223 × 10<sup>−4</sup> and θ = 7 × 10<sup>−5</sup>°: it left √150 out of the denominator. With √150 included, θ ≈ 5.7 × 10<sup>−5</sup>°.</p></div>` }
      ],
      flashcards: [
        { front: 'de Broglie relation', back: 'λ = h/p = h/mv: every moving particle has a wavelength (de Broglie, 1924).' },
        { front: 'de Broglie wavelength of an electron accelerated through V', back: 'λ = h/√(2m<sub>e</sub>eV) ≈ 12.27/√V Å' },
        { front: 'Non-relativistic de Broglie wavelength in terms of kinetic energy', back: 'λ = h/√(2mE<sub>K</sub>)' },
        { front: 'Ultra-relativistic de Broglie wavelength', back: 'λ ≈ hc/E (same as a photon) when E ≫ mc².' },
        { front: 'What experiment confirmed matter waves?', back: 'Electrons passing through crystals gave diffraction patterns.' },
        { front: 'Why don’t we see the wave nature of a golf ball?', back: 'λ = h/mv ≈ 10⁻³⁴ m, far too small to observe; electrons (small m) have λ ~ 1 Å.' }
      ],
      oneLiners: [
        'de Broglie explained Bohr’s quantised atomic levels, which Bohr (1913) had only postulated.',
        'Relativistic: λ = hc/√((E − mc²)(E + mc²)).',
        'An electron gains kinetic energy eV when accelerated through a potential V.'
      ],
      formulas: [
        { name: 'de Broglie wavelength', html: `λ = h/p = h/√(2mE<sub>K</sub>)`, note: '' },
        { name: 'Accelerated charge', html: `λ = h/√(2mqV);  electron: 12.27/√V Å`, note: '' },
        { name: 'Relativistic', html: `λ = hc/√((E − mc<sup>2</sup>)(E + mc<sup>2</sup>))`, note: '' }
      ]
    },
    {
      id: 'm1-wavefunction',
      title: 'The wavefunction',
      short: 'Wavefunction',
      blurb: 'What waves in a matter wave, Born’s probability interpretation, conditions for a well-behaved wavefunction, normalisation, superposition, the double slit with electrons, and a first look at the Schrödinger equation.',
      source: 'Module 1 notes §1.4',
      tabs: [
        { title: 'Meaning of Ψ', html: `
<p class="lead">In water waves the height changes, in sound the pressure, in light the electric and magnetic fields. In a <b>matter wave</b>, the quantity that varies is the <b>wavefunction Ψ</b> (capital psi) or ψ.</p>
<ul>
<li>Ψ is in general <b>complex-valued</b> and depends on <b>position and time</b>, Ψ(r, t).</li>
<li>Its value at a point is related to the <b>chance of finding the particle</b> there at that time.</li>
<li>The wavefunction <b>determines the state</b> of the particle: all the information about it at one time. If we know Ψ at some time t₀, the laws of physics give it at all later times.</li>
<li>Classically the state is the <b>position r and velocity v</b>; Newton’s law F = m d<sup>2</sup>r/dt<sup>2</sup> then gives r(t) and v(t) for all time. In quantum mechanics Ψ plays this role.</li>
</ul>
<h3>Born’s interpretation (1926)</h3>
<p><b>|Ψ|<sup>2</sup> = Ψ*Ψ</b> (Ψ* is the complex conjugate) is the <b>probability density</b> P(r, t): how likely we are to find the particle at a point at a given time. The probability of finding it in a small volume dV around r is <b>P(r, t) dV</b>.</p>
<ul>
<li>Large |Ψ|<sup>2</sup>: high chance; small |Ψ|<sup>2</sup>: low chance; as long as |Ψ|<sup>2</sup> ≠ 0 there is some chance.</li>
<li>Ψ is the <b>probability amplitude</b>; |Ψ|<sup>2</sup> is the <b>probability density</b>.</li>
<li>Even if Ψ is spread out, the <b>particle is not</b>: a measurement always finds the <b>whole particle at one point</b>. You never detect 20% of an electron, but there can be a 20% chance of finding the whole electron somewhere.</li>
</ul>` },
        { title: 'Well-behaved wavefunction', html: `
<p class="lead">A wavefunction can represent a physical state only if it satisfies these conditions.</p>
<ol>
<li><b>Single-valued</b>: at each (x, t), Ψ gives one unique complex number, so probabilities are well defined.</li>
<li><b>Finite and continuous</b>: it cannot blow up to infinity or jump suddenly; otherwise it would not represent a physical state.</li>
<li><b>dΨ/dx continuous</b>, except possibly where the potential has a sharp change (an infinite jump). This keeps the probability flow smooth and agrees with the Schrödinger equation.</li>
<li><b>Vanishes at infinity</b>: Ψ → 0 as x → ±∞; otherwise the particle would have a non-zero chance of being infinitely far away.</li>
<li><b>Normalisable</b>: the total probability of finding the particle somewhere is 1: ∫<sub>−∞</sub><sup>∞</sup> |Ψ(x, t)|<sup>2</sup> dx = 1. This is needed to read |Ψ|<sup>2</sup> as a probability density.</li>
</ol>
<div class="note exam"><p>CAT: "Write three conditions for well-behaved wavefunctions and explain the significance of probability density" (5 marks). Give any three conditions with their reasons, then Born’s |Ψ|<sup>2</sup>dV meaning.</p></div>` },
        { title: 'Normalisation', html: `
<p class="lead">Total probability must be 1, so a valid Ψ satisfies the <b>normalisation condition</b>:</p>
<div class="eq">∫<sub>V</sub> |Ψ(r, t)|<sup>2</sup> d<sup>3</sup>r = 1</div>
<p>It says the particle exists <b>somewhere with 100% probability</b>. Wavefunctions satisfying it are <b>normalised</b>.</p>
<ul>
<li>If instead ∫|Ψ|<sup>2</sup> d<sup>3</sup>r = N with N <b>finite</b>, Ψ is <b>normalisable</b> (square-integrable). It must go to zero fast enough as |r| → ∞.</li>
<li>Then <b>Ψ′ = Ψ/√N</b> is normalised: ∫|Ψ′|<sup>2</sup> d<sup>3</sup>r = 1.</li>
</ul>
<div class="worked"><div class="given">Normalise Ψ(x) = A e<sup>−x²</sup> on (−∞, ∞). Use ∫e<sup>−x²</sup>dx = √π.</div>
<div class="solve"><p>∫|A|<sup>2</sup>e<sup>−2x²</sup>dx = 1. Put x = u/√2: ∫e<sup>−2x²</sup>dx = √π/√2 = √(π/2).</p><p>|A|<sup>2</sup>√(π/2) = 1 → A = (2/π)<sup>1/4</sup>.</p></div>
<div class="result">A = (2/π)<sup>1/4</sup> ≈ 0.893</div></div>
<div class="worked"><div class="given">Normalise Ψ(x) = A x(1 − x) on [0, 1].</div>
<div class="solve"><p>∫<sub>0</sub><sup>1</sup> x<sup>2</sup>(1 − x)<sup>2</sup> dx = ∫(x<sup>2</sup> − 2x<sup>3</sup> + x<sup>4</sup>)dx = 1/3 − 1/2 + 1/5 = 1/30.</p><p>|A|<sup>2</sup>/30 = 1.</p></div>
<div class="result">A = √30 ≈ 5.48</div></div>
<h3>Dimensions of ψ</h3>
<p>Since |ψ|<sup>2</sup>d<sup>n</sup>r must be dimensionless: in <b>1D [ψ] = length<sup>−1/2</sup></b>, in <b>2D length<sup>−1</sup></b>, in <b>3D length<sup>−3/2</sup></b>.</p>` },
        { title: 'Superposition and the double slit', html: `
<div data-viz="double-slit"></div>
<p class="lead"><b>Superposition principle</b>: if Ψ₁ describes one situation and Ψ₂ another, and both are equally possible, the total wavefunction is <b>Ψ = Ψ₁ + Ψ₂</b>.</p>
<p>Classically you add <b>probabilities</b>. In quantum mechanics you add the <b>wavefunctions first</b> and then square: P = |Ψ|<sup>2</sup>. This produces <b>interference</b>, impossible if probabilities were added directly.</p>
<figure data-fig="m1-double-slit-particles"></figure>
<h3>Classical particles (tennis balls)</h3>
<ul>
<li>Balls are thrown randomly at a wall with two openings; some pass and reach the detector.</li>
<li>Only the top slit open: distribution <b>P₁</b>. Only the bottom slit: <b>P₂</b>, the same shape shifted down.</li>
<li>Both open: simply <b>P₁₂ = P₁ + P₂</b>. No interference.</li>
</ul>
<h3>Quantum particles (electrons)</h3>
<ul>
<li>With one slit open, the result is much like the classical case.</li>
<li>With both slits open (and small enough), each electron still arrives as a <b>single dot</b>, never a spread-out wave.</li>
<li>After many electrons the dots build up an <b>interference pattern</b>. Hitachi’s experiment showed the build-up from 8, 270, 2000 to 160,000 electrons.</li>
<li>At some points <b>fewer electrons arrive with both slits open than with one</b>: impossible classically. Each electron seems to "know" both slits are open, even when sent one at a time.</li>
</ul>
<div class="eq">Ψ₁₂ = Ψ₁ + Ψ₂  ⇒  P₁₂ = |Ψ₁|<sup>2</sup> + |Ψ₂|<sup>2</sup> + Ψ₁*Ψ₂ + Ψ₂*Ψ₁</div>
<p>The last two are the <b>interference terms</b>, so <b>P₁₂ ≠ P₁ + P₂</b>. They create the fringes.</p>
<div class="note exam"><p>CAT: "Explain the double slit experiment for classical and quantum particles with a diagram" (5 marks). Draw both distributions, write P₁₂ = P₁ + P₂ vs P₁₂ = |Ψ₁ + Ψ₂|<sup>2</sup>, and name the interference terms.</p></div>` },
        { title: 'First look at the Schrödinger equation', html: `
<p class="lead">Classically, Newton’s second law <b>F = m d<sup>2</sup>r/dt<sup>2</sup></b> gives the motion. In quantum mechanics the rule for how ψ changes in time is the <b>Schrödinger equation</b>.</p>
<div class="eq" data-label="1D, time dependent">iℏ ∂ψ(x, t)/∂t = −(ℏ<sup>2</sup>/2m) ∂<sup>2</sup>ψ(x, t)/∂x<sup>2</sup> + V(x) ψ(x, t)</div>
<ul>
<li><b>ℏ = h/2π</b>: reduced Planck constant; m: mass; V(x): potential energy at x.</li>
<li>In 3D: iℏ ∂ψ/∂t = −(ℏ<sup>2</sup>/2m)∇<sup>2</sup>ψ + V(r)ψ, with the <b>Laplacian ∇<sup>2</sup> = ∂<sup>2</sup>/∂x<sup>2</sup> + ∂<sup>2</sup>/∂y<sup>2</sup> + ∂<sup>2</sup>/∂z<sup>2</sup></b>.</li>
<li>It plays the same role in quantum mechanics as <b>Newton’s equation of motion</b> in classical mechanics: it tells us how the state <b>evolves in time</b>. Module 3 works with it in detail.</li>
</ul>` }
      ],
      flashcards: [
        { front: 'Born’s interpretation of Ψ', back: '|Ψ|² = Ψ*Ψ is the probability density; |Ψ|²dV is the probability of finding the particle in dV (Born, 1926).' },
        { front: 'Conditions for a well-behaved wavefunction', back: 'Single-valued; finite and continuous; dΨ/dx continuous (except at infinite potential jumps); Ψ → 0 at ±∞; normalisable (∫|Ψ|²dx = 1).' },
        { front: 'Normalisation condition', back: '∫|Ψ|² d³r = 1. If the integral is N (finite), Ψ/√N is normalised.' },
        { front: 'Why does the double slit with electrons give fringes?', back: 'Wavefunctions add: P₁₂ = |Ψ₁ + Ψ₂|² contains interference terms Ψ₁*Ψ₂ + Ψ₂*Ψ₁, so P₁₂ ≠ P₁ + P₂.' },
        { front: 'Dimension of ψ in 1D, 2D, 3D', back: 'length<sup>−1/2</sup>, length<sup>−1</sup>, length<sup>−3/2</sup>' },
        { front: 'Normalisation constant for A e<sup>−x²</sup>', back: 'A = (2/π)<sup>1/4</sup>' },
        { front: 'Time-dependent Schrödinger equation (1D)', back: 'iℏ ∂ψ/∂t = −(ℏ²/2m) ∂²ψ/∂x² + Vψ' },
        { front: 'Do we ever detect part of an electron?', back: 'No: the whole particle is found at one point; Ψ only gives the probability of where.' }
      ],
      oneLiners: [
        'Ψ is complex; only |Ψ|² is a probability density.',
        'Hitachi double slit: 8 → 270 → 2000 → 160,000 electrons build the fringes.',
        'Classical: add probabilities. Quantum: add amplitudes, then square.',
        'The Schrödinger equation is the quantum counterpart of Newton’s second law.'
      ],
      formulas: [
        { name: 'Probability', html: `P = |Ψ|<sup>2</sup> dV,  ∫|Ψ|<sup>2</sup>d<sup>3</sup>r = 1`, note: '' },
        { name: 'Interference of amplitudes', html: `P₁₂ = |Ψ₁ + Ψ₂|<sup>2</sup> = P₁ + P₂ + Ψ₁*Ψ₂ + Ψ₂*Ψ₁`, note: '' },
        { name: 'TDSE (1D)', html: `iℏ ∂ψ/∂t = −(ℏ<sup>2</sup>/2m) ∂<sup>2</sup>ψ/∂x<sup>2</sup> + V(x)ψ`, note: 'ℏ = h/2π' }
      ]
    },
    {
      id: 'm1-stern-gerlach',
      title: 'The Stern–Gerlach experiment',
      short: 'Stern–Gerlach',
      blurb: 'Silver atoms through a non-uniform magnetic field split into exactly two spots: the discovery of quantised intrinsic spin.',
      source: 'Module 1 notes §1.5',
      tabs: [
        { title: 'Set-up', html: `
<p class="lead">Performed by <b>Otto Stern and Walther Gerlach in 1922</b>, it shows another strange quantum feature: <b>spin</b>.</p>
<ol class="steps">
<li><b>Oven</b> silver is heated in an oven to make a beam of silver atoms.</li>
<li><b>Collimation</b> the atoms come out through a small hole and form a narrow beam.</li>
<li><b>Non-uniform field</b> the beam passes between magnet poles where the magnetic field <b>varies with position</b> (mostly along z).</li>
<li><b>Detection</b> the atoms hit a screen or detector.</li>
</ol>
<figure data-fig="m1-stern-gerlach"></figure>` },
        { title: 'Magnetic moment and force', html: `
<p class="lead">A current loop or bar magnet has a <b>magnetic moment</b>, which measures how strongly it interacts with a magnetic field.</p>
<div class="eq">μ = I A</div>
<p>I: current in the loop; A: area vector (direction by the right-hand rule). The moment tries to <b>align with an external field</b>, like a compass needle with Earth’s field.</p>
<p>Electrons are not loops of wire, yet they behave as if they have a magnetic moment, linked to an intrinsic property called <b>spin S</b>:</p>
<div class="eq">μ = −g <span class="frac"><span>e</span><span>2m</span></span> S,   g ≈ 2 (g-factor)</div>
<p>The energy of a magnetic moment in a field B is:</p>
<div class="eq">E = −μ · B</div>
<ul>
<li>Moments along or against the field have <b>different energies</b>, so atoms get <b>deflected differently</b>.</li>
<li>The <b>force</b> comes from how the field <b>changes with position</b> (the gradient of B). A uniform field only twists a moment; a <b>non-uniform</b> field pushes it up or down.</li>
</ul>` },
        { title: 'Result and meaning', html: `
<div data-viz="sg-experiment"></div>
<div class="vs"><div class="side"><h4>Expected classically</h4><p>An electron as a tiny spinning charged ball has a magnetic moment. Atoms are <b>randomly oriented</b>, so deflections take <b>all values</b>: a <b>continuous smear</b> on the screen.</p></div><div class="side"><h4>Observed</h4><p>The beam splits into <b>exactly two spots</b>, one above and one below the centre line. Classical physics cannot explain this.</p></div></div>
<p>So the spin component along the field takes only <b>two values</b>, "up" and "down":</p>
<div class="eq">S<sub>z</sub> = +ℏ/2  or  S<sub>z</sub> = −ℏ/2</div>
<h3>What it means</h3>
<ul>
<li>Electrons (and other particles) have an <b>intrinsic angular momentum called spin</b>.</li>
<li>Spin is a <b>quantum property</b>: it does not come from the electron spinning like a ball.</li>
<li>Spin components are <b>quantised</b>: only discrete outcomes, no in-between values.</li>
<li>Measuring along z gives ±ℏ/2; measuring along x again gives two outcomes, <b>S<sub>x</sub> = ±ℏ/2</b>.</li>
<li>This idea, that measurements give only certain allowed values, is <b>quantisation</b>.</li>
</ul>
<h3>Why it matters</h3>
<ul>
<li>It clearly shows the <b>need for quantum mechanics</b>.</li>
<li>It is a real <b>two-state quantum system</b>, the basic idea behind <b>qubits</b> in quantum computing (Module 5).</li>
<li>It helps us understand how <b>measurement</b> works in quantum theory (sequential Stern–Gerlach, Module 3).</li>
</ul>
<div class="note exam"><p>CAT: "Explain briefly how the Stern–Gerlach experiment led to the discovery of intrinsic spin angular momentum" (5 marks). Diagram, classical expectation vs two spots, S<sub>z</sub> = ±ℏ/2, conclusion: spin is intrinsic and quantised.</p></div>` }
      ],
      flashcards: [
        { front: 'What did the Stern–Gerlach experiment show?', back: 'A beam of silver atoms in a non-uniform B field splits into exactly two spots: spin is intrinsic and quantised, S<sub>z</sub> = ±ℏ/2.' },
        { front: 'Why must the field be non-uniform?', back: 'The force on a magnetic moment comes from the field gradient; a uniform field gives torque but no net deflection.' },
        { front: 'Classical expectation in Stern–Gerlach', back: 'Randomly oriented moments → a continuous smear on the screen.' },
        { front: 'Electron magnetic moment and spin', back: 'μ = −g(e/2m)S with g ≈ 2; energy E = −μ·B.' },
        { front: 'Who and when?', back: 'Otto Stern and Walther Gerlach, 1922, silver atoms.' },
        { front: 'Why is Stern–Gerlach important for quantum computing?', back: 'It is a real two-state quantum system, the idea behind a qubit.' }
      ],
      oneLiners: [
        'Magnetic moment of a loop: μ = IA.',
        'S_x measurement also gives ±ℏ/2.',
        'Spin is not the electron physically rotating.'
      ],
      formulas: [
        { name: 'Spin magnetic moment', html: `μ = −g(e/2m)S,  E = −μ·B`, note: 'g ≈ 2' },
        { name: 'Spin component', html: `S<sub>z</sub> = ±ℏ/2`, note: '' }
      ]
    }
  ],
  figures: [
    { id: 'm1-em-wave', src: 'pages/vtop__FALL2026-27_Lecture-notes-Module-1/p02.png', crop: null, caption: 'An EM wave: electric and magnetic fields oscillate at right angles to each other and to the direction of travel.', alt: 'A sine wave for the electric field drawn vertically and a smaller sine wave for the magnetic field, both along the x axis.' },
    { id: 'm1-interference', src: 'pages/vtop__FALL2026-27_Lecture-notes-Module-1/p04.png', crop: null, caption: 'Waves in phase add to a bigger wave; waves half a cycle out of phase cancel.', alt: 'Two panels. Top: two in-phase waves and their larger sum. Bottom: two opposite-phase waves and a flat sum.' },
    { id: 'm1-ydse', src: 'pages/vtop__FALL2026-27_Lecture-notes-Module-1/p04.png', crop: null, caption: 'Young’s double slit: waves from S₁ and S₂ overlap and make bright and dark fringes on the screen.', alt: 'A light source, a barrier with two slits S1 and S2, circular wavefronts from each slit, and a screen with an intensity curve of alternating maxima.' },
    { id: 'm1-blackbody', src: 'pages/vtop__FALL2026-27_Lecture-notes-Module-1/p05.png', crop: null, caption: 'Blackbody spectra at 1200, 1500 and 1800 K (computed from Planck’s law). Hotter curves lie above cooler ones and peak at higher frequency.', alt: 'Three curves of energy density against frequency; the 1800 K curve is highest with its peak furthest right.' },
    { id: 'm1-uv-catastrophe', src: 'pages/vtop__FALL2026-27_Lecture-notes-Module-1/p07.png', crop: null, caption: 'At 1500 K the classical Rayleigh–Jeans curve rises without limit while the observed (Planck) curve falls back to zero.', alt: 'A dashed rising parabola labelled Rayleigh-Jeans and a hump-shaped curve labelled Planck equals experiment.' },
    { id: 'm1-compton', src: 'pages/vtop__FALL2026-27_Lecture-notes-Module-1/p11.png', crop: null, caption: 'Compton scattering: the photon gives some momentum to a free electron and leaves with a longer wavelength.', alt: 'An incoming wavy photon hits an electron at rest; a scattered photon leaves at angle theta above the axis and the electron recoils at angle phi below.' },
    { id: 'm1-double-slit-particles', src: 'pages/vtop__FALL2026-27_Lecture-notes-Module-1/p16.png', crop: null, caption: 'Classical particles give P₁ + P₂; electrons give an interference pattern because their amplitudes add.', alt: 'Top: two dashed humps and their smooth sum. Bottom: the same dashed humps and a fringe pattern with many peaks.' },
    { id: 'm1-stern-gerlach', src: 'pages/vtop__FALL2026-27_Lecture-notes-Module-1/p20.png', crop: null, caption: 'Stern–Gerlach: silver atoms in a non-uniform field split into two spots, not the smear classical physics expects.', alt: 'An oven, a slit, a wedge-shaped N pole above a flat S pole, two diverging beam paths and a screen with two spots labelled Sz = +h-bar/2 and -h-bar/2.' }
  ]
});
