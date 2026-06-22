/**
 * HELPY챗 UI — 우측 실시간 AI 도우미
 */
(() => {
  let lastAiCode = null;
  let streamingEl = null;

  const el = {
    app: document.querySelector(".app"),
    navBtns: document.querySelectorAll(".nav-btn"),
    studyCard: document.getElementById("study-card"),
    resultsCard: document.getElementById("results-card"),
    settingsView: document.getElementById("settings-view"),
    sqlStructureView: document.getElementById("sql-structure-view"),
    studyOnlyEls: document.querySelectorAll(".study-only"),
    sqlOnlyEls: document.querySelectorAll(".sql-only"),
    main: document.querySelector(".main"),
    helpyPanel: document.getElementById("helpy-panel"),
    helpyBody: document.getElementById("helpy-body"),
    helpyKeySetup: document.getElementById("helpy-key-setup"),
    helpyKeyStatus: document.getElementById("helpy-key-status"),
    helpyInlineKey: document.getElementById("helpy-inline-key"),
    helpyInlineSave: document.getElementById("helpy-inline-save"),
    helpyCollapseBtn: document.getElementById("helpy-collapse-btn"),
    helpyFab: document.getElementById("helpy-fab"),
    openAiBtn: document.getElementById("open-ai-btn"),
    aiMessages: document.getElementById("ai-messages"),
    aiInput: document.getElementById("ai-input"),
    aiSendBtn: document.getElementById("ai-send-btn"),
    aiApplyCode: document.getElementById("ai-apply-code"),
    aiQuickActions: document.getElementById("ai-quick-actions"),
    geminiKeyInput: document.getElementById("gemini-key-input"),
    saveGeminiKey: document.getElementById("save-gemini-key"),
    welcomeDialog: document.getElementById("welcome-dialog"),
    welcomeGoSettings: document.getElementById("welcome-go-settings"),
    welcomeDismiss: document.getElementById("welcome-dismiss"),
    codeEditor: document.getElementById("code-editor"),
  };

  const HELPY_DRAWER_KEY = "studyLab_helpyDrawerOpen_v2";
  const elBackdrop = document.getElementById("helpy-backdrop");

  function normalizeHelpyEmoji(text) {
    return String(text || "")
      .replace(/🦝|🐣|🐥|🐤|🐦|🐧|🐔|🐓|🦊|🐻/g, "")
      .replace(/안녕하세요!\s{2,}/g, "안녕하세요! ")
      .replace(/HELPY입니다\.\s{2,}/g, "HELPY입니다.\n\n");
  }

  function normalizeHelpyReadability(text) {
    let out = normalizeHelpyEmoji(text);
    out = out.replace(
      /(안녕하세요[!]?[^\n]{0,140}?(?:HELPY|헬피)[^\n]{0,48}?입니다[.!]?)\s+(?=['"‘「]|[^\n])/u,
      "$1\n\n"
    );
    out = out.replace(
      /(이어드림스쿨[^\n]{0,100}?(?:HELPY|헬피)[^\n]{0,48}?입니다[.!]?)\s+(?=['"‘「]|[^\n])/u,
      "$1\n\n"
    );
    return out;
  }

  function openHelpyDrawer() {
    el.app.classList.add("helpy-drawer-open");
    el.app.classList.remove("helpy-collapsed");
    if (el.helpyPanel) el.helpyPanel.setAttribute("aria-hidden", "false");
    if (el.helpyFab) el.helpyFab.setAttribute("aria-expanded", "true");
    if (elBackdrop) {
      elBackdrop.hidden = false;
      elBackdrop.setAttribute("aria-hidden", "false");
    }
    localStorage.setItem(HELPY_DRAWER_KEY, "1");
    window.dispatchEvent(new Event("study-helpy-toggle"));
    el.aiInput?.focus();
  }

  function closeHelpyDrawer() {
    el.app.classList.remove("helpy-drawer-open");
    el.app.classList.add("helpy-collapsed");
    if (el.helpyPanel) el.helpyPanel.setAttribute("aria-hidden", "true");
    if (el.helpyFab) el.helpyFab.setAttribute("aria-expanded", "false");
    if (elBackdrop) {
      elBackdrop.hidden = true;
      elBackdrop.setAttribute("aria-hidden", "true");
    }
    localStorage.setItem(HELPY_DRAWER_KEY, "0");
    window.dispatchEvent(new Event("study-helpy-toggle"));
  }

  function expandHelpy() {
    openHelpyDrawer();
  }

  function collapseHelpy() {
    closeHelpyDrawer();
  }

  function toggleHelpyCollapse() {
    if (el.app.classList.contains("helpy-drawer-open")) {
      closeHelpyDrawer();
    } else {
      openHelpyDrawer();
    }
  }

  function focusHelpy() {
    openHelpyDrawer();
    el.aiInput?.focus();
  }

  function isPracticeEditorActive() {
    return Boolean(
      document.getElementById("code-editor") &&
        document.getElementById("sandbox-area") &&
        !document.getElementById("sandbox-area").hidden
    );
  }

  function isStudyView(view) {
    return view === "study-choice" || view === "study-practice";
  }

  function switchView(view) {
    el.navBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });

    const isStudy = isStudyView(view);
    const isSqlStructure = view === "sql-structure";

    el.studyCard.hidden = !isStudy;
    el.resultsCard.hidden = true;
    el.settingsView.hidden = view !== "settings";
    if (el.sqlStructureView) {
      el.sqlStructureView.hidden = !isSqlStructure;
    }

    el.studyOnlyEls?.forEach((node) => {
      node.hidden = !isStudy;
    });

    el.sqlOnlyEls?.forEach((node) => {
      node.hidden = !isSqlStructure;
    });

    el.app?.classList.toggle("view-sql-structure-active", isSqlStructure);

    el.main?.classList.toggle("view-study", isStudy);
    el.main?.classList.toggle("view-sql-structure", isSqlStructure);
    el.main?.classList.toggle("view-settings", view === "settings");

    if (isStudy) {
      const category = view === "study-practice" ? "practice" : "choice";
      window.StudyApp?.setItemCategory?.(category, { force: true });
    }

    if (isSqlStructure) {
      requestAnimationFrame(() => {
        window.SqlStructure?.refreshPracticeEditor?.();
      });
    }
  }

  function getWelcomeMessage() {
    return StudyAI.hasApiKey()
      ? "안녕! 나는 **HELPY**야.\n문제·에디터·콘솔을 함께 보며 도와줄게. 코드를 **드래그해 선택**하면 **드래그한 코드 질문** 버튼이 나타나!"
      : "안녕! 나는 **HELPY**야.\n**API 키 없이도** 지금 풀고 있는 문제·작성 코드·콘솔 결과를 함께 보고 설명해 줄게.\n\n💡 힌트 / ⌨️ 코드 완성 / 🔧 오류 설명 · 코드 드래그 후 **드래그한 코드 질문**\n정답은 왼쪽 **정답 보기**에서 확인하고, HELPY는 *틀린 부분·이유*를 알려줘요.";
  }

  function appendHelpyWelcome(container, text) {
    const div = document.createElement("div");
    div.className = "ai-msg assistant ai-msg-welcome";
    div.innerHTML =
      `<div class="ai-welcome-head">` +
      `<img src="assets/helpy-avatar.png" alt="HELPY" class="ai-welcome-avatar" width="56" height="56">` +
      `</div>` +
      `<div class="ai-welcome-body">${formatAiText(text)}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div;
  }

  function updateHelpyKeyUI() {
    const has = StudyAI.hasApiKey();
    el.helpyKeySetup.hidden = has;
    if (el.helpyKeyStatus) {
      el.helpyKeyStatus.textContent = has ? "연결됨 ✓" : "오프라인 도움 ✓";
      el.helpyKeyStatus.className = has ? "helpy-key-status ok" : "helpy-key-status warn";
    }
    if (has && el.helpyInlineKey) {
      el.helpyInlineKey.value = "";
    }
  }

  function appendAiMessage(container, role, text, isError = false) {
    const div = document.createElement("div");
    div.className = `ai-msg ${role}${isError ? " error" : ""}`;
    div.innerHTML = formatAiText(text);
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div;
  }

  function createStreamingMessage(container) {
    const div = document.createElement("div");
    div.className = "ai-msg assistant";
    div.innerHTML = "";
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div;
  }

  function updateStreamingMessage(div, text) {
    div.innerHTML = formatAiText(text);
    div.parentElement.scrollTop = div.parentElement.scrollHeight;
  }

  function formatAiText(text) {
    const src = normalizeHelpyReadability(text);
    const codeBlocks = [];

    // 1) 닫힌 코드블록만 먼저 치환 (미닫힌 ``` 가 뒤 텍스트 전체를 삼키지 않게)
    let processed = src.replace(/```(\w*)[^\S\n]*\n([\s\S]*?)```/g, (match, lang, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push(String(code || "").replace(/\s+$/, ""));
      return `\x00CB${idx}\x00`;
    });

    // 2) 끝에 남은 미완성 ``` 는 코드블록으로 강제 변환하지 않음 (스트리밍 중 잘림 대비)
    processed = processed.replace(/```(\w*)[^\S\n]*\n([\s\S]*)$/, (match, lang, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push(String(code || "").replace(/\s+$/, ""));
      return `\x00CB${idx}\x00<span class="ai-code-incomplete">…</span>`;
    });

    processed = processed
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");

    codeBlocks.forEach((code, idx) => {
      const escaped = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      processed = processed.replace(
        `\x00CB${idx}\x00`,
        `<pre class="ai-code-block"><code>${escaped}</code></pre>`
      );
    });

    return processed;
  }

  function setLoading(container, on) {
    let loader = container.querySelector(".ai-loading");
    if (on) {
      if (!loader) {
        loader = document.createElement("div");
        loader.className = "ai-msg assistant ai-loading";
        loader.textContent = "HELPY가 생각 중…";
        container.appendChild(loader);
        container.scrollTop = container.scrollHeight;
      }
    } else if (loader) {
      loader.remove();
    }
  }

  async function sendOfflineReply(displayText, mode, prefix = "") {
    const reply =
      typeof HelpyOffline !== "undefined"
        ? HelpyOffline.reply(displayText, mode)
        : "API 키 없이는 왼쪽 **힌트 · 요약 · 정답 · 해설** 버튼을 이용해 주세요. 설정에서 Gemini 키를 등록하면 실시간 HELPY 답변이 가능합니다.";
    const badge = "_오프라인 도움 · 마지막 입력 위치 기준_";
    const full = `${prefix}${reply}\n\n---\n${badge}`;
    await new Promise((r) => setTimeout(r, 280));
    if (!streamingEl) {
      streamingEl = createStreamingMessage(el.aiMessages);
    }
    updateStreamingMessage(streamingEl, full);
    return full;
  }

  function buildModeDisplayText(mode, ctx) {
    const selected = ctx?.selectedCode?.trim();
    if (mode === "hint") {
      return selected
        ? "내가 드래그해 선택한 코드 부분에 대한 힌트만 알려줘. 정답 코드는 직접 말하지 마."
        : "이 문제 힌트만 알려줘. 정답 코드나 정답 키워드는 직접 말하지 마.";
    }
    if (mode === "copilot") {
      return [
        "내가 지금 에디터에 작성한 코드를 문제 지시사항·콘솔 결과와 함께 모범 답안과 비교해서 설명해 줘.",
        selected ? `특히 드래그해 선택한 이 부분에 집중해 줘:\n${selected}` : "",
        "전체 정답 코드를 그대로 주지 말고,",
        "1) 한 줄 요약 2) 내 코드에서 틀리거나 빠진 부분 3) 왜 그렇게 써야 하는지 4) 다음에 고칠 한 가지",
        "순서로 알려줘.",
      ]
        .filter(Boolean)
        .join(" ");
    }
    if (mode === "explain_error") {
      return selected
        ? `드래그해 선택한 코드와 콘솔/채점 결과를 연결해서 오류 원인과 수정 방향을 설명해 줘. 선택 코드:\n${selected}`
        : "마지막 실행/채점 오류의 원인과 수정 방향을 설명해줘. 전체 정답은 주지 마.";
    }
    if (mode === "selection") {
      return selected
        ? `내가 드래그해 선택한 이 코드가 문제 요구사항에 맞는지, 틀렸다면 왜 틀렸는지 설명해 줘. 콘솔 결과도 함께 참고해.\n\n선택 코드:\n${selected}`
        : "에디터에서 드래그해 선택한 코드가 없어요. 코드 일부를 선택한 뒤 다시 눌러 주세요.";
    }
    return "";
  }

  function normalizeAiReply(raw) {
    if (typeof raw === "string") return { text: raw, truncated: false };
    return { text: raw?.text || "", truncated: Boolean(raw?.truncated) };
  }

  function appendContinueButton(container, onContinue) {
    let bar = container.querySelector(".ai-continue-bar");
    if (bar) bar.remove();
    bar = document.createElement("div");
    bar.className = "ai-continue-bar";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ai-continue-btn";
    btn.textContent = "이어서 작성해줘";
    btn.addEventListener("click", onContinue);
    bar.appendChild(btn);
    container.appendChild(bar);
    container.scrollTop = container.scrollHeight;
  }

  async function continueAiReply() {
    if (!StudyAI.hasApiKey()) {
      appendAiMessage(el.aiMessages, "assistant", "API 키가 있어야 이어쓰기가 가능해요.");
      return;
    }
    appendAiMessage(el.aiMessages, "user", "이어서 작성해줘");
    setLoading(el.aiMessages, true);
    el.aiSendBtn.disabled = true;
    streamingEl = null;
    try {
      const raw = await StudyAI.continueLastReply("이어서 작성해줘");
      const { text, truncated } = normalizeAiReply(raw);
      streamingEl = createStreamingMessage(el.aiMessages);
      let display = text;
      if (truncated) {
        display += "\n\n---\n⚠️ 아직 일부만 이어졌어요. **이어서 작성해줘**를 한 번 더 눌러 주세요.";
        appendContinueButton(el.aiMessages, continueAiReply);
      }
      updateStreamingMessage(streamingEl, display);
    } catch (err) {
      appendAiMessage(el.aiMessages, "assistant", err.message || String(err), true);
    } finally {
      setLoading(el.aiMessages, false);
      el.aiSendBtn.disabled = false;
      streamingEl = null;
    }
  }

  async function sendAiMessage(userText, mode = "chat") {
    const text = String(userText || "").trim();
    if (!text && mode === "chat") return;

    const ctx = typeof window.StudyApp?.getContext === "function" ? window.StudyApp.getContext() : {};
    const displayText = mode === "chat" ? text : buildModeDisplayText(mode, ctx);

    if (mode === "selection" && !ctx.selectedCode?.trim()) {
      expandHelpy();
      appendAiMessage(el.aiMessages, "assistant", "코드 일부를 **드래그해 선택**한 뒤 **드래그한 코드 질문**을 눌러 주세요.");
      return;
    }

    if (mode === "chat") {
      appendAiMessage(el.aiMessages, "user", text);
    } else {
      const labels = {
        hint: "힌트 요청",
        copilot: "코드 이해 도움",
        explain_error: "오류 설명",
        selection: "드래그한 코드 질문",
      };
      const preview = ctx.selectedCode?.trim()
        ? `\n\`${ctx.selectedCode.trim().slice(0, 80)}${ctx.selectedCode.length > 80 ? "…" : ""}\``
        : "";
      appendAiMessage(el.aiMessages, "user", `[${labels[mode] || mode}]${preview}`);
    }

    if (!StudyAI.hasApiKey()) {
      expandHelpy();
      setLoading(el.aiMessages, true);
      el.aiSendBtn.disabled = true;
      streamingEl = null;
      try {
        if (typeof HelpyOffline !== "undefined") HelpyOffline.updateContextChip?.();
        await sendOfflineReply(displayText, mode);
      } finally {
        setLoading(el.aiMessages, false);
        el.aiSendBtn.disabled = false;
        el.aiInput.value = "";
        streamingEl = null;
      }
      return;
    }

    setLoading(el.aiMessages, true);
    el.aiSendBtn.disabled = true;
    streamingEl = null;
    let fullReply = "";
    let streamBuffer = "";

    try {
      const rawReply = await StudyAI.callGeminiStream(displayText, mode, (chunk) => {
        if (!streamingEl) {
          setLoading(el.aiMessages, false);
          streamingEl = createStreamingMessage(el.aiMessages);
        }
        streamBuffer += chunk;
        updateStreamingMessage(streamingEl, streamBuffer);
      });

      const { text: finalText, truncated } = normalizeAiReply(rawReply);
      fullReply = (finalText || streamBuffer || "").trim();

      if (!fullReply) {
        setLoading(el.aiMessages, false);
        if (!streamingEl) streamingEl = createStreamingMessage(el.aiMessages);
        fullReply = "응답을 받지 못했어요. 다시 시도해 주세요.";
        updateStreamingMessage(streamingEl, fullReply);
      } else {
        let display = fullReply;
        if (truncated) {
          display +=
            "\n\n---\n⚠️ 답변이 **길이 제한**으로 잘렸을 수 있어요. 아래 **이어서 작성해줘**를 눌러 주세요.";
        }
        if (!streamingEl) {
          setLoading(el.aiMessages, false);
          streamingEl = createStreamingMessage(el.aiMessages);
        }
        updateStreamingMessage(streamingEl, display);
        if (truncated) {
          appendContinueButton(el.aiMessages, continueAiReply);
        }
      }

      const code = StudyAI.extractCodeBlock(fullReply);
      lastAiCode = code;

      if (mode !== "copilot" && code && fullReply.includes("```")) {
        el.aiApplyCode.hidden = false;
      } else {
        el.aiApplyCode.hidden = true;
      }
    } catch (err) {
      setLoading(el.aiMessages, false);
      const errMsg = err.message || String(err);

      if (typeof HelpyOffline !== "undefined") {
        if (streamingEl) streamingEl.remove();
        streamingEl = null;
        const notice = `${errMsg}\n\n---\n\n`;
        await sendOfflineReply(displayText, mode, notice);
      } else if (streamingEl) {
        streamingEl.classList.add("error");
        updateStreamingMessage(streamingEl, errMsg);
      } else {
        appendAiMessage(el.aiMessages, "assistant", errMsg, true);
      }
    } finally {
      el.aiSendBtn.disabled = false;
      el.aiInput.value = "";
      streamingEl = null;
    }
  }

  function bindQuickActions(container) {
    container.querySelectorAll(".ai-quick-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;
        expandHelpy();
        if (typeof HelpyOffline !== "undefined") HelpyOffline.updateContextChip?.();
        if (mode === "copilot" && isPracticeEditorActive()) {
          sendAiMessage("", "copilot");
        } else if (mode === "explain_error") {
          sendAiMessage("", "explain_error");
        } else if (mode === "selection") {
          sendAiMessage("", "selection");
        } else {
          sendAiMessage("", mode);
        }
      });
    });
  }

  function askSelectedCode() {
    expandHelpy();
    sendAiMessage("", "selection");
  }

  function applyCodeToEditor() {
    if (!lastAiCode) return;
    if (isPracticeEditorActive()) {
      if (typeof window.StudyApp?.setPracticeEditorValue === "function") {
        window.StudyApp.setPracticeEditorValue(lastAiCode);
      } else {
        const editor = document.getElementById("code-editor");
        if (editor) {
          editor.value = lastAiCode;
          editor.focus();
        }
      }
      appendAiMessage(el.aiMessages, "assistant", "에디터에 예시 코드를 넣었어! 참고만 하고 직접 다시 써 보는 게 좋아요.");
    } else {
      const answerInput = document.getElementById("answer-input");
      if (answerInput && !document.getElementById("typing-area").hidden) {
        answerInput.value = lastAiCode.split("\n")[0].trim();
        answerInput.focus();
      }
    }
    el.aiApplyCode.hidden = true;
  }

  async function saveApiKey(key) {
    const trimmed = String(key || "").trim();

    if (!trimmed) {
      StudyAI.setApiKey("");
      if (el.geminiKeyInput) el.geminiKeyInput.value = "";
      updateHelpyKeyUI();
      StudyAI.updateKeyStatus();
      return { ok: true, cleared: true };
    }

    const statusEl = el.helpyKeyStatus || document.getElementById("gemini-key-status");
    if (statusEl) statusEl.textContent = "연결 확인 중…";

    const result = await StudyAI.validateApiKey(trimmed);
    if (!result.ok) {
      StudyAI.updateKeyStatus();
      updateHelpyKeyUI();
      return result;
    }

    StudyAI.setApiKey(trimmed);
    if (el.geminiKeyInput) el.geminiKeyInput.value = StudyAI.getApiKey();
    updateHelpyKeyUI();
    StudyAI.updateKeyStatus();
    appendAiMessage(
      el.aiMessages,
      "assistant",
      `키가 저장됐어! **${result.model}** 모델로 연결했어. 이제 실시간으로 도와줄게.`
    );
    return result;
  }

  function initSettings() {
    if (el.geminiKeyInput) el.geminiKeyInput.value = StudyAI.getApiKey();

    el.saveGeminiKey?.addEventListener("click", async () => {
      el.saveGeminiKey.disabled = true;
      const result = await saveApiKey(el.geminiKeyInput.value);
      el.saveGeminiKey.disabled = false;
      if (result.cleared) {
        alert("키가 삭제되었습니다.");
      } else if (result.ok) {
        alert("HELPY챗 키가 저장되었습니다.");
      } else {
        alert(result.message || "키 연결에 실패했습니다.");
      }
    });

    el.helpyInlineSave?.addEventListener("click", async () => {
      el.helpyInlineSave.disabled = true;
      const result = await saveApiKey(el.helpyInlineKey.value);
      el.helpyInlineSave.disabled = false;
      if (!result.ok && !result.cleared) {
        alert(result.message || "키 연결에 실패했습니다.");
      }
    });
  }

  function initWelcome() {
    if (!el.welcomeDialog) return;
    el.welcomeGoSettings?.addEventListener("click", () => {
      el.welcomeDialog?.close();
      StudyAI.markWelcomeSeen();
      switchView("settings");
    });
    el.welcomeDismiss?.addEventListener("click", () => {
      el.welcomeDialog?.close();
      StudyAI.markWelcomeSeen();
    });
    // showModal은 화면 전체 클릭을 막아 메뉴가 안 눌리는 것처럼 보일 수 있음 → HELPY 안내로 대체
    if (!StudyAI.isWelcomeSeen() && el.aiMessages) {
      appendAiMessage(
        el.aiMessages,
        "assistant",
        "처음이시면 우측 HELPY를 펼쳐 보세요. 설정 ⚙️에서 Gemini 키를 등록할 수 있어요. (키 없이도 학습 가능)"
      );
      StudyAI.markWelcomeSeen();
    }
  }

  function initNav() {
    el.navBtns.forEach((btn) => {
      btn.addEventListener("click", () => switchView(btn.dataset.view));
    });
    switchView("study-choice");
    document.addEventListener("studyapp:ready", () => {
      window.StudyApp?.refreshStudyView?.();
    });
  }

  function initHelpyPanel() {
    if (localStorage.getItem(HELPY_DRAWER_KEY) === "1") {
      openHelpyDrawer();
    } else {
      closeHelpyDrawer();
    }

    if (!el.aiMessages.childElementCount) {
      appendHelpyWelcome(el.aiMessages, getWelcomeMessage());
    }

    el.openAiBtn?.addEventListener("click", focusHelpy);
    el.helpyCollapseBtn?.addEventListener("click", closeHelpyDrawer);
    el.helpyFab?.addEventListener("click", focusHelpy);
    elBackdrop?.addEventListener("click", closeHelpyDrawer);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && el.app.classList.contains("helpy-drawer-open")) {
        closeHelpyDrawer();
      }
    });
    el.aiSendBtn?.addEventListener("click", () => sendAiMessage(el.aiInput.value, "chat"));
    el.aiApplyCode?.addEventListener("click", applyCodeToEditor);

    el.aiInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendAiMessage(el.aiInput.value, "chat");
      }
    });

    bindQuickActions(el.aiQuickActions);
    updateHelpyKeyUI();

    if (StudyAI.hasApiKey()) {
      StudyAI.validateApiKey(StudyAI.getApiKey()).then((result) => {
        if (result.ok) {
          StudyAI.updateKeyStatus();
        } else if (el.helpyKeyStatus) {
          el.helpyKeyStatus.textContent = "한도·연결 확인 필요";
          el.helpyKeyStatus.className = "helpy-key-status warn";
        }
      });
    }
  }

  function init() {
    initSettings();
    initNav();
    initWelcome();
    initHelpyPanel();
    StudyAI.updateKeyStatus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.StudyAIUI = { focusHelpy, switchView, sendAiMessage, updateHelpyKeyUI, askSelectedCode };
})();
