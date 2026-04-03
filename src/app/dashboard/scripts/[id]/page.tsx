import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import Link from "next/link";
import { ScriptDisplay } from "@/components/scripts/script-display";

export default async function ScriptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: script, error } = await supabase
    .from("scripts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !script) {
    redirect("/dashboard/scripts");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900 hover:text-blue-600">
              AI History Assistant
            </Link>
            <div className="flex gap-6">
              <Link href="/dashboard/scripts" className="text-blue-600 font-medium">
                脚本
              </Link>
              <Link href="/dashboard/chats" className="text-gray-600 hover:text-gray-900">
                聊天
              </Link>
              <Link href="/dashboard/timeline" className="text-gray-600 hover:text-gray-900">
                地图
              </Link>
              <Link href="/dashboard/library" className="text-gray-600 hover:text-gray-900">
                资源库
              </Link>
            </div>
          </div>
          <SignOutButton />
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 返回按钮 */}
        <Link href="/dashboard/scripts" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
          ← 返回脚本列表
        </Link>

        {/* 脚本元数据 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{script.event_name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">教学目标</p>
              <p className="text-gray-900">{script.teaching_objective}</p>
            </div>
            {script.grade_level && (
              <div>
                <p className="text-sm text-gray-600 font-medium">年级</p>
                <p className="text-gray-900">{script.grade_level}</p>
              </div>
            )}
            {script.duration_minutes && (
              <div>
                <p className="text-sm text-gray-600 font-medium">课时</p>
                <p className="text-gray-900">{script.duration_minutes} 分钟</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 font-medium">生成时间</p>
              <p className="text-gray-900">
                {new Date(script.created_at).toLocaleDateString("zh-CN")}
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => {
                // 复制到剪贴板
                navigator.clipboard.writeText(script.content);
                alert("已复制到剪贴板");
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              复制内容
            </button>
          </div>
        </div>

        {/* 脚本内容 */}
        <ScriptDisplay
          content={script.content}
          title="脚本内容"
        />
      </main>
    </div>
  );
}
