import type { Formula } from "./formulas";

/**
 * Physics formula library for the SIIT/OSP exam, organized by category.
 * These are standard physics relations (SI units). Pairs with the Physics
 * question bank and feeds the flashcards.
 */
const F = (
  cat: string, name: string, tex: string, use: string, example: string,
  diff: Formula["diff"] = "med",
): Formula => ({ cat, name, tex, use, example, diff, subject: "phys" });

export const PHYSICS_FORMULAS: Formula[] = [
  // ── Kinematics ─────────────────────────────────────────────────
  F("Kinematics", "Equations of Motion", "v=u+at\\quad s=ut+\\tfrac12 at^2\\quad v^2=u^2+2as",
    "Constant-acceleration motion in a straight line.", "$u=0,a=9.8,t=2$: $v=19.6\\,\\text{m/s}$", "easy"),
  F("Kinematics", "Average Velocity", "s=\\left(\\dfrac{u+v}{2}\\right)t",
    "Displacement from average of start and end velocity.", "$u=10,v=30,t=4$: $s=80\\,\\text{m}$", "easy"),
  F("Kinematics", "Free Fall", "a=-g\\quad v_{\\text{top}}=0\\quad h_{\\max}=\\dfrac{u^2}{2g}",
    "Vertical motion under gravity (up positive).", "$u=19.6$: $h_{\\max}=19.6\\,\\text{m}$", "med"),
  F("Kinematics", "Projectile Motion", "R=\\dfrac{u^2\\sin 2\\theta}{g}\\quad H=\\dfrac{u^2\\sin^2\\theta}{2g}\\quad T=\\dfrac{2u\\sin\\theta}{g}",
    "Range, max height, and time of flight (level ground).", "Max range at $\\theta=45°$.", "hard"),

  // ── Forces & Motion ────────────────────────────────────────────
  F("Forces & Motion", "Newton's Second Law", "\\Sigma F=ma",
    "Net force produces acceleration.", "$m=2,a=3$: $F=6\\,\\text{N}$", "easy"),
  F("Forces & Motion", "Weight", "W=mg",
    "Gravitational force on a mass.", "$m=10$: $W=98\\,\\text{N}$", "easy"),
  F("Forces & Motion", "Friction", "f_s\\le\\mu_s N\\quad f_k=\\mu_k N",
    "Static friction rises to a maximum; kinetic is constant.", "$\\mu_k=0.3,N=20$: $f_k=6\\,\\text{N}$", "med"),
  F("Forces & Motion", "Inclined Plane", "N=mg\\cos\\theta\\quad F_{\\parallel}=mg\\sin\\theta",
    "Resolving weight on a slope of angle θ.", "$\\theta=30°$: half of $mg$ acts along the incline.", "med"),

  // ── Energy & Power ─────────────────────────────────────────────
  F("Energy & Power", "Work", "W=Fs\\cos\\theta",
    "Work done by a force over a displacement.", "$F=10,s=4,\\theta=0$: $W=40\\,\\text{J}$", "easy"),
  F("Energy & Power", "Kinetic Energy", "K=\\tfrac12 mv^2",
    "Energy of motion.", "$m=4,v=5$: $K=50\\,\\text{J}$", "easy"),
  F("Energy & Power", "Potential Energy", "U=mgh",
    "Gravitational potential energy near Earth.", "$m=2,h=5$: $U=98\\,\\text{J}$", "easy"),
  F("Energy & Power", "Work–Energy Theorem", "W_{\\text{net}}=\\Delta K",
    "Net work equals the change in kinetic energy.", "Speeds up when net work is positive.", "med"),
  F("Energy & Power", "Power", "P=\\dfrac{W}{t}=Fv\\cos\\theta",
    "Rate of doing work.", "$600\\,\\text{J}$ in $3\\,\\text{s}$: $P=200\\,\\text{W}$", "easy"),

  // ── Momentum ───────────────────────────────────────────────────
  F("Momentum", "Momentum & Impulse", "p=mv\\quad J=F\\Delta t=\\Delta p",
    "Impulse changes momentum.", "$m=3,v=4$: $p=12\\,\\text{kg·m/s}$", "easy"),
  F("Momentum", "Conservation of Momentum", "\\Sigma p_{\\text{before}}=\\Sigma p_{\\text{after}}",
    "Total momentum is conserved in collisions.", "Perfectly inelastic: $v=\\frac{m_1u_1+m_2u_2}{m_1+m_2}$", "med"),

  // ── Circular & Rotation ────────────────────────────────────────
  F("Circular & Rotation", "Circular Motion", "v=\\omega r\\quad a_c=\\dfrac{v^2}{r}=\\omega^2 r\\quad F_c=\\dfrac{mv^2}{r}",
    "Speed, centripetal acceleration, and force.", "$\\omega=2\\pi f$, $f=\\text{rpm}/60$", "med"),
  F("Circular & Rotation", "Torque & Equilibrium", "\\tau=rF\\sin\\theta\\quad \\Sigma\\tau=0",
    "Rotational effect of a force; balance condition.", "Uniform rod's weight acts at $L/2$.", "med"),
  F("Circular & Rotation", "Centre of Mass", "x_{CM}=\\dfrac{\\Sigma m_i x_i}{\\Sigma m_i}",
    "Weighted average position of mass.", "Two masses: $\\frac{m_1x_1+m_2x_2}{m_1+m_2}$", "med"),

  // ── Gravitation ────────────────────────────────────────────────
  F("Gravitation", "Newton's Gravitation", "F=\\dfrac{GMm}{r^2}\\quad g=\\dfrac{GM}{r^2}",
    "Force between masses and surface gravity.", "$g\\propto 1/r^2$ with distance from centre.", "med"),
  F("Gravitation", "Orbital & Escape Speed", "v_{\\text{orbit}}=\\sqrt{\\dfrac{GM}{r}}\\quad v_{\\text{escape}}=\\sqrt{\\dfrac{2GM}{r}}",
    "Speed to orbit or escape a body.", "Escape speed is $\\sqrt2\\times$ orbital speed.", "hard"),

  // ── SHM & Waves ────────────────────────────────────────────────
  F("SHM & Waves", "Simple Harmonic Motion", "x=A\\cos(\\omega t+\\varphi)\\quad v_{\\max}=A\\omega\\quad a_{\\max}=\\omega^2 A",
    "Oscillation about an equilibrium point.", "$a=-\\omega^2 x$ (restoring).", "hard"),
  F("SHM & Waves", "Spring & Pendulum", "T_{\\text{spring}}=2\\pi\\sqrt{\\tfrac{m}{k}}\\quad T_{\\text{pendulum}}=2\\pi\\sqrt{\\tfrac{L}{g}}",
    "Periods of a mass–spring and simple pendulum.", "Pendulum formula assumes a small angle.", "med"),
  F("SHM & Waves", "Wave Equation", "v=f\\lambda\\quad f=\\dfrac{1}{T}\\quad k=\\dfrac{2\\pi}{\\lambda}",
    "Relating speed, frequency, and wavelength.", "$f=50,\\lambda=4$: $v=200\\,\\text{m/s}$", "easy"),
  F("SHM & Waves", "Wave on a String", "v=\\sqrt{\\dfrac{F_T}{\\mu}}\\quad f_n=\\dfrac{nv}{2L}",
    "Speed on a stretched string; harmonics.", "More tension → faster wave.", "med"),
  F("SHM & Waves", "Sound Intensity (dB)", "\\beta=10\\log_{10}\\!\\left(\\dfrac{I}{I_0}\\right),\\ I_0=10^{-12}\\,\\text{W/m}^2",
    "Sound level in decibels; intensity is logarithmic.", "+10 dB = 10× intensity, not +10%.", "med"),

  // ── Optics ─────────────────────────────────────────────────────
  F("Optics", "Reflection & Refraction", "\\theta_i=\\theta_r\\quad n_1\\sin\\theta_1=n_2\\sin\\theta_2\\quad n=\\dfrac{c}{v}",
    "Law of reflection and Snell's law.", "Entering denser medium bends toward the normal.", "med"),
  F("Optics", "Thin Lens / Mirror", "\\dfrac{1}{f}=\\dfrac{1}{d_o}+\\dfrac{1}{d_i}\\quad m=-\\dfrac{d_i}{d_o}",
    "Image distance and magnification.", "Keep one sign convention throughout.", "med"),
  F("Optics", "Double-Slit Interference", "d\\sin\\theta=m\\lambda\\quad \\Delta y=\\dfrac{\\lambda L}{d}",
    "Bright-fringe positions and spacing.", "Dark fringes: $d\\sin\\theta=(m+\\tfrac12)\\lambda$.", "hard"),

  // ── Thermal & Gases ────────────────────────────────────────────
  F("Thermal & Gases", "Calorimetry", "Q=mc\\Delta T\\quad Q=mL",
    "Heat for temperature change vs phase change.", "$2\\,\\text{kg}$ water, $\\Delta T=10$: $Q=84000\\,\\text{J}$", "easy"),
  F("Thermal & Gases", "Ideal Gas Law", "PV=nRT\\quad \\dfrac{P_1V_1}{T_1}=\\dfrac{P_2V_2}{T_2}",
    "State of an ideal gas (T in kelvin).", "$27°\\text{C}=300\\,\\text{K}$", "med"),
  F("Thermal & Gases", "Temperature Scales", "T_K=T_C+273.15\\quad T_F=\\tfrac95 T_C+32",
    "Converting between Celsius, Kelvin, Fahrenheit.", "Use Kelvin in all gas-law ratios.", "easy"),

  // ── Electricity ────────────────────────────────────────────────
  F("Electricity", "Ohm's Law & Power", "V=IR\\quad P=VI=I^2R=\\dfrac{V^2}{R}",
    "Voltage, current, resistance, and power.", "$V=12,I=3$: $R=4\\,\\Omega$", "easy"),
  F("Electricity", "Resistor Networks", "R_{\\text{series}}=\\Sigma R\\quad \\dfrac{1}{R_{\\text{parallel}}}=\\Sigma\\dfrac{1}{R}",
    "Combining resistors.", "Two 4Ω in parallel = 2Ω.", "med"),
  F("Electricity", "Charge & Current", "Q=It\\quad Q=ne",
    "Charge from current, or from electron count.", "$I=2,t=5$: $Q=10\\,\\text{C}$", "easy"),
  F("Electricity", "Coulomb's Law", "F=\\dfrac{k|q_1q_2|}{r^2}\\quad E=\\dfrac{F}{q}",
    "Force between charges and electric field.", "$k=8.99\\times10^9\\,\\text{N·m}^2/\\text{C}^2$", "med"),
  F("Electricity", "Capacitors", "C=\\dfrac{Q}{V}\\quad U=\\tfrac12 CV^2\\quad C_{\\parallel}=\\Sigma C",
    "Charge, stored energy, and combinations.", "Series: $\\frac{1}{C_{eq}}=\\Sigma\\frac{1}{C}$", "med"),
  F("Electricity", "Kirchhoff's Rules", "\\Sigma I_{\\text{in}}=\\Sigma I_{\\text{out}}\\quad \\Sigma\\Delta V=0",
    "Junction (charge) and loop (energy) laws.", "Used to analyse multi-loop circuits.", "hard"),

  // ── Magnetism ──────────────────────────────────────────────────
  F("Magnetism", "Magnetic Force", "F=qvB\\sin\\theta\\quad F=BIL\\sin\\theta",
    "Force on a moving charge or current-carrying wire.", "Circular path radius $r=\\frac{mv}{qB}$.", "hard"),
  F("Magnetism", "Faraday's Law", "\\varepsilon=-N\\dfrac{\\Delta\\Phi_B}{\\Delta t}\\quad \\Phi_B=BA\\cos\\theta",
    "Induced EMF from changing flux.", "Minus sign is Lenz's law.", "hard"),
  F("Magnetism", "Transformer", "\\dfrac{V_s}{V_p}=\\dfrac{N_s}{N_p}\\quad V_pI_p=V_sI_s",
    "Ideal transformer voltage/current ratios.", "Step-up: $N_s>N_p$.", "med"),

  // ── Fluids ─────────────────────────────────────────────────────
  F("Fluids", "Pressure", "P=\\dfrac{F}{A}\\quad P=P_0+\\rho gh",
    "Pressure from force, and with depth.", "Gauge pressure $P_g=\\rho gh$.", "easy"),
  F("Fluids", "Buoyancy", "F_B=\\rho_{\\text{fluid}}V_{\\text{displaced}}\\,g",
    "Upward force on a submerged object.", "Floating: $F_B=mg$.", "med"),
  F("Fluids", "Continuity & Bernoulli", "A_1v_1=A_2v_2\\quad P+\\tfrac12\\rho v^2+\\rho gh=\\text{const}",
    "Flow rate conservation and energy in a fluid.", "Narrower pipe → faster flow.", "hard"),

  // ── Modern Physics ─────────────────────────────────────────────
  F("Modern Physics", "Photon Energy", "E=hf=\\dfrac{hc}{\\lambda}\\quad p=\\dfrac{h}{\\lambda}",
    "Energy and momentum of a photon.", "$h=6.626\\times10^{-34}\\,\\text{J·s}$", "med"),
  F("Modern Physics", "Photoelectric Effect", "hf=\\varphi+K_{\\max}\\quad K_{\\max}=hf-\\varphi",
    "Energy balance when photons eject electrons.", "Threshold: $f_0=\\varphi/h$.", "hard"),
  F("Modern Physics", "Mass–Energy & de Broglie", "E=mc^2\\quad \\lambda=\\dfrac{h}{p}=\\dfrac{h}{mv}",
    "Rest energy and matter wavelength.", "Larger momentum → shorter wavelength.", "hard"),
];
