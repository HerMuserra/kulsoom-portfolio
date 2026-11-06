(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("field");
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, particles = [], pointer = { x: -1000, y: -1000 };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(95, Math.floor(w * h / 14500));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
      r: Math.random() * 1.5 + .5
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p, i) => {
      const dx = pointer.x - p.x, dy = pointer.y - p.y, dist = Math.hypot(dx, dy);
      if (!reduced && dist < 135 && dist > 0) {
        p.x -= dx / dist * (135 - dist) * .012;
        p.y -= dy / dist * (135 - dist) * .012;
      }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,255,61,.62)"; ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 95) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = "rgba(200,255,61," + (1 - d / 95) * .11 + ")";
          ctx.lineWidth = .6; ctx.stroke();
        }
      }
    });
    if (!reduced) requestAnimationFrame(draw);
  };
  resize(); draw();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", e => {
    pointer.x = e.clientX; pointer.y = e.clientY;
    const cursor = document.querySelector(".cursor");
    if (cursor) { cursor.style.left = e.clientX + "px"; cursor.style.top = e.clientY + "px"; }
  }, { passive: true });
  document.querySelectorAll("a,button").forEach(el => {
    el.addEventListener("mouseenter", () => document.querySelector(".cursor")?.classList.add("active"));
    el.addEventListener("mouseleave", () => document.querySelector(".cursor")?.classList.remove("active"));
  });
  const menu = document.getElementById("menu"), nav = document.getElementById("nav");
  menu?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.textContent = open ? "CLOSE ×" : "MENU +";
  });
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open"); menu.textContent = "MENU +";
  }));
  const projects = {
    rizzume: {
      type: "NLP / TEXT SIMILARITY", title: "Rizzumé",
      desc: "An AI resume matching system that compares a resume with a job description and identifies relevant matches.",
      detail: "Built a text preparation and matching workflow using NLTK and scikit-learn. Tested the system with 10+ resumes. It is a learning prototype, not a hiring or ATS platform.",
      url: "https://github.com/HerMuserra/Rizzum-AI-Resume-Screener"
    },
    moodify: {
      type: "NLP / TEXT CLASSIFICATION", title: "Moodify",
      desc: "A text-based mood detector that reads song lyrics and predicts whether the mood is happy, sad, angry or chill.",
      detail: "Uses a simple Naive Bayes classifier and a small prototype lyrics dataset. The project work included preparing and testing the classifier with 20+ text samples.",
      url: "https://github.com/HerMuserra/Moodify-Music-Mood-Detector-"
    },
    lookie: {
      type: "COMPUTER VISION / IMAGE CLASSIFICATION", title: "LookieGlimmr",
      desc: "An image classification system that predicts what appears in an uploaded image.",
      detail: "Uses a pretrained MobileNetV2 model and a Streamlit interface to show the top prediction and confidence. The project involved preparing and processing 100+ images.",
      url: "https://github.com/HerMuserra/LookieGlimmr-AI-Image-Classifier"
    },
    ufit: {
      type: "AI PRODUCT / TEAM PROJECT", title: "UFit",
      desc: "An AI-based fitness recommendation application focused on personalised suggestions from user inputs and activity patterns.",
      detail: "Project lead for a team of four. Contributed to recommendation logic, planning, testing and project delivery. The resume describes this as a team project; no public repository link is currently listed."
    },
    scent: {
      type: "L’ORÉAL BRANDSTORM 2026 / CONCEPT", title: "Mood-based fragrance recommendations",
      desc: "An AI concept that identifies a user's mood from text and connects it with fragrance profiles to generate personalised suggestions.",
      detail: "Contributed to the concept and the interface for presenting recommendations. This is project experience / a concept, not a launched product.",
      url: "https://github.com/HerMuserra/Scentient"
    }
  };
  const modal = document.getElementById("modal");
  document.querySelectorAll("[data-project]").forEach(button => button.addEventListener("click", () => {
    const p = projects[button.dataset.project]; if (!p || !modal) return;
    document.getElementById("dtype").textContent = p.type;
    document.getElementById("dtitle").textContent = p.title;
    document.getElementById("ddesc").textContent = p.desc;
    document.getElementById("ddetail").textContent = p.detail;
    const link = document.getElementById("dlink");
    if (p.url) { link.href = p.url; link.hidden = false; } else { link.hidden = true; }
    modal.showModal();
  }));
  document.getElementById("close")?.addEventListener("click", () => modal.close());
  modal?.addEventListener("click", e => { if (e.target === modal) modal.close(); });
  if (!reduced && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("seen"); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll(".section,.hero,.project").forEach(el => observer.observe(el));
  }
})();