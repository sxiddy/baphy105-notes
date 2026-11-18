// Actual papers (questions only), the index and which topics were asked. Answers and the "asked in" detail are in
// papers-pro.js. Generated from the typed papers; src/PAPER-MAP.md lists every paper and question.
PAPERS({
  index: [
    { id: "cat1-f1", kind: 'actual', exam: "cat1", title: "CAT-1 · Slot F1+TF1 · 14-08-2026", sub: "Actual paper · Fall 2026–27" },
    { id: "cat1-c1", kind: 'actual', exam: "cat1", title: "CAT-1 · Slot C1+TC1 · 29-01-2026", sub: "Actual paper · Winter 2025–26 · with answer key" },
    { id: "cat2-f1", kind: 'actual', exam: "cat2", title: "CAT-2 · Slot F1+TF1 · 03-10-2026", sub: "Actual paper · Fall 2026–27 · open book" },
    { id: "cat2-f2", kind: 'actual', exam: "cat2", title: "CAT-2 · Slot F2+TF2 · 22-03-2026", sub: "Actual paper · Winter 2025–26 · open book · with answer key" },
    { id: "fat-c1", kind: 'actual', exam: "fat", title: "FAT · Slot C1+TC1 · April 2026", sub: "Actual paper · Winter 2025–26 · all modules" }  ],

  asked: {
    "m1-blackbody": [{ paper: "cat1-f1" }, { paper: "cat1-c1" }, { paper: "fat-c1" }],
    "m1-de-broglie": [{ paper: "cat1-f1" }],
    "m1-dual-nature": [{ paper: "cat1-f1" }, { paper: "cat1-c1" }, { paper: "fat-c1" }],
    "m1-planck": [{ paper: "cat1-f1" }, { paper: "cat1-c1" }, { paper: "fat-c1" }],
    "m1-stern-gerlach": [{ paper: "cat1-f1" }, { paper: "fat-c1" }],
    "m1-wavefunction": [{ paper: "cat1-f1" }, { paper: "cat1-c1" }, { paper: "fat-c1" }],
    "m1-ydse": [],
    "m2-basis": [{ paper: "cat1-c1" }],
    "m2-dirac": [{ paper: "cat2-f1" }, { paper: "cat2-f2" }],
    "m2-eigen": [{ paper: "cat2-f2" }],
    "m2-hermitian": [{ paper: "cat2-f2" }, { paper: "fat-c1" }],
    "m2-orthonormal": [{ paper: "cat1-c1" }, { paper: "cat2-f1" }],
    "m2-outer": [{ paper: "cat2-f1" }],
    "m2-pauli": [{ paper: "cat2-f1" }, { paper: "fat-c1" }],
    "m2-tensor": [{ paper: "cat1-c1" }, { paper: "cat2-f1" }, { paper: "fat-c1" }],
    "m2-vector-space": [{ paper: "cat1-c1" }],
    "m3-expectation": [{ paper: "cat2-f1" }, { paper: "cat2-f2" }, { paper: "fat-c1" }],
    "m3-measurement": [{ paper: "cat1-f1" }, { paper: "cat2-f1" }, { paper: "fat-c1" }],
    "m3-observables": [{ paper: "cat2-f1" }, { paper: "cat2-f2" }, { paper: "fat-c1" }],
    "m3-seq-sg": [{ paper: "cat2-f1" }, { paper: "fat-c1" }],
    "m3-tise": [{ paper: "cat2-f2" }],
    "m4-box1d": [{ paper: "cat2-f2" }, { paper: "fat-c1" }],
    "m4-numericals": [{ paper: "fat-c1" }],
    "m4-tunnel-prob": [{ paper: "fat-c1" }],
    "m4-tunnelling": [{ paper: "fat-c1" }],
    "m5-bell": [{ paper: "fat-c1" }],
    "m5-bell-gen": [{ paper: "fat-c1" }],
    "m5-bloch": [{ paper: "fat-c1" }],
    "m5-entanglement": [{ paper: "fat-c1" }],
    "m5-pauli-h": [{ paper: "fat-c1" }],
    "m5-qubits": [],
    "m5-two-qubit": [{ paper: "cat2-f1" }, { paper: "fat-c1" }]
  },

  papers: [
    {
      id: "cat1-f1", kind: 'actual', exam: "cat1", title: "CAT-1 · Slot F1+TF1 · 14-08-2026", short: "F1+TF1 CAT-1", sub: "Actual paper · Fall 2026–27",
      meta: [["Slot","F1+TF1"],["Date","14-08-2026"],["Duration","90 minutes"],["Max marks","50"],["Programme","B.Tech. (Information Technology)"]],
      instructions: `Answer all questions. M – Max mark; CO – Course Outcome; BL – Blooms Taxonomy Level (1 – Remember, 2 – Understand, 3 – Apply, 4 – Analyse, 5 – Evaluate, 6 – Create).<br>CO1: Identify limitations of classical physics through experimental observations.`,
      questions: [
        {
          n: "1", marks: 10, co: "1", bl: "2",
          notes: ["m1-blackbody.2","m1-planck.1","m1-planck.2"],
          prompt: `<p>Discuss the failure of classical physics in explaining blackbody radiation and how Planck’s hypothesis resolved it. Validate Planck’s radiation law at low and high frequencies.</p>`,
          topics: ["m1-blackbody","m1-planck"]
        },
        {
          n: "2", marks: 10, co: "1", bl: "2",
          notes: ["m1-wavefunction.3","m1-de-broglie.0"],
          prompt: `<p>Explain the Double Slit Experiment and discuss how it demonstrates the wave nature of electrons. Draw a suitable schematic diagram of the experimental setup and compare the observed interference pattern with the behavior of a classical macro-particle.</p>`,
          topics: ["m1-wavefunction","m1-de-broglie"]
        },
        {
          n: "3a", marks: 5, co: "1", bl: "3",
          notes: ["m1-dual-nature.4","m1-dual-nature.5"],
          prompt: `<p>X-rays with a wavelength of 142 pm are incident on a calcite target. (i) Find the wavelength of the X-rays scattered at an angle of 60°. (ii) What is the maximum shift that can be expected in this experiment?</p>`,
          topics: ["m1-dual-nature"]
        },
        {
          n: "3b", marks: 5, co: "1", bl: "3",
          notes: ["m1-de-broglie.1","m1-de-broglie.2"],
          prompt: `<p>Calculate the de Broglie wavelength of an electron accelerated through a potential difference of 5 kV. Compare it with that of a proton accelerated through the same potential, highlighting the effect of their identical charge but different masses. (m<sub>e</sub> = 9.109 × 10<sup>−31</sup> kg, m<sub>p</sub> = 1.673 × 10<sup>−27</sup> kg)</p>`,
          topics: ["m1-de-broglie"]
        },
        {
          n: "4a", marks: 5, co: "1", bl: "3",
          notes: ["m3-measurement.1"],
          prompt: `<p>A person weighing 70 kg is walking through a doorway of width 1.0 m. If the position uncertainty Δx when passing through the frame is equal to the door’s width, calculate the minimum uncertainty in the velocity. Mention whether quantum effects will impact everyday life?</p>`,
          topics: ["m3-measurement"]
        },
        {
          n: "4b", marks: 5, co: "1", bl: "3",
          notes: ["m1-planck.0","m1-blackbody.1"],
          prompt: `<p>Find the temperature dependence of a blackbody’s total radiated energy by calculating the integral of Planck’s formula across all possible frequencies.</p>`,
          topics: ["m1-planck","m1-blackbody"]
        },
        {
          n: "5a", marks: 5, co: "1", bl: "2",
          notes: ["m1-de-broglie.0","m1-de-broglie.1"],
          prompt: `<p>Define matter waves and discuss their properties.</p>`,
          topics: ["m1-de-broglie"]
        },
        {
          n: "5b", marks: 5, co: "1", bl: "2",
          notes: ["m1-stern-gerlach.0","m1-stern-gerlach.2"],
          prompt: `<p>Describe the principle and setup of the Stern–Gerlach experiment. Explain the observed results and state the chief conclusions regarding the quantization of angular momentum.</p>`,
          topics: ["m1-stern-gerlach"]
        }
      ]
    },
    {
      id: "cat1-c1", kind: 'actual', exam: "cat1", title: "CAT-1 · Slot C1+TC1 · 29-01-2026", short: "C1+TC1 CAT-1", sub: "Actual paper · Winter 2025–26 · with answer key",
      meta: [["Slot","C1+TC1"],["Date","29-01-2026"],["Duration","90 minutes"],["Max marks","50"],["Programme","B.Tech. Computer Science and Engineering"]],
      instructions: `Answer all questions. M – Max mark; CO – Course Outcome; BL – Blooms Taxonomy Level.<br>CO1: Identify limitations of classical physics through experimental observations. CO2: Apply matrix algebra and Dirac notation for the understanding of quantum mechanical problems involving linear operators, eigenvalues and eigenvectors.`,
      questions: [
        {
          n: "1a", marks: 5, co: "1", bl: "2",
          notes: ["m1-blackbody.0","m1-blackbody.1"],
          prompt: `<p>What is a blackbody? Draw the blackbody spectra for three different temperatures.</p>`,
          topics: ["m1-blackbody"]
        },
        {
          n: "1b", marks: 5, co: "1", bl: "2",
          notes: ["m1-blackbody.2","m1-planck.1"],
          prompt: `<p>What is ultraviolet catastrophe? Discuss how Planck resolved it.</p>`,
          topics: ["m1-blackbody","m1-planck"]
        },
        {
          n: "2", marks: 10, co: "1", bl: "2",
          notes: ["m1-wavefunction.3"],
          prompt: `<p>How did the double slit experiment with electrons illustrate the wave nature of particles? What happens if the electrons are replaced by macroscopic particles? Explain with diagrams for both the cases.</p>`,
          topics: ["m1-wavefunction"]
        },
        {
          n: "3a", marks: 5, co: "1", bl: "3",
          notes: ["m1-dual-nature.4","m1-dual-nature.5"],
          prompt: `<p>In Compton scattering, a photon of wavelength 0.01 nm is scattered by an electron. What is the maximum energy the recoiled electron can acquire from the photon?</p>`,
          topics: ["m1-dual-nature"]
        },
        {
          n: "3b", marks: 5, co: "1", bl: "3",
          notes: ["m1-wavefunction.2"],
          prompt: `<p>The wave function of a particle that is restricted to move between x = 0 and x = 1 is given by ψ(x) = A(x + 3x<sup>2</sup>). Determine A assuming it is a real, positive constant.</p>`,
          topics: ["m1-wavefunction"]
        },
        {
          n: "4", marks: 10, co: "2", bl: "3",
          notes: ["m2-basis.1","m2-orthonormal.0"],
          prompt: `<p>Given two vectors belonging to the 2-d complex vector space, |ψ<sub>1</sub>⟩ = (1 + i)|e<sub>1</sub>⟩ − 3|e<sub>2</sub>⟩ and |ψ<sub>2</sub>⟩ = 2|e<sub>1</sub>⟩ − 3(1 − i)|e<sub>2</sub>⟩, where |e<sub>1</sub>⟩ and |e<sub>2</sub>⟩ form an orthonormal basis. Check if these two vectors are linearly independent. Also, calculate ⟨ψ<sub>1</sub>|ψ<sub>2</sub>⟩ and from this, find out ⟨ψ<sub>2</sub>|ψ<sub>1</sub>⟩ without explicit calculation.</p>`,
          topics: ["m2-basis","m2-orthonormal"]
        },
        {
          n: "5a", marks: 5, co: "2", bl: "2",
          notes: ["m2-vector-space.0","m2-vector-space.1"],
          prompt: `<p>What is a linear vector space? Does the set of all real polynomials whose value is 1 at x = 0 form a vector space? Justify your answer.</p>`,
          topics: ["m2-vector-space"]
        },
        {
          n: "5b", marks: 5, co: "2", bl: "2",
          notes: ["m2-tensor.0"],
          prompt: `<p>Illustrate the idea of tensor product of vector spaces with an example.</p>`,
          topics: ["m2-tensor"]
        }
      ]
    },
    {
      id: "cat2-f1", kind: 'actual', exam: "cat2", title: "CAT-2 · Slot F1+TF1 · 03-10-2026", short: "F1+TF1 CAT-2", sub: "Actual paper · Fall 2026–27 · open book",
      meta: [["Slot","F1+TF1"],["Date","03-10-2026"],["Duration","90 minutes"],["Max marks","50"],["Programme","B.Tech. (Information Technology)"]],
      instructions: `Answer all questions. Students are permitted to bring textbooks, printouts of e-books and handwritten class notes.<br>CO2: Apply matrix algebra and Dirac notation for the understanding of quantum mechanical problems involving linear operators, eigenvalues and eigenvectors. CO3: Solve the particle in 1-D and 3-D potential box problem using the principles of quantum mechanics.`,
      questions: [
        {
          n: "1a", marks: 5, co: "2", bl: "3",
          notes: ["m3-measurement.1"],
          prompt: `<p>Explain the physical significance of commuting and non-commuting operators in quantum mechanics with example.</p>`,
          topics: ["m3-measurement"]
        },
        {
          n: "1b", marks: 5, co: "2", bl: "3",
          notes: ["m2-pauli.0","m2-pauli.1"],
          prompt: `<p>Evaluate the commutator [σ<sub>y</sub>, σ<sub>z</sub>], where σ<sub>y</sub> and σ<sub>z</sub> are the Pauli matrices.</p>`,
          topics: ["m2-pauli"]
        },
        {
          n: "2a", marks: 4, co: "2", bl: "3",
          notes: ["m2-orthonormal.0","m2-outer.0"],
          prompt: `<p>Explain inner and outer products.</p>`,
          topics: ["m2-orthonormal","m2-outer"]
        },
        {
          n: "2b", marks: 6, co: "2", bl: "3",
          notes: ["m2-dirac.0","m2-outer.0"],
          prompt: `<p>Consider the following two kets, |ψ⟩ = (−3i, 2 + i, 4)<sup>T</sup> and |χ⟩ = (2, −i, 2 − 3i)<sup>T</sup>. Calculate ⟨χ|ψ⟩ and |ψ⟩⟨χ|.</p>`,
          topics: ["m2-dirac","m2-outer"]
        },
        {
          n: "3a", marks: 4, co: "3", bl: "3",
          notes: ["m3-observables.1"],
          prompt: `<p>Show that ψ = Ae<sup>ikx</sup> is an eigenfunction of the kinetic energy operator and find the corresponding eigenvalue.</p>`,
          topics: ["m3-observables"]
        },
        {
          n: "3b", marks: 6, co: "3", bl: "3",
          notes: ["m2-tensor.0","m5-two-qubit.0"],
          prompt: `<p>Given the states as |0⟩ = (1, 0)<sup>T</sup> and |1⟩ = (0, 1)<sup>T</sup>, find all possible tensor products.</p>`,
          topics: ["m2-tensor","m5-two-qubit"]
        },
        {
          n: "4", marks: 10, co: "3", bl: "2",
          notes: ["m3-seq-sg.0","m3-seq-sg.1"],
          prompt: `<p>Describe the sequential Stern-Gerlach experiment with diagrams. Explain how it demonstrates the non-commutativity of spin measurement along different axes and the probabilistic nature of measurements in Quantum mechanics.</p>`,
          topics: ["m3-seq-sg"]
        },
        {
          n: "5a", marks: 3, co: "3", bl: "3",
          notes: ["m3-expectation.1","m3-observables.0"],
          prompt: `<p>Explain the difference between an eigenvalue and expectation value of an observable in quantum mechanics.</p>`,
          topics: ["m3-expectation","m3-observables"]
        },
        {
          n: "5b", marks: 7, co: "3", bl: "3",
          notes: ["m3-expectation.1","m3-expectation.2"],
          prompt: `<p>Consider the state |ψ⟩ = (1/√5)|φ<sub>1</sub>⟩ + (1/√10)|φ<sub>2</sub>⟩ which is given in terms of two orthonormal eigenstates |φ<sub>1</sub>⟩ and |φ<sub>2</sub>⟩ of an operator Â representing a physical observable such that Â|φ<sub>n</sub>⟩ = n<sup>3</sup>|φ<sub>n</sub>⟩. Find the expectation value of Â for the state |ψ⟩.</p>`,
          topics: ["m3-expectation"]
        }
      ]
    },
    {
      id: "cat2-f2", kind: 'actual', exam: "cat2", title: "CAT-2 · Slot F2+TF2 · 22-03-2026", short: "F2+TF2 CAT-2", sub: "Actual paper · Winter 2025–26 · open book · with answer key",
      meta: [["Slot","F2+TF2"],["Date","22-03-2026"],["Duration","90 minutes"],["Max marks","50"],["Programme","B.Tech. (SCOPE)"]],
      instructions: `Answer all questions. Students are permitted to bring textbooks, printouts of e-books and handwritten class notes.<br>CO2: Apply matrix algebra and Dirac notation for the understanding of quantum mechanical problems involving linear operators, eigenvalues and eigenvectors. CO3: Solve the particle in a 1-D and 3-D potential box problem using the principles of quantum mechanics.`,
      questions: [
        {
          n: "1a", marks: 5, co: "2", bl: "3",
          notes: ["m2-hermitian.0"],
          prompt: `<p>Show that AA<sup>†</sup> is a Hermitian operator for an arbitrary operator A.</p>`,
          topics: ["m2-hermitian"]
        },
        {
          n: "1b", marks: 5, co: "2", bl: "3",
          notes: ["m2-hermitian.1"],
          prompt: `<p>Verify whether B = (1/√2)[1 i; i 1] is a unitary operator or not.</p>`,
          topics: ["m2-hermitian"]
        },
        {
          n: "2", marks: 10, co: "2", bl: "3",
          notes: ["m2-eigen.0","m2-eigen.2"],
          prompt: `<p>Obtain the eigenvalues and normalized eigen vectors of the operator [2 −3 0; 2 −5 0; 0 0 3].</p>`,
          topics: ["m2-eigen"]
        },
        {
          n: "3a", marks: 5, co: "3", bl: "2",
          notes: ["m3-observables.0"],
          prompt: `<p>State the postulates of quantum mechanics briefly and explain the significance of these postulates in shaping quantum mechanics.</p>`,
          topics: ["m3-observables"]
        },
        {
          n: "3b", marks: 5, co: "3", bl: "2",
          notes: ["m3-tise.0"],
          prompt: `<p>A particle of mass m traces its path along the X-direction in a time-independent potential region. Obtain the equation of motion of the particle in the context of quantum mechanical description.</p>`,
          topics: ["m3-tise"]
        },
        {
          n: "4a", marks: 5, co: "3", bl: "3",
          notes: ["m2-dirac.1"],
          prompt: `<p>A state of a system is expressed in terms of a set of three orthonormal vectors |α⟩, |β⟩ and |γ⟩ as |ψ⟩ = (√2/3)|α⟩ + (a/√3)|β⟩ + (2/3)|γ⟩. What is the value of a if |ψ⟩ is normalised? Calculate the probability of finding the state in each of these states |α⟩, |β⟩ and |γ⟩.</p>`,
          topics: ["m2-dirac"]
        },
        {
          n: "4b", marks: 5, co: "3", bl: "3",
          notes: ["m3-expectation.2"],
          prompt: `<p>Consider an operator A = [1 i; −i 1] operates on a state vector |ψ⟩ = (1/√2)(1, 1)<sup>T</sup>. Determine the expectation value of A in the state |ψ⟩.</p>`,
          topics: ["m3-expectation"]
        },
        {
          n: "5", marks: 10, co: "3", bl: "2",
          notes: ["m4-box1d.0","m4-box1d.1"],
          prompt: `<p>Derive the energy eigenvalues and eigenfunctions of a free particle of mass m confined in a 1D infinite potential well of length 3L; V(x) = 0 for 0 ≤ x ≤ 3L. Show diagrams of the first three energy levels and probability densities of the particle.</p>`,
          topics: ["m4-box1d"]
        }
      ]
    },
    {
      id: "fat-c1", kind: 'actual', exam: "fat", title: "FAT · Slot C1+TC1 · April 2026", short: "C1+TC1 FAT", sub: "Actual paper · Winter 2025–26 · all modules",
      meta: [["Slot","C1+TC1"],["Date","April 2026"],["Duration","3 hours"],["Max marks","100"],["Pattern","10 × 10 marks, answer all"]],
      instructions: `Answer ALL questions (10 × 10 = 100 marks).<br>CO1: Identify limitations of classical physics through experimental observations. CO2: Apply matrix algebra and Dirac notation for the understanding of quantum mechanical problems involving linear operators, eigenvalues and eigenvectors. CO3: Solve the particle in 1-D and 3-D potential box problem using the principles of quantum mechanics. CO4: Apply fundamental concepts of quantum states and operators to understand the principles of quantum computing.`,
      questions: [
        {
          n: "1", marks: 10, co: "1", bl: "2",
          notes: ["m1-planck.1","m1-planck.2","m1-blackbody.3"],
          prompt: `<p>What assumptions were made by Planck in dealing with the problem of blackbody radiation? Discuss the consequences of these assumptions towards the solution of the problem, with proper mathematical expressions and diagram. How can we arrive at the Wien’s radiation law from Planck’s radiation law.</p>`,
          topics: ["m1-planck","m1-blackbody"]
        },
        {
          n: "2", marks: 10, co: "1", bl: "2",
          notes: ["m1-dual-nature.4","m1-stern-gerlach.2"],
          prompt: `<p>Write in detail about any two experiments which can’t be explained by classical physics. Draw diagrams wherever appropriate.</p>`,
          topics: ["m1-dual-nature","m1-stern-gerlach"]
        },
        {
          n: "3", marks: 10, co: "2", bl: "2",
          notes: ["m2-tensor.1","m2-pauli.0","m2-hermitian.1"],
          prompt: `<p>Find the tensor products of the Pauli matrices (i) σ<sub>x</sub> ⊗ σ<sub>x</sub> (ii) σ<sub>x</sub> ⊗ σ<sub>y</sub>. Also determine whether the resulting tensor products are Hermitian and unitary.</p>`,
          topics: ["m2-tensor","m2-pauli","m2-hermitian"]
        },
        {
          n: "4", marks: 10, co: "2", bl: "2",
          notes: ["m2-hermitian.0"],
          prompt: `<p>Show that the eigenvalues of a Hermitian operator are real and its eigenvectors corresponding to two different eigenvalues are orthogonal.</p>`,
          topics: ["m2-hermitian"]
        },
        {
          n: "5", marks: 10, co: "3", bl: "2",
          notes: ["m3-observables.1","m3-measurement.0"],
          prompt: `<p>a) What is an observable? How are physical observables represented in quantum mechanics? Explain with an example. b) Explain the concept of measurement in quantum mechanics. Discuss the collapse of the wavefunction.</p>`,
          topics: ["m3-observables","m3-measurement"]
        },
        {
          n: "6", marks: 10, co: "3", bl: "2",
          notes: ["m3-seq-sg.1"],
          prompt: `<p>Explain the sequential Stern-Gerlach experimental set-up with suitable diagrams. Discuss how the sequential Stern-Gerlach experiment demonstrates the probabilistic nature of quantum measurement.</p>`,
          topics: ["m3-seq-sg"]
        },
        {
          n: "7", marks: 10, co: "3", bl: "3",
          notes: ["m4-tunnelling.0","m4-tunnel-prob.0"],
          prompt: `<p>Consider a particle of mass m and energy E incident from the left on a one-dimensional rectangular potential barrier of height V<sub>0</sub> and width a, where E &lt; V<sub>0</sub>. Write the general form of the wave function in Region I (x &lt; 0), Region II (0 ≤ x ≤ a) and Region III (x &gt; a). Show the wavefunctions in different regions of the potential. Identify the factors that affect the transmission probability and plot the transmission probabilities by varying them.</p>`,
          topics: ["m4-tunnelling","m4-tunnel-prob"]
        },
        {
          n: "8", marks: 10, co: "4", bl: "2",
          notes: ["m5-bell-gen.0","m5-bell-gen.1"],
          prompt: `<p>Show that a Bell State can be created by applying quantum gates on |01⟩. Explain in detail with the necessary calculations and a circuit diagram. What would be the result if you had started with the initial state (a|01⟩ + b|11⟩)?</p>`,
          topics: ["m5-bell-gen"]
        },
        {
          n: "9a", marks: 10, co: "3", bl: "3",
          notes: ["m1-wavefunction.2","m3-expectation.1"],
          prompt: `<p>The wavefunction of a particle is given by ψ(x) = Ae<sup>−ax</sup>, for x ≥ 0. Here A and a are real. (i) Calculate the normalization constant A. (ii) Calculate the expectation value of the position ⟨x⟩.</p>`,
          topics: ["m1-wavefunction","m3-expectation"]
        },
        {
          n: "9b", marks: 10, co: "3", bl: "3",
          notes: ["m4-box1d.1","m4-numericals.0"],
          prompt: `<p>A 200 gm marble is confined in a one dimensional box of width 2 cm. (i) Calculate the first three energy levels. (ii) Recalculate the energy levels when the mass is reduced to 10<sup>−31</sup> kg and the confinement region is reduced to 5 nm.</p>`,
          topics: ["m4-box1d","m4-numericals"]
        },
        {
          n: "10a", marks: 10, co: "4", bl: "3",
          notes: ["m5-two-qubit.1","m5-bell.1","m5-entanglement.2","m5-entanglement.3"],
          prompt: `<p>Write the condition for a given two-qubit state to be an entangled state. When do you say that a state is maximally entangled and what all are the different possibilities? Give two physical realizations of the entangled states that can be created in the laboratory. Also give two possible applications of entangled states.</p>`,
          topics: ["m5-two-qubit","m5-bell","m5-entanglement"]
        },
        {
          n: "10b", marks: 10, co: "4", bl: "3",
          notes: ["m5-bloch.0","m5-pauli-h.0"],
          prompt: `<p>(i) Explain with a diagram how the Bloch sphere represents any state of a single qubit. What physical meaning is associated with the poles and the equator? (ii) Show and explain how the Pauli X gate acts on any state. What does this transformation mean on the Bloch sphere?</p>`,
          topics: ["m5-bloch","m5-pauli-h"]
        }
      ]
    }  ]
});
