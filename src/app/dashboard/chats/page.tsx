"use client";

import { useState, useEffect, useRef } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import Link from "next/link";
import FigureSelector from "@/components/chats/figure-selector";
import FigureChatsComponent from "@/components/chats/figure-chat-interface";
import CustomFigureInput from "@/components/chats/custom-figure-input";
import { Loader2, ArrowLeft, Plus } from "lucide-react";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

interface Chat {
  id: string;
  figure_name: string;
  figure_image_url?: string | null;
  title: string;
  created_at: string;
}

export default function ChatsPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedFigure, setSelectedFigure] = useState<string | null>(null);
  const [selectedFigureImage, setSelectedFigureImage] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "preset" | "custom">("list");
  const [fromLibrary, setFromLibrary] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Use ref to prevent double-initialization in React 18 strict mode
    if (initializedRef.current) return;
    initializedRef.current = true;

    fetchUserChats();
    
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get('id');
      const figure = params.get('figure');
      if (urlId) {
        setFromLibrary(true);
        handleLoadChat(urlId);
      } else if (figure) {
        setFromLibrary(false);
        handleSelectFigure(figure);
      }
    }
  }, []);

  const fetchUserChats = async () => {
    try {
      const response = await fetch("/api/chats/list");
      if (!response.ok) throw new Error("Failed to fetch chats");

      const data = await response.json();
      setUserChats(data.chats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectFigure = async (figureName: string) => {
    setIsCreatingChat(true);
    setError(null);

    try {
      const response = await fetch("/api/chats/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          figureName,
          title: `与${figureName}的对话`,
          generateImage: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const data = await response.json();
      setSelectedChatId(data.chatId);
      setSelectedFigure(figureName);
      setSelectedFigureImage(data.chat?.figure_image_url);
      setChatMessages([]);
      fetchUserChats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create chat");
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleCreateCustomChat = async (figureName: string, description: string, generateImage: boolean) => {
    setIsCreatingChat(true);
    setError(null);

    try {
      const response = await fetch("/api/chats/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          figureName,
          figureDescription: description,
          title: `与${figureName}的对话`,
          generateImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const data = await response.json();
      setSelectedChatId(data.chatId);
      setSelectedFigure(figureName);
      setSelectedFigureImage(data.chat?.figure_image_url);
      setChatMessages([]);
      fetchUserChats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create chat");
      throw err;
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleLoadChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`);
      if (!response.ok) throw new Error("Failed to load chat");

      const data = await response.json();
      setSelectedChatId(chatId);
      setSelectedFigure(data.chat.figure_name);
      setSelectedFigureImage(data.chat.figure_image_url);
      setChatMessages(data.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat");
    }
  };

  const handleDeleteChat = () => {
    setSelectedChatId(null);
    setSelectedFigure(null);
    setSelectedFigureImage(null);
    setChatMessages([]);
    fetchUserChats();
  };

  return (
    <div className="min-h-screen bg-[#fbf8f1] bg-[radial-gradient(#d4c4b7_1px,transparent_1px)] [background-size:20px_20px] font-serif">
      {/* 导航栏 */}
      <nav className="bg-[#f4ebe1] border-b-2 border-[#8b2626]/20 shadow-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold text-[#8b2626] tracking-widest flex items-center gap-2">
              <span className="w-8 h-8 rounded-full border-2 border-[#8b2626] flex items-center justify-center text-sm">史</span>
              史堂书斋
            </Link>
            <div className="flex gap-6">
              <Link href="/dashboard/scripts" className="text-stone-600 hover:text-[#8b2626] transition-colors">
                旧卷
              </Link>
              <Link href="/dashboard/chats" className="text-[#8b2626] font-bold border-b-2 border-[#8b2626] pb-1">
                对谈
              </Link>
              <Link href="/dashboard/timeline" className="text-stone-600 hover:text-[#8b2626] transition-colors">
                图鉴
              </Link>
              <Link href="/dashboard/library" className="text-stone-600 hover:text-[#8b2626] transition-colors">
                藏书
              </Link>
            </div>
          </div>
          <SignOutButton />
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {selectedChatId && selectedFigure ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <button
                onClick={() => {
                  setSelectedChatId(null);
                  setSelectedFigure(null);
                  setSelectedFigureImage(null);
                  setChatMessages([]);
                }}
                className="flex items-center gap-2 text-[#8b2626] hover:text-red-800 font-bold transition-colors tracking-widest"
              >
                <ArrowLeft size={20} />
                返回殿堂旧友
              </button>
              {fromLibrary && (
                <Link href="/dashboard/library" className="group flex items-center gap-2 text-[#8b2626] hover:text-red-800 font-bold transition-colors border border-[#8b2626] px-3 py-1.5 rounded tracking-widest hover:bg-[#8b2626] hover:text-[#fbf8f1] shadow-sm">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  折返藏书阁
                </Link>
              )}
            </div>

            <div className="h-[calc(100vh-14rem)] -mx-4">
              <FigureChatsComponent
                chatId={selectedChatId}
                figureName={selectedFigure}
                figureImageUrl={selectedFigureImage}
                initialMessages={chatMessages}
                onDeleteChat={handleDeleteChat}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 左侧: 历史聊天列表 */}
            <div>
              <div className="bg-[#f4ebe1] rounded shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-2 border-[#8b2626]/20 p-6 sticky top-20 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]">
                <div className="flex items-center justify-between mb-4 border-b-2 border-[#8b2626]/10 pb-2">
                  <h3 className="text-xl font-bold text-stone-800 tracking-widest">昔日重现</h3>
                  <button
                    onClick={() => setViewMode("custom")}
                    className="p-1 hover:bg-[#8b2626]/10 rounded-lg transition"
                    title="寻访新友"
                  >
                    <Plus size={20} className="text-[#8b2626]" />
                  </button>
                </div>
                {userChats.length === 0 ? (
                  <p className="text-stone-600 text-sm tracking-widest py-4 text-center">
                    青灯黄卷，尚无对谈。<br />请择一先贤开始论道。
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                    {userChats.map((chat) => (
                      <div
                        key={chat.id}
                        className="flex gap-2 items-start"
                      >
                        {chat.figure_image_url && (
                          <div className="w-10 h-10 flex-shrink-0 rounded-full border-2 border-[#8b2626]/20 overflow-hidden mt-1 shadow-inner">
                            <img
                              src={chat.figure_image_url}
                              alt={chat.figure_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <button
                          onClick={() => handleLoadChat(chat.id)}
                          className="flex-1 text-left p-2 hover:bg-[#f4ebe1]/50 rounded-lg border border-transparent hover:border-[#8b2626]/30 transition"
                        >
                          <p className="font-bold text-stone-800 truncate text-base tracking-widest">
                            {chat.title}
                          </p>
                          <p className="text-xs text-stone-500 mt-1 font-serif">
                            {new Date(chat.created_at).toLocaleDateString("zh-CN")}
                          </p>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 右侧: 历史人物选择 */}
            <div className="lg:col-span-3">
              {isCreatingChat ? (
                <div className="flex items-center justify-center h-[500px] bg-[#f4ebe1]/50 rounded shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-2 border-[#8b2626]/20 relative overflow-hidden">
                  <div className="text-center z-10">
                    <Loader2 className="animate-spin mx-auto mb-6 text-[#8b2626]" size={40} />
                    <p className="text-stone-600 tracking-widest text-lg">正在唤醒历史之灵...</p>
                  </div>
                </div>
              ) : viewMode === "custom" ? (
                <div className="space-y-6">
                  <div className="mb-6">
                    <button
                      onClick={() => setViewMode("list")}
                      className="text-[#8b2626] hover:text-red-800 font-bold flex items-center gap-2 mb-6 tracking-widest transition-colors"
                    >
                      <ArrowLeft size={20} />
                      返回殿堂旧友
                    </button>
                    <CustomFigureInput
                      onCreateChat={handleCreateCustomChat}
                      isLoading={isCreatingChat}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setViewMode("custom")}
                      className="px-6 py-2 border-2 border-[#8b2626] text-[#8b2626] rounded hover:bg-[#8b2626] hover:text-[#f4ebe1] font-bold flex items-center gap-2 transition-colors tracking-widest shadow-sm"
                    >
                      <Plus size={20} />
                      寻访其他先贤
                    </button>
                  </div>
                  <FigureSelector
                    onSelectFigure={handleSelectFigure}
                    isLoading={isCreatingChat}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
