/* HistoryScapes shared runtime: persona switcher, starfield, scroll reveals */

const HS = (() => {
  // ---------- persona (audience) system ----------
  const PERSONAS = {
    explorer: { label: "🧭 Young Explorer", factLabel: "Did you know?" },
    moviebuff: { label: "🎬 Movie Buff", factLabel: "Screen & Story" },
    historian: { label: "🏛️ Historian", factLabel: "The Evidence" },
  };

  function getPersona() {
    const p = localStorage.getItem("hs-persona");
    return PERSONAS[p] ? p : "moviebuff";
  }

  function setPersona(p) {
    localStorage.setItem("hs-persona", p);
    document.querySelectorAll(".persona-switch button").forEach((b) => {
      b.classList.toggle("active", b.dataset.persona === p);
    });
    renderFacts();
    document.dispatchEvent(new CustomEvent("hs:persona", { detail: p }));
  }

  function mountPersonaSwitch(el) {
    el.innerHTML = "";
    for (const [key, cfg] of Object.entries(PERSONAS)) {
      const btn = document.createElement("button");
      btn.dataset.persona = key;
      btn.textContent = cfg.label;
      btn.addEventListener("click", () => setPersona(key));
      el.appendChild(btn);
    }
  }

  // Any element with data-facts='{"explorer":"...","moviebuff":"...","historian":"..."}'
  // gets a persona-aware fact card rendered inside it.
  function renderFacts() {
    const p = getPersona();
    document.querySelectorAll("[data-facts]").forEach((el) => {
      let facts;
      try { facts = JSON.parse(el.dataset.facts); } catch { return; }
      const text = facts[p] || facts.moviebuff || "";
      el.innerHTML = `
        <div class="fact-label">${PERSONAS[p].factLabel}</div>
        <div class="fact-text">${text}</div>`;
      el.classList.add("fact-card");
    });
  }

  // ---------- starfield background ----------
  function startStarfield() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let stars = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.min(180, (innerWidth * innerHeight) / 9000) }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 1.4 + 0.3,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.02 + 0.006,
      }));
    }
    resize();
    addEventListener("resize", resize);

    let meteor = null;
    let frameN = 0;
    (function frame() {
      requestAnimationFrame(frame);
      frameN++;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      // subtle deep-sea gradient at the bottom
      const g = ctx.createLinearGradient(0, innerHeight * 0.55, 0, innerHeight);
      g.addColorStop(0, "rgba(18,32,58,0)");
      g.addColorStop(1, "rgba(18,32,58,0.65)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      for (const s of stars) {
        s.tw += s.sp;
        const a = 0.25 + Math.abs(Math.sin(s.tw)) * 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,214,150,${a})`;
        ctx.fill();
      }
      // an occasional shooting star
      if (!meteor && frameN % 420 === 0 && Math.random() < 0.75) {
        meteor = {
          x: innerWidth * (0.2 + Math.random() * 0.7),
          y: innerHeight * Math.random() * 0.3,
          vx: -(5 + Math.random() * 4),
          vy: 2.4 + Math.random() * 2,
          life: 1,
        };
      }
      if (meteor) {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.life -= 0.02;
        const grad = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx * 9, meteor.y - meteor.vy * 9);
        grad.addColorStop(0, `rgba(243,234,215,${Math.max(0, meteor.life)})`);
        grad.addColorStop(1, "rgba(243,234,215,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.vx * 9, meteor.y - meteor.vy * 9);
        ctx.stroke();
        if (meteor.life <= 0) meteor = null;
      }
    })();
  }

  // ---------- scroll reveals ----------
  function startReveals() {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal, .chapter").forEach((el) => obs.observe(el));
  }

  // ---------- boot ----------
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".persona-switch").forEach(mountPersonaSwitch);
    setPersona(getPersona());
    startStarfield();
    startReveals();
  });

  return { getPersona, setPersona, renderFacts, PERSONAS };
})();
