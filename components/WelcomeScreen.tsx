'use client';

import React from 'react';

interface WelcomeScreenProps {
  onSelectDemo?: (repoUrl: string) => void;
}

export default function WelcomeScreen({ onSelectDemo }: WelcomeScreenProps) {
  const demoRepos = [
    {
      title: 'expressjs/express',
      desc: 'HTTP Header Injection & Response Splitting Audit',
      url: 'https://github.com/expressjs/express',
      badge: 'HIGH RISK',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    },
    {
      title: 'NLP-LOVE/ML-NLP',
      desc: 'Deep Learning Model Path Traversal & Weight Audit',
      url: 'https://github.com/NLP-LOVE/ML-NLP',
      badge: 'CRITICAL',
      color: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    },
    {
      title: 'princerupareliya2005-af/test',
      desc: 'Python NameError, Typo & Subprocess RCE Audit',
      url: 'https://github.com/princerupareliya2005-af/test',
      badge: 'VERIFIED REPO',
      color: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto space-y-6 my-auto">
      {/* Security Agent Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl shadow-xl shadow-blue-500/20 mx-auto mb-1">
        🛡️
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
        Ask a Question or Analyze a GitHub Repository
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
        Autonomous AI Security Agent powered by GPT-4o AST Reasoning & E2B Cloud Sandboxes. Paste a GitHub repository URL or select a 1-click hackathon demo below:
      </p>

      {/* 1-Click Demo Repository Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full pt-2">
        {demoRepos.map((demo, idx) => (
          <button
            key={idx}
            onClick={() => onSelectDemo && onSelectDemo(demo.url)}
            className="flex flex-col items-start text-left p-3.5 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-blue-500/40 rounded-2xl transition-all shadow-sm group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="font-mono text-xs font-bold text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">
                {demo.title}
              </span>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${demo.color}`}>
                {demo.badge}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
              {demo.desc}
            </p>
            <span className="text-[10px] font-bold text-blue-500 mt-2 inline-flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
              <span>Run Audit Demo</span>
              <span>➔</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
