import { generateText } from "ai";
import { getDeepSeekChatModel, ensureDeepSeekConfigured } from "@/lib/ai/deepseek";
import { toTraditionalChinese } from "@/lib/i18n/traditional";

export interface ScriptGenerationParams {
  eventName: string;
  teachingObjective: string;
  gradeLevel?: string;
  durationMinutes?: number;
}

export async function generateHistoricalScript(params: ScriptGenerationParams): Promise<string> {
  ensureDeepSeekConfigured();

  const { eventName, teachingObjective, gradeLevel, durationMinutes } = params;

  const systemPrompt = `你是一位歷史教育與戲劇編寫專家，負責為歷史課堂生成教學舞台劇腳本。

輸出規則（必須嚴格遵守）：
- 僅使用繁體中文輸出（包括標題、註釋、角色、舞台說明、教師備註與提問）
- 禁止輸出英文段落；專有名詞如需保留外文，請在中文語境中簡短標註
- 使用清晰的 Markdown 結構

內容要求：
- 適配指定年級
- 提供歷史資訊，並用「高／中／低（存疑）」標註史實置信度
- 包含清晰角色分配與舞台調度
- 包含課堂討論問題
- 控制在指定課時可執行範圍內`;

  const userPrompt = `請基於以下資訊生成「中文歷史教學舞台劇腳本」：

歷史事件：${eventName}
教學目標：${teachingObjective}
適用年級：${gradeLevel || "未指定"}
課堂時長：${durationMinutes || "未指定"} 分鐘

請嚴格按以下結構輸出（全程繁體中文）：
1. 角色表（含建議分配）
2. 分幕分場結構
3. 台詞與舞台說明
4. 教師講解備註（含史實置信度：高／中／低）
5. 課堂反思與討論問題

再次強調：輸出內容必須是繁體中文，不要使用英文整句。`;

  const result = await generateText({
    model: getDeepSeekChatModel(),
    system: systemPrompt,
    prompt: userPrompt,
    temperature: 0.7,
  });

  return toTraditionalChinese(result.text);
}
