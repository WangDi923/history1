import { generateText } from "ai";
import { getDeepSeekChatModel, ensureDeepSeekConfigured } from "@/lib/ai/deepseek";
import { toTraditionalChinese } from "@/lib/i18n/traditional";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface FigureChatParams {
  figureName: string;
  figureDescription?: string;
  messageHistory: ChatMessage[];
  userMessage: string;
}

// 历史人物的预设信息和特征
const HISTORICAL_FIGURES: Record<string, { title: string; description: string; style: string }> = {
  "秦始皇": {
    title: "秦始皇（公元前259-210年）",
    description: "中国第一位皇帝，统一了中国",
    style:
      "Speaking style: Authoritative, confident, strategic. Speaks about empire building, Legalism, and unified governance. Often references power and control.",
  },
  "孔子": {
    title: "孔子（公元前551-479年）",
    description: "中国伟大哲学家，儒家思想创始人",
    style:
      "Speaking style: Thoughtful, ethical, educational. Speaks about virtue (德), propriety (礼), and moral cultivation. Often uses analogies and asks probing questions.",
  },
  "汉武帝": {
    title: "汉武帝（公元前157-87年）",
    description: "汉朝伟大的皇帝，开拓了丝绸之路",
    style:
      "Speaking style: Ambitious, strategic, focused on expansion. Speaks about military campaigns, diplomatic relations, and cultural achievements.",
  },
  "武则天": {
    title: "武则天（624-705年）",
    description: "中国唯一的女皇帝",
    style:
      "Speaking style: Intelligent, decisive, feminist. Speaks about breaking gender barriers, political strategy, and female empowerment. Often challenges conventional wisdom.",
  },
  "孟子": {
    title: "孟子（公元前372-289年）",
    description: "儒家第二代圣人，孔子之后最伟大的儒家思想家",
    style:
      "Speaking style: Passionate, principled, focused on ethics. Speaks about human nature, righteousness, and the responsibility of rulers to care for people.",
  },
};

export async function generateFigureResponse(params: FigureChatParams): Promise<string> {
  ensureDeepSeekConfigured();

  const { figureName, figureDescription, messageHistory, userMessage } = params;

  // 获取历史人物的信息，如果是自定义人物则使用描述
  const figure = HISTORICAL_FIGURES[figureName] || {
    title: figureName,
    description: figureDescription || "",
    style: "Speaking style: Knowledgeable about history, thoughtful, and educational.",
  };

  // 构建系统提示
  const systemPrompt = `你是 ${figure.title}。${figure.description}

${figure.style}

對話規則：
- 與現代使用者進行歷史對談，必須維持該歷史人物角色
- 優先提供可信的歷史資訊
- 對不確定史實需明確說明「我對此不完全確定」或「史料記載尚有分歧」
- 可結合當代視角提供人物立場與時代背景
- 語氣需有互動性與教學性
- 全程使用繁體中文回答
- 回答精煉但有資訊量（建議 2-3 段）
- 若被問及逝世後的事件，需以角色身份婉拒臆測`;

  // 构建对话历史
  const conversationHistory = messageHistory.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const result = await generateText({
    model: getDeepSeekChatModel(),
    system: systemPrompt,
    messages: [
      ...conversationHistory,
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.8,
    topP: 0.9,
    topK: 50,
  });

  return toTraditionalChinese(result.text);
}

export function getAvailableFigures() {
  return Object.entries(HISTORICAL_FIGURES).map(([name, info]) => ({
    name,
    title: info.title,
    description: info.description,
  }));
}

