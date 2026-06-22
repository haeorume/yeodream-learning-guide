/**
 * 실습 에디터 — 구문 강조 · VS Code 스타일 들여쓰기 · 고스트 자동완성
 */
const StudyCodeEditor = (() => {
  const TAB = "  ";
  const SQL_INDENT_AFTER = /^(SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|CROSS|FULL|GROUP|ORDER|HAVING|UNION|INTERSECT|EXCEPT|WITH|CASE|WHEN|ON)\b/i;
  const SQL_INDENT_CONT = /(SELECT|JOIN|ON|WHERE|AND|OR|SET|VALUES|CASE|WHEN)\s*$/i;

  const SQL_KEYWORDS = new Set([
    "select", "from", "where", "and", "or", "not", "in", "is", "null", "like", "between",
    "join", "inner", "left", "right", "cross", "full", "outer", "on", "as", "distinct",
    "order", "by", "asc", "desc", "group", "having", "limit", "offset", "union", "all",
    "intersect", "except", "insert", "into", "values", "update", "set", "delete", "create",
    "drop", "alter", "table", "index", "view", "with", "case", "when", "then", "else", "end",
    "exists", "pragma", "over", "partition", "rows", "row", "unbounded", "preceding", "following",
    "current", "rollup", "cube", "natural", "using",
  ]);

  const SQL_FUNCTIONS = new Set([
    "count", "sum", "avg", "max", "min", "round", "abs", "coalesce", "ifnull", "length",
    "upper", "lower", "substr", "trim", "rank", "dense_rank", "row_number", "percent_rank",
    "cume_dist", "ntile", "lag", "lead", "first_value", "last_value", "cast",
  ]);

  const PY_KEYWORDS = new Set([
    "def", "class", "return", "if", "elif", "else", "for", "while", "break", "continue",
    "pass", "import", "from", "as", "try", "except", "finally", "raise", "with", "lambda",
    "yield", "global", "nonlocal", "assert", "del", "in", "is", "not", "and", "or",
    "true", "false", "none",
  ]);

  const PY_BUILTINS = new Set([
    "print", "range", "len", "int", "float", "str", "list", "dict", "set", "tuple", "bool",
    "input", "open", "type", "enumerate", "zip", "map", "filter", "sorted", "sum", "min", "max",
  ]);

  const PY_PANDAS_METHODS = [
    "read_csv", "head", "tail", "describe", "info", "columns", "dtypes", "shape",
    "groupby", "loc", "iloc", "max", "min", "mean", "sum", "count", "fillna", "map",
    "concat", "merge", "to_numeric", "value_counts", "sort_values", "dropna", "astype",
    "str.replace", "isna", "notna", "apply", "agg", "reset_index",
  ];

  const PY_SNIPPETS = [
    { label: "groupby → max", insert: "groupby(['요일', '공휴일'])['어른'].max()", detail: "요일·공휴일별 어른 최댓값" },
    { label: "groupby → loc", insert: "groupby(['요일', '공휴일'])['어른'].max().loc[('목', 'O')]", detail: "목+공휴일(O) 값 추출" },
    { label: "loc 필터", insert: "loc[df['요일'] == '목', '유료합계'].max()", detail: "조건 필터 후 max" },
    { label: "read_csv", insert: "pd.read_csv('/data/seoul_park03.csv')", detail: "CSV 읽기" },
    { label: "to_numeric", insert: "pd.to_numeric(df['외국인'].str.replace(',', '', regex=False))", detail: "쉼표 제거 후 숫자 변환" },
    { label: "fillna(0)", insert: "df['단체'].fillna(0)", detail: "결측치 0으로" },
    { label: "concat", insert: "pd.concat([df, april], ignore_index=True)", detail: "세로 병합" },
    { label: "mm.max()", insert: "mm['미세먼지'].max()", detail: "미세먼지 최댓값" },
  ];

  const BRACKET_OPEN = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'" };
  const BRACKET_CLOSE = new Set([")", "]", "}", '"', "'"]);

  const TYPOGRAPHY_PROPS = [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "fontVariantLigatures",
    "fontFeatureSettings",
    "letterSpacing",
    "lineHeight",
    "tabSize",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "boxSizing",
    "textIndent",
    "textTransform",
    "wordSpacing",
  ];

  const SQL_KEYWORD_LIST = [...SQL_KEYWORDS].sort((a, b) => b.length - a.length);
  const SQL_FUNCTION_LIST = [...SQL_FUNCTIONS].sort((a, b) => b.length - a.length);

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function isPrefixOfSet(word, set) {
    if (!word) return false;
    for (const item of set) {
      if (item.startsWith(word) && item !== word) return true;
    }
    return false;
  }

  function flushPlain(buffer) {
    if (!buffer) return "";
    return `<span class="tok-plain">${escapeHtml(buffer)}</span>`;
  }

  function spanToken(cls, text) {
    return `<span class="${cls}">${escapeHtml(text)}</span>`;
  }

  function classifyWord(word, keywords, functions) {
    const lower = word.toLowerCase();
    if (keywords.has(lower)) return spanToken("tok-keyword", word);
    if (functions.has(lower)) return spanToken("tok-function", word);
    if (isPrefixOfSet(lower, keywords) || isPrefixOfSet(lower, functions)) {
      return spanToken("tok-partial", word);
    }
    return null;
  }

  function highlightCode(code, mode) {
    const keywords = mode === "python" ? PY_KEYWORDS : SQL_KEYWORDS;
    const functions = mode === "python" ? PY_BUILTINS : SQL_FUNCTIONS;
    let html = "";
    let plainBuf = "";
    let i = 0;

    function flush() {
      if (!plainBuf) return;
      html += flushPlain(plainBuf);
      plainBuf = "";
    }

    while (i < code.length) {
      const ch = code[i];
      const next = code[i + 1];

      if (mode === "sql" && ch === "-" && next === "-") {
        flush();
        let j = i;
        while (j < code.length && code[j] !== "\n") j++;
        html += spanToken("tok-comment", code.slice(i, j));
        i = j;
        continue;
      }

      if (mode === "python" && ch === "#") {
        flush();
        let j = i;
        while (j < code.length && code[j] !== "\n") j++;
        html += spanToken("tok-comment", code.slice(i, j));
        i = j;
        continue;
      }

      if (ch === "'" || ch === '"') {
        flush();
        let j = i + 1;
        while (j < code.length) {
          if (code[j] === ch && code[j - 1] !== "\\") {
            j++;
            break;
          }
          j++;
        }
        html += spanToken("tok-string", code.slice(i, j));
        i = j;
        continue;
      }

      if (/[0-9]/.test(ch)) {
        flush();
        let j = i;
        while (j < code.length && /[0-9.]/.test(code[j])) j++;
        html += spanToken("tok-number", code.slice(i, j));
        i = j;
        continue;
      }

      if (/[a-zA-Z_]/.test(ch)) {
        let j = i;
        while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
        const word = code.slice(i, j);
        const token = classifyWord(word, keywords, functions);
        if (token) {
          flush();
          html += token;
        } else {
          plainBuf += word;
        }
        i = j;
        continue;
      }

      if (ch === "*") {
        flush();
        html += spanToken("tok-operator", ch);
        i++;
        continue;
      }

      plainBuf += ch;
      i++;
    }

    flush();
    return html;
  }

  function getLineInfo(text, pos) {
    const before = text.slice(0, pos);
    const lineStart = before.lastIndexOf("\n") + 1;
    const lineEnd = text.indexOf("\n", pos);
    return {
      lineStart,
      lineEnd: lineEnd === -1 ? text.length : lineEnd,
      line: text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd),
      col: pos - lineStart,
    };
  }

  function lineIndent(line) {
    const m = line.match(/^(\s*)/);
    return m ? m[1] : "";
  }

  function insertText(textarea, text, start, end) {
    const s = start ?? textarea.selectionStart;
    const e = end ?? textarea.selectionEnd;
    textarea.value = textarea.value.slice(0, s) + text + textarea.value.slice(e);
    const pos = s + text.length;
    textarea.selectionStart = textarea.selectionEnd = pos;
    return pos;
  }

  function completeWord(prefix, candidates, caseStyle = "upper") {
    const p = prefix.toLowerCase();
    for (const c of candidates) {
      const raw = String(c);
      const cl = raw.toLowerCase();
      if (cl.startsWith(p) && cl !== p) {
        if (caseStyle === "upper") return raw.toUpperCase().slice(prefix.length);
        return raw.slice(prefix.length);
      }
    }
    return "";
  }

  function getWordBeforeCursor(text, pos) {
    const { lineStart } = getLineInfo(text, pos);
    const line = text.slice(lineStart, pos);
    const m = line.match(/([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*\.?)$/);
    return m ? m[1] : "";
  }

  function getPythonCompletionCandidates(text, pos, completions = {}) {
    const word = getWordBeforeCursor(text, pos);
    const columns = completions.columns || [];
    const variables = completions.variables || ["df", "mm", "april"];
    const snippets = [...(completions.snippets || []), ...PY_SNIPPETS];
    const items = [];
    const seen = new Set();

    const push = (label, insert, detail = "", kind = "method") => {
      const key = `${kind}:${insert}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({ label, insert, detail, kind });
    };

    if (word.endsWith(".")) {
      const root = word.slice(0, -1);
      if (root === "df" || root === "mm" || root === "april") {
        columns.forEach((c) => push(`['${c}']`, `['${c}']`, "열", "column"));
        PY_PANDAS_METHODS.forEach((m) => push(m, m + (m.includes("(") ? "" : "("), "pandas", "method"));
      } else if (root === "pd") {
        ["read_csv", "concat", "to_numeric", "DataFrame"].forEach((m) =>
          push(m, m + "(", "pandas", "method")
        );
      } else {
        PY_PANDAS_METHODS.forEach((m) => push(m, m + "(", "method", "method"));
      }
      return items.slice(0, 12);
    }

    const lower = word.toLowerCase();
    const prefix = word;

    snippets.forEach((s) => {
      const lbl = s.label || s.insert;
      if (!prefix || lbl.toLowerCase().includes(lower) || s.insert.toLowerCase().startsWith(lower)) {
        push(lbl, s.insert, s.detail || "스니펫", "snippet");
      }
    });

    PY_PANDAS_METHODS.forEach((m) => {
      if (!prefix || m.toLowerCase().startsWith(lower)) push(m, m + "(", "pandas", "method");
    });

    [...PY_BUILTINS].forEach((m) => {
      if (!prefix || m.toLowerCase().startsWith(lower)) push(m, m + "(", "builtin", "builtin");
    });

    variables.forEach((v) => {
      if (!prefix || v.toLowerCase().startsWith(lower)) push(v, v, "변수", "variable");
    });

    columns.forEach((c) => {
      if (!prefix || c.toLowerCase().startsWith(lower)) push(`'${c}'`, `'${c}'`, "열 이름", "column");
    });

    return items.slice(0, 10);
  }

  function getPythonGhostSuggestion(text, pos, completions = {}) {
    const candidates = getPythonCompletionCandidates(text, pos, completions);
    if (!candidates.length) return "";

    const word = getWordBeforeCursor(text, pos);
    const best = candidates[0];
    if (!word) return "";

    if (word.endsWith(".")) {
      return best.insert;
    }

    if (best.insert.toLowerCase().startsWith(word.toLowerCase()) && best.insert !== word) {
      return best.insert.slice(word.length);
    }

    const { line, col } = getLineInfo(text, pos);
    const before = line.slice(0, col).trimEnd();
    if (/=\s*$/.test(before) && best.kind === "snippet") {
      return best.insert;
    }

    return "";
  }

  function getGhostSuggestion(text, pos, mode, completions = {}) {
    if (mode === "python") {
      return getPythonGhostSuggestion(text, pos, completions);
    }
    const { line, lineStart, col } = getLineInfo(text, pos);
    const beforeCursor = line.slice(0, col);
    const wordMatch = beforeCursor.match(/([A-Za-z_][A-Za-z0-9_]*)$/);
    const word = wordMatch ? wordMatch[1] : "";
    const tables = completions.tables || [];
    const columns = completions.columns || {};

    if (word) {
      const kw = completeWord(word, SQL_KEYWORD_LIST, "upper");
      if (kw) return kw + " ";
      const fn = completeWord(word, SQL_FUNCTION_LIST, "lower");
      if (fn) return fn + "(";
      const tbl = completeWord(word, tables, "preserve");
      if (tbl) return tbl + " ";
      const allCols = Object.values(columns).flat();
      const col = completeWord(word, allCols, "preserve");
      if (col) return col + " ";
    }

    const trimmed = beforeCursor.replace(/\s+$/, "");
    if (/^SELECT$/i.test(trimmed)) return " ";
    if (/^SELECT\s+$/i.test(beforeCursor)) return "* ";
    if (/^FROM$/i.test(trimmed)) return " ";
    if (/^FROM\s+$/i.test(beforeCursor) && tables[0]) return `${tables[0]} `;
    if (/^WHERE\s+$/i.test(beforeCursor) && tables[0] && columns[tables[0]]?.[0]) {
      return `${columns[tables[0]][0]} `;
    }
    if (/^ORDER\s+BY\s+$/i.test(beforeCursor) && tables[0] && columns[tables[0]]?.[0]) {
      return `${columns[tables[0]][0]} `;
    }
    if (/^JOIN\s+$/i.test(beforeCursor) && tables[1]) return `${tables[1]} ON `;
    if (/^INNER\s+JOIN\s+$/i.test(beforeCursor) && tables[1]) return `${tables[1]} ON `;
    if (/^LEFT\s+JOIN\s+$/i.test(beforeCursor) && tables[1]) return `${tables[1]} ON `;
    if (/^GROUP\s+BY\s+$/i.test(beforeCursor) && tables[0] && columns[tables[0]]?.[0]) {
      return `${columns[tables[0]][0]} `;
    }
    if (/^LIMIT\s+$/i.test(beforeCursor)) return "10";

    const prev = text.slice(0, lineStart).split("\n").pop() || "";
    if (SQL_INDENT_CONT.test(prev.trim()) && !beforeCursor.trim()) {
      return lineIndent(prev) + TAB;
    }

    return "";
  }

  function normalizeEditorText(text) {
    return String(text ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }

  function applyEditorTypography(source, target) {
    if (!source || !target) return;
    const style = getComputedStyle(source);
    TYPOGRAPHY_PROPS.forEach((prop) => {
      target.style[prop] = style[prop];
    });
    target.style.width = `${source.clientWidth}px`;
    target.style.whiteSpace = "pre";
    target.style.wordWrap = "normal";
    target.style.overflowWrap = "normal";
  }

  function attach(textarea, highlightEl, options = {}) {
    const readableFallback = options.readableFallback === true;
    const enableGhost = options.ghost !== false;
    let mode = "sql";
    let completions = options.completions || {};
    const wrap = highlightEl?.closest(".code-editor-wrap");

    if (readableFallback) {
      wrap?.classList.add("code-editor-wrap--readable");
    }

    let ghostEl = wrap?.querySelector(".code-editor-ghost");
    let mirrorEl = wrap?.querySelector(".code-editor-mirror");
    if (enableGhost && wrap && !ghostEl) {
      ghostEl = document.createElement("span");
      ghostEl.className = "code-editor-ghost";
      ghostEl.setAttribute("aria-hidden", "true");
      mirrorEl = document.createElement("div");
      mirrorEl.className = "code-editor-mirror";
      mirrorEl.setAttribute("aria-hidden", "true");
      wrap.appendChild(mirrorEl);
      wrap.appendChild(ghostEl);
    }

    function syncScroll() {
      highlightEl.scrollTop = textarea.scrollTop;
      highlightEl.scrollLeft = textarea.scrollLeft;
    }

    function syncSize() {
      const height = Math.max(textarea.offsetHeight, textarea.scrollHeight);
      highlightEl.style.minHeight = `${textarea.offsetHeight}px`;
      highlightEl.style.height = `${height}px`;
    }

    function syncTypography() {
      if (readableFallback) return;
      applyEditorTypography(textarea, highlightEl);
      if (ghostEl) applyEditorTypography(textarea, ghostEl);
    }

    function measureCaretPoint(pos) {
      if (!mirrorEl) return null;
      const value = normalizeEditorText(textarea.value);
      const safePos = Math.max(0, Math.min(pos, value.length));
      applyEditorTypography(textarea, mirrorEl);
      mirrorEl.textContent = value.slice(0, safePos);
      const marker = document.createElement("span");
      marker.textContent = value.slice(safePos, safePos + 1) || "\u200b";
      mirrorEl.appendChild(marker);

      const left = marker.offsetLeft + (value.slice(safePos, safePos + 1) ? marker.offsetWidth : 0);
      const top = marker.offsetTop;
      mirrorEl.textContent = "";
      return {
        left: left - textarea.scrollLeft,
        top: top - textarea.scrollTop,
      };
    }

    function positionGhost(suggestion) {
      if (!ghostEl || !mirrorEl || !suggestion) {
        if (ghostEl) ghostEl.textContent = "";
        return;
      }
      const pos = textarea.selectionStart;
      if (pos !== textarea.selectionEnd) {
        ghostEl.textContent = "";
        return;
      }
      const point = measureCaretPoint(pos);
      if (!point) {
        ghostEl.textContent = "";
        return;
      }

      ghostEl.textContent = suggestion;
      ghostEl.style.left = `${point.left}px`;
      ghostEl.style.top = `${point.top}px`;
    }

    let acEl = null;
    let acItems = [];
    let acIndex = 0;

    if (wrap && !wrap.querySelector(".code-editor-ac")) {
      acEl = document.createElement("div");
      acEl.className = "code-editor-ac";
      acEl.hidden = true;
      acEl.setAttribute("role", "listbox");
      wrap.appendChild(acEl);
      acEl.addEventListener("mousedown", (e) => {
        const btn = e.target.closest(".code-editor-ac-item");
        if (!btn) return;
        e.preventDefault();
        const idx = Number(btn.dataset.idx);
        if (acItems[idx]) acceptCompletion(acItems[idx]);
      });
    } else {
      acEl = wrap?.querySelector(".code-editor-ac");
    }

    function hideAutocomplete() {
      acItems = [];
      acIndex = 0;
      if (acEl) {
        acEl.hidden = true;
        acEl.innerHTML = "";
      }
    }

    function getActiveCandidates() {
      const pos = textarea.selectionStart;
      if (mode === "python") {
        return getPythonCompletionCandidates(textarea.value, pos, completions);
      }
      const ghost = getGhostSuggestion(textarea.value, pos, mode, completions);
      if (!ghost) return [];
      const word = getWordBeforeCursor(textarea.value, pos);
      return [{ label: word + ghost, insert: word + ghost, detail: "Tab으로 수락", kind: "ghost" }];
    }

    function positionAutocomplete() {
      if (!acEl || !mirrorEl || acEl.hidden) return;
      const pos = textarea.selectionStart;
      const point = measureCaretPoint(pos);
      if (!point) return;
      const taStyle = getComputedStyle(textarea);
      const lineH = parseFloat(taStyle.lineHeight) || 20;
      acEl.style.left = `${Math.max(8, point.left)}px`;
      acEl.style.top = `${Math.max(8, point.top + lineH)}px`;
      acEl.style.right = "auto";
      acEl.style.width = `${Math.min(420, textarea.clientWidth - 16)}px`;
    }

    function renderAutocomplete(items) {
      if (!acEl || !items.length) {
        hideAutocomplete();
        return;
      }
      acItems = items;
      acIndex = 0;
      acEl.innerHTML = items
        .map(
          (it, i) =>
            `<button type="button" class="code-editor-ac-item${i === acIndex ? " is-active" : ""}" data-idx="${i}" role="option">
              <span class="code-editor-ac-kind">${escapeHtml(it.kind || "")}</span>
              <span class="code-editor-ac-label">${escapeHtml(it.label)}</span>
              ${it.detail ? `<span class="code-editor-ac-detail">${escapeHtml(it.detail)}</span>` : ""}
            </button>`
        )
        .join("");
      acEl.hidden = false;
      positionAutocomplete();
    }

    function acceptCompletion(item) {
      const pos = textarea.selectionStart;
      const word = getWordBeforeCursor(textarea.value, pos);
      const start = pos - word.length;
      let insert = item.insert;

      if (word.endsWith(".")) {
        insertText(textarea, insert, pos, pos);
      } else if (word && insert.toLowerCase().startsWith(word.toLowerCase())) {
        insertText(textarea, insert.slice(word.length), start, pos);
      } else {
        insertText(textarea, insert, start, pos);
      }
      hideAutocomplete();
      sync();
    }

    function syncAutocomplete() {
      if (textarea.selectionStart !== textarea.selectionEnd) {
        hideAutocomplete();
        return;
      }
      const pos = textarea.selectionStart;
      const word = getWordBeforeCursor(textarea.value, pos);
      const items = getActiveCandidates();
      if (mode === "python" && items.length > 1 && (word.length >= 1 || word.endsWith("."))) {
        renderAutocomplete(items);
      } else {
        hideAutocomplete();
      }
    }

    function syncGhost() {
      if (!enableGhost) return;
      const pos = textarea.selectionStart;
      const suggestion = getGhostSuggestion(textarea.value, pos, mode, completions);
      positionGhost(suggestion);
      syncAutocomplete();
    }

    function sync() {
      const normalized = normalizeEditorText(textarea.value);
      if (textarea.value !== normalized) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = normalized;
        textarea.selectionStart = start;
        textarea.selectionEnd = end;
      }

      syncTypography();
      let html = highlightCode(normalized, mode);
      if (normalized.endsWith("\n")) html += "\n";
      highlightEl.textContent = "";
      highlightEl.innerHTML = html;
      syncSize();
      syncScroll();
      syncGhost();
    }

    function handleBracketPair(e) {
      const ch = e.key;
      if (BRACKET_OPEN[ch]) {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const close = BRACKET_OPEN[ch];
        if (start !== end) {
          insertText(textarea, ch + textarea.value.slice(start, end) + close, start, end);
        } else {
          insertText(textarea, ch + close, start, end);
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
        sync();
        return true;
      }
      if (BRACKET_CLOSE.has(ch)) {
        const pos = textarea.selectionStart;
        if (pos === textarea.selectionEnd && textarea.value[pos] === ch) {
          e.preventDefault();
          textarea.selectionStart = textarea.selectionEnd = pos + 1;
          sync();
          return true;
        }
      }
      if (e.key === "Backspace") {
        const pos = textarea.selectionStart;
        if (pos === textarea.selectionEnd && pos > 0) {
          const open = textarea.value[pos - 1];
          const close = BRACKET_OPEN[open];
          if (close && textarea.value[pos] === close) {
            e.preventDefault();
            textarea.value = textarea.value.slice(0, pos - 1) + textarea.value.slice(pos + 1);
            textarea.selectionStart = textarea.selectionEnd = pos - 1;
            sync();
            return true;
          }
        }
      }
      return false;
    }

    function handleTab(e) {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start !== end) {
        const selected = textarea.value.slice(start, end);
        const lines = selected.split("\n");
        const indented = lines.map((l) => TAB + l).join("\n");
        insertText(textarea, indented, start, end);
      } else {
        insertText(textarea, TAB, start, end);
      }
      sync();
    }

    function handleShiftTab(e) {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const selStartLine = value.lastIndexOf("\n", start - 1) + 1;
      const selEndLine = value.indexOf("\n", end);
      const blockEnd = selEndLine === -1 ? value.length : selEndLine;
      const block = value.slice(selStartLine, blockEnd);
      const lines = block.split("\n");
      const out = lines
        .map((l) => (l.startsWith(TAB) ? l.slice(TAB.length) : l.replace(/^ {1,2}/, "")))
        .join("\n");
      textarea.value = value.slice(0, selStartLine) + out + value.slice(blockEnd);
      textarea.selectionStart = selStartLine;
      textarea.selectionEnd = selStartLine + out.length;
      sync();
    }

    function handleEnter(e) {
      if (mode !== "sql" && mode !== "python") return;
      e.preventDefault();
      const pos = textarea.selectionStart;
      const value = textarea.value;
      const { line } = getLineInfo(value, pos);
      const indent = lineIndent(line);
      let extra = "";
      if (mode === "sql") {
        const t = line.trim();
        if (SQL_INDENT_AFTER.test(t) || SQL_INDENT_CONT.test(t)) extra = TAB;
      } else if (line.trim().endsWith(":")) {
        extra = TAB;
      }
      insertText(textarea, `\n${indent}${extra}`, pos, pos);
      sync();
    }

    function acceptGhost() {
      if (acItems.length && mode === "python") {
        acceptCompletion(acItems[acIndex] || acItems[0]);
        return true;
      }
      const pos = textarea.selectionStart;
      const suggestion = getGhostSuggestion(textarea.value, pos, mode, completions);
      if (!suggestion) return false;
      insertText(textarea, suggestion, pos, pos);
      sync();
      return true;
    }

    textarea.addEventListener("input", () => {
      sync();
    });
    textarea.addEventListener("scroll", () => {
      syncScroll();
      hideAutocomplete();
    });
    textarea.addEventListener("click", () => {
      hideAutocomplete();
      syncGhost();
    });
    textarea.addEventListener("keyup", syncGhost);
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        syncSize();
        syncScroll();
        syncGhost();
      });
      ro.observe(textarea);
    }

    textarea.addEventListener("keydown", (e) => {
      if (handleBracketPair(e)) return;

      if (acItems.length && mode === "python") {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          acIndex = (acIndex + 1) % acItems.length;
          renderAutocomplete(acItems);
          acEl?.querySelectorAll(".code-editor-ac-item").forEach((el, i) => {
            el.classList.toggle("is-active", i === acIndex);
          });
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          acIndex = (acIndex - 1 + acItems.length) % acItems.length;
          renderAutocomplete(acItems);
          acEl?.querySelectorAll(".code-editor-ac-item").forEach((el, i) => {
            el.classList.toggle("is-active", i === acIndex);
          });
          return;
        }
        if (e.key === "Enter" && acItems.length) {
          e.preventDefault();
          acceptCompletion(acItems[acIndex] || acItems[0]);
          return;
        }
      }

      if (e.key === "Tab" && !e.shiftKey) {
        if (enableGhost && getGhostSuggestion(textarea.value, textarea.selectionStart, mode, completions)) {
          e.preventDefault();
          acceptGhost();
          return;
        }
        handleTab(e);
        return;
      }
      if (e.key === "Tab" && e.shiftKey) {
        handleShiftTab(e);
        return;
      }
      if (e.key === "Enter" && !acItems.length) {
        handleEnter(e);
        return;
      }
      if (e.key === "Escape") {
        if (ghostEl) ghostEl.textContent = "";
        hideAutocomplete();
        return;
      }
      if ((e.key === "ArrowRight" || e.key === "End") && enableGhost && !e.shiftKey) {
        const pos = textarea.selectionStart;
        const suggestion = getGhostSuggestion(textarea.value, pos, mode, completions);
        if (suggestion && e.key === "ArrowRight") {
          e.preventDefault();
          acceptGhost();
        }
      }
      if (e.key === " " && e.ctrlKey && mode === "python") {
        e.preventDefault();
        const items = getPythonCompletionCandidates(
          textarea.value,
          textarea.selectionStart,
          completions
        );
        renderAutocomplete(items);
      }
    });

    sync();

    return {
      setMode(m) {
        mode = m === "python" ? "python" : "sql";
        sync();
      },
      setCompletions(c) {
        completions = c || {};
        syncGhost();
      },
      refresh: sync,
    };
  }

  return { attach, highlightCode, getGhostSuggestion, getPythonCompletionCandidates };
})();
