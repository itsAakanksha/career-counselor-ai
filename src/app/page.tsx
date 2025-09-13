import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { ChatApp } from "@/app/_components/chat/chat-app";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.chat.getSessions.prefetch();
  }

  return (
    <HydrateClient>
      <ChatApp />
    </HydrateClient>
  );
}
