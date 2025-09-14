"use client";

import { useState } from "react";
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
  const [searchQuery, setSearchQuery] = useState("");

  // Filter sessions based on search query
  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="flex-1 h-full overflow-y-auto bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-end)] text-gray-200 scrollbar-hide">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-primary)]">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Chat History</h2>
        <p className="text-xs text-[var(--text-tertiary)]">Your recent career conversations</p>
      </div>

      {/* Search / New chat */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[var(--dark-bg)] border border-[var(--border-primary)] placeholder-[var(--text-tertiary)] text-[var(--text-primary)] text-sm pl-10 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--primary-gradient-end)] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={onNewSession}
          className="w-full flex items-center gap-2 justify-center py-2 bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] hover:brightness-110 text-white rounded-full text-sm font-medium shadow-md transition-all duration-200"
        >
          <PlusIcon className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Sessions list */}
      <div className="px-3 pb-4 space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse h-12 bg-[var(--surface-secondary)] rounded-lg"></div>
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-tertiary)]">
            {searchQuery ? (
              <>
                <p>No conversations found</p>
                <p className="text-sm">Try a different search term</p>
              </>
            ) : (
              <>
                <p>No chats yet</p>
                <p className="text-sm">Start a new conversation</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-150 ${
                  selectedSessionId === session.id
                    ? "bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] shadow-lg"
                    : "hover:bg-[var(--bg-gradient-end)]"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium truncate text-[var(--text-primary)]">{session.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)] truncate flex-1 mr-2">
                      {session._count.messages > 0
                        ? `${session._count.messages} message${session._count.messages === 1 ? '' : 's'}`
                        : "No messages yet"
                      }
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] whitespace-nowrap">
                      {formatDistanceToNow(session.lastMessageAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

     
    </div>
  );
}