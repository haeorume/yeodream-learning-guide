/**
 * Gemini AI 도우미 — 키는 브라우저 localStorage에만 저장
 */
const StudyAI = (() => {
  const KEY_STORAGE = "studyLab_geminiKey_v1";
  const MODEL_STORAGE = "studyLab_geminiModel_v1";
  const WELCOME_KEY = "studyLab_welcomeSeen_v1";

  /** 2026-06 기준: 2.0 Flash 계열 종료 → 2.5 우선, 구형 1.5는 마지막 폴백 */
  const MODEL_CANDIDATES = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-1.5-flash",
  ];

  let chatHistory = [];

  function getApiKey() {
    return localStorage.getItem(KEY_STORAGE) || "";
  }

  function getPreferredModel() {
    const saved = localStorage.getItem(MODEL_STORAGE);
    if (saved && MODEL_CANDIDATES.includes(saved)) return saved;
    if (saved) localStorage.removeItem(MODEL_STORAGE);
    return MODEL_CANDIDATES[0];
  }

  function setPreferredModel(model) {
    if (model && MODEL_CANDIDATES.includes(model)) {
      localStorage.setItem(MODEL_STORAGE, model);
    }
  }

  function setApiKey(key) {
    const trimmed = String(key || "").trim();
    if (trimmed) localStorage.setItem(KEY_STORAGE, trimmed);
    else localStorage.removeItem(KEY_STORAGE);
    updateKeyStatus();
  }

  function hasApiKey() {
    return Boolean(getApiKey());
  }

  function isWelcomeSeen() {
    return localStorage.getItem(WELCOME_KEY) === "1";
  }

  function markWelcomeSeen() {
    localStorage.setItem(WELCOME_KEY, "1");
  }

  const TEACHING_STYLE = `[설명 스타일 — 초보자·초등학생도 이해할 수 있게]
- **전문 용어는 먼저 쉬운 말로, 그다음 용어로** 설명하세요.
  • 처음 등장할 때: 쉬운 말만 쓰거나 **쉬운 말(전문 용어)** 형태로 짧게 정의하세요.
    예) "몇 번째 칸에서 값을 꺼내는 것을 **인덱싱**이라고 해요." / "표에서 행을 골라내는 것(**필터링**)"
  • 정의한 뒤에는 그 용어만 써도 됩니다. 단, **정의 없이 용어만 던지지 마세요.**
  • JOIN, 서브쿼리, 마스킹, broadcasting 등도 같은 방식으로 처리하세요.
- **인사 문장 규칙**: "안녕하세요", "~HELPY입니다" 등으로 시작할 때, 인사 문장 **끝에서 반드시 빈 줄 1줄**을 넣은 뒤 본문을 시작하세요. 인사와 설명을 한 문단에 이어 쓰지 마세요.
  예시:
  안녕하세요! 이어드림스쿨 학습가이드 HELPY입니다.

  'cd' 명령어를 떠올리신 것은 ...
- **이모지 규칙**: 인사·설명·격려에 이모지를 쓸 때는 **맥락에 맞는 일반 이모지**(💡 ✅ 👏 🔧 📌 🎯 등)를 가볍게 사용하세요. **🦝·🐣·🐥·병아리·너구리·동물 캐릭터 이모지는 쓰지 마세요.** (화면에 HELPY 아바타가 이미 있습니다.)
- 친근하게 격려하세요. (예: "맞아요! 👏", "아주 좋은 질문이에요!")
- 마크다운으로 읽기 쉽게 정리하세요:
  • 짧은 도입 1~2문장
  • 핵심이 2가지 이상이면 # 1️⃣ 2️⃣ 번호 제목으로 나누기 (보통 2~4개 섹션, 과하게 길게 쓰지 마세요)
  • 코드 한 줄 → 무슨 뜻인지 → 결과 예시 순서로 설명
  • 일상 비유는 1개면 충분합니다 (바구니, 학교 점수, 과일 고르기 등)
- **적당한 길이**로 끝내세요. 예시처럼 아주 긴 글은 피하고, 핵심만 담아 주세요.
- **힌트 모드**에서는 3~6문장, SQL/코드 예시는 1개 이하로 짧게 끝내세요.
- 응답은 반드시 **완결된 문장**으로 마무리하세요. 중간에 끊기지 않게 하세요.
- 정답 전체를 베끼게 하지 말고, **왜 그렇게 되는지** 이해를 돕는 것이 목표입니다.`;

  function buildSystemPrompt(mode) {
    const base = `당신은 HELPY, 이어드림스쿨 학습가이드의 친근한 IT 학습 도우미입니다. 외형은 **보라색 너구리** 마스코트이지만, 답변 텍스트에는 동물·너구리 이모지(🦝 등)를 넣지 마세요. 대신 💡 ✅ 👏 등 맥락 이모지로 가독성을 높이세요. SQL, Python, 데이터베이스, 생성형 AI를 가르치는 튜터 역할을 합니다.
항상 한국어로 답합니다. 마크다운을 사용할 수 있습니다.
학습자가 스스로 생각하도록 돕되, 요청이 명확하면 실용적으로 도와줍니다.

${TEACHING_STYLE}

[공통 맥락 인지 규칙]
- 항상 아래에 제공되는 **문제 지시사항**, **사용자 전체 코드**, **콘솔/실행 결과**, **채점 피드백**을 함께 읽고 판단하세요.
- 사용자가 **드래그해 선택한 코드**가 있으면 그 부분을 설명의 초점으로 삼으세요.
- SQL 문제와 Python 문제를 혼동하지 마세요. itemType에 맞는 언어·문법으로만 답하세요.`;

    if (mode === "hint") {
      return `${base}
[모드: 힌트만]
- 정답 코드나 정답 키워드를 직접 알려주지 마세요.
- 방향, 개념, 다음에 시도할 단계만 짧게 안내하세요.
- 선택된 코드가 있으면 그 줄이 왜 막혔는지 방향만 짚어 주세요.
- 설명 스타일은 쉽고 짧게 — 2~3문단 이내.`;
    }
    if (mode === "copilot") {
      return `${base}
[모드: 코드 완성 — 이해 중심 튜터]
- 학습자는 상단 **정답 보기** 메뉴로 모범 답을 볼 수 있습니다. 전체 정답 코드를 그대로 반복·베끼게 하지 마세요.
- 맥락의 «모범 답안»과 «사용자 코드»·«콘솔 결과»를 비교해, **왜** 그렇게 써야 하는지 가르칩니다.
- 응답은 아래 구조로 작성하세요 (마크다운, 각 섹션은 짧게):
  1. **한 줄 요약** — 지금 코드가 어디까지 맞고 무엇이 부족·틀렸는지 (격려 한마디 포함해도 좋아요)
  2. **내 코드 진단** — 빠지거나 틀린 부분을 구문·줄 단위로
  3. **왜 그래야 하나요?** — 쉬운 말·비유로 개념 설명 (JOIN, WHERE, for 루프 등)
  4. **다음 한 걸음** — 스스로 고칠 수 있게 수정 방향 한 가지만 (전체 코드 X)
- 별칭(rh, m) vs 테이블 풀네임, 줄바꿈·들여쓰기 차이는 결과가 같으면 **정답과 동일**하다고 알려주세요.
- 코드 블록은 **문제가 된 1~3줄 예시**만 짧게. \`\`\`로 전체 정답을 주지 마세요.
- 마지막 채점 피드백·실행 결과가 있으면 반드시 반영하세요.`;
    }
    if (mode === "explain_error") {
      return `${base}
[모드: 오류 설명]
- 실행/채점 오류의 원인을 **단계별**로, 쉬운 말로 설명하세요.
- 콘솔 출력과 선택된 코드를 연결해 **어디서** 틀렸는지 짚어 주세요.
- 수정 방향을 제시하되, 전체 정답 코드는 주지 마세요 (사용자가 요청한 경우 제외).
- # 1️⃣ 무슨 오류인지 → # 2️⃣ 왜 났는지 → # 3️⃣ 어떻게 고칠지 순서로 짧게 정리하세요.`;
    }
    if (mode === "selection") {
      return `${base}
[모드: 드래그한 코드 질문]
- 사용자가 **드래그해 선택한 코드**에 집중해 설명하세요.
- 문제 지시사항, 전체 코드, 콘솔 출력을 함께 참고해 선택 부분이 맞는지/틀렸는지 진단하세요.
- 선택한 줄이 문제 요구사항과 어떻게 연결되는지, 연산자·함수·문법이 왜 맞거나 틀렸는지 **쉬운 말**로 설명하세요.
- 전체 정답을 주지 말고, 선택 부분의 의미와 수정 방향을 알려주세요.
- 권장 구조 (각각 짧게, 전체는 읽기 좋은 분량):
  • 도입 격려 1문장
  • # 1️⃣ 선택한 코드가 하는 일
  • # 2️⃣ 문제 요구사항과 맞는지 / 틀렸다면 왜
  • (필요 시) # 3️⃣ 일상 비유 또는 한 줄 예시
  • 마무리 한 문장 — 열린 코드블록(\`\`\`) 없이 완결된 문장으로 끝내세요.`;
    }
    return `${base}
[모드: 질문 답변]
- 모르는 개념을 **초등학생도 따라올 수 있게** 쉽게 설명합니다.
- 번호 제목·짧은 코드 예시·비유를 적절히 쓰되, 너무 길게 늘이지 마세요.
- 선택된 코드가 있으면 그 부분을 중심으로 답하세요.`;
  }

  function getStudyContext() {
    if (typeof window.StudyApp?.getContext === "function") {
      return window.StudyApp.getContext();
    }
    return {};
  }

  function formatContextForPrompt(ctx, mode = "chat") {
    if (!ctx || !ctx.item) return "현재 문제 정보 없음";

    const item = ctx.item;
    const lines = [
      `문제 유형: ${ctx.itemType || "unknown"}`,
      `섹션: ${item.section || item.day || ""}`,
      `질문: ${item.question || ""}`,
    ];
    if (item.instructions) lines.push(`지시사항: ${item.instructions}`);
    if (ctx.practiceGoal) lines.push(`실습 목표: ${ctx.practiceGoal}`);
    if (ctx.practiceSteps?.length) {
      lines.push(
        `실습 단계:\n${ctx.practiceSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
      );
    }
    if (item.practiceGuide?.tip) lines.push(`TIP: ${item.practiceGuide.tip}`);
    if (item.hint && mode === "hint") {
      lines.push(`(등록된 힌트 — AI는 더 깊은 힌트만): ${item.hint}`);
    }

    if (mode === "copilot" || mode === "selection") {
      const ref =
        ctx.itemType === "sql"
          ? (item.referenceSql || "").trim()
          : (item.referenceCode || "").trim();
      if (ref) {
        lines.push(
          `(내부 참고 — 학습자에게 통째로 읊지 말고 비교·설명용) 모범 답안:\n${ref.slice(0, 2500)}`
        );
      }
      if (item.validate?.patterns?.length) {
        lines.push(`채점 키워드: ${item.validate.patterns.join(", ")}`);
      }
    }

    if (ctx.userAnswer) lines.push(`사용자 키워드 입력: ${ctx.userAnswer}`);
    if (ctx.userCode) lines.push(`사용자 전체 코드:\n${ctx.userCode.slice(0, 2500)}`);
    if (ctx.selectedCode) {
      lines.push(
        `★ 사용자가 드래그해 선택한 코드 (질문 초점):\n${ctx.selectedCode.slice(0, 1200)}`
      );
    }
    if (ctx.lastRunOutput) lines.push(`콘솔/실행 결과:\n${ctx.lastRunOutput.slice(0, 1200)}`);
    if (ctx.lastFeedback) lines.push(`마지막 채점 피드백: ${ctx.lastFeedback.slice(0, 500)}`);
    return lines.join("\n");
  }

  function parseGeminiError(status, body) {
    let apiMessage = "";
    try {
      const parsed = JSON.parse(body);
      apiMessage = parsed?.error?.message || "";
    } catch {
      apiMessage = String(body || "").slice(0, 300);
    }

    if (status === 400) {
      if (body.includes("API key") || body.includes("API_KEY")) {
        return "API 키가 올바르지 않습니다. AI Studio에서 새 키를 발급한 뒤 다시 저장해 주세요.";
      }
      return `요청 형식 오류 (400): ${apiMessage || "모델명·요청 내용을 확인해 주세요."}`;
    }

    if (status === 403) {
      return `API 접근이 거부되었습니다 (403).

• AI Studio에서 해당 프로젝트에 **Gemini API** 사용 권한이 있는지 확인하세요.
• 지역·계정 제한일 수 있습니다. [AI Studio 지원](https://discuss.ai.google.dev/)을 참고해 주세요.

${apiMessage ? `\n상세: ${apiMessage}` : ""}`;
    }

    if (status === 404) {
      return `모델을 찾을 수 없습니다 (404). 앱이 자동으로 다른 모델을 시도합니다. 계속 실패하면 페이지를 새로고침해 주세요.`;
    }

    if (status === 429) {
      const limitZero =
        body.includes("limit: 0") ||
        body.includes("limit\":0") ||
        body.includes("RESOURCE_EXHAUSTED");

      if (limitZero) {
        return `**Gemini 무료 한도가 0으로 설정된 상태입니다 (429)**

키는 발급됐지만 프로젝트에 무료 할당량이 아직 활성화되지 않았을 수 있어요.

**해결 방법**
1. [Google Cloud 결제](https://console.cloud.google.com/billing)에서 **결제 계정 연결** (무료 티어도 연결이 필요한 경우가 많습니다)
2. [AI Studio 사용량](https://aistudio.google.com/usage)에서 남은 한도 확인
3. 새 API 키를 **다른 Google 계정**으로 발급해 보기

아래는 **오프라인 HELPY**가 문제 데이터 기반으로 도와드릴게요.`;
      }

      return `**요청 한도 초과 (429)**

• 무료 티어는 **하루 요청 수·분당 요청(RPM)** 제한이 있습니다.
• 잠시(30초~1분) 후 다시 시도하거나 [사용량 대시보드](https://aistudio.google.com/usage)를 확인하세요.

아래는 **오프라인 HELPY** 답변입니다.`;
    }

    return `AI 요청 실패 (${status}): ${apiMessage || body.slice(0, 200)}`;
  }

  function shouldRetryWithNextModel(status, body) {
    if (status === 404) return true;
    if (status === 400) return true;
    if (status === 429 && !body.includes("limit: 0") && !body.includes("limit\":0")) return true;
    return false;
  }

  function buildApiUrl(model, action, apiKey) {
    const url = new URL(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:${action}`
    );
    if (action === "streamGenerateContent") {
      url.searchParams.set("alt", "sse");
    }
    url.searchParams.set("key", apiKey);
    return url.toString();
  }

  function buildRequestBody(mode, userMessage, contextBlock, { useSystemInstruction = true } = {}) {
    const system = buildSystemPrompt(mode);
    const userText = useSystemInstruction
      ? `--- 현재 학습 맥락 ---
${contextBlock}

--- 사용자 메시지 ---
${userMessage}`
      : `${system}

--- 현재 학습 맥락 ---
${contextBlock}

--- 사용자 메시지 ---
${userMessage}`;

    const maxTokens =
      mode === "selection" || mode === "copilot"
        ? 4096
        : mode === "hint"
          ? 1536
          : 2560;

    const body = {
      contents: [
        ...chatHistory.slice(-4).map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        })),
        { role: "user", parts: [{ text: userText }] },
      ],
      generationConfig: {
        temperature: mode === "copilot" || mode === "selection" ? 0.35 : 0.7,
        maxOutputTokens: maxTokens,
      },
    };

    if (useSystemInstruction) {
      body.systemInstruction = { parts: [{ text: system }] };
    }

    return body;
  }

  function orderedModels() {
    const preferred = getPreferredModel();
    const rest = MODEL_CANDIDATES.filter((m) => m !== preferred);
    return [preferred, ...rest];
  }

  async function fetchGemini(model, action, body, apiKey) {
    const url = buildApiUrl(model, action, apiKey);
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async function requestGenerate(model, body, apiKey) {
    const res = await fetchGemini(model, "generateContent", body, apiKey);
    const errBody = await res.text();
    if (!res.ok) {
      return { ok: false, status: res.status, body: errBody };
    }
    const data = JSON.parse(errBody);
    const { text, finishReason } = extractTextFromGeminiPayload(data);
    const complete = finishReason === "STOP" || !finishReason;
    return {
      ok: Boolean(text.trim()) && complete,
      text,
      status: res.status,
      body: errBody,
      finishReason,
      partial: Boolean(text.trim()) && !complete,
      truncated: finishReason === "MAX_TOKENS",
    };
  }

  function extractTextFromGeminiPayload(parsed) {
    const payloads = Array.isArray(parsed) ? parsed : [parsed];
    let text = "";
    let finishReason = "";

    for (const payload of payloads) {
      if (!payload || typeof payload !== "object") continue;
      const candidate = payload.candidates?.[0];
      if (!candidate) continue;
      if (candidate.finishReason) finishReason = candidate.finishReason;

      const parts = candidate.content?.parts || [];
      for (const part of parts) {
        if (!part || part.thought) continue;
        if (typeof part.text === "string") text += part.text;
      }
    }

    return { text, finishReason };
  }

  function parseGeminiSseBuffer(buffer) {
    const events = [];
    let rest = buffer.replace(/\r\n/g, "\n");

    while (true) {
      const sep = rest.indexOf("\n\n");
      if (sep === -1) break;
      const block = rest.slice(0, sep);
      rest = rest.slice(sep + 2);
      if (!block.trim()) continue;

      const dataLines = block
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim());

      if (!dataLines.length) continue;
      const jsonStr = dataLines.join("\n").trim();
      if (!jsonStr || jsonStr === "[DONE]") continue;
      events.push(jsonStr);
    }

    return { events, rest };
  }

  async function requestStream(model, body, apiKey, onChunk) {
    const res = await fetchGemini(model, "streamGenerateContent", body, apiKey);
    if (!res.ok) {
      const errBody = await res.text();
      return { ok: false, status: res.status, body: errBody, text: "" };
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";
    let finishReason = "";

    const consumeEvents = (jsonStrings) => {
      for (const jsonStr of jsonStrings) {
        try {
          const parsed = JSON.parse(jsonStr);
          const { text, finishReason: fr } = extractTextFromGeminiPayload(parsed);
          if (fr) finishReason = fr;
          if (text) {
            fullText += text;
            onChunk(text);
          }
        } catch {
          /* malformed SSE JSON — skip */
        }
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parsed = parseGeminiSseBuffer(buffer);
      buffer = parsed.rest;
      consumeEvents(parsed.events);
    }

    // 남은 버퍼에 마지막 이벤트가 있을 수 있음
    if (buffer.trim()) {
      const tailLines = buffer
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim());
      if (tailLines.length) {
        const jsonStr = tailLines.join("\n").trim();
        if (jsonStr && jsonStr !== "[DONE]") {
          consumeEvents([jsonStr]);
        }
      }
    }

    const complete = Boolean(fullText.trim()) && finishReason === "STOP";

    return {
      ok: complete,
      text: fullText,
      status: 200,
      body: "",
      finishReason,
      partial: Boolean(fullText.trim()) && !complete,
      truncated: finishReason === "MAX_TOKENS",
    };
  }

  function buildContinuationBody(mode, tailText, contextBlock, { useSystemInstruction = true } = {}) {
    const system = buildSystemPrompt(mode);
    const userText = `아래 HELPY 답변이 출력 길이 제한으로 **중간에 잘렸습니다**.
마지막 문장부터 **이어서만** 작성하세요. 앞부분 반복·요약 금지. 마크다운 형식 유지.

--- 잘린 답변 (끝부분) ---
${tailText.slice(-2800)}`;

    const body = {
      contents: [{ role: "user", parts: [{ text: userText }] }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 2048,
      },
    };

    if (useSystemInstruction) {
      body.systemInstruction = {
        parts: [
          {
            text: `${system}\n\n[이어쓰기 모드] 이전 답변의 연속만 출력. «--- 현재 학습 맥락 ---»\n${contextBlock}`,
          },
        ],
      };
    } else {
      body.contents[0].parts[0].text = `${system}\n\n${userText}\n\n--- 맥락 ---\n${contextBlock}`;
    }

    return body;
  }

  async function appendContinuationIfNeeded(model, mode, contextBlock, text, finishReason, apiKey) {
    if (finishReason !== "MAX_TOKENS" || !text.trim()) {
      return { text, finishReason, continued: false };
    }

    const body = buildContinuationBody(mode, text, contextBlock);
    const cont = await requestGenerate(model, body, apiKey);
    if (!cont.ok || !cont.text.trim()) {
      return { text, finishReason, continued: false };
    }

    let merged = text + cont.text;
    if (cont.finishReason === "MAX_TOKENS") {
      const body2 = buildContinuationBody(mode, merged, contextBlock);
      const cont2 = await requestGenerate(model, body2, apiKey);
      if (cont2.ok && cont2.text.trim()) {
        merged += cont2.text;
      }
    }

    return { text: merged, finishReason: cont.finishReason || "STOP", continued: true };
  }

  async function callWithModelFallback(mode, userMessage, contextBlock, onChunk) {
    const apiKey = getApiKey();
    const variants = [
      { useSystemInstruction: true, stream: true },
      { useSystemInstruction: true, stream: false },
      { useSystemInstruction: false, stream: false },
    ];

    let lastError = "";
    let bestPartial = "";

    for (const model of orderedModels()) {
      for (const variant of variants) {
        const body = buildRequestBody(mode, userMessage, contextBlock, {
          useSystemInstruction: variant.useSystemInstruction,
        });

        const result = variant.stream
          ? await requestStream(model, body, apiKey, onChunk)
          : await requestGenerate(model, body, apiKey);

        if (result.text && result.text.length > bestPartial.length) {
          bestPartial = result.text;
        }

        if (result.text?.trim()) {
          let finalText = result.text;
          let fr = result.finishReason || "STOP";

          if (fr === "MAX_TOKENS" || result.truncated) {
            const cont = await appendContinuationIfNeeded(
              model,
              mode,
              contextBlock,
              finalText,
              fr,
              apiKey
            );
            finalText = cont.text;
            fr = cont.finishReason;
          }

          if (variant.stream && fr && fr !== "STOP") {
            lastError = "스트리밍 응답이 중간에 끊겼습니다. 전체 응답을 다시 요청합니다.";
            continue;
          }

          setPreferredModel(model);
          chatHistory.push({ role: "user", text: userMessage });
          chatHistory.push({ role: "model", text: finalText });
          return { text: finalText, truncated: fr === "MAX_TOKENS" };
        }

        // 스트림이 부분만 받고 끊기면 비스트림으로 재시도
        if (variant.stream && result.partial && result.text?.trim()) {
          lastError = "스트리밍 응답이 중간에 끊겼습니다. 전체 응답을 다시 요청합니다.";
          continue;
        }

        lastError = result.body
          ? parseGeminiError(result.status, result.body)
          : result.text.trim()
            ? "응답이 완전히 수신되지 않았습니다."
            : "빈 응답을 받았습니다.";
        if (!shouldRetryWithNextModel(result.status, result.body || "")) {
          if (bestPartial.trim()) return { text: bestPartial, truncated: true };
          throw new Error(lastError);
        }
      }
    }

    if (bestPartial.trim()) return { text: bestPartial, truncated: true };
    throw new Error(lastError || "AI 요청에 실패했습니다.");
  }

  async function validateApiKey(key) {
    const apiKey = String(key || "").trim();
    if (!apiKey) {
      return { ok: false, message: "키가 비어 있습니다." };
    }

    const testBody = buildRequestBody("chat", "ping", "연결 테스트", { useSystemInstruction: true });
    let lastError = "";

    for (const model of MODEL_CANDIDATES) {
      try {
        const streamRes = await fetchGemini(model, "streamGenerateContent", testBody, apiKey);
        const streamBody = await streamRes.text();

        if (streamRes.ok) {
          setPreferredModel(model);
          return { ok: true, model, message: `연결 성공 (${model})` };
        }

        const genRes = await fetchGemini(model, "generateContent", testBody, apiKey);
        const genBody = await genRes.text();

        if (genRes.ok) {
          setPreferredModel(model);
          return { ok: true, model, message: `연결 성공 (${model})` };
        }

        lastError = parseGeminiError(genRes.status, genBody || streamBody);
        if (!shouldRetryWithNextModel(genRes.status, genBody || streamBody)) {
          return { ok: false, message: lastError };
        }
      } catch (err) {
        lastError = `네트워크 오류: ${err.message || err}`;
      }
    }

    return {
      ok: false,
      message: lastError || "모든 모델 연결에 실패했습니다. 키와 결제 설정을 확인해 주세요.",
    };
  }

  async function callGemini(userMessage, mode = "chat") {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("Gemini API 키가 없습니다. 설정에서 무료 키를 등록해 주세요.");
    }

    const ctx = getStudyContext();
    const contextBlock = formatContextForPrompt(ctx, mode);
    return callWithModelFallback(mode, userMessage, contextBlock, () => {});
  }

  async function callGeminiStream(userMessage, mode = "chat", onChunk) {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("Gemini API 키가 없습니다. HELPY챗 패널에서 키를 등록해 주세요.");
    }

    const ctx = getStudyContext();
    const contextBlock = formatContextForPrompt(ctx, mode);
    return callWithModelFallback(mode, userMessage, contextBlock, onChunk);
  }

  async function continueLastReply(userMessage = "이어서 작성해줘") {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API 키가 없습니다.");

    const lastModel = chatHistory.filter((m) => m.role === "model").pop();
    if (!lastModel?.text?.trim()) {
      throw new Error("이어 쓸 이전 답변이 없습니다.");
    }

    const ctx = getStudyContext();
    const contextBlock = formatContextForPrompt(ctx, "chat");
    const model = getPreferredModel();
    const body = buildContinuationBody("chat", lastModel.text, contextBlock);
    const cont = await requestGenerate(model, body, apiKey);

    if (!cont.text?.trim()) {
      throw new Error("이어쓰기에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }

    const merged = lastModel.text + cont.text;
    chatHistory.push({ role: "user", text: userMessage });
    for (let i = chatHistory.length - 1; i >= 0; i--) {
      if (chatHistory[i].role === "model") {
        chatHistory[i] = { role: "model", text: merged };
        break;
      }
    }

    return { text: merged, truncated: cont.finishReason === "MAX_TOKENS" };
  }

  function extractCodeBlock(text) {
    const match = text.match(/```(?:sql|python|py)?\s*([\s\S]*?)```/i);
    return match ? match[1].trim() : null;
  }

  function clearHistory() {
    chatHistory = [];
  }

  function updateKeyStatus() {
    const statusEl = document.getElementById("gemini-key-status");
    const helpyStatus = document.getElementById("helpy-key-status");
    const has = hasApiKey();
    const model = has ? getPreferredModel() : "";
    const label = has ? `연결됨 · ${model}` : "키 미설정";
    if (statusEl) {
      statusEl.textContent = has ? "키 등록됨" : "키 미설정";
      statusEl.className = has ? "key-status ok" : "key-status warn";
    }
    if (helpyStatus) {
      helpyStatus.textContent = has ? label : "오프라인 도움 ✓";
      helpyStatus.className = has ? "helpy-key-status ok" : "helpy-key-status warn";
    }
    const keySetup = document.getElementById("helpy-key-setup");
    if (keySetup) keySetup.hidden = has;
  }

  return {
    getApiKey,
    setApiKey,
    setPreferredModel,
    getPreferredModel,
    hasApiKey,
    isWelcomeSeen,
    markWelcomeSeen,
    validateApiKey,
    callGemini,
    callGeminiStream,
    continueLastReply,
    extractCodeBlock,
    clearHistory,
    updateKeyStatus,
    parseGeminiError,
  };
})();
