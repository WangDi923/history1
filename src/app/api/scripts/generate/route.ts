import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateHistoricalScript } from "@/lib/ai/script-generation";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 解析请求体
    const { eventName, teachingObjective, gradeLevel, durationMinutes } = await request.json();

    // 验证必填字段
    if (!eventName || !teachingObjective) {
      return NextResponse.json(
        { error: "Event name and teaching objective are required" },
        { status: 400 }
      );
    }

    // 检查 DeepSeek 配置
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "DeepSeek API key is not configured" },
        { status: 500 }
      );
    }

    // 使用 AI SDK 生成脚本
    const generatedContent = await generateHistoricalScript({
      eventName,
      teachingObjective,
      gradeLevel,
      durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : undefined,
    });

    if (!generatedContent) {
      return NextResponse.json(
        { error: "Failed to generate script content" },
        { status: 500 }
      );
    }

    // 保存到 Supabase
    const { data: script, error: insertError } = await supabase
      .from("scripts")
      .insert({
        user_id: user.id,
        event_name: eventName,
        teaching_objective: teachingObjective,
        grade_level: gradeLevel,
        duration_minutes: durationMinutes ? parseInt(durationMinutes, 10) : null,
        content: generatedContent,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: `Database error: ${insertError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      scriptId: script?.id,
      content: generatedContent,
    });
  } catch (error) {
    console.error("Script generation error:", error);
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
