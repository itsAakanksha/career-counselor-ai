"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-2 md:p-8">
      <div className="md:w-20 md:h-20 bg-gradient-to-br from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        <SparklesIcon className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4 text-center">
        Welcome to Career Counselor AI
      </h2>
      <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed text-center max-w-xl">
        I&apos;m your personal AI career advisor. Ask me anything about your career journey, from resume tips to job search strategies.
      </p>
    </div>
  );
}