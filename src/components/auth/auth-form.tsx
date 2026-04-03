"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createUserProfile } from "@/lib/supabase/actions";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);

    try {
      if (mode === "register") {
        // 注册流程
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
          return;
        }

        // 使用 Server Action 创建用户档案
        if (authData.user) {
          try {
            await createUserProfile(authData.user.id, fullName, school);
          } catch (profileErr) {
            setError(profileErr instanceof Error ? profileErr.message : "创建档案失败");
            return;
          }
        }

        setError("注册成功！请检查您的邮箱确认账户。");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        // 登录流程
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        // 检查档案是否存在，如果不存在则创建
        if (data.user) {
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", data.user.id)
            .maybeSingle();

          if (!existingProfile) {
            try {
              await createUserProfile(data.user.id, email.split("@")[0]);
            } catch (profileErr) {
              console.error("档案创建失败:", profileErr);
              // 不阻止登录流程
            }
          }
        }

        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {mode === "register" && (
        <div className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-base font-bold text-stone-800 mb-1.5 tracking-wide">
              尊呼姓名
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#f4ebe1] border-2 border-[#d4c4b7] rounded text-stone-900 focus:outline-none focus:border-[#8b2626] focus:ring-1 focus:ring-[#8b2626] transition-colors placeholder-[#a89f91]"
              placeholder="请输入真实姓名"
            />
          </div>
          <div>
            <label htmlFor="school" className="block text-base font-bold text-stone-800 mb-1.5 tracking-wide">
              所在书院
            </label>
            <input
              id="school"
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-4 py-3 bg-[#f4ebe1] border-2 border-[#d4c4b7] rounded text-stone-900 focus:outline-none focus:border-[#8b2626] focus:ring-1 focus:ring-[#8b2626] transition-colors placeholder-[#a89f91]"
              placeholder="如：XX大学/中学"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-base font-bold text-stone-800 mb-1.5 tracking-wide">
          飞鸽传书 (邮箱)
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-4 py-3 bg-[#f4ebe1] border-2 border-[#d4c4b7] rounded text-stone-900 focus:outline-none focus:border-[#8b2626] focus:ring-1 focus:ring-[#8b2626] transition-colors placeholder-[#a89f91]"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-base font-bold text-stone-800 mb-1.5 tracking-wide">
          通关符印 (密码)
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 bg-[#f4ebe1] border-2 border-[#d4c4b7] rounded text-stone-900 focus:outline-none focus:border-[#8b2626] focus:ring-1 focus:ring-[#8b2626] transition-colors placeholder-[#a89f91]"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div
          className={`p-4 rounded border-l-4 ${
            error.includes("成功")
              ? "bg-[#eaf1ea] text-[#2c4c3b] border-[#4b8a69]"
              : "bg-[#fbe8e8] text-[#8b2626] border-[#8b2626]"
          } shadow-sm font-medium tracking-wide`}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3.5 mt-4 bg-[#8b2626] text-[#fbf8f1] rounded font-bold text-lg hover:bg-[#701e1e] active:translate-y-1 shadow-[4px_4px_0px_rgba(139,38,38,0.2)] active:shadow-none disabled:opacity-50 disabled:cursor-wait transition-all duration-200"
      >
        {loading ? "飞鸽正在传书..." : mode === "login" ? "叩门登卷" : "金榜题名"}
      </button>
    </form>
  );
}
