# 🛡️ Autonomous GitHub Bug Patch Agent

> **AI-Driven Autonomous Vulnerability Detection, Sandbox Verification, and Direct GitHub Remediation**

---

## 👥 Project Presenters
* **Chovatiya Khushi** (ID: `202302626010085`)
* **Rupareliya Prince** (ID: `202302626010110`)

---

## 📌 Project Overview & Presentation Deck

### 🚨 1. Problem Statement
* **Over 80% of repositories have unpatched bugs**: Security vulnerabilities such as RCE, command injection, memory leaks, and response splitting lurk in open-source and production codebases (per industry reports from Snyk and OWASP on open-source dependency risk).
* **Manual patching is slow and expensive**: Identifying bugs, analyzing root causes, writing patches, testing for regressions, and creating pull requests manually takes developers hours or days.
* **Alert fatigue without solutions**: Scanners like Dependabot and SAST tools flag security warnings but do not write or test the fix, leaving developers overwhelmed.

---

### 🛡️ 2. Our Solution
1. **Autonomous End-to-End Security Repair Agent**: An AI agent that finds security bugs, explains them, fixes them, verifies in a cloud sandbox, and commits the patch directly to GitHub.
2. **Instant Repository Audit**: Paste any GitHub repository URL (or upload a ZIP archive) to get an automated 4-step remediation plan in seconds.
3. **Verified Patches via Cloud Sandbox**: Uses cloud-isolated execution containers (E2B) to test synthesized patches before pushing to production.
4. **One-Click GitHub Remediation**: Updates target files directly on GitHub with zero manual code copying needed.

---

### ⚙️ 3. System Architecture & Tech Stack
```text
[ GitHub URL / ZIP Archive ]
             ↓
[ Octokit GitHub REST API ] (Fetches file tree & code)
             ↓
[ OpenAI GPT-4o Engine ] (AST reasoning & patch synthesis)
             ↓
[ E2B Cloud Sandbox ] (Isolated testing & verification)
             ↓
[ Next.js + Tailwind UI ] (4-step remediation interface)
             ↓
[ Direct GitHub Commit / PR ] (1-click patching)
```

* **Frontend**: Next.js 15 · React 19 · TypeScript · Tailwind CSS
* **AI Core Engine**: OpenAI GPT-4o (`@ai-sdk/openai`)
* **Cloud Code Interpreter**: E2B Cloud Sandbox (`@e2b/code-interpreter`)
* **GitHub Integration**: Octokit REST API (`@octokit/rest`)

---

### 🔄 4. The 4-Step Autonomous Workflow
* **STEP 1: Code Error Details** — Identifies file path, line range, error type, severity, problematic code, and security impact.
* **STEP 2: How AI Agents Can Fix It** — Explains root-cause analysis (`incorrect code → problem → proposed fix`) with a side-by-side before/after diff.
* **STEP 3: Final Synthesized Code** — Synthesizes the complete corrected, production-ready file with a change summary and E2B validation results.
* **STEP 4: Apply Changes to GitHub** — Asks: apply changes to your GitHub repository, or just show the code — user stays in control.

---

### ✨ 5. Key Features
* **ChatGPT-Style AI Interface**: Collapsible sidebar, chat history persistence, settings panel, dark/light theme toggles.
* **Real-Time Codebase Inspection**: Queries the GitHub API to read actual code files from public and private repos.
* **Isolated Cloud Sandbox Validation**: Executes code inside E2B Cloud Sandboxes to verify zero regressions.
* **Multi-Language Support**: Audits Python, JavaScript/TypeScript, Markdown, and config files.
* **One-Click GitHub Commits**: Pushes patches directly to GitHub with custom Personal Access Token (PAT) support.

---

### 💎 6. What Makes Our Project Unique (USP)

| Dependabot / Snyk / SAST Scanners | Our Autonomous AI Security Agent |
| :--- | :--- |
| Only flags errors (no auto-fix) | Autonomously writes complete corrected code patches |
| No execution verification | Verifies patches in E2B Cloud Sandboxes before pushing |
| Manual PR creation required | 1-click direct GitHub commit and PR push |
| Text-heavy complex log outputs | Structured 4-step ChatGPT-style user experience |
| Cannot reason about custom logic | Deep AST reasoning powered by OpenAI GPT-4o |

---

### ⚠️ 7. Known Limitations & Mitigations

| Limitation | How We Mitigate It |
| :--- | :--- |
| Very large repositories may exceed model context limits | Audits are scoped file-by-file, and users can target specific paths instead of the full repo |
| Currently supports Python, JS/TS, Markdown and config files only | Additional language support (Java, Go, C++) is planned in the roadmap |
| AI-generated patches can occasionally be imperfect | No auto-merge: every patch is sandbox-tested and requires explicit user approval before commit |
| Not a replacement for a full manual security audit | Positioned to augment, not replace, existing SAST tools and human security review |
| Depends on GPT-4o API availability and cost | Roadmap includes support for self-hosted / enterprise LLMs to reduce dependency |

---

## 🚀 Getting Started Locally

```bash
# Clone repository
git clone https://github.com/princerupareliya2005-af/my-agent-app.git
cd my-agent-app

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
