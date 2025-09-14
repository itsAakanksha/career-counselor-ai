"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/trpc/react";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input"
import { EmptyState } from "./empty-state";

interface ChatInterfaceProps {
  sessionId: string | null;
  onSessionCreated: (sessionId: string) => void;
  sidebarOpen?: boolean;
}

export function ChatInterface({ sessionId, onSessionCreated, sidebarOpen = true }: ChatInterfaceProps) {
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const queryClient = useQueryClient();

  // Fetch session data if sessionId is provided
  const { data: session, isLoading: sessionLoading, refetch: refetchSession } = api.chat.getSession.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId }
  );

  // Mutations
  const createSession = api.chat.createSession.useMutation({
    onSuccess: async () => {
      // Invalidate sessions query to refresh the list
      await queryClient.invalidateQueries({ queryKey: [["chat", "getSessions"]] });
    },
  });
  const sendMessage = api.ai.sendMessage.useMutation({
    onSuccess: async () => {
      // Refetch session data to show new messages
      await refetchSession();
    },
  });

  const handleSendMessage = async (content: string) => {
    if (!sessionId) {
      if (!newSessionTitle.trim()) {
        setNewSessionTitle(`Career Chat `);
      }

      try {
        const newSession = await createSession.mutateAsync({
          title: newSessionTitle || `Career Chat `,
        });
        onSessionCreated(newSession.id);

        await sendMessage.mutateAsync({
          sessionId: newSession.id,
          content,
        });
      } catch (error) {
        console.error("Failed to create session:", error);
      }
    } else {
      // Send message to existing session
      try {
        await sendMessage.mutateAsync({
          sessionId,
          content,
        });
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[var(--bg-gradient-start)] to-[var(--bg-gradient-via)]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[var(--primary-gradient-end)] border-transparent rounded-full"></div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="h-screen flex flex-col  min-h-0 relative">
        <div className="flex-1 overflow-auto bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-end)]  p-8 pb-32 scrollbar-hide">
          <div className="w-full max-w-5xl ">
            <EmptyState />
          </div>
        </div>

        <div className={`fixed bottom-0 left-0 z-40 shadow-lg ${
          sidebarOpen ? 'md:left-80 right-0' : 'right-0'
        }`}>
          <div className="p-3 sm:p-4 md:p-6">
            <div className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-white/5 to-white/2 border border-[var(--border-primary)] rounded-xl p-3 sm:p-4 shadow-lg ">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  placeholder="Start a conversation with your career counselor..."
                  disabled={createSession.isPending || sendMessage.isPending}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-end)] min-h-0 relative">
      <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 pb-32 sm:pb-36 md:pb-40 min-h-0 scrollbar-hide">
        <div className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto h-full">
          <div className="bg-gradient-to-br from-white/5 to-white/2 border border-[var(--border-primary)] rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 backdrop-blur-md shadow-2xl min-h-[50vh] flex flex-col h-full min-h-0">
            <MessageList
              messages={session?.messages ?? []}
              isLoading={sendMessage.isPending}
            />
          </div>
        </div>
      </div>

      {/* Fixed input area at bottom with proper z-index and background */}
      <div className={`fixed bottom-0 left-0 z-40   ${
        sidebarOpen ? 'md:left-80 right-0' : 'right-0'
      }`}>
        <div className="p-3 sm:p-4 md:p-6">
          <div className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-white/5 to-white/2 border border-[var(--border-primary)] rounded-xl p-3 sm:p-4 shadow-lg border">
              <MessageInput
                onSendMessage={handleSendMessage}
                placeholder="Ask your career counselors anything..."
                disabled={sendMessage.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}