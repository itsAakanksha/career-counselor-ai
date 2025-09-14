"use client";

import React, { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/lib/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="w-4 h-4" />;
      case 'dark':
        return <MoonIcon className="w-4 h-4" />;
      default:
        return <SunIcon className="w-4 h-4" />;
    }
  };

  const getTooltip = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to light mode';
      default:
        return 'Toggle theme';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className={`
        relative w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700
        bg-white dark:bg-[var(--dark-bg)]
        hover:bg-gray-50 dark:hover:bg-[var(--dark-bg)]
        focus:outline-none cursor-pointer
        transition-all duration-200 ease-in-out
        flex items-center justify-center
        group
      `}
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      <div className="relative">
        {getIcon()}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
     
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
           {getTooltip()}
      </div>
    </button>
  );
}

// Alternative dropdown version for more options
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-[var(--dark-bg)] animate-pulse" />;
  }

  const themes = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
  ] as const;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700
          bg-white dark:bg-[var(--dark-bg)]
          hover:bg-gray-50 dark:hover:bg-[var(--dark-bg)]
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-all duration-200 ease-in-out
          flex items-center justify-center
        `}
        title="Change theme"
        aria-label="Change theme"
      >
        {themes.find(t => t.value === theme)?.icon && (
          React.createElement(themes.find(t => t.value === theme)!.icon, {
            className: "w-4 h-4"
          })
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  setTheme(value);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700
                  transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg
                  ${theme === value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
                {theme === value && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}