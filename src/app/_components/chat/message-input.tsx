"use client";

import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MessageInput({
  onSendMessage,
  placeholder = "Type your message...",
  disabled = false
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 items-end">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl resize-none focus:outline-none  focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-sm sm:text-base scrollbar-hide"
          rows={1}
          style={{ minHeight: "40px", maxHeight: "160px" }}
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white rounded-xl shadow-lg hover:brightness-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
      >
        <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </form>
  );
}
