/* ============================================================
   HistoryScapes micro 3D engine — zero dependencies.
   Low-poly meshes, perspective projection, flat shading,
   painter's algorithm, drag-to-orbit. ~300 lines, no WebGL.
   ============================================================ */

const E3D = (() => {
  // ---------- vector helpers ----------
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const norm = (v) => {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  };
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  function rotXYZ([x, y, z], rx, ry) {
    // Y then X rotation (orbit style)
    let c = Math.cos(ry), s = Math.sin(ry);
    let x1 = x * c + z * s, z1 = -x * s + z * c;
    c = Math.cos(rx); s = Math.sin(rx);
    const y1 = y * c - z1 * s, z2 = y * s + z1 * c;
    return [x1, y1, z2];
  }

  // ---------- mesh builders ----------
  // A mesh is {verts: [[x,y,z]], faces: [{idx:[a,b,c,d?], color:[r,g,b]}]}
  function emptyMesh() { return { verts: [], faces: [] }; }

  function addBox(mesh, cx, cy, cz, w, h, d, color, ry = 0) {
    const hw = w / 2, hh = h / 2, hd = d / 2;
    let corners = [
      [-hw, -hh, -hd], [hw, -hh, -hd], [hw, hh, -hd], [-hw, hh, -hd],
      [-hw, -hh, hd], [hw, -hh, hd], [hw, hh, hd], [-hw, hh, hd],
    ];
    if (ry) corners = corners.map(([x, y, z]) => {
      const c = Math.cos(ry), s = Math.sin(ry);
      return [x * c + z * s, y, -x * s + z * c];
    });
    const base = mesh.verts.length;
    corners.forEach(([x, y, z]) => mesh.verts.push([cx + x, cy + y, cz + z]));
    const f = [
      [0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7],
      [1, 5, 6, 2], [4, 5, 1, 0], [3, 2, 6, 7],
    ];
    f.forEach((idx) => mesh.faces.push({ idx: idx.map((i) => i + base), color }));
  }

  function addPrism(mesh, cx, cy, cz, radius, height, sides, color, radius2) {
    // vertical prism / truncated cone (cylinder approximation)
    const r2 = radius2 === undefined ? radius : radius2;
    const base = mesh.verts.length;
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2;
      mesh.verts.push([cx + Math.cos(a) * radius, cy + height / 2, cz + Math.sin(a) * radius]);
    }
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2;
      mesh.verts.push([cx + Math.cos(a) * r2, cy - height / 2, cz + Math.sin(a) * r2]);
    }
    for (let i = 0; i < sides; i++) {
      const j = (i + 1) % sides;
      mesh.faces.push({ idx: [base + i, base + j, base + sides + j, base + sides + i], color });
    }
    mesh.faces.push({ idx: Array.from({ length: sides }, (_, i) => base + sides + i), color });
    mesh.faces.push({ idx: Array.from({ length: sides }, (_, i) => base + (sides - 1 - i)), color });
  }

  function addPrismZ(mesh, cx, cy, cz, radius, depth, sides, color) {
    // prism whose axis runs along z (wheels, drums seen from the side)
    const base = mesh.verts.length;
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2;
      mesh.verts.push([cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, cz + depth / 2]);
    }
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2;
      mesh.verts.push([cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, cz - depth / 2]);
    }
    for (let i = 0; i < sides; i++) {
      const j = (i + 1) % sides;
      mesh.faces.push({ idx: [base + i, base + j, base + sides + j, base + sides + i], color });
    }
    mesh.faces.push({ idx: Array.from({ length: sides }, (_, i) => base + i), color });
    mesh.faces.push({ idx: Array.from({ length: sides }, (_, i) => base + sides + (sides - 1 - i)), color });
    return base;
  }

  function addQuad(mesh, a, b, c, d, color) {
    const base = mesh.verts.length;
    mesh.verts.push(a, b, c, d);
    mesh.faces.push({ idx: [base, base + 1, base + 2, base + 3], color });
  }

  function merge(target, src) {
    const base = target.verts.length;
    src.verts.forEach((v) => target.verts.push(v.slice()));
    src.faces.forEach((f) => target.faces.push({ idx: f.idx.map((i) => i + base), color: f.color, doubleSided: f.doubleSided }));
  }

  function mergeT(target, src, s, tx, ty, tz) {
    // merge with uniform scale + translation
    const base = target.verts.length;
    src.verts.forEach((v) => target.verts.push([v[0] * s + tx, v[1] * s + ty, v[2] * s + tz]));
    src.faces.forEach((f) => target.faces.push({ idx: f.idx.map((i) => i + base), color: f.color, doubleSided: f.doubleSided }));
  }

  // ---------- renderer ----------
  function createScene(canvas, opts = {}) {
    const ctx = canvas.getContext("2d");
    const state = {
      mesh: opts.mesh || emptyMesh(),
      rx: opts.rx ?? 0.28,
      ry: opts.ry ?? 0.6,
      autoSpin: opts.autoSpin ?? 0.004,
      camDist: opts.camDist ?? 420,
      fov: opts.fov ?? 640,
      scale: opts.scale ?? 1,
      light: norm(opts.light || [-0.5, -0.8, -0.45]),
      fog: opts.fog ?? 0.0012,
      bg: opts.bg || null,
      overlay: opts.overlay || null,
      onFrame: opts.onFrame || null,
      dragging: false,
      running: true,
      lastX: 0, lastY: 0, t: 0,
    };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.w = r.width;
      state.h = r.height;
    }
    resize();
    window.addEventListener("resize", resize);

    // drag to orbit (mouse + touch)
    const down = (x, y) => { state.dragging = true; state.lastX = x; state.lastY = y; };
    const move = (x, y) => {
      if (!state.dragging) return;
      state.ry += (x - state.lastX) * 0.008;
      state.rx += (y - state.lastY) * 0.006;
      state.rx = Math.max(-0.2, Math.min(1.2, state.rx));
      state.lastX = x; state.lastY = y;
    };
    canvas.addEventListener("mousedown", (e) => down(e.clientX, e.clientY));
    window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
    window.addEventListener("mouseup", () => (state.dragging = false));
    canvas.addEventListener("touchstart", (e) => down(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    canvas.addEventListener("touchmove", (e) => move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    window.addEventListener("touchend", () => (state.dragging = false));

    // pause when offscreen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        state.running = entries[0].isIntersecting;
      }).observe(canvas);
    }

    function frame() {
      requestAnimationFrame(frame);
      if (!state.running) return;
      state.t += 1;
      if (!state.dragging) state.ry += state.autoSpin;
      if (state.onFrame) state.onFrame(state);

      ctx.clearRect(0, 0, state.w, state.h);
      if (state.bg) state.bg(ctx, state);

      const { mesh } = state;
      const cx = state.w / 2, cy = state.h / 2;
      const projected = new Array(mesh.verts.length);
      const rotated = new Array(mesh.verts.length);

      for (let i = 0; i < mesh.verts.length; i++) {
        const v = rotXYZ(mesh.verts[i], state.rx, state.ry);
        rotated[i] = v;
        const z = v[2] + state.camDist;
        const f = state.fov / Math.max(z, 40);
        projected[i] = [cx + v[0] * f * state.scale, cy + v[1] * f * state.scale, z];
      }

      // depth sort faces (painter's algorithm)
      const order = mesh.faces
        .map((face, i) => {
          let z = 0;
          for (const idx of face.idx) z += projected[idx][2];
          return { i, z: z / face.idx.length };
        })
        .sort((a, b) => b.z - a.z);

      for (const { i, z } of order) {
        const face = mesh.faces[i];
        const p0 = rotated[face.idx[0]], p1 = rotated[face.idx[1]], p2 = rotated[face.idx[2]];
        const n = norm(cross(sub(p1, p0), sub(p2, p0)));
        // backface cull: normal pointing away from camera
        if (n[2] > 0.02 && !face.doubleSided) continue;
        const lum = Math.min(1, Math.max(0.18, dot(n, state.light) * 0.85 + 0.35));
        const fogF = Math.max(0, 1 - (z - state.camDist + 160) * state.fog);
        const [r, g, b] = face.color;
        ctx.fillStyle = `rgb(${(r * lum * fogF) | 0},${(g * lum * fogF) | 0},${(b * lum * fogF) | 0})`;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        const q0 = projected[face.idx[0]];
        ctx.moveTo(q0[0], q0[1]);
        for (let k = 1; k < face.idx.length; k++) {
          const q = projected[face.idx[k]];
          ctx.lineTo(q[0], q[1]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      if (state.overlay) state.overlay(ctx, state);
    }
    frame();
    return state;
  }

  // ---------- palette (matches CSS) ----------
  const C = {
    marble: [210, 200, 175],
    marbleDark: [165, 152, 128],
    gold: [217, 164, 65],
    terracotta: [201, 93, 51],
    wood: [125, 88, 52],
    woodDark: [96, 66, 38],
    sea: [26, 60, 95],
    seaLight: [34, 74, 113],
    sail: [232, 221, 195],
    bronze: [140, 106, 63],
    stone: [148, 138, 120],
    stoneDark: [112, 102, 86],
    roof: [176, 84, 48],
    sand: [168, 148, 108],
  };

  // ---------- prefab: greek temple ----------
  function templeMesh() {
    const m = emptyMesh();
    // stepped platform (crepidoma)
    addBox(m, 0, 62, 0, 320, 14, 190, C.marbleDark);
    addBox(m, 0, 48, 0, 296, 14, 166, C.marble);
    addBox(m, 0, 34, 0, 272, 14, 142, C.marbleDark);
    // columns: 6 across front/back, 3 more per side
    const colY = -8, colH = 70;
    const xs = [-115, -69, -23, 23, 69, 115];
    const zs = [-52, 52];
    for (const x of xs) for (const z of zs) addPrism(m, x, colY, z, 9, colH, 8, C.marble, 11);
    for (const z of [-17.3, 17.3]) for (const x of [-115, 115]) addPrism(m, x, colY, z, 9, colH, 8, C.marble, 11);
    // capitals
    for (const x of xs) for (const z of zs) addBox(m, x, -46, z, 26, 6, 26, C.marbleDark);
    for (const z of [-17.3, 17.3]) for (const x of [-115, 115]) addBox(m, x, -46, z, 26, 6, 26, C.marbleDark);
    // entablature
    addBox(m, 0, -57, 0, 320, 16, 190, C.marble);
    // pediment (triangular prism)
    const base = m.verts.length;
    m.verts.push(
      [-160, -65, -95], [160, -65, -95], [160, -65, 95], [-160, -65, 95],
      [-160, -108, 0], [160, -108, 0]
    );
    m.faces.push(
      { idx: [base, base + 1, base + 5, base + 4], color: C.terracotta },
      { idx: [base + 2, base + 3, base + 4, base + 5], color: C.terracotta },
      { idx: [base + 1, base + 2, base + 5], color: C.marbleDark },
      { idx: [base + 3, base, base + 4], color: C.marbleDark }
    );
    // inner cella
    addBox(m, 0, -5, 0, 190, 64, 90, C.marbleDark);
    return m;
  }

  // ---------- prefab: trojan horse ----------
  function horseMesh() {
    const m = emptyMesh();
    const W = C.wood, WD = C.woodDark;
    // wheeled platform
    addBox(m, 0, 96, 0, 220, 14, 110, WD);
    for (const x of [-80, 80]) for (const z of [-62, 62])
      addPrismZ(m, x, 112, z, 20, 12, 10, W); // wheels, axis along z
    // legs
    for (const x of [-62, 62]) for (const z of [-26, 26])
      addBox(m, x, 40, z, 22, 100, 22, W);
    // body
    addBox(m, 0, -34, 0, 190, 68, 74, W);
    addBox(m, 0, -66, 0, 150, 16, 60, WD); // spine ridge
    // chest + rump taper
    addBox(m, -104, -34, 0, 24, 54, 58, WD);
    addBox(m, 102, -40, 0, 20, 44, 50, WD);
    // neck (angled)
    addBox(m, -112, -102, 0, 34, 90, 34, W, 0);
    // head
    addBox(m, -136, -152, 0, 64, 30, 28, WD);
    addBox(m, -166, -146, 0, 26, 20, 20, W); // muzzle
    // ears
    addBox(m, -118, -172, -8, 10, 16, 8, WD);
    addBox(m, -118, -172, 8, 10, 16, 8, WD);
    // mane plates
    for (let i = 0; i < 4; i++) addBox(m, -96 + i * 6, -128 + i * 14, 0, 8, 18, 20, C.bronze);
    // tail
    addBox(m, 116, -64, 0, 14, 52, 14, WD);
    // trapdoor (the famous belly hatch)
    addBox(m, 8, 2, 0, 52, 6, 40, C.bronze);
    return m;
  }

  // ---------- prefab: the citadel of troy (with horse at the gate) ----------
  function cityMesh() {
    const m = emptyMesh();
    // plain
    addBox(m, 0, 118, 30, 620, 16, 520, C.sand);
    const gTop = 110; // ground surface y
    // wall circuit 400 x 300, front wall (z=+150) has a gate gap
    const wallH = 48, wallT = 18;
    const wy = gTop - wallH / 2;
    addBox(m, 0, wy, -150, 400, wallH, wallT, C.stone);            // back
    addBox(m, -200, wy, 0, wallT, wallH, 300, C.stoneDark);        // left
    addBox(m, 200, wy, 0, wallT, wallH, 300, C.stoneDark);         // right
    addBox(m, -122, wy, 150, 156, wallH, wallT, C.stone);          // front-left
    addBox(m, 122, wy, 150, 156, wallH, wallT, C.stone);           // front-right
    addBox(m, 0, gTop - wallH - 8, 150, 100, 16, wallT, C.stone);  // gate lintel
    // gate towers
    addBox(m, -55, gTop - 38, 150, 26, 76, 30, C.stoneDark);
    addBox(m, 55, gTop - 38, 150, 26, 76, 30, C.stoneDark);
    // corner towers + roofs
    for (const x of [-195, 195]) for (const z of [-145, 145]) {
      addPrism(m, x, gTop - 38, z, 24, 76, 8, C.stone);
      addPrism(m, x, gTop - 86, z, 30, 22, 8, C.roof, 4);
    }
    // inner houses
    const houses = [
      [-120, -80, 60, 42, 54], [-40, -100, 50, 34, 44], [60, -70, 66, 40, 50],
      [130, -20, 46, 30, 40], [-140, 20, 52, 36, 46], [120, 70, 56, 34, 44], [-90, 90, 44, 30, 38],
    ];
    for (const [hx, hz, w, h, d] of houses) {
      addBox(m, hx, gTop - h / 2, hz, w, h, d, C.stoneDark);
      addBox(m, hx, gTop - h - 6, hz, w + 8, 12, d + 8, C.roof);
    }
    // central palace: platform + hall + pitched roof
    addBox(m, 0, gTop - 8, 10, 130, 16, 90, C.stone);
    addBox(m, 0, gTop - 46, 10, 100, 60, 64, C.stone);
    const b = m.verts.length;
    m.verts.push(
      [-58, gTop - 76, -26], [58, gTop - 76, -26], [58, gTop - 76, 46], [-58, gTop - 76, 46],
      [-58, gTop - 104, 10], [58, gTop - 104, 10]
    );
    m.faces.push(
      { idx: [b, b + 1, b + 5, b + 4], color: C.roof },
      { idx: [b + 2, b + 3, b + 4, b + 5], color: C.roof },
      { idx: [b + 1, b + 2, b + 5], color: C.stoneDark },
      { idx: [b + 3, b, b + 4], color: C.stoneDark }
    );
    // the horse waiting outside the gate
    mergeT(m, horseMesh(), 0.34, 10, gTop - 43, 226);
    return m;
  }

  // ember particle overlay for the burning-city scene (screen space)
  function emberOverlay() {
    let embers = [];
    return (ctx, s) => {
      if (embers.length < 42 && s.t % 3 === 0)
        embers.push({
          x: s.w / 2 + (Math.random() - 0.5) * s.w * 0.36,
          y: s.h * (0.42 + Math.random() * 0.22),
          vy: 0.5 + Math.random() * 0.8,
          vx: (Math.random() - 0.5) * 0.35,
          life: 1,
          r: 1 + Math.random() * 2,
        });
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const e of embers) {
        e.y -= e.vy; e.x += e.vx; e.life -= 0.008;
        const a = Math.max(0, e.life) * (0.5 + 0.5 * Math.sin(s.t * 0.2 + e.x));
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,160,70,${a.toFixed(3)})`;
        ctx.fill();
      }
      ctx.restore();
      embers = embers.filter((e) => e.life > 0);
    };
  }

  // ---------- prefab: odyssey ship on waves ----------
  function shipMesh() {
    const m = emptyMesh();
    // hull: curved profile built from cross-section slices
    const slices = [
      { x: -95, w: 4, top: -14, bot: -4 },   // stern tip (raised)
      { x: -70, w: 26, top: -6, bot: 14 },
      { x: -30, w: 34, top: -4, bot: 18 },
      { x: 20, w: 34, top: -4, bot: 18 },
      { x: 60, w: 28, top: -6, bot: 14 },
      { x: 92, w: 6, top: -18, bot: -2 },    // bow tip (raised, for ram)
    ];
    const top = [], bot = [];
    for (const s of slices) {
      top.push([[s.x, s.top, -s.w / 2], [s.x, s.top, s.w / 2]]);
      bot.push([s.x, s.bot, 0]);
    }
    for (let i = 0; i < slices.length - 1; i++) {
      addQuad(m, top[i][0], top[i + 1][0], [bot[i + 1][0], bot[i + 1][1], bot[i + 1][2]], [bot[i][0], bot[i][1], bot[i][2]], C.wood);       // port side
      addQuad(m, [bot[i][0], bot[i][1], bot[i][2]], [bot[i + 1][0], bot[i + 1][1], bot[i + 1][2]], top[i + 1][1], top[i][1], C.woodDark);   // starboard
      addQuad(m, top[i][1], top[i + 1][1], top[i + 1][0], top[i][0], C.woodDark); // deck
    }
    // eye of the ship (Greek ships had painted eyes) — small gold plates at bow
    addBox(m, 80, -8, 0, 10, 8, 30, C.gold);
    // mast + yard + sail
    addBox(m, -5, -70, 0, 6, 110, 6, C.woodDark);
    addBox(m, -5, -118, 0, 96, 5, 5, C.wood);
    const sail = emptyMesh();
    addQuad(sail, [-48, -114, 1], [42, -114, 1], [36, -34, 10], [-42, -34, 10], C.sail);
    sail.faces[0].doubleSided = true;
    merge(m, sail);
    // steering oars at stern
    addBox(m, -88, 6, -16, 5, 42, 5, C.woodDark, 0.3);
    addBox(m, -88, 6, 16, 5, 42, 5, C.woodDark, -0.3);
    return m;
  }

  // animated wave grid, rebuilt each frame around the ship
  function waveMesh(t) {
    const m = emptyMesh();
    const N = 11, S = 46;
    const h = (x, z) =>
      Math.sin(x * 0.018 + t * 0.045) * 7 +
      Math.cos(z * 0.02 + t * 0.03) * 6 +
      Math.sin((x + z) * 0.012 + t * 0.02) * 4;
    for (let i = 0; i < N - 1; i++) {
      for (let j = 0; j < N - 1; j++) {
        const x0 = (i - N / 2) * S, x1 = x0 + S;
        const z0 = (j - N / 2) * S, z1 = z0 + S;
        const y = 30;
        const shade = (i + j) % 2 === 0 ? C.sea : C.seaLight;
        addQuad(m,
          [x0, y + h(x0, z0), z0], [x1, y + h(x1, z0), z0],
          [x1, y + h(x1, z1), z1], [x0, y + h(x0, z1), z1], shade);
      }
    }
    return m;
  }

  return { createScene, emptyMesh, addBox, addPrism, addPrismZ, addQuad, merge, mergeT, templeMesh, horseMesh, shipMesh, waveMesh, cityMesh, emberOverlay, C };
})();
