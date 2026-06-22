/**
 * IT 자기주도 학습 도구
 * 문항 유형: choice(선택형) | sql | python(코딩 실습)
 */

const STORAGE_KEY = "studyLabProgress_v2";

const DECK_CATALOG = [
  {
    id: "basic-ai-course",
    file: "data/basic-ai-course.json",
    label: "AI 실무 기본과정 (5/26~6/18)",
  },
  {
    id: "coding-test-prep",
    file: "data/coding-test-prep.json",
    label: "코딩테스트 시험대비 (6/24)",
  },
];

const TYPE_LABELS = {
  choice: "선택형",
  sql: "SQL 실습",
  python: "파이썬 실습",
};

function getEmbeddedDeck(deckId) {
  return window.EMBEDDED_DECK_DATA?.[deckId] || null;
}

const BUILD_TAG = "20260622b23";
const CT_CHOICE_SPLIT_COUNT = 5;
let embeddedLoadPromise = null;

function loadEmbeddedScript() {
  const missing = DECK_CATALOG.filter((d) => !getEmbeddedDeck(d.id));
  if (!missing.length) return Promise.resolve();
  if (embeddedLoadPromise) return embeddedLoadPromise;
  embeddedLoadPromise = Promise.all(
    missing.map(
      (deck) =>
        new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = `js/${deck.id}-embedded.js?v=${BUILD_TAG}`;
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error(`문제 데이터(${deck.id}) 로드 실패`));
          document.head.appendChild(script);
        })
    )
  ).then(() => {});
  return embeddedLoadPromise;
}

const state = {
  decks: {},
  currentDeckId: "basic-ai-course",
  itemCategory: "choice",
  practicePartFilter: "all",
  quizMode: "all",
  sectionFilter: "",
  reviewOnly: false,
  studyMode: true,
  queue: [],
  index: 0,
  checkResult: null,
  selectedChoice: null,
  score: { correct: 0, attempted: 0 },
  sessionStats: { skip: 0, unknown: 0 },
  lastRunOutput: "",
  editorSelection: "",
  progress: loadProgress(),
  codeEditorCtrl: null,
  dndCtrl: null,
  pyReady: false,
  pyLoading: false,
  practiceRenderToken: 0,
  choiceRenderToken: 0,
  editorItemId: null,
};

const el = {
  deckSelect: document.getElementById("deck-select"),
  deckPanel: document.getElementById("deck-panel"),
  quizModeSelect: document.getElementById("quiz-mode-select"),
  quizModeHint: document.getElementById("quiz-mode-hint"),
  practicePartPanel: document.getElementById("practice-part-panel"),
  practicePartSelect: document.getElementById("practice-part-select"),
  practicePartHint: document.getElementById("practice-part-hint"),
  sectionFilter: document.getElementById("section-filter"),
  sectionHint: document.getElementById("section-hint"),
  reviewOnly: document.getElementById("review-only"),
  studyMode: document.getElementById("study-mode"),
  statTotal: document.getElementById("stat-total"),
  statDone: document.getElementById("stat-done"),
  statReview: document.getElementById("stat-review"),
  statTotalLabel: document.getElementById("stat-total-label"),
  statDoneLabel: document.getElementById("stat-done-label"),
  statReviewLabel: document.getElementById("stat-review-label"),
  statSummaryHint: document.getElementById("stat-summary-hint"),
  statsPanelTitle: document.getElementById("stats-panel-title"),
  progressFill: document.getElementById("progress-fill"),
  resetProgress: document.getElementById("reset-progress"),
  deckTitle: document.getElementById("deck-title"),
  typeBadge: document.getElementById("type-badge"),
  questionCounter: document.getElementById("question-counter"),
  studyCard: document.getElementById("study-card"),
  resultsCard: document.getElementById("results-card"),
  sectionTag: document.getElementById("section-tag"),
  questionText: document.getElementById("question-text"),
  codeBlock: document.getElementById("code-block"),
  instructionsBox: document.getElementById("instructions-box"),
  practiceWorkspace: document.getElementById("practice-workspace"),
  practiceGuidePanel: document.getElementById("practice-guide-panel"),
  practiceSectionTag: document.getElementById("practice-section-tag"),
  practiceQuestionTitle: document.getElementById("practice-question-title"),
  practiceHelpBlock: document.getElementById("practice-help-block"),
  practiceGuideContent: document.getElementById("practice-guide-content"),
  practiceGuideMutedContent: document.getElementById("practice-guide-muted-content"),
  practiceGuideOrderFooter: document.getElementById("practice-guide-order-footer"),
  practiceWorkflow: document.getElementById("practice-workflow"),
  practiceReferenceWrap: document.getElementById("practice-reference-wrap"),
  practiceReferenceContent: document.getElementById("practice-reference-content"),
  practiceRunResultWrap: document.getElementById("practice-run-result-wrap"),
  practiceRunResultContent: document.getElementById("practice-run-result-content"),
  practiceExpectedWrap: document.getElementById("practice-expected-wrap"),
  practiceExpectedContent: document.getElementById("practice-expected-content"),
  practiceSchema: document.getElementById("practice-schema"),
  previewTableBtn: document.getElementById("preview-table-btn"),
  typingArea: document.getElementById("typing-area"),
  inputLabel: document.getElementById("input-label"),
  answerInput: document.getElementById("answer-input"),
  sandboxArea: document.getElementById("sandbox-area"),
  sandboxWorkbench: document.getElementById("sandbox-workbench"),
  sqlDndWorkspace: document.getElementById("sql-dnd-workspace"),
  codeEditorWrap: document.getElementById("code-editor-wrap"),
  sandboxToolbar: document.getElementById("sandbox-toolbar"),
  sandboxOutputLabel: document.getElementById("sandbox-output-label"),
  sandboxLang: document.getElementById("sandbox-lang"),
  codeEditor: document.getElementById("code-editor"),
  pythonTaskStrip: document.getElementById("python-task-strip"),
  pythonTaskGoal: document.getElementById("python-task-goal"),
  pythonTaskVars: document.getElementById("python-task-vars"),
  pythonProbeBar: document.getElementById("python-probe-bar"),
  sqlProbeBar: document.getElementById("sql-probe-bar"),
  sqlProbeButtons: document.getElementById("sql-probe-buttons"),
  sqlProbeAllBtn: document.getElementById("sql-probe-all-btn"),
  codeEditorHighlight: document.getElementById("code-editor-highlight"),
  editorStatus: document.getElementById("editor-status"),
  runCodeBtn: document.getElementById("run-code-btn"),
  runAllCodeBtn: document.getElementById("run-all-code-btn"),
  resetCodeBtn: document.getElementById("reset-code-btn"),
  sandboxResult: document.getElementById("sandbox-result"),
  clearConsoleBtn: document.getElementById("clear-console-btn"),
  codeSelectionAskBtn: document.getElementById("code-selection-ask-btn"),
  choiceArea: document.getElementById("choice-area"),
  choicePrompt: document.getElementById("choice-prompt"),
  choiceList: document.getElementById("choice-list"),
  hintBtn: document.getElementById("hint-btn"),
  summaryBtn: document.getElementById("summary-btn"),
  answerBtn: document.getElementById("answer-btn"),
  explainBtn: document.getElementById("explain-btn"),
  hintPanel: document.getElementById("hint-panel"),
  summaryPanel: document.getElementById("summary-panel"),
  answerPanel: document.getElementById("answer-panel"),
  explainDetails: document.getElementById("explain-details"),
  explainContent: document.getElementById("explain-content"),
  feedbackBox: document.getElementById("feedback-box"),
  prevBtn: document.getElementById("prev-btn"),
  markUnknown: document.getElementById("mark-unknown"),
  skipBtn: document.getElementById("skip-btn"),
  submitBtn: document.getElementById("submit-btn"),
  nextBtn: document.getElementById("next-btn"),
  resultsText: document.getElementById("results-text"),
  reviewWrongBtn: document.getElementById("review-wrong-btn"),
  restartBtn: document.getElementById("restart-btn"),
  sessionCompleteDialog: document.getElementById("session-complete-dialog"),
  sessionCompleteTitle: document.getElementById("session-complete-title"),
  sessionCompleteStars: document.getElementById("session-complete-stars"),
  sessionCompleteStats: document.getElementById("session-complete-stats"),
  sessionCompleteMessage: document.getElementById("session-complete-message"),
  sessionCompleteRestart: document.getElementById("session-complete-restart"),
  sessionCompleteReview: document.getElementById("session-complete-review"),
  plotPreviewDialog: document.getElementById("plot-preview-dialog"),
  plotPreviewImg: document.getElementById("plot-preview-img"),
  plotPreviewClose: document.getElementById("plot-preview-close"),
};

function openPlotPreview(b64) {
  if (!b64 || !el.plotPreviewImg) return;
  el.plotPreviewImg.src = `data:image/png;base64,${b64}`;
  if (el.plotPreviewDialog?.showModal) {
    el.plotPreviewDialog.showModal();
  }
}

function closePlotPreview() {
  if (el.plotPreviewDialog?.open) el.plotPreviewDialog.close();
  if (el.plotPreviewImg) el.plotPreviewImg.removeAttribute("src");
}

const STAR_FULL_SVG =
  '<svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true"><path fill="#FB923C" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>';
const STAR_OUTLINE_SVG =
  '<svg width="40" height="40" viewBox="0 0 24 24" class="victory-star-outline" aria-hidden="true"><path fill="#FB923C" d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" /></svg>';

function renderVictoryStars(container, count) {
  if (!container) return;
  const stars = Math.max(0, Math.min(3, count));
  container.innerHTML = [0, 1, 2]
    .map((i) => (i < stars ? STAR_FULL_SVG : STAR_OUTLINE_SVG))
    .join("");
}

function buildSessionSummary() {
  const total = state.queue.length;
  const correct = state.score.correct;
  const wrong = Math.max(0, state.score.attempted - correct);
  const skip = state.sessionStats.skip || 0;
  const unknown = state.sessionStats.unknown || 0;
  const reviewLeft = countReviewQueueItems();
  return { total, correct, wrong, skip, unknown, reviewLeft };
}

function getSessionStarCount(summary) {
  if (!summary.total) return 0;
  if (summary.reviewLeft === 0 && summary.wrong === 0 && summary.skip === 0 && summary.unknown === 0) {
    return 3;
  }
  const ratio = summary.correct / summary.total;
  if (ratio >= 0.85) return 2;
  return 1;
}

function buildSessionCompleteMessage(summary) {
  const lines = [
    `이번 세트 <strong>${summary.total}</strong>문제를 모두 마쳤어요.`,
    `정답 <strong>${summary.correct}</strong> · 오답 <strong>${summary.wrong}</strong> · 건너뜀 <strong>${summary.skip}</strong> · 모름 <strong>${summary.unknown}</strong>`,
  ];
  if (state.reviewOnly && summary.reviewLeft === 0) {
    lines.push("복습 큐를 모두 마스터했습니다! 선택형 정답을 외운 상태예요.");
  } else if (summary.reviewLeft > 0) {
    lines.push(
      `복습 큐에 <strong>${summary.reviewLeft}</strong>문제가 남았어요. 「복습 큐만」으로 반복 숙달해 보세요!`
    );
  } else if (summary.wrong + summary.skip + summary.unknown > 0) {
    lines.push("고생 많았어요! 틀린·모름·건너뜀 문제는 복습 큐에 저장되어 있어요.");
  } else {
    lines.push("완벽하게 마무리했어요! 다음 세트도 화이팅!");
  }
  return lines.join("<br>");
}

function showSessionCompleteDialog(summary) {
  if (!el.sessionCompleteDialog) {
    showResultsInline(summary);
    return;
  }
  const stars = getSessionStarCount(summary);
  const title =
    state.reviewOnly && summary.reviewLeft === 0
      ? "복습 큐 완료!"
      : summary.wrong + summary.skip + summary.unknown === 0 && summary.reviewLeft === 0
        ? "잘했습니다!"
        : "고생 많았어요!";

  if (el.sessionCompleteTitle) el.sessionCompleteTitle.textContent = title;
  renderVictoryStars(el.sessionCompleteStars, stars);

  if (el.sessionCompleteStats) {
    el.sessionCompleteStats.innerHTML = [
      { value: summary.total, label: "전체", cls: "" },
      { value: summary.correct, label: "정답", cls: "session-stat--correct" },
      {
        value: summary.wrong + summary.skip + summary.unknown,
        label: "복습 필요",
        cls: "session-stat--review",
      },
    ]
      .map(
        (s) =>
          `<div class="session-stat ${s.cls}"><span class="session-stat-value">${s.value}</span><span class="session-stat-label">${s.label}</span></div>`
      )
      .join("");
  }

  if (el.sessionCompleteMessage) {
    el.sessionCompleteMessage.innerHTML = buildSessionCompleteMessage(summary);
  }

  if (el.sessionCompleteReview) {
    el.sessionCompleteReview.hidden = summary.reviewLeft <= 0;
    el.sessionCompleteReview.textContent =
      summary.reviewLeft > 0 ? `복습 큐만 다시 (${summary.reviewLeft})` : "복습 큐만 다시";
  }

  if (typeof el.sessionCompleteDialog.showModal === "function") {
    el.sessionCompleteDialog.showModal();
  }
}

function closeSessionCompleteDialog() {
  if (el.sessionCompleteDialog?.open) el.sessionCompleteDialog.close();
}

function showResultsInline(summary) {
  if (!el.resultsText) return;
  el.resultsText.innerHTML = buildSessionCompleteMessage(summary);
}

async function ensurePythonReady(showStatus = true) {
  if (state.pyReady) return true;
  if (state.pyLoading) {
    await StudySandbox.initPython();
    state.pyReady = true;
    return true;
  }
  state.pyLoading = true;
  if (showStatus && el.editorStatus) {
    el.editorStatus.textContent = "● Python 환경 로딩 중…";
  }
  if (showStatus && el.sandboxResult) {
    el.sandboxResult.innerHTML =
      '<p class="sandbox-console-msg">Pyodide 로딩 중… (최초 1회 10~20초 걸릴 수 있습니다)</p>';
  }
  try {
    await StudySandbox.initPython();
    state.pyReady = true;
    if (showStatus && el.editorStatus) el.editorStatus.textContent = "● Python 준비 완료 · Ctrl+Enter 실행";
    return true;
  } catch (err) {
    if (showStatus && el.sandboxResult) {
      el.sandboxResult.innerHTML = `<span class="sandbox-error">${escapeHtml(err.message || String(err))}</span>`;
    }
    if (showStatus && el.editorStatus) el.editorStatus.textContent = "● Python 로드 실패";
    return false;
  } finally {
    state.pyLoading = false;
  }
}

function resolveTerminalKind(item) {
  return resolveItemType(item || currentItem()) === "python" ? "python" : "sql";
}

function showTerminalRunning(kind = "sql") {
  if (typeof StudyTerminalStream !== "undefined") {
    return StudyTerminalStream.showRunning(el.sandboxResult, kind);
  }
  if (!el.sandboxResult) return Date.now();
  el.sandboxResult.innerHTML =
    kind === "python"
      ? StudySandbox.formatPythonConsole("", "", { running: true })
      : StudySandbox.formatSqlConsole("", { running: true });
  return Date.now();
}

async function revealTerminalOutput(html, options = {}) {
  if (!el.sandboxResult) return;
  const kind = options.kind || resolveTerminalKind();
  if (typeof StudyTerminalStream !== "undefined" && options.instant !== true) {
    await StudyTerminalStream.reveal(el.sandboxResult, html, {
      kind,
      runStartedAt: options.runStartedAt,
      alreadyRunning: options.alreadyRunning,
      minRunMs: options.minRunMs,
      lineMs: options.lineMs,
      blockMs: options.blockMs,
    });
    return;
  }
  StudyTerminalStream?.cancel?.();
  el.sandboxResult.classList.remove("terminal-is-running");
  el.sandboxResult.innerHTML = html || "";
}

function formatSqlErrorConsole(result) {
  return StudySandbox.formatSqlConsole("", {
    error: result.error,
    failedSql: result.failedSql,
    complete: result.complete !== false,
  });
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function deckKey(deckId) {
  return state.decks[deckId]?.meta?.id || deckId;
}

function isReviewStatus(status) {
  return status === "review" || status === "wrong";
}

function isInReviewQueue(itemId) {
  return isReviewStatus(getItemProgress(itemId).status);
}

function addToReviewQueue(itemId, reason, attemptsOverride) {
  const prev = getItemProgress(itemId);
  setItemProgress(itemId, {
    status: "review",
    reviewReason: reason,
    attempts: attemptsOverride ?? (prev.attempts || 0) + 1,
    lastReviewAt: Date.now(),
  });
}

function markItemMastered(itemId, attempts) {
  setItemProgress(itemId, {
    status: "done",
    attempts,
    reviewReason: null,
    masteredAt: Date.now(),
  });
}

function countReviewQueueItems() {
  return getActiveDeckItems().filter((item) => isInReviewQueue(item.id)).length;
}

function getItemProgress(itemId) {
  const key = deckKey(state.currentDeckId);
  if (!state.progress[key]) state.progress[key] = {};
  return state.progress[key][itemId] || { status: "new", attempts: 0 };
}

function setItemProgress(itemId, patch) {
  const key = deckKey(state.currentDeckId);
  if (!state.progress[key]) state.progress[key] = {};
  const prev = getItemProgress(itemId);
  state.progress[key][itemId] = { ...prev, ...patch };
  saveProgress();
  updateStats();
}

function getEditorSelectionText() {
  const editor = el.codeEditor;
  if (!editor || editor.disabled) return "";
  const start = Math.min(editor.selectionStart, editor.selectionEnd);
  const end = Math.max(editor.selectionStart, editor.selectionEnd);
  if (start === end) return "";
  return editor.value.slice(start, end);
}

function updateCodeSelectionUI() {
  const text = getEditorSelectionText().trim();
  state.editorSelection = text;
  const show =
    Boolean(text) &&
    !el.sandboxArea?.hidden &&
    !el.codeEditor?.disabled &&
    !state.dndCtrl;
  if (el.codeSelectionAskBtn) el.codeSelectionAskBtn.hidden = !show;
  const aiSelBtn = document.getElementById("ai-selection-btn");
  if (aiSelBtn) aiSelBtn.hidden = !show;
  if (typeof HelpyOffline !== "undefined") HelpyOffline.updateContextChip?.();
}

function bindEditorSelectionTracking() {
  const editor = el.codeEditor;
  if (!editor) return;
  const sync = () => requestAnimationFrame(updateCodeSelectionUI);
  editor.addEventListener("mouseup", sync);
  editor.addEventListener("keyup", sync);
  editor.addEventListener("select", sync);
  document.addEventListener("selectionchange", () => {
    if (document.activeElement === editor) sync();
  });
}

function resolveItemType(item) {
  if (item.itemType === "sql" || item.itemType === "python") return item.itemType;
  if (item.starterSql || (item.sandbox && item.validate && !item.itemType)) return "sql";
  if (item.starterCode && item.validate) return "python";
  return "choice";
}

function normalizeText(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[;.,'"`]/g, "");
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function evaluateTyping(userInput, item) {
  const normalized = normalizeText(userInput);
  if (!normalized) return { level: "empty", message: "답을 입력해 주세요." };

  const answers = (item.answers || []).map(normalizeText);
  if (answers.some((a) => a === normalized)) {
    return { level: "correct", message: "정확합니다!" };
  }

  const contains = answers.find((a) => normalized.includes(a) || a.includes(normalized));
  if (contains && normalized.length >= contains.length * 0.6) {
    return {
      level: "partial",
      message: "핵심은 맞았지만 표현을 더 정확히 해보세요.",
      expected: item.answers[0],
    };
  }

  let best = { dist: Infinity, answer: "" };
  for (const a of answers) {
    const dist = levenshtein(normalized, a);
    if (dist < best.dist) best = { dist, answer: a };
  }
  const threshold = Math.max(2, Math.floor(best.answer.length * 0.25));
  if (best.dist <= threshold) {
    return {
      level: "partial",
      message: "거의 맞았습니다. 철자·띄어쓰기를 확인해 보세요.",
      expected: item.answers[0],
    };
  }

  return {
    level: "wrong",
    message: "아직 정답이 아닙니다. 힌트·요약·해설을 확인하고 다시 입력해 보세요.",
    expected: item.answers?.[0] || "",
  };
}

function dedupeChoicePriority(item) {
  const sec = item.section || "";
  if (sec.includes("보충")) return 2;
  if (sec.includes("특별")) return 3;
  return 1;
}

function dedupeChoiceItems(items) {
  const best = new Map();
  for (const item of items) {
    if (resolveItemType(item) !== "choice") continue;
    const key = normalizeText(item.question || "") || `__id__${item.id}`;
    const prev = best.get(key);
    if (!prev || dedupeChoicePriority(item) < dedupeChoicePriority(prev)) {
      best.set(key, item);
    }
  }
  const keptIds = new Set([...best.values()].map((i) => i.id));
  const seen = new Set();
  const result = [];
  for (const item of items) {
    if (!keptIds.has(item.id)) continue;
    const key = normalizeText(item.question || "") || `__id__${item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function getDeckComposition(deckId = state.currentDeckId) {
  const items = getDeckItems(deckId);
  const choiceItems = items.filter((item) => resolveItemType(item) === "choice");
  const choiceDeduped = dedupeChoiceItems(choiceItems);
  let sql = 0;
  let python = 0;
  items.forEach((item) => {
    const t = resolveItemType(item);
    if (t === "sql") sql++;
    else if (t === "python") python++;
  });
  return {
    choice: choiceDeduped.length,
    choiceRaw: choiceItems.length,
    choiceDupes: Math.max(0, choiceItems.length - choiceDeduped.length),
    sql,
    python,
    practice: sql + python,
    total: items.length,
  };
}

function formatDeckComposition(comp) {
  const dupNote =
    comp.choiceDupes > 0 ? ` (중복 ${comp.choiceDupes}문항 제외)` : "";
  return `선택형 ${comp.choice}${dupNote} · 실습 ${comp.practice} (SQL ${comp.sql}·파이썬 ${comp.python})`;
}

function getDedupedChoiceItems(deckId = state.currentDeckId) {
  return dedupeChoiceItems(
    getDeckItems(deckId).filter((item) => resolveItemType(item) === "choice")
  );
}

function sortChoiceItemsByCurriculum(items, deckId = state.currentDeckId) {
  const order = state.decks[deckId]?.meta?.sectionOrder || [];
  return [...items].sort((a, b) => {
    const sa = a.section || "";
    const sb = b.section || "";
    const ia = order.indexOf(sa);
    const ib = order.indexOf(sb);
    if (ia !== ib) {
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    }
    return String(a.id).localeCompare(String(b.id));
  });
}

function getCodingTestChoiceChunks(deckId = state.currentDeckId) {
  const sorted = sortChoiceItemsByCurriculum(getDedupedChoiceItems(deckId), deckId);
  const chunks = Array.from({ length: CT_CHOICE_SPLIT_COUNT }, () => []);
  const size = Math.ceil(sorted.length / CT_CHOICE_SPLIT_COUNT) || 0;
  for (let i = 0; i < CT_CHOICE_SPLIT_COUNT; i++) {
    chunks[i] = sorted.slice(i * size, (i + 1) * size);
  }
  return chunks;
}

function isSplitQuizMode(mode = state.quizMode) {
  return /^split[1-5]$/.test(mode);
}

function getSplitChunkIndex(mode = state.quizMode) {
  const m = String(mode).match(/^split([1-5])$/);
  return m ? Number(m[1]) : 0;
}

function getSplitChunkItems(splitIndex, deckId = state.currentDeckId) {
  const idx = splitIndex - 1;
  const chunks = getCodingTestChoiceChunks(deckId);
  return chunks[idx] || [];
}

function getCategoryStatLabels() {
  const cat = state.itemCategory === "practice" ? "실습" : "선택형";
  return {
    cat,
    total: `${cat} 전체`,
    done: `${cat} 완료`,
    review: `${cat} 복습`,
    panelTitle: `진행 현황 · ${cat}`,
  };
}

function updateDeckSelectLabels() {
  if (!el.deckSelect) return;
  for (const opt of el.deckSelect.options) {
    const deck = DECK_CATALOG.find((d) => d.id === opt.value);
    if (!deck) continue;
    const comp = getDeckComposition(deck.id);
    opt.textContent = `${deck.label} — 선택 ${comp.choice} · 실습 ${comp.practice}`;
  }
}

function getDeckItems(deckId = state.currentDeckId) {
  const items = state.decks[deckId]?.items || [];
  if (!isExamDeck(deckId)) return items;
  const scope = state.decks[deckId]?.meta?.scopeSections;
  if (!scope?.length) return items;
  return items.filter((item) => {
    const sec = item.section || "";
    if (scope.includes(sec)) return true;
    if (sec.startsWith("코딩테스트 보충")) return true;
    if (sec.includes("특별문제")) return true;
    return false;
  });
}

const PRACTICE_PART_LABELS = {
  all: "전체",
  python: "파이썬",
  sql: "SQL",
  numpy: "NumPy",
  pandas: "Pandas",
  viz: "데이터 시각화",
};

function resolvePracticePart(item) {
  const section = item.section || "";
  const id = item.id || "";
  const blob = `${section} ${id} ${item.question || ""}`;
  if (resolveItemType(item) === "sql") return "sql";
  if (/viz-|ct-viz|matplotlib|산점도|막대|원그래프|scatter|\.bar\(|\.pie\(/i.test(blob)) {
    return "viz";
  }
  if (/06\/18|Pandas|pandas|pd\.|read_csv|DataFrame|groupby/i.test(blob)) return "pandas";
  if (/06\/17|NumPy|numpy|ndarray|np\.array/i.test(blob)) return "numpy";
  if (resolveItemType(item) === "python") return "python";
  return "python";
}

function matchesPracticePart(item) {
  if (state.practicePartFilter === "all") return true;
  return resolvePracticePart(item) === state.practicePartFilter;
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isPracticeType(item) {
  const t = resolveItemType(item);
  return t === "sql" || t === "python";
}

function isExamDeck(deckId = state.currentDeckId) {
  return !!state.decks[deckId]?.meta?.examFormat;
}

function getExamFormat(deckId = state.currentDeckId) {
  return state.decks[deckId]?.meta?.examFormat || null;
}

function getSessionCategoryLabel() {
  return state.itemCategory === "practice" ? "실습" : "선택형";
}

function updateDeckHint() {
  const hint = document.getElementById("deck-hint");
  const deck = state.decks[state.currentDeckId];
  if (!hint || !deck) return;
  const comp = getDeckComposition(state.currentDeckId);
  const cat = state.itemCategory === "practice" ? "실습" : "선택형";
  if (isExamDeck()) {
    hint.textContent =
      cat === "실습"
        ? `코딩테스트 대비 · 실습 ${comp.practice}문항 (SQL ${comp.sql}·파이썬 ${comp.python})`
        : `코딩테스트 대비 · 선택형 ${comp.choice}문항`;
  } else if (cat === "선택형") {
    hint.textContent = `이 코스 ${formatDeckComposition(comp)} · 현재 탭은 선택형 ${comp.choice}문항만 출제`;
  } else {
    hint.textContent = `이 코스 ${formatDeckComposition(comp)} · 현재 탭은 실습 ${comp.practice}문항만 출제`;
  }
}

function updateDeckQuizModeOptions() {
  const sel = el.quizModeSelect;
  if (!sel) return;

  sel.querySelectorAll("option[data-ct-split]").forEach((o) => o.remove());

  const examOpt = sel.querySelector('option[value="exam"]');
  if (examOpt) {
    examOpt.remove();
    if (state.quizMode === "exam") {
      state.quizMode = "all";
      sel.value = "all";
    }
  }

  if (isExamDeck(state.currentDeckId) && state.itemCategory === "choice") {
    const chunks = getCodingTestChoiceChunks(state.currentDeckId);
    chunks.forEach((chunk, i) => {
      const opt = document.createElement("option");
      opt.value = `split${i + 1}`;
      opt.dataset.ctSplit = "1";
      opt.textContent = `코딩테스트 대비 ${i + 1} (${chunk.length}문항)`;
      sel.appendChild(opt);
    });
  }

  if (isSplitQuizMode() && !sel.querySelector(`option[value="${state.quizMode}"]`)) {
    state.quizMode = "all";
    sel.value = "all";
  }
}

function updatePracticePartPanel() {
  const isPractice = state.itemCategory === "practice";
  if (el.practicePartPanel) el.practicePartPanel.hidden = !isPractice;
  if (!isPractice) return;
  const label = PRACTICE_PART_LABELS[state.practicePartFilter] || "전체";
  if (el.practicePartHint) {
    el.practicePartHint.textContent =
      state.practicePartFilter === "all"
        ? "시험 범위 실습 문제를 파트 구분 없이 랜덤 출제합니다."
        : `「${label}」 파트 실습만 무작위로 출제합니다.`;
  }
}

function buildExamQueue(pool, format) {
  const reviewFilter = (item) => {
    if (!state.reviewOnly) return true;
    return isInReviewQueue(item.id);
  };

  let choices = pool.filter(
    (item) => resolveItemType(item) === "choice" && reviewFilter(item)
  );
  let practices = pool.filter(
    (item) => isPracticeType(item) && reviewFilter(item)
  );

  choices = shuffleArray(choices).slice(0, format.choiceCount || 20);
  practices = shuffleArray(practices).slice(0, format.practiceCount || 20);

  return shuffleArray([
    ...choices.map((item, i) => ({ item, i })),
    ...practices.map((item, i) => ({ item, i })),
  ]);
}

function exitExamMixModeIfNeeded() {
  if (!isExamDeck() || state.quizMode !== "exam") return;
  state.quizMode = "all";
  if (el.quizModeSelect) el.quizModeSelect.value = "all";
  updateQuizModeUI();
}

function filterItemsByCategory(items) {
  if (state.itemCategory === "practice") {
    return items.filter((item) => isPracticeType(item) && matchesPracticePart(item));
  }
  if (state.itemCategory === "choice") {
    return items.filter((item) => resolveItemType(item) === "choice");
  }
  return items;
}

function getActiveDeckItems() {
  const items = filterItemsByCategory(getDeckItems(state.currentDeckId));
  if (state.itemCategory === "choice") {
    return dedupeChoiceItems(items);
  }
  return items;
}

let decksReady = false;
let pendingCategoryRefresh = false;

function applyItemCategory(category, { force = false } = {}) {
  const next = category === "practice" ? "practice" : "choice";
  const unchanged = state.itemCategory === next;
  state.itemCategory = next;
  if (!decksReady) {
    pendingCategoryRefresh = true;
    return;
  }
  if (force) exitExamMixModeIfNeeded();
  if (!force && unchanged) return;
  if (next === "practice" && isSplitQuizMode()) {
    state.quizMode = "all";
    if (el.quizModeSelect) el.quizModeSelect.value = "all";
  }
  if (next === "practice") ensurePythonReady(false);
  state.index = 0;
  state.sectionFilter = "";
  if (el.sectionFilter) el.sectionFilter.value = "";
  if (next === "choice") state.practicePartFilter = "all";
  if (el.practicePartSelect && next === "choice") el.practicePartSelect.value = "all";
  if (state.quizMode === "section") {
    updateQuizModeUI();
  }
  populateSectionFilter();
  updatePracticePartPanel();
  updateQuizModeUI();
  updateDeckHint();
  buildQueue();
  renderQuestion();
  updateStats();
}

function syncCategoryFromNav() {
  const view = document.querySelector(".nav-btn.active")?.dataset?.view;
  if (view === "study-practice") {
    applyItemCategory("practice", { force: true });
  } else if (view === "study-choice") {
    applyItemCategory("choice", { force: true });
  } else if (pendingCategoryRefresh) {
    applyItemCategory(state.itemCategory, { force: true });
  }
  pendingCategoryRefresh = false;
}

function refreshStudyView() {
  if (!decksReady) return;
  populateSectionFilter();
  buildQueue();
  renderQuestion();
  updateStats();
}

function showInitError(err) {
  const msg = err?.message || String(err);
  console.error("[StudyApp init]", err);
  let banner = document.getElementById("app-init-error");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "app-init-error";
    banner.className = "app-init-error";
    banner.setAttribute("role", "alert");
    document.body.prepend(banner);
  }
  banner.innerHTML =
    `<strong>앱 초기화 오류</strong><p>${escapeHtml(msg)}</p>` +
    `<p>페이지를 <strong>Ctrl+Shift+R</strong>로 새로고침하거나, ` +
    `<code>python -m http.server 8765</code>로 서버 실행 후 ` +
    `<a href="http://localhost:8765/?v=20260615d">localhost:8765</a>로 접속해 주세요.</p>`;
}

function buildCategoryExamQueue(pool, format) {
  const choices = shuffleArray(
    pool.filter((item) => resolveItemType(item) === "choice")
  ).slice(0, format.choiceCount || 20);
  const practices = shuffleArray(pool.filter((item) => isPracticeType(item))).slice(
    0,
    format.practiceCount || 20
  );

  if (state.itemCategory === "choice") {
    return shuffleArray(choices.map((item, i) => ({ item, i })));
  }
  if (state.itemCategory === "practice") {
    return shuffleArray(practices.map((item, i) => ({ item, i })));
  }
  return shuffleArray([
    ...choices.map((item, i) => ({ item, i })),
    ...practices.map((item, i) => ({ item, i })),
  ]);
}

function buildQueue() {
  if (state.quizMode === "exam") {
    state.quizMode = "all";
    if (el.quizModeSelect) el.quizModeSelect.value = "all";
  }

  let items = getActiveDeckItems().map((item, i) => ({ item, i }));

  if (state.quizMode === "section") {
    if (state.sectionFilter) {
      items = items.filter(({ item }) => item.section === state.sectionFilter);
    } else {
      items = [];
    }
  } else if (isSplitQuizMode() && isExamDeck() && state.itemCategory === "choice") {
    const chunkIds = new Set(getSplitChunkItems(getSplitChunkIndex()).map((item) => item.id));
    items = items.filter(({ item }) => chunkIds.has(item.id));
  }

  if (state.reviewOnly) {
    items = items.filter(({ item }) => isInReviewQueue(item.id));
  }

  state.queue = shuffleArray(items);
  if (state.index >= state.queue.length) state.index = Math.max(0, state.queue.length - 1);
  state.score = { correct: 0, attempted: 0 };
  state.sessionStats = { skip: 0, unknown: 0 };
}

function currentEntry() {
  return state.queue[state.index];
}

function currentItem() {
  return currentEntry()?.item;
}

function hideHelpPanels() {
  el.hintPanel.hidden = true;
  el.summaryPanel.hidden = true;
  el.answerPanel.hidden = true;
  el.hintPanel.classList.remove("hint-panel--rich");
  el.summaryPanel.classList.remove("summary-panel--rich");
  el.answerPanel.classList.remove("answer-panel--dnd");
  if (el.explainDetails) el.explainDetails.open = false;
}

function showPanel(panel, content, prefix) {
  hideHelpPanels();
  panel.hidden = false;
  panel.textContent = prefix ? `${prefix}\n${content}` : content;
}

function showPanelHtml(panel, html, className = "") {
  hideHelpPanels();
  panel.hidden = false;
  panel.innerHTML = html;
  if (className) panel.classList.add(className);
}

function isExamSession() {
  return false;
}

function isSqlTypingItem(item) {
  if (resolveItemType(item) !== "sql") return false;
  if (item.dndDisabled || item.examTyping || item.eliceFormat || isExamSession()) return true;
  if (item.starterSql && item.dndOnly !== true) return true;
  return false;
}

function isSqlDndItem(item) {
  if (resolveItemType(item) !== "sql") return false;
  if (item.dndDisabled || item.examTyping || item.eliceFormat) return false;
  if (isExamSession()) return false;
  if (item.starterSql && item.dndOnly !== true) return false;
  return true;
}

function buildEliceGuideHeader(item, lang = "sql") {
  const guide = item.practiceGuide || {};
  const prefix = lang === "sql" ? "--" : "#";
  const goal = guide.goal || item.instructions || "";
  const lines = [];
  if (goal) lines.push(`${prefix} ${goal}`);
  if (guide.steps?.length) {
    if (lines.length) lines.push(prefix);
    guide.steps.forEach((step, i) => lines.push(`${prefix} ${i + 1}. ${step}`));
  }
  if (guide.tip) lines.push(`${prefix} TIP: ${guide.tip}`);
  if (lang === "python") {
    lines.push(prefix);
    lines.push(`${prefix} 아래에 코드를 작성하세요`);
  }
  return lines.join("\n");
}

function stripGuideCommentsFromCode(code, item, lang) {
  const prefix = lang === "sql" ? "--" : "#";
  const goal = item.practiceGuide?.goal || item.instructions || "";
  const steps = item.practiceGuide?.steps || [];
  const lines = (code || "").split("\n");
  let i = 0;

  const isGuideLine = (trimmed) => {
    if (!trimmed.startsWith(prefix)) return false;
    const content = trimmed.slice(prefix.length).trim();
    if (!content) return true;
    if (goal && (content === goal || content.includes(goal.slice(0, Math.min(24, goal.length))))) {
      return true;
    }
    if (/^\d+\.\s/.test(content) && steps.some((s) => content.includes(s.slice(0, Math.min(14, s.length))))) {
      return true;
    }
    if (content.startsWith("TIP:")) return true;
    if (content.includes("아래에 코드") || content.includes("아래에 SQL")) return true;
    return false;
  };

  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      i++;
      continue;
    }
    if (isGuideLine(trimmed)) {
      i++;
      continue;
    }
    break;
  }
  while (i < lines.length && !lines[i].trim()) i++;
  return lines.slice(i).join("\n");
}

function ensureEliceGuideComments(code, item, lang = "sql") {
  const body = (code || "").trim();
  if (!body) return `${buildEliceGuideHeader(item, lang)}\n`;

  if (lang === "sql" && item.eliceFormat && /-- 아래는 .+ 테이블/.test(body)) {
    return `${body}\n`;
  }

  const header = buildEliceGuideHeader(item, lang);
  const stripped = stripGuideCommentsFromCode(body, item, lang).trim();
  if (!stripped) return `${header}\n`;
  return `${header}\n\n${stripped}`;
}

function normalizeCodeBody(text, lang = "python") {
  const comment = lang === "sql" ? "--" : "#";
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith(comment))
    .join("\n")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function stripReferenceLeakFromStarter(starter, reference, lang = "python") {
  const s = String(starter || "").trim();
  const r = String(reference || "").trim();
  if (!s || !r) return starter;

  const nRef = normalizeCodeBody(r, lang);
  const nStart = normalizeCodeBody(s, lang);
  if (!nStart) return starter;

  if (nRef === nStart || (nRef.length > 12 && nStart.includes(nRef))) {
    const headerLines = s
      .split("\n")
      .filter((line) => {
        const t = line.trim();
        return !t || t.startsWith("#") || t.startsWith("--");
      });
    const imports =
      lang === "python"
        ? r.split("\n").filter((line) => /^\s*(import|from)\s/.test(line))
        : [];
    const tail =
      lang === "sql"
        ? "\n-- 아래 SQL 문을 완성하세요.\n"
        : "\n# 아래에 코드를 작성하세요\n";
    return [...headerLines, ...imports, tail].join("\n").trim() + "\n";
  }

  if (lang === "sql" && nRef && nStart.endsWith(nRef)) {
    const idx = s.lastIndexOf(r.trim());
    if (idx > 0) {
      return `${s.slice(0, idx).trimEnd()}\n-- 아래 SQL 문을 완성하세요.\n`;
    }
  }

  return starter;
}

function buildSqlSkeletonFromRef(item) {
  const ref = (item.referenceSql || "").trim();
  const guide = item.practiceGuide || {};
  const lines = [];

  if (/^SELECT\b/is.test(ref)) {
    if (/\b(EXCEPT|UNION|INTERSECT)\b/i.test(ref)) {
      lines.push("-- 아래 집합 연산 쿼리를 한 문장으로 완성하세요. (SELECT와 EXCEPT 사이에 ; 넣지 마세요)");
      const m = ref.match(/^([\s\S]*?)\b(EXCEPT|UNION(?:\s+ALL)?|INTERSECT)\b([\s\S]*)$/i);
      if (m) {
        lines.push(m[1].trim());
        lines.push(m[2].toUpperCase().replace(/\s+ALL/, " ALL"));
        lines.push(m[3].trim().replace(/;+\s*$/, ""));
        lines.push(";");
      } else {
        lines.push(ref.replace(/;+\s*$/, ""));
        lines.push(";");
      }
    } else {
      lines.push("-- 아래 SELECT 문을 완성하세요.");
      const sel = ref.match(/SELECT\s+([\s\S]+?)\s+FROM\s+(\S+)/i);
      if (sel && /\bJOIN\b/i.test(ref)) {
        const cols = sel[1].trim();
        const fromT = sel[2].trim();
        lines.push(cols === "*" ? "SELECT *" : `SELECT ${cols}`);
        lines.push(`FROM ${fromT}`);
        lines.push("-- ↑ JOIN 조건을 작성해 완성하세요");
      } else {
        const from = ref.match(/FROM\s+(\S+)/i);
        lines.push("SELECT /* TODO: 컬럼 */");
        if (from) lines.push(`FROM ${from[1]}`);
        if (/WHERE/i.test(ref)) lines.push("WHERE /* TODO: 조건 */");
        if (/GROUP\s+BY/i.test(ref)) lines.push("GROUP BY /* TODO */");
        if (/HAVING/i.test(ref)) lines.push("HAVING /* TODO */");
        if (/ORDER\s+BY/i.test(ref)) lines.push("ORDER BY /* TODO */");
        if (/LIMIT/i.test(ref)) lines.push("LIMIT /* TODO */");
        lines.push(";");
      }
    }
  } else if (/^INSERT\b/is.test(ref)) {
    lines.push("-- INSERT 후 SELECT로 결과를 확인하세요.");
    const tbl = ref.match(/INSERT\s+INTO\s+(\w+)/i);
    if (tbl) {
      lines.push(`INSERT INTO ${tbl[1]} (/* 컬럼 */) VALUES`);
      lines.push("  /* TODO: 값 */");
      lines.push(";");
      lines.push("");
      lines.push(`SELECT * FROM ${tbl[1]};`);
    }
  } else if (/^UPDATE\b/is.test(ref)) {
    lines.push("-- UPDATE 문을 완성하세요.");
    const tbl = ref.match(/UPDATE\s+(\w+)/i);
    lines.push(`UPDATE ${tbl ? tbl[1] : "테이블명"}`);
    lines.push("SET /* TODO: 컬럼 = 값 */");
    if (/WHERE/i.test(ref)) lines.push("WHERE /* TODO */");
    lines.push(";");
  } else if (/^DELETE\b/is.test(ref)) {
    lines.push("-- DELETE 문을 완성하세요.");
    const tbl = ref.match(/DELETE\s+FROM\s+(\w+)/i);
    lines.push(`DELETE FROM ${tbl ? tbl[1] : "테이블명"}`);
    if (/WHERE/i.test(ref)) lines.push("WHERE /* TODO */");
    lines.push(";");
  } else if (/^CREATE\s+TABLE\b/is.test(ref)) {
    lines.push("-- CREATE TABLE 문을 완성하세요.");
    const tbl = ref.match(/CREATE\s+TABLE\s+(\w+)/i);
    lines.push(`CREATE TABLE ${tbl ? tbl[1] : "테이블명"} (`);
    lines.push("  -- TODO: 컬럼 정의");
    lines.push(");");
    if (/PRAGMA/i.test(ref)) {
      lines.push("");
      const pragma = ref.match(/PRAGMA\s+table_info\([^)]+\)/gi);
      pragma?.forEach((p) => {
        const tbl = p.match(/table_info\s*\(\s*([^)]+)\s*\)/i)?.[1]?.trim();
        lines.push(tbl ? `DESC ${tbl};` : `${p};`);
      });
    }
  } else {
    lines.push("-- 아래에 SQL을 작성하세요.");
  }

  return lines.join("\n");
}

function hasSqlCodeBody(text) {
  return text
    .split("\n")
    .some(
      (line) =>
        line.trim() &&
        !line.trim().startsWith("--") &&
        /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|PRAGMA|WITH|DESC)\b/i.test(line)
    );
}

function buildEliceStarterSql(item) {
  const raw = (item.starterSql || "").trim();
  const ref = (item.referenceSql || "").trim();

  if (!raw && !ref) return buildEliceGuideHeader(item, "sql");

  const cleaned = stripReferenceLeakFromStarter(raw, ref, "sql");
  const body = hasSqlCodeBody(cleaned) ? cleaned : buildSqlSkeletonFromRef(item);
  return ensureEliceGuideComments(body, item, "sql");
}

function buildEliceStarterCode(item) {
  const raw = (item.starterCode || "").trim();
  const ref = (item.referenceCode || "").trim();

  if (!raw) {
    return buildEliceGuideHeader(item, "python");
  }

  const cleaned = stripReferenceLeakFromStarter(raw, ref, "python");
  const body = stripGuideCommentsFromCode(cleaned, item, "python").trim();
  const hasCode = /\b(import|from|def|for|while|print|=|None)\b/.test(body);

  if (!hasCode) {
    return ensureEliceGuideComments(body, item, "python");
  }

  return ensureEliceGuideComments(cleaned, item, "python");
}

function formatSqlEliceSchemaHtml(item) {
  const guide = item.practiceGuide || {};
  const parts = [];
  const meta = item.sandbox ? StudySandbox.getTableMeta(item.sandbox) : null;

  if (meta?.schemaText) {
    parts.push(
      `<div class="guide-elice-schema"><h4 class="guide-section-title">테이블 정보</h4><pre class="practice-schema-inline">${escapeHtml(meta.schemaText)}</pre></div>`
    );
  }
  if (guide.schemaHint) {
    parts.push(
      `<p class="guide-tip guide-tip-muted"><strong>스키마 힌트</strong> ${escapeHtml(guide.schemaHint)}</p>`
    );
  }
  if (guide.tables?.length) {
    parts.push(
      `<p class="guide-tip"><strong>사용 테이블</strong> <code>${guide.tables.map(escapeHtml).join("</code> · <code>")}</code></p>`
    );
  }

  const sampleTables = item.sandbox ? StudySandbox.getSamplePreviewTables(item.sandbox) : [];
  if (sampleTables.length) {
    parts.push('<div class="guide-sample-data-wrap"><h4 class="guide-section-title">샘플 데이터</h4>');
    sampleTables.forEach((block) => {
      parts.push(
        formatGuideHtmlTable(block.columns, block.rows, {
          caption: block.label,
        })
      );
    });
    parts.push(
      '<p class="guide-tip guide-tip-muted"><strong>탐색 팁</strong> 에디터 위 「테이블 탐색」 버튼을 누르면 콘솔에서 바로 조회됩니다. [실행]은 <em>커서가 있는 줄</em>만 실행하므로, 탐색용 <code>SELECT *</code> 줄에 커서를 두거나 「전체 탐색 실행」을 사용하세요.</p></div>'
    );
  }

  if (guide.insertExamples?.length) {
    guide.insertExamples.forEach((ex) => {
      parts.push(
        formatGuideHtmlTable(null, ex.fields, {
          attrMode: true,
          caption: ex.label || ex.title || "삽입 예시",
        })
      );
    });
  } else if (guide.referenceRows?.length) {
    guide.referenceRows.forEach((block) => {
      parts.push(
        formatGuideHtmlTable(null, block.fields || block.rows, {
          attrMode: true,
          caption: block.label,
        })
      );
    });
  }

  if (guide.outputColumns?.length) {
    const rows = guide.outputColumns.map((c) => [c, "", ""]);
    parts.push(
      formatGuideHtmlTable(["컬럼명", "설명", "자료형"], rows, {
        caption: "출력 컬럼 (SELECT 결과)",
      })
    );
  }

  if (!parts.length) return "";
  return `<div class="guide-elice-schema-wrap">${parts.join("")}</div>`;
}

function getPracticeSql() {
  if (state.dndCtrl && typeof StudySqlDnd !== "undefined") {
    return StudySqlDnd.getAssembledSql();
  }
  return el.codeEditor?.value || "";
}

function syncDndSqlToEditor() {
  if (state.dndCtrl && el.codeEditor) {
    el.codeEditor.value = getPracticeSql();
  }
}

function renderHintPanel(item) {
  const parts = [];
  const itemType = resolveItemType(item);
  if (item.hint) {
    parts.push(`<p><strong>힌트</strong> — ${escapeHtml(item.hint)}</p>`);
  } else if (itemType === "choice" && item.summary) {
    parts.push(
      `<p><strong>힌트</strong> — ${escapeHtml(item.summary)}</p>`
    );
  }
  if (item.practiceGuide?.steps?.length) {
    parts.push(
      "<p><strong>단계별 가이드</strong></p><ol class=\"hint-steps\">" +
        item.practiceGuide.steps.map((s) => `<li>${highlightGuideTerms(s)}</li>`).join("") +
        "</ol>"
    );
  }
  if (!parts.length) {
    showPanel(el.hintPanel, "등록된 힌트가 없습니다.", "");
    return;
  }
  showPanelHtml(el.hintPanel, parts.join(""), "hint-panel--rich");
}

function renderSummaryPanel(item) {
  const parts = [];
  const goal = item.practiceGuide?.goal || item.instructions;
  if (goal) {
    parts.push(`<p><strong>이번 실습 목표</strong><br>${highlightGuideTerms(goal)}</p>`);
  }
  if (item.summary) {
    parts.push(`<p><strong>개념 요약</strong><br>${escapeHtml(item.summary)}</p>`);
  }
  if (item.practiceGuide?.tip) {
    parts.push(`<p class="guide-tip" style="margin-top:10px"><strong>TIP</strong> ${highlightGuideTerms(item.practiceGuide.tip)}</p>`);
  }
  if (!parts.length) {
    showPanel(el.summaryPanel, "등록된 요약이 없습니다.", "");
    return;
  }
  showPanelHtml(el.summaryPanel, parts.join(""), "summary-panel--rich");
}

function renderAnswerPanel(item) {
  if (isSqlDndItem(item) && typeof StudySqlDnd !== "undefined") {
    showPanelHtml(el.answerPanel, StudySqlDnd.renderAnswerPreview(item), "answer-panel--dnd");
    return;
  }
  if (resolveItemType(item) === "choice") {
    const correct = item.options?.find((o) => o.isCorrect);
    const text = correct?.text || item.answers?.[0] || "등록된 정답이 없습니다.";
    showPanel(el.answerPanel, text, "정답");
    return;
  }
  const text =
    item?.answers?.join(" / ") ||
    item?.referenceSql ||
    item?.referenceCode ||
    "등록된 정답이 없습니다.";
  showPanel(el.answerPanel, text, "정답");
}

function getPythonCompletionsForItem(item) {
  const columns = [];
  const variables = ["df", "mm", "april", "merged", "filtered", "badair", "thursday", "foreigner", "요일", "filled"];
  const names = StudySandbox.collectDatasetNames?.(item) || item?.datasets || [];

  names.forEach((key) => {
    const preview = StudySandbox.getDatasetPreview?.(key, 1);
    if (preview?.columns) columns.push(...preview.columns);
  });

  const snippets = [];
  const ref = item?.referenceCode || "";
  if (ref.includes("groupby")) {
    snippets.push({
      label: "groupby → max → loc",
      insert: "df.groupby(['요일', '공휴일'])['어른'].max().loc[('목', 'O')]",
      detail: "이 문항 정답 패턴",
    });
  }
  if (ref.includes("fillna")) {
    snippets.push({ label: "fillna(0)", insert: "df['단체'].fillna(0)", detail: "결측치 채우기" });
  }
  if (ref.includes("concat")) {
    snippets.push({
      label: "pd.concat",
      insert: "pd.concat([df, april], ignore_index=True)",
      detail: "세로 병합",
    });
  }
  if (ref.includes("to_numeric")) {
    snippets.push({
      label: "to_numeric",
      insert: "pd.to_numeric(df['외국인'].str.replace(',', '', regex=False))",
      detail: "숫자 변환",
    });
  }
  if (ref.includes("['미세먼지'].max()")) {
    snippets.push({ label: "미세먼지 max", insert: "mm['미세먼지'].max()", detail: "최댓값" });
  }

  return {
    columns: [...new Set(columns)],
    variables,
    snippets,
  };
}

async function renderPythonDataPanels(item) {
  clearPythonRunResultPanel();

  if (resolveItemType(item) !== "python") {
    return;
  }

  const names = StudySandbox.collectDatasetNames(item);
  if (!names.length) {
    if (el.practiceReferenceWrap) el.practiceReferenceWrap.hidden = true;
    if (el.practiceReferenceContent) el.practiceReferenceContent.innerHTML = "";
    return;
  }

  if (el.practiceReferenceWrap) el.practiceReferenceWrap.hidden = false;
  if (el.practiceExpectedWrap) el.practiceExpectedWrap.hidden = true;

  const guide = item.practiceGuide || {};
  const focusCols = guide.focusColumns || [];

  let html = "";
  if (focusCols.length) {
    html +=
      '<p class="guide-label"><strong>이번에 쓸 열</strong></p><div class="guide-focus-cols">' +
      focusCols.map((c) => `<span class="guide-focus-chip">${escapeHtml(c)}</span>`).join("") +
      "</div>";
  }

  names.forEach((key) => {
    const preview = StudySandbox.getDatasetPreview(key, 5);
    if (preview) {
      html += `<div class="guide-ref-block">${StudySandbox.formatDatasetPreviewHtml(preview)}</div>`;
    }
  });

  if (item.setupCode?.trim()) {
    html +=
      '<p class="guide-tip guide-tip-muted"><strong>① 자료 해석</strong> 위 표에서 열 의미를 파악하세요.<br><strong>② 코드</strong> 에디터 [TODO]만 작성 (import·read_csv는 자동).</p>';
  }

  if (el.practiceReferenceContent) {
    el.practiceReferenceContent.innerHTML = html;
  }
}

function clearPythonRunResultPanel() {
  if (el.practiceRunResultWrap) el.practiceRunResultWrap.hidden = true;
  if (el.practiceRunResultContent) el.practiceRunResultContent.innerHTML = "";
}

function updatePythonRunResultPanels(previews, item) {
  if (!el.practiceRunResultWrap || !el.practiceRunResultContent) return;

  const picked =
    StudySandbox.prioritizeDataFramePreviews?.(previews, item) || previews || [];
  if (!picked.length) {
    clearPythonRunResultPanel();
    return;
  }

  el.practiceRunResultWrap.hidden = false;
  let html =
    '<p class="guide-tip guide-tip-muted">방금 실행·채점한 코드로 만든 표입니다. 위 <strong>참고 데이터(원본)</strong>와 비교해 보세요.</p>';
  html += StudySandbox.formatDataFramePreviewsHtml(picked);
  el.practiceRunResultContent.innerHTML = html;

  requestAnimationFrame(() => {
    el.practiceRunResultWrap?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function markPythonWorkflowStep(stepIndex) {
  el.practiceWorkflow?.querySelectorAll(".practice-workflow-step").forEach((node, i) => {
    node.classList.toggle("is-current", i === stepIndex);
    node.classList.toggle("is-done", i < stepIndex);
  });
}

function renderPythonWorkflow(item) {
  const isPython = item && resolveItemType(item) === "python";
  el.practiceWorkflow?.classList.toggle("is-visible", isPython);
  el.pythonTaskStrip?.classList.toggle("is-visible", isPython);
  el.pythonProbeBar?.classList.toggle("is-visible", isPython);
  renderSqlProbeBar(isPython ? null : item);

  if (!isPython) {
    if (el.practiceWorkflow) el.practiceWorkflow.innerHTML = "";
    if (el.pythonTaskGoal) el.pythonTaskGoal.textContent = "";
    if (el.pythonTaskVars) el.pythonTaskVars.textContent = "";
    if (el.pythonProbeBar) {
      el.pythonProbeBar.hidden = true;
      el.pythonProbeBar.classList.remove("is-visible");
    }
    return;
  }

  const guide = item.practiceGuide || {};
  const hasData = (StudySandbox.collectDatasetNames?.(item) || []).length > 0;

  if (el.practiceWorkflow) {
    el.practiceWorkflow.innerHTML =
      '<ol class="practice-workflow-steps">' +
      '<li class="practice-workflow-step is-current"><span>1</span> 자료 읽기</li>' +
      '<li class="practice-workflow-step"><span>2</span> 탐색·코드</li>' +
      '<li class="practice-workflow-step"><span>3</span> 실행</li>' +
      '<li class="practice-workflow-step"><span>4</span> 채점</li>' +
      "</ol>";
  }

  if (el.pythonTaskGoal) {
    el.pythonTaskGoal.textContent = guide.goal || item.instructions || item.question || "";
  }

  const todoMatch = (item.starterCode || "").match(/(\w+)\s*=\s*None\s*#\s*TODO[:\s]*(.*)/);
  if (el.pythonTaskVars && todoMatch) {
    el.pythonTaskVars.innerHTML =
      `작성할 변수: <code>${escapeHtml(todoMatch[1])}</code> — ${escapeHtml(todoMatch[2] || "TODO 주석 참고")}`;
  } else if (el.pythonTaskVars) {
    el.pythonTaskVars.textContent = "";
  }

  if (el.pythonProbeBar) {
    const names = StudySandbox.collectDatasetNames(item);
    const hasDf = names.some((n) => n.startsWith("seoul_park"));
    const hasMm = names.includes("misemunji");
    el.pythonProbeBar.querySelectorAll(".python-probe-btn").forEach((btn) => {
      const probe = btn.getAttribute("data-probe") || "";
      const needsDf = probe.includes("df");
      const needsMm = probe.includes("mm");
      btn.hidden = (needsDf && !hasDf) || (needsMm && !hasMm);
    });
    el.pythonProbeBar.hidden = !hasData;
  }
}

function renderSqlProbeBar(item) {
  const isSql = item && resolveItemType(item) === "sql" && !isSqlDndItem(item);
  const queries =
    isSql && item.sandbox ? StudySandbox.getProbeQueries(item.sandbox) : [];
  const visible = isSql && queries.length > 0;

  el.sqlProbeBar?.classList.toggle("is-visible", visible);
  if (el.sqlProbeBar) el.sqlProbeBar.hidden = !visible;

  if (el.sqlProbeButtons) {
    el.sqlProbeButtons.innerHTML = queries
      .map(({ label, sql }) => {
        const displaySql = StudySandbox.pragmaToDescSql(sql);
        return `<button type="button" class="btn secondary-btn sql-probe-btn" data-sql="${escapeHtml(displaySql)}" title="${escapeHtml(displaySql)}">${escapeHtml(label)}</button>`;
      })
      .join("");
  }

  if (el.sqlProbeAllBtn) {
    el.sqlProbeAllBtn.hidden = !visible;
  }
}

async function runSqlProbe(sql) {
  const item = currentItem();
  if (!item?.sandbox || !sql?.trim()) return;
  const runStartedAt = showTerminalRunning("sql");
  const result = await StudySandbox.runSql(sql.trim(), item.sandbox, { mode: "single" });
  if (!result.ok) {
    await revealTerminalOutput(formatSqlErrorConsole(result), {
      kind: "sql",
      runStartedAt,
      alreadyRunning: true,
    });
    return;
  }
  await revealTerminalOutput(StudySandbox.formatSqlConsole(result.html), {
    kind: "sql",
    runStartedAt,
    alreadyRunning: true,
  });
  state.lastRunOutput = result.text;
}

async function runPythonProbe(snippet) {
  const item = currentItem();
  if (!item || resolveItemType(item) !== "python") return;
  const ready = await ensurePythonReady(true);
  if (!ready) return;

  const runStartedAt = showTerminalRunning("python");
  const code = `${item.setupCode ? "" : "import pandas as pd\n"}${snippet}`;
  const result = await StudySandbox.runPython(code, { item });
  await revealTerminalOutput(
    StudySandbox.formatPythonConsole(result.stdout, result.stderr, { showEmpty: true }),
    { kind: "python", runStartedAt, alreadyRunning: true }
  );
}

let eliceGuideToken = 0;

function formatGuideHtmlTable(columns, rows, options = {}) {
  const { attrMode = false, caption = "" } = options;
  if (!rows?.length) return "";
  const thead = attrMode
    ? "<tr><th>속성</th><th>데이터</th></tr>"
    : `<tr>${columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr>`;
  const bodyRows = attrMode
    ? rows
        .map(
          (r) =>
            `<tr><td>${escapeHtml(String(r[0] ?? ""))}</td><td>${escapeHtml(String(r[1] ?? ""))}</td></tr>`
        )
        .join("")
    : rows
        .map(
          (r) =>
            `<tr>${r.map((c) => `<td>${escapeHtml(String(c ?? "NULL"))}</td>`).join("")}</tr>`
        )
        .join("");
  const cls = attrMode ? "guide-ref-table guide-ref-table--attr" : "guide-ref-table";
  const cap = caption ? `<p class="guide-ref-label">${escapeHtml(caption)}</p>` : "";
  return `<div class="guide-ref-block">${cap}<div class="guide-ref-table-wrap"><table class="${cls}"><thead>${thead}</thead><tbody>${bodyRows}</tbody></table></div></div>`;
}

function parseInsertExamples(sql) {
  if (!sql) return [];
  const examples = [];
  const re =
    /INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*([\s\S]+?)(?=;|\s*(?:INSERT|SELECT|UPDATE|DELETE|ALTER|DROP|PRAGMA)\b|$)/gi;
  let match;
  while ((match = re.exec(sql))) {
    const cols = match[2].split(",").map((s) => s.trim());
    const valuesPart = match[3].trim().replace(/;$/, "");
    const tuples = valuesPart.match(/\([^)]+\)/g) || [];
    tuples.forEach((tuple, idx) => {
      const vals = tuple
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ""));
      const fields = cols.map((c, i) => [c, vals[i] ?? ""]);
      examples.push({ label: `${idx + 1}번 데이터`, fields });
    });
  }
  return examples;
}

function buildExpectedSql(item) {
  const guide = item.practiceGuide || {};
  if (guide.expectedPreviewSql) return guide.expectedPreviewSql;
  const sql = item.referenceSql || "";
  if (guide.postVerifySql) {
    const sep = sql.trim().endsWith(";") ? "\n" : ";\n";
    return `${sql}${sep}${guide.postVerifySql}`;
  }
  if (/\bSELECT\b/i.test(sql)) return sql;
  const delMatch = sql.match(/DELETE\s+FROM\s+(\w+)/i);
  if (delMatch) return `${sql};\nSELECT * FROM ${delMatch[1]};`;
  const updMatch = sql.match(/UPDATE\s+(\w+)/i);
  if (updMatch) return `${sql};\nSELECT * FROM ${updMatch[1]};`;
  return sql;
}

async function renderEliceGuideSidePanels(item) {
  const token = ++eliceGuideToken;
  const hideElice = () => {
    if (el.practiceReferenceWrap) el.practiceReferenceWrap.hidden = true;
    if (el.practiceExpectedWrap) el.practiceExpectedWrap.hidden = true;
    if (el.practiceReferenceContent) el.practiceReferenceContent.innerHTML = "";
    if (el.practiceExpectedContent) el.practiceExpectedContent.innerHTML = "";
  };

  if (resolveItemType(item) !== "sql") {
    hideElice();
    return;
  }

  const typing = isSqlTypingItem(item);
  if (typing) {
    hideElice();
    return;
  }

  const expectedHint = document.getElementById("practice-expected-hint");
  if (expectedHint) {
    expectedHint.textContent = "아래와 같은 결과가 나오도록 SQL을 조립하세요.";
  }
  el.practiceReferenceWrap.hidden = false;
  el.practiceExpectedWrap.hidden = !state.studyMode;
  el.practiceReferenceContent.innerHTML =
    "<span class='sandbox-loading'>참고 데이터 불러오는 중…</span>";
  el.practiceExpectedContent.innerHTML =
    "<span class='sandbox-loading'>실행 결과 불러오는 중…</span>";

  const guide = item.practiceGuide || {};
  let refHtml = "";

  if (guide.insertExamples?.length) {
    guide.insertExamples.forEach((ex) => {
      refHtml += formatGuideHtmlTable(null, ex.fields, {
        attrMode: true,
        caption: ex.label || ex.title,
      });
    });
  } else if (guide.referenceRows?.length) {
    guide.referenceRows.forEach((block) => {
      refHtml += formatGuideHtmlTable(null, block.fields || block.rows, {
        attrMode: true,
        caption: block.label,
      });
    });
  } else {
    const inserts = parseInsertExamples(item.referenceSql);
    if (inserts.length) {
      inserts.forEach((ex) => {
        refHtml += formatGuideHtmlTable(null, ex.fields, {
          attrMode: true,
          caption: ex.label,
        });
      });
    } else if (item.sandbox) {
      const meta = StudySandbox.getTableMeta(item.sandbox);
      const queries =
        meta?.previewQueries || (meta?.previewSql ? [meta.previewSql] : []);
      for (const q of queries) {
        const data = await StudySandbox.runSql(q.trim(), item.sandbox, {
          mode: "single",
          fresh: true,
        });
        if (token !== eliceGuideToken) return;
        if (data.ok && data.columns?.length) {
          const label = q.split("\n")[0].replace(/;$/, "");
          refHtml += formatGuideHtmlTable(data.columns, data.rows, { caption: label });
        }
      }
    }
  }

  if (token !== eliceGuideToken) return;
  el.practiceReferenceContent.innerHTML =
    refHtml || "<p class='guide-expected-hint'>참고 테이블이 없습니다.</p>";

  if (guide.expectedOutputText) {
    el.practiceExpectedContent.innerHTML = `<pre class="guide-cli-pre">${escapeHtml(guide.expectedOutputText)}</pre>`;
  } else {
    const sql = buildExpectedSql(item);
    const result = await StudySandbox.runSql(sql, item.sandbox || "book", {
      mode: "all",
      fresh: true,
    });
    if (token !== eliceGuideToken) return;
    if (result.ok) {
      if (result.columns?.length) {
        el.practiceExpectedContent.innerHTML = StudySqlDnd.formatCliTable(
          result.columns,
          result.rows
        );
      } else {
        el.practiceExpectedContent.innerHTML =
          '<p class="guide-expected-dml">Query OK · DML 문이 정상 실행되면 참고 데이터와 비교해 확인하세요.</p>';
      }
    } else {
      el.practiceExpectedContent.innerHTML =
        "<p class='guide-expected-hint'>실행 결과 미리보기를 불러오지 못했습니다.</p>";
    }
  }

  if (refHtml && el.previewTableBtn) el.previewTableBtn.hidden = true;
}

function setTerminalIdleMessage() {
  el.sandboxResult.innerHTML = StudySandbox.formatSqlIdleConsole(
    "▶ [실행]으로 조립한 SQL을 터미널에서 확인 · [채점]으로 정답 비교"
  );
}

async function showReferenceResultInTerminal(item) {
  if (!item?.referenceSql) {
    setTerminalIdleMessage();
    return;
  }
  const runStartedAt = showTerminalRunning("sql");
  const result = await StudySandbox.runSql(
    item.referenceSql,
    item.sandbox || "book",
    { mode: "all" }
  );
  if (result.ok) {
    const isDml = /^\s*(INSERT|UPDATE|DELETE)\b/i.test(item.referenceSql);
    const innerHtml = result.columns?.length
      ? result.html
      : isDml
        ? `<pre class="sql-cli-table">Query OK (DML 문은 결과 테이블 없이 실행됩니다)</pre>`
        : result.html;
    await revealTerminalOutput(StudySandbox.formatSqlConsole(innerHtml), {
      kind: "sql",
      runStartedAt,
      alreadyRunning: true,
    });
    state.lastRunOutput = result.text || "";
  } else {
    await revealTerminalOutput(formatSqlErrorConsole(result), {
      kind: "sql",
      runStartedAt,
      alreadyRunning: true,
    });
  }
}

function placeHelpUi(isPractice) {
  const block = el.practiceHelpBlock;
  if (!block) return;
  const isChoice = resolveItemType(currentItem()) === "choice";
  block.classList.toggle("practice-help-block--dock", isPractice);
  block.hidden = !(isPractice || isChoice);
  if (isPractice && el.sandboxArea) {
    if (block.parentElement !== el.sandboxArea) {
      el.sandboxArea.insertBefore(block, el.sandboxWorkbench || el.sandboxArea.firstChild);
    }
  } else if (el.feedbackBox && block.parentElement !== el.studyCard) {
    el.feedbackBox.before(block);
  }
}

function setPracticeLayout(itemType, isSqlDnd) {
  const isPractice = itemType === "sql" || itemType === "python";
  const isChoice = itemType === "choice";
  const isPythonElice = itemType === "python";
  const isCodePane =
    isPractice && (itemType === "python" || (itemType === "sql" && !isSqlDnd));
  const isSqlElice = itemType === "sql" && !isSqlDnd;
  el.practiceWorkspace?.classList.toggle("practice-workspace--elice", isPractice);
  el.practiceWorkspace?.classList.toggle("practice-workspace--code", isCodePane);
  el.practiceWorkspace?.classList.toggle("practice-workspace--python-elice", isPythonElice);
  el.practiceWorkspace?.classList.toggle("practice-workspace--sql-elice", isSqlElice);
  el.sandboxArea?.classList.toggle("sandbox-area--code", isCodePane);
  el.sandboxArea?.classList.toggle("sandbox-area--python-elice", isPythonElice);
  el.sandboxArea?.classList.toggle("sandbox-area--sql-elice", isSqlElice);
  if (el.practiceHelpBlock) {
    el.practiceHelpBlock.hidden = !(isPractice || isChoice);
  }
  if (isPractice && typeof StudyLayoutSplitter !== "undefined") {
    requestAnimationFrame(() => StudyLayoutSplitter.clampStoredSizes?.());
  }
}

function setSqlDndMode(active, item) {
  el.sqlDndWorkspace.hidden = !active;
  el.codeEditorWrap.hidden = active;
  if (el.runAllCodeBtn) el.runAllCodeBtn.hidden = active;
  el.sandboxArea.classList.toggle("sandbox-area--dnd", active);
  if (el.sandboxOutputLabel) {
    el.sandboxOutputLabel.textContent = active ? "터미널" : "콘솔";
  }
  if (active && item) {
    if (typeof StudySqlDnd !== "undefined") {
      StudySqlDnd.destroy();
      state.dndCtrl = StudySqlDnd.init(el.sqlDndWorkspace, item, {
        onChange: (sql) => {
          if (el.codeEditor) el.codeEditor.value = sql;
        },
      });
    }
    const diff = item.dndDifficulty || "medium";
    const diffLabel = { easy: "초급", medium: "중급", hard: "고급" }[diff] || "중급";
    el.sandboxLang.textContent = `SQL · 드래그 조립`;
    if (el.editorStatus)
      el.editorStatus.innerHTML =
        `<span class="dnd-difficulty-badge dnd-diff-${diff}">${diffLabel}</span> 조각을 빈칸에 끼워 넣으세요`;
    setTerminalIdleMessage();
    renderEliceGuideSidePanels(item);
  } else {
    if (typeof StudySqlDnd !== "undefined") StudySqlDnd.destroy();
    state.dndCtrl = null;
    if (item && resolveItemType(item) === "sql") {
      renderEliceGuideSidePanels(item);
    } else if (item && resolveItemType(item) === "python") {
      renderPythonDataPanels(item);
    } else {
      eliceGuideToken += 1;
      if (el.practiceReferenceWrap) el.practiceReferenceWrap.hidden = true;
      if (el.practiceExpectedWrap) el.practiceExpectedWrap.hidden = true;
      if (el.practiceReferenceContent) el.practiceReferenceContent.innerHTML = "";
      if (el.practiceExpectedContent) el.practiceExpectedContent.innerHTML = "";
    }
  }
  updateCodeSelectionUI();
}

function clearFeedback() {
  state.checkResult = null;
  el.feedbackBox.hidden = true;
  el.feedbackBox.className = "feedback";
  el.feedbackBox.innerHTML = "";
  el.nextBtn.hidden = true;
  el.submitBtn.hidden = false;
  el.submitBtn.textContent = "채점";
}

function clearSandboxConsole() {
  StudyTerminalStream?.cancel?.();
  const item = currentItem();
  const itemType = item ? resolveItemType(item) : null;
  if (itemType === "sql" && state.dndCtrl) {
    setTerminalIdleMessage();
    return;
  }
  if (itemType === "python") {
    el.sandboxResult.innerHTML = StudySandbox.formatPythonIdleConsole();
    return;
  }
  el.sandboxResult.innerHTML = StudySandbox.formatSqlIdleConsole();
}

function showFeedback(result, item) {
  state.checkResult = result.level;
  const itemType = item ? resolveItemType(item) : null;
  const isPractice = itemType === "python" || itemType === "sql";

  if (result.level === "correct" && isPractice) {
    el.feedbackBox.hidden = false;
    el.feedbackBox.className = "feedback correct";
    el.feedbackBox.innerHTML = `<strong>✓ 정답</strong> — ${result.message}`;
    if (item.explanation) {
      el.feedbackBox.innerHTML += `<br><br>${escapeHtml(item.explanation).replace(/\n/g, "<br>")}`;
    }
    el.nextBtn.hidden = false;
    el.submitBtn.textContent = "다시 채점";
    return;
  }

  el.feedbackBox.hidden = false;

  if (result.level === "correct") {
    el.feedbackBox.className = "feedback correct";
    el.feedbackBox.innerHTML = `<strong>✓ 정답</strong> — ${result.message}`;
    if (item.explanation) {
      el.feedbackBox.innerHTML += `<br><br>${escapeHtml(item.explanation).replace(/\n/g, "<br>")}`;
    }
    el.nextBtn.hidden = false;
    el.submitBtn.textContent = "다시 채점";
  } else if (result.level === "partial") {
    el.feedbackBox.className = "feedback partial";
    el.feedbackBox.innerHTML = `<strong>${result.message}</strong>`;
    if (result.expected) el.feedbackBox.innerHTML += `<br>정답 예시: <code>${result.expected}</code>`;
    if (item.summary) el.feedbackBox.innerHTML += `<br><br>${item.summary}`;
    el.submitBtn.textContent = "다시 채점";
    el.nextBtn.hidden = false;
  } else if (result.level === "empty") {
    el.feedbackBox.className = "feedback partial";
    el.feedbackBox.innerHTML = `<strong>${result.message}</strong>`;
  } else {
    el.feedbackBox.className = "feedback wrong";
    el.feedbackBox.innerHTML = `<strong>✗ 오답</strong> — ${result.message}`;
    if (result.expected && state.studyMode) {
      el.feedbackBox.innerHTML += `<br>참고 정답: <code>${result.expected}</code>`;
    }
    if (item.summary) el.feedbackBox.innerHTML += `<br><br>${item.summary}`;
    el.submitBtn.textContent = "다시 채점";
    el.nextBtn.hidden = false;
  }

  if (!isPractice && result.runResult?.html) {
    el.feedbackBox.innerHTML += `<div class="feedback-run">${result.runResult.html}</div>`;
  } else if (!isPractice && result.runResult?.text) {
    el.feedbackBox.innerHTML += `<pre class="feedback-run-text">${result.runResult.text}</pre>`;
  }

  if (isPractice && result.runResult?.html) {
    const runHtml =
      itemType === "sql"
        ? StudySandbox.formatSqlConsole(result.runResult.html)
        : result.runResult.html;
    void revealTerminalOutput(runHtml, { kind: itemType === "python" ? "python" : "sql" });
    if (result.runResult.text) state.lastRunOutput = result.runResult.text;
  }
}

function updateExplainContent(item) {
  const itemType = resolveItemType(item);
  if (itemType === "sql" && typeof StudySqlDnd !== "undefined" && isSqlDndItem(item)) {
    const parts = [];
    if (item.explanation) {
      parts.push(`<p>${escapeHtml(item.explanation)}</p>`);
    } else if (item.summary) {
      parts.push(`<p>${escapeHtml(item.summary)}</p>`);
    }
    if (item.practiceGuide?.steps?.length) {
      parts.push(
        "<p><strong>풀이 순서</strong></p><ol>" +
          item.practiceGuide.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("") +
          "</ol>"
      );
    }
    parts.push("<p><strong>조립 완성 미리보기</strong></p>");
    parts.push(StudySqlDnd.renderAnswerPreview(item));
    if (item.referenceSql) {
      parts.push(`<p><strong>모범 쿼리 (터미널 실행용)</strong></p><pre class="explain-sql-block">${escapeHtml(item.referenceSql)}</pre>`);
    }
    el.explainContent.innerHTML = parts.join("") || "등록된 해설이 없습니다.";
    el.explainDetails.open = false;
    return;
  }

  const parts = [];
  if (itemType === "choice" && item.options?.length) {
    if (item.explanation) {
      parts.push(`<p>${escapeHtml(item.explanation).replace(/\n/g, "<br>")}</p>`);
    }
    const correctOpt = item.options.find((o) => o.isCorrect);
    if (correctOpt?.rationale) {
      parts.push(
        `<p><strong>정답 — ${escapeHtml(correctOpt.text)}</strong><br>${escapeHtml(correctOpt.rationale)}</p>`
      );
    }
    const wrongOpts = item.options.filter(
      (o) => !o.isCorrect && o.rationale && !o.rationale.includes("이 보기는 정답이 아닙니다")
    );
    if (wrongOpts.length) {
      parts.push(
        "<p><strong>오답 보기 정리</strong></p><ul>" +
          wrongOpts
            .map((o) => `<li><strong>${escapeHtml(o.text)}</strong> — ${escapeHtml(o.rationale)}</li>`)
            .join("") +
          "</ul>"
      );
    }
    if (!item.explanation && item.summary) {
      parts.push(`<p>${escapeHtml(item.summary)}</p>`);
    }
    el.explainContent.innerHTML = parts.join("") || "등록된 해설이 없습니다.";
    el.explainDetails.open = false;
    return;
  }

  if (item.explanation) parts.push(item.explanation);
  if (item.summary && !item.explanation) parts.push(item.summary);
  if (item.referenceSql) {
    parts.push(`\n[모범 쿼리]\n${item.referenceSql}`);
  }
  if (item.referenceCode) {
    parts.push(`\n[모범 코드]\n${item.referenceCode}`);
  }
  el.explainContent.textContent = parts.join("\n\n") || "등록된 해설이 없습니다.";
  el.explainDetails.open = false;
}

function updateStats() {
  const items = getActiveDeckItems();
  const key = deckKey(state.currentDeckId);
  const store = state.progress[key] || {};
  const labels = getCategoryStatLabels();
  const comp = getDeckComposition(state.currentDeckId);

  let done = 0;
  let review = 0;
  items.forEach((item) => {
    const p = store[item.id];
    if (!p) return;
    if (p.status === "done") done++;
    if (isReviewStatus(p.status)) review++;
  });

  const remaining = Math.max(0, items.length - done);

  if (el.statsPanelTitle) el.statsPanelTitle.textContent = labels.panelTitle;
  if (el.statTotalLabel) el.statTotalLabel.textContent = labels.total;
  if (el.statDoneLabel) el.statDoneLabel.textContent = labels.done;
  if (el.statReviewLabel) el.statReviewLabel.textContent = labels.review;

  el.statTotal.textContent = String(items.length);
  el.statDone.textContent = done;
  el.statReview.textContent = review;
  const denom = items.length;
  el.progressFill.style.width = denom ? `${(done / denom) * 100}%` : "0%";

  if (el.statSummaryHint) {
    const sessionPos = state.queue.length ? state.index + 1 : 0;
    const sessionTotal = state.queue.length;
    const dupeNote =
      comp.choiceDupes > 0
        ? ` · 동일 지문 ${comp.choiceDupes}개는 출제에서 제외`
        : "";
    let splitNote = "";
    if (isSplitQuizMode() && state.itemCategory === "choice" && isExamDeck()) {
      const idx = getSplitChunkIndex();
      splitNote = ` · 대비 ${idx} (${getSplitChunkItems(idx).length}문항)`;
    }
    el.statSummaryHint.textContent = `코스 구성: 선택형 ${comp.choice} · 실습 ${comp.practice}${dupeNote}${splitNote} | 이번 세트 ${sessionPos}/${sessionTotal} · 미완료 ${remaining}`;
  }
}

function updateQuizModeUI() {
  const sectionMode = state.quizMode === "section";
  const splitMode = isSplitQuizMode();
  el.sectionFilter.disabled = !sectionMode || splitMode;
  updatePracticePartPanel();
  updateDeckQuizModeOptions();

  if (sectionMode) {
    el.quizModeHint.textContent = "선택한 섹션의 문제만 무작위로 출제됩니다.";
    el.sectionHint.textContent = "풀고 싶은 섹션을 고르면 해당 문제가 랜덤 순서로 나옵니다.";
  } else if (splitMode && isExamDeck() && state.itemCategory === "choice") {
    const idx = getSplitChunkIndex();
    const chunk = getSplitChunkItems(idx);
    const first = chunk[0]?.section || "";
    const last = chunk[chunk.length - 1]?.section || "";
    const rangeNote = first && last && first !== last ? ` · ${first} ~ ${last}` : "";
    el.quizModeHint.textContent = `코딩테스트 대비 ${idx} — ${chunk.length}문항만 출제 (5분할 · 중복 없음)${rangeNote}`;
    el.sectionHint.textContent = "다른 묶음은 «문제 세트»에서 코딩테스트 대비 1~5를 선택하세요.";
    state.sectionFilter = "";
    if (el.sectionFilter) el.sectionFilter.value = "";
  } else {
    state.sectionFilter = "";
    if (el.sectionFilter) el.sectionFilter.value = "";
    const cat = state.itemCategory === "practice" ? "실습" : "선택형";
    if (isExamDeck()) {
      el.quizModeHint.textContent =
        state.itemCategory === "practice"
          ? "시험 범위 실습 문제만 랜덤 출제합니다. «실습 파트»에서 Python·SQL 등을 골라 보세요."
          : "전체 279문항 또는 «코딩테스트 대비 1~5»로 나눠 풀 수 있습니다.";
    } else {
      el.quizModeHint.textContent = `현재 ${cat} 탭 문제만 무작위로 출제됩니다.`;
    }
    el.sectionHint.textContent = splitMode
      ? "5분할은 코딩테스트 시험대비 + 선택형 탭에서만 사용할 수 있습니다."
      : "전체 모드에서는 섹션을 선택할 수 없습니다.";
  }
}

function populateSectionFilter() {
  const items = getActiveDeckItems();
  const deck = state.decks[state.currentDeckId];
  const order = deck?.meta?.sectionOrder;
  let sections = [...new Set(items.map((i) => i.section).filter(Boolean))];
  if (order?.length) {
    sections.sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b, "ko");
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  } else {
    sections.sort((a, b) => a.localeCompare(b, "ko"));
  }
  const prev = state.sectionFilter;

  el.sectionFilter.innerHTML = '<option value="">섹션을 선택하세요</option>';
  sections.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    el.sectionFilter.appendChild(opt);
  });

  if (prev && sections.includes(prev)) {
    state.sectionFilter = prev;
    el.sectionFilter.value = prev;
  } else {
    state.sectionFilter = "";
    el.sectionFilter.value = "";
  }

  updateQuizModeUI();
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const GUIDE_HIGHLIGHT_RE =
  /\b(SELECT|FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|CROSS JOIN|SELF JOIN|ON|ORDER BY|GROUP BY|HAVING|LIMIT|DISTINCT|UNION|UNION ALL|INTERSECT|EXCEPT|PRAGMA|OVER|PARTITION BY|LAG|LEAD|FIRST_VALUE|LAST_VALUE|RANK|DENSE_RANK|ROW_NUMBER|COUNT|SUM|AVG|MAX|MIN|WITH ROLLUP|AS)\b|([A-Z][A-Z0-9_]*)/gi;

function highlightGuideTerms(text) {
  const safe = escapeHtml(text || "");
  return safe.replace(GUIDE_HIGHLIGHT_RE, (match) => {
    if (match.length < 2) return match;
    return `<strong class="guide-kw">${match}</strong>`;
  });
}

function renderPracticeGuide(item, itemType) {
  const isPractice = itemType === "sql" || itemType === "python";

  el.studyCard.classList.toggle("practice-mode", isPractice);
  el.practiceWorkspace.hidden = !isPractice;
  el.practiceWorkspace.classList.toggle("is-active", isPractice);
  el.instructionsBox.hidden = true;

  if (!isPractice) {
    el.practiceGuidePanel.hidden = true;
    el.practiceGuideContent.innerHTML = "";
    if (el.practiceGuideMutedContent) el.practiceGuideMutedContent.innerHTML = "";
    if (el.practiceGuideOrderFooter) {
      el.practiceGuideOrderFooter.innerHTML = "";
      el.practiceGuideOrderFooter.hidden = true;
    }
    el.practiceSchema.hidden = true;
    el.previewTableBtn.hidden = true;
    if (el.practiceReferenceWrap) el.practiceReferenceWrap.hidden = true;
    if (el.practiceExpectedWrap) el.practiceExpectedWrap.hidden = true;
    return;
  }

  el.practiceGuidePanel.hidden = false;

  const guideHeading = el.practiceGuidePanel?.querySelector(".practice-guide-heading");
  if (guideHeading) {
    guideHeading.textContent = itemType === "python" ? "이렇게 해봐요!" : "지시사항";
  }

  const guide = item.practiceGuide || {};
  const mainParts = [];
  const mutedParts = [];
  const orderParts = [];

  const goal = guide.goal || item.instructions;
  if (goal) {
    mainParts.push(`<p class="guide-lead">${highlightGuideTerms(goal)}</p>`);
  }

  if (guide.steps?.length) {
    mainParts.push(
      "<ol class=\"guide-steps\">" +
        guide.steps.map((s) => `<li>${highlightGuideTerms(s)}</li>`).join("") +
        "</ol>"
    );
  }

  if (guide.outputColumns?.length) {
    mainParts.push(
      "<p class=\"guide-label\"><strong>출력 컬럼</strong></p><ul class=\"guide-columns\">" +
        guide.outputColumns.map((c) => `<li><code>${escapeHtml(c)}</code></li>`).join("") +
        "</ul>"
    );
  }

  if (guide.tip) {
    mainParts.push(`<p class="guide-tip"><strong>Tip!</strong> ${highlightGuideTerms(guide.tip)}</p>`);
  }

  if (guide.codeSnippet) {
    mainParts.push(
      `<div class="guide-code-snippet"><p class="guide-label"><strong>참고 코드</strong></p>` +
        `<pre class="practice-schema-inline">${escapeHtml(guide.codeSnippet)}</pre></div>`
    );
  }

  if (itemType === "sql") {
    const typing = isSqlTypingItem(item);
    orderParts.push(
      typing
        ? '<p class="guide-order"><strong>실습 순서</strong> ① 왼쪽 지시사항·테이블 정보 확인 → ② <strong>main.sql</strong>에 주석을 참고해 SQL 작성 → ③ [실행]으로 콘솔 확인 → ④ [채점]<br><span class="guide-tip-sub">Ctrl+Enter 실행 · Tab SQL 추천 · 에디터 주석이 풀이 가이드입니다</span></p>'
        : '<p class="guide-order"><strong>실습 순서</strong> ① 보관함 조각을 <strong>SQL 조립</strong> 빈칸에 놓기 → ② [실행]으로 터미널에서 내 결과 확인 → ③ 왼쪽 <strong>기대 결과</strong>와 비교 후 [채점]<br><span class="guide-tip-sub">틀린 조각은 빈칸에서 다시 보관함으로 끌어오세요.</span></p>'
    );
    if (typing) {
      const schemaHtml = formatSqlEliceSchemaHtml(item);
      if (schemaHtml) mutedParts.push(schemaHtml);
      mutedParts.push(
        '<p class="guide-tip guide-tip-muted"><strong>외부 실습</strong> 더 넓은 DB로 연습하려면 ' +
          '<a href="https://sqliteonline.com/" target="_blank" rel="noopener noreferrer">SQLiteOnline</a>' +
          "에서 동일한 SQL을 실행해 볼 수 있습니다.</p>"
      );
    }
  }

  if (itemType === "python") {
    const hasData = (StudySandbox.collectDatasetNames?.(item) || []).length > 0;
    if (hasData) {
      el.previewTableBtn.hidden = false;
      el.previewTableBtn.textContent = "📋 참고: 샘플 데이터 보기";
    } else {
      el.previewTableBtn.hidden = true;
    }
    orderParts.push(
      '<p class="guide-order"><strong>실습 순서</strong> ① 왼쪽 <strong>참고 데이터</strong> 확인 → ② [TODO] 코드 타이핑 → ③ [실행]으로 콘솔 확인 → ④ [채점]<br><span class="guide-tip-sub">Ctrl+Enter 실행 · None 출력은 아직 빈칸이라는 뜻입니다</span></p>'
    );
  }

  el.practiceGuideContent.innerHTML =
    mainParts.join("") ||
    "<p class=\"guide-lead\">커서를 둔 SQL 한 문장만 [실행]됩니다 (실제 sql.js 엔진). [채점]은 <strong>마지막 SELECT</strong>를 모범 답안과 비교합니다.</p>";

  if (el.practiceGuideMutedContent) {
    el.practiceGuideMutedContent.innerHTML = mutedParts.join("");
  }

  if (el.practiceGuideOrderFooter) {
    const orderHtml = orderParts.join("");
    el.practiceGuideOrderFooter.innerHTML = orderHtml;
    el.practiceGuideOrderFooter.hidden = !orderHtml;
  }

  const mutedZone = el.practiceGuidePanel?.querySelector(".practice-guide-zone--muted");
  if (mutedZone) {
    const hasMutedBody =
      mutedParts.length > 0 ||
      !el.practiceSchema?.hidden ||
      !el.previewTableBtn?.hidden ||
      !el.practiceReferenceWrap?.hidden ||
      !el.practiceExpectedWrap?.hidden ||
      !el.practiceRunResultWrap?.hidden;
    mutedZone.hidden = !hasMutedBody;
  }

  if (itemType === "sql" && item.sandbox && !isSqlTypingItem(item)) {
    const meta = StudySandbox.getTableMeta(item.sandbox);
    if (meta) {
      el.practiceSchema.hidden = false;
      el.practiceSchema.textContent = meta.schemaText;
      el.previewTableBtn.hidden = false;
    } else {
      el.practiceSchema.hidden = true;
      el.previewTableBtn.hidden = true;
    }
  } else if (itemType === "sql" && isSqlTypingItem(item)) {
    el.practiceSchema.hidden = true;
    el.previewTableBtn.hidden = false;
    el.previewTableBtn.textContent = "📋 샘플 데이터 콘솔에 보기";
  } else {
    el.practiceSchema.hidden = true;
    el.previewTableBtn.hidden = true;
  }
}

async function previewSandboxTable() {
  const item = currentItem();
  if (!item) return;
  const itemType = resolveItemType(item);

  if (itemType === "python") {
    const names = StudySandbox.collectDatasetNames(item);
    if (!names.length) return;
    el.sandboxResult.innerHTML = "<span class='sandbox-loading'>데이터 미리보기 불러오는 중…</span>";
    try {
      await StudySandbox.preparePythonItem(item);
      let html = '<p class="sandbox-console-msg">── 참고 데이터 (샘플) ──</p>';
      names.forEach((key) => {
        const preview = StudySandbox.getDatasetPreview(key, 8);
        if (preview) {
          html += `<div class="sandbox-python-preview">${StudySandbox.formatDatasetPreviewHtml(preview)}</div>`;
        }
      });
      el.sandboxResult.innerHTML = html;
    } catch (err) {
      el.sandboxResult.innerHTML = `<span class="sandbox-error">${escapeHtml(err.message || String(err))}</span>`;
    }
    return;
  }

  if (!item?.sandbox || itemType !== "sql") return;
  const runStartedAt = showTerminalRunning("sql");
  const result = await StudySandbox.previewTable(item.sandbox, { elice: true });
  if (result.ok) {
    await revealTerminalOutput(StudySandbox.formatSqlConsole(result.html), {
      kind: "sql",
      runStartedAt,
      alreadyRunning: true,
    });
    state.lastRunOutput = result.text;
  } else {
    await revealTerminalOutput(formatSqlErrorConsole(result), {
      kind: "sql",
      runStartedAt,
      alreadyRunning: true,
    });
  }
}

function showEmptyQueuePrompt(reason = "") {
  hideHelpPanels();
  clearFeedback();
  el.studyCard.hidden = false;
  el.resultsCard.hidden = true;
  el.prevBtn.disabled = true;
  el.submitBtn.hidden = true;
  el.nextBtn.hidden = true;

  const deck = state.decks[state.currentDeckId];
  const all = getDeckItems(state.currentDeckId);
  const choiceN = all.filter((i) => resolveItemType(i) === "choice").length;
  const practiceN = all.filter((i) => isPracticeType(i)).length;
  const categoryLabel = getSessionCategoryLabel();
  el.deckTitle.textContent = `${deck?.meta?.title || "학습 세트"} · ${categoryLabel}`;
  el.questionCounter.textContent = "0 / 0";
  el.sectionTag.textContent = state.sectionFilter || "필터";
  el.typeBadge.textContent = "없음";
  el.codeBlock.hidden = true;
  el.instructionsBox.hidden = true;
  el.practiceWorkspace.hidden = true;
  el.practiceWorkspace.classList.remove("is-active");
  el.practiceGuidePanel.hidden = true;
  el.studyCard.classList.remove("practice-mode");
  el.typingArea.hidden = true;
  el.sandboxArea.hidden = true;
  el.choiceArea.hidden = true;

  if (!all.length) {
    el.questionText.textContent =
      "문제 데이터를 불러오지 못했습니다. Ctrl+Shift+R로 새로고침하거나 서버(localhost:8765)로 접속해 주세요.";
    return;
  }

  const lines = [
    reason || `현재 조건에 맞는 ${categoryLabel} 문제가 없습니다.`,
    "",
    `전체: 선택형 ${choiceN}문항 · 실습 ${practiceN}문항`,
    state.reviewOnly ? "「복습 큐만」 필터가 켜져 있으면 목록이 비어 보일 수 있습니다." : "",
    state.quizMode === "section" && state.sectionFilter
      ? "「섹션별」 모드에서는 선택한 섹션에 해당 유형 문제가 있어야 합니다."
      : "",
    "왼쪽에서 필터를 바꾸거나 다른 탭(선택형/실습)을 눌러 보세요.",
  ].filter(Boolean);
  el.questionText.textContent = lines.join("\n");
  updateStats();
}

function showSectionPickPrompt() {
  hideHelpPanels();
  clearFeedback();
  el.studyCard.hidden = false;
  el.resultsCard.hidden = true;
  el.prevBtn.disabled = true;
  el.submitBtn.hidden = true;
  el.nextBtn.hidden = true;

  const deck = state.decks[state.currentDeckId];
  const categoryLabel = getSessionCategoryLabel();
  el.deckTitle.textContent = `${deck?.meta?.title || "학습 세트"} · ${categoryLabel}`;
  el.questionCounter.textContent = "—";
  el.sectionTag.textContent = "섹션 선택";
  el.typeBadge.textContent = "대기";
  el.questionText.textContent = "섹션별 모드입니다. 왼쪽 사이드바에서 풀고 싶은 섹션을 선택하세요.";
  el.codeBlock.hidden = true;
  el.instructionsBox.hidden = true;
  el.practiceWorkspace.hidden = true;
  el.practiceWorkspace.classList.remove("is-active");
  el.practiceGuidePanel.hidden = true;
  el.studyCard.classList.remove("practice-mode");
  el.typingArea.hidden = true;
  el.sandboxArea.hidden = true;
  el.choiceArea.hidden = true;
  updateStats();
}

function getPracticeStarterCode(item, itemType) {
  if (itemType === "sql") {
    return StudySandbox.pragmaToDescSql(buildEliceStarterSql(item));
  }
  if (itemType === "python") return buildEliceStarterCode(item);
  return "";
}

function applyPracticeEditorState(item, itemType, isSqlDnd) {
  if (!el.codeEditor) return "";

  const itemChanged = state.editorItemId !== item?.id;
  state.editorItemId = item?.id || null;
  const starter = getPracticeStarterCode(item, itemType);

  if (itemChanged && itemType === "sql" && item?.sandbox) {
    StudySandbox.resetSqlSession(item.sandbox);
  }

  if (isSqlDnd) {
    el.codeEditor.value = starter;
    el.codeEditor.disabled = true;
    state.codeEditorCtrl?.refresh?.();
    return starter;
  }

  el.codeEditor.disabled = false;
  if (itemChanged || el.codeEditor.value !== starter) {
    el.codeEditor.value = starter.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }
  state.codeEditorCtrl?.setMode?.(itemType);
  state.codeEditorCtrl?.setCompletions?.(
    itemType === "sql"
      ? StudySandbox.getCompletionsForSchema(item.sandbox || "book")
      : getPythonCompletionsForItem(item)
  );
  state.codeEditorCtrl?.refresh?.();
  return starter;
}

function resetPracticeConsole(item, itemType, isSqlDnd) {
  StudyTerminalStream?.cancel?.();
  state.lastRunOutput = "";
  clearPythonRunResultPanel();
  if (itemType === "sql" && isSqlDnd) {
    setTerminalIdleMessage();
    return;
  }
  if (itemType === "python") {
    if (el.sandboxOutputLabel) el.sandboxOutputLabel.textContent = "터미널";
    el.sandboxResult.innerHTML = StudySandbox.formatPythonIdleConsole(
      "▶ [실행]을 누르면 아래 터미널에 Python 출력이 표시됩니다. Ctrl+Enter 단축키"
    );
    return;
  }
  if (itemType === "sql") {
    el.sandboxResult.innerHTML = StudySandbox.formatSqlIdleConsole(
        "▶ [실행]: 커서까지 누적 실행(DB 상태 유지) · [전체 실행]: 에디터 전체 · [초기화]: DB·코드 복원",
    );
  }
}

function normalizeChoiceText(text) {
  return String(text).trim().toLowerCase().replace(/\s+/g, " ");
}

function validateChoiceData(item) {
  const opts = item?.options || [];
  const answers = item?.answers || [];
  if (!opts.length) {
    return { ok: false, reason: "보기(options) 데이터가 없습니다." };
  }
  const correct = opts.filter((o) => o.isCorrect);
  if (correct.length !== 1) {
    return { ok: false, reason: `정답 보기가 ${correct.length}개입니다.` };
  }
  if (answers.length) {
    const primary = normalizeChoiceText(answers[0]);
    const matched = correct.some((o) => normalizeChoiceText(o.text) === primary);
    if (!matched) {
      return {
        ok: false,
        reason: `answers[0](${answers[0]})와 정답 보기(${correct.map((o) => o.text).join(", ")})가 일치하지 않습니다.`,
      };
    }
  }
  return { ok: true };
}

function clearChoiceOptions() {
  if (!el.choiceList) return;
  el.choiceList.replaceChildren();
  el.choiceList.textContent = "";
  delete el.choiceList.dataset.itemId;
  delete el.choiceList.dataset.optionTexts;
  state.selectedChoice = null;
}

function getChoiceDomTexts() {
  if (!el.choiceList) return [];
  return [...el.choiceList.querySelectorAll(".choice-text")].map((node) => node.textContent);
}

function choiceDomMatchesItem(item) {
  const expected = (item?.options || []).map((o) => o.text);
  const dom = getChoiceDomTexts();
  return (
    expected.length > 0 &&
    dom.length === expected.length &&
    dom.every((text, idx) => text === expected[idx])
  );
}

function renderChoiceOptions(item, { retry = false, renderToken = null, theme = "neutral" } = {}) {
  if (!el.choiceList) return;

  const token = renderToken ?? ++state.choiceRenderToken;
  clearChoiceOptions();

  const validation = validateChoiceData(item);
  if (!validation.ok) {
    el.choicePrompt.textContent = `보기 데이터 오류: ${validation.reason}`;
    console.warn("[StudyApp] choice data invalid", item?.id, validation.reason);
    return;
  }

  el.choicePrompt.textContent =
    item.choicePrompt || "보기 중 올바른 답을 고른 뒤 [채점]을 누르세요.";

  const sessionKey = `${state.currentDeckId}:${state.index}:${item.id}`;
  const boundItemId = item.id;

  item.options.forEach((opt, idx) => {
    const id = `choice-${sessionKey}-${idx}`;
    const label = document.createElement("label");
    label.className = "choice-option";
    label.htmlFor = id;
    label.dataset.optionIndex = String(idx);

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = `choice-${sessionKey}`;
    radio.id = id;
    radio.value = String(idx);
    radio.addEventListener("change", () => {
      if (state.checkResult === "correct") return;
      if (currentItem()?.id !== boundItemId) return;
      if (el.choiceList?.dataset.itemId !== boundItemId) return;
      resetChoiceHighlight();
      state.selectedChoice = idx;
      el.choiceList.querySelectorAll(".choice-option").forEach((l) => l.classList.remove("selected"));
      label.classList.add("selected");
      if (state.checkResult) {
        state.checkResult = null;
        el.feedbackBox.hidden = true;
        el.nextBtn.hidden = true;
        el.submitBtn.textContent = "채점";
      }
    });

    const text = document.createElement("span");
    text.className = "choice-text choice-text-plain";
    text.textContent = opt.text ?? "";

    label.append(radio, text);
    el.choiceList.appendChild(label);
  });

  el.choiceList.dataset.itemId = boundItemId;
  el.choiceList.dataset.optionTexts = item.options.map((o) => o.text).join("|");

  if (token !== state.choiceRenderToken) {
    clearChoiceOptions();
    return;
  }

  if (!choiceDomMatchesItem(item)) {
    console.warn(
      "[StudyApp] choice DOM mismatch",
      item.id,
      "dom=",
      getChoiceDomTexts(),
      "expected=",
      item.options.map((o) => o.text)
    );
    if (!retry) {
      renderChoiceOptions(item, { retry: true, renderToken: token });
    }
  }
}

function ensureChoiceOptionsSynced(item) {
  if (!item || resolveItemType(item) !== "choice") return;
  if (choiceDomMatchesItem(item) && el.choiceList?.dataset.itemId === item.id) return;
  renderChoiceOptions(item);
}

function lockChoiceOptions(item, selectedIdx) {
  el.choiceList.querySelectorAll(".choice-option").forEach((label, idx) => {
    const radio = label.querySelector("input");
    if (radio) radio.disabled = true;
    label.classList.remove("selected", "wrong");
    const opt = item.options[idx];
    if (opt?.isCorrect) label.classList.add("correct");
    if (idx === selectedIdx && !opt?.isCorrect) label.classList.add("wrong");
  });
}

function highlightChoiceAttempt(item, selectedIdx) {
  el.choiceList.querySelectorAll(".choice-option").forEach((label, idx) => {
    label.classList.remove("correct", "wrong");
    const opt = item.options[idx];
    if (opt?.isCorrect) label.classList.add("correct");
    if (idx === selectedIdx && !opt?.isCorrect) label.classList.add("wrong");
  });
}

function resetChoiceHighlight() {
  el.choiceList.querySelectorAll(".choice-option").forEach((label) => {
    label.classList.remove("correct", "wrong");
  });
}

function renderQuestion() {
  closePlotPreview();
  closeSessionCompleteDialog();
  hideHelpPanels();
  clearFeedback();
  clearChoiceOptions();
  el.studyCard.hidden = false;
  el.resultsCard.hidden = true;
  el.submitBtn.textContent = "채점";
  el.prevBtn.disabled = state.index <= 0;
  const renderToken = ++state.practiceRenderToken;

  const entry = currentEntry();
  if (!entry) {
    if (state.quizMode === "section" && !state.sectionFilter) {
      showSectionPickPrompt();
      return;
    }
    const activeItems = getActiveDeckItems();
    const allItems = getDeckItems(state.currentDeckId);
    if (!allItems.length) {
      showEmptyQueuePrompt();
      return;
    }
    if (activeItems.length === 0) {
      showEmptyQueuePrompt(
        state.reviewOnly
          ? "복습 큐에 남은 문제가 없습니다."
          : undefined
      );
      return;
    }
    showResults();
    return;
  }

  el.submitBtn.hidden = false;

  const { item } = entry;
  const deck = state.decks[state.currentDeckId];
  const itemType = resolveItemType(item);
  state.editorItemId = item.id;

  const categoryLabel = getSessionCategoryLabel();
  el.deckTitle.textContent = `${deck?.meta?.title || "학습 세트"} · ${categoryLabel}`;
  el.questionCounter.textContent = `이번 ${state.index + 1} / ${state.queue.length}`;
  el.questionCounter.title = "이번 세트에서 몇 번째 문제인지 표시합니다. 완료·복습 수는 좌측 진행 현황을 보세요.";
  el.sectionTag.textContent = item.section || item.day || "일반";
  el.typeBadge.textContent = TYPE_LABELS[itemType] || itemType;

  if (el.practiceSectionTag) {
    el.practiceSectionTag.textContent = item.section || item.day || "일반";
  }
  if (el.practiceQuestionTitle) {
    el.practiceQuestionTitle.textContent = item.question || "";
  }

  el.questionText.replaceChildren();
  if (itemType === "choice" && typeof StudyChoiceSyntax !== "undefined") {
    StudyChoiceSyntax.clearStudyCardTheme(el.studyCard);
    const theme = StudyChoiceSyntax.applyStudyCardTheme(el.studyCard, item);
    el.questionText.innerHTML = StudyChoiceSyntax.renderQuestionHtml(item, theme);
    el.codeBlock.hidden = true;
  } else {
    StudyChoiceSyntax?.clearStudyCardTheme?.(el.studyCard);
    el.questionText.append(item.question || "");
    if (item.code) {
      el.codeBlock.hidden = false;
      el.codeBlock.textContent = item.code;
    } else {
      el.codeBlock.hidden = true;
    }
  }

  el.instructionsBox.hidden = true;

  if (itemType === "choice") {
    el.choiceArea.hidden = false;
    const choiceTheme =
      typeof StudyChoiceSyntax !== "undefined" ? StudyChoiceSyntax.resolveTheme(item) : "neutral";
    if (el.explainDetails) {
      const sum = el.explainDetails.querySelector("summary");
      if (sum) sum.textContent = "퀴즈 해설 보기";
      el.explainDetails.classList.add("explain-details--choice");
    }
    const choiceToken = ++state.choiceRenderToken;
    renderChoiceOptions(item, { renderToken: choiceToken, theme: choiceTheme });
    requestAnimationFrame(() => {
      if (choiceToken !== state.choiceRenderToken) return;
      if (currentItem()?.id !== item.id) return;
      ensureChoiceOptionsSynced(item);
    });
  } else {
    el.choiceArea.hidden = true;
    clearChoiceOptions();
    el.explainDetails?.classList.remove("explain-details--choice");
    if (el.explainDetails) {
      const sum = el.explainDetails.querySelector("summary");
      if (sum) sum.textContent = "퀴즈 해설";
    }
  }

  renderPracticeGuide(item, itemType);

  updateExplainContent(item);

  const isPractice = itemType === "sql" || itemType === "python";
  placeHelpUi(isPractice);
  el.typingArea.hidden = true;
  el.sandboxArea.hidden = !isPractice;
  if (itemType !== "choice") {
    el.choiceArea.hidden = true;
  }

  if (!isPractice) {
    setSqlDndMode(false, null);
    setPracticeLayout(itemType, false);
    renderSqlProbeBar(null);
    if (el.codeEditor) {
      el.codeEditor.value = "";
      el.codeEditor.disabled = false;
      state.codeEditorCtrl?.refresh?.();
    }
    state.lastRunOutput = "";
  }

  if (itemType === "sql" || itemType === "python") {
    const isSqlDnd = isSqlDndItem(item);
    setSqlDndMode(isSqlDnd, item);
    setPracticeLayout(itemType, isSqlDnd);

    if (itemType === "python") {
      renderPythonDataPanels(item);
      renderPythonWorkflow(item);
    } else {
      renderPythonWorkflow(null);
      renderSqlProbeBar(item);
    }
    if (el.sandboxOutputLabel) el.sandboxOutputLabel.textContent = "터미널";

    if (!isSqlDnd) {
      el.sandboxLang.textContent =
        itemType === "python"
          ? "Python · main.py"
          : isExamSession()
            ? "SQL · 시험 모드 (직접 입력)"
            : "SQL · main.sql";
    }

    const starterCode = applyPracticeEditorState(item, itemType, isSqlDnd);
    resetPracticeConsole(item, itemType, isSqlDnd);

    if (!isSqlDnd && el.editorStatus) {
      el.editorStatus.textContent =
        itemType === "python"
          ? "● ()[] 자동쌍 · Tab/→ 추천 · Ctrl+Space 목록 · Ctrl+Enter 실행"
          : "● Ctrl+Enter 실행 · Tab SQL 추천 · 직접 타이핑";
    }
    if (el.runAllCodeBtn) el.runAllCodeBtn.hidden = itemType === "python" || isSqlDnd;

    if (itemType === "python") {
      const prepToken = renderToken;
      ensurePythonReady(false).then(() => {
        if (prepToken !== state.practiceRenderToken) return;
        if (currentItem()?.id !== item.id) return;
        StudySandbox.preparePythonItem(item).catch(() => {});
      });
    }

    if (!isSqlDnd) {
      el.codeEditor.focus();
    }

    const guardItemId = item.id;
    requestAnimationFrame(() => {
      if (renderToken !== state.practiceRenderToken) return;
      if (currentItem()?.id !== guardItemId) return;
      if (!el.codeEditor || el.sandboxArea?.hidden) return;
      if (el.codeEditor.value !== starterCode) {
        applyPracticeEditorState(item, itemType, isSqlDnd);
      }
    });
  } else {
    setSqlDndMode(false, null);
  }

  state.editorSelection = "";
  updateCodeSelectionUI();
  updateStats();
}

async function runSandboxCode(mode = "single") {
  const item = currentItem();
  if (!item) return;
  const itemType = resolveItemType(item);

  if (itemType === "sql" && state.dndCtrl) {
    syncDndSqlToEditor();
    const sql = getPracticeSql().trim();
    if (!sql) {
      el.sandboxResult.innerHTML = StudySandbox.formatSqlIdleConsole(
        "빈칸에 SQL 조각을 모두 배치한 뒤 [실행]하세요."
      );
      return;
    }
    const runStartedAt = showTerminalRunning("sql");
    const result = await StudySandbox.runSql(sql, item.sandbox || "book", { mode: "single" });
    if (result.ok) {
      await revealTerminalOutput(StudySandbox.formatSqlConsole(result.html), {
        kind: "sql",
        runStartedAt,
        alreadyRunning: true,
      });
      state.lastRunOutput = result.text;
    } else {
      await revealTerminalOutput(formatSqlErrorConsole(result), {
        kind: "sql",
        runStartedAt,
        alreadyRunning: true,
      });
      state.lastRunOutput = `오류: ${result.error}`;
    }
    return;
  }

  const code = el.codeEditor.value;
  const cursor = el.codeEditor.selectionStart;
  const selectionEnd = el.codeEditor.selectionEnd;
  const selection =
    selectionEnd > cursor ? code.slice(cursor, selectionEnd) : "";

  const runKind = itemType === "python" ? "python" : "sql";
  const runStartedAt = showTerminalRunning(runKind);

  if (itemType === "python") {
    const ready = await ensurePythonReady(true);
    if (!ready) return;
    const result = await StudySandbox.runPython(code, { item });
    const consoleMeta = {};
    if (result.ok) {
      if (result.plotB64) {
        consoleMeta.plotB64 = result.plotB64;
        openPlotPreview(result.plotB64);
      }
      if (result.previews?.length) {
        consoleMeta.resultPreviewHtml = StudySandbox.formatDataFramePreviewsHtml(result.previews);
        updatePythonRunResultPanels(result.previews, item);
        markPythonWorkflowStep(2);
      }
      await revealTerminalOutput(
        StudySandbox.formatPythonConsole(result.stdout, result.stderr, consoleMeta),
        { kind: "python", runStartedAt, alreadyRunning: true }
      );
      state.lastRunOutput = result.text;
    } else {
      await revealTerminalOutput(
        StudySandbox.formatPythonConsole("", result.error || result.stderr, consoleMeta),
        { kind: "python", runStartedAt, alreadyRunning: true }
      );
      state.lastRunOutput = `오류: ${result.error}`;
    }
    return;
  }

  if (itemType === "sql") {
    const sqlRunMode =
      mode === "all" ? "all" : isSqlTypingItem(item) ? "through" : "single";
    const result = await StudySandbox.runSql(code, item.sandbox || "book", {
      mode: sqlRunMode,
      cursor,
      selection,
    });
    if (result.ok) {
      await revealTerminalOutput(StudySandbox.formatSqlConsole(result.html), {
        kind: "sql",
        runStartedAt,
        alreadyRunning: true,
      });
      state.lastRunOutput = result.text;
    } else {
      await revealTerminalOutput(formatSqlErrorConsole(result), {
        kind: "sql",
        runStartedAt,
        alreadyRunning: true,
      });
      state.lastRunOutput = `오류: ${result.error}`;
    }
  }
}

async function gradeAnswer() {
  const item = currentItem();
  if (!item) return;

  const itemType = resolveItemType(item);
  const attempts = getItemProgress(item.id).attempts + 1;
  let result;

  if (itemType === "choice") {
    ensureChoiceOptionsSynced(item);
    if (state.selectedChoice === null) {
      showFeedback({ level: "empty", message: "보기를 선택해 주세요." }, item);
      return;
    }
    if (el.choiceList?.dataset.itemId && el.choiceList.dataset.itemId !== item.id) {
      renderChoiceOptions(item);
      showFeedback(
        { level: "empty", message: "보기가 갱신되었습니다. 다시 선택한 뒤 채점해 주세요." },
        item
      );
      return;
    }
    const opt = item.options[state.selectedChoice];
    if (opt.isCorrect) {
      result = { level: "correct", message: "정답입니다!" };
      if (opt.rationale) result.message += ` ${opt.rationale}`;
      state.score.correct++;
      markItemMastered(item.id, attempts);
      lockChoiceOptions(item, state.selectedChoice);
    } else {
      const correctOpt = item.options.find((o) => o.isCorrect);
      result = {
        level: "wrong",
        message: `오답입니다. ${opt.rationale || ""} 복습 큐에 저장했어요 — 맞출 때까지 반복 숙달하세요.`,
        expected: correctOpt?.text,
      };
      addToReviewQueue(item.id, "wrong", attempts);
      highlightChoiceAttempt(item, state.selectedChoice);
    }
    state.score.attempted++;
    showFeedback(result, item);
    return;
  }

  if (itemType === "sql") {
    syncDndSqlToEditor();
    const sql = getPracticeSql();
    if (state.dndCtrl && !StudySqlDnd.isComplete()) {
      showFeedback(
        { level: "empty", message: "모든 빈칸에 SQL 조각을 배치한 뒤 채점해 주세요." },
        item
      );
      return;
    }
    result = await StudySandbox.gradeSql(sql, item);
    state.score.attempted++;
    if (result.level === "correct") {
      state.score.correct++;
      setItemProgress(item.id, { status: "done", attempts });
    } else {
      setItemProgress(item.id, { status: result.level === "partial" ? "review" : "wrong", attempts });
    }
    showFeedback(result, item);
    return;
  }

  if (itemType === "python") {
    const ready = await ensurePythonReady(true);
    if (!ready) return;
    if (getItemProgress(item.id).status === "done" && state.checkResult === "correct") {
      showFeedback({ level: "correct", message: "이미 정답으로 확인되었습니다." }, item);
      return;
    }
    const wasDone = getItemProgress(item.id).status === "done";
    result = await StudySandbox.gradePython(el.codeEditor.value, item);
    if (!wasDone) {
      state.score.attempted++;
      if (result.level === "correct") state.score.correct++;
    }
    const nextAttempts = getItemProgress(item.id).attempts + (wasDone ? 0 : 1);
    if (result.level === "correct") {
      setItemProgress(item.id, { status: "done", attempts: nextAttempts });
    } else {
      setItemProgress(item.id, {
        status: result.level === "partial" ? "review" : "wrong",
        attempts: nextAttempts,
      });
    }
    showFeedback(result, item);
    if (result.runResult?.previews?.length) {
      updatePythonRunResultPanels(result.runResult.previews, item);
      markPythonWorkflowStep(result.level === "correct" ? 3 : 2);
    }
    return;
  }

  showFeedback({ level: "empty", message: "지원하지 않는 문항 유형입니다." }, item);
}

function skipQuestion() {
  const item = currentItem();
  if (!item) return;
  addToReviewQueue(item.id, "skip");
  state.sessionStats.skip += 1;
  state.index++;
  if (state.index >= state.queue.length) {
    finishOrContinueReviewQueue();
  } else {
    renderQuestion();
  }
}

function markUnknown() {
  const item = currentItem();
  if (!item) return;
  addToReviewQueue(item.id, "unknown");
  state.sessionStats.unknown += 1;
  if (item.summary) showPanel(el.summaryPanel, item.summary, "요약");
  if (item.answers?.length) showPanel(el.answerPanel, item.answers.join(" / "), "정답");
  el.feedbackBox.hidden = false;
  el.feedbackBox.className = "feedback partial";
  el.feedbackBox.innerHTML =
    "<strong>복습 큐에 추가했습니다.</strong> 정답을 외울 때까지 「복습 큐만」 필터로 반복 풀어보세요.";
  el.nextBtn.hidden = false;
}

function finishOrContinueReviewQueue() {
  const reviewLeft = countReviewQueueItems();
  if (state.reviewOnly && reviewLeft > 0) {
    buildQueue();
    if (state.queue.length > 0) {
      state.index = 0;
      renderQuestion();
      return;
    }
  }
  showResults();
}

function prevQuestion() {
  if (state.index <= 0) return;
  state.index--;
  renderQuestion();
}

function nextQuestion() {
  state.index++;
  if (state.index >= state.queue.length) {
    finishOrContinueReviewQueue();
  } else {
    renderQuestion();
  }
}

function showResults() {
  el.studyCard.hidden = true;
  el.resultsCard.hidden = true;
  const summary = buildSessionSummary();
  showResultsInline(summary);
  showSessionCompleteDialog(summary);
}

async function loadDeck(deckId) {
  if (state.decks[deckId]) return state.decks[deckId];

  const embedded = getEmbeddedDeck(deckId);
  if (embedded) {
    state.decks[deckId] = embedded;
    return embedded;
  }

  const catalog = DECK_CATALOG.find((d) => d.id === deckId);
  if (!catalog) return null;

  try {
    const res = await fetch(catalog.file);
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    state.decks[deckId] = data;
    return data;
  } catch {
    return null;
  }
}

async function initDecks() {
  for (const deck of DECK_CATALOG) {
    await loadDeck(deck.id);
  }
  state.currentDeckId = DECK_CATALOG[0].id;

  if (el.deckSelect) {
    el.deckSelect.innerHTML = "";
    for (const deck of DECK_CATALOG) {
      const opt = document.createElement("option");
      opt.value = deck.id;
      const comp = getDeckComposition(deck.id);
      opt.textContent = `${deck.label} — 선택 ${comp.choice} · 실습 ${comp.practice}`;
      el.deckSelect.appendChild(opt);
    }
  }

  if (el.deckPanel) {
    el.deckPanel.hidden = false;
  }
}

function onDeckSwitched() {
  if (!isExamDeck() && isSplitQuizMode()) {
    state.quizMode = "all";
    if (el.quizModeSelect) el.quizModeSelect.value = "all";
  }
  if (!isExamDeck() && state.quizMode === "exam") {
    state.quizMode = "all";
    if (el.quizModeSelect) el.quizModeSelect.value = "all";
  }
  updateDeckQuizModeOptions();
  updateDeckHint();
  updateQuizModeUI();
  const view = document.querySelector(".nav-btn.active")?.dataset?.view;
  if (view === "study-choice" || view === "study-practice") {
    syncCategoryFromNav();
    return;
  }
  buildQueue();
  renderQuestion();
  updateStats();
}

function bindEvents() {
  el.deckSelect?.addEventListener("change", async () => {
    state.currentDeckId = el.deckSelect.value;
    state.sectionFilter = "";
    state.index = 0;
    await loadDeck(state.currentDeckId);
    onDeckSwitched();
  });

  el.quizModeSelect?.addEventListener("change", () => {
    state.quizMode = el.quizModeSelect.value;
    if (state.quizMode === "exam") state.quizMode = "all";
    state.index = 0;
    updateQuizModeUI();
    buildQueue();
    renderQuestion();
  });

  el.practicePartSelect?.addEventListener("change", () => {
    state.practicePartFilter = el.practicePartSelect.value || "all";
    state.index = 0;
    populateSectionFilter();
    updatePracticePartPanel();
    buildQueue();
    renderQuestion();
    updateStats();
  });

  el.sectionFilter?.addEventListener("change", () => {
    state.sectionFilter = el.sectionFilter.value;
    state.index = 0;
    buildQueue();
    renderQuestion();
  });

  el.reviewOnly?.addEventListener("change", () => {
    state.reviewOnly = el.reviewOnly.checked;
    state.index = 0;
    buildQueue();
    renderQuestion();
  });

  el.studyMode?.addEventListener("change", () => {
    state.studyMode = el.studyMode.checked;
    const item = currentItem();
    if (item && resolveItemType(item) === "sql") {
      renderEliceGuideSidePanels(item);
    }
  });

  el.hintBtn?.addEventListener("click", () => {
    const item = currentItem();
    if (!item) return;
    if (el.hintPanel.hidden) {
      renderHintPanel(item);
    } else {
      el.hintPanel.hidden = true;
    }
  });

  el.summaryBtn?.addEventListener("click", () => {
    const item = currentItem();
    if (!item) return;
    renderSummaryPanel(item);
  });

  el.answerBtn?.addEventListener("click", () => {
    const item = currentItem();
    if (!item) return;
    renderAnswerPanel(item);
  });

  el.explainBtn?.addEventListener("click", () => {
    el.explainDetails.open = !el.explainDetails.open;
  });

  el.runCodeBtn?.addEventListener("click", () => runSandboxCode("single"));
  if (el.runAllCodeBtn) {
    el.runAllCodeBtn.addEventListener("click", () => runSandboxCode("all"));
  }
  el.previewTableBtn?.addEventListener("click", previewSandboxTable);
  el.resetCodeBtn?.addEventListener("click", () => {
    const item = currentItem();
    if (!item) return;
    if (state.dndCtrl) {
      StudySqlDnd.reset();
      setTerminalIdleMessage();
      return;
    }
    const itemType = resolveItemType(item);
    if (itemType === "sql" && item.sandbox) {
      StudySandbox.resetSqlSession(item.sandbox);
    }
    applyPracticeEditorState(item, itemType, false);
    resetPracticeConsole(item, itemType, false);
  });

  el.sandboxResult?.addEventListener("click", (e) => {
    if (e.target.closest("[data-action=clear-terminal]")) {
      setTerminalIdleMessage();
    }
  });

  el.clearConsoleBtn?.addEventListener("click", clearSandboxConsole);

  el.pythonProbeBar?.addEventListener("click", (e) => {
    const btn = e.target.closest(".python-probe-btn");
    if (!btn || btn.hidden) return;
    const snippet = btn.getAttribute("data-probe");
    if (snippet) runPythonProbe(snippet);
  });

  el.sqlProbeButtons?.addEventListener("click", (e) => {
    const btn = e.target.closest(".sql-probe-btn");
    if (!btn) return;
    const sql = btn.getAttribute("data-sql");
    if (sql) runSqlProbe(sql);
  });

  el.sqlProbeAllBtn?.addEventListener("click", () => runSandboxCode("all"));

  el.submitBtn?.addEventListener("click", gradeAnswer);
  el.nextBtn?.addEventListener("click", nextQuestion);
  el.prevBtn?.addEventListener("click", prevQuestion);
  el.skipBtn?.addEventListener("click", skipQuestion);
  el.markUnknown?.addEventListener("click", markUnknown);

  el.answerInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !el.sandboxArea.hidden) {
      e.preventDefault();
      gradeAnswer();
    }
  });

  el.codeEditor?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runSandboxCode();
    }
  });

  bindEditorSelectionTracking();
  el.codeSelectionAskBtn?.addEventListener("click", () => {
    updateCodeSelectionUI();
    if (!state.editorSelection) return;
    window.StudyAIUI?.askSelectedCode?.();
  });

  el.resetProgress?.addEventListener("click", () => {
    if (!confirm("이 기기의 학습 기록을 모두 삭제할까요?")) return;
    state.progress = {};
    saveProgress();
    updateStats();
    buildQueue();
    renderQuestion();
  });

  el.reviewWrongBtn?.addEventListener("click", () => {
    el.reviewOnly.checked = true;
    state.reviewOnly = true;
    state.index = 0;
    buildQueue();
    renderQuestion();
  });

  el.restartBtn?.addEventListener("click", () => {
    el.reviewOnly.checked = false;
    state.reviewOnly = false;
    state.index = 0;
    buildQueue();
    renderQuestion();
  });

  el.sessionCompleteRestart?.addEventListener("click", () => {
    closeSessionCompleteDialog();
    el.reviewOnly.checked = false;
    state.reviewOnly = false;
    state.index = 0;
    buildQueue();
    renderQuestion();
  });

  el.sessionCompleteReview?.addEventListener("click", () => {
    closeSessionCompleteDialog();
    el.reviewOnly.checked = true;
    state.reviewOnly = true;
    state.index = 0;
    buildQueue();
    renderQuestion();
  });

  el.sessionCompleteDialog?.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeSessionCompleteDialog();
  });

  el.plotPreviewClose?.addEventListener("click", closePlotPreview);
  el.plotPreviewDialog?.addEventListener("cancel", (e) => {
    e.preventDefault();
    closePlotPreview();
  });
  el.plotPreviewDialog?.addEventListener("click", (e) => {
    if (e.target === el.plotPreviewDialog) closePlotPreview();
  });
}

function setPracticeEditorValue(code, options = {}) {
  const editor = el.codeEditor;
  if (!editor || el.sandboxArea?.hidden) return false;

  editor.value = String(code ?? "");
  state.codeEditorCtrl?.refresh?.();
  editor.focus();

  const marker =
    options.lang === "sql"
      ? "-- ── 아래에 주석 없이 따라 작성해 보세요 ──"
      : "# ── 아래에 주석 없이 따라 작성해 보세요 ──";
  const idx = editor.value.indexOf(marker);
  const pos = idx >= 0 ? idx + marker.length + 1 : editor.value.length;
  editor.setSelectionRange(pos, pos);
  editor.scrollTop = editor.scrollHeight;
  return true;
}

window.StudyApp = {
  setItemCategory: applyItemCategory,
  syncCategoryFromNav,
  refreshStudyView,
  setPracticeEditorValue,
  getContext() {
    const item = currentItem();
    const activeView =
      document.querySelector(".nav-btn.active")?.dataset?.view || "study-choice";
    const guide = item?.practiceGuide || {};
    return {
      activeView,
      item,
      itemType: item ? resolveItemType(item) : null,
      userAnswer:
        state.selectedChoice !== null && item?.options
          ? item.options[state.selectedChoice]?.text || ""
          : el.answerInput?.value || "",
      userCode: getPracticeSql() || el.codeEditor?.value || "",
      selectedCode: state.editorSelection || getEditorSelectionText().trim(),
      practiceGoal: guide.goal || item?.instructions || "",
      practiceSteps: guide.steps || [],
      lastRunOutput: state.lastRunOutput || "",
      lastFeedback: el.feedbackBox?.hidden ? "" : el.feedbackBox?.textContent?.slice(0, 500) || "",
    };
  },
};

async function bootstrap() {
  try {
    bindEvents();
    window.addEventListener("study-layout-resize", () => {
      state.codeEditorCtrl?.refresh?.();
    });
    if (el.codeEditor && el.codeEditorHighlight && typeof StudyCodeEditor !== "undefined") {
      state.codeEditorCtrl = StudyCodeEditor.attach(el.codeEditor, el.codeEditorHighlight, {
        ghost: true,
        completions: {},
      });
    }
    await loadEmbeddedScript();
    await initDecks();
    decksReady = true;
    updateDeckQuizModeOptions();
    updateDeckHint();
    populateSectionFilter();
    updatePracticePartPanel();
    syncCategoryFromNav();
    document.dispatchEvent(new CustomEvent("studyapp:ready"));
  } catch (err) {
    showInitError(err);
  }
}

bootstrap();
