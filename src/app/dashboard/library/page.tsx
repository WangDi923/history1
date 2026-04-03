import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import Link from "next/link";
import { BookOpen, MessageSquare, Clock, ArrowRight } from "lucide-react";

export default async function LibraryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch scripts
  const { data: scripts } = await supabase
    .from("scripts")
    .select("id, event_name, teaching_objective, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch chats
  const { data: chats } = await supabase
    .from("figure_chats")
    .select("id, figure_name, title, figure_image_url, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

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
              <Link href="/dashboard/chats" className="text-stone-600 hover:text-[#8b2626] transition-colors">
                对谈
              </Link>
              <Link href="/dashboard/timeline" className="text-stone-600 hover:text-[#8b2626] transition-colors">
                图鉴
              </Link>
              <Link href="/dashboard/library" className="text-[#8b2626] font-bold border-b-2 border-[#8b2626] pb-1">
                藏书
              </Link>
            </div>
          </div>
          <SignOutButton />
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="space-y-12">
          <div className="flex items-center mb-8">
            <div className="w-2 h-8 bg-[#8b2626] mr-4"></div>
            <h1 className="text-3xl font-bold text-stone-800 tracking-widest">藏书阁</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 剧本旧卷 */}
            <div className="bg-[#f4ebe1] rounded shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-2 border-[#8b2626]/20 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]">
              <div className="px-6 py-4 border-b-2 border-[#8b2626]/20 flex items-center justify-between bg-white/30">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-[#8b2626]" size={24} />
                  <h2 className="text-2xl font-bold text-stone-800 tracking-wider">剧本旧卷</h2>
                </div>
                <span className="text-stone-500 font-serif">收录 {scripts?.length || 0} 卷</span>
              </div>
              
              <div className="p-6">
                {(!scripts || scripts.length === 0) ? (
                  <div className="text-center py-12 text-stone-500">
                    <p className="tracking-widest">书架空空如也，尚未成书</p>
                    <Link href="/dashboard/scripts" className="inline-block mt-4 text-[#8b2626] hover:underline decoration-1 underline-offset-4 tracking-widest">
                      前往拾笔起草 →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                    {scripts.map((script) => (
                      <Link href={`/dashboard/scripts?id=${script.id}`} key={script.id} className="block p-4 border border-[#8b2626]/20 rounded bg-white/40 hover:bg-[#8b2626]/5 hover:border-[#8b2626]/40 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-stone-800 text-lg group-hover:text-[#8b2626] transition-colors line-clamp-1">{script.event_name}</h3>
                          <ArrowRight size={18} className="text-stone-400 group-hover:text-[#8b2626] transition-colors flex-shrink-0 ml-2" />
                        </div>
                        <p className="text-stone-600 text-sm mb-3 line-clamp-2">{script.teaching_objective}</p>
                        <div className="flex items-center text-stone-500 text-xs font-mono">
                          <Clock size={14} className="mr-1" />
                          {new Date(script.created_at).toLocaleDateString('zh-CN')}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 对谈纪要 */}
            <div className="bg-[#f4ebe1] rounded shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-2 border-[#8b2626]/20 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]">
              <div className="px-6 py-4 border-b-2 border-[#8b2626]/20 flex items-center justify-between bg-white/30">
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-[#8b2626]" size={24} />
                  <h2 className="text-2xl font-bold text-stone-800 tracking-wider">名士对谈</h2>
                </div>
                <span className="text-stone-500 font-serif">收录 {chats?.length || 0} 卷</span>
              </div>
              
              <div className="p-6">
                {(!chats || chats.length === 0) ? (
                  <div className="text-center py-12 text-stone-500">
                    <p className="tracking-widest">青灯黄卷，尚无对谈记录</p>
                    <Link href="/dashboard/chats" className="inline-block mt-4 text-[#8b2626] hover:underline decoration-1 underline-offset-4 tracking-widest">
                      前往寻访先贤 →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                    {chats.map((chat) => (
                      <Link href={`/dashboard/chats?id=${chat.id}`} key={chat.id} className="block p-4 border border-[#8b2626]/20 rounded bg-white/40 hover:bg-[#8b2626]/5 hover:border-[#8b2626]/40 transition-colors group">
                        <div className="flex gap-4">
                          {chat.figure_image_url ? (
                            <div className="w-12 h-12 rounded-full border-2 border-[#8b2626]/20 flex-shrink-0 overflow-hidden">
                              <img src={chat.figure_image_url} alt={chat.figure_name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full border-2 border-[#8b2626]/20 flex-shrink-0 bg-stone-200 flex items-center justify-center">
                              <span className="text-[#8b2626] font-bold text-lg">{chat.figure_name?.[0] || '名'}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold text-stone-800 text-lg group-hover:text-[#8b2626] transition-colors truncate">{chat.title || `与${chat.figure_name}的对话`}</h3>
                              <ArrowRight size={18} className="text-stone-400 group-hover:text-[#8b2626] transition-colors flex-shrink-0 ml-2" />
                            </div>
                            <p className="text-stone-600 text-sm mb-2 font-bold">— {chat.figure_name}</p>
                            <div className="flex items-center text-stone-500 text-xs font-mono">
                              <Clock size={14} className="mr-1" />
                              {new Date(chat.created_at).toLocaleDateString('zh-CN')}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
