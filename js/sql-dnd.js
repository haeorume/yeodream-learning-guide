/**
 * SQL 드래그앤드롭 실습 — 단어 보관함 · 빈칸 조립 · 격자 미리보기
 */
(() => {
  const MULTI_KEYWORDS = [
    "UNION ALL",
    "INNER JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
    "CROSS JOIN",
    "GROUP BY",
    "ORDER BY",
    "INSERT INTO",
    "DELETE FROM",
    "PARTITION BY",
    "WITH ROLLUP",
  ];

  const STEP1 = new Set(["SELECT", "DISTINCT", "AS", "COUNT(*)", "UNION", "UNION ALL", "INTERSECT", "EXCEPT", "INSERT INTO", "UPDATE", "DELETE FROM"]);
  const STEP2 = new Set([
    "FROM",
    "WHERE",
    "JOIN",
    "INNER JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
    "CROSS JOIN",
    "ON",
    "GROUP BY",
    "HAVING",
    "INTERSECT",
    "EXCEPT",
    "SET",
    "VALUES",
  ]);
  const STEP3 = new Set(["ORDER BY", "ASC", "DESC", "LIMIT"]);

  const DISTRACTORS = [
    { text: "HAVING", step: 2 },
    { text: "LEFT JOIN", step: 2 },
    { text: "WHERE", step: 2 },
    { text: "ASC", step: 3 },
    { text: "LIMIT", step: 3 },
    { text: "DISTINCT", step: 1 },
    { text: "CROSS JOIN", step: 2 },
  ];

  let rootEl = null;
  let bankEl = null;
  let gridEl = null;
  let config = null;
  let slots = {};
  let tokens = {};
  let bankOrder = [];
  let dragTokenId = null;
  let onChange = null;

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function classifyStep(text) {
    const upper = text.toUpperCase().trim();
    for (const kw of MULTI_KEYWORDS) {
      if (upper === kw || upper.startsWith(kw)) {
        if (STEP1.has(kw) || kw === "UNION ALL" || kw === "INTERSECT" || kw === "EXCEPT") return 1;
        if (STEP2.has(kw)) return 2;
        if (STEP3.has(kw)) return 3;
      }
    }
    if (STEP1.has(upper) || /^(COUNT|SUM|AVG|MAX|MIN)\s*\(/i.test(text)) return 1;
    if (STEP2.has(upper)) return 2;
    if (STEP3.has(upper)) return 3;
    return 0;
  }

  function normalizeForMatch(s) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function extractGivenSql(starterSql) {
    if (!starterSql) return "";
    const lines = starterSql.split("\n");
    const markerIdx = lines.findIndex((l) => /--\s*↑/.test(l));
    const slice = markerIdx >= 0 ? lines.slice(0, markerIdx) : lines;
    return slice
      .filter((l) => {
        const t = l.trim();
        if (!t || t.startsWith("--")) return false;
        if (/^PRAGMA\s+table_info/i.test(t)) return false;
        if (/^SELECT\s+\*\s+FROM/i.test(t)) return false;
        return true;
      })
      .join("\n");
  }

  function mergeMultiKeywords(line) {
    let s = line.trim();
    for (const kw of MULTI_KEYWORDS) {
      const re = new RegExp(kw.replace(/ /g, "\\s+"), "gi");
      s = s.replace(re, kw);
    }
    return s;
  }

  function tokenizeLine(line) {
    const merged = mergeMultiKeywords(line);
    const parts = [];
    const re =
      /('[^']*'|\([^)]*\)|>=|<=|<>|!=|GROUP BY|ORDER BY|INNER JOIN|LEFT JOIN|RIGHT JOIN|CROSS JOIN|UNION ALL|UNION|INTERSECT|EXCEPT|COUNT\s*\(\s*\*\s*\)|COUNT\s*\([^)]+\)|SUM\s*\([^)]+\)|AVG\s*\([^)]+\)|MAX\s*\([^)]+\)|MIN\s*\([^)]+\)|[A-Za-z_][A-Za-z0-9_.]*|\d+(?:\.\d+)?|,|;|\*|=|>|<|\(|\)|\S)/gi;
    let m;
    while ((m = re.exec(merged)) !== null) {
      const t = m[0].trim();
      if (t) parts.push(t);
    }
    return parts;
  }

  function tokenizeSqlToLines(sql) {
    return (sql || "")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("--"))
      .map((l) => tokenizeLine(l));
  }

  function patternsFromItem(item) {
    const p = item.validate?.patterns || [];
    const fromGuide = (item.practiceGuide?.steps || []).join(" ").toLowerCase();
    return [...p, ...fromGuide.split(/\s+/).filter((w) => w.length > 2)];
  }

  function tokenInGiven(token, givenNorm) {
    const t = normalizeForMatch(token);
    if (!t) return true;
    return givenNorm.includes(t);
  }

  function shouldBlankToken(token, givenNorm, patterns) {
    if (token === "," || token === "(" || token === ")") return false;
    if (tokenInGiven(token, givenNorm)) {
      const lower = token.toLowerCase();
      const isPattern = patterns.some((p) => lower.includes(p) || p.includes(lower));
      if (!isPattern) return false;
    }
    if (classifyStep(token) > 0) return true;
    if (!tokenInGiven(token, givenNorm)) return true;
    return false;
  }

  function buildPracticeDnD(item) {
    if (item.practiceDnD?.lines?.length) {
      return { ...item.practiceDnD, referenceSql: item.referenceSql || item.practiceDnD.referenceSql };
    }

    const difficulty = item.dndDifficulty || "medium";
    const ref = item.referenceSql || "";
    const refLines = tokenizeSqlToLines(ref);
    const allTokens = [];

    refLines.forEach((lineTokens) => {
      lineTokens.forEach((text) => {
        allTokens.push({ text, step: classifyStep(text), blankable: text !== "," && text !== "(" && text !== ")" && text !== ";" });
      });
    });

    const NON_BLANK = new Set([",", "(", ")", ";", "=", ">", "<", ">=", "<=", "<>", "!=", "*", "."]);
    const blankables = allTokens.filter(
      (t) => t.blankable && !NON_BLANK.has(t.text) && (classifyStep(t.text) > 0 || t.text.length > 1)
    );

    let blankSet;
    if (difficulty === "easy") {
      const keywords = blankables.filter((t) => classifyStep(t.text) > 0);
      const pick = Math.max(1, Math.min(2, keywords.length));
      blankSet = new Set(shuffleArray(keywords).slice(0, pick).map((t) => t.text));
    } else if (difficulty === "hard") {
      blankSet = new Set(blankables.map((t) => t.text));
    } else {
      const half = Math.max(2, Math.ceil(blankables.length * 0.5));
      blankSet = new Set(shuffleArray([...blankables]).slice(0, half).map((t) => t.text));
      blankables.filter((t) => classifyStep(t.text) > 0).forEach((t) => blankSet.add(t.text));
    }

    const lines = [];
    const bank = [];
    let slotIdx = 0;
    let tokIdx = 0;

    refLines.forEach((lineTokens) => {
      const row = [];
      lineTokens.forEach((text) => {
        if (blankSet.has(text) && !NON_BLANK.has(text)) {
          const id = `s${slotIdx++}`;
          const tid = `t${tokIdx++}`;
          row.push({ type: "slot", id, accept: [text], step: classifyStep(text) });
          bank.push({ id: tid, text, step: classifyStep(text), slotId: id });
        } else {
          row.push({ type: "fixed", text, step: classifyStep(text) });
        }
      });
      if (row.length) lines.push(row);
    });

    if (!bank.length) {
      slotIdx = 0;
      tokIdx = 0;
      lines.length = 0;
      refLines.forEach((lineTokens) => {
        const row = [];
        lineTokens.forEach((text) => {
          const step = classifyStep(text);
          if (step > 0 && text.length > 1) {
            const id = `s${slotIdx++}`;
            const tid = `t${tokIdx++}`;
            row.push({ type: "slot", id, accept: [text], step });
            bank.push({ id: tid, text, step, slotId: id });
          } else {
            row.push({ type: "fixed", text, step });
          }
        });
        if (row.length) lines.push(row);
      });
    }

    const maxDistractors = difficulty === "easy" ? 3 : difficulty === "hard" ? 7 : 5;
    const acceptSet = new Set(bank.map((b) => normalizeForMatch(b.text)));
    let dCount = 0;
    DISTRACTORS.forEach((d) => {
      const n = normalizeForMatch(d.text);
      if (!acceptSet.has(n) && dCount < maxDistractors) {
        const tid = `d${tokIdx++}`;
        bank.push({ id: tid, text: d.text, step: d.step, distractor: true });
        acceptSet.add(n);
        dCount++;
      }
    });

    return { lines, bank, referenceSql: ref, difficulty };
  }

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function stepClass(step) {
    if (step === 1) return "dnd-step-1";
    if (step === 2) return "dnd-step-2";
    if (step === 3) return "dnd-step-3";
    return "dnd-step-0";
  }

  function renderCell(cell, filledToken) {
    if (cell.type === "fixed") {
      return `<span class="dnd-cell dnd-cell--fixed ${stepClass(cell.step)}">${escapeHtml(cell.text)}</span>`;
    }
    const filled = filledToken
      ? `<span class="dnd-token dnd-token--placed ${stepClass(filledToken.step)}" draggable="true" data-token-id="${filledToken.id}">${escapeHtml(filledToken.text)}</span>`
      : `<span class="dnd-slot-empty">${cell.label || "□"}</span>`;
    return `<span class="dnd-cell dnd-cell--slot" data-slot-id="${cell.id}">${filled}</span>`;
  }

  function renderGridLines(lines, slotMap) {
    return lines
      .map(
        (row) =>
          `<div class="dnd-grid-row">${row
            .map((cell) => {
              if (cell.type === "slot") {
                const tid = slotMap[cell.id];
                const tok = tid ? tokens[tid] : null;
                return renderCell(cell, tok);
              }
              return renderCell(cell, null);
            })
            .join("")}</div>`
      )
      .join("");
  }

  function renderBank() {
    if (!bankEl) return;
    const inBank = bankOrder.filter((id) => !Object.values(slots).includes(id));
    bankEl.innerHTML = inBank.length
      ? inBank
          .map((id) => {
            const t = tokens[id];
            return `<button type="button" class="dnd-token dnd-token--bank ${stepClass(t.step)}" draggable="true" data-token-id="${id}"><span class="dnd-grip" aria-hidden="true">⠿</span>${escapeHtml(t.text)}</button>`;
          })
          .join("")
      : '<p class="dnd-bank-empty">모든 조각을 배치했습니다.</p>';
  }

  function renderGrid() {
    if (!gridEl || !config) return;
    gridEl.innerHTML = renderGridLines(config.lines, slots);
  }

  function renderAll() {
    renderBank();
    renderGrid();
    onChange?.(getAssembledSql());
  }

  function acceptTokenForSlot(slotId, tokenId) {
    const cell = config.lines.flat().find((c) => c.type === "slot" && c.id === slotId);
    if (!cell) return false;
    const tok = tokens[tokenId];
    if (!tok) return false;
    if (tok.distractor) return false;
    const accept = (cell.accept || []).map(normalizeForMatch);
    const text = normalizeForMatch(tok.text);
    return accept.includes(text);
  }

  function placeToken(slotId, tokenId) {
    Object.keys(slots).forEach((sid) => {
      if (slots[sid] === tokenId) slots[sid] = null;
    });
    slots[slotId] = tokenId;
    renderAll();
  }

  function removeTokenFromSlot(tokenId) {
    Object.keys(slots).forEach((sid) => {
      if (slots[sid] === tokenId) slots[sid] = null;
    });
    renderAll();
  }

  function bindDnDEvents() {
    if (!rootEl || rootEl.dataset.dndBound) return;
    rootEl.dataset.dndBound = "1";

    rootEl.addEventListener("dragstart", (e) => {
      const el = e.target.closest("[draggable=true][data-token-id]");
      if (!el) return;
      dragTokenId = el.dataset.tokenId;
      e.dataTransfer.setData("text/plain", dragTokenId);
      e.dataTransfer.effectAllowed = "move";
      el.classList.add("dnd-dragging");
    });

    rootEl.addEventListener("dragend", (e) => {
      e.target.closest("[draggable=true]")?.classList.remove("dnd-dragging");
      dragTokenId = null;
    });

    rootEl.addEventListener("dragover", (e) => {
      if (e.target.closest(".dnd-cell--slot") || e.target.closest("#dnd-bank")) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        e.target.closest(".dnd-cell--slot")?.classList.add("dnd-slot-hover");
        if (e.target.closest("#dnd-bank")) bankEl?.classList.add("dnd-bank-hover");
      }
    });

    rootEl.addEventListener("dragleave", (e) => {
      const slot = e.target.closest(".dnd-cell--slot");
      if (slot && !slot.contains(e.relatedTarget)) slot.classList.remove("dnd-slot-hover");
      if (bankEl && !bankEl.contains(e.relatedTarget)) bankEl.classList.remove("dnd-bank-hover");
    });

    rootEl.addEventListener("drop", (e) => {
      const slot = e.target.closest(".dnd-cell--slot");
      const bank = e.target.closest("#dnd-bank");
      const tokenId = e.dataTransfer.getData("text/plain") || dragTokenId;
      if (slot) {
        e.preventDefault();
        slot.classList.remove("dnd-slot-hover");
        const slotId = slot.dataset.slotId;
        if (tokenId && slotId && acceptTokenForSlot(slotId, tokenId)) placeToken(slotId, tokenId);
      } else if (bank && tokenId) {
        e.preventDefault();
        bankEl?.classList.remove("dnd-bank-hover");
        removeTokenFromSlot(tokenId);
      }
    });
  }

  function getAssembledSql() {
    if (!config?.lines) return "";
    const lineStrs = config.lines.map((row) =>
      row
        .map((cell) => {
          if (cell.type === "fixed") return cell.text;
          const tid = slots[cell.id];
          return tid ? tokens[tid]?.text || "" : "";
        })
        .join(" ")
        .replace(/\s+,/g, ",")
        .replace(/\s+;/g, ";")
        .replace(/\s+/g, " ")
        .trim()
    );
    let sql = lineStrs.join("\n");
    if (sql && !sql.trim().endsWith(";")) sql += ";";
    return sql;
  }

  function renderGridHtmlFromLines(lines, filledMap, options = {}) {
    const preview = options.preview ? " sql-dnd-grid--preview" : "";
    const rows = lines
      .map(
        (row) =>
          `<div class="dnd-grid-row">${row
            .map((cell) => {
              if (cell.type === "fixed") {
                return `<span class="dnd-cell dnd-cell--fixed ${stepClass(cell.step)}">${escapeHtml(cell.text)}</span>`;
              }
              const text = filledMap[cell.id] ?? cell.accept?.[0] ?? "";
              return `<span class="dnd-cell dnd-cell--filled ${stepClass(classifyStep(text))}">${escapeHtml(text)}</span>`;
            })
            .join("")}</div>`
      )
      .join("");
    return `<div class="sql-dnd-grid${preview}">${rows}</div>`;
  }

  function renderAnswerPreview(item) {
    const cfg = buildPracticeDnD(item);
    const filled = {};
    cfg.lines
      .flat()
      .filter((c) => c.type === "slot")
      .forEach((c) => {
        filled[c.id] = c.accept?.[0] || "";
      });
    const ref = item.referenceSql || cfg.referenceSql || "";
    return (
      `<p class="answer-dnd-lead"><strong>조립 완성 미리보기</strong></p>` +
      `<div class="dnd-legend"><span class="dnd-legend-item dnd-step-1">1단계</span>` +
      `<span class="dnd-legend-item dnd-step-2">2단계</span>` +
      `<span class="dnd-legend-item dnd-step-3">3단계</span></div>` +
      renderGridHtmlFromLines(cfg.lines, filled, { preview: true }) +
      `<p class="answer-dnd-sql-label">실행용 SQL</p>` +
      `<pre class="answer-dnd-sql">${escapeHtml(ref)}</pre>`
    );
  }

  function formatCliTable(columns, rows) {
    if (!columns || !columns.length) return "<pre class='sql-cli-table'>(결과 없음)</pre>";
    const data = [columns, ...rows.map((r) => r.map((c) => String(c ?? "NULL")))];
    const widths = columns.map((_, ci) =>
      Math.max(...data.map((r) => (r[ci] ?? "").length))
    );
    const pad = (s, w) => s + " ".repeat(Math.max(0, w - s.length));
    const sep = "+" + widths.map((w) => "-".repeat(w + 2)).join("+") + "+";
    const fmtRow = (r) => "| " + r.map((c, i) => pad(c, widths[i])).join(" | ") + " |";
    const lines = [sep, fmtRow(columns), sep];
    rows.forEach((r) => lines.push(fmtRow(r.map((c) => String(c ?? "NULL")))));
    lines.push(sep);
    return `<pre class="sql-cli-table">${escapeHtml(lines.join("\n"))}</pre>`;
  }

  function formatTerminalHtml(query, innerHtml, meta = "") {
    const q = escapeHtml(query || "").trim();
    const queryLine = q
      ? `<div class="sql-terminal-line"><span class="sql-terminal-prompt">sqlite&gt;</span> <span class="sql-terminal-query">${q}</span></div>`
      : "";
    return (
      `<div class="sql-terminal-window">` +
      `<div class="sql-terminal-chrome"><span></span><span></span><span></span>` +
      `<span class="sql-terminal-title">sqlite</span></div>` +
      `<div class="sql-terminal-body">` +
      queryLine +
      (innerHtml || "") +
      (meta ? `<div class="sql-terminal-meta">${escapeHtml(meta)}</div>` : "") +
      `<div class="sql-terminal-line"><span class="sql-terminal-prompt">sqlite&gt;</span> <span class="sql-terminal-cursor">█</span></div>` +
      `</div></div>`
    );
  }

  function init(container, item, callbacks = {}) {
    destroy();
    rootEl = container;
    bankEl = container.querySelector("#dnd-bank");
    gridEl = container.querySelector("#dnd-grid");
    onChange = callbacks.onChange || null;

    config = buildPracticeDnD(item);
    slots = {};
    tokens = {};
    bankOrder = [];

    config.lines
      .flat()
      .filter((c) => c.type === "slot")
      .forEach((c) => {
        slots[c.id] = null;
      });

    config.bank.forEach((b) => {
      tokens[b.id] = { ...b };
      bankOrder.push(b.id);
    });
    bankOrder = shuffleArray(bankOrder);

    const circled = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];
    let slotNum = 1;
    config.lines.forEach((row) => {
      row.forEach((cell) => {
        if (cell.type === "slot" && !cell.label) {
          cell.label = circled[slotNum - 1] || String(slotNum);
          slotNum += 1;
        }
      });
    });

    renderAll();
    bindDnDEvents();

    const reshuffleBtn = container.querySelector("#dnd-reshuffle");
    if (reshuffleBtn) {
      reshuffleBtn.onclick = () => {
        bankOrder = shuffleArray(Object.keys(tokens));
        renderBank();
      };
    }

    return { getSql: getAssembledSql, reset };
  }

  function reset() {
    Object.keys(slots).forEach((k) => {
      slots[k] = null;
    });
    bankOrder = shuffleArray(Object.keys(tokens));
    renderAll();
  }

  function destroy() {
    if (rootEl) delete rootEl.dataset.dndBound;
    rootEl = null;
    bankEl = null;
    gridEl = null;
    config = null;
    slots = {};
    tokens = {};
    bankOrder = [];
    dragTokenId = null;
    onChange = null;
  }

  function isComplete() {
    return Object.keys(slots).length > 0 && Object.values(slots).every((v) => v != null);
  }

  window.StudySqlDnd = {
    init,
    reset,
    destroy,
    getAssembledSql,
    buildPracticeDnD,
    renderAnswerPreview,
    formatTerminalHtml,
    formatCliTable,
    isComplete,
  };
})();
