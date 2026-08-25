'use client';

import React, { useState } from 'react';
import { UserProfile, AgentConfig } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  config: AgentConfig;
  onUpdateProfile: (updated: UserProfile) => void;
  onUpdateConfig: (updated: AgentConfig) => void;
}

export default function ProfileView({
  profile,
  config,
  onUpdateProfile,
  onUpdateConfig,
}: ProfileViewProps) {
  const [showToken, setShowToken] = useState(false);
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [localConfig, setLocalConfig] = useState<AgentConfig>(config);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    onUpdateProfile(localProfile);
    onUpdateConfig(localConfig);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-8">
      {savedToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl font-semibold text-xs flex items-center gap-2 animate-bounce">
          <span>✅</span> Settings & GitHub Token Saved Successfully!
        </div>
      )}

      <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-bold text-white">
              👨‍💻
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{localProfile.name}</h2>
              <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-bold">
                PRO AGENT
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">@{localProfile.username}</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
          <span className="text-2xl font-black text-white">{localProfile.stats.totalAudits}</span>
          <p className="text-xs text-slate-400 mt-1">Total Audits Run</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
          <span className="text-2xl font-black text-emerald-400">{localProfile.stats.bugsFixed}</span>
          <p className="text-xs text-slate-400 mt-1">Bugs Patched</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
          <span className="text-2xl font-black text-blue-400">{localProfile.stats.prsCreated}</span>
          <p className="text-xs text-slate-400 mt-1">Auto PRs Opened</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
          <span className="text-2xl font-black text-purple-400">{localProfile.stats.linesPatched}</span>
          <p className="text-xs text-slate-400 mt-1">Refactored LOC</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🔑</span> GitHub API Key & Token Integration
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Provide your GitHub Personal Access Token (PAT) with <code className="text-blue-400">repo</code> scope to allow the agent to fetch private repositories and open automated Pull Requests.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Developer Name
              </label>
              <input
                type="text"
                value={localProfile.name}
                onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GitHub Username
              </label>
              <input
                type="text"
                value={localProfile.username}
                onChange={(e) => setLocalProfile({ ...localProfile, username: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GitHub Personal Access Token (PAT)
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={localProfile.githubToken}
                  onChange={(e) => setLocalProfile({ ...localProfile, githubToken: e.target.value })}
                  className="w-full pl-4 pr-12 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  {showToken ? '🙈 Hide' : '👁️ Show'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚙️</span> Autonomous Agent Engine Tuning
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Configure how the LLM reasoner scans AST trees and synthesizes bug fixes.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                AI Reasoning Engine Model
              </label>
              <select
                value={localConfig.aiModel}
                onChange={(e) => setLocalConfig({ ...localConfig, aiModel: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (High Reasoning & Context)</option>
                <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Ultra Precise Refactoring)</option>
                <option value="gpt-4o">GPT-4o (High Speed Patching)</option>
                <option value="llama-3-70b">Llama 3 70B (Open Source Sandbox)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Min Severity Threshold for Auto-Patching
              </label>
              <select
                value={localConfig.severityThreshold}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, severityThreshold: e.target.value as any })
                }
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="LOW">LOW (Patch all vulnerabilities)</option>
                <option value="MEDIUM">MEDIUM (Patch Medium, High & Critical)</option>
                <option value="HIGH">HIGH (Patch High & Critical only)</option>
                <option value="CRITICAL">CRITICAL (Only patch immediate zero-days)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Max Fix Attempts per Bug</span>
                <span className="text-blue-400">{localConfig.maxFixAttempts} Attempts</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={localConfig.maxFixAttempts}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, maxFixAttempts: Number(e.target.value) })
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <span className="text-xs font-semibold text-white block">Automatically Open Pull Request</span>
                <span className="text-[11px] text-slate-400">Directly create a PR on GitHub after synthesis</span>
              </div>
              <input
                type="checkbox"
                checked={localConfig.autoCreatePR}
                onChange={(e) => setLocalConfig({ ...localConfig, autoCreatePR: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
