import { useState, useCallback } from "react";
import { api } from "@/trpc/react";

type Message = {
  id: string;
  chatSessionId: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
  metadata?: unknown;
};

type OptimisticMessage = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
  chatSessionId: string;
};

export function useChatSession(sessionId?: string) {
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);

  // TanStack Query for data fetching
  const { data: session, isLoading: sessionLoading } = api.chat.getSession.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId }
  );

  const { data: messages, isLoading: messagesLoading } = api.chat.getMessages.useQuery(
    { sessionId: sessionId!, limit: 50, offset: 0 },
    { enabled: !!sessionId }
  );

  // Mutations for creating/updating
  const createSessionMutation = api.chat.createSession.useMutation();
  const sendMessageMutation = api.ai.sendMessage.useMutation();
  const updateTitleMutation = api.chat.updateSessionTitle.useMutation();
  const deleteSessionMutation = api.chat.deleteSession.useMutation();

  // Combined messages (real + optimistic)
  const allMessages = [...(messages ?? []), ...optimisticMessages];

  const createSession = useCallback(async (title: string) => {
    return await createSessionMutation.mutateAsync({ title });
  }, [createSessionMutation]);

  const sendMessage = useCallback(async (content: string): Promise<Message | undefined> => {
    if (!sessionId) return;

    // Add optimistic user message
    const optimisticUserMessage: OptimisticMessage = {
      id: `temp-user-${Date.now()}`,
      content,
      role: "user",
      createdAt: new Date(),
      chatSessionId: sessionId,
    };

    setOptimisticMessages(prev => [...prev, optimisticUserMessage]);

    try {
      const response = await sendMessageMutation.mutateAsync({
        sessionId,
        content,
      });

      // Remove optimistic message and add real messages
      setOptimisticMessages(prev => prev.filter((msg: OptimisticMessage) => msg.id !== optimisticUserMessage.id));

      return response;
    } catch (error) {
      // Remove optimistic message on error
      setOptimisticMessages(prev => prev.filter((msg: OptimisticMessage) => msg.id !== optimisticUserMessage.id));
      throw error;
    }
  }, [sessionId, sendMessageMutation]);

  const updateTitle = useCallback(async (title: string) => {
    if (!sessionId) return;
    return await updateTitleMutation.mutateAsync({ sessionId, title });
  }, [sessionId, updateTitleMutation]);

  const deleteSession = useCallback(async () => {
    if (!sessionId) return;
    return await deleteSessionMutation.mutateAsync({ sessionId });
  }, [sessionId, deleteSessionMutation]);

  return {
    session,
    messages: allMessages,
    isLoading: sessionLoading || messagesLoading,
    createSession,
    sendMessage,
    updateTitle,
    deleteSession,
    isCreating: createSessionMutation.isPending,
    isSending: sendMessageMutation.isPending,
    isUpdating: updateTitleMutation.isPending,
    isDeleting: deleteSessionMutation.isPending,
  };
}