import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: chats, error } = await supabase
      .from("figure_chats")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ chats });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { figureName, title, figureDescription, generateImage } = await request.json();

    if (!figureName) {
      return NextResponse.json(
        { error: "Figure name is required" },
        { status: 400 }
      );
    }

    let figureImageUrl = null;

    // Generate image if requested
    if (generateImage) {
      try {
        const imageResponse = await fetch(
          "http://localhost:3000/api/figures/fetch-portrait",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              figureName,
              figureDescription,
            }),
          }
        );

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          figureImageUrl = imageData.imageUrl;
        }
      } catch (err) {
        console.error("Image generation failed:", err);
        // Continue without image if generation fails
      }
    }

    const { data: chat, error: insertError } = await supabase
      .from("figure_chats")
      .insert({
        user_id: user.id,
        figure_name: figureName,
        title: title || `与${figureName}的对话`,
        figure_image_url: figureImageUrl,
        figure_description: figureDescription,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: `Database error: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      chatId: chat?.id,
      chat,
    });
  } catch (error) {
    console.error("Chat creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
