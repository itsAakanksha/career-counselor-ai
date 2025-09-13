"use client";

import { ChatBubbleLeftRightIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface EmptyStateProps {
  onNewChat: () => void;
}

export function EmptyState({ onNewChat }: EmptyStateProps) {
  const suggestions = [
    "How can I improve my resume?",
    "What career paths should I consider?",
    "How do I prepare for a job interview?",
    "What skills are in demand right now?",
    "How can I negotiate a better salary?",
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Career Counselor AI
          </h2>
          <p className="text-gray-600">
            I'm your personal AI career advisor. Ask me anything about your career journey,
            from resume tips to job search strategies.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Try asking about:
          </h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onNewChat()}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onNewChat}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Start a New Conversation
        </button>
      </div>
    </div>
  );
}