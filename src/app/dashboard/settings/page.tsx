import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import Link from "next/link";

export default async function SettingsPage() {
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
              <Link href="/dashboard" className="text-stone-600 hover:text-[#8b2626] transition-colors">
                书斋大堂
              </Link>
              <Link href="/dashboard/settings" className="text-[#8b2626] font-bold border-b-2 border-[#8b2626] pb-1">
                雅设
              </Link>
            </div>
          </div>
          <SignOutButton />
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="space-y-8">
          <div className="flex items-center mb-8">
            <div className="w-2 h-8 bg-[#8b2626] mr-4"></div>
            <h1 className="text-3xl font-bold text-stone-800 tracking-widest">文房雅设</h1>
          </div>

          {/* 个人信息 */}
          <div className="bg-[#f4ebe1] rounded shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-2 border-[#8b2626]/20 p-8 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]">
            <h2 className="text-xl font-bold text-stone-800 tracking-widest mb-6 pb-2 border-b border-[#8b2626]/20">籍贯档案</h2>
            <div className="space-y-4 text-stone-700 tracking-wide text-lg">
              <p className="flex items-center">
                <span className="w-24 text-stone-500">信书：</span> 
                <span className="font-medium text-stone-800">{user.email}</span>
              </p>
              <p className="flex items-center">
                <span className="w-24 text-stone-500">名讳：</span> 
                <span className="font-medium text-stone-800">{profile?.full_name || "未留名讳"}</span>
              </p>
              {profile?.school && (
                <p className="flex items-center">
                  <span className="w-24 text-stone-500">书院：</span> 
                  <span className="font-medium text-stone-800">{profile.school}</span>
                </p>
              )}
              <p className="flex items-center">
                <span className="w-24 text-stone-500">结册吉日：</span>{" "}
                <span className="font-medium text-stone-800">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('zh-CN') : "未知"}</span>
              </p>
            </div>
          </div>

          {/* 安全 */}
          <div className="bg-[#f4ebe1] rounded shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-2 border-[#8b2626]/20 p-8 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]">
            <h2 className="text-xl font-bold text-stone-800 tracking-widest mb-6 pb-2 border-b border-[#8b2626]/20">库房私锁</h2>
            <button className="px-6 py-2 border-2 border-[#8b2626] text-[#8b2626] hover:bg-[#8b2626] hover:text-[#f4ebe1] font-bold rounded transition-colors tracking-widest">
              更换秘钥
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
