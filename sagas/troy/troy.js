/* Saga 01 — Troy page renderer: chapters, 3D horse, character web, myth-vs-dig */

document.addEventListener("DOMContentLoaded", () => {
  const D = TROY_DATA;

  // ---------- chapters ----------
  const tl = document.getElementById("timeline");
  D.chapters.forEach((ch, i) => {
    const el = document.createElement("article");
    el.className = "chapter";
    el.innerHTML = `
      <div class="medallion"><span style="font-size:1.7rem">${ch.icon}</span></div>
      <div class="chapter-num">Chapter ${String(i + 1).padStart(2, "0")}</div>
      <h3>${ch.title}</h3>
      <div class="scene-wrap">${HSScenes.render(ch.scene, "tc" + i)}</div>
      <p class="story">${ch.story}</p>
      <div data-facts='${JSON.stringify(ch.facts).replace(/'/g, "&#39;")}'></div>`;
    tl.appendChild(el);
  });
  HS.renderFacts();
  // observe the freshly created chapters
  const obs = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".chapter").forEach((el) => obs.observe(el));

  // ---------- 3D trojan horse ----------
  const horseCanvas = document.getElementById("horse-canvas");
  if (horseCanvas) {
    E3D.createScene(horseCanvas, {
      mesh: E3D.horseMesh(),
      camDist: 640,
      fov: 720,
      rx: 0.22,
      ry: 2.4,
      autoSpin: 0.004,
    });
  }

  // ---------- 3D citadel of troy (burning, with embers) ----------
  const cityCanvas = document.getElementById("city-canvas");
  if (cityCanvas) {
    E3D.createScene(cityCanvas, {
      mesh: E3D.cityMesh(),
      camDist: 760,
      fov: 760,
      rx: 0.42,
      ry: 0.4,
      autoSpin: 0.0028,
      overlay: E3D.emberOverlay(),
    });
  }

  // ---------- character web (SVG) ----------
  const svg = document.getElementById("char-web");
  if (svg) buildCharacterWeb(svg, D.characters);

  // ---------- myth vs dig ----------
  const mvd = document.getElementById("mvd");
  D.mythVsDig.forEach((pair) => {
    const row = document.createElement("div");
    row.className = "mvd-grid reveal";
    row.style.marginBottom = "1.4rem";
    row.innerHTML = `
      <div class="mvd-card myth"><h4>🏺 The Myth Says</h4><p>${pair.myth}</p></div>
      <div class="mvd-card dig"><h4>⛏️ The Dig Says</h4><p>${pair.dig}</p></div>`;
    mvd.appendChild(row);
    obs.observe(row);
  });
});

function buildCharacterWeb(svg, data) {
  const NS = "http://www.w3.org/2000/svg";
  const EDGE_STYLE = {
    family: { color: "#8c9bb5", dash: "" },
    love: { color: "#e8794a", dash: "" },
    supports: { color: "#d9a441", dash: "6 5" },
    conflict: { color: "#c0392b", dash: "2 5" },
  };
  const GROUP_STYLE = {
    gods: { fill: "#2a3a5e", stroke: "#d9a441", text: "#f0c26a" },
    greeks: { fill: "#1e3a2f", stroke: "#7a8450", text: "#c9d19a" },
    trojans: { fill: "#3d2318", stroke: "#c95d33", text: "#eba57f" },
  };

  const nodes = {};
  for (const group of ["gods", "greeks", "trojans"])
    for (const n of data[group]) nodes[n.id] = { ...n, group };

  const edgeLayer = document.createElementNS(NS, "g");
  const nodeLayer = document.createElementNS(NS, "g");
  svg.appendChild(edgeLayer);
  svg.appendChild(nodeLayer);

  const edgeEls = [];
  for (const e of data.edges) {
    const a = nodes[e.from], b = nodes[e.to];
    const style = EDGE_STYLE[e.type];
    const path = document.createElementNS(NS, "path");
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 26;
    path.setAttribute("d", `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", style.color);
    path.setAttribute("stroke-width", "1.8");
    path.setAttribute("stroke-opacity", "0.55");
    if (style.dash) path.setAttribute("stroke-dasharray", style.dash);
    edgeLayer.appendChild(path);

    const label = document.createElementNS(NS, "text");
    label.setAttribute("x", mx);
    label.setAttribute("y", my + 12);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "11");
    label.setAttribute("fill", style.color);
    label.setAttribute("opacity", "0");
    label.textContent = e.label;
    edgeLayer.appendChild(label);
    edgeEls.push({ path, label, from: e.from, to: e.to });
  }

  for (const id in nodes) {
    const n = nodes[id];
    const gs = GROUP_STYLE[n.group];
    const g = document.createElementNS(NS, "g");
    g.style.cursor = "pointer";

    const rect = document.createElementNS(NS, "rect");
    const w = n.name.length * 8.5 + 26;
    rect.setAttribute("x", n.x - w / 2);
    rect.setAttribute("y", n.y - 15);
    rect.setAttribute("width", w);
    rect.setAttribute("height", 30);
    rect.setAttribute("rx", 15);
    rect.setAttribute("fill", gs.fill);
    rect.setAttribute("stroke", gs.stroke);
    rect.setAttribute("stroke-width", "1.4");
    g.appendChild(rect);

    const text = document.createElementNS(NS, "text");
    text.setAttribute("x", n.x);
    text.setAttribute("y", n.y + 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "13.5");
    text.setAttribute("font-family", "Cinzel, Georgia, serif");
    text.setAttribute("fill", gs.text);
    text.textContent = n.name;
    g.appendChild(text);

    const highlight = (on) => {
      for (const e of edgeEls) {
        const hit = e.from === id || e.to === id;
        e.path.setAttribute("stroke-opacity", on ? (hit ? "1" : "0.08") : "0.55");
        e.path.setAttribute("stroke-width", on && hit ? "2.6" : "1.8");
        e.label.setAttribute("opacity", on && hit ? "1" : "0");
      }
    };
    g.addEventListener("mouseenter", () => highlight(true));
    g.addEventListener("mouseleave", () => highlight(false));
    g.addEventListener("touchstart", () => highlight(true), { passive: true });
    nodeLayer.appendChild(g);
  }

  // group headers
  const headers = [
    { text: "⚡ OLYMPUS", x: 460, y: 22, color: "#f0c26a" },
    { text: "🛡 THE GREEKS", x: 170, y: 210, color: "#c9d19a" },
    { text: "🏰 THE TROJANS", x: 790, y: 210, color: "#eba57f" },
  ];
  for (const h of headers) {
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", h.x);
    t.setAttribute("y", h.y);
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("font-size", "13");
    t.setAttribute("letter-spacing", "3");
    t.setAttribute("font-family", "Cinzel, Georgia, serif");
    t.setAttribute("fill", h.color);
    t.textContent = h.text;
    nodeLayer.appendChild(t);
  }
}
