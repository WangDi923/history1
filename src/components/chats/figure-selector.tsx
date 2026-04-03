"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface Figure {
  name: string;
  title: string;
  description: string;
}

interface FigureSelectorProps {
  onSelectFigure: (figureName: string) => void;
  isLoading?: boolean;
}

export default function FigureSelector({
  onSelectFigure,
  isLoading = false,
}: FigureSelectorProps) {
  const [figures, setFigures] = useState<Figure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hiddenFigures = ["汉武帝", "孟子"];

  useEffect(() => {
    fetchFigures();
  }, []);

  const fetchFigures = async () => {
    try {
      const response = await fetch("/api/chats");
      if (!response.ok) throw new Error("Failed to fetch figures");

      const data = await response.json();
      setFigures(data.figures);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load figures");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} />
          <p>加载历史人物...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">加载失败</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchFigures}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">选择历史人物</h2>
        <p className="text-gray-600">
          选择一位历史人物开始对话，了解他们的思想和经历
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {figures
          .filter((figure) => !hiddenFigures.includes(figure.name))
          .map((figure) => (
          <button
            key={figure.name}
            onClick={() => onSelectFigure(figure.name)}
            disabled={isLoading}
            className="flex flex-col h-full bg-[#fbf8f1] border-2 border-transparent hover:border-[#8b2626] rounded shadow-sm hover:shadow-[4px_4px_0px_rgba(139,38,38,0.2)] transition-all p-6 cursor-pointer text-left disabled:opacity-50 disabled:cursor-not-allowed group relative"
          >
            {/* 角落的刻章背景效果 */}
            <div className="absolute right-4 bottom-4 text-[#8b2626] opacity-[0.03] text-6xl leading-none font-serif font-bold pointer-events-none group-hover:opacity-[0.08] transition-opacity">
              {figure.name.charAt(0)}
            </div>
            
            <h3 className="text-xl font-bold text-stone-900 mb-1 text-center tracking-widest relative z-10">
              {figure.name}
            </h3>
            <p className="text-sm text-stone-500 mb-3 text-center border-b border-dashed border-[#d4c4b7] pb-3 relative z-10">
              {figure.title}
            </p>
            <p className="text-sm text-stone-700 leading-relaxed flex-grow text-justify relative z-10">
              {figure.description}
            </p>
            <div className="mt-5 text-center relative z-10">
              <span className="inline-block px-4 py-1.5 border border-[#8b2626] text-[#8b2626] group-hover:bg-[#8b2626] group-hover:text-[#fbf8f1] transition-colors rounded text-sm font-bold tracking-widest">
                递交拜帖 →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
