'use client';

import React, { useState } from 'react';
import { UserProfile, AgentConfig, ThemeMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  config: AgentConfig;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateConfig: (config: AgentConfig) => void;
  onThemeChange: (theme: ThemeMode) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  profile,
  config,
  onUpdateProfile,
  onUpdateConfig,
  onThemeChange,
}: SettingsModalProps) {
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [localConfig, setLocalConfig] = useState<AgentConfig>(config);
  const [showToken, setShowToken] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateProfile(localProfile);
    onUpdateConfig(localConfig);
    onThemeChange(localConfig.theme);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  const handleSelectTheme = (theme: ThemeMode) => {
    setLocalConfig({ ...localConfig, theme });
    onThemeChange(theme);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">⚙️</span>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Settings & Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg text-lg"
          >
            ✕
          </button>
        </div>

        {/* Toast Feedback */}
        {savedToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold text-center animate-bounce">
            ✅ Settings & Theme Saved Successfully!
          </div>
        )}

        {/* 1. APPEARANCE / THEME SECTION */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Appearance & Theme
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* Light Mode Button */}
            <button
              onClick={() => handleSelectTheme('light')}
              className={`p-3.5 rounded-xl border text-center space-y-2 transition-all ${
                localConfig.theme === 'light'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-bold ring-2 ring-blue-500/30'
                  : 'border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className="text-xl">☀️</div>
              <div className="text-xs font-semibold">Light Mode</div>
            </button>

            {/* Dark Mode Button */}
            <button
              onClick={() => handleSelectTheme('dark')}
              className={`p-3.5 rounded-xl border text-center space-y-2 transition-all ${
                localConfig.theme === 'dark'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-bold ring-2 ring-blue-500/30'
                  : 'border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className="text-xl">🌙</div>
              <div className="text-xs font-semibold">Dark Mode</div>
            </button>

            {/* System Default Button */}
            <button
              onClick={() => handleSelectTheme('system')}
              className={`p-3.5 rounded-xl border text-center space-y-2 transition-all ${
                localConfig.theme === 'system'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-bold ring-2 ring-blue-500/30'
                  : 'border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className="text-xl">💻</div>
              <div className="text-xs font-semibold">System Default</div>
            </button>
          </div>
        </div>

        {/* 2. GITHUB TOKEN INTEGRATION */}
        <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            GitHub Personal Access Token (PAT)
          </h3>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              PAT Key (repo scope for automated PRs & commits)
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={localProfile.githubToken}
                onChange={(e) => setLocalProfile({ ...localProfile, githubToken: e.target.value })}
                className="w-full pl-3.5 pr-14 py-2.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-2.5 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] font-semibold"
              >
                {showToken ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>

        {/* 3. AI REASONING MODEL */}
        <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            AI Engine Model
          </h3>

          <select
            value={localConfig.aiModel}
            onChange={(e) => setLocalConfig({ ...localConfig, aiModel: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
          >
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (High Reasoning & Context)</option>
            <option value="gpt-4o">GPT-4o (OpenAI High-Speed Security Audit)</option>
            <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Ultra Precise Refactoring)</option>
            <option value="llama-3-70b">Llama 3 70B (Open Source Sandbox)</option>
          </select>
        </div>

        {/* Save Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--bg-input)] hover:bg-[var(--bg-sidebar)] text-[var(--text-secondary)] rounded-xl text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 transition-all active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
