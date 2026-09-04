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


