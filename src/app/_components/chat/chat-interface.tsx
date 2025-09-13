"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/trpc/react";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input"
import { EmptyState } from "./empty-state";

interface ChatInterfaceProps {
  sessionId: string | null;
  onSessionCreated: (sessionId: string) => void;
}

export function ChatInterface({ sessionId, onSessionCreated }: ChatInterfaceProps) {
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const queryClient = useQueryClient();

  // Fetch session data if sessionId is provided
  const { data: session, isLoading: sessionLoading, refetch: refetchSession } = api.chat.getSession.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId }
  );

  // Mutations
  const createSession = api.chat.createSession.useMutation({
    onSuccess: () => {
      // Invalidate sessions query to refresh the list
      queryClient.invalidateQueries({ queryKey: [["chat", "getSessions"]] });
    },
  });
  const sendMessage = api.ai.sendMessage.useMutation({
    onSuccess: () => {
      // Refetch session data to show new messages
      refetchSession();
    },
  });

  const handleSendMessage = async (content: string) => {
    if (!sessionId) {
      // Create new session first
      if (!newSessionTitle.trim()) {
        setNewSessionTitle(`Career Chat ${new Date().toLocaleDateString()}`);
      }

      try {
        const newSession = await createSession.mutateAsync({
          title: newSessionTitle || `Career Chat ${new Date().toLocaleDateString()}`,
        });
        onSessionCreated(newSession.id);

        // Now send the message to the new session
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
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#020617] to-[#071024]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-purple-500 border-transparent rounded-full"></div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-b from-[#020617] to-[#071024] min-h-0 relative">
        {/* <div className="p-10 border-b border-white/6 flex-shrink-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Career Counselor AI</h1>
          <p className="mt-3 text-gray-400 max-w-2xl">Your personal AI career advisor — thoughtful, practical, and focused on helping you grow professionally.</p>
        </div>

        <div className="flex-1 overflow-auto p-8 pb-32">
          <div className="w-full max-w-5xl bg-gradient-to-br from-white/4 to-transparent border border-white/6 rounded-3xl shadow-2xl p-8 backdrop-blur-md">
            <EmptyState onNewChat={handleNewChat} />
          </div>
        </div> */}

  <div className="fixed bottom-0 left-0 md:left-80 right-0 z-50 border-t border-white/6 shadow-lg">
          <div className="p-6">
            <div className="max-w-5xl mx-auto">
              <div className="bg-[rgba(12,8,30,0.6)] rounded-xl p-4 shadow-lg">
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#060417] via-[#0f0720] to-[#22123a] min-h-0 relative">
      {/* Messages area with bottom padding for fixed input */}
      <div className="flex-1 overflow-auto p-6 pb-40 min-h-0">
        <div className="max-w-5xl mx-auto h-full">
          <div className="bg-gradient-to-br from-white/3 to-transparent border border-white/6 rounded-3xl p-6 backdrop-blur-md shadow-2xl min-h-[50vh] flex flex-col h-full min-h-0">
            <MessageList
              messages={session?.messages || []}
              isLoading={sendMessage.isPending}
            />
          </div>
        </div>
      </div>

      {/* Fixed input area at bottom with proper z-index and background */}
      <div className="fixed bottom-0 left-0 md:left-80 right-0 z-50  shadow-lg">
        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[rgba(12,8,30)] rounded-xl p-4 shadow-lg">
              <MessageInput
                onSendMessage={handleSendMessage}
                placeholder="Ask your career counselor anything..."
                disabled={sendMessage.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}