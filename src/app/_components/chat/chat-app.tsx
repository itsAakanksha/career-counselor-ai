"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
// import { useSession } from "next-auth/react"; // commented out for testing
import { ChatSessionList } from "./chat-session-list";
import { ChatInterface } from "./chat-interface";
import { ChatErrorBoundary } from "./error-boundary";
// import { AuthButton } from "../auth-button"; // commented out for testing
import { api } from "@/trpc/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
export function ChatApp() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();
  // const { data: session, status } = useSession(); // commented out for testing

  const { data: sessions, isLoading } = api.chat.getSessions.useQuery(
    undefined,
    // { enabled: !!session } // commented out for testing - always enabled
  );

  // Handle window resize to show/hide sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNewSession = () => {
    setSelectedSessionId(null);
    // Close sidebar on mobile when starting new session
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleSessionCreated = async (sessionId: string) => {
    setSelectedSessionId(sessionId);
    // Invalidate sessions query to refresh the list
    await queryClient.invalidateQueries({ queryKey: [["chat", "getSessions"]] });
  };

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    // Close sidebar on mobile when selecting a session
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
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
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Theme toggle button */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* Sidebar toggle button for mobile */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
        >
          {sidebarOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          )}
        </button>

        {/* Sidebar with chat sessions */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 z-[60] md:z-auto w-80 h-screen flex flex-col bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-end)] transition-transform duration-300 ease-in-out md:transition-none`}>
          <ChatSessionList
            sessions={sessions ?? []}
            selectedSessionId={selectedSessionId}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
            isLoading={isLoading}
          />
        </div>

        {/* Main chat interface */}
        <div className="flex-1 flex flex-col h-screen md:ml-0">
          <ChatInterface
            sessionId={selectedSessionId}
            onSessionCreated={handleSessionCreated}
            sidebarOpen={sidebarOpen}
          />
        </div>
      </div>
    </ChatErrorBoundary>
  );
}