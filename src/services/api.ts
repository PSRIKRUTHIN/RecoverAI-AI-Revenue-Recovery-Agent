import { AiDiagnosis, RecoveryIncident } from '../types';

export async function requestAiDiagnosis(
  incident: RecoveryIncident
): Promise<AiDiagnosis> {
  try {
    const res = await fetch('/api/diagnose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ incident }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();

    if (data.success && data.diagnosis) {
      return {
        ...data.diagnosis,

        aiModel:
          data.source === 'groq_gpt_oss_20b'
            ? 'Groq — GPT-OSS-20B'
            : data.source === 'deterministic_rules_engine'
            ? 'Deterministic Rules Engine'
            : data.source === 'rules_engine_fallback'
            ? 'Rules Engine Fallback'
            : 'AI Recovery Engine',
      };
    }

    throw new Error('Invalid diagnosis response');

  } catch (error) {
    console.warn(
      'Using client-side fallback diagnosis due to API error:',
      error
    );

    // ============================================================
    // CLIENT-SIDE DETERMINISTIC FALLBACK
    // ============================================================

    const isB2B =
      incident.channel === 'b2b_invoice';

    const isUPI =
      incident.channel === 'upi_mandate' ||
      incident.errorCode === 'mandate_revoked';

    const isInsufficientFunds =
      incident.errorCode === 'insufficient_funds';

    // ============================================================
    // B2B INVOICE FALLBACK
    // ============================================================

    if (isB2B) {
      return {
        rootCause:
          'Accounts Payable procurement cycle delay caused by a missing three-way PO reconciliation match. The invoice is awaiting internal approval against the purchase order and receiving documentation.',

        intervention:
          'Dispatch B2B Receivables Chaser with the verified three-way PO matching packet, automated vendor W-9, and single-click ACH payment link.',

        channelRecommended:
          'b2b_chaser',

        recoveryProbability:
          incident.recoveryProbability ?? 81,

        stoppingRule:
          'Corporate Prompt Payment etiquette: 1 reminder per 10 business days. Escalate to VP Sales if the invoice exceeds 35 days overdue.',

        smartRetrySchedule:
          'Tuesday at 10:15 AM EST aligned with the AP weekly payment run schedule.',

        escalationStage:
          incident.daysOverdue >= 35 ? 3 : 1,

        regulatoryFramework:
          'Commercial Prompt Payment Guidelines & B2B Accounting Standards',

        voiceScript:
          `Hello Accounts Payable at ${
            incident.customerName || 'your organization'
          }, this is the automated receivables desk regarding invoice #${
            incident.id
          } for ${incident.currency || '$'}${
            incident.amount
          }. We have prepared the verified PO matching package and payment link to help complete the approval process.`,

        aiModel:
          'Local Guardrail Fallback',
      };
    }

    // ============================================================
    // INSUFFICIENT FUNDS FALLBACK
    // ============================================================

    if (isInsufficientFunds) {
      return {
        rootCause:
          'Payment failed because available account funds were insufficient at the time of mandate presentation.',

        intervention:
          'Schedule a bounded mandate retry during the next suitable funding window.',

        channelRecommended:
          isUPI
            ? 'hinglish_voice'
            : 'mandate_retry',

        recoveryProbability:
          incident.recoveryProbability ?? 88,

        stoppingRule:
          'Halt retries after 2 consecutive insufficient-funds responses to avoid repeated failed presentations and potential bank fees.',

        smartRetrySchedule:
          'Next suitable funding window at the beginning of the customer billing cycle.',

        escalationStage:
          incident.attempts > 1 ? 2 : 1,

        regulatoryFramework:
          'RBI E-Mandate Controls & Payment Network Retry Guidelines',

        voiceScript:
          isUPI
            ? `Namaste ${
                incident.customerName || 'Ji'
              }, aapka payment abhi process nahi ho paya kyunki account mein sufficient balance available nahi tha. Hum next suitable payment window mein retry kar sakte hain.`
            : '',

        aiModel:
          'Local Guardrail Fallback',
      };
    }

    // ============================================================
    // UPI MANDATE FALLBACK
    // ============================================================

    if (isUPI) {
      return {
        rootCause:
          `Payment stalled due to ${
            incident.errorCode?.replace(/_/g, ' ') || 'mandate processing failure'
          }. The recurring payment requires a bounded recovery action.`,

        intervention:
          'Send an instant UPI payment link through the registered customer channel with a controlled retry window.',

        channelRecommended:
          'hinglish_voice',

        recoveryProbability:
          incident.recoveryProbability ?? 82,

        stoppingRule:
          'Maximum 3 recovery attempts. Stop immediately on customer cancellation, dispute, or other hard-stop signals.',

        smartRetrySchedule:
          'Tomorrow at 09:30 AM local time.',

        escalationStage:
          incident.attempts > 1 ? 2 : 1,

        regulatoryFramework:
          'RBI E-Mandate Controls & Customer Contact Safety Guidelines',

        voiceScript:
          `Namaste ${
            incident.customerName || 'Sir'
          }, aapka recurring payment process nahi ho saka. Humne aapke registered channel par secure payment option share kiya hai taaki aap manually complete kar saken.`,

        aiModel:
          'Local Guardrail Fallback',
      };
    }

    // ============================================================
    // GENERIC FALLBACK
    // ============================================================

    return {
      rootCause: `Payment stalled due to ${
        incident.errorCode?.replace(/_/g, ' ') || 'a payment processing issue'
      }. Transaction requires a bounded recovery action.`,

      intervention:
        'Apply a controlled recovery intervention and stop automatically when safety limits are reached.',

      channelRecommended:
        'email_fastlink',

      recoveryProbability:
        incident.recoveryProbability ?? 80,

      stoppingRule:
        'Maximum 3 recovery attempts. Stop immediately on customer cancellation, dispute, or other hard-stop signals.',

      smartRetrySchedule:
        'Tomorrow at 09:30 AM local time.',

      escalationStage:
        incident.attempts > 1 ? 2 : 1,

      regulatoryFramework:
        'Standard Commercial Payment Compliance',

      voiceScript:
        '',

      aiModel:
        'Local Guardrail Fallback',
    };
  }
}