# RecoverAI — AI Revenue Recovery Agent

> An AI-powered revenue recovery agent that detects revenue at risk, diagnoses failure causes, selects the right intervention, and executes bounded recovery workflows with deterministic safety controls.

**Built for Razorpay AI Builder Internship 2026 — Track 03: AI Revenue Recovery**

## 🚀 Live Demo

👉 https://recover-ai-ai-revenue-recovery-agen.vercel.app/

## 💻 Start the Development Server (Local Host)

```bash
npm run dev
🎯 What is RecoverAI?

Failed payments and delayed receivables create revenue leakage for businesses.

RecoverAI acts as an AI-assisted revenue recovery agent that:

Detects revenue-risk incidents
Diagnoses the root cause
Determines the most appropriate intervention
Executes bounded recovery actions
Creates Promise-to-Pay commitments when appropriate
Stops unsafe or exhausted recovery attempts
Escalates cases requiring manual intervention
Records recovery decisions through an audit trail
Measures actual recovery outcomes

The system is designed around one principle:

AI reasons about recovery. Deterministic controls decide what the agent is allowed to execute.

🧠 How It Works
Revenue Incident
       ↓
Risk Detection
       ↓
AI Diagnosis
(Groq GPT-OSS-20B)
       ↓
Recovery Decision
       ↓
Deterministic Safety Engine
       ↓
Bounded Intervention
       ↓
┌──────────────┬──────────────┬──────────────┐
│ Payment      │ Promise-to-  │ Stop /       │
│ Retry        │ Pay (PTP)    │ Escalate     │
└──────────────┴──────────────┴──────────────┘
       ↓
Audit Trail
       ↓
Recovery Metrics
📊 Recovery Metrics

RecoverAI tracks recovery performance across monitored revenue-risk incidents, including:

Revenue recovered
Recovery rate
Recovered accounts
Active revenue exposure
Promise-to-Pay commitments
Committed recovery coverage
High-risk cases stopped
Protected exposure

All payment execution shown in the demo is simulated.

🏗️ System Architecture
┌──────────────────────┐
│   Revenue Incidents  │
│ Payments / B2B / UPI │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    Risk Detection    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   Groq GPT-OSS-20B   │
│   AI Diagnosis       │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Recovery Decision    │
└──────────┬───────────┘
           ↓
┌────────────────────────────┐
│ Deterministic Safety Engine│
│                            │
│ • Retry limits             │
│ • Duplicate prevention    │
│ • Hard-decline stopping   │
│ • Risk escalation         │
│ • Audit logging            │
└──────────┬─────────────────┘
           ↓
┌────────────────────────────┐
│     Recovery Actions        │
│                            │
│ • Payment Retry             │
│ • Promise-to-Pay            │
│ • Credential Update         │
│ • Stop & Escalate           │
└──────────┬─────────────────┘
           ↓
┌──────────────────────┐
│    Audit Trail       │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  Recovery Analytics  │
└──────────────────────┘
🛡️ Safety-First Recovery

The LLM does not have unrestricted control over recovery execution.

The deterministic safety layer validates recovery decisions before an action is executed.

AI Recommendation
       ↓
Safety Validation
       ↓
┌───────────────┐
│ Allowed?      │
└───────┬───────┘
        │
   ┌────┴────┐
   ↓         ↓
 YES         NO
   ↓         ↓
Execute    Stop /
Action     Escalate
   ↓
Audit Event

This prevents uncontrolled retries, duplicate recovery actions, and unsafe continuation of high-risk cases.

💳 Recovery Interventions
Intervention	Purpose
Payment Retry	Retry eligible failed payments
Promise-to-Pay	Capture a commitment for delayed B2B receivables
Credential Update	Request updated payment credentials
Stop & Escalate	Safely terminate recovery when further automation is unsafe
🤝 Promise-to-Pay (PTP)

For B2B receivables and delayed invoice payments, RecoverAI can create a Promise-to-Pay commitment.

A PTP records:

Customer/account
Outstanding amount
Promised payment date
Commitment status
Recovery coverage

This allows the system to distinguish between an immediately recoverable payment and a receivable that requires a committed future payment.

🔄 Mandate Retry Sequencer

The Mandate Retry Sequencer manages eligible recurring-payment recovery attempts.

It provides:

Bounded retry attempts
Retry scheduling
Retry status tracking
Failure reason handling
Stopping rules
Audit events

The sequencer prevents the agent from repeatedly attempting the same failed payment beyond the configured limit.

📋 Audit Trail

Every important recovery decision and execution event is recorded in the audit trail.

Typical events include:

Risk detected
AI diagnosis
Recovery decision
Retry attempted
PTP created
Recovery succeeded
Recovery stopped
Case escalated

This makes the recovery workflow explainable and traceable.

🤖 AI Architecture

RecoverAI uses Groq GPT-OSS-20B for AI-assisted diagnosis.

The model analyzes incident context such as:

Failure reason
Payment history
Retry count
Customer history
Payment channel
Risk level

The AI produces a recovery recommendation, while the deterministic safety engine controls whether that recommendation can actually be executed.

🔐 AI Fallback

If the Groq AI service is unavailable, RecoverAI can fall back to deterministic recovery rules.

This ensures that the system remains functional without depending completely on an external LLM.

Groq GPT-OSS-20B
       │
       │ Available
       ↓
AI Diagnosis
       │
       ↓
Safety Engine

       │
       │ Unavailable
       ↓
Deterministic Rules Engine
       │
       ↓
Safety Engine
🎙️ Hinglish Voice Recovery Studio

RecoverAI includes a Hinglish recovery communication studio for demonstrating customer-recovery conversations.

It can simulate:

Recovery messaging
Payment reminders
Promise-to-Pay conversations
Customer responses
Recovery outcomes

Voice interactions are simulated for demonstration purposes and do not place real customer calls.

📊 Dashboard

The dashboard provides a centralized view of:

Revenue at risk
Active recovery cases
Recovered revenue
Recovery rate
PTP commitments
Protected exposure
High-risk stopped cases
Recovery queue

The goal is to provide a clear operational view of where revenue is being recovered and where automation should stop.

🧰 Tech Stack

Frontend

React
TypeScript
Vite

Backend

Node.js
Express

AI

Groq
GPT-OSS-20B

Tools

VS Code
Git
GitHub
Vercel
📁 Project Structure
RecoverAI-AI-Revenue-Recovery-Agent/
│
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── MetricsOverview.tsx
│   │   ├── IncidentList.tsx
│   │   ├── IncidentDetail.tsx
│   │   ├── MandateSequencerView.tsx
│   │   ├── PtpTrackerView.tsx
│   │   ├── ComplianceShieldView.tsx
│   │   ├── VoiceStudioView.tsx
│   │   └── VoiceSimulatorModal.tsx
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── utils/
│   │   └── audit.ts
│   │
│   ├── data/
│   │   └── mockIncidents.ts
│   │
│   ├── App.tsx
│   ├── types.ts
│   └── main.tsx
│
├── server.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── metadata.json
├── .env.example
├── .gitignore
└── README.md
🚀 Run Locally
Prerequisites
Node.js 18+
npm
Git
Groq API key
1. Clone the repository
git clone https://github.com/PSRIKRUTHIN/RecoverAI-AI-Revenue-Recovery-Agent.git
cd RecoverAI-AI-Revenue-Recovery-Agent
2. Install dependencies
npm install
3. Configure environment variables

Create a .env file:

GROQ_API_KEY=your_groq_api_key
4. Start the development server
npm run dev

Open:

http://localhost:5173
🌐 Live Application

https://recover-ai-ai-revenue-recovery-agen.vercel.app/

🔗 Project Links

GitHub

https://github.com/PSRIKRUTHIN/RecoverAI-AI-Revenue-Recovery-Agent

Live Demo

https://recover-ai-ai-revenue-recovery-agen.vercel.app/

⚙️ Challenges & Solutions
Preventing uncontrolled retries

An early version of the recovery workflow could potentially repeat payment retries beyond the intended limit.

This was addressed using deterministic retry limits and stopping rules outside the AI decision layer.

Handling different failure scenarios

RecoverAI handles different recovery situations such as:

Insufficient funds
Expired cards
Hard declines
Mandate failures
Authentication failures
B2B procurement holds

Different situations can result in different interventions such as retry, PTP, credential update, or escalation.

AI reliability

The AI diagnosis layer is supported by a deterministic rules fallback so that recovery logic remains available even when the LLM is unavailable.

Multi-currency recovery

The dashboard normalizes currencies into USD-equivalent demo values for cross-currency aggregation.

These values are used only for demonstration and analytics.

⚠️ Demo Disclaimer

RecoverAI is a demonstration system built for the Razorpay AI Builder Internship 2026.

Payment execution is simulated.
No real money is transferred.
No real customer calls are placed.
Razorpay production APIs are not used for payment execution.
Compliance controls are illustrative and are not legal certification.
💡 Design Principle

AI should recommend recovery actions, but deterministic controls should decide what the system is allowed to execute.

RecoverAI applies this principle by separating:

AI Reasoning
     ↓
Decision
     ↓
Safety Controls
     ↓
Bounded Execution
     ↓
Audit
     ↓
Measurement
