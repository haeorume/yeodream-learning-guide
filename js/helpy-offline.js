/**
 * HELPY 오프라인 도우미 — API 없이 문제 데이터·화면 맥락 기반 답변
 */
const HelpyOffline = (() => {
  function getCtx() {
    if (typeof window.StudyApp?.getContext === "function") {
      return window.StudyApp.getContext();
    }
    return {};
  }

  function updateContextChip() {
    const chip = document.getElementById("helpy-context-chip");
    if (!chip) return;

    const ctx = getCtx();
    const item = ctx.item;
    if (!item) {
      chip.textContent = "📍 학습 화면";
      return;
    }

    const typeLabel =
      ctx.itemType === "sql" ? "SQL 실습" : ctx.itemType === "python" ? "Python 실습" : ctx.itemType === "choice" ? "선택형" : "문제";
    const section = item.section || item.day || "";
    const sel = ctx.selectedCode?.trim();
    const selHint = sel ? ` · 선택 ${Math.min(sel.length, 24)}자` : "";
    chip.textContent = `📍 ${typeLabel}${section ? ` · ${section}` : ""}${selHint}`;
    chip.title = sel ? `선택 코드: ${sel.slice(0, 200)}` : section;
  }

  function buildHintReply(item, ctx = getCtx()) {
    const parts = ["**HELPY 힌트** (오프라인)"];
    if (ctx.selectedCode?.trim()) {
      parts.push(`\n**선택한 코드**\n\`\`\`\n${ctx.selectedCode.trim().slice(0, 300)}\n\`\`\``);
      parts.push("\n위 줄이 **문제 지시사항**과 같은 연산·함수를 쓰는지 먼저 확인해 보세요.");
    }
    if (item.hint) {
      parts.push(`\n**방향**\n${item.hint}`);
    }
    if (item.guideSteps?.length) {
      parts.push(
        "\n**단계별로 시도해 보세요**\n" +
          item.guideSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")
      );
    }
    if (item.summary && !item.hint) {
      parts.push(`\n**개념 힌트**\n${item.summary.slice(0, 280)}…`);
    }
    if (parts.length === 1) {
      parts.push("\n등록된 힌트가 없어요. 왼쪽 **힌트** 버튼이나 문제 지시사항을 다시 읽어 보세요.");
    }
    parts.push("\n\n💡 정답은 직접 말하지 않을게요. 한 단계 더 시도해 보면 좋아요!");
    return parts.join("");
  }

  function getReferenceSolution(item, ctx) {
    if (ctx.itemType === "sql") {
      return (item.referenceSql || "").trim();
    }
    return (item.referenceCode || "").trim();
  }

  function normalizeForCheck(code) {
    return String(code || "")
      .toLowerCase()
      .replace(/['"]/g, "'");
  }

  function countSelectStatements(code) {
    const stripped = String(code || "").replace(/--[^\n]*/g, "");
    return (stripped.match(/\bselect\b/gi) || []).length;
  }

  function buildCopilotTutorialReply(item, ctx) {
    const userCode = (ctx.userCode || "").trim();
    const solution = getReferenceSolution(item, ctx);
    const parts = ["**HELPY 코드 이해 도움** (오프라인)"];
    const diagnoses = [];
    const concepts = [];
    let summary = "";

    if (!solution) {
      return buildCopilotFallbackReply(item, ctx);
    }

    const userN = normalizeForCheck(userCode);
    const refN = normalizeForCheck(solution);
    const patterns = item.validate?.patterns || [];
    const steps = item.practiceGuide?.steps || item.guideSteps || [];

    if (ctx.itemType === "sql") {
      const selectCount = countSelectStatements(userCode);
      if (selectCount > 1) {
        diagnoses.push(
          "에디터에 `SELECT`가 **여러 개** 있어요. 채점은 **마지막 SELECT 한 문장**만 봅니다. " +
            "위쪽 `PRAGMA`·`SELECT *` 탐색 쿼리 아래에 완성한 JOIN 쿼리가 **맨 마지막**이어야 해요."
        );
      }

      if (refN.includes("inner join") && !userN.includes("inner join") && !/\bjoin\b/.test(userN)) {
        diagnoses.push("**INNER JOIN**이 아직 없거나 연결이 안 됐어요.");
        concepts.push(
          "**INNER JOIN**은 두 테이블에서 **조건이 맞는 행만** 짝 지어 붙입니다. " +
            "이 문제는 `req_member_id`와 `member_id`가 같은 행만 가져와야 해요."
        );
      } else if (userN.includes("join")) {
        diagnoses.push("JOIN은 쓰고 있어요. 조건(`ON ... = ...`)과 필터가 맞는지 확인해 보세요.");
      }

      if (refN.includes("where") && !userN.includes("where")) {
        diagnoses.push("**WHERE** 조건이 빠졌을 수 있어요. `req_status = 'fail'`만 남겨야 합니다.");
        concepts.push("JOIN으로 붙인 뒤 **WHERE**로 상태가 `fail`인 행만 걸러요.");
      } else if (userN.includes("fail")) {
        diagnoses.push("`fail` 조건은 포함되어 있어요.");
      }

      if (refN.includes("order by") && !userN.includes("order by")) {
        diagnoses.push("**ORDER BY**가 없어요. 이 문제는 `request_id` **오름차순** 정렬이 필요합니다.");
        concepts.push(
          "채점은 행 **순서까지** 비교해요. JOIN·WHERE만 맞아도 `ORDER BY`가 없으면 오답일 수 있어요."
        );
      } else if (userN.includes("order by")) {
        diagnoses.push("정렬(`ORDER BY`)도 포함되어 있어요.");
      }

      const needCols = item.practiceGuide?.outputColumns || [];
      if (needCols.length) {
        const missingCols = needCols.filter((c) => !userN.includes(String(c).toLowerCase()));
        if (missingCols.length) {
          diagnoses.push(`결과 컬럼 확인: **${missingCols.join(", ")}** 가 SELECT에 있어야 해요.`);
        }
      }

      if (/\brh\b|\bm\b/.test(userN) && refN.includes("request_hist")) {
        concepts.push(
          "테이블 **별칭**(`rh`, `m`)을 쓴 것은 문법상 문제 없어요. 풀네임과 **같은 의미**면 정답과 동일합니다."
        );
      }
    } else if (ctx.itemType === "python") {
      for (const pat of patterns) {
        if (!userN.includes(String(pat).toLowerCase())) {
          diagnoses.push(`코드에 **${pat}** 가(이) 필요해 보여요.`);
        }
      }
      if (ctx.lastFeedback) {
        diagnoses.push(`채점 피드백: ${ctx.lastFeedback}`);
      }
    }

    if (ctx.lastFeedback && ctx.itemType === "sql") {
      diagnoses.push(`최근 채점: ${ctx.lastFeedback}`);
    }

    const missingPatterns = patterns.filter((p) => !userN.includes(String(p).toLowerCase()));
    if (missingPatterns.length && ctx.itemType === "sql") {
      concepts.push(`채점기는 **${missingPatterns.join(", ")}** 키워드도 확인합니다.`);
    }

    if (!userCode) {
      summary = "아직 작성한 코드가 없거나 비어 있어요. 시작 코드를 보며 JOIN·WHERE·ORDER BY 순서로 채워 보세요.";
    } else if (missingPatterns.length === 0 && diagnoses.every((d) => d.includes("포함") || d.includes("쓰고"))) {
      summary =
        "큰 틀은 맞는 편이에요! **실행 → 채점**으로 결과·순서를 확인하고, SELECT가 여러 개면 마지막 문장만 남기세요.";
    } else if (missingPatterns.length) {
      summary = `핵심은 맞을 수 있지만 **${missingPatterns.join(", ")}** 부분을 보완해야 채점 통과가 쉬워요.`;
    } else {
      summary = "작성 중인 코드를 모범 답과 비교했어요. 아래 진단을 보며 빠진 조각을 채워 보세요.";
    }

    parts.push(`\n### 한 줄 요약\n${summary}`);

    if (diagnoses.length) {
      parts.push("\n### 내 코드 진단\n" + diagnoses.map((d) => `• ${d}`).join("\n"));
    }

    if (concepts.length) {
      parts.push("\n### 왜 그래야 하나요?\n" + concepts.map((c) => `• ${c}`).join("\n"));
    }

    if (steps.length) {
      parts.push(
        "\n### 문제가 요구하는 순서\n" + steps.map((s, i) => `${i + 1}. ${s}`).join("\n")
      );
    }

    parts.push(
      "\n### 다음 한 걸음\n" +
        "상단 **정답 보기**와 대조하며, 위에서 빠진 **한 가지**만 먼저 고쳐 보세요. " +
        "전체를 한꺼번에 베끼기보다 **한 줄씩 이해하며** 에디터에 직접 써 보는 게 좋아요."
    );

    parts.push(
      "\n\n💡 더 길고 맞춤형 설명은 Gemini 키 연결 후 **코드 완성**을 다시 눌러 보세요."
    );

    return parts.join("");
  }

  function buildCopilotFallbackReply(item, ctx) {
    const code = (ctx.userCode || "").trim();
    const parts = ["**HELPY 코드 이해 도움** (오프라인)"];
    if (code) {
      parts.push(`\n지금 코드:\n\`\`\`\n${code.slice(-500)}\n\`\`\``);
    }
    const steps = item.practiceGuide?.steps || item.guideSteps;
    if (steps?.length) {
      parts.push("\n**구현 순서**\n" + steps.map((s, i) => `${i + 1}. ${s}`).join("\n"));
    }
    if (item.hint) parts.push(`\n**힌트**\n${item.hint}`);
    parts.push("\n⚠️ 모범 코드가 없어 상세 비교는 어려워요. **정답 보기**와 **해설** 버튼을 활용해 주세요.");
    return parts.join("");
  }

  function buildCopilotReply(item, ctx) {
    return buildCopilotTutorialReply(item, ctx);
  }

  function buildErrorReply(item, ctx) {
    const parts = ["**HELPY 오류 설명** (오프라인)"];

    if (ctx.lastFeedback) {
      parts.push(`\n**채점 피드백**\n${ctx.lastFeedback}`);
    }
    if (ctx.lastRunOutput) {
      parts.push(`\n**실행 결과**\n\`\`\`\n${ctx.lastRunOutput.slice(0, 600)}\n\`\`\``);
    }

    if (item.explanation) {
      parts.push(`\n**개념 정리**\n${item.explanation}`);
    }

    if (!ctx.lastFeedback && !ctx.lastRunOutput) {
      parts.push(
        "\n아직 실행·채점 기록이 없어요. **실행** 또는 **채점**을 한 번 눌러 본 뒤 다시 **오류 설명**을 요청해 주세요."
      );
    } else {
      parts.push(
        "\n\n**다음에 확인할 것**\n1. 오타·들여쓰기·괄호 짝\n2. 변수·컬럼 이름이 문제와 일치하는지\n3. 조건·반복 범위가 맞는지"
      );
    }
    return parts.join("");
  }

  function buildSelectionReply(item, ctx) {
    const selected = (ctx.selectedCode || "").trim();
    const parts = ["**HELPY 드래그한 코드 질문** (오프라인)"];

    if (!selected) {
      parts.push("\n코드 일부를 **드래그해 선택**한 뒤 다시 눌러 주세요.");
      return parts.join("");
    }

    parts.push(`\n**선택한 코드**\n\`\`\`\n${selected.slice(0, 600)}\n\`\`\``);

    if (ctx.practiceGoal || item.instructions) {
      parts.push(`\n**문제 목표**\n${ctx.practiceGoal || item.instructions}`);
    }

    if (ctx.lastRunOutput) {
      parts.push(`\n**콘솔 결과**\n\`\`\`\n${ctx.lastRunOutput.slice(0, 500)}\n\`\`\``);
    }

    const userN = normalizeForCheck(ctx.userCode || "");
    const selN = normalizeForCheck(selected);
    const patterns = item.validate?.patterns || [];

    if (ctx.itemType === "python") {
      const commentMatch = selected.match(/#\s*Q\d+\.\s*(.+)/);
      if (commentMatch) {
        parts.push(`\n**주석 요구사항**: ${commentMatch[1]}`);
      }
      if (selN.includes("+") && userN.includes("-") === false && /뺀|빼|subtract|minus/i.test(ctx.practiceGoal || item.instructions || "")) {
        parts.push("\n**진단**: 주석은 **빼기**를 요구하는데 선택한 줄에 `+`가 보여요. 연산자를 `-`로 바꿔야 할 수 있어요.");
      }
      const missing = patterns.filter((p) => !selN.includes(String(p).toLowerCase()) && !userN.includes(String(p).toLowerCase()));
      if (missing.length) {
        parts.push(`\n**확인할 키워드**: ${missing.join(", ")}`);
      }
    } else if (ctx.itemType === "sql") {
      if (!selN.includes("select") && !selN.includes("from")) {
        parts.push("\n**진단**: SQL 문장의 일부만 선택했어요. `SELECT`·`FROM`·조건 절이 함께 맞는지 전체 흐름도 확인해 보세요.");
      }
      if (ctx.lastFeedback) {
        parts.push(`\n**채점 피드백**: ${ctx.lastFeedback}`);
      }
    }

    if (ctx.lastFeedback && ctx.itemType === "python") {
      parts.push(`\n**채점 피드백**: ${ctx.lastFeedback}`);
    }

    parts.push(
      "\n\n💡 선택한 줄이 **문제 주석/지시사항**과 같은 연산·함수를 쓰는지 먼저 비교해 보세요. 더 자세한 설명은 Gemini 키 연결 후 다시 질문해 주세요."
    );
    return parts.join("");
  }

  function buildChatReply(item, ctx, userMessage) {
    const parts = [`**HELPY** — ${userMessage || "질문"}에 대한 오프라인 답변`];

    if (item.question) {
      parts.push(`\n**현재 문제**\n${item.question}`);
    }
    if (item.summary) {
      parts.push(`\n**요약**\n${item.summary}`);
    }
    if (item.hint) {
      parts.push(`\n**힌트**\n${item.hint}`);
    }
    if (item.explanation) {
      parts.push(`\n**해설**\n${item.explanation}`);
    }

    if (ctx.itemType === "choice" && item.options?.length) {
      const wrong = item.options.filter((o) => !o.isCorrect).slice(0, 2);
      if (wrong.length) {
        parts.push(
          "\n**오답이 왜 틀릴 수 있는지 생각해 보기**\n" +
            wrong.map((o) => `• ${o.text}: ${o.rationale || "관련 개념을 다시 확인해 보세요."}`).join("\n")
        );
      }
    }

    parts.push(
      "\n\n더 긴 맞춤 답변은 **설정 → Gemini 키** 등록 후 이용해 주세요. 왼쪽 **요약·해설** 버튼도 활용해 보세요!"
    );
    return parts.join("");
  }

  function reply(userMessage, mode = "chat") {
    updateContextChip();
    const ctx = getCtx();
    const item = ctx.item;

    if (!item) {
      return "지금은 풀고 있는 문제가 없어요. **선택형** 또는 **실습** 메뉴에서 문제를 연 뒤 다시 물어봐 주세요.";
    }

    if (mode === "hint") return buildHintReply(item, ctx);
    if (mode === "copilot") return buildCopilotReply(item, ctx);
    if (mode === "explain_error") return buildErrorReply(item, ctx);
    if (mode === "selection") return buildSelectionReply(item, ctx);
    return buildChatReply(item, ctx, userMessage);
  }

  return { reply, updateContextChip };
})();
