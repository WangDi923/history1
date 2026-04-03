import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#f4ebe1] text-stone-800 font-serif bg-[radial-gradient(#e5d6c3_1px,transparent_1px)] [background-size:20px_20px] flex flex-col">
      {/* 古典风导航栏 */}
      <nav className="bg-[#fbf8f1]/90 backdrop-blur-md border-b-2 border-[#8b2626]/20 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-stone-900 tracking-wider">
            <span className="text-[#8b2626]">AI</span> 史学书斋
          </h1>
          <div className="space-x-4">
            {user ? (
              <Link href="/dashboard" className="px-5 py-2 bg-stone-800 text-[#fbf8f1] rounded font-medium hover:bg-stone-700 transition shadow-sm">
                进入编年史 (仪表板)
              </Link>
            ) : null}
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col justify-center text-center">
        <div className="space-y-8 relative">
          
          {/* 标题 */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-widest drop-shadow-sm">
              AI 历史助教
            </h2>
            <div className="w-24 h-1 bg-[#8b2626] mx-auto opacity-80"></div>
            <p className="text-lg text-stone-700 max-w-2xl mx-auto leading-relaxed">
              在浩瀚史海中，为您掌灯。<br/>
              帮助历史教师轻松梳理脉络，一键生成戏剧脚本，跨越千年与先贤论道，重历波澜壮阔的世界版图。
            </p>
          </div>

          {/* CTA 按钮 */}
          <div className="flex gap-4 justify-center pt-2">
            {user ? (
              <Link
                href="/dashboard"
                className="px-8 py-2.5 bg-[#8b2626] text-[#fbf8f1] rounded shadow-lg shadow-[#8b2626]/20 font-bold text-base hover:bg-[#701e1e] hover:-translate-y-0.5 transition-all duration-300"
              >
                开启览史之旅
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="px-8 py-2.5 bg-[#8b2626] text-[#fbf8f1] rounded shadow-[3px_3px_0px_rgba(0,0,0,0.2)] font-bold text-base hover:bg-[#701e1e] active:translate-y-1 active:shadow-none transition-all duration-200"
                >
                  执笔注册
                </Link>
                <Link
                  href="/auth/login"
                  className="px-8 py-2.5 bg-[#fbf8f1] text-[#8b2626] border-2 border-[#8b2626] rounded shadow-[3px_3px_0px_rgba(139,38,38,0.2)] font-bold text-base hover:bg-[#f4ebe1] active:translate-y-1 active:shadow-none transition-all duration-200"
                >
                  阅卷登录
                </Link>
              </>
            )}
          </div>

          {/* 功能卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: "📜", title: "史剧编演", desc: "基于真实史料，一键生成跌宕起伏的历史舞台剧脚本，令课堂焕发光彩。" },
              { icon: "🕯️", title: "跨世对话", desc: "打破时空壁垒，与千古风流人物切磋畅谈，深度剖析历史决策。" },
              { icon: "🗺️", title: "沙盘推演", desc: "动态时间线结合世界地图，沉浸式重温帝国的兴衰与文明的交融。" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-[#fbf8f1] border border-[#d4c4b7] rounded shadow-[4px_4px_0px_rgba(139,38,38,0.1)] p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="text-3xl mb-3 opacity-90">{feature.icon}</div>
                <h3 className="text-lg font-bold text-stone-900 mb-2 tracking-wide">{feature.title}</h3>
                <div className="w-10 h-0.5 bg-[#8b2626]/50 mx-auto mb-3"></div>
                <p className="text-stone-700 leading-relaxed text-justify text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
