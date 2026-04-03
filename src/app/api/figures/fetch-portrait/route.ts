import { NextRequest, NextResponse } from "next/server";
import { fetchPortraitFromWiki } from "@/lib/wikipedia-portrait";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const figureName = String(body?.figureName ?? "").trim();

    if (!figureName) {
      return NextResponse.json(
        { error: "Figure name is required" },
        { status: 400 }
      );
    }

    const result = await fetchPortraitFromWiki(figureName);

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      matchedTitle: result.matchedTitle,
      source: result.source,
    });
  } catch (error) {
    console.error("Portrait fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}