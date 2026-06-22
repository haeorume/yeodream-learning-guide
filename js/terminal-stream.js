/**
 * SQL / Python 터미널 — 실행 중 모션 + 결과 라인 스트리밍
 */
const StudyTerminalStream = (() => {
  let token = 0;

  function cancel() {
    token += 1;
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function runningMarkup(kind) {
    if (typeof StudySandbox === "undefined") {
      return '<div class="terminal-running-fallback">실행 중…</div>';
    }
    if (kind === "python") {
      return StudySandbox.formatPythonConsole("", "", { running: true, streamUi: true });
    }
    return StudySandbox.formatSqlConsole("", { running: true, streamUi: true });
  }

  function showRunning(targetEl, kind = "sql") {
    if (!targetEl) return Date.now();
    cancel();
    targetEl.classList.add("terminal-is-running");
    targetEl.innerHTML = runningMarkup(kind);
    return Date.now();
  }

  function parseLayout(html) {
    const tpl = document.createElement("template");
    tpl.innerHTML = String(html || "").trim();
    const root = tpl.content.firstElementChild;
    if (!root) {
      return {
        mount(targetEl) {
          targetEl.innerHTML = html || "";
          return null;
        },
        streamNodes: [],
      };
    }

    if (root.classList.contains("py-repl")) {
      const chrome = root.querySelector(":scope > .py-repl-chrome")?.cloneNode(true);
      const bodyNodes = [...(root.querySelector(":scope > .py-repl-body")?.childNodes || [])].map(
        (n) => n.cloneNode(true)
      );
      return {
        mount(targetEl) {
          targetEl.innerHTML = "";
          const repl = document.createElement("div");
          repl.className = "py-repl terminal-reveal-shell";
          if (chrome) repl.appendChild(chrome);
          const body = document.createElement("div");
          body.className = "py-repl-body terminal-stream-body";
          repl.appendChild(body);
          targetEl.appendChild(repl);
          return body;
        },
        streamNodes: bodyNodes,
      };
    }

    if (root.classList.contains("sql-elice-console")) {
      const nodes = [...root.childNodes].map((n) => n.cloneNode(true));
      return {
        mount(targetEl) {
          targetEl.innerHTML = "";
          const shell = document.createElement("div");
          shell.className = `${root.className} terminal-reveal-shell`;
          targetEl.appendChild(shell);
          return shell;
        },
        streamNodes: nodes,
      };
    }

    const nodes = [...root.childNodes].map((n) => n.cloneNode(true));
    return {
      mount(targetEl) {
        targetEl.innerHTML = "";
        const shell = document.createElement(root.tagName.toLowerCase());
        if (root.className) shell.className = `${root.className} terminal-reveal-shell`;
        targetEl.appendChild(shell);
        return shell;
      },
      streamNodes: nodes,
    };
  }

  function lineDelay(lineCount, baseMs) {
    if (lineCount <= 1) return baseMs * 2;
    const budget = 2600;
    return Math.min(baseMs, Math.max(10, Math.floor(budget / lineCount)));
  }

  async function streamPre(pre, fullText, baseMs, myToken) {
    const lines = String(fullText || "").split("\n");
    const delay = lineDelay(lines.length, baseMs);
    pre.textContent = "";
    pre.classList.add("is-streaming");
    for (let i = 0; i < lines.length; i += 1) {
      if (token !== myToken) return false;
      pre.textContent += (i ? "\n" : "") + lines[i];
      scrollToBottom(pre.parentElement);
      await sleep(i === 0 ? delay * 1.4 : delay);
    }
    pre.classList.remove("is-streaming");
    return true;
  }

  function scrollToBottom(container) {
    if (!container) return;
    const scrollHost =
      container.closest(".sandbox-result") ||
      container.closest("#sandbox-result") ||
      container;
    if (scrollHost && scrollHost.scrollHeight > scrollHost.clientHeight) {
      scrollHost.scrollTop = scrollHost.scrollHeight;
    }
  }

  async function revealNode(container, node, opts, myToken) {
    if (token !== myToken) return false;

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim()) return true;
      const span = document.createElement("span");
      span.className = "terminal-text-block terminal-block-enter";
      span.textContent = text;
      container.appendChild(span);
      scrollToBottom(container);
      await sleep(opts.blockMs);
      return true;
    }

    const el = node.cloneNode(true);
    const isStreamPre =
      el.tagName === "PRE" &&
      (el.classList.contains("sql-cli-table") ||
        el.classList.contains("py-repl-out") ||
        el.classList.contains("sql-cli-table--err"));

    if (isStreamPre) {
      const pre = document.createElement("pre");
      pre.className = el.className;
      container.appendChild(pre);
      scrollToBottom(container);
      return streamPre(pre, el.textContent, opts.lineMs, myToken);
    }

    el.classList.add("terminal-block-enter");
    container.appendChild(el);
    scrollToBottom(container);
    await sleep(opts.blockMs);
    return true;
  }

  async function reveal(targetEl, html, options = {}) {
    if (!targetEl) return false;

    const myToken = ++token;
    const kind = options.kind || "sql";
    const minRunMs = options.minRunMs ?? 450;
    const lineMs = options.lineMs ?? 28;
    const blockMs = options.blockMs ?? 85;

    if (options.alreadyRunning !== true) {
      showRunning(targetEl, kind);
    }

    const started = options.runStartedAt || Date.now();
    await sleep(Math.max(0, minRunMs - (Date.now() - started)));
    if (token !== myToken) return false;

    if (options.instant || !html) {
      targetEl.classList.remove("terminal-is-running");
      targetEl.innerHTML = html || "";
      return true;
    }

    const layout = parseLayout(html);
    const streamHost = layout.mount(targetEl);
    if (!streamHost) {
      targetEl.classList.remove("terminal-is-running");
      return true;
    }

    for (const node of layout.streamNodes) {
      const ok = await revealNode(streamHost, node, { lineMs, blockMs }, myToken);
      if (!ok) return false;
    }

    streamHost.closest(".terminal-reveal-shell")?.classList.add("terminal-reveal-done");
    targetEl.classList.remove("terminal-is-running");
    return true;
  }

  return { reveal, showRunning, cancel, runningMarkup };
})();
