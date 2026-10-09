/* =========================================================
   Hivemind Media
   The two things you will edit most are right here at the top.
   ========================================================= */

/* 1. Where every "Book a Call" button goes.
      Paste your Calendly / Cal.com / Google Calendar booking link. */
const BOOKING_URL = "https://calendly.com/jamesraver-evangelista/30min";

/* 2. Project highlights (the scroll section with the phone and laptop).
      - First two entries play in the phone (vertical edits).
      - Last two play in the laptop (long-form edits).
      - Put your video files in assets/videos/ and match the names below.
      - The stats are SAMPLE numbers. Replace them with the real ones. */
const PROJECTS = [
  {
    type: "short",
    title: "Vertical edit 01",
    client: "Client name",
    video: "assets/videos/short-1.mp4",
    tone: "#ffc533",
    stats: [{ label: "Likes", value: "6,700" }, { label: "Views", value: "181,705" }],
  },
  {
    type: "short",
    title: "Vertical edit 02",
    client: "Client name",
    video: "assets/videos/short-2.mp4",
    tone: "#ff7a3d",
    stats: [{ label: "Likes", value: "756" }, { label: "Views", value: "20,602" }],
  },
  {
    type: "long",
    title: "Long-form edit 01",
    client: "Client name",
    video: "assets/videos/long-1.mp4",
    tone: "#3da5ff",
    stats: [{ label: "Views", value: "12,480" }, { label: "Watch hours", value: "1,150" }],
  },
  {
    type: "long",
    title: "Long-form edit 02",
    client: "Client name",
    video: "assets/videos/long-2.mp4",
    tone: "#8f6bff",
    stats: [{ label: "Views", value: "8,930" }, { label: "Watch hours", value: "740" }],
  },
];

const SUBTITLES = {
  short: "Vertical edits for Reels, TikTok and Shorts.",
  long: "Long-form edits for YouTube.",
};

/* ========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Book a Call links ---------- */
$$("[data-book]").forEach((a) => {
  a.href = BOOKING_URL;
  a.target = "_blank";
  a.rel = "noopener";
});

/* ---------- Footer year ---------- */
$("#year").textContent = new Date().getFullYear();

/* ---------- Mobile menu ---------- */
(() => {
  const toggle = $(".nav-toggle");
  const nav = $("#site-nav");
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => e.target.closest("a") && setOpen(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
})();

/* ---------- Project highlights: scroll-driven phone / laptop ---------- */
(() => {
  const section = $("#work");
  const stage = $("#stage");
  const feed = $("#feed");
  const dotsEl = $("#showcase-dots");
  const titleEl = $("#showcase-title");
  const clientEl = $("#showcase-client");
  const subEl = $("#showcase-sub");
  const statEls = [$("#stat-a"), $("#stat-b")];
  if (!section || !PROJECTS.length) return;

  const PLAY_ICON =
    '<svg viewBox="0 0 48 48"><path d="M24 3 42 13.500v21L24 45 6 34.500v-21z"/><path d="M20 17v14l12-7z"/></svg>';

  /* build slides + dots from PROJECTS */
  const slides = PROJECTS.map((p) => {
    const slide = document.createElement("div");
    slide.className = `slide slide--${p.type}`;
    slide.style.setProperty("--tone", p.tone || "");
    slide.innerHTML = `
      <div class="slide__ph">${PLAY_ICON}<b>${p.title}</b><code>${p.video || "add a video path in script.js"}</code></div>
      <div class="slide__ui">${p.type === "short" ? "<i></i><i></i><i></i>" : "<i></i>"}</div>`;
    if (p.video) {
      const v = document.createElement("video");
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = "metadata";
      v.src = p.video;
      v.setAttribute("aria-label", `${p.title}${p.client ? ", " + p.client : ""}`);
      v.addEventListener("loadeddata", () => slide.classList.add("has-video"));
      slide.insertBefore(v, slide.lastElementChild);
    }
    feed.appendChild(slide);
    dotsEl.appendChild(document.createElement("i"));
    return slide;
  });
  const dots = $$("i", dotsEl);

  /* device sizes in px, so the phone -> laptop change can animate */
  const sizeDevice = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight - 24; // leave room for the laptop base
    const narrow = window.innerWidth <= 820;
    const ph = Math.max(260, Math.min(h, 640));
    const pw = Math.min(ph * 0.487, w * 0.8);
    const lw = Math.max(240, Math.min(w * (narrow ? 0.84 : 0.56), h * 1.6, 900));
    stage.style.setProperty("--pw", `${Math.round(pw)}px`);
    stage.style.setProperty("--ph", `${Math.round(Math.min(ph, pw / 0.487))}px`);
    stage.style.setProperty("--lw", `${Math.round(lw)}px`);
    stage.style.setProperty("--lh", `${Math.round(lw / 1.6)}px`);
  };

  /* number count-up that keeps the original formatting ("181,705", "12.4K") */
  const countTo = (el, text) => {
    const m = String(text).match(/^([\d,.]+)(.*)$/);
    if (!m || reduceMotion) return void (el.textContent = text);
    const target = parseFloat(m[1].replace(/,/g, ""));
    const decimals = (m[1].split(".")[1] || "").length;
    const useCommas = m[1].includes(",");
    const start = performance.now();
    const token = (el._count = Symbol());
    const tick = (now) => {
      if (el._count !== token) return;
      const t = Math.min(1, (now - start) / 900);
      const n = target * (1 - Math.pow(1 - t, 3));
      let s = n.toFixed(decimals);
      if (useCommas) s = Number(s).toLocaleString("en-US", { minimumFractionDigits: decimals });
      el.textContent = s + m[2];
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = text;
    };
    requestAnimationFrame(tick);
  };

  let current = -1;
  const show = (i) => {
    if (i === current) return;
    const first = current === -1;
    current = i;
    const p = PROJECTS[i];

    feed.style.transform = `translateY(${-i * 100}%)`;
    stage.classList.toggle("is-laptop", p.type === "long");
    dots.forEach((d, n) => d.classList.toggle("is-on", n === i));

    titleEl.textContent = p.title;
    clientEl.textContent = p.client || "";

    if (subEl.textContent !== SUBTITLES[p.type]) {
      subEl.classList.add("is-out");
      setTimeout(() => {
        subEl.textContent = SUBTITLES[p.type];
        subEl.classList.remove("is-out");
      }, first ? 0 : 250);
    }

    statEls.forEach((el, n) => {
      const s = (p.stats || [])[n];
      el.hidden = !s;
      if (!s) return;
      const apply = () => {
        $(".stat__label", el).textContent = s.label;
        countTo($(".stat__value", el), s.value);
      };
      if (first) return apply();
      el.classList.remove("is-swapping");
      void el.offsetWidth; // restart the animation
      el.classList.add("is-swapping");
      setTimeout(apply, 220);
    });

    slides.forEach((s, n) => {
      const v = $("video", s);
      if (!v) return;
      if (n === i && stage.classList.contains("is-live")) v.play().catch(() => {});
      else v.pause();
    });
  };

  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / total));
    const live = rect.top < window.innerHeight * 0.45 && rect.bottom > window.innerHeight * 0.55;

    if (live !== stage.classList.contains("is-live")) {
      stage.classList.toggle("is-live", live);
      const v = $("video", slides[Math.max(0, current)]);
      if (v) live ? v.play().catch(() => {}) : v.pause();
    }
    stage.style.setProperty("--spin", `${(progress * 120).toFixed(1)}deg`);
    stage.style.setProperty("--drift", `${(Math.sin(progress * Math.PI * 4) * 14).toFixed(1)}px`);
    show(Math.min(PROJECTS.length - 1, Math.floor(progress * PROJECTS.length)));
  };
  const requestTick = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  };

  sizeDevice();
  onScroll();
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", () => {
    sizeDevice();
    requestTick();
  });
})();

/* ---------- Clients: continuous carousel ---------- */
(() => {
  const marquee = $("#marquee");
  if (!marquee) return;
  const track = $(".marquee__track", marquee);
  const originals = [...track.children];
  if (!originals.length) return;

  const clone = (node) => {
    const c = node.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    return c;
  };

  // repeat the logos until one "half" is wider than the screen, then double it for a seamless loop
  let guard = 0;
  while (track.scrollWidth < window.screen.width * 1.2 && guard++ < 12) {
    originals.forEach((n) => track.appendChild(clone(n)));
  }
  [...track.children].forEach((n) => track.appendChild(clone(n)));

  const pxPerSecond = 60;
  marquee.style.setProperty("--marquee-time", `${Math.round(track.scrollWidth / 2 / pxPerSecond)}s`);
  marquee.classList.add("is-ready");
})();

/* ---------- Testimonials carousel ---------- */
(() => {
  const list = $("#quotes");
  if (!list) return;
  const cards = $$(".quote", list);
  const dotsEl = $("#quotes-dots");
  cards.forEach(() => dotsEl.appendChild(document.createElement("i")));
  const dots = $$("i", dotsEl);

  const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(list).columnGap || 16);
  const index = () => {
    if (list.scrollLeft + list.clientWidth >= list.scrollWidth - 4) return cards.length - 1;
    return Math.min(cards.length - 1, Math.round(list.scrollLeft / step()));
  };
  const update = () => {
    const i = index();
    dots.forEach((d, n) => d.classList.toggle("is-on", n === i));
  };
  const go = (dir) => {
    const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 4;
    const atStart = list.scrollLeft <= 4;
    let left = list.scrollLeft + dir * step();
    if (dir > 0 && atEnd) left = 0;
    if (dir < 0 && atStart) left = list.scrollWidth;
    list.scrollTo({ left, behavior: reduceMotion ? "auto" : "smooth" });
  };

  $("#quotes-prev").addEventListener("click", () => go(-1));
  $("#quotes-next").addEventListener("click", () => go(1));
  list.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  update();
})();
