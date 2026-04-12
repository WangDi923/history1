"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Loader2, Trash2, Download, ChevronDown } from "lucide-react";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

interface FigureChatsComponentProps {
  chatId: string;
  figureName: string;
  figureImageUrl?: string | null;
  initialMessages?: Message[];
  onDeleteChat?: () => void;
}

export default function FigureChatsComponent({
  chatId,
  figureName,
  figureImageUrl,
  initialMessages = [],
  onDeleteChat,
}: FigureChatsComponentProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openExportMenu, setOpenExportMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [chatId, initialMessages]);

  const sanitizeFileName = (name: string) => {
    return name
      .replace(/[\\/:*?"<>|]/g, "_")
      .replace(/\s+/g, "_")
      .slice(0, 80);
  };

  const formatMessageTime = (createdAt?: string) => {
    if (!createdAt) return "";
    return new Date(createdAt).toLocaleString("zh-CN");
  };

  const buildExportContent = (format: "md" | "txt") => {
    const exportDate = new Date().toLocaleString("zh-CN");
    const title = `与${figureName}的对话`;
    const header =
      format === "md"
        ? [
            `# ${title}`,
            "",
            `- 导出时间: ${exportDate}`,
            `- 消息数量: ${messages.length}`,
            "",
            "---",
            "",
          ]
        : [
            title,
            "",
            `导出时间: ${exportDate}`,
            `消息数量: ${messages.length}`,
            "",
            "================================",
            "",
          ];

    const body = messages.flatMap((message) => {
      const roleLabel = message.role === "user" ? "用户" : figureName;
      const timeLabel = formatMessageTime(message.created_at);

      if (format === "md") {
        return [
          `## ${roleLabel}`,
          timeLabel ? `- 时间: ${timeLabel}` : "",
          "",
          message.content,
          "",
        ].filter(Boolean);
      }

      return [
        `【${roleLabel}】${timeLabel ? ` ${timeLabel}` : ""}`,
        message.content,
        "",
      ];
    });

    return [...header, ...body].join("\n");
  };

  const handleExportChat = (format: "md" | "txt") => {
    const fileContent = buildExportContent(format);
    const mimeType = format === "md" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8";
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitizeFileName(`与${figureName}的对话`)}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setOpenExportMenu(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          message: inputValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      const data = await response.json();

      // 添加用户消息和AI响应
      setMessages((prev) => [
        ...prev,
        { role: "user", content: inputValue },
        { role: "assistant", content: data.assistantResponse },
      ]);

      setInputValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteChat = async () => {
    if (!window.confirm("确定要删除这个聊天吗？")) return;

    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }

      onDeleteChat?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete chat");
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh] bg-[#fbf8f1] border-2 border-double border-[#d4c4b7] rounded shadow-[8px_8px_0px_rgba(139,38,38,0.1)] overflow-hidden relative">
      {/* 顶部标题栏 */}
      <div className="bg-[#eadecc] border-b-2 border-dashed border-[#d4c4b7] p-5 sm:p-6 flex justify-between items-start gap-4 sm:gap-6 relative z-20 shrink-0 sticky top-0">
        <div className="absolute right-4 bottom-[-10px] text-[#8b2626] opacity-[0.03] text-8xl leading-none font-serif font-bold pointer-events-none">谈</div>
        <div className="flex-1 flex gap-4 sm:gap-6 items-start min-w-0 z-10">
          {/* 历史人物图片 */}
          {figureImageUrl && (
            <div className="flex-shrink-0 p-1.5 bg-[#fbf8f1] border border-[#d4c4b7] shadow-sm transform -rotate-2">
              <div className="w-24 sm:w-28 md:w-32 aspect-[3/4] relative overflow-hidden border border-[#d4c4b7]">
                <img
                  src={figureImageUrl}
                  alt={figureName}
                  className="w-full h-full object-cover grayscale-[20%] sepia-[30%]"
                />
              </div>
            </div>
          )}
          {/* 人物信息 */}
          <div className="min-w-0 pt-1 sm:pt-2">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-widest break-words flex items-center gap-3">
              <span className="w-2 h-6 bg-[#8b2626] inline-block"></span>
              {figureName}
            </h2>
            <p className="text-stone-600 font-medium text-sm sm:text-base mt-2 ml-5">昔日重现，跨世对谈</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 z-10">
          <div className="relative">
            <button
              onClick={() => setOpenExportMenu(!openExportMenu)}
              className="p-2 text-stone-500 hover:text-[#8b2626] hover:bg-[#fbf8f1] rounded transition border border-transparent hover:border-[#d4c4b7] flex items-center gap-1"
              title="导出对话"
            >
              <Download size={20} />
              <ChevronDown size={14} className={`transition-transform ${openExportMenu ? "rotate-180" : ""}`} />
            </button>
            {openExportMenu && (
              <div className="fixed inset-0 z-10" onClick={() => setOpenExportMenu(false)} />
            )}
            {openExportMenu && (
              <div className="absolute right-0 top-full mt-2 bg-[#fbf8f1] border border-[#d4c4b7] rounded shadow-lg z-20 min-w-max overflow-hidden">
                <button
                  onClick={() => handleExportChat("md")}
                  className="block w-full px-4 py-2 text-sm text-left text-stone-700 hover:bg-[#f4ebe1] transition-colors whitespace-nowrap"
                >
                  导出为 .md
                </button>
                <button
                  onClick={() => handleExportChat("txt")}
                  className="block w-full px-4 py-2 text-sm text-left text-stone-700 hover:bg-[#f4ebe1] transition-colors border-t border-[#d4c4b7] whitespace-nowrap"
                >
                  导出为 .txt
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleDeleteChat}
            className="p-2 text-stone-500 hover:text-[#8b2626] hover:bg-[#fbf8f1] rounded transition flex-shrink-0 border border-transparent hover:border-[#d4c4b7]"
            title="焚毁绝卷"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="p-6 space-y-6 relative flex flex-col flex-grow">
        {/* 背景纹理 */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5d6c3_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none"></div>
        
        {messages.length === 0 && (
          <div className="flex-grow flex items-center justify-center text-stone-500 relative z-10 py-20">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto border-2 border-[#8b2626] rounded flex items-center justify-center text-[#8b2626] text-2xl font-bold rotate-3 mb-4 opacity-50">
                启
              </div>
              <p className="text-lg font-bold text-stone-700 tracking-widest">煮酒论史</p>
              <p className="text-sm mt-2 font-medium">
                向 {figureName} 叩问沧桑往事
              </p>
            </div>
          </div>
        )}

        <div className="relative z-10 space-y-6 flex-grow">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] lg:max-w-2xl px-5 py-4 ${
                  message.role === "user"
                    ? "bg-[#8b2626] text-[#fbf8f1] rounded font-medium shadow-md shadow-[#8b2626]/20"
                    : "bg-[#f4ebe1] text-stone-800 rounded border border-[#d4c4b7] shadow-sm font-medium leading-relaxed"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#f4ebe1] text-stone-700 px-5 py-4 rounded border border-[#d4c4b7] flex items-center gap-3 shadow-sm">
                <Loader2 size={16} className="animate-spin text-[#8b2626]" />
                <span className="text-sm font-bold tracking-widest">先贤沉思中...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-[#fbe8e8] border border-[#8b2626] text-[#8b2626] px-4 py-3 rounded shadow-sm font-medium tracking-wide">
              <p className="text-sm"><strong>变故:</strong> {error}</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="border-t-2 border-dashed border-[#d4c4b7] bg-[#fbf8f1] p-4 relative z-10 shrink-0 sticky bottom-0">
        <div className="flex gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="奉上您的求问..."
            rows={3}
            disabled={isLoading}
            className="flex-1 p-3 bg-[#f4ebe1] border-2 border-[#d4c4b7] rounded text-stone-900 focus:outline-none focus:border-[#8b2626] focus:ring-1 focus:ring-[#8b2626] transition-colors placeholder-[#a89f91] resize-none disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-[#8b2626] text-[#fbf8f1] px-6 py-3 rounded font-bold text-lg hover:bg-[#701e1e] active:translate-y-1 shadow-[4px_4px_0px_rgba(139,38,38,0.2)] active:shadow-none disabled:opacity-50 disabled:cursor-wait transition-all duration-200 flex items-center justify-center gap-2 self-end h-[76px]"
          >
            {isLoading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <Send size={24} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
