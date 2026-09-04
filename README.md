# RecoverAI — AI Revenue Recovery Agent

> AI-powered revenue recovery system that detects revenue at risk, diagnoses payment failures, selects bounded recovery actions, and safely stops or escalates high-risk cases.

## 🚀 Overview

RecoverAI is an AI Revenue Recovery Agent built for the **Razorpay AI Builder Internship 2026 — Track 03: AI Revenue Recovery**.

The system identifies revenue that is at risk because of payment failures, mandate issues, insufficient funds, expired cards, hard declines, B2B procurement holds, and other recovery scenarios.

It combines **Groq GPT-OSS-20B** for AI-powered diagnosis with a **deterministic safety engine** that controls what actions the agent is allowed to execute.

The goal is not simply to retry failed payments, but to choose the **right recovery intervention** while enforcing retry limits, stopping rules, escalation, and auditability.

---

## 🎯 Problem

Failed payments and delayed receivables can create significant revenue leakage.

A recovery system needs to answer:

- Which revenue is currently at risk?
- Why did the payment or collection fail?
- What recovery action is appropriate?
- Should the system retry, create a Promise-to-Pay commitment, request a credential update, or escalate?
- When should the agent stop acting?

RecoverAI addresses these questions through an **AI-assisted but safety-bounded workflow**.

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
