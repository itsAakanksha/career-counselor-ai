"use client";

import { format } from "date-fns";
import { UserCircleIcon, CpuChipIcon } from "@heroicons/react/24/solid";
import { ClipboardDocumentIcon, HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
  metadata?: any;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-4 mb-6 items-end ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 relative">
         
          {/* Spark star overlay */}
          {/* <span className="absolute top-1 -right-3 w-9 h-9 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <defs>
                <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fff7fb" />
                  <stop offset="100%" stopColor="#ffd6ff" />
                </linearGradient>
              </defs>
              <path d="M12 2l1.902 4.354L18.5 8.09l-3.25 2.516L15.804 15 12 12.77 8.196 15l.554-4.394L5.5 8.09l4.598-.736L12 2z" fill="url(#g1)" className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] animate-pulse" />
            </svg>
          </span> */}
        </div>
      )}

      <div className={`max-w-[78%] ${isUser ? "order-1 text-right" : "order-2 text-left"}`}>
        <div
          className={`px-5 py-3 rounded-2xl break-words text-sm leading-relaxed shadow-md ${
            isUser
              ? "bg-gradient-to-r from-[#2b1055] to-[#4b1fbf] text-white"
              : "bg-gradient-to-r from-[#2b1055] to-[#4b1fbf] text-white"
          }`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className={`text-xs mt-2 ${isUser ? "text-gray-300" : "text-gray-400"}`}>
            {format(new Date(message.createdAt), "HH:mm")}
          </p>

          {/* Assistant actions */}
          {!isUser && (
            <div className="flex items-center gap-3 mt-2 ">
              <button
                title="Copy"
                onClick={() => navigator.clipboard?.writeText(message.content)}
                className="p-1 rounded-md hover:bg-white/5"
              >
                <ClipboardDocumentIcon className="w-4 h-4 text-gray-300" />
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
    <div className="flex gap-3 mb-4 justify-start items-center">
      <div className="flex-shrink-0 relative">
        <div className="w-8 h-8 bg-gradient-to-br from-[#5b3ce6] to-[#8b5cf6] rounded-full flex items-center justify-center shadow-md">
          <CpuChipIcon className="w-5 h-5 text-white" />
        </div>
        <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
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
      <div className="bg-white/6 px-4 py-2 rounded-lg">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
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
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      {messages.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <p>No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <div className="space-y-6">
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