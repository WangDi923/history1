"use client";

import React, { useState } from "react";
import { Loader2, Upload } from "lucide-react";

interface CustomFigureInputProps {
  onCreateChat: (figureName: string, description: string, generateImage: boolean) => Promise<void>;
  isLoading?: boolean;
}

export default function CustomFigureInput({
  onCreateChat,
  isLoading = false,
}: CustomFigureInputProps) {
  const [figureName, setFigureName] = useState("");
  const [description, setDescription] = useState("");
  const [generateImage, setGenerateImage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!figureName.trim()) {
      setError("请输入历史人物名称");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateChat(figureName, description, generateImage);
      // Reset form
      setFigureName("");
      setDescription("");
      setGenerateImage(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fbf8f1] border-2 border-double border-[#d4c4b7] rounded shadow-[8px_8px_0px_rgba(139,38,38,0.1)] p-8 max-w-2xl relative">
      <div className="mb-8 border-b-2 border-dashed border-[#d4c4b7] pb-6">
        <h2 className="text-2xl font-black text-stone-900 mb-3 tracking-widest flex items-center gap-3">
          <span className="w-2 h-6 bg-[#8b2626] inline-block"></span>
          寻访先贤
        </h2>
        <p className="text-stone-600 font-medium">
          写下古人之大名，再现昔日风流，与之煮酒论史。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 历史人物名称 */}
        <div>
          <label className="block text-base font-bold text-stone-800 mb-2 tracking-wide">
            尊呼名讳 <span className="text-[#8b2626]">*</span>
          </label>
          <input
            type="text"
            value={figureName}
            onChange={(e) => setFigureName(e.target.value)}
            placeholder="例如：拿破仑、武则天、李白..."
            disabled={isSubmitting || isLoading}
            className="w-full px-4 py-3 bg-[#f4ebe1] border-2 border-[#d4c4b7] rounded text-stone-900 focus:outline-none focus:border-[#8b2626] focus:ring-1 focus:ring-[#8b2626] transition-colors placeholder-[#a89f91] disabled:opacity-50"
          />
        </div>

        {/* 人物描述 */}
        <div>
          <label className="block text-base font-bold text-stone-800 mb-2 tracking-wide">
            生平略注（选填）
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简述其功过事迹以辅造化。如：盛唐豪放派诗人，“诗仙”，好饮酒..."
            rows={3}
            disabled={isSubmitting || isLoading}
            className="w-full px-4 py-3 bg-[#f4ebe1] border-2 border-[#d4c4b7] rounded text-stone-900 focus:outline-none focus:border-[#8b2626] focus:ring-1 focus:ring-[#8b2626] transition-colors placeholder-[#a89f91] resize-none disabled:opacity-50"
          />
        </div>

        {/* 生成图片选项 */}
        <div className="bg-[#eadecc]/40 border border-[#d4c4b7] p-4 rounded relative overflow-hidden">
          <div className="absolute right-0 bottom-0 text-[#8b2626] opacity-[0.03] text-6xl leading-none font-serif font-bold pointer-events-none">画</div>
          <label className="flex items-center gap-3 cursor-pointer relative z-10">
            <input
              type="checkbox"
              checked={generateImage}
              onChange={(e) => setGenerateImage(e.target.checked)}
              disabled={isSubmitting || isLoading}
              className="w-4 h-4 text-[#8b2626] rounded border-[#d4c4b7] focus:ring-[#8b2626] focus:ring-offset-[#eadecc]"
            />
            <span className="text-stone-800 font-bold tracking-wide">
              <Upload size={16} className="inline mr-2 text-[#8b2626]" />
              丹青绘影（生成肖像）
            </span>
          </label>
          <p className="text-sm text-stone-600 ml-7 mt-1.5 relative z-10">
            基于名讳与生平，交由造化妙手绘其真容（初次现世需候数息）
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-[#fbe8e8] border border-[#8b2626] text-[#8b2626] px-4 py-3 rounded shadow-sm font-medium tracking-wide">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading || !figureName.trim()}
          className="w-full bg-[#8b2626] text-[#fbf8f1] py-3.5 rounded font-bold text-lg hover:bg-[#701e1e] active:translate-y-1 shadow-[4px_4px_0px_rgba(139,38,38,0.2)] active:shadow-none disabled:opacity-50 disabled:cursor-wait transition-all duration-200 flex items-center justify-center gap-2 mt-4"
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              创建中...
            </>
          ) : (
            "开始对话"
          )}
        </button>
      </form>
    </div>
  );
}
