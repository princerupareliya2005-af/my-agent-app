'use client';

import React from 'react';
import { ChatSession, UserProfile } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onOpenSettings: () => void;
  profile: UserProfile;
}

export default function Sidebar({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenSettings,
  profile,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container - ChatGPT Style Layout */}
      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-50 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col justify-between sidebar-transition shrink-0 ${
          isOpen
            ? 'w-72 translate-x-0 opacity-100'
            : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden border-none'
        }`}
      >
        <div className="w-72 flex flex-col justify-between h-full">
          {/* Top Header & New Chat Button */}
          <div className="p-3.5 space-y-3">
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-base font-bold shadow-md shadow-blue-500/20">
                  🛡️
                </div>
                <span className="font-extrabold text-sm tracking-tight text-[var(--text-primary)]">
                  Security Agent
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-chat-user)] transition-colors"
                title="Close sidebar"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* New Chat Button */}
            <button
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 768) onClose();
              }}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-primary)] hover:bg-[var(--bg-chat-user)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs transition-all transform active:scale-98"
              type="button"
            >
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-blue-500">+</span>
                <span>New chat</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono border border-[var(--border-color)] px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            </button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto px-3 space-y-1 py-2">
            <div className="px-2 py-1 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Recent Audits & Chats
            </div>

            {sessions.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-[var(--text-muted)]">
                No chat history yet. Start a new conversation!
              </div>
            ) : (
              sessions.map((session) => {
                const isActive = session.id === currentSessionId;
                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session.id);
                      if (window.innerWidth < 768) onClose();
                    }}
                    className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[var(--bg-chat-user)] text-[var(--text-primary)] font-semibold shadow-xs'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-chat-user)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 overflow-hidden pr-6">
                      <span className="text-xs">💬</span>
                      <span className="truncate text-xs">{session.title}</span>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="p-1 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-80 group-hover:opacity-100"
                      title="Delete chat"
                      type="button"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Pinned Footer & Settings */}
          <div className="p-3 border-t border-[var(--border-color)] space-y-2">
            {/* Settings Button */}
            <button
              onClick={() => {
                onOpenSettings();
                if (window.innerWidth < 768) onClose();
              }}
              className="w-full px-3 py-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-chat-user)] rounded-xl text-xs font-medium flex items-center justify-between transition-colors"
              type="button"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">⚙️</span>
                <span>Settings & Theme</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Appearance</span>
            </button>

            {/* User Profile Badge */}
            <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                👨‍💻
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[var(--text-primary)] truncate">{profile.name}</p>
                <p className="text-[10px] text-[var(--text-muted)] truncate">@{profile.username}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
