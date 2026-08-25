'use client';

import React, { useState } from 'react';
import { ChatMessage, AuditRecord } from '../types';

interface ChatMessageItemProps {
  message: ChatMessage;
  onUpdateAuditRecord?: (updatedRecord: AuditRecord) => void;
}

export default function ChatMessageItem({ message, onUpdateAuditRecord }: ChatMessageItemProps) {
  const isUser = message.role === 'user';
  const audit = message.auditRecord;

  const [activeTabDiff, setActiveTabDiff] = useState<number>(0);
  const [githubChoice, setGithubChoice] = useState<'github' | 'showcode' | null>(
    audit?.status === 'PUSHED_TO_GITHUB' ? 'github' : 'showcode'
  );
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatusMsg, setPushStatusMsg] = useState<string | null>(
    audit?.status === 'PUSHED_TO_GITHUB' ? 'Changes successfully applied to GitHub!' : null
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleApplyToGithub = async () => {
    if (!audit) return;
    setIsPushing(true);
    setGithubChoice('github');
    setPushStatusMsg(null);

    const savedProfileStr = typeof window !== 'undefined' ? localStorage.getItem('user_profile') : null;
    const userToken = savedProfileStr ? JSON.parse(savedProfileStr).githubToken : undefined;

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'commitFix',
          owner: audit.owner,
          repo: audit.repo,
          diffs: audit.diffs,
          token: userToken,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const updatedRecord: AuditRecord = {
          ...audit,
          status: 'PUSHED_TO_GITHUB',
          prUrl: data.prUrl || audit.prUrl,
        };

        setPushStatusMsg(data.message || `Changes applied to ${audit.owner}/${audit.repo} successfully on GitHub!`);
        if (onUpdateAuditRecord) {
          onUpdateAuditRecord(updatedRecord);
        }
      } else {
        setPushStatusMsg(`⚠️ ${data.error || 'Failed to update file on GitHub.'}`);
      }
    } catch (err: any) {
      setPushStatusMsg(`⚠️ ${err.message || 'Failed to reach GitHub API.'}`);
    } finally {
      setIsPushing(false);
    }
  };

  const copyFinalCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div
      className={`py-5 px-4 sm:px-6 w-full ${
        isUser ? 'bg-transparent' : 'bg-[var(--bg-chat-ai)] border-y border-[var(--border-subtle)]'
      }`}
    >
      <div className="max-w-4xl mx-auto flex space-x-4 w-full">
        {/* Avatar */}
        <div className="shrink-0">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              U
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
              🛡️
            </div>
          )}
        </div>

        {/* Message Content Body */}
        <div className="flex-1 min-w-0 space-y-4 text-sm leading-relaxed">
          {/* Header Role Label & Timestamp */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xs text-[var(--text-primary)]">
              {isUser ? 'You' : 'Security AI Agent'}
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">{message.timestamp}</span>
          </div>

          {/* Text Content */}
          {message.content && (
            <div className="text-[var(--text-primary)] whitespace-pre-wrap font-sans text-sm">
              {message.content}
            </div>
          )}

          {/* Loading Indicator */}
          {message.isLoading && (
            <div className="flex items-center space-x-2 text-xs text-blue-500 font-mono py-2">
              <svg className="animate-spin h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>AI is analyzing repository codebase & querying E2B sandbox...</span>
            </div>
          )}

          {/* Execution Logs Terminal */}
          {message.logs && message.logs.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] text-emerald-400 space-y-1 max-h-40 overflow-y-auto">
              <div className="text-slate-400 font-sans text-[10px] uppercase font-bold border-b border-slate-800 pb-1 mb-1">
                Execution Logs Output
              </div>
              {message.logs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          )}

          {/* 4-STEP AI-POWERED WORKFLOW */}
          {audit && audit.diffs && audit.diffs.length > 0 && (
            <div className="space-y-6 pt-2">
              {/* STEP 1: CODE ERROR DETAILS */}
              <div className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <span className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-full text-[11px] font-bold">
                    STEP 1: CODE ERROR DETAILS
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Repository: {audit.owner}/{audit.repo}
                  </span>
                </div>

                {audit.bugs.map((bug) => (
                  <div key={bug.id} className="space-y-3">
                    {/* Bug Metadata Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[var(--bg-card)] p-3.5 rounded-xl border border-[var(--border-color)]">
                      <div>
                        <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">File Name & Path</span>
                        <a
                          href={`https://github.com/${audit.owner}/${audit.repo}/blob/master/${encodeURIComponent(bug.file).replace(/%2F/g, '/')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-blue-500 font-bold hover:underline inline-flex items-center space-x-1"
                        >
                          <span>{bug.file}</span>
                          <span className="text-[10px] text-blue-400">↗</span>
                        </a>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Line Number / Range</span>
                        <span className="font-mono text-rose-500 font-bold">{bug.lineRange || `Line ${bug.line}`}</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Error Type</span>
                        <span className="font-bold text-rose-500">{bug.errorType || 'Security Vulnerability'}</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Severity</span>
                        <span className="font-bold text-rose-500">{bug.severity}</span>
                      </div>
                    </div>

                    {/* Problem Explanation & Impact */}
                    <div className="bg-[var(--bg-card)] p-3.5 rounded-xl border border-[var(--border-color)] space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-[var(--text-primary)] block">What is Wrong:</span>
                        <p className="text-[var(--text-secondary)] mt-0.5">{bug.explanation || bug.description}</p>
                      </div>
                      <div>
                        <span className="font-bold text-rose-500 block">Potential Security Risk / Impact:</span>
                        <p className="text-[var(--text-secondary)] mt-0.5">{bug.impact || 'Permits unauthorized execution or state manipulation.'}</p>
                      </div>
                    </div>

                    {/* Incorrect Problematic Code Block */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-red-900/40 font-mono text-xs">
                      <div className="text-red-400 font-bold mb-2 pb-1 border-b border-red-900/30 text-[10px] uppercase">
                        Problematic Code ({bug.file}:{bug.line})
                      </div>
                      <pre className="text-red-300 whitespace-pre-wrap leading-relaxed">
                        {bug.incorrectCode || audit.diffs[activeTabDiff]?.originalCode}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>

              {/* STEP 2: HOW AI AGENTS CAN FIX IT */}
              <div className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 shadow-sm">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/30 rounded-full text-[11px] font-bold inline-block">
                  STEP 2: HOW AI AGENTS CAN FIX IT
                </span>

                {audit.diffs[activeTabDiff] && (
                  <div className="space-y-3 text-xs font-sans">
                    {/* Flow Explanation */}
                    <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] space-y-2 leading-relaxed">
                      <div className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                        Fix Strategy: Incorrect Code → Problem Explanation → Proposed Fix
                      </div>

                      <div className="space-y-1.5 text-[var(--text-secondary)]">
                        <p><strong className="text-[var(--text-primary)]">Why the error occurred:</strong> The input parameter was evaluated directly without sanitization, allowing arbitrary string interpolation.</p>
                        <p><strong className="text-[var(--text-primary)]">AI Analysis:</strong> GPT-4o analyzed AST call graphs and flagged unsafe standard library usage.</p>
                        <p><strong className="text-[var(--text-primary)]">Why fix solves it:</strong> {audit.diffs[activeTabDiff].reasoningWhyItFixes || 'Parameterizes argument arrays to prevent metacharacter injection.'}</p>
                      </div>
                    </div>

                    {/* Before / After Code Diff Comparison */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        Proposed Code Diff (Before vs. After)
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                        <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3">
                          <div className="text-red-400 font-bold mb-1 text-[10px] uppercase">Before (Incorrect Code)</div>
                          <pre className="text-red-300 whitespace-pre-wrap">{audit.diffs[activeTabDiff].originalCode}</pre>
                        </div>
                        <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-3">
                          <div className="text-emerald-400 font-bold mb-1 text-[10px] uppercase">After (Proposed Fix)</div>
                          <pre className="text-emerald-300 whitespace-pre-wrap">{audit.diffs[activeTabDiff].patchedSnippet}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: FINAL SYNTHESIZED CODE */}
              <div className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                  <div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded-full text-[11px] font-bold inline-block">
                      STEP 3: FINAL SYNTHESIZED CODE
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Complete corrected file content ready for deployment.
                    </p>
                  </div>

                  {audit.diffs[activeTabDiff] && (
                    <button
                      onClick={() => copyFinalCode(audit.diffs[activeTabDiff].fullCorrectedCode || audit.diffs[activeTabDiff].patchedSnippet, activeTabDiff)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      {copiedIndex === activeTabDiff ? 'Copied to Clipboard!' : 'Copy Code'}
                    </button>
                  )}
                </div>

                {audit.diffs[activeTabDiff] && (
                  <div className="space-y-3">
                    <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-color)] text-xs space-y-1">
                      <div className="flex justify-between items-center font-mono">
                        <span>File: <a href={`https://github.com/${audit.owner}/${audit.repo}/blob/master/${encodeURIComponent(audit.diffs[activeTabDiff].filePath).replace(/%2F/g, '/')}`} target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline">{audit.diffs[activeTabDiff].filePath} ↗</a></span>
                        <span className="text-[10px] text-emerald-500 font-bold">COMPLETE CORRECTED FILE</span>
                      </div>
                      <p className="text-[var(--text-secondary)] text-[11px]">
                        <strong>Summary of Changes:</strong> {audit.diffs[activeTabDiff].changeSummary || 'Applied parameterized input validation and security refactoring.'}
                      </p>
                      {audit.diffs[activeTabDiff].validationResults && (
                        <p className="text-emerald-400 text-[11px] font-mono">
                          <strong>Validation Results:</strong> {audit.diffs[activeTabDiff].validationResults}
                        </p>
                      )}
                    </div>

                    {/* Complete Corrected Code Block */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/30 font-mono text-xs overflow-x-auto">
                      <div className="text-emerald-400 font-bold mb-2 pb-1 border-b border-emerald-900/30 text-[10px] uppercase">
                        Complete Corrected Code ({audit.diffs[activeTabDiff].filePath})
                      </div>
                      <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed">
                        {audit.diffs[activeTabDiff].fullCorrectedCode || audit.diffs[activeTabDiff].patchedSnippet}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 4: APPLY CHANGES TO GITHUB */}
              <div className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="border-b border-[var(--border-color)] pb-3 space-y-1.5">
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full text-[11px] font-bold inline-block">
                    STEP 4: APPLY CHANGES TO GITHUB
                  </span>

                  <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] pt-1">
                    Do you want to apply these changes to your GitHub repository?
                  </h3>
                </div>

                {/* EXACTLY TWO TEXT-ONLY ACTION BUTTONS (NO SYMBOLS, NO ICONS, NO EMOJIS) */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    onClick={handleApplyToGithub}
                    disabled={isPushing}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs transition-all ${
                      githubChoice === 'github'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    }`}
                  >
                    {isPushing ? 'Applying Changes to GitHub...' : 'Yes, Apply Changes to GitHub'}
                  </button>

                  <button
                    onClick={() => {
                      setGithubChoice('showcode');
                      setPushStatusMsg(null);
                    }}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs transition-all ${
                      githubChoice === 'showcode'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-sidebar)]'
                    }`}
                  >
                    No, Just Show Code
                  </button>
                </div>

                {pushStatusMsg && (
                  <div className="bg-purple-950/40 border border-purple-800/40 text-purple-300 p-3 rounded-xl text-xs flex items-center justify-between mt-2">
                    <span>{pushStatusMsg}</span>
                    {audit.prUrl && (
                      <a
                        href={audit.prUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold"
                      >
                        View PR
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
