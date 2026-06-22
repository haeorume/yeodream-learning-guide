/**
 * 드래그로 패널 크기 조절 (PANDAS Ninja / svelte-splitter 스타일)
 */
const StudyLayoutSplitter = (() => {
  const STORAGE_KEY = "studyLab_layoutSizes_v1";

  const CONFIG = {
    "sidebar-main": {
      cssVar: "--layout-sidebar-w",
      axis: "x",
      min: 200,
      max: 480,
      default: 280,
      sign: 1,
    },
    "main-helpy": {
      cssVar: "--layout-helpy-w",
      axis: "x",
      min: 260,
      max: 640,
      default: 380,
      sign: -1,
      hiddenWhen: () => true,
    },
    "practice-guide": {
      cssVar: "--practice-guide-w",
      axis: "x",
      min: 220,
      max: 780,
      default: 360,
      sign: 1,
      container: () => document.getElementById("practice-workspace"),
    },
    "sandbox-editor": {
      cssVar: "--sandbox-editor-h",
      axis: "y",
      min: 140,
      max: 900,
      default: 280,
      sign: 1,
      container: () => document.getElementById("sandbox-workbench"),
      maxFromContainer: true,
    },
  };

  let state = {};

  function getApp() {
    return document.querySelector(".app");
  }

  function getVarScope() {
    return getApp() || document.documentElement;
  }

  function loadState() {
    try {
      state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
    } catch {
      state = {};
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function readPx(cssVar, fallback) {
    const raw = getComputedStyle(getVarScope()).getPropertyValue(cssVar).trim();
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : fallback;
  }

  function applySize(id, px) {
    const cfg = CONFIG[id];
    const scope = getVarScope();
    if (!cfg || !scope) return;
    const value = `${Math.round(px)}px`;
    scope.style.setProperty(cfg.cssVar, value);
    state[id] = Math.round(px);
    saveState();
    notifyResize();
  }

  function applyDefaults() {
    const scope = getVarScope();
    if (!scope) return;
    Object.entries(CONFIG).forEach(([id, cfg]) => {
      const val = state[id] ?? cfg.default;
      scope.style.setProperty(cfg.cssVar, `${val}px`);
    });
  }

  function notifyResize() {
    window.dispatchEvent(new Event("study-layout-resize"));
  }

  function isEnabled() {
    return window.matchMedia("(min-width: 1101px)").matches;
  }

  function clampSize(id, value, containerRect) {
    const cfg = CONFIG[id];
    let min = cfg.min;
    let max = cfg.max;
    if (cfg.maxFromContainer && containerRect) {
      const midbar = document.getElementById("sandbox-midbar");
      const midbarH =
        midbar && midbar.offsetParent !== null ? midbar.offsetHeight : 0;
      const terminalMin = readPx("--sandbox-terminal-min-h", 240);
      const splitterH = 10;
      const outputHead = 44;
      max = Math.max(
        min + 60,
        containerRect.height - terminalMin - midbarH - splitterH - outputHead
      );
    }
    return Math.min(max, Math.max(min, value));
  }

  function startDrag(splitter, cfg, id, event) {
    if (!isEnabled()) return;
    if (cfg.hiddenWhen?.()) return;

    const container = cfg.container?.() || getApp();
    if (!container) return;

    const startPos = cfg.axis === "x" ? event.clientX : event.clientY;
    const startSize = state[id] ?? readPx(cfg.cssVar, cfg.default);

    splitter.classList.add("is-dragging");
    document.body.classList.add("layout-split-dragging");
    document.body.style.cursor = cfg.axis === "x" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";

    try {
      splitter.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }

    function onMove(e) {
      if (e.pointerId !== undefined && e.pointerId !== event.pointerId) return;
      const current = cfg.axis === "x" ? e.clientX : e.clientY;
      const delta = (current - startPos) * cfg.sign;
      const rect = container.getBoundingClientRect();
      const next = clampSize(id, startSize + delta, rect);
      applySize(id, next);
    }

    function onUp(e) {
      if (e.pointerId !== undefined && e.pointerId !== event.pointerId) return;
      splitter.classList.remove("is-dragging");
      document.body.classList.remove("layout-split-dragging");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      try {
        splitter.releasePointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
      splitter.removeEventListener("pointermove", onMove);
      splitter.removeEventListener("pointerup", onUp);
      splitter.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    splitter.addEventListener("pointermove", onMove);
    splitter.addEventListener("pointerup", onUp);
    splitter.addEventListener("pointercancel", onUp);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    event.preventDefault();
  }

  function bindSplitter(splitter) {
    const id = splitter.dataset.split;
    const cfg = CONFIG[id];
    if (!cfg) return;

    splitter.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      startDrag(splitter, cfg, id, e);
    });

    splitter.addEventListener("dblclick", () => {
      applySize(id, cfg.default);
    });
  }

  function refreshHelpySplitter() {
    const splitter = document.querySelector('.layout-splitter[data-split="main-helpy"]');
    if (splitter) splitter.hidden = true;
  }

  function clampStoredSizes() {
    const cfg = CONFIG["sandbox-editor"];
    const container = cfg?.container?.();
    if (!cfg || !container) return;
    const rect = container.getBoundingClientRect();
    if (rect.height < 120) return;
    const current = state["sandbox-editor"] ?? readPx(cfg.cssVar, cfg.default);
    const clamped = clampSize("sandbox-editor", current, rect);
    if (clamped !== current) {
      applySize("sandbox-editor", clamped);
    }
  }

  function init() {
    loadState();
    applyDefaults();
    clampStoredSizes();
    document.querySelectorAll(".layout-splitter").forEach(bindSplitter);
    refreshHelpySplitter();

    window.addEventListener("study-helpy-toggle", refreshHelpySplitter);

    window.matchMedia("(min-width: 1101px)").addEventListener("change", () => {
      applyDefaults();
      notifyResize();
    });
  }

  return { init, applySize, notifyResize, refreshHelpySplitter, clampStoredSizes };
})();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => StudyLayoutSplitter.init());
} else {
  StudyLayoutSplitter.init();
}
