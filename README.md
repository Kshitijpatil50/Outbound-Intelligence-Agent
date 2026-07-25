# Outbound Intelligence Agent

An AI-powered B2B Outbound BDR (Business Development Representative) agent pipeline featuring live **Google Search Grounding** for automated account research, executive contact discovery, deep research brief generation, and role-tailored hyper-personalized outreach.

---

## 🚀 Key Features

### 📡 4-Stage Grounded AI Outbound Pipeline

1. **Stage 1: Grounded Account Discovery**
   - Discovers target accounts aligned with reference ICP profiles using live Google Search grounding.
   - Computes an **ICP Fit Score (0-100)** with visual radial indicators and provides transparent reasoning traces ("Why Selected").
   - Captures HQ country, operational commodities, scale footprint, and grounded source citations.

2. **Stage 2: Verified Executive Contact Discovery**
   - Identifies real decision-makers (Safety Directors, VP Operations, Asset Integrity Managers) with verified titles, LinkedIn profiles, and business email patterns.
   - Includes automated **Safety Skip Guards** to prevent fabricated outreach if no verified contact is found.
   - Provides a **Send-Ready Verification Checklist** verifying domain validity, title match, and email deliverables.

3. **Stage 3: Account Intelligence Briefs**
   - Synthesizes deep research briefs incorporating recent news, operational footprint, vendor fit signals, and safety/automation priorities.
   - Interactive brief editor allowing BDRs to refine intelligence before email generation.

4. **Stage 4: Hyper-Personalized Role Outreach**
   - Drafts individual, non-templated cold emails (under 125 words) tailored to the decision-maker's specific role pain points.
   - Weaves in account-specific operational facts and customer proof points.
   - Evaluates a **Personalization Quality Score (0-100)** and supports one-click AI email regeneration with custom BDR instructions.

### 🛡️ Built-in BDR Trust & Verification System
- **Grounding Citations**: Full source URLs and citations from Google Search results.
- **Search Process Logs**: Step-by-step audit trail showing search queries executed by the AI agent.
- **Export Capabilities**: One-click export to **Formatted Markdown**, **JSON**, or **CSV** (including Company Name, Contact Name, Email, Brief Summary, Title, ICP Score, and Email Drafts).
- **Campaign History & Notifications**: Local persistence for previous campaign runs and real-time activity notifications.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons, Framer Motion (`motion/react`)
- **Backend**: Node.js, Express, Server-Sent Events (SSE) for real-time progress streaming
- **AI Engine**: Google Gemini API (`@google/genai`) with Google Search Grounding (`googleSearch` tool)
- **Language**: TypeScript

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Environment Configuration

Create a `.env` file in the root directory (or set environment variables in your deployment setup):

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/outbound-intelligence-agent.git
   cd outbound-intelligence-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000` to access the application.

---

## 📜 Available Scripts

- `npm run dev` - Starts the backend server with hot-reloading via `tsx`
- `npm run build` - Bundles the Vite frontend and compiles `server.ts` into CommonJS using `esbuild`
- `npm run start` - Runs the production server (`node dist/server.cjs`)
- `npm run lint` - Executes TypeScript type checking (`tsc --noEmit`)

---

## 📁 Project Structure

```
├── server.ts                   # Express server with Gemini API & SSE pipeline logic
├── src/
│   ├── App.tsx                 # Main application dashboard & pipeline orchestrator
│   ├── components/             # UI components
│   │   ├── Stage1AccountsCard.tsx     # Stage 1 Account Discovery UI
│   │   ├── Stage2ContactsCard.tsx     # Stage 2 Contact Verification UI
│   │   ├── Stage3BriefsCard.tsx       # Stage 3 Research Brief UI
│   │   ├── Stage4EmailsCard.tsx       # Stage 4 Email Generation UI
│   │   ├── PipelineFlowVisualizer.tsx # Animated pipeline progress visualizer
│   │   ├── ExportModal.tsx            # Multi-format export dialog (Markdown, JSON, CSV)
│   │   └── TrustVerificationBadge.tsx # Citation, confidence, & process audit components
│   ├── data/                   # Default ICP presets and campaign configurations
│   └── types.ts                # Shared TypeScript interfaces
├── metadata.json               # Application metadata
└── package.json                # Dependencies and build scripts
```

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
