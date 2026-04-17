"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface OpenFigureChatMessage {
  type: "open-figure-chat";
  figureName: string;
}

export default function TimelineMapEmbed() {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const data = event.data as OpenFigureChatMessage | undefined;
      if (!data || data.type !== "open-figure-chat" || !data.figureName) {
        return;
      }

      router.push(`/dashboard/chats?figure=${encodeURIComponent(data.figureName)}`);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  return (
    <iframe
      src="/twha5/index.html"
      title="万国坤舆图鉴"
      className="h-[78vh] min-h-[620px] w-full bg-white"
    />
  );
}
