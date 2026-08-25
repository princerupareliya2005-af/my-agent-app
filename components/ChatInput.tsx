'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string, file?: File) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-adjust height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = text.trim();
    if ((!trimmed && !selectedFile) || isLoading) return;

    onSendMessage(trimmed, selectedFile || undefined);
    setText('');
    setSelectedFile(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-2">
      {/* File Preview Badge if attached */}
      {selectedFile && (
        <div className="mb-2 inline-flex items-center space-x-2 px-3 py-1.5 bg-[var(--bg-chat-user)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)]">
          <span>📁 {selectedFile.name}</span>
          <button
            onClick={() => setSelectedFile(null)}
            className="text-[var(--text-muted)] hover:text-rose-500 font-bold ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Input Card */}
      <div className="relative flex items-center bg-[var(--bg-input)] border border-[var(--border-color)] focus-within:border-blue-500 rounded-2xl shadow-lg transition-all">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".zip,.tar,.gz,.js,.ts,.py,.json"
          className="hidden"
        />

        {/* Attachment Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          title="Upload project ZIP file"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Message AI..."
          rows={1}
          disabled={isLoading}
          className="flex-1 py-3 px-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none resize-none max-h-40 font-sans"
        />

        {/* Send Arrow Button */}
        <button
          onClick={handleSubmit}
          disabled={(!text.trim() && !selectedFile) || isLoading}
          className={`m-1.5 p-2.5 rounded-xl transition-all flex items-center justify-center ${
            text.trim() || selectedFile
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 transform active:scale-95'
              : 'bg-[var(--bg-sidebar)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-color)]'
          }`}
          title="Send Message"
          type="button"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-[11px] text-[var(--text-muted)] text-center mt-2">
        AI may produce inaccurate information about code vulnerabilities. Verify important patches.
      </p>
    </div>
  );
}
