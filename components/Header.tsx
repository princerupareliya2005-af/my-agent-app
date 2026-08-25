'use client';

import React from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
  aiModel: string;
  onNewChat: () => void;
}

export default function Header({
  onToggleSidebar,
  title,
  aiModel,
  onNewChat,
}: HeaderProps) {
  return (
    <header className="h-14 border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-4 flex items-center justify-between z-30 sticky top-0 backdrop-blur-md">
      {/* Left Area: Menu / Three-line Button & Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-chat-user)] transition-colors focus:outline-none flex items-center justify-center"
          title="Toggle sidebar menu"
          type="button"
        >
          {/* Three-line / Hamburger Menu Icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-base font-bold text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-[320px]">
            {title || 'Autonomous GitHub Bug Patch Agent'}
          </span>
        </div>
      </div>

      {/* Right Area: Model Badge & New Chat Button */}
      <div className="flex items-center space-x-2">
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-xl text-[11px] font-mono text-[var(--text-secondary)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{aiModel}</span>
        </div>

        <button
          onClick={onNewChat}
          className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-chat-user)] transition-colors"
          title="New Chat"
          type="button"
        >
          <span className="text-lg font-bold">+</span>
        </button>
      </div>
    </header>
  );
}
