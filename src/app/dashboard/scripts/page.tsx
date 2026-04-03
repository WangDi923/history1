'use client';

import { useEffect, useState } from 'react';
import { SignOutButton } from "@/components/auth/sign-out-button";
import Link from "next/link";
import { ScriptGeneratorForm } from "@/components/scripts/script-generator-form";
import { ScriptDisplay } from "@/components/scripts/script-display";
import { ArrowLeft, ChevronDown } from "lucide-react";

interface Script {
  id: string;
  event_name: string;
  teaching_objective: string;
  grade_level: string | null;
  duration_minutes: number | null;
  content: string;
  created_at: string;
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [fromLibrary, setFromLibrary] = useState(false);
  const [openDownloadMenu, setOpenDownloadMenu] = useState(false);

  const sanitizeFileName = (name: string) => {
    return name
      .replace(/[\\/:*?"<>|]/g, "_")
      .replace(/\s+/g, "_")
      .slice(0, 80);
  };

  const handleDownloadScript = (script: Script, format: "md" | "txt") => {
    const date = new Date(script.created_at).toLocaleDateString("zh-CN");
    const plainText = [
      `${script.event_name}`,
      "",
      `创建日期: ${date}`,
      `教学目标: ${script.teaching_objective}`,
      `年级: ${script.grade_level ?? "未填写"}`,
      `时长(分钟): ${script.duration_minutes ?? "未填写"}`,
      "",
      "================================",
      "",
      script.content,
      "",
    ].join("\n");

    const markdownText = [
      `# ${script.event_name}`,
      "",
      `- 创建日期: ${date}`,
      `- 教学目标: ${script.teaching_objective}`,
      `- 年级: ${script.grade_level ?? "未填写"}`,
      `- 时长(分钟): ${script.duration_minutes ?? "未填写"}`,
      "",
      "---",
      "",
      script.content,
      "",
    ].join("\n");

    const fileContent = format === "txt" ? plainText : markdownText;
    const mimeType = format === "txt" ? "text/plain;charset=utf-8" : "text/markdown;charset=utf-8";
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitizeFileName(script.event_name)}_${date}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const response = await fetch('/api/scripts');
      if (response.ok) {
        const data = await response.json();
        const loadedScripts = data.scripts || [];
        setScripts(loadedScripts);
        
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const urlId = params.get('id');
          if (urlId) {              setFromLibrary(true);            const scriptToSelect = loadedScripts.find((s: Script) => s.id === urlId);
            if (scriptToSelect) {
              setSelectedScript(scriptToSelect);
              setShowForm(false);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch scripts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScriptGenerated = (scriptId: string, content: string) => {
    fetchScripts();
    setShowForm(false);
    // 顯示最新生成的劇本
    setTimeout(() => {
      const latestScript = scripts.find(s => s.id === scriptId);
      if (latestScript) {
        setSelectedScript(latestScript);
      }
    }, 500);
  };

  const handleDeleteScript = async (scriptId: string) => {
    if (confirm('確定要刪除這個劇本嗎？')) {
      try {
        const response = await fetch(`/api/scripts/${scriptId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setScripts(scripts.filter(s => s.id !== scriptId));
          if (selectedScript?.id === scriptId) {
            setSelectedScript(null);
          }
        }
      } catch (error) {
        console.error('Failed to delete script:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf8f1] bg-[radial-gradient(#d4c4b7_1px,transparent_1px)] [background-size:20px_20px] font-serif">
      {/* 導航欄 */}
      <nav className="bg-[#f4ebe1] border-b-2 border-[#8b2626]/20 shadow-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold text-[#8b2626] tracking-widest flex items-center gap-2">
              <span className="w-8 h-8 rounded-full border-2 border-[#8b2626] flex items-center justify-center text-sm">史</span>
              史堂书斋
            </Link>
            <div className="flex gap-6">
              <Link href="/dashboard/scripts" className="text-[#8b2626] font-bold border-b-2 border-[#8b2626] pb-1">
                旧卷
              </Link>
              <Link href="/dashboard/chats" className="text-stone-600 hover:text-[#8b2626] transition-colors">
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

      {/* 主內容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-8 bg-[#8b2626] mr-4"></div>
            <h1 className="text-3xl font-bold text-stone-800 tracking-widest">歷史劇本工作室</h1>
          </div>
          {fromLibrary && (
            <Link href="/dashboard/library" className="group flex items-center gap-2 text-[#8b2626] hover:text-red-800 font-bold transition-colors tracking-widest border border-[#8b2626] px-4 py-2 rounded">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              折返藏書閣
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：表單和列表 */}
          <div className="lg:col-span-1 space-y-6">
            {showForm && <ScriptGeneratorForm onGenerate={handleScriptGenerated} />}

            {/* 劇本列表 */}
            <div className="bg-[#f4ebe1] rounded shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-2 border-[#8b2626]/20 overflow-hidden">
              <div className="px-6 py-4 border-b-2 border-[#8b2626]/20 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]">
                <h2 className="text-xl font-bold text-stone-800 tracking-wider">我的舊卷</h2>
                <p className="text-sm text-stone-600 mt-1">共收錄 {scripts.length} 卷</p>
              </div>

              {loading ? (
                <div className="px-6 py-8 text-center text-stone-500 tracking-widest">研墨中...</div>
              ) : scripts.length > 0 ? (
                <div className="divide-y divide-[#8b2626]/10 max-h-[600px] overflow-y-auto custom-scrollbar bg-white/50">
                  {scripts.map((script) => (
                    <div
                      key={script.id}
                      className={`px-6 py-4 cursor-pointer transition-all duration-300 ${
                        selectedScript?.id === script.id
                          ? 'bg-[#f4ebe1] border-l-4 border-[#8b2626] shadow-inner'
                          : 'hover:bg-[#f4ebe1]/50'
                      }`}
                      onClick={() => setSelectedScript(script)}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-bold text-stone-800 flex-1 truncate text-lg">
                          {script.event_name}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-500 mb-2 font-mono">
                        {new Date(script.created_at).toLocaleDateString('zh-CN')}
                      </p>
                      <p className="text-sm text-stone-600 line-clamp-2 mb-3 leading-relaxed">
                        {script.teaching_objective}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteScript(script.id);
                        }}
                        className="text-sm text-[#8b2626] hover:text-red-800 hover:underline decoration-1 underline-offset-4"
                      >
                        焚毀此卷
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-12 text-center text-stone-500">
                  <p className="mb-4 tracking-widest">書架空空如也，尚未成書</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-sm px-4 py-2 border border-[#8b2626] text-[#8b2626] rounded hover:bg-[#8b2626] hover:text-[#f4ebe1] transition-colors tracking-widest"
                  >
                    提筆撰寫第一卷
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 右側：劇本展示 */}
          <div className="lg:col-span-2">
            {selectedScript && (
              <div className="fixed top-56 right-8 z-20">
                <div className="relative inline-block">
                  <button
                    onClick={() => setOpenDownloadMenu(!openDownloadMenu)}
                    className="text-sm text-stone-700 hover:text-stone-900 transition-colors flex items-center gap-1 px-3 py-2 rounded border border-stone-300 hover:border-stone-500 bg-stone-100 hover:bg-stone-200"
                  >
                    <span>下載劇本</span>
                    <ChevronDown size={14} className={`transition-transform ${openDownloadMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {openDownloadMenu && (
                    <div className="fixed inset-0 z-10" onClick={() => setOpenDownloadMenu(false)} />
                  )}
                  {openDownloadMenu && (
                    <div className="absolute top-full mt-1 right-0 bg-white border border-stone-300 rounded shadow-lg z-30 min-w-max"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadScript(selectedScript, "md");
                          setOpenDownloadMenu(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-left text-stone-700 hover:bg-stone-100 transition-colors whitespace-nowrap"
                      >
                        .md格式
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadScript(selectedScript, "txt");
                          setOpenDownloadMenu(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-left text-stone-700 hover:bg-stone-100 transition-colors border-t border-stone-200 whitespace-nowrap"
                      >
                        .txt格式
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {selectedScript ? (
              <ScriptDisplay
                content={selectedScript.content}
                title={`${selectedScript.event_name} - 卷宗`}
              />
            ) : (
              <div className="bg-[#f4ebe1] rounded shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-2 border-[#8b2626]/20 p-12 text-center bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-[#8b2626]/30 flex items-center justify-center mb-6">
                  <span className="text-2xl text-[#8b2626]/50">卷</span>
                </div>
                <p className="text-stone-600 mb-4 tracking-widest text-lg">請於左側書架抽取一卷以閱覽</p>
                <p className="text-sm text-stone-400 tracking-widest">或研墨提筆，新撰一卷</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
