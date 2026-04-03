import { AuthForm } from "@/components/auth/auth-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4ebe1] text-stone-800 font-serif bg-[radial-gradient(#e5d6c3_1px,transparent_1px)] [background-size:20px_20px] p-6">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-[#8b2626] transition-colors rounded-sm hover:bg-[#eadecc]">
          <ArrowLeft className="w-4 h-4" />
          <span>折返山门</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#fbf8f1] border-2 border-double border-[#d4c4b7] rounded shadow-[8px_8px_0px_rgba(139,38,38,0.1)] p-8 space-y-8 relative">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-2 border-[#8b2626] rounded flex items-center justify-center text-[#8b2626] text-2xl font-bold rotate-3">
            史
          </div>
          <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-wider">登斋入室</h1>
            <p className="mt-2 text-stone-600">呈验通关符印，启阅万卷汗青</p>
          </div>
          <div className="w-16 h-0.5 bg-[#8b2626] mx-auto opacity-50"></div>
        </div>

        <AuthForm mode="login" />

        <div className="text-center pt-4 border-t border-dashed border-[#d4c4b7]">
          <p className="text-sm text-stone-600 font-medium">
            尚未录入馆籍？{" "}
            <Link href="/auth/register" className="text-[#8b2626] hover:text-[#701e1e] font-bold border-b border-transparent hover:border-[#8b2626] transition-colors pb-0.5">
              前往登记
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
