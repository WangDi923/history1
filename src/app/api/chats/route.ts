import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateFigureResponse, getAvailableFigures } from "@/lib/ai/figure-chat";

// GET - 获取可用的历史人物列表
export async function GET(request: NextRequest) {
  try {
    const figures = getAvailableFigures();
    return NextResponse.json({ figures });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST - 发送消息到指定的聊天
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, message } = await request.json();

    if (!chatId || !message) {
      return NextResponse.json(
        { error: "Chat ID and message are required" },
        { status: 400 }
      );
    }

    // 获取聊天信息
    const { data: chat, error: chatError } = await supabase
      .from("figure_chats")
      .select("*")
      .eq("id", chatId)
      .eq("user_id", user.id)
      .single();

    if (chatError || !chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // 获取聊天历史
    const { data: messages, error: messagesError } = await supabase
      .from("figure_chat_messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      return NextResponse.json(
        { error: `Database error: ${messagesError.message}` },
        { status: 500 }
      );
    }

    // 保存用户消息
    const { error: userMsgError } = await supabase
      .from("figure_chat_messages")
      .insert({
        chat_id: chatId,
        role: "user",
        content: message,
      });

    if (userMsgError) {
      return NextResponse.json(
        { error: `Failed to save message: ${userMsgError.message}` },
        { status: 500 }
      );
    }

    // 检查 DeepSeek 配置
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "DeepSeek API key is not configured" },
        { status: 500 }
      );
    }

    // 生成AI响应
    const messageHistory = messages?.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })) ?? [];

    const assistantResponse = await generateFigureResponse({
      figureName: chat.figure_name,
      messageHistory,
      userMessage: message,
    });

    // 保存AI响应
    const { error: assistantMsgError } = await supabase
      .from("figure_chat_messages")
      .insert({
        chat_id: chatId,
        role: "assistant",
        content: assistantResponse,
      });

    if (assistantMsgError) {
      return NextResponse.json(
        { error: `Failed to save response: ${assistantMsgError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userMessage: message,
      assistantResponse: assistantResponse,
    });
  } catch (error) {
    console.error("Chat error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "Not Found") {
      return NextResponse.json(
        {
          error:
            "DeepSeek endpoint not found. Please check DEEPSEEK_BASE_URL and provider compatibility settings.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
