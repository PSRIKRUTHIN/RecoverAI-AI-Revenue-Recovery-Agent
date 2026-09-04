export type ChannelType = 
  | 'card_payment_degradation'
  | 'checkout_abandon'
  | 'failed_subscription'
  | 'b2b_invoice'
  | 'upi_mandate';

export type IncidentStatus = 
  | 'at_risk'
  | 'diagnosing'
  | 'intervention_active'
  | 'ptp_active'
  | 'recovered'
  | 'stopped_compliant';

export type EscalationStage = 0 | 1 | 2 | 3 | 4;

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: 'AI_AGENT' | 'SYSTEM_GATEWAY' | 'CUSTOMER' | 'COMPLIANCE_ENGINE';
  details: string;
  hash: string;
  stoppingRuleChecked?: string;
  recoveredAmount?: number;
}

export interface PromiseToPay {
  promisedDate: string;
  promisedAmount: number;
  installments?: number;
  contactChannel: string;
  notes: string;
  status: 'pending' | 'honored' | 'broken';
  gracePeriodUntil: string;
}

export interface AiDiagnosis {
  rootCause: string;
  intervention: string;
  channelRecommended: 'email_fastlink' | 'sms_fastlink' | 'hinglish_voice' | 'mandate_retry' | 'b2b_chaser' | 'promise_to_pay';
  recoveryProbability: number;
  stoppingRule: string;
  voiceScript?: string;
  smartRetrySchedule?: string;
  escalationStage: EscalationStage;
  regulatoryFramework: string;
  aiModel?: string;
}

export interface RecoveryIncident {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  channel: ChannelType;
  amount: number;
  currency: string;
  status: IncidentStatus;
  errorCode: string;
  errorMessage: string;
  attempts: number;
  maxAttemptsAllowed: number;
  daysOverdue: number;
  customerLtv: string;
  locale: string;
  createdAt: string;
  lastAttemptAt?: string;
  recoveredAt?: string;
  recoveredAmount?: number;
  stoppingReason?: string;
  notes?: string;
  diagnosis?: AiDiagnosis;
  promiseToPay?: PromiseToPay;
  auditTrail: AuditLogEntry[];
  metadata?: {
    cardBrand?: string;
    cardLast4?: string;
    gatewayName?: string;
    poNumber?: string;
    cartItemsCount?: number;
    upiVpa?: string;
    preferredTime?: string;
  };
}

export interface BatchSummary {
  totalMonitored: number;
  totalAtRiskAmount: number;
  totalRecoveredAmount: number;
  totalPtpAmount: number;
  totalHaltedAmount: number;
  recoveredCount: number;
  haltedCount: number;
  avgHoursToRecover: number;
}
