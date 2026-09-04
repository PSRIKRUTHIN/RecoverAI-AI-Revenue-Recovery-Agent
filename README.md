# RecoverAI — AI Revenue Recovery Agent

> AI-powered revenue recovery system that detects revenue at risk, diagnoses root causes, selects bounded recovery actions, and safely stops or escalates high-risk cases.

## 🚀 Overview

RecoverAI is an AI Revenue Recovery Agent built for the **Razorpay AI Builder Internship 2026 — Track 03: AI Revenue Recovery**.

The system identifies revenue at risk across payment failures, subscription failures, checkout abandonment, mandate issues, and B2B receivables.

It combines **Groq GPT-OSS-20B** for AI-powered diagnosis with a **Deterministic Safety Engine** that controls what recovery actions can be executed.

The goal is not simply to retry failed payments. RecoverAI selects an appropriate intervention based on the incident context while enforcing bounded retries, stopping rules, escalation, and auditability.

---

## 🎯 Problem

Failed payments and delayed receivables create revenue leakage.

A revenue recovery system needs to determine:

- Which revenue is currently at risk?
- What caused the payment or collection failure?
- What recovery action is appropriate?
- Should the system retry the payment?
- Should it create a Promise-to-Pay commitment?
- Does the customer need to update payment credentials?
- When should automated recovery stop?
- When should the case be escalated?

RecoverAI addresses these questions through an **AI-assisted but safety-bounded recovery workflow**.

---

## 🧠 How RecoverAI Works

```text
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
Recovery / PTP / Escalation
       ↓
Audit Trail


🏗️ System Architecture

RecoverAI separates AI reasoning from deterministic execution controls.

                    ┌──────────────────────┐
                    │   Revenue Incidents  │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │   Risk Detection     │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │   Groq GPT-OSS-20B   │
                    │    AI Diagnosis      │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │  Recovery Decision   │
                    └──────────┬───────────┘
                               ↓
              ┌────────────────────────────────┐
              │   Deterministic Safety Engine │
              │                                │
              │ • Retry Limits                 │
              │ • Stopping Rules               │
              │ • Escalation                   │
              │ • Duplicate Prevention         │
              └───────────────┬────────────────┘
                              ↓
                 ┌────────────────────────┐
                 │ Recovery Intervention  │
                 └────────────┬───────────┘
                              ↓
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
        Payment Retry        PTP          Escalation
              ↓               ↓               ↓
              └───────────────┼───────────────┘
                              ↓
                    ┌──────────────────┐
                    │    Audit Trail   │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Recovery Metrics │
                    └──────────────────┘
🔄 Recovery Workflow

RecoverAI follows a bounded agentic recovery workflow.

Detect
  ↓
Diagnose
  ↓
Decide
  ↓
Validate
  ↓
Act
  ↓
Verify
  ↓
Recover / PTP / Escalate
  ↓
Audit
Step 1 — Detect

Identify revenue-risk incidents from payment failures, receivable delays, mandate issues, checkout abandonment, and related events.

Step 2 — Diagnose

Groq GPT-OSS-20B analyzes the incident and determines the likely root cause.

Step 3 — Decide

The system selects the most appropriate recovery intervention based on the incident context.

Step 4 — Validate

The Deterministic Safety Engine checks whether the proposed action is allowed.

Step 5 — Act

An eligible bounded intervention is executed.

Step 6 — Verify

The system records the outcome and updates the incident state.

Step 7 — Stop or Escalate

If the case reaches a retry limit, violates a safety rule, or requires manual handling, automated recovery stops.

🔄 Recovery Interventions

RecoverAI does not use the same recovery action for every incident.

Intervention	Use Case
Payment Retry	Recoverable payment failures
Promise-to-Pay	B2B receivables and delayed payments
Credential Update	Invalid or expired payment credentials
Stop & Escalate	High-risk or non-recoverable cases
🛡️ Safety & Stopping Rules

A major design goal is preventing an AI agent from repeatedly attempting unsafe or unnecessary actions.

The Deterministic Safety Engine enforces:

Maximum retry limits
Hard-decline stopping
High-risk escalation
Duplicate-action prevention
Bounded recovery workflows
Audit logging
Safe workflow termination
AI Recommendation
       ↓
Safety Validation
       ↓
   ┌───┴───┐
   ↓       ↓
Allowed  Blocked
   ↓       ↓
Execute   Stop
   ↓       ↓
Record   Escalate
Outcome

Core principle: AI reasons about recovery. Deterministic controls decide what the agent is allowed to execute.

📊 Dashboard

The RecoverAI dashboard provides visibility into the complete revenue recovery process.

It includes:

Recovery Queue
Batch Recovery
Money Recovered
Recovery Rate
Active Revenue Exposure
Promise-to-Pay Commitments
Stopping Rules
Protected Exposure
Incident-level recovery status
Audit events
💰 Demo Results

The current demo monitors 12 revenue-risk incidents.

Metric	Demo Result
Revenue-risk incidents	12
Money recovered	$2,512
Overall recovery rate	5.3%
Accounts recovered	4
Active exposure	$30,845
PTP commitments	2
PTP committed exposure	$4,882
Committed recovery coverage	15.6%
High-risk cases stopped	1
Protected exposure	$4,565

USD values are normalized demo equivalents for cross-currency aggregation. Payment execution is simulated.

📅 Promise-to-Pay (PTP) Tracker

The PTP Tracker handles receivables where repeated payment retries are not appropriate.

Each commitment records:

Customer/account
Promised amount
Due date
Commitment status
Recovery progress

This allows RecoverAI to use a collection workflow for B2B receivables instead of repeatedly retrying payments.

🔁 Mandate Retry Sequencer

The Mandate Retry Sequencer manages eligible recurring-payment failures through a controlled retry workflow.

It provides:

Bounded retry attempts
Retry sequencing
Attempt tracking
Recovery status
Stopping-rule enforcement
🗣️ Hinglish Voice Recovery Studio

RecoverAI includes a Hinglish Voice Recovery Studio for demonstrating customer communication during revenue recovery.

It supports recovery-oriented communication for scenarios such as:

Payment failure
Payment reminder
PTP follow-up
Credential update
Recovery confirmation

Voice recovery is a demo simulation and does not place real customer calls.

🧾 Audit Trail

RecoverAI records important recovery decisions and actions through an audit trail.

Audit events can include:

Incident detection
AI diagnosis
Selected intervention
Recovery action
Retry attempt
Stopping decision
Escalation
PTP creation
Recovery outcome

The audit trail provides visibility into what the agent decided, what action was taken, and why the workflow stopped or continued.

🤖 AI + Deterministic Safety

RecoverAI uses a hybrid architecture.

AI Layer
   ↓
Analyze Incident
   ↓
Recommend Intervention
   ↓
Deterministic Safety Engine
   ↓
Validate Action
   ↓
Execute Bounded Workflow
   ↓
Record Outcome

The AI model is responsible for reasoning and diagnosis.

The deterministic safety layer controls execution.

This prevents the LLM from having unrestricted control over revenue recovery actions.

🧠 AI Model

RecoverAI uses:

Groq GPT-OSS-20B

The model is used for:

Root-cause diagnosis
Incident analysis
Recovery recommendations
Explainable reasoning

A deterministic rules engine provides a fallback when AI diagnosis is unavailable.

Groq GPT-OSS-20B
        ↓
AI Diagnosis
        ↓
Recovery Recommendation
        ↓
Deterministic Safety Engine
        ↓
Allowed Action
🔌 AI Fallback

RecoverAI does not depend entirely on the availability of the AI model.

Incident
   ↓
Groq GPT-OSS-20B
   ↓
Available?
 ┌─┴─┐
YES  NO
 ↓    ↓
AI   Deterministic
     Rules Engine
  └───┬───┘
      ↓
Recovery Decision

This provides a deterministic fallback path for maintaining safe recovery behavior when AI diagnosis is unavailable.

📈 Recovery Measurement

RecoverAI focuses on measurable recovery outcomes rather than only generating recommendations.

The system tracks:

Revenue Monitored
       ↓
Revenue Recovered
       ↓
Recovery Rate
       ↓
Remaining Exposure
       ↓
PTP Commitments
       ↓
Stopped / Escalated Cases

This makes it possible to evaluate the effectiveness of the recovery workflow across a batch of incidents.

🧰 Tech Stack
AI / ML
Groq GPT-OSS-20B
Deterministic Rules Engine
Frontend
React
TypeScript
Vite
CSS
Backend
Node.js
Express
TypeScript
Development & Deployment
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
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── metadata.json
├── .env.example
├── .gitignore
└── README.md
💻 Run Locally
Prerequisites

Make sure you have:

Node.js 18+
npm
Git
Groq API key
1. Clone the Repository
git clone https://github.com/PSRIKRUTHIN/RecoverAI-AI-Revenue-Recovery-Agent.git
cd RecoverAI-AI-Revenue-Recovery-Agent
2. Install Dependencies
npm install
3. Configure Environment Variables

Create a .env file in the project root:

GROQ_API_KEY=your_groq_api_key

Replace your_groq_api_key with your own Groq API key.

Security: Never commit your .env file or expose your API key publicly.

4. Start the Development Server
npm run dev

The application will be available at:

http://localhost:5173

Open the URL in your browser to use RecoverAI locally.

🌐 Live Demo
🔗 RecoverAI Live Demo

https://recover-ai-ai-revenue-recovery-agen.vercel.app/

No local installation is required to view the deployed demo.

🔗 Project Links
Live Demo: https://recover-ai-ai-revenue-recovery-agen.vercel.app/
GitHub Repository: https://github.com/PSRIKRUTHIN/RecoverAI-AI-Revenue-Recovery-Agent
🚧 Challenges & Solutions
1. Preventing Repeated Recovery Actions

An early version of the workflow could potentially repeat the same payment retry or continue beyond the allowed retry limit.

Solution: Implemented bounded retries, deterministic stopping rules, escalation logic, and audit logging outside the LLM decision layer.

2. Handling Different Failure Types

Payment failures can have different causes, including:

Insufficient funds
Expired cards
Hard declines
Mandate failures
Authentication failures
B2B procurement holds

Solution: Implemented an intervention layer that selects different recovery actions based on the incident context.

3. AI Reliability

AI recommendations should not directly control sensitive recovery actions.

Solution: Groq GPT-OSS-20B is used for diagnosis and reasoning, while the Deterministic Safety Engine validates and bounds the final action.

4. Recovery Metrics

The dashboard needs to remain consistent with simulated recovery outcomes across different currencies and incident states.

Solution: Added batch-level recovery tracking, cross-currency demo normalization, PTP tracking, and explicit simulated-execution indicators.

📌 Project Status

Completed Demo

RecoverAI currently demonstrates:

AI-powered revenue diagnosis
Revenue-risk detection
Batch recovery
Bounded payment retries
Promise-to-Pay workflows
Stopping rules
Escalation
Audit trail
Recovery metrics
Hinglish voice recovery simulation
Groq GPT-OSS-20B integration
Vercel deployment
⚠️ Demo Disclaimer

RecoverAI is a demonstration project built for the Razorpay AI Builder Internship 2026 — Track 03: AI Revenue Recovery.

Payment execution is simulated.
No real customer payments are processed.
No real money is moved.
Voice recovery is simulated.
Compliance controls are illustrative and are not legal certification.
Demo metrics are based on the included incident dataset.
🎯 Design Principle

RecoverAI follows a simple principle:

AI for Reasoning
       +
Deterministic Controls
       ↓
Safe Agentic Recovery

The system demonstrates how AI can be used to make revenue recovery decisions while keeping automated execution bounded, explainable, auditable, and controllable.
