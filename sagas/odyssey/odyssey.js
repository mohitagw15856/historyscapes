/* Saga 02 — Odyssey page: 3D ship hero, interactive journey map, stop details */

document.addEventListener("DOMContentLoaded", () => {
  const D = ODYSSEY_DATA;
  document.getElementById("saga-intro").textContent = D.intro;

  // ---------- 3D ship on animated waves ----------
  const shipCanvas = document.getElementById("ship-canvas");
  if (shipCanvas) {
    const ship = E3D.shipMesh();
    E3D.createScene(shipCanvas, {
      mesh: E3D.emptyMesh(),
      camDist: 560,
      fov: 680,
      rx: 0.34,
      ry: 0.15,
      autoSpin: 0.0016,
      onFrame: (s) => {
        const m = E3D.waveMesh(s.t);
        const bob = Math.sin(s.t * 0.045) * 6;
        const roll = Math.sin(s.t * 0.03) * 0.07;
        const pitch = Math.cos(s.t * 0.04) * 0.05;
        const cr = Math.cos(roll), sr = Math.sin(roll);
        const cp = Math.cos(pitch), sp = Math.sin(pitch);
        const sm = {
          verts: ship.verts.map(([vx, vy, vz]) => {
            // scale up, pitch around z-axis, roll around x-axis, then bob
            const x = vx * 1.35, y = vy * 1.35, z = vz * 1.35;
            const x1 = x * cp - y * sp, y1 = x * sp + y * cp;
            const y2 = y1 * cr - z * sr, z2 = y1 * sr + z * cr;
            return [x1, y2 + bob + 2, z2];
          }),
          faces: ship.faces,
        };
        E3D.merge(m, sm);
        s.mesh = m;
      },
    });
  }

  // ---------- interactive map ----------
  const svg = document.getElementById("journey-map");
  const NS = "http://www.w3.org/2000/svg";
  let activeStop = 1;
  const nodeEls = {};

  // sea backdrop: soft radial glow + wave strokes
  const defs = document.createElementNS(NS, "defs");
  defs.innerHTML = `
    <radialGradient id="seaGlow" cx="45%" cy="45%" r="75%">
      <stop offset="0%" stop-color="#16315a"/>
      <stop offset="100%" stop-color="#0d1930"/>
    </radialGradient>
    <filter id="soften"><feGaussianBlur stdDeviation="0.4"/></filter>`;
  svg.appendChild(defs);

  const sea = document.createElementNS(NS, "rect");
  sea.setAttribute("width", "1000");
  sea.setAttribute("height", "620");
  sea.setAttribute("fill", "url(#seaGlow)");
  svg.appendChild(sea);

  // decorative wave strokes (deterministic layout)
  for (let i = 0; i < 46; i++) {
    const wx = ((i * 197) % 940) + 30;
    const wy = ((i * 149) % 560) + 30;
    const w = document.createElementNS(NS, "path");
    w.setAttribute("d", `M ${wx} ${wy} q 7 -5 14 0 q 7 5 14 0`);
    w.setAttribute("stroke", "rgba(120,160,210,0.16)");
    w.setAttribute("stroke-width", "1.6");
    w.setAttribute("fill", "none");
    svg.appendChild(w);
  }

  // compass rose
  const compass = document.createElementNS(NS, "g");
  compass.setAttribute("transform", "translate(935 555)");
  compass.innerHTML = `
    <circle r="30" fill="none" stroke="#d9a441" stroke-opacity="0.5"/>
    <path d="M0 -26 L6 0 L0 26 L-6 0 Z" fill="#d9a441" fill-opacity="0.7"/>
    <path d="M-26 0 L0 6 L26 0 L0 -6 Z" fill="#8c6a3f" fill-opacity="0.6"/>
    <text y="-34" text-anchor="middle" font-size="13" fill="#f0c26a" font-family="Cinzel,Georgia,serif">N</text>`;
  svg.appendChild(compass);

  // route path through all stops (smooth quadratic segments)
  const pts = D.stops.map((s) => [s.x, s.y]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    d += ` Q ${(px + x) / 2 + (i % 2 ? 24 : -24)} ${(py + y) / 2 + (i % 2 ? -18 : 18)} ${x} ${y}`;
  }
  const route = document.createElementNS(NS, "path");
  route.setAttribute("d", d);
  route.setAttribute("fill", "none");
  route.setAttribute("stroke", "#d9a441");
  route.setAttribute("stroke-width", "2.2");
  route.setAttribute("stroke-dasharray", "7 7");
  route.setAttribute("stroke-opacity", "0.75");
  svg.appendChild(route);

  // animate route dashes drifting + tiny ship sailing the route
  let dashOffset = 0;
  const sailShip = document.createElementNS(NS, "g");
  sailShip.innerHTML = `
    <path d="M -11 2 Q 0 8 11 2 L 8 -2 L -8 -2 Z" fill="#8c5a32" stroke="#d9a441" stroke-width="0.8"/>
    <path d="M 0 -2 L 0 -14 M 0 -13 Q 8 -8 0 -3" stroke="#f3ead7" stroke-width="1.4" fill="rgba(243,234,215,0.85)"/>`;
  svg.appendChild(sailShip);
  const routeLen = route.getTotalLength();
  let sailT = 0;
  (function animateMap() {
    requestAnimationFrame(animateMap);
    dashOffset -= 0.12;
    route.setAttribute("stroke-dashoffset", dashOffset);
    sailT = (sailT + 0.00035) % 1;
    const p = route.getPointAtLength(sailT * routeLen);
    const p2 = route.getPointAtLength(Math.min(sailT * routeLen + 2, routeLen));
    const ang = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
    const flip = Math.abs(ang) > 90 ? "scale(-1,1)" : "";
    sailShip.setAttribute("transform", `translate(${p.x} ${p.y - 6}) ${flip}`);
  })();

  // living decorations: sea serpent + gulls, and animation classes for island landmarks
  const decor = document.createElementNS(NS, "g");
  decor.innerHTML = `
    <style>
      .m-serp { animation: mSerp 5s ease-in-out infinite alternate }
      @keyframes mSerp { from { transform: translateY(0) } to { transform: translateY(7px) } }
      .m-flick { animation: mFlick 1.3s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 50% 100%; }
      @keyframes mFlick { from { transform: scaleY(1) } to { transform: scaleY(1.4) scaleX(0.82) } }
      .m-bob { animation: mBob 3s ease-in-out infinite alternate }
      @keyframes mBob { from { transform: translateY(0) } to { transform: translateY(4px) } }
      .m-blink { animation: mBlink 4.5s infinite; transform-box: fill-box; transform-origin: center; }
      @keyframes mBlink { 0%, 90%, 100% { transform: scaleY(1) } 94% { transform: scaleY(0.1) } }
      .m-spin { animation: mSpin 7s linear infinite; transform-box: fill-box; transform-origin: 50% 50%; }
      @keyframes mSpin { to { transform: rotate(360deg) } }
      .m-glow { animation: mGlow 2s ease-in-out infinite alternate }
      @keyframes mGlow { from { opacity: 0.4 } to { opacity: 1 } }
    </style>
    <g class="m-serp">
      <path d="M600 560 q14 -18 28 0 q14 18 28 0 q14 -18 28 0" fill="none" stroke="rgba(217,164,65,0.55)" stroke-width="3"/>
      <path d="M688 558 l10 -10 l2 12 Z" fill="rgba(217,164,65,0.55)"/>
    </g>
    <g class="m-bob" style="animation-delay:0.8s">
      <path d="M180 330 q6 -7 12 0 M192 330 q6 -7 12 0" fill="none" stroke="rgba(240,214,150,0.7)" stroke-width="2"/>
      <path d="M212 344 q5 -6 10 0 M222 344 q5 -6 10 0" fill="none" stroke="rgba(240,214,150,0.5)" stroke-width="1.8"/>
    </g>`;
  svg.appendChild(decor);

  // per-stop island landmarks, pottery style (local coords, base at 0,0)
  const GOLD = "#d9a441", CREAM = "#f3ead7", EMB = "#e8794a", DARK = "#241209", OLIVE = "#7a8450";
  const MOTIFS = {
    1: `<rect x="-13" y="-15" width="9" height="15" fill="${DARK}"/><rect x="4" y="-18" width="9" height="18" fill="${DARK}"/>
        <g class="m-flick"><path d="M-8.5 -15 Q-12 -21 -8.5 -28 Q-5 -21 -8.5 -15" fill="${EMB}"/></g>
        <g class="m-flick" style="animation-delay:0.5s"><path d="M8.5 -18 Q5 -24 8.5 -31 Q12 -24 8.5 -18" fill="${EMB}"/></g>`,
    2: `<path d="M-11 0 L9 -22 M9 0 L-11 -22" stroke="${GOLD}" stroke-width="2.2"/>
        <path d="M9 -22 L3 -21 L8 -16 Z M-11 -22 L-5 -21 L-10 -16 Z" fill="${GOLD}"/>`,
    3: `<g class="m-glow"><circle cy="-10" r="5.5" fill="${GOLD}"/>
        <path d="M-6 -10 Q-12 -19 -3 -19 M6 -10 Q12 -19 3 -19 M0 -15 Q0 -23 5 -24" stroke="${GOLD}" stroke-width="2" fill="none"/></g>`,
    4: `<g class="m-blink"><path d="M-14 -10 Q0 -21 14 -10 Q0 1 -14 -10 Z" fill="${CREAM}"/>
        <circle cy="-10" r="4.6" fill="${GOLD}"/><circle cy="-10" r="2.2" fill="${DARK}"/></g>`,
    5: `<g class="m-glow"><path d="M-12 -6 q8 -6 16 -2 q7 4 12 0 M-10 -14 q7 -5 14 -1" stroke="${CREAM}" stroke-width="2.2" fill="none"/></g>`,
    6: `<path d="M-14 0 L-9 -12 L0 -15 L7 -8 L9 0 Z" fill="${DARK}"/><path d="M2 -14 L7 -23 L14 -18 L13 -10 Z" fill="${DARK}" opacity="0.85"/>`,
    7: `<ellipse cx="0" cy="-6" rx="10" ry="6.5" fill="${DARK}"/><circle cx="-9.5" cy="-8.5" r="4.4" fill="${DARK}"/>
        <rect x="-15.5" y="-9.5" width="3.6" height="3" rx="1.2" fill="${DARK}"/>
        <path d="M-12 -12.5 L-10 -16 L-7.5 -12.5 Z" fill="${DARK}"/>
        <path d="M9.5 -8 q4 -2 3 -6" stroke="${DARK}" stroke-width="1.6" fill="none"/>`,
    8: `<g class="m-bob"><path d="M-5.5 0 Q-6 -17 0 -21 Q6 -17 5.5 0 Q3.5 -4 2 0 Q0 -4 -2 0 Q-3.5 -4 -5.5 0 Z" fill="${CREAM}" opacity="0.5"/>
        <circle cy="-16" r="3" fill="${CREAM}" opacity="0.65"/></g>`,
    9: `<g class="m-bob"><path d="M-3 -8 Q6 -13 12 -7 Q7 0 -2 -1 Z" fill="${DARK}"/>
        <path d="M0 -9 Q4 -18 12 -16 Q8 -10 3 -8 Z" fill="${DARK}"/>
        <circle cx="-5" cy="-13" r="3.4" fill="${DARK}"/></g>
        <text x="12" y="-18" font-size="11" fill="${CREAM}" class="m-glow">♪</text>`,
    10: `<g class="m-spin"><path d="M14 -10 A14 14 0 1 1 -14 -10 A11.5 11.5 0 1 1 10 -10 A8 8 0 1 1 -6 -10 A4.5 4.5 0 1 1 4 -10" fill="none" stroke="${CREAM}" stroke-width="2.2" opacity="0.85" transform="translate(0 0)"/></g>`,
    11: `<g class="m-glow"><circle cy="-16" r="5.5" fill="${GOLD}"/></g>
        <path d="M-10 -2 Q-13 -9 -8 -12 M10 -2 Q13 -9 8 -12" stroke="${GOLD}" stroke-width="2.2" fill="none"/>
        <path d="M-9 0 L9 0" stroke="${DARK}" stroke-width="3"/>`,
    12: `<path d="M0 0 Q-2 -10 -5 -17" stroke="${DARK}" stroke-width="3.4" fill="none"/>
        <circle cx="-8" cy="-21" r="5.5" fill="${OLIVE}"/><circle cx="-1" cy="-24" r="6" fill="${OLIVE}"/><circle cx="5" cy="-20" r="5" fill="${OLIVE}"/>`,
    13: `<g class="m-bob"><path d="M-13 -6 Q-6 2 0 2 Q8 2 13 -8 Q6 -3 0 -3 Q-7 -3 -13 -6 Z" fill="${DARK}"/>
        <circle cx="9" cy="-5.5" r="1.8" fill="${CREAM}"/><path d="M-12 -6 Q-15 -10 -13 -14" stroke="${DARK}" stroke-width="2" fill="none"/></g>`,
    14: `<path d="M-2 -24 Q12 -12 -2 0" stroke="${GOLD}" stroke-width="2.6" fill="none"/>
        <path d="M-2 -24 L-2 0" stroke="${CREAM}" stroke-width="1.2"/>
        <path d="M-5 -12 L14 -12 M14 -12 L9 -14.5 M14 -12 L9 -9.5" stroke="${DARK}" stroke-width="1.8"/>`,
  };

  // island blobs + stop nodes
  D.stops.forEach((stop) => {
    // island: layered irregular blob + landmark (deterministic per id)
    const island = document.createElementNS(NS, "g");
    const r = 24 + (stop.id % 3) * 4;
    let outer = "", inner = "";
    for (let a = 0; a <= 12; a++) {
      const ang = (a / 12) * Math.PI * 2;
      const wob = 1 + 0.28 * Math.sin(ang * 3 + stop.id * 1.7);
      outer += `${a === 0 ? "M" : "L"} ${(Math.cos(ang) * r * 1.3 * wob).toFixed(1)} ${(Math.sin(ang) * r * 0.62 * wob).toFixed(1)} `;
      inner += `${a === 0 ? "M" : "L"} ${(Math.cos(ang) * r * 0.85 * wob).toFixed(1)} ${(Math.sin(ang) * r * 0.4 * wob - 3).toFixed(1)} `;
    }
    const dx = stop.id % 2 ? 24 : -24;
    island.setAttribute("transform", `translate(${stop.x} ${stop.y})`);
    island.innerHTML = `
      <path d="${outer}Z" fill="rgba(140,106,63,0.45)" stroke="rgba(217,164,65,0.5)" stroke-width="1.2" filter="url(#soften)"/>
      <path d="${inner}Z" fill="rgba(181,83,44,0.4)"/>
      <g transform="translate(${dx} 6) scale(0.95)">${MOTIFS[stop.id] || ""}</g>`;
    svg.appendChild(island);

    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "stop-node");
    g.innerHTML = `
      <circle class="halo" cx="${stop.x}" cy="${stop.y}" r="16" fill="none" stroke="#e8794a" stroke-width="2" opacity="0"/>
      <circle cx="${stop.x}" cy="${stop.y}" r="10" fill="#12203a" stroke="#d9a441" stroke-width="2"/>
      <text x="${stop.x}" y="${stop.y + 4}" text-anchor="middle" font-size="10.5" fill="#f0c26a" font-family="Cinzel,Georgia,serif" font-weight="700">${stop.id}</text>
      <text x="${stop.x}" y="${stop.y - 20}" text-anchor="middle" font-size="13" fill="#f3ead7" font-family="Cinzel,Georgia,serif" style="text-shadow:0 1px 4px #000">${stop.name}</text>`;
    g.addEventListener("click", () => selectStop(stop.id));
    svg.appendChild(g);
    nodeEls[stop.id] = g;
  });

  // ---------- detail panel ----------
  const detail = document.getElementById("stop-detail");

  function selectStop(id) {
    activeStop = id;
    const stop = D.stops.find((s) => s.id === id);
    for (const [nid, el] of Object.entries(nodeEls))
      el.classList.toggle("active", Number(nid) === id);

    const persona = HS.getPersona();
    const factLabel = HS.PERSONAS[persona].factLabel;
    detail.innerHTML = `
      <div class="stop-kicker">Stop ${id} of ${D.stops.length} · ${stop.years}</div>
      <h3>${stop.icon} ${stop.name} <span style="color:var(--parchment-dim);font-size:1.05rem;font-family:var(--font-body);font-style:italic">— ${stop.sub}</span></h3>
      <div class="scene-wrap">${HSScenes.render(stop.scene, "os" + id)}</div>
      <p class="story">${stop.story}</p>
      <div class="fact-card">
        <div class="fact-label">${factLabel}</div>
        <div class="fact-text">${stop.facts[persona]}</div>
      </div>
      <div class="stop-nav">
        <button class="btn" id="prev-stop" ${id === 1 ? "disabled style='opacity:0.35'" : ""}>← ${id > 1 ? D.stops[id - 2].name : ""}</button>
        <button class="btn primary" id="next-stop" ${id === D.stops.length ? "disabled style='opacity:0.35'" : ""}>${id < D.stops.length ? D.stops[id].name : "Journey complete"} →</button>
      </div>`;
    const prev = document.getElementById("prev-stop");
    const next = document.getElementById("next-stop");
    if (prev && id > 1) prev.addEventListener("click", () => selectStop(id - 1));
    if (next && id < D.stops.length) next.addEventListener("click", () => selectStop(id + 1));
    document.dispatchEvent(new CustomEvent("hs:scenes"));
  }

  document.addEventListener("hs:persona", () => selectStop(activeStop));
  selectStop(1);
});
