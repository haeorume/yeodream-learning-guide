/**
 * SQL 구조 학습 — 3단계 레시피 · 키워드 사전 · 미니 연습
 */
(() => {
  const STEP_COLORS = {
    1: "#a855f7",
    2: "#2dd4bf",
    3: "#fbbf24",
    advanced: "#4ade80",
  };

  const el = {
    view: null,
    recipe: null,
    dict: null,
    filterBtns: null,
    search: null,
    practiceTitle: null,
    practiceEditor: null,
    practiceRun: null,
    practiceOut: null,
    practiceReset: null,
  };

  let filterType = "all";
  let searchQuery = "";
  let activePractice = null;
  let practiceEditorCtrl = null;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** 완성된 SQL 키워드만 단계별 색상 */
  function highlightSql(sql) {
    const step1 = [
      "SELECT", "AS", "DISTINCT", "COUNT", "SUM", "AVG", "MAX", "MIN",
      "UPPER", "LOWER", "CAST", "ROUND",
    ];
    const step2 = [
      "FROM", "WHERE", "JOIN", "INNER", "LEFT", "RIGHT", "ON", "USING",
      "NATURAL", "LIKE", "IN", "BETWEEN", "AND", "OR", "NOT", "IS", "NULL",
      "HAVING",
    ];
    const step3 = ["GROUP", "BY", "ORDER", "ASC", "DESC", "LIMIT", "OFFSET"];
    const advanced = [
      "OVER", "PARTITION", "RANK", "DENSE_RANK", "ROW_NUMBER", "LAG", "LEAD",
      "UNION", "ALL", "INTERSECT", "EXCEPT", "WITH", "CASE", "WHEN", "THEN",
      "ELSE", "END", "COALESCE",
    ];

    const map = {};
    step1.forEach((k) => { map[k] = "kw-step1"; });
    step2.forEach((k) => { map[k] = "kw-step2"; });
    step3.forEach((k) => { map[k] = "kw-step3"; });
    advanced.forEach((k) => { map[k] = "kw-advanced"; });

    const lines = sql.split("\n");
    return lines
      .map((line) => {
        const commentIdx = line.indexOf("--");
        let code = line;
        let comment = "";
        if (commentIdx >= 0) {
          code = line.slice(0, commentIdx);
          comment = line.slice(commentIdx);
        }

        let out = "";
        let i = 0;
        while (i < code.length) {
          const ch = code[i];
          if (ch === "'" || ch === '"') {
            const q = ch;
            let j = i + 1;
            while (j < code.length && code[j] !== q) j += 1;
            out += `<span class="sql-str">${escapeHtml(code.slice(i, j + 1))}</span>`;
            i = j + 1;
            continue;
          }
          if (/[A-Za-z_]/.test(ch)) {
            let j = i + 1;
            while (j < code.length && /[A-Za-z0-9_]/.test(code[j])) j += 1;
            const word = code.slice(i, j);
            const upper = word.toUpperCase();
            const cls = map[upper];
            if (cls) {
              out += `<span class="${cls}">${escapeHtml(word)}</span>`;
            } else {
              out += escapeHtml(word);
            }
            i = j;
            continue;
          }
          out += escapeHtml(ch);
          i += 1;
        }
        if (comment) {
          out += `<span class="sql-comment">${escapeHtml(comment)}</span>`;
        }
        return out;
      })
      .join("\n");
  }

  function renderStepTablePicks(stepNum) {
    const block = SQL_STRUCTURE.practiceDb?.stepTables?.[stepNum];
    if (!block) return "";
    const picksHtml = block.picks
      .map(
        (p) => `
        <li class="sql-step-pick">
          <code class="sql-step-pick-table">${escapeHtml(p.table)}</code>
          <span class="sql-step-pick-cols">${escapeHtml(p.cols)}</span>
          <button type="button" class="btn ghost-btn sql-step-pick-btn" data-sql="${escapeHtml(p.example)}">불러오기</button>
        </li>`
      )
      .join("");
    return `
      <div class="sql-step-tables">
        <p class="sql-step-tables-title">${escapeHtml(block.title)}</p>
        <p class="sql-step-tables-hint">${escapeHtml(block.hint)}</p>
        <ul class="sql-step-picks">${picksHtml}</ul>
      </div>`;
  }

  function renderRecipe() {
    const { recipe, practiceDb } = SQL_STRUCTURE;
    const tablesHtml = (practiceDb?.tables || [])
      .map(
        (t) => `
        <article class="sql-table-card">
          <h4><code>${escapeHtml(t.name)}</code>${(t.step || []).map((s) => `<span class="sql-table-step-badge">${s}단계</span>`).join("")}</h4>
          <p class="sql-table-use">${escapeHtml(t.use)}</p>
          <p class="sql-table-cols">${t.columns.map((c) => `<code>${escapeHtml(c)}</code>`).join(" · ")}</p>
          <button type="button" class="btn secondary-btn sql-table-try-btn" data-sql="SELECT * FROM ${escapeHtml(t.name)} LIMIT 5;">이 테이블 조회</button>
        </article>`
      )
      .join("");

    el.recipe.innerHTML = `
      <header class="sql-recipe-header">
        <h2>🧩 ${escapeHtml(recipe.title)}</h2>
        <p class="sql-recipe-intro">${escapeHtml(recipe.intro)}</p>
      </header>
      <div class="sql-recipe-steps">
        ${recipe.steps
          .map(
            (s) => `
          <article class="sql-step-card sql-step-${s.color}" data-step="${s.step}">
            <span class="sql-step-num" aria-hidden="true">${s.step}</span>
            <p class="sql-step-q">${escapeHtml(s.question)}</p>
            <p class="sql-step-focus">${escapeHtml(s.focus)}</p>
            <div class="sql-step-tags">
              ${s.tags.map((t) => `<span class="sql-tag">${escapeHtml(t)}</span>`).join("")}
            </div>
            <pre class="sql-step-sample"><code>${highlightSql(s.sample)}</code></pre>
            ${renderStepTablePicks(s.step)}
          </article>`
          )
          .join("")}
      </div>
      <section class="sql-assembly">
        <h3>조립 레시피 한눈에 보기 예시</h3>
        <p class="sql-assembly-table-hint">사용 테이블: <code>Employee</code> — 좌측 미니 연습에서 바로 실행해 보세요.</p>
        <pre class="sql-assembly-code"><code>${highlightSql(recipe.fullExample.sql)}</code></pre>
        <div class="sql-assembly-kr">
          <span class="sql-kr-badge">KR</span>
          <p>${escapeHtml(recipe.fullExample.translation)}</p>
        </div>
        <button type="button" class="btn primary-btn sql-recipe-run-btn" id="sql-recipe-run-btn">▶ 위 예제를 미니 연습에 불러오기</button>
      </section>
      <section class="sql-tables-ref">
        <h3>📦 연습용 예제 테이블 (통합 DB)</h3>
        <p class="sql-tables-hint">${escapeHtml(practiceDb?.hint || "")} <kbd>Tab</kbd>으로 희미한 추천 코드를 수락할 수 있습니다.</p>
        <div class="sql-tables-grid">${tablesHtml}</div>
      </section>
    `;

    document.getElementById("sql-recipe-run-btn")?.addEventListener("click", () => {
      if (el.practiceEditor) {
        el.practiceEditor.value = recipe.fullExample.sql.replace(/--.*$/gm, "").trim();
        practiceEditorCtrl?.refresh?.();
        el.practiceTitle.textContent = "레시피 예제 — Employee";
        document.getElementById("sql-sidebar-practice")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        el.practiceEditor.focus();
      }
    });

    el.recipe.querySelectorAll(".sql-table-try-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sql = btn.dataset.sql || "";
        if (!el.practiceEditor) return;
        el.practiceEditor.value = sql;
        practiceEditorCtrl?.refresh?.();
        el.practiceTitle.textContent = `연습 — ${sql.split("FROM")[1]?.trim().split(" ")[0] || "테이블"}`;
        document.getElementById("sql-sidebar-practice")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        el.practiceEditor.focus();
      });
    });

    el.recipe.querySelectorAll(".sql-step-pick-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sql = btn.dataset.sql || "";
        if (!el.practiceEditor || !sql) return;
        el.practiceEditor.value = sql;
        practiceEditorCtrl?.refresh?.();
        el.practiceTitle.textContent = `단계 연습 — ${sql.slice(0, 36)}${sql.length > 36 ? "…" : ""}`;
        document.getElementById("sql-sidebar-practice")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        el.practiceEditor.focus();
      });
    });
  }

  function matchesFilter(kw) {
    if (filterType === "keyword" && kw.type !== "keyword") return false;
    if (filterType === "function" && kw.type !== "function") return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const blob = [
      kw.title, kw.meaning, kw.analogy, kw.example, kw.warning,
    ].join(" ").toLowerCase();
    return blob.includes(q);
  }

  function renderKeywordCard(kw) {
    const stepKey = kw.step;
    const stepLabel = SQL_STRUCTURE.stepLabels[stepKey] || "심화";
    const stepClass = stepKey === "advanced" ? "step-advanced" : `step-${stepKey}`;

    return `
      <article class="sql-kw-card ${stepClass}" data-id="${kw.id}">
        <header class="sql-kw-head">
          <h4>${escapeHtml(kw.title)}</h4>
          <div class="sql-kw-badges">
            <span class="sql-kw-step">${escapeHtml(stepLabel.split("·")[0].trim())}</span>
            <span class="sql-kw-type">${kw.type === "function" ? "함수" : "키워드"}</span>
          </div>
        </header>
        <div class="sql-kw-section">
          <span class="sql-kw-label">■ 한줄뜻</span>
          <p>${escapeHtml(kw.meaning)}</p>
        </div>
        <div class="sql-kw-section">
          <span class="sql-kw-label">💡 비유/설명</span>
          <p>${escapeHtml(kw.analogy)}</p>
        </div>
        <div class="sql-kw-section">
          <span class="sql-kw-label">📍 예시</span>
          <pre class="sql-kw-example"><code>${highlightSql(kw.example)}</code></pre>
          ${kw.exampleNote ? `<p class="sql-kw-note">${escapeHtml(kw.exampleNote)}</p>` : ""}
        </div>
        ${
          kw.warning
            ? `<div class="sql-kw-warn">⚠️ 헷갈림 주의 — ${escapeHtml(kw.warning)}</div>`
            : ""
        }
        ${
          kw.practiceSql
            ? `<button type="button" class="btn secondary-btn sql-practice-btn" data-id="${kw.id}">▶ 이 예시로 연습</button>`
            : ""
        }
      </article>
    `;
  }

  function renderDictionary() {
    const groups = [1, 2, 3, "advanced"];
    const filtered = SQL_STRUCTURE.keywords.filter(matchesFilter);

    if (!filtered.length) {
      el.dict.innerHTML = `<p class="sql-dict-empty">검색 결과가 없습니다.</p>`;
      return;
    }

    el.dict.innerHTML = groups
      .map((g) => {
        const items = filtered.filter((k) => k.step === g);
        if (!items.length) return "";
        const label = SQL_STRUCTURE.stepLabels[g];
        return `
          <section class="sql-dict-group" data-group="${g}">
            <h3 class="sql-dict-group-title sql-group-${g === "advanced" ? "advanced" : `step${g}`}">
              ${escapeHtml(label)} <small>(${items.length}개)</small>
            </h3>
            <div class="sql-kw-grid">
              ${items.map(renderKeywordCard).join("")}
            </div>
          </section>
        `;
      })
      .join("");

    el.dict.querySelectorAll(".sql-practice-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const kw = SQL_STRUCTURE.keywords.find((k) => k.id === id);
        if (kw) openPractice(kw);
      });
    });
  }

  function openPractice(kw) {
    activePractice = kw;
    el.practiceTitle.textContent = `${kw.title} — 연습`;
    const code = kw.practiceSql || kw.example;
    if (el.practiceEditor) {
      el.practiceEditor.value = code;
      practiceEditorCtrl?.refresh?.();
    }
    el.practiceOut.innerHTML = "";
    document.getElementById("sql-sidebar-practice")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    el.practiceEditor?.focus();
  }

  async function runPractice() {
    const code = el.practiceEditor?.value ?? "";
    const cursor = el.practiceEditor?.selectionStart ?? code.length;
    const end = el.practiceEditor?.selectionEnd ?? cursor;
    const selection = end > cursor ? code.slice(cursor, end) : "";
    el.practiceOut.innerHTML = `<p class="sql-run-status">sql.js 실행 중…</p>`;
    try {
      const sandboxKey = activePractice?.sandbox || SQL_STRUCTURE.practiceDb?.sandbox || "sql_structure";
      const result = await StudySandbox.runSql(code, sandboxKey, {
        cursor,
        selection,
        mode: "single",
      });
      if (!result.ok) {
        el.practiceOut.innerHTML = `<pre class="sql-run-error">${escapeHtml(result.error || "실행 오류")}</pre>`;
        return;
      }
      el.practiceOut.innerHTML = result.html || `<p class="sql-run-ok">${escapeHtml(result.text || "실행 완료")}</p>`;
    } catch (e) {
      el.practiceOut.innerHTML = `<pre class="sql-run-error">${escapeHtml(e.message || String(e))}</pre>`;
    }
  }

  function bindEvents() {
    el.filterBtns?.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterType = btn.dataset.filter || "all";
        el.filterBtns.forEach((b) => b.classList.toggle("active", b === btn));
        renderDictionary();
      });
    });

    el.search?.addEventListener("input", () => {
      searchQuery = el.search.value.trim();
      renderDictionary();
    });

    el.practiceRun?.addEventListener("click", runPractice);
    el.practiceReset?.addEventListener("click", () => {
      if (activePractice) openPractice(activePractice);
    });
  }

  function init() {
    el.view = document.getElementById("sql-structure-view");
    if (!el.view) return;

    el.recipe = document.getElementById("sql-recipe-root");
    el.dict = document.getElementById("sql-dict-root");
    el.filterBtns = el.view.querySelectorAll(".sql-filter-btn");
    el.search = document.getElementById("sql-dict-search");
    el.practiceTitle = document.getElementById("sql-practice-title");
    el.practiceEditor = document.getElementById("sql-practice-editor");
    el.practiceRun = document.getElementById("sql-practice-run");
    el.practiceOut = document.getElementById("sql-practice-output");
    el.practiceReset = document.getElementById("sql-practice-reset");

    renderRecipe();
    renderDictionary();
    bindEvents();

    StudySandbox?.initSql?.().catch(() => {});

    if (el.practiceEditor && window.StudyCodeEditor?.attach) {
      const highlight = document.getElementById("sql-practice-highlight");
      const meta = window.StudySandbox?.getCompletionsForSchema?.("sql_structure");
      if (highlight) {
        practiceEditorCtrl = StudyCodeEditor.attach(el.practiceEditor, highlight, {
          readableFallback: true,
          ghost: true,
          completions: meta || {},
        });
        el.practiceEditor.value = SQL_STRUCTURE.practiceDb?.defaultSql || "SELECT * FROM book LIMIT 5;";
        practiceEditorCtrl.refresh();
      }
    }
  }

  window.SqlStructure = { init, openPractice, renderDictionary };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
