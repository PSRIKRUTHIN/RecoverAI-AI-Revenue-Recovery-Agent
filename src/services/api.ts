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

        // Identify the actual AI provider used by the backend
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

    // Client-side fallback if server fails
    return {
      rootCause: `Payment stalled due to ${incident.errorCode.replace(
        /_/g,
        ' '
      )}. Transaction requires bounded retry and channel orchestration.`,

      intervention:
        'Trigger automated 1-click tokenized payment update and sequence off-peak acquirer retry.',

      channelRecommended:
        incident.channel === 'upi_mandate'
          ? 'hinglish_voice'
          : 'email_fastlink',

      recoveryProbability: 80,

      stoppingRule:
        'Maximum 3 attempts. Stop immediately on customer cancellation or dispute.',

      smartRetrySchedule:
        'Tomorrow at 09:30 AM local time',

      escalationStage:
        incident.attempts > 1 ? 2 : 1,

      regulatoryFramework:
        'Standard Commercial Payment Compliance',

      aiModel:
        'Local Guardrail Fallback',
    };
  }
}