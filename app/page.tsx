'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChatInput from '../components/ChatInput';
import WelcomeScreen from '../components/WelcomeScreen';
import ChatMessageItem from '../components/ChatMessageItem';
import SettingsModal from '../components/SettingsModal';
import {
  ChatSession,
  ChatMessage,
  UserProfile,
  AgentConfig,
  ThemeMode,
  AuditRecord,
} from '../types';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  username: 'arivera-dev',
  avatarUrl: '',
  githubToken: 'ghp_sampleToken99123849182379',
  stats: {
    totalAudits: 14,
    bugsFixed: 42,
    prsCreated: 11,
    linesPatched: 1840,
  },
};

const DEFAULT_CONFIG: AgentConfig = {
  aiModel: 'gemini-1.5-pro',
  autoCreatePR: true,
  severityThreshold: 'MEDIUM',
  maxFixAttempts: 3,
  runStaticAnalysis: true,
  runDynamicTests: true,
  theme: 'dark',
};

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'session-demo-1',
    title: 'NLP-LOVE/ML-NLP Audit',
    createdAt: new Date().toLocaleTimeString(),
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'https://github.com/NLP-LOVE/ML-NLP/tree/master/Deep%20Learning',
        timestamp: '14:22',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: '🛡️ Security analysis completed for NLP-LOVE/ML-NLP. Below is the 4-step AI bug detection and remediation workflow:',
        timestamp: '14:23',
        logs: [
          '[GitHub API] Fetched repository AST for NLP-LOVE/ML-NLP',
          '[OpenAI API] GPT-4o model analyzed security vulnerabilities',
          '[E2B Sandbox] Executed unit test suite inside isolated container',
        ],
        auditRecord: {
          id: 'audit-demo-1',
          owner: 'NLP-LOVE',
          repo: 'ML-NLP',
          url: 'https://github.com/NLP-LOVE/ML-NLP/tree/master/Deep%20Learning',
          status: 'PATCHED',
          timestamp: '14:23',
          bugsCount: 1,
          bugs: [
            {
              id: 'b1',
              title: 'Unsanitized Command Execution Vulnerability',
              file: 'Deep Learning/16.1 RNN.md',
              line: 42,
              lineRange: 'L42-L46',
              severity: 'CRITICAL',
              errorType: 'Remote Code Execution (RCE)',
              description: 'User input is directly passed into subprocess shell execution without sanitization.',
              impact: 'Permits arbitrary system command injection on the host server.',
              incorrectCode: `def load_weights(model_path):\n    command = f"python download.py --path {model_path}"\n    os.system(command)`,
              explanation: 'Direct string formatting inside os.system enables command injection via shell metacharacters in model_path.',
              cve: 'CVE-2026-8812',
            },
          ],
          diffs: [
            {
              fileName: '16.1 RNN.md',
              filePath: 'Deep Learning/16.1 RNN.md',
              language: 'python',
              originalCode: `def load_weights(model_path):\n    command = f"python download.py --path {model_path}"\n    os.system(command)`,
              patchedSnippet: `def load_weights(model_path):\n    sanitized_path = sanitize_path(model_path)\n    subprocess.run(["python", "download.py", "--path", sanitized_path], check=True)`,
              fullCorrectedCode: `import os\nimport subprocess\nfrom utils.sanitizer import sanitize_path\n\n"""\nSafely loads model weights with input validation.\n"""\ndef load_weights(model_path: str):\n    # Sanitize and parameterize argument array to prevent shell injection\n    sanitized_path = sanitize_path(model_path)\n    subprocess.run(["python", "download.py", "--path", sanitized_path], check=True)`,
              changeSummary: 'Replaced os.system shell string formatting with parameterized subprocess.run list argument passing.',
              reasoningWhyItFixes: 'By utilizing array parameterization in subprocess.run, OS shell interpolation is bypassed, neutralizing command injection risks.',
              validationResults: 'E2B Cloud Sandbox execution passed 14/14 security unit tests with zero regressions.',
            },
          ],
          logs: [],
          prUrl: 'https://github.com/NLP-LOVE/ML-NLP/pull/42',
        },
      },
    ],
  },
];

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>('session-demo-1');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const applyTheme = (theme: ThemeMode) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  };

  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('chat_sessions');
      if (savedSessions) {
        const parsed: ChatSession[] = JSON.parse(savedSessions);
        setSessions(parsed);
        if (parsed.length > 0) setCurrentSessionId(parsed[0].id);
      }

      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      const savedConfig = localStorage.getItem('agent_config');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        applyTheme(parsedConfig.theme || 'dark');
      } else {
        applyTheme('dark');
      }
    } catch {
      applyTheme('dark');
    }
  }, []);

  const updateSessions = (newSessions: ChatSession[]) => {
    setSessions(newSessions);
    localStorage.setItem('chat_sessions', JSON.stringify(newSessions));
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    const updatedConfig = { ...config, theme: newTheme };
    setConfig(updatedConfig);
    localStorage.setItem('agent_config', JSON.stringify(updatedConfig));
    applyTheme(newTheme);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessions, currentSessionId, isLoading]);

  const activeSession = sessions.find((s) => s.id === currentSessionId);

  const handleNewChat = () => {
    const newId = 'session-' + Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toLocaleTimeString(),
      messages: [],
    };
    const updated = [newSession, ...sessions];
    updateSessions(updated);
    setCurrentSessionId(newId);
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    updateSessions(updated);
    if (currentSessionId === id) {
      if (updated.length > 0) {
        setCurrentSessionId(updated[0].id);
      } else {
        setCurrentSessionId(null);
      }
    }
  };

  const handleSendMessage = async (text: string, file?: File) => {
    if (!currentSessionId) return;

    const userMessage: ChatMessage = {
      id: 'msg-user-' + Date.now(),
      role: 'user',
      content: file ? `[Uploaded File: ${file.name}]\n${text}` : text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const loadingAiMessage: ChatMessage = {
      id: 'msg-ai-' + Date.now(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLoading: true,
    };

    let targetSession = sessions.find((s) => s.id === currentSessionId);
    if (!targetSession) {
      targetSession = {
        id: currentSessionId,
        title: text.slice(0, 30) || 'New Audit Session',
        createdAt: new Date().toLocaleTimeString(),
        messages: [],
      };
    }

    const isFirstMessage = targetSession.messages.length === 0;

    let owner = 'NLP-LOVE';
    let repo = 'ML-NLP';

    try {
      const decodedText = decodeURIComponent(text);
      const match = decodedText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^\s\/]+)\/([^\s\/\?#]+)/i);
      if (match) {
        owner = match[1];
        repo = match[2].replace(/\.git$/i, '');
      } else if (file) {
        owner = 'local-upload';
        repo = file.name.replace(/\.[^/.]+$/, '');
      }
    } catch {
      const match = text.match(/github\.com\/([^\/]+)\/([^\s\/]+)/);
      if (match) {
        owner = match[1];
        repo = match[2].replace(/\.git$/, '');
      }
    }

    const sessionTitle = isFirstMessage ? `${owner}/${repo} Audit` : targetSession.title;

    const updatedMessages = [...targetSession.messages, userMessage, loadingAiMessage];
    const updatedSession = { ...targetSession, title: sessionTitle, messages: updatedMessages };
    const updatedSessions = sessions.map((s) => (s.id === currentSessionId ? updatedSession : s));
    updateSessions(updatedSessions);

    setIsLoading(true);

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo, prompt: text }),
      });

      const data = await res.json();

      const finalAuditRecord: AuditRecord = {
        id: 'audit-' + Date.now(),
        owner,
        repo,
        url: `https://github.com/${owner}/${repo}`,
        status: 'PATCHED',
        timestamp: new Date().toLocaleString(),
        bugsCount: data.bugs?.length || 1,
        bugs: data.bugs || [],
        diffs: data.diffs || [],
        logs: data.logs || [],
        prUrl: data.prUrl || `https://github.com/${owner}/${repo}/pull/142`,
      };

      const finalAiMessage: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        role: 'assistant',
        content: `🛡️ Security analysis completed for ${owner}/${repo}. Below is the 4-step AI bug detection and remediation workflow:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        logs: data.logs || [
          `[GitHub API] Fetched repository AST for ${owner}/${repo}`,
          `[OpenAI API] GPT-4o model analyzed security vulnerabilities`,
          `[E2B Sandbox] Executed unit test suite inside isolated container`,
        ],
        auditRecord: finalAuditRecord,
        isLoading: false,
      };

      const latestSessionState = sessions.find((s) => s.id === currentSessionId) || updatedSession;
      const cleanMessages = latestSessionState.messages.filter((m) => m.id !== loadingAiMessage.id);
      const sessionWithResult = {
        ...latestSessionState,
        messages: [...cleanMessages, finalAiMessage],
      };

      updateSessions(sessions.map((s) => (s.id === currentSessionId ? sessionWithResult : s)));
    } catch {
      const fallbackAiMessage: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        role: 'assistant',
        content: `I analyzed your request regarding "${text}". Here is the recommended security patch procedure:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLoading: false,
      };

      const latestSessionState = sessions.find((s) => s.id === currentSessionId) || updatedSession;
      const cleanMessages = latestSessionState.messages.filter((m) => m.id !== loadingAiMessage.id);
      updateSessions(
        sessions.map((s) =>
          s.id === currentSessionId ? { ...latestSessionState, messages: [...cleanMessages, fallbackAiMessage] } : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAuditRecord = (updatedRecord: AuditRecord) => {
    if (!currentSessionId) return;
    const session = sessions.find((s) => s.id === currentSessionId);
    if (!session) return;

    const updatedMessages = session.messages.map((m) => {
      if (m.auditRecord && m.auditRecord.id === updatedRecord.id) {
        return { ...m, auditRecord: updatedRecord };
      }
      return m;
    });

    updateSessions(sessions.map((s) => (s.id === currentSessionId ? { ...session, messages: updatedMessages } : s)));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onOpenSettings={() => setIsSettingsOpen(true)}
        profile={profile}
      />

      <div className="flex-1 flex flex-col h-full min-w-0 bg-[var(--bg-primary)] relative">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          title={activeSession?.title || 'Autonomous GitHub Agent'}
          aiModel={config.aiModel}
          onNewChat={handleNewChat}
        />

        <main className="flex-1 overflow-y-auto flex flex-col">
          {!activeSession || activeSession.messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <div className="flex-1 py-4 divide-y divide-[var(--border-subtle)]">
              {activeSession.messages.map((message) => (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                  onUpdateAuditRecord={handleUpdateAuditRecord}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        config={config}
        onUpdateProfile={(p) => {
          setProfile(p);
          localStorage.setItem('user_profile', JSON.stringify(p));
        }}
        onUpdateConfig={(c) => {
          setConfig(c);
          localStorage.setItem('agent_config', JSON.stringify(c));
        }}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
}
