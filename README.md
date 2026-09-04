# 🚀 RecoverAI — AI Revenue Recovery Agent

> An AI-powered revenue recovery agent that detects revenue at risk, diagnoses failure causes, selects the right intervention, and executes bounded recovery workflows with deterministic safety controls.

**Built for Razorpay AI Builder Internship 2026 — Track 03: AI Revenue Recovery**

---

## 🌐 Live Demo

**Live Application:**  
https://recover-ai-ai-revenue-recovery-agen.vercel.app/

---

## 🎯 What is RecoverAI?

Failed payments and delayed receivables create significant revenue leakage for businesses.

**RecoverAI** is an AI-assisted revenue recovery agent designed to identify revenue-risk incidents, understand their causes, recommend suitable recovery actions, and execute only those actions permitted by deterministic safety controls.

### RecoverAI can:

- 🔍 Detect revenue-risk incidents
- 🧠 Diagnose the root cause of payment failures
- 🎯 Select the most appropriate recovery intervention
- ⚙️ Execute bounded recovery actions
- 🤝 Create Promise-to-Pay commitments
- 🛑 Stop unsafe or exhausted recovery attempts
- 👨‍💼 Escalate cases requiring manual intervention
- 📋 Maintain a complete audit trail
- 📊 Measure recovery outcomes

### Core Design Principle

> **AI reasons about recovery. Deterministic controls decide what the agent is allowed to execute.**

---

# 🧠 How It Works

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
┌─────────────────────────────────┐
│ Payment Retry │ PTP │ Escalate │
└─────────────────────────────────┘
       ↓
Audit Trail
       ↓
Recovery Metrics
```

---

# 🏗️ System Architecture

```text
┌──────────────────────────┐
│    Revenue Incidents     │
│ Payments / B2B / UPI     │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│      Risk Detection      │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│      AI Diagnosis        │
│    Groq GPT-OSS-20B      │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│    Recovery Decision     │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Deterministic Safety     │
│        Engine             │
│                          │
│ • Retry limits           │
│ • Duplicate prevention   │
│ • Hard-decline stopping  │
│ • Risk escalation        │
│ • Audit logging          │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│    Recovery Actions      │
│                          │
│ • Payment Retry           │
│ • Promise-to-Pay          │
│ • Credential Update       │
│ • Stop & Escalate         │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│       Audit Trail        │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│    Recovery Analytics    │
└──────────────────────────┘
```

---

# 🛡️ Safety-First Recovery

The LLM does **not** have unrestricted control over payment execution.

Instead, every AI recommendation passes through a deterministic safety layer before execution.

```text
AI Recommendation
       ↓
Safety Validation
       ↓
    Allowed?
     /     \
   YES      NO
    ↓       ↓
 Execute   Stop /
  Action   Escalate
    ↓
Audit Event
```

### Safety Controls

- Maximum retry limits
- Duplicate action prevention
- Hard-decline detection
- Risk-based escalation
- Recovery attempt tracking
- Audit logging
- Stopping rules

This architecture ensures that AI recommendations cannot directly bypass business or safety rules.

---

# 💳 Recovery Interventions

| Intervention | Purpose |
|---|---|
| **Payment Retry** | Retry eligible failed payments |
| **Promise-to-Pay** | Capture a future payment commitment |
| **Credential Update** | Request updated payment credentials |
| **Stop & Escalate** | Safely terminate automation when recovery is unsafe |

---

# 🤝 Promise-to-Pay

For B2B receivables and delayed invoice payments, RecoverAI can create a **Promise-to-Pay (PTP)** commitment.

A PTP records:

- Customer/account
- Outstanding amount
- Promised payment date
- Commitment status
- Recovery coverage

This allows the system to distinguish between immediately recoverable payments and receivables requiring a committed future payment.

---

# 🔄 Mandate Retry Sequencer

The Mandate Retry Sequencer manages eligible recurring-payment recovery attempts.

### Features

- Bounded retry attempts
- Retry scheduling
- Retry status tracking
- Failure reason handling
- Stopping rules
- Audit events

The sequencer prevents the system from repeatedly attempting the same failed payment beyond the configured limit.

---

# 📋 Audit Trail

Every important recovery decision and execution event is recorded.

### Example Events

```text
Risk Detected
     ↓
AI Diagnosis
     ↓
Recovery Decision
     ↓
Safety Validation
     ↓
Action Executed
     ↓
Recovery Outcome
```

Typical audit events include:

- Risk detected
- AI diagnosis
- Recovery decision
- Retry attempted
- Promise-to-Pay created
- Recovery succeeded
- Recovery stopped
- Case escalated

This makes the recovery workflow **traceable and explainable**.

---

# 📊 Recovery Metrics

RecoverAI tracks recovery performance across monitored revenue-risk incidents.

### Key Metrics

| Metric | Description |
|---|---|
| **Revenue Recovered** | Successfully recovered revenue |
| **Recovery Rate** | Percentage of monitored recovery opportunity recovered |
| **Recovered Accounts** | Accounts successfully recovered |
| **Active Revenue Exposure** | Revenue currently at risk |
| **PTP Commitments** | Promise-to-Pay commitments |
| **Committed Recovery Coverage** | Revenue covered by commitments |
| **High-Risk Cases Stopped** | Cases where automation was safely stopped |
| **Protected Exposure** | Revenue protected through controlled recovery |

---

# 📈 Current Demo Results

The deployed RecoverAI demo currently monitors simulated revenue-risk incidents and tracks recovery outcomes.

| Metric | Current Demo |
|---|---:|
| **Monitored Risks** | 12 |
| **Measured Money Recovered** | $2,512 |
| **Recovery Rate** | 5.3% |
| **Recovered Accounts** | 4 |
| **Active Revenue Exposure** | $30,845 |
| **PTP Commitments** | 2 |
| **PTP Committed Exposure** | $4,882 |
| **Committed Recovery Coverage** | 15.6% |
| **High-Risk Cases Stopped** | 1 |
| **Protected Exposure** | $4,565 |

> Dashboard amounts are normalized USD-equivalent demo values for cross-currency aggregation. Payment execution is simulated.

# 🤖 AI Architecture

RecoverAI uses **Groq GPT-OSS-20B** for AI-assisted diagnosis.

The model analyzes incident context such as:

- Failure reason
- Payment history
- Retry count
- Customer history
- Payment channel
- Risk level

The AI generates a recovery recommendation.

However:

> **The AI does not directly execute the recommendation.**

The recommendation is passed to the deterministic safety engine, which determines whether the action is allowed.

---

# 🔐 AI Fallback

RecoverAI includes a deterministic fallback mechanism in case the external AI service is unavailable.

```text
              ┌─────────────────┐
              │   Groq AI       │
              └────────┬────────┘
                       │
                 Available?
                  /          \
                YES           NO
                 ↓             ↓
          AI Diagnosis   Deterministic
                              Rules
                 \             /
                  \           /
                   ↓         ↓
                Safety Engine
                     ↓
              Recovery Action
```

This prevents the application from becoming completely dependent on the external LLM service.

---

# 🎙️ Hinglish Voice Recovery Studio

RecoverAI includes a simulated **Hinglish Voice Recovery Studio** for demonstrating customer-recovery conversations.

It can simulate:

- Recovery messaging
- Payment reminders
- Promise-to-Pay conversations
- Customer responses
- Recovery outcomes

> **Note:** Voice interactions are simulated for demonstration purposes and do not place real customer calls.

---

# 📱 Dashboard

The RecoverAI dashboard provides a centralized operational view of revenue recovery.

### Dashboard includes:

- 💰 Revenue at risk
- 🔄 Active recovery cases
- ✅ Recovered revenue
- 📈 Recovery rate
- 🤝 PTP commitments
- 🛡️ Protected exposure
- 🚨 High-risk stopped cases
- 📋 Recovery queue

The goal is to provide a clear operational view of where revenue is being recovered and where automation should stop.

---

# 🧩 Failure Scenarios

RecoverAI supports different revenue-recovery scenarios.

### Examples

- Insufficient funds
- Expired cards
- Hard declines
- Mandate failures
- Authentication failures
- B2B procurement holds

Different failure scenarios can result in different recovery interventions.

```text
Failure Scenario
       ↓
Root Cause Analysis
       ↓
Recovery Decision
       ↓
┌──────────────────────────────┐
│ Retry                        │
│ Promise-to-Pay               │
│ Credential Update            │
│ Stop & Escalate              │
└──────────────────────────────┘
```

---

# 🌍 Multi-Currency Recovery

RecoverAI supports multi-currency recovery analytics.

For demonstration purposes, dashboard values can be normalized into USD-equivalent values for cross-currency aggregation.

> These normalized values are used only for demonstration and analytics.

---

# 🧰 Tech Stack

## Frontend

- React
- TypeScript
- Vite

## Backend

- Node.js
- Express

## AI

- Groq
- GPT-OSS-20B

## Development & Deployment

- Git
- GitHub
- VS Code
- Vercel

---

# 📁 Project Structure

```text
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
```

---

# 🚀 Run Locally

## Prerequisites

Make sure you have:

- Node.js 18+
- npm
- Git
- Groq API key

---

## 1. Clone the Repository

```bash
git clone https://github.com/PSRIKRUTHIN/RecoverAI-AI-Revenue-Recovery-Agent

cd RecoverAI-AI-Revenue-Recovery-Agent
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
GROQ_API_KEY=your_groq_api_key
```

> Never commit your actual API key to GitHub.

---

## 4. Start the Development Server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:5173
```

---

# ⚙️ Challenges & Solutions

## 1. Preventing Uncontrolled Retries

### Challenge

An early version of the recovery workflow could potentially repeat payment retries beyond the intended limit.

### Solution

Implemented deterministic retry limits and stopping rules outside the AI decision layer.

```text
AI Recommendation
       ↓
Retry Eligibility
       ↓
Retry Limit Check
       ↓
Allowed?
   /       \
 YES        NO
 ↓          ↓
Retry      Stop
```

---

## 2. Handling Different Failure Scenarios

### Challenge

Different payment failures require different recovery strategies.

### Solution

RecoverAI maps failure scenarios to bounded interventions.

Examples:

```text
Insufficient Funds
       ↓
Payment Retry


Hard Decline
       ↓
Stop / Escalate


Delayed B2B Invoice
       ↓
Promise-to-Pay


Expired Card
       ↓
Credential Update
```

---

## 3. AI Reliability

### Challenge

External AI services may become unavailable or fail to return a usable response.

### Solution

RecoverAI provides a deterministic rules fallback.

```text
AI Available
     ↓
AI Diagnosis
     ↓
Safety Engine


AI Unavailable
     ↓
Rules Engine
     ↓
Safety Engine
```

This keeps the core recovery workflow operational.

---

## 4. Multi-Currency Analytics

### Challenge

Revenue may be represented in different currencies.

### Solution

Demo analytics normalize currencies into USD-equivalent values for cross-currency aggregation.

---

# 🛡️ Security & Safety

RecoverAI follows a safety-first architecture.

### Important controls

- AI does not directly execute payments
- Recovery actions are bounded
- Retry attempts are limited
- Duplicate actions are prevented
- High-risk cases can be stopped
- Cases can be escalated to humans
- Recovery events are logged
- API keys are stored through environment variables

---

# 🔮 Future Improvements

RecoverAI is currently a demonstration system. A production version could be extended with:

- 🔗 Real payment-provider and gateway integrations
- ⚡ Real-time payment failure webhooks
- 🧠 More advanced customer-level recovery models
- 📈 Predictive recovery probability scoring
- ⚙️ Configurable business policies and retry strategies
- 🔐 Role-based access control and stronger security controls
- 📊 Production monitoring and alerting
- 🗄️ Persistent databases for recovery history and audit events
- 🤖 More specialized recovery agents for different payment channels
- 🌍 Production-grade multi-currency and regional recovery support
---


# ⚠️ Demo Disclaimer

RecoverAI is a demonstration system built for the **Razorpay AI Builder Internship 2026 — Track 03: AI Revenue Recovery**.

### Important limitations

- Payment execution is simulated
- No real money is transferred
- No real customer calls are placed
- Razorpay production APIs are not used for payment execution
- Compliance controls are illustrative
- The system is not a production payment-recovery platform
- Demo analytics may use simulated data

---

# 💡 Design Philosophy

The central design philosophy of RecoverAI is:

```text
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
```

> **AI should recommend recovery actions, but deterministic controls should decide what the system is allowed to execute.**

---
