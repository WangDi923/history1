"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 重试逻辑
async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 500
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
}

export async function createUserProfile(userId: string, fullName: string, school?: string) {
  const cookieStore = await cookies();

  // 使用 Service Role 来绕过 RLS
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Writing cookies may fail
          }
        },
      },
    }
  );

  // 使用重试机制，因为用户在 auth.users 中的创建可能需要时间
  await retryAsync(async () => {
    const { error } = await supabaseAdmin.from("profiles").insert([
      {
        id: userId,
        full_name: fullName,
        school: school || null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      // 如果是外键约束错误，重试；否则直接抛出
      if (error.code === "23503") {
        // Foreign key violation - user not yet in auth.users
        throw new Error("User not yet ready in auth.users");
      }
      throw new Error(error.message);
    }
  }, 3, 500);
}
