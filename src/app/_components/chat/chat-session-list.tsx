"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";

interface ChatSession {
  id: string;
  title: string;
  lastMessageAt: Date;
  _count: {
    messages: number;
  };
}

interface ChatSessionListProps {
  sessions: ChatSession[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  isLoading: boolean;
}

export function ChatSessionList({
  sessions,
  selectedSessionId,
  onSelectSession,
  onNewSession,
  isLoading,
}: ChatSessionListProps) {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-gradient-to-br from-[#060417] via-[#0f0720] to-[#22123a] text-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-black/20">
        <h2 className="text-xl font-bold text-white">Chat History</h2>
        <p className="text-xs text-gray-400">Your recent career conversations</p>
      </div>

      {/* Search / New chat */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <input
            placeholder="Search"
            className="w-full bg-[#0b1220] border border-black/30 placeholder-gray-500 text-sm px-3 py-2 rounded-full"
          />
        </div>

        <button
          onClick={onNewSession}
          className="w-full flex items-center gap-2 justify-center py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium shadow-md"
        >
          <PlusIcon className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Sessions list */}
      <div className="px-3 pb-4 space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse h-12 bg-black/20 rounded-lg"></div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No chats yet</p>
            <p className="text-sm">Start a new conversation</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-150 ${
                  selectedSessionId === session.id
                    ? "bg-gradient-to-r from-[#2b1055] to-[#4b1fbf] shadow-lg"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b2a6f] to-[#6b4be0] flex items-center justify-center text-sm font-semibold">
                  {session.title.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{session.title}</h3>
                    <span className="text-xs text-gray-300 ml-2">
                      {formatDistanceToNow(session.lastMessageAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{session._count.messages} messages</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

     
    </div>
  );
}