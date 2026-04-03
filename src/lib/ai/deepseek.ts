import { createOpenAI } from "@ai-sdk/openai";

/**
 * DeepSeek AI SDK integration
 * Uses DeepSeek OpenAI-compatible API endpoint.
 */

const configuredBaseURL = process.env.DEEPSEEK_BASE_URL?.trim();
const normalizedBaseURL = configuredBaseURL
  ? /\/v1\/?$/.test(configuredBaseURL)
    ? configuredBaseURL.replace(/\/$/, "")
    : `${configuredBaseURL.replace(/\/$/, "")}/v1`
  : "https://api.deepseek.com/v1";

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: normalizedBaseURL,
});

export function getDeepSeekChatModel() {
  return deepseek.chat(process.env.DEEPSEEK_CHAT_MODEL ?? "deepseek-chat");
}

export function ensureDeepSeekConfigured() {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY environment variable is not configured");
  }
  if (!process.env.DEEPSEEK_CHAT_MODEL) {
    console.warn("DEEPSEEK_CHAT_MODEL not set, using default: deepseek-chat");
  }
  if (configuredBaseURL && !/\/v1\/?$/.test(configuredBaseURL)) {
    console.warn(`DEEPSEEK_BASE_URL should usually end with /v1. Auto-normalized to: ${normalizedBaseURL}`);
  }
}
