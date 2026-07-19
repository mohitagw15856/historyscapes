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

  // living decorations: whirlpool, sea serpent, siren gulls, cyclops eye
  const decor = document.createElementNS(NS, "g");
  decor.innerHTML = `
    <g style="transform-box:fill-box;transform-origin:center;animation:spin 9s linear infinite">
      <path d="M 330 452 A 26 26 0 1 1 278 452 A 22 22 0 1 1 322 452 A 15 15 0 1 1 292 452 A 8 8 0 1 1 308 452"
        fill="none" stroke="rgba(200,225,255,0.5)" stroke-width="2.4" transform="translate(-4 8)"/>
    </g>
    <style>@keyframes spin { to { transform: rotate(360deg) } }
      .serp { animation: serp 5s ease-in-out infinite alternate }
      @keyframes serp { from { transform: translateY(0) } to { transform: translateY(7px) } }
      .gull { animation: serp 3s ease-in-out infinite alternate }
    </style>
    <g class="serp">
      <path d="M600 560 q14 -18 28 0 q14 18 28 0 q14 -18 28 0" fill="none" stroke="rgba(217,164,65,0.55)" stroke-width="3"/>
      <path d="M688 558 l10 -10 l2 12 Z" fill="rgba(217,164,65,0.55)"/>
    </g>
    <g class="gull" style="animation-delay:0.8s">
      <path d="M180 330 q6 -7 12 0 M192 330 q6 -7 12 0" fill="none" stroke="rgba(240,214,150,0.7)" stroke-width="2"/>
      <path d="M212 344 q5 -6 10 0 M222 344 q5 -6 10 0" fill="none" stroke="rgba(240,214,150,0.5)" stroke-width="1.8"/>
    </g>
    <g class="serp" style="animation-delay:1.4s">
      <ellipse cx="497" cy="398" rx="10" ry="6" fill="rgba(243,234,215,0.85)"/>
      <circle cx="497" cy="398" r="3.2" fill="#d9a441"/><circle cx="497" cy="398" r="1.5" fill="#241209"/>
    </g>`;
  svg.appendChild(decor);

  // island blobs + stop nodes
  D.stops.forEach((stop) => {
    // island: irregular blob under each stop (deterministic per id)
    const island = document.createElementNS(NS, "path");
    const r = 20 + (stop.id % 3) * 5;
    let path = "";
    for (let a = 0; a <= 12; a++) {
      const ang = (a / 12) * Math.PI * 2;
      const wobble = 1 + 0.28 * Math.sin(ang * 3 + stop.id * 1.7);
      const px = stop.x + Math.cos(ang) * r * wobble;
      const py = stop.y + Math.sin(ang) * r * 0.6 * wobble;
      path += (a === 0 ? "M" : "L") + ` ${px.toFixed(1)} ${py.toFixed(1)} `;
    }
    island.setAttribute("d", path + "Z");
    island.setAttribute("fill", "rgba(140,106,63,0.25)");
    island.setAttribute("stroke", "rgba(217,164,65,0.35)");
    island.setAttribute("filter", "url(#soften)");
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
  }

  document.addEventListener("hs:persona", () => selectStop(activeStop));
  selectStop(1);
});
