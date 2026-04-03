import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 获取用户档案
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const featureCards = [
    {
      href: "/dashboard/scripts",
      title: "史剧编演",
      badge: "剧本工坊",
      summary: "围绕史实、教学目标与课堂时长，快速生成可直接上课使用的历史舞台剧脚本。",
      points: ["分幕结构", "人物对白", "课堂提问"],
      tone: "from-[#8b2626]/15 via-[#c58a5f]/10 to-[#fbf8f1]",
    },
    {
      href: "/dashboard/chats",
      title: "先贤论道",
      badge: "人物对话",
      summary: "与历史人物展开沉浸式问答，兼顾人物口吻、历史背景和课堂启发。",
      points: ["人格化口吻", "史实回应", "追问延展"],
      tone: "from-[#7b6a45]/15 via-[#d8c69a]/10 to-[#fbf8f1]",
    },
    {
      href: "/dashboard/timeline",
      title: "舆图探查",
      badge: "时空舆图",
      summary: "在时间轴与地图之间切换，观察疆域、路线与关键事件的空间变化。",
      points: ["帝国版图", "路线标记", "年份切换"],
      tone: "from-[#2f5f7f]/15 via-[#91bdd4]/10 to-[#fbf8f1]",
    },
    {
      href: "/dashboard/library",
      title: "万象典藏",
      badge: "内容仓库",
      summary: "统一收纳生成过的脚本、对话记录与教学材料，方便回看、复用和整理。",
      points: ["按主题归档", "快速检索", "一键复用"],
      tone: "from-[#4f6b4d]/15 via-[#b4cc9e]/10 to-[#fbf8f1]",
    },
    {
      href: "/dashboard/settings",
      title: "场务调校",
      badge: "系统配置",
      summary: "调整个人资料、偏好参数与使用习惯，让整个书斋更贴合你的授课节奏。",
      points: ["资料管理", "偏好设置", "账号维护"],
      tone: "from-[#7a4f39]/15 via-[#e0b08f]/10 to-[#fbf8f1]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4ebe1] text-stone-800 font-serif bg-[radial-gradient(#e5d6c3_1px,transparent_1px)] [background-size:20px_20px]">
      {/* 导航栏 */}
      <nav className="bg-[#fbf8f1] shadow-sm border-b-2 border-[#8b2626]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-wider">
              <span className="text-[#8b2626]">AI</span> 史学书斋
            </h1>
          </div>
          <SignOutButton />
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 用户信息卡片 */}
        <div className="bg-[#fbf8f1] border-2 border-double border-[#d4c4b7] rounded shadow-[4px_4px_0px_rgba(139,38,38,0.1)] p-8 mb-8 relative">
          <div className="absolute top-0 right-8 w-8 h-12 bg-[#8b2626] flex items-center justify-center -translate-y-2 rounded-b shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
            <span className="text-[#fbf8f1] font-bold text-xs font-serif writing-vertical-rl">令</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#8b2626] block"></span>
            欢迎回来，馆长
          </h2>
          <div className="space-y-3 text-stone-700 font-medium">
            <p className="flex items-center gap-2">
              <span className="text-[#8b2626]">名讳:</span> {profile?.full_name || "未设置"}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#8b2626]">飞鸽:</span> {user.email}
            </p>
            {profile?.school && (
              <p className="flex items-center gap-2">
                <span className="text-[#8b2626]">学堂:</span> {profile.school}
              </p>
            )}
          </div>
        </div>

        {/* 功能网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
          {featureCards.map((card) => (
            <Link key={card.title} href={card.href} className="group block h-full">
              <div className={`relative h-full overflow-hidden rounded-2xl border border-[#d4c4b7] bg-gradient-to-br ${card.tone} p-4 lg:p-5 shadow-[3px_3px_0px_rgba(139,38,38,0.08)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[6px_8px_0px_rgba(139,38,38,0.15)]`}>
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#8b2626]/60 to-transparent"></div>
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/20 blur-2xl"></div>

                <div className="relative flex items-start justify-between gap-3">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#8b2626]/20 bg-[#fbf8f1]/80 px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-[#8b2626] uppercase">
                      {card.badge}
                    </div>
                    <div>
                      <h3 className="text-lg lg:text-xl font-black text-stone-900 tracking-wide">{card.title}</h3>
                    </div>
                  </div>

                  <div className="rounded-full border border-[#8b2626]/20 bg-[#fbf8f1]/90 px-2.5 py-1 text-[10px] font-semibold text-stone-700 shadow-sm">
                    进入
                  </div>
                </div>

                <p className="relative mt-4 text-xs lg:text-sm leading-6 lg:leading-7 text-stone-700">
                  {card.summary}
                </p>

                <div className="relative mt-4 flex flex-wrap gap-2">
                  {card.points.map((point) => (
                    <span
                      key={point}
                      className="rounded-full border border-[#d4c4b7] bg-[#fbf8f1]/85 px-2.5 py-1 text-[10px] lg:text-xs font-medium text-stone-700 shadow-sm"
                    >
                      {point}
                    </span>
                  ))}
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* 快速链接 */}
        <div className="mt-12 bg-[#fbf8f1] border border-[#8b2626]/40 rounded-lg p-6 relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#8b2626]"></div>
          <h3 className="text-lg font-black text-stone-900 mb-4 ml-2">研史引路</h3>
          <ul className="space-y-3 text-stone-800 ml-2">
            <li>
              一、<Link href="/dashboard/scripts" className="font-medium text-[#8b2626] hover:underline underline-offset-4 decoration-[#8b2626]/40">创建您的第一个历史脚本</Link>
            </li>
            <li>
              二、<Link href="/dashboard/chats" className="font-medium text-[#8b2626] hover:underline underline-offset-4 decoration-[#8b2626]/40">与历史人物对话</Link>
            </li>
            <li>
              三、<Link href="/dashboard/timeline" className="font-medium text-[#8b2626] hover:underline underline-offset-4 decoration-[#8b2626]/40">探索时间线地图</Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
