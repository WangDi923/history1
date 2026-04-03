import * as OpenCC from "opencc-js";

const cnToTwConverter = OpenCC.Converter({ from: "cn", to: "tw" });

export function toTraditionalChinese(text: string): string {
  if (!text) return text;

  try {
    return cnToTwConverter(text);
  } catch {
    return text;
  }
}
