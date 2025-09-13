"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
// import { useSession } from "next-auth/react"; // commented out for testing
import { ChatSessionList } from "./chat-session-list";
import { ChatInterface } from "./chat-interface";
import { ChatErrorBoundary } from "./error-boundary";
// import { AuthButton } from "../auth-button"; // commented out for testing
import { api } from "@/trpc/react";

export function ChatApp() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // const { data: session, status } = useSession(); // commented out for testing

  const { data: sessions, isLoading } = api.chat.getSessions.useQuery(
    undefined,
    // { enabled: !!session } // commented out for testing - always enabled
  );

  const handleNewSession = () => {
    setSelectedSessionId(null);
  };

  const handleSessionCreated = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    // Invalidate sessions query to refresh the list
    queryClient.invalidateQueries({ queryKey: [["chat", "getSessions"]] });
  };

  // Show loading state while checking authentication
  // if (status === "loading") { // commented out for testing
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  // Show authentication UI if not logged in
  // if (!session) { // commented out for testing
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-gray-50">
  //       <div className="max-w-md w-full text-center p-8">
  //         <div className="mb-8">
  //           <h1 className="text-3xl font-bold text-gray-900 mb-4">
  //             Career Counselor AI
  //           </h1>
  //           <p className="text-gray-600 mb-6">
  //             Sign in to start your personalized career counseling session with our AI advisor.
  //           </p>
  //         </div>
  //         <AuthButton />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <ChatErrorBoundary>
      <div className="flex h-screen bg-gray-50">
        {/* Header with auth info */}
        {/* <div className="absolute top-0 right-0 z-10 p-4">
          <AuthButton />
        </div> */}

        {/* Sidebar with chat sessions */}
        <div className="w-80 overflow-y-hidden h-screen flex flex-col">
         
          <ChatSessionList
            sessions={sessions || []}
            selectedSessionId={selectedSessionId}
            onSelectSession={setSelectedSessionId}
            onNewSession={handleNewSession}
            isLoading={isLoading}
          />
        </div>

        {/* Main chat interface */}
        <div className="flex-1 flex flex-col h-screen">
          <ChatInterface
            sessionId={selectedSessionId}
            onSessionCreated={handleSessionCreated}
          />
        </div>
      </div>
    </ChatErrorBoundary>
  );
}