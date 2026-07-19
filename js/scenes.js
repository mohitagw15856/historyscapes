/* ============================================================
   HistoryScapes scene library — animated "Greek pottery" SVG
   illustrations, composed from silhouette primitives.
   Zero dependencies. HSScenes.render(sceneId, uid) → SVG string.
   ============================================================ */

const HSScenes = (() => {
  const INK = "#241209";      // black-figure silhouette
  const GOLD = "#f0c26a";     // gilded details
  const CREAM = "#f3ead7";    // added-white details
  const EMBER = "#e8794a";

  const STYLE = `
    .hs-flame { animation: hsFlick 1.4s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 100%; }
    @keyframes hsFlick { from { transform: scaleY(1) scaleX(1); } to { transform: scaleY(1.3) scaleX(0.88); } }
    .hs-bob { animation: hsBob 3.6s ease-in-out infinite alternate; }
    @keyframes hsBob { from { transform: translateY(0); } to { transform: translateY(7px); } }
    .hs-glow { animation: hsGlow 2.2s ease-in-out infinite alternate; }
    @keyframes hsGlow { from { opacity: 0.45; } to { opacity: 1; } }
    .hs-drift { animation: hsDrift 9s linear infinite; }
    @keyframes hsDrift { from { transform: translateX(0); } to { transform: translateX(-104px); } }
    .hs-march { animation: hsMarch 16s linear infinite; }
    @keyframes hsMarch { from { transform: translateX(0); } to { transform: translateX(-300px); } }
    .hs-spin { animation: hsSpin 8s linear infinite; transform-box: fill-box; transform-origin: 50% 50%; }
    @keyframes hsSpin { to { transform: rotate(360deg); } }
    .hs-sway { animation: hsSway 2.2s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 20% 90%; }
    @keyframes hsSway { from { transform: rotate(-10deg); } to { transform: rotate(14deg); } }
    .hs-blink { animation: hsBlink 4.5s infinite; transform-box: fill-box; transform-origin: center; }
    @keyframes hsBlink { 0%, 90%, 100% { transform: scaleY(1); } 94% { transform: scaleY(0.06); } 98% { transform: scaleY(1); } }
    .hs-rise { animation: hsRise 3s ease-in infinite; }
    @keyframes hsRise { from { transform: translateY(0); opacity: 0.9; } to { transform: translateY(-46px); opacity: 0; } }
  `;

  // ---------- helpers ----------
  // Animation classes go on an INNER group: a CSS transform animation would
  // override the outer group's transform attribute and collapse it to origin.
  const g = (x, y, s = 1, flip = false, inner = "", cls = "", delay = 0) => {
    const core = cls
      ? `<g class="${cls}"${delay ? ` style="animation-delay:${delay}s"` : ""}>${inner}</g>`
      : inner;
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${core}</g>`;
  };

  // ---------- primitives (local coords, ground at y=100 for figures) ----------
  function hoplite(x, y, s, flip, opts = {}) {
    const { shield = true, spear = "up", crest = true, lunge = false } = opts;
    let el = "";
    if (crest) el += `<path d="M18 6 Q30 -9 46 2 L42 9 Q31 2 22 11 Z" fill="${INK}"/>`;
    el += `<circle cx="31" cy="16" r="7.5" fill="${INK}"/><path d="M27 20 L30 27 L34 20 Z" fill="${INK}"/>`;
    el += `<path d="M25 23 L37 23 L39 54 L23 54 Z" fill="${INK}"/>`;
    el += `<path d="M23 54 L39 54 L43 68 L19 68 Z" fill="${INK}"/><path d="M23 60 L39 60" stroke="${GOLD}" stroke-width="1.2"/>`;
    el += lunge
      ? `<path d="M25 68 L31 68 L20 96 L13 96 Z" fill="${INK}"/><path d="M32 68 L38 68 L49 96 L43 96 Z" fill="${INK}"/>`
      : `<path d="M25 68 L29 68 L28 97 L23 97 Z" fill="${INK}"/><path d="M33 68 L37 68 L39 97 L34 97 Z" fill="${INK}"/>`;
    if (spear === "up")
      el += `<path d="M36 30 L48 23 L50 27 L38 35 Z" fill="${INK}"/><rect x="48.5" y="2" width="2.6" height="88" fill="${INK}"/><path d="M49.8 -9 L45.6 3 L54 3 Z" fill="${INK}"/>`;
    else if (spear === "lunge")
      el += `<path d="M34 32 L46 36 L45 41 L33 37 Z" fill="${INK}"/><path d="M10 24 L78 44 L78 48 L10 28 Z" fill="${INK}"/><path d="M90 47 L76 40 L76 51 Z" fill="${INK}"/>`;
    else if (spear === "staff")
      el += `<path d="M36 30 L46 26 L48 30 L38 35 Z" fill="${INK}"/><rect x="46.5" y="14" width="2.4" height="82" fill="${INK}"/><path d="M47.7 14 Q54 8 52 2" stroke="${INK}" stroke-width="2.4" fill="none"/>`;
    if (shield)
      el += `<circle cx="15" cy="42" r="17" fill="${INK}" stroke="${GOLD}" stroke-width="2.4"/><circle cx="15" cy="42" r="4" fill="${GOLD}"/>`;
    return g(x, y, s, flip, el);
  }

  function woman(x, y, s, flip, opts = {}) {
    const { arm = true, crown = false } = opts;
    let el = `<circle cx="30" cy="14" r="7" fill="${INK}"/><circle cx="23.5" cy="10" r="3.6" fill="${INK}"/>`;
    if (crown) el += `<path d="M24 6 L30 0 L36 6" stroke="${GOLD}" stroke-width="2" fill="none"/>`;
    el += `<path d="M24 20 L36 20 L43 98 L17 98 Z" fill="${INK}"/>`;
    el += `<path d="M22 42 L38 40" stroke="${GOLD}" stroke-width="1.4"/><path d="M27 48 L26 94 M33 48 L34 94" stroke="${GOLD}" stroke-width="1" opacity="0.7"/>`;
    if (arm) el += `<path d="M35 27 L50 38 L48 43 L33 33 Z" fill="${INK}"/>`;
    return g(x, y, s, flip, el);
  }

  function ship(x, y, s, flip, delay = 0) {
    const el = `
      <path d="M4 6 Q14 27 48 28 Q82 27 94 2 Q84 15 48 17 Q16 15 4 6 Z" fill="${INK}"/>
      <path d="M4 6 Q0 -2 4 -10 L8 -8 Q5 -2 8 5 Z" fill="${INK}"/>
      <path d="M94 2 Q100 -6 97 -16 L92 -13 Q94 -6 90 1 Z" fill="${INK}"/>
      <rect x="46" y="-40" width="2.8" height="46" fill="${INK}"/>
      <rect x="27" y="-40" width="41" height="2.6" fill="${INK}"/>
      <path d="M30 -36 Q48 -22 65 -36 L65 -10 Q48 -20 30 -10 Z" fill="${CREAM}" stroke="${INK}" stroke-width="1.2"/>
      <path d="M20 16 L13 30 M34 18 L29 32 M62 18 L67 32 M78 15 L85 29" stroke="${INK}" stroke-width="2"/>
      <circle cx="84" cy="7" r="3" fill="${CREAM}"/><circle cx="84.8" cy="7" r="1.3" fill="${INK}"/>`;
    return g(x, y, s, flip, el, "hs-bob", delay);
  }

  function trojanHorse(x, y, s, flip) {
    const el = `
      <rect x="6" y="100" width="148" height="9" fill="${INK}"/>
      <circle cx="28" cy="116" r="10" fill="${INK}" stroke="${GOLD}" stroke-width="1.6"/>
      <circle cx="128" cy="116" r="10" fill="${INK}" stroke="${GOLD}" stroke-width="1.6"/>
      <rect x="34" y="62" width="9" height="38" fill="${INK}"/><rect x="56" y="62" width="9" height="38" fill="${INK}"/>
      <rect x="92" y="62" width="9" height="38" fill="${INK}"/><rect x="114" y="62" width="9" height="38" fill="${INK}"/>
      <path d="M26 40 Q28 30 40 30 L120 30 Q134 32 134 44 L132 62 L28 64 Z" fill="${INK}"/>
      <path d="M40 32 L30 16 L44 4 L54 22 L52 34 Z" fill="${INK}"/>
      <path d="M18 2 L46 6 L44 20 L24 18 Q14 14 18 2 Z" fill="${INK}"/>
      <path d="M28 0 L33 -8 L38 1 Z" fill="${INK}"/>
      <path d="M132 40 L148 70 L142 73 L128 52 Z" fill="${INK}"/>
      <path d="M46 8 Q52 14 50 26" stroke="${GOLD}" stroke-width="2" fill="none"/>
      <rect x="66" y="52" width="26" height="7" fill="none" stroke="${GOLD}" stroke-width="1.6"/>
      <path d="M32 40 L128 40 M32 50 L128 50" stroke="${GOLD}" stroke-width="0.9" opacity="0.65"/>`;
    return g(x, y, s, flip, el);
  }

  function city(x, y, s, flip, opts = {}) {
    const { burning = false } = opts;
    let el = `
      <rect x="0" y="70" width="220" height="70" fill="${INK}"/>
      ${[0, 30, 60, 90, 150, 180, 210].map((tx) => `<rect x="${tx}" y="58" width="14" height="14" fill="${INK}"/>`).join("")}
      <rect x="-14" y="30" width="40" height="110" fill="${INK}"/>
      ${[-14, 2, 18].map((tx) => `<rect x="${tx}" y="18" width="10" height="14" fill="${INK}"/>`).join("")}
      <rect x="194" y="30" width="40" height="110" fill="${INK}"/>
      ${[194, 210, 226].map((tx) => `<rect x="${tx}" y="18" width="10" height="14" fill="${INK}"/>`).join("")}
      <path d="M96 140 L96 100 Q110 86 124 100 L124 140 Z" fill="#3a1c10"/>
      <rect x="60" y="86" width="8" height="10" fill="${GOLD}" opacity="0.8"/>
      <rect x="150" y="86" width="8" height="10" fill="${GOLD}" opacity="0.8"/>`;
    if (burning) el += flame(6, 18, 1.3, 0) + flame(214, 18, 1.4, 0.5) + flame(105, 58, 1.1, 0.9);
    return g(x, y, s, flip, el);
  }

  function flame(x, y, s, delay = 0) {
    const el = `
      <path d="M0 0 Q-9 -13 -4 -27 Q0 -35 3 -25 Q11 -13 5 -2 Q2 3 0 0 Z" fill="${EMBER}"/>
      <path d="M0 -2 Q-4 -9 -1 -17 Q1 -21 3 -15 Q6 -8 3 -3 Z" fill="${GOLD}"/>`;
    return g(x, y, s, false, el, "hs-flame", delay);
  }

  function apple(x, y, s) {
    const el = `
      <circle r="15" fill="${GOLD}" opacity="0.28" class="hs-glow"/>
      <circle r="9" fill="${GOLD}"/>
      <path d="M1 -9 Q7 -17 12 -13 Q7 -8 1 -9 Z" fill="#7a8450"/>
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M0 0 L0 -22" stroke="${GOLD}" stroke-width="1.2" opacity="0.5" transform="rotate(${a})"/>`).join("")}`;
    return g(x, y, s, false, el);
  }

  const sun = (x, y, s) =>
    g(x, y, s, false, `<circle r="15" fill="${GOLD}"/>${[0, 45, 90, 135].map((a) => `<path d="M-26 0 L26 0" stroke="${GOLD}" stroke-width="2.4" transform="rotate(${a})"/>`).join("")}`, "hs-glow");

  const moon = (x, y, s) =>
    g(x, y, s, false, `<path d="M0 -14 A14 14 0 1 0 0 14 A11 11 0 1 1 0 -14 Z" fill="${CREAM}"/>`, "hs-glow");

  const stars = (pts) =>
    pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="2" fill="${CREAM}" class="hs-glow" style="animation-delay:${(i * 0.4) % 2}s"/>`).join("");

  const waves = (y) => {
    let seg = "";
    for (let i = -1; i < 11; i++) seg += `<path d="M${i * 104} ${y} q13 -12 26 0 t26 0 t26 0 t26 0" stroke="${INK}" stroke-width="3.4" fill="none" opacity="0.75"/>`;
    return `<g class="hs-drift">${seg}</g><rect x="0" y="${y + 4}" width="900" height="${260 - y}" fill="${INK}" opacity="0.18"/>`;
  };

  const ground = () => `<rect x="0" y="206" width="900" height="38" fill="${INK}" opacity="0.22"/>`;

  function bigEye(x, y, s) {
    const el = `
      <path d="M-34 0 Q0 -25 34 0 Q0 25 -34 0 Z" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>
      <circle r="11" fill="${GOLD}"/><circle r="5.5" fill="${INK}"/>`;
    return g(x, y, s, false, el, "hs-blink");
  }

  function pig(x, y, s, flip, delay) {
    const el = `
      <ellipse cx="0" cy="0" rx="17" ry="11" fill="${INK}"/>
      <circle cx="-16" cy="-4" r="7.5" fill="${INK}"/>
      <rect x="-26" y="-6" width="6" height="5" rx="2" fill="${INK}"/>
      <path d="M-20 -10 L-17 -16 L-13 -10 Z" fill="${INK}"/>
      <path d="M-14 -10 L-11 -15 L-8 -10 Z" fill="${INK}"/>
      <rect x="-10" y="9" width="4" height="8" fill="${INK}"/><rect x="6" y="9" width="4" height="8" fill="${INK}"/>
      <path d="M16 -3 q6 -3 4 -8 q-4 -2 -4 2" stroke="${INK}" stroke-width="2" fill="none"/>`;
    return g(x, y, s, flip, el, "hs-bob", delay);
  }

  function ghost(x, y, s, delay) {
    const el = `
      <path d="M-9 0 Q-10 -30 0 -37 Q10 -30 9 0 Q6 -6 3 0 Q0 -6 -3 0 Q-6 -6 -9 0 Z" fill="${CREAM}" opacity="0.4"/>
      <circle cx="0" cy="-28" r="5" fill="${CREAM}" opacity="0.55"/>`;
    return g(x, y, s, false, el, "hs-bob", delay);
  }

  function siren(x, y, s, flip, delay) {
    const el = `
      <path d="M0 0 Q15 -7 24 2 Q17 13 2 10 Q-3 5 0 0 Z" fill="${INK}"/>
      <path d="M4 -1 Q10 -16 22 -14 Q15 -4 9 0 Z" fill="${INK}"/>
      <circle cx="-3" cy="-9" r="5.5" fill="${INK}"/>
      <path d="M-8 -12 Q-3 -18 3 -13" stroke="${INK}" stroke-width="3" fill="none"/>
      <path d="M6 11 L4 18 M12 11 L12 18" stroke="${INK}" stroke-width="2"/>`;
    return g(x, y, s, flip, el, "hs-bob", delay);
  }

  const note = (x, y, delay) =>
    `<text x="${x}" y="${y}" font-size="20" fill="${CREAM}" class="hs-rise" style="animation-delay:${delay}s">♪</text>`;

  function whirl(x, y, s) {
    const el = `<path d="M34 0 A34 34 0 1 1 -34 0 A29 29 0 1 1 25 0 A20 20 0 1 1 -16 0 A11 11 0 1 1 9 0" stroke="${CREAM}" stroke-width="3.2" fill="none" opacity="0.85"/>`;
    return g(x, y, s, false, el, "hs-spin");
  }

  function cow(x, y, s, flip, delay) {
    const el = `
      <path d="M-20 0 Q-22 -14 -6 -15 L16 -15 Q26 -14 25 -2 L23 12 L17 12 L16 2 L-12 2 L-13 12 L-19 12 Z" fill="${INK}"/>
      <path d="M-20 -8 L-32 -2 L-33 6 L-27 6 L-26 1 Z" fill="${INK}"/>
      <path d="M-32 -6 Q-38 -12 -34 -16 M-28 -8 Q-30 -15 -25 -18" stroke="${GOLD}" stroke-width="2" fill="none"/>
      <path d="M25 -6 q6 4 4 12" stroke="${INK}" stroke-width="2" fill="none"/>`;
    return g(x, y, s, flip, el, "hs-bob", delay);
  }

  const tree = (x, y, s) =>
    g(x, y, s, false, `
      <path d="M0 0 Q-3 -20 -8 -34" stroke="${INK}" stroke-width="6" fill="none"/>
      <circle cx="-12" cy="-42" r="12" fill="#7a8450"/><circle cx="0" cy="-48" r="13" fill="#7a8450"/><circle cx="10" cy="-40" r="11" fill="#7a8450"/>`);

  function dog(x, y, s, flip) {
    const el = `
      <circle cx="10" cy="4" r="11" fill="${INK}"/>
      <path d="M2 -2 Q-8 -8 -14 -2 L-12 12 L-6 12 L-6 4 Q0 8 8 12 Z" fill="${INK}"/>
      <circle cx="-16" cy="-8" r="6.5" fill="${INK}"/>
      <path d="M-21 -13 L-19 -20 L-15 -13 Z" fill="${INK}"/>
      <path d="M-22 -6 L-28 -4 L-23 -2 Z" fill="${INK}"/>
      <rect x="-13" y="10" width="4" height="8" fill="${INK}"/><rect x="12" y="12" width="4" height="7" fill="${INK}"/>
      <path d="M18 0 Q30 -8 32 -16" stroke="${INK}" stroke-width="4" fill="none" class="hs-sway"/>`;
    return g(x, y, s, flip, el);
  }

  const bow = (x, y, s, flip) =>
    g(x, y, s, flip, `
      <path d="M0 -38 Q26 0 0 38" stroke="${GOLD}" stroke-width="3.6" fill="none"/>
      <path d="M0 -38 L0 38" stroke="${CREAM}" stroke-width="1.4"/>
      <path d="M-6 0 L30 0 M30 0 L22 -4 M30 0 L22 4" stroke="${INK}" stroke-width="2.4"/>`);

  const rock = (x, y, s) =>
    g(x, y, s, false, `<path d="M-16 8 L-10 -8 L2 -13 L14 -6 L16 8 Z" fill="${INK}"/>`);

  const cliff = (x, y, s, flip) =>
    g(x, y, s, flip, `<path d="M0 160 L14 40 L34 14 L52 34 L60 160 Z" fill="${INK}" opacity="0.9"/>`);

  const windCurls = (x, y, s) =>
    g(x, y, s, false, `
      <path d="M0 0 q16 -12 32 -3 q13 7 28 0" stroke="${CREAM}" stroke-width="2.6" fill="none" class="hs-glow"/>
      <path d="M4 14 q18 -10 36 -2 q14 6 26 1" stroke="${CREAM}" stroke-width="2.2" fill="none" opacity="0.7" class="hs-glow" style="animation-delay:0.6s"/>
      <path d="M-2 -14 q14 -8 30 -2" stroke="${CREAM}" stroke-width="2" fill="none" opacity="0.6" class="hs-glow" style="animation-delay:1.1s"/>`);

  // ---------- panel wrapper ----------
  function panel(inner, uid, opts = {}) {
    const [c1, c2] = opts.night ? ["#6b3018", "#331409"] : ["#b5532c", "#8f3c1f"];
    return `
<svg viewBox="0 0 900 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${opts.label || "Illustrated scene"}">
  <style>${STYLE}</style>
  <defs>
    <linearGradient id="bg-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <pattern id="mk-${uid}" width="28" height="12" patternUnits="userSpaceOnUse">
      <path d="M2 10 L2 2 L12 2 L12 7 L7 7" fill="none" stroke="${INK}" stroke-opacity="0.55" stroke-width="1.6"/>
      <path d="M16 10 L16 2 L26 2 L26 7 L21 7" fill="none" stroke="${INK}" stroke-opacity="0.55" stroke-width="1.6"/>
    </pattern>
  </defs>
  <rect width="900" height="260" fill="url(#bg-${uid})"/>
  <rect y="6" width="900" height="12" fill="url(#mk-${uid})"/>
  <rect y="242" width="900" height="12" fill="url(#mk-${uid})"/>
  ${inner}
</svg>`;
  }

  // ---------- scenes ----------
  const SCENES = {
    // --- Troy chapters ---
    "t-apple": () => ground() +
      `<rect x="432" y="150" width="36" height="60" fill="${INK}"/><rect x="424" y="144" width="52" height="8" fill="${INK}"/>` +
      apple(450, 128, 2) +
      woman(200, 112, 1.05, false, { crown: true }) + woman(310, 108, 1.1, false) +
      woman(600, 108, 1.1, true) + woman(710, 112, 1.05, true, { crown: true }),

    "t-judgment": () => ground() +
      hoplite(300, 106, 1.1, false, { crest: false, shield: false, spear: "staff" }) +
      apple(408, 128, 1.2) +
      woman(490, 106, 1.1, true) +
      woman(690, 110, 0.95, false) + woman(770, 112, 0.9, false, { crown: true }),

    "t-ships": () => sun(810, 60, 1.1) + waves(196) +
      ship(60, 170, 0.95, false, 0) + ship(230, 168, 1.05, false, 0.7) +
      ship(410, 172, 0.9, false, 1.3) + ship(570, 167, 1.1, false, 0.3) + ship(750, 171, 0.95, false, 1),

    "t-siege": () => ground() + sun(120, 56, 0.9) +
      city(600, 70, 1, false) +
      hoplite(140, 108, 1.05, false, { spear: "lunge", lunge: true }) +
      hoplite(270, 106, 1.1, false, { spear: "lunge", lunge: true }) +
      hoplite(400, 108, 1.05, false, { spear: "lunge", lunge: true }) +
      `<path d="M200 90 Q400 20 590 80" stroke="${GOLD}" stroke-width="1.6" stroke-dasharray="5 7" fill="none" opacity="0.7"/>
       <path d="M300 96 Q470 40 600 96" stroke="${GOLD}" stroke-width="1.6" stroke-dasharray="5 7" fill="none" opacity="0.5"/>`,

    "t-wrath": () => ground() +
      `<path d="M110 208 L215 84 L320 208 Z" fill="${INK}"/><path d="M172 208 L215 130 L258 208 Z" fill="#8f3c1f"/>` +
      hoplite(370, 108, 1.05, true, { spear: null, shield: false }) +
      `<circle cx="470" cy="184" r="20" fill="${INK}" stroke="${GOLD}" stroke-width="2.4"/><circle cx="470" cy="184" r="5" fill="${GOLD}"/>
       <path d="M500 206 L540 96" stroke="${INK}" stroke-width="3.4"/><path d="M541 84 L534 98 L546 99 Z" fill="${INK}"/>` +
      hoplite(650, 116, 0.8, false, { lunge: true }) + hoplite(730, 118, 0.78, false, { lunge: true }) + hoplite(810, 117, 0.8, false, { lunge: true }),

    "t-duel": () => ground() +
      g(450, 30, 0.8, false, `<g opacity="0.35">${city(-110, 20, 1, false)}</g>`) +
      hoplite(320, 104, 1.25, false, { spear: "lunge", lunge: true }) +
      hoplite(580, 104, 1.25, true, { spear: "lunge", lunge: true }) +
      `<circle cx="450" cy="210" r="2.4" fill="${GOLD}" class="hs-glow"/><circle cx="470" cy="216" r="2" fill="${GOLD}" class="hs-glow" style="animation-delay:0.5s"/><circle cx="430" cy="217" r="2" fill="${GOLD}" class="hs-glow" style="animation-delay:1s"/>`,

    "t-horse": () => ground() + moon(110, 62, 1.2) + stars([[220, 46], [300, 78], [180, 110], [370, 40]]) +
      trojanHorse(330, 84, 1.02, false) +
      `<path d="M492 158 L610 168" stroke="${INK}" stroke-width="3"/>` +
      hoplite(620, 112, 0.95, false, { crest: false, shield: false, spear: null }) +
      hoplite(700, 114, 0.9, false, { crest: false, shield: false, spear: null }) +
      g(810, 40, 0.85, false, `<g opacity="0.85">${city(-40, 30, 1, false)}</g>`),

    "t-fall": (uid) => ground() + stars([[100, 50], [180, 90], [700, 40], [810, 84], [420, 36]]) +
      city(340, 64, 1.15, false, { burning: true }) +
      flame(400, 200, 1.6, 0.3) + flame(520, 196, 1.3, 0.8) +
      woman(150, 116, 0.95, true) + hoplite(80, 118, 0.9, true, { crest: false, shield: false, spear: null }) +
      `<circle cx="300" cy="90" r="2.2" fill="${GOLD}" class="hs-rise"/><circle cx="480" cy="100" r="2.2" fill="${GOLD}" class="hs-rise" style="animation-delay:1s"/><circle cx="390" cy="80" r="2" fill="${EMBER}" class="hs-rise" style="animation-delay:2s"/>`,

    // --- Odyssey stops ---
    "o-depart": () => stars([[120, 50], [200, 84], [640, 44]]) + waves(196) +
      g(140, 40, 0.9, false, `<g opacity="0.9">${city(-60, 30, 1, false, { burning: true })}</g>`) +
      ship(520, 168, 1.15, false, 0) + ship(730, 172, 0.85, false, 0.8),

    "o-cicones": () => ground() +
      hoplite(280, 104, 1.15, false, { spear: "lunge", lunge: true }) +
      hoplite(470, 104, 1.15, true, { spear: "lunge", lunge: true }) +
      waves(210) + ship(700, 182, 0.95, false, 0.4),

    "o-lotus": () => ground() + sun(140, 60, 1) +
      `<path d="M330 208 Q450 130 570 208 Z" fill="${INK}" opacity="0.85"/>` + tree(450, 156, 1.2) +
      [380, 450, 520].map((x, i) => g(x, 190, 1, false, `<circle r="8" fill="${GOLD}"/><path d="M-8 0 Q-14 -10 -6 -12 M8 0 Q14 -10 6 -12 M0 -8 Q0 -16 4 -18" stroke="${GOLD}" stroke-width="2" fill="none"/>`, "hs-glow", i * 0.5)).join("") +
      woman(660, 110, 1, true, { arm: false }) + hoplite(740, 110, 1, true, { crest: false, shield: false, spear: null }) +
      windCurls(370, 120, 1) + windCurls(470, 106, 0.8),

    "o-cyclops": () => waves(206) +
      `<path d="M60 240 L60 90 Q170 -20 300 80 L300 240 Z" fill="${INK}"/>
       <path d="M130 240 L130 140 Q180 96 240 140 L240 240 Z" fill="#331409"/>` +
      bigEye(185, 70, 1.15) +
      rock(420, 160, 1.4) +
      `<path d="M370 120 Q400 140 415 158 M480 130 Q450 148 432 160" stroke="${CREAM}" stroke-width="2" fill="none" opacity="0.6"/>` +
      ship(600, 178, 1.05, false, 0.2),

    "o-winds": () => waves(202) +
      g(230, 90, 1.5, false, `
        <path d="M0 0 Q-18 8 -16 26 Q-14 44 0 47 Q14 44 16 26 Q18 8 0 0 Z" fill="${INK}"/>
        <path d="M-5 -2 L5 -2 L3 -10 L-3 -10 Z" fill="${INK}"/><path d="M-6 -4 L6 -4" stroke="${GOLD}" stroke-width="2.4"/>`) +
      windCurls(280, 100, 1.4) + windCurls(320, 140, 1.1) +
      ship(560, 174, 1.1, true, 0),

    "o-giants": () => waves(208) +
      cliff(60, 60, 1.15, false) + cliff(700, 60, 1.15, true) +
      ship(380, 186, 0.85, false, 0) + ship(520, 190, 0.8, false, 0.6) +
      rock(350, 90, 1.2) + rock(510, 60, 1) + rock(440, 120, 0.85) +
      `<path d="M350 104 L350 150 M510 74 L510 130 M440 132 L440 168" stroke="${CREAM}" stroke-width="1.6" stroke-dasharray="3 6" opacity="0.7"/>`,

    "o-circe": () => ground() +
      woman(330, 106, 1.15, false) +
      `<path d="M382 130 L432 96" stroke="${GOLD}" stroke-width="2.6"/><circle cx="436" cy="93" r="4" fill="${GOLD}" class="hs-glow"/>` +
      `<rect x="472" y="168" width="26" height="42" fill="${INK}"/><path d="M462 168 L508 168 L500 148 L470 148 Z" fill="${INK}"/><path d="M470 148 Q485 156 500 148" stroke="${GOLD}" stroke-width="1.6" fill="none"/>` +
      pig(600, 196, 1.15, false, 0) + pig(680, 199, 0.95, true, 0.6) + pig(750, 196, 1.05, false, 1.1) +
      `<circle cx="530" cy="120" r="2.4" fill="${GOLD}" class="hs-glow"/><circle cx="560" cy="100" r="2" fill="${GOLD}" class="hs-glow" style="animation-delay:0.7s"/><circle cx="590" cy="126" r="2.2" fill="${GOLD}" class="hs-glow" style="animation-delay:1.3s"/>`,

    "o-dead": () => stars([[150, 60], [260, 40], [700, 50], [800, 90]]) + moon(760, 60, 1.1) +
      `<rect x="330" y="196" width="240" height="14" fill="${INK}"/>` +
      hoplite(230, 106, 1.05, false, { spear: null }) +
      ghost(430, 190, 1.3, 0) + ghost(510, 186, 1.5, 0.9) + ghost(590, 190, 1.2, 1.7) +
      `<rect x="0" y="0" width="900" height="260" fill="${INK}" opacity="0.12"/>`,

    "o-sirens": () => waves(200) +
      rock(160, 176, 2.2) + rock(760, 172, 2.4) +
      siren(140, 138, 1.3, false, 0) + siren(760, 134, 1.3, true, 0.7) +
      note(200, 120, 0) + note(720, 110, 1) + note(250, 90, 2) +
      ship(400, 172, 1.1, false, 0.3) +
      `<rect x="446" y="126" width="3" height="24" fill="${INK}"/><circle cx="447.5" cy="122" r="4.5" fill="${INK}"/><path d="M440 132 L456 140 M440 140 L456 132" stroke="${GOLD}" stroke-width="1.6"/>`,

    "o-strait": () => waves(204) +
      whirl(180, 190, 1.15) +
      `<path d="M690 240 L690 150 Q740 110 790 150 L790 240 Z" fill="${INK}"/>` +
      [0, 1, 2, 3, 4, 5].map((i) => {
        const bx = 700 + i * 16, hy = 96 - (i % 3) * 18;
        return `<path d="M${bx} 150 Q${bx - 24} ${hy + 30} ${bx - 10} ${hy}" stroke="${INK}" stroke-width="7" fill="none"/><circle cx="${bx - 12}" cy="${hy - 4}" r="6" fill="${INK}"/><path d="M${bx - 18} ${hy - 4} L${bx - 26} ${hy - 1} L${bx - 18} ${hy + 2} Z" fill="${INK}"/>`;
      }).join("") +
      ship(420, 176, 1, false, 0),

    "o-cattle": () => ground() + sun(450, 58, 1.5) +
      cow(240, 190, 1.3, false, 0) + cow(400, 194, 1.1, true, 0.6) +
      waves(214) + ship(700, 188, 0.9, false, 0) +
      `<path d="M480 74 L560 120 L540 124 L640 170" stroke="${GOLD}" stroke-width="3.4" fill="none" class="hs-glow"/>`,

    "o-calypso": () => sun(140, 170, 1.6) + waves(206) +
      `<path d="M420 214 Q560 120 720 214 Z" fill="${INK}" opacity="0.88"/>` + tree(600, 158, 1.25) +
      hoplite(480, 116, 0.95, true, { crest: false, shield: false, spear: null }) +
      woman(560, 118, 0.9, true),

    "o-phaeacians": () => waves(202) + ship(180, 172, 1.15, false, 0) +
      ground() +
      `<rect x="470" y="176" width="44" height="30" fill="${INK}"/><path d="M466 176 L518 176" stroke="${GOLD}" stroke-width="3"/><path d="M492 176 L492 206" stroke="${GOLD}" stroke-width="2"/>` +
      woman(600, 110, 1.05, true) + woman(680, 112, 0.95, true, { crown: true }) + hoplite(760, 110, 1, true, { shield: false, spear: "staff" }),

    "o-ithaca": () => ground() + sun(120, 60, 1) +
      tree(660, 206, 1.5) +
      bow(180, 160, 1.1, false) +
      hoplite(380, 106, 1.1, false, { crest: false, shield: false, spear: null }) +
      woman(490, 106, 1.1, true) +
      `<path d="M420 130 L470 130" stroke="${GOLD}" stroke-width="2" opacity="0.8" class="hs-glow"/>` +
      dog(300, 196, 1.2, false),
  };

  // ---------- marching frieze (landing page band) ----------
  function frieze(uid) {
    const unit =
      hoplite(0, 4, 0.72, false, {}) + hoplite(70, 4, 0.72, false, {}) +
      g(150, 26, 0.34, false, `<g>${""}</g>`) + trojanHorse(140, -6, 0.42, false) +
      hoplite(230, 4, 0.72, false, {});
    let band = "";
    for (let i = 0; i < 5; i++) band += `<g transform="translate(${i * 300} 0)">${unit}</g>`;
    return `
<svg viewBox="0 0 900 84" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Marching Greek warriors frieze">
  <style>${STYLE}</style>
  <defs>
    <linearGradient id="fz-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b5532c"/><stop offset="1" stop-color="#8f3c1f"/>
    </linearGradient>
  </defs>
  <rect width="900" height="84" fill="url(#fz-${uid})"/>
  <rect y="4" width="900" height="3" fill="${INK}" opacity="0.5"/>
  <rect y="77" width="900" height="3" fill="${INK}" opacity="0.5"/>
  <g class="hs-march"><g transform="translate(0 6)">${band}</g></g>
</svg>`;
  }

  function render(sceneId, uid) {
    const builder = SCENES[sceneId];
    if (!builder) return "";
    return panel(builder(uid), uid, { label: sceneId });
  }

  return { render, frieze };
})();
