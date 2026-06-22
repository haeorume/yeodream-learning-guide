/**
 * 선택형 퀴즈 — 엘리스 스타일 질문·보기 구문 강조
 */
const StudyChoiceSyntax = (() => {
  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function resolveTheme(item) {
    const blob = `${item?.section || ""} ${item?.id || ""} ${item?.question || ""} ${item?.code || ""}`.toLowerCase();
    if (
      /sql|dml|ddl|join|집합|윈도우|데이터베이스|db\b|쿼리|select|from|where|minus|except|intersect|create table|alter table|drop table/i.test(
        blob
      )
    ) {
      return "sql";
    }
    if (/numpy|np\.|ndarray|reshape|arange|pandas|pd\.|matplotlib|시각화|dataframe/i.test(blob)) {
      return "numpy";
    }
    if (
      /python|파이썬|def |for |print\(|lambda|리스트|딕셔너리|tuple|함수|break|return|append|dictionary/i.test(
        blob
      )
    ) {
      return "python";
    }
    return "neutral";
  }

  function highlightCode(code, theme) {
    const src = String(code || "");
    if (!src) return "";
    const mode = theme === "sql" ? "sql" : "python";
    if (typeof StudyCodeEditor?.highlightCode === "function") {
      return StudyCodeEditor.highlightCode(src, mode);
    }
    return escapeHtml(src);
  }

  function looksLikeCode(text) {
    const t = String(text || "").trim();
    if (!t || t.length > 160) return false;
    if (/^(SELECT|CREATE|INSERT|UPDATE|DELETE|ALTER|DROP|def |for |import |print\(|\w+\[)/i.test(t)) {
      return true;
    }
    if (/^(break|return|stop|while|EXCEPT|MINUS|INTERSECT|REST|arr\[|dictionary|np\.|pd\.)/i.test(t)) {
      return true;
    }
    if (/[`'[\]().:=]|____/.test(t) && /[a-zA-Z_0-9]/.test(t)) return true;
    return false;
  }

  function renderQuestionHtml(item, theme) {
    const q = item?.question || "";
    const parts = [
      `<div class="choice-question-head">`,
      `<span class="choice-q-prefix" aria-hidden="true">Q.</span>`,
      `<p class="choice-q-text">${escapeHtml(q)}</p>`,
      `</div>`,
    ];
    if (item?.code) {
      parts.push(
        `<pre class="choice-code-block choice-syntax code-editor-highlight choice-theme-${theme}"><code>${highlightCode(item.code, theme)}</code></pre>`
      );
    }
    const sub =
      item?.choiceSubtext ||
      (item?.code ? "아래 코드·지문을 읽고 보기 중 알맞은 답을 고르세요." : "");
    if (sub) {
      parts.push(`<p class="choice-q-sub">${escapeHtml(sub)}</p>`);
    }
    return parts.join("");
  }

  function renderOptionHtml(text) {
    return `<span class="choice-option-text">${escapeHtml(text)}</span>`;
  }

  function applyStudyCardTheme(studyCard, item) {
    if (!studyCard || !item) return "neutral";
    const theme = resolveTheme(item);
    studyCard.classList.add("choice-elice");
    studyCard.dataset.choiceTheme = theme;
    return theme;
  }

  function clearStudyCardTheme(studyCard) {
    if (!studyCard) return;
    studyCard.classList.remove("choice-elice");
    delete studyCard.dataset.choiceTheme;
  }

  return {
    resolveTheme,
    highlightCode,
    looksLikeCode,
    renderQuestionHtml,
    renderOptionHtml,
    applyStudyCardTheme,
    clearStudyCardTheme,
  };
})();
