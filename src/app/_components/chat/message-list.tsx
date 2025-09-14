"use client";

import { format } from "date-fns";
import { ClipboardDocumentIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
  metadata?: unknown;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6 items-end ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] rounded-full flex items-center justify-center shadow-lg">
            <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[80%] md:max-w-[78%] ${isUser ? "order-1 text-right" : "order-2 text-left"}`}>
        <div
          className={`px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl break-words text-sm leading-relaxed shadow-md dark:bg-gradient-to-r dark:from-white/8 dark:to-white/4 dark:border dark:border-white/10 dark:text-[var(--text-primary)] bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white `}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="flex items-center justify-between mt-1 sm:mt-2">
          <p className={`text-xs ${isUser ? "text-[var(--text-secondary)]" : "text-[var(--text-tertiary)]"}`}>
            {format(new Date(message.createdAt), "HH:mm")}
          </p>

          {/* Assistant actions */}
          {!isUser && (
            <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
              <button
                title="Copy"
                onClick={() => navigator.clipboard?.writeText(message.content)}
                className="p-1 rounded-md hover:bg-[var(--surface-secondary)] transition-colors"
              >
                <ClipboardDocumentIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--text-tertiary)]" />
              </button>

            </div>
          )}
        </div>
      </div>

      {/* {isUser && (
        <div className="flex-shrink-0 order-2">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center shadow-inner">
            <UserCircleIcon className="w-5 h-5 text-white/90" />
          </div>
        </div>
      )} */}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 justify-start items-center">
      <div className="flex-shrink-0 relative">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[var(--secondary-gradient-start)] to-[var(--secondary-gradient-end)] rounded-full flex items-center justify-center shadow-md">
          <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 sm:w-4 sm:h-4">
            <defs>
              <linearGradient id="g2" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#fff7fb" />
                <stop offset="100%" stopColor="#ffd6ff" />
              </linearGradient>
            </defs>
            <path d="M12 2l1.5 3.43L17 6.59l-2.6 2.01L15 13l-3-1.73L9 13l.6-4.4L7 6.59l3.5-.16L12 2z" fill="url(#g2)" className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]" />
          </svg>
        </span>
      </div>
      <div className="bg-white/6 px-3 sm:px-4 py-2 rounded-lg">
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  );
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, isLoading]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 scrollbar-hide">
      {messages.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center h-32 sm:h-48 md:h-64 text-center">
          <div className="max-w-lg mx-auto px-4">
            <div className="mb-6">
              {/* <div className="w-12 h-12 bg-gradient-to-br from-[var(--secondary-gradient-start)] to-[var(--secondary-gradient-end)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div> */}
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-2">
                How can I help with your career today?
              </h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                Ask me anything about your professional journey
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="bg-[var(--surface-secondary)] hover:bg-[var(--surface-primary)] border border-[var(--border-secondary)] rounded-lg p-3 transition-colors cursor-pointer">
                <p className="text-[var(--text-secondary)]">💼 Career advice</p>
              </div>
              <div className="bg-[var(--surface-secondary)] hover:bg-[var(--surface-primary)] border border-[var(--border-secondary)] rounded-lg p-3 transition-colors cursor-pointer">
                <p className="text-[var(--text-secondary)]">📄 Resume review</p>
              </div>
              <div className="bg-[var(--surface-secondary)] hover:bg-[var(--surface-primary)] border border-[var(--border-secondary)] rounded-lg p-3 transition-colors cursor-pointer">
                <p className="text-[var(--text-secondary)]">🎯 Skill development</p>
              </div>
              <div className="bg-[var(--surface-secondary)] hover:bg-[var(--surface-primary)] border border-[var(--border-secondary)] rounded-lg p-3 transition-colors cursor-pointer">
                <p className="text-[var(--text-secondary)]">💰 Salary negotiation</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {messages
            .slice()
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          {isLoading && <TypingIndicator />}
        </div>
      )}
    </div>
  );
}