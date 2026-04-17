import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import Link from "next/link";
import TimelineMapEmbed from "@/components/timeline/timeline-map-embed";

export default async function TimelinePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

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
              <Link href="/dashboard/timeline" className="text-[#8b2626] font-bold border-b-2 border-[#8b2626] pb-1">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="w-2 h-8 bg-[#8b2626] mr-4"></div>
                <h1 className="text-3xl font-bold text-stone-800 tracking-widest">万国坤舆图鉴</h1>
              </div>
              <p className="text-stone-600 tracking-wide mt-2 pl-6">指点江山，阅历千古：拖动轴衡探秘列国疆域流转与朝代更迭。</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/twha5/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded border-2 border-[#8b2626] px-4 py-2 text-sm font-bold text-[#8b2626] hover:bg-[#8b2626] hover:text-[#f4ebe1] shadow-sm transition-colors tracking-widest"
              >
                卷外展图
              </Link>
            </div>
          </div>

          <div className="rounded border-2 border-[#8b2626]/20 bg-[#f4ebe1]/50 shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-2">
            <div className="rounded border border-[#8b2626]/10 overflow-hidden relative">
              <TimelineMapEmbed />
            </div>
          </div>

          <p className="text-sm text-stone-500 text-center tracking-widest">
            此图源自 twha5 卷宗，现已入库藏：<span className="font-mono bg-stone-200/50 px-1 rounded text-stone-600">/twha5/index.html</span>。
          </p>
        </div>
      </main>
    </div>
  );
}
