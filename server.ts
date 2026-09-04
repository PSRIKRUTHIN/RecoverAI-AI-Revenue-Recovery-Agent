import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ============================================================
// GROQ CLIENT
// ============================================================

let groqClient: Groq | null = null;

function getGroqClient(): Groq | null {
  if (!groqClient && process.env.GROQ_API_KEY) {
    try {
      groqClient = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });
    } catch (err) {
      console.warn("Failed to initialize Groq client:", err);
    }
  }

  return groqClient;
}

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// AI DIAGNOSIS & RECOVERY RECOMMENDATION
// ============================================================

app.post("/api/diagnose", async (req: Request, res: Response) => {
  try {
    const { incident } = req.body;

    if (!incident) {
      return res.status(400).json({
        error: "Incident data is required",
      });
    }

    const ai = getGroqClient();

    // ========================================================
    // DETERMINISTIC FALLBACK
    // ========================================================

    const generateFallbackDiagnosis = () => {
      const isHinglish =
        incident.channel === "upi_mandate" ||
        incident.locale === "en-IN";

      const isB2B =
        incident.channel === "b2b_invoice";

      const isCart =
        incident.channel === "checkout_abandon";

      let rootCause =
        "Transient card issuer decline due to anti-fraud velocity filter.";

      let recoveryAction =
        "Smart cascade retry with secondary acquirer rail.";

      let voiceScript =
        "Hello, this is the automated billing support team regarding your recent subscription update. We have prepared an instant 1-click update link.";

      let channelRecommended =
        "email_fastlink";

      let recoveryChance = 78;

      let stoppingRule =
        "Max 3 retry presentations; stop immediately if cardholder flags fraud or disputes.";

      // ======================================================
      // INSUFFICIENT FUNDS
      // ======================================================

      if (incident.errorCode === "insufficient_funds") {
        rootCause =
          "Month-end liquidity shortfall prior to salary disbursement cycle.";

        recoveryAction =
          "Schedule smart mandate presentation for 1st of month at 08:45 AM local time.";

        recoveryChance = 88;

        stoppingRule =
          "Halt retries if 2 consecutive NSF (insufficient funds) responses to avoid bank NSF fee penalties.";

        if (isHinglish) {
          channelRecommended = "hinglish_voice";

          voiceScript = `Namaste ${
            incident.customerName || "Ji"
          }, main your payment concierge agent bol raha hoon. Aapka Rs. ${
            incident.amount
          } ka mandate auto-debit process nahi ho paya. Humne aapko ek WhatsApp payment link bheja hai jisse aap bina kisi fine ke 1-click me settle kar sakte hain. Kya main link re-send karoon?`;
        }
      }

      // ======================================================
      // B2B INVOICE
      // ======================================================

      else if (isB2B) {
        rootCause =
          "Accounts Payable procurement cycle delay: missing PO reconciliation match.";

        recoveryAction =
          "Trigger AI B2B Chaser with verified tax invoice PDF, vendor W-9, and early-settlement incentive.";

        channelRecommended =
          "b2b_chaser";

        recoveryChance = incident.recoveryProbability ?? 72;

        stoppingRule =
          "Maximum 2 compliant notices per 14-day cycle; escalate to assigned Account Executive if DPO exceeds 45 days.";

        voiceScript = `Hello Accounts Payable at ${
          incident.customerName
        }, this is the automated receivables desk. Reference invoice #${
          incident.id
        } for $${incident.amount}. We noticed a pending approval status and have attached the verified PO package for straight-through processing.`;
      }

      // ======================================================
      // CHECKOUT ABANDONMENT
      // ======================================================

      else if (isCart) {
        rootCause =
          "High-friction 3DS authentication timeout on mobile checkout.";

        recoveryAction =
          "Dispatch frictionless SMS checkout recovery token with pre-selected Apple Pay/Google Pay rail.";

        channelRecommended =
          "sms_fastlink";

        recoveryChance = 64;

        stoppingRule =
          "Single outreach within 15 minutes of abandonment; suppress if session already converted or user unsubscribed.";
      }

      // ======================================================
      // UPI MANDATE
      // ======================================================

      else if (
        incident.errorCode === "mandate_revoked" ||
        incident.channel === "upi_mandate"
      ) {
        rootCause =
          "NPCI UPI auto-debit pre-debit notification acknowledgment window lapsed.";

        recoveryAction =
          "Send instant UPI intent link (GPay/PhonePe) directly via WhatsApp with 24-hr grace period lock.";

        channelRecommended =
          "hinglish_voice";

        recoveryChance = 82;

        stoppingRule =
          "RBI e-mandate compliance: no unsolicited phone calls post 8 PM; max 1 interactive IVR follow-up.";

        voiceScript = `Namaste ${
          incident.customerName || "Sir"
        }, aapka recurring subscription mandate renew nahi ho saka. Humne aapke registered number pe PhonePe/GPay instant link share kiya hai taaki aapki services uninterrupted chalein.`;
      }

      // ======================================================
      // RETURN FALLBACK RESULT
      // ======================================================

      return {
        rootCause,

        intervention: recoveryAction,

        channelRecommended,

        recoveryProbability: recoveryChance,

        stoppingRule,

        voiceScript,

        smartRetrySchedule:
          "Next optimal window: Tomorrow at 09:20 AM IST (Bank settlement peak)",

        escalationStage:
          incident.attempts > 1 ? 3 : 1,

        regulatoryFramework: isB2B
          ? "Prompt Payment Act & Commercial DPO Standard"
          : isHinglish
          ? "RBI E-Mandate Circular & TRAI Quiet Hours"
          : "PCI-DSS & Card Brand Resubmission Rules",
      };
    };

    // ========================================================
    // NO GROQ KEY → DETERMINISTIC FALLBACK
    // ========================================================

    if (!ai) {
      console.warn(
        "GROQ_API_KEY not found. Using deterministic rules engine."
      );

      return res.json({
        success: true,
        source: "deterministic_rules_engine",
        diagnosis: generateFallbackDiagnosis(),
      });
    }

    // ========================================================
    // GROQ PROMPT
    // ========================================================

    const prompt = `You are an AI Revenue Recovery Agent for high-growth SaaS, E-commerce, and B2B platforms.

Analyze this revenue risk incident and generate a bounded, compliant recovery plan.

IMPORTANT SAFETY RULES:
- Never recommend unlimited payment retries.
- Never recommend harassment or repeated customer contact.
- Never bypass payment security controls.
- Recommend a bounded recovery intervention.
- Escalate when safe automated options are exhausted.
- Consider customer history and previous attempts.
- Return ONLY valid JSON.

Incident Details:

- Customer: ${incident.customerName || "Unknown"} (${
      incident.customerEmail || incident.phone || "N/A"
    })

- Channel / Domain: ${incident.channel}

- Amount at Risk: ${incident.currency || "INR"} ${
      incident.amount
    }

- Error Code / Trigger: ${incident.errorCode || "N/A"} (${
      incident.errorMessage || "N/A"
    })

- Historical Attempts: ${incident.attempts || 1}

- Customer LTV: ${incident.customerLtv || "$1,200"}

- Locale: ${incident.locale || "en-US"}

- Days Overdue: ${incident.daysOverdue || 0}

- Additional Context: ${incident.notes || "None"}
- Baseline Recovery Probability: ${incident.recoveryProbability ?? "N/A"}

Return strict JSON with exactly these keys:

{
  "rootCause": "Clear diagnostic 1-2 sentence explanation of why this payment or revenue stalled",

  "intervention": "Actionable bounded recovery intervention",

  "channelRecommended": "One of: email_fastlink, sms_fastlink, hinglish_voice, mandate_retry, b2b_chaser, promise_to_pay",

  "recoveryProbability": 0,

  "stoppingRule": "Exact safety stopping rule preventing excessive retries or customer contact",

  "voiceScript": "If voice outreach is appropriate, provide a concise conversational script. Otherwise return an empty string.",

  "smartRetrySchedule": "Recommended retry window",

  "escalationStage": 1,

  "regulatoryFramework": "Applicable compliance or safety framework"
}

Constraints:

- recoveryProbability must be an integer from 15 to 95.
- If Baseline Recovery Probability is provided, preserve that exact value.
- escalationStage must be an integer from 1 to 4.
- Do not invent customer information.
- Do not claim that money was actually recovered.
- Return ONLY pure JSON.`;

    // ========================================================
    // CALL GROQ
    // ========================================================

    const completion =
      await ai.chat.completions.create({
        model: "openai/gpt-oss-20b",

        messages: [
          {
            role: "system",
            content:
              "You are a careful AI Revenue Recovery Agent. Return only valid JSON. Recommend bounded and safety-constrained recovery actions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.2,

        max_tokens: 1000,
      });

    const responseText =
      completion.choices[0]?.message?.content || "";

    // ========================================================
    // PARSE GROQ RESPONSE
    // ========================================================

    try {
      const cleanedResponse =
        responseText
          .trim()
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

      const parsed =
        JSON.parse(cleanedResponse);

      return res.json({
        success: true,

        source:
          "groq_gpt_oss_20b",

        diagnosis: parsed,
      });
    }

    // ========================================================
    // GROQ RETURNED INVALID JSON
    // ========================================================

    catch (parseError) {
      console.warn(
        "Failed to parse Groq JSON, using fallback:",
        parseError
      );

      return res.json({
        success: true,

        source:
          "rules_engine_fallback",

        diagnosis:
          generateFallbackDiagnosis(),

        warning:
          "Groq returned an invalid response. Deterministic recovery rules were used.",
      });
    }

  }

  // ==========================================================
  // GROQ/API ERROR
  // ==========================================================

  catch (error: any) {
    console.error(
      "Groq diagnosis error:",
      error
    );

    return res.status(503).json({
      error:
        "Groq diagnosis temporarily unavailable",

      details:
        error?.message ||
        "Unknown AI provider error",
    });
  }
});

// ============================================================
// VITE & STATIC SERVER SETUP
// ============================================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite =
      await createViteServer({
        server: {
          middlewareMode: true,
        },

        appType: "spa",
      });

    app.use(vite.middlewares);
  }

  else {
    const distPath =
      path.join(
        process.cwd(),
        "dist"
      );

    app.use(
      express.static(distPath)
    );

    app.get(
      "*",
      (_req: Request, res: Response) => {
        res.sendFile(
          path.join(
            distPath,
            "index.html"
          )
        );
      }
    );
  }

  app.listen(
    PORT,
    "0.0.0.0",
    () => {
      console.log(
        `AI Revenue Recovery Server running on http://0.0.0.0:${PORT}`
      );
    }
  );
}

startServer();