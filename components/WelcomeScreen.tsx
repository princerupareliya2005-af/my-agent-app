'use client';

import React from 'react';

export default function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto space-y-4 my-auto">
      {/* Security Agent Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl shadow-xl shadow-blue-500/20 mx-auto mb-2">
        🛡️
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
        Ask a Question or Analyze a GitHub Repository
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
        Ask questions about your project or paste a GitHub repository URL to analyze the codebase, detect security vulnerabilities, and identify bugs.
      </p>
    </div>
  );
}
