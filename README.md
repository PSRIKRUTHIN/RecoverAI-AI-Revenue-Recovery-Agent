# RecoverAI — AI Revenue Recovery Agent

> An AI-powered revenue recovery agent that detects revenue at risk, diagnoses failure causes, selects the right intervention, and executes bounded recovery workflows with deterministic safety controls.

**Built for Razorpay AI Builder Internship 2026 — Track 03: AI Revenue Recovery**

## 🚀 Live Demo

👉 https://recover-ai-ai-revenue-recovery-agen.vercel.app/

## Start the Development Server

👉 npm run dev

---

## 🎯 What is RecoverAI?

Failed payments and delayed receivables create revenue leakage for businesses.

RecoverAI acts as an AI-assisted revenue recovery agent that:

- Detects revenue-risk incidents
- Diagnoses the root cause
- Determines the most appropriate intervention
- Executes bounded recovery actions
- Creates Promise-to-Pay commitments when appropriate
- Stops unsafe or exhausted recovery attempts
- Escalates cases requiring manual intervention
- Records recovery decisions through an audit trail
- Measures actual recovery outcomes

The system is designed around one principle:

> **AI reasons about recovery. Deterministic controls decide what the agent is allowed to execute.**

---

## 🧠 How It Works

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
┌──────────────┬──────────────┬──────────────┐
│ Payment      │ Promise-to-  │ Stop /       │
│ Retry        │ Pay (PTP)    │ Escalate     │
└──────────────┴──────────────┴──────────────┘
       ↓
Audit Trail
       ↓
Recovery Metrics
