import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  RefreshCw,
  HandCoins,
  Clock,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { RecoveryIncident } from '../types';
import { formatCurrency } from '../utils/audit';

interface IncidentDetailProps {
  incident: RecoveryIncident;
  onClose: () => void;
  onDiagnoseWithAi: (incident: RecoveryIncident) => Promise<void>;
  onExecuteRetry: (incident: RecoveryIncident) => void;
  onOpenVoiceModal: (incident: RecoveryIncident) => void;
  onRecordPtp: (
    incident: RecoveryIncident,
    promisedDate: string,
    amount: number,
    notes: string
  ) => void;
  onTriggerStoppingRule: (incident: RecoveryIncident, reason: string) => void;
  isDiagnosing: boolean;
}

export const IncidentDetail: React.FC<IncidentDetailProps> = ({
  incident,
  onClose,
  onDiagnoseWithAi,
  onExecuteRetry,
  onOpenVoiceModal,
  onRecordPtp,
  onTriggerStoppingRule,
  isDiagnosing,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPtpModal, setShowPtpModal] = useState(false);

  const [ptpDate, setPtpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const [ptpAmount, setPtpAmount] = useState(incident.amount);

  const [ptpNotes, setPtpNotes] = useState(
    'Customer confirmed salary clearance window. Soft freeze applied.'
  );

  const [showStopModal, setShowStopModal] = useState(false);

  const [stopReason, setStopReason] = useState(
    'Recovery retry threshold reached: no further automated retries will be attempted.'
  );

  const fastPaymentLink = `https://pay.recovery-concierge.internal/v1/checkout?ref=${incident.id}&token=tok_enc_${Date.now()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fastPaymentLink);
    setCopiedLink(true);

    setTimeout(() => {
      setCopiedLink(false);
    }, 2000);
  };

  const handlePtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onRecordPtp(
      incident,
      ptpDate,
      Number(ptpAmount),
      ptpNotes
    );

    setShowPtpModal(false);
  };

  const handleStopSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onTriggerStoppingRule(
      incident,
      stopReason
    );

    setShowStopModal(false);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs relative">

      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">

        <div>
          <div className="flex items-center gap-2">

            <span className="font-mono text-xs text-indigo-700 font-semibold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200">
              {incident.id}
            </span>

            <span className="text-xs uppercase font-mono text-slate-500">
              {incident.channel.replace(/_/g, ' ')}
            </span>

            {incident.status === 'recovered' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Recovered
              </span>
            )}

            {incident.status === 'ptp_active' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                <HandCoins className="w-3 h-3" />
                PTP Locked
              </span>
            )}

            {incident.status === 'stopped_compliant' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                Stopped Compliant
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {incident.customerName}
          </h2>

          <p className="text-xs text-slate-500">
            {incident.companyName ? `${incident.companyName} • ` : ''}
            {incident.customerEmail}
            {incident.customerPhone ? ` • ${incident.customerPhone}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="text-right">

            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(incident.amount, incident.currency)}
            </div>

            <div className="text-[11px] text-slate-500">
              LTV: {incident.customerLtv}
            </div>

          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-5">

          {/* Failure Signal Details */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">

            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">

              <span>
                Technical Failure Signal
              </span>

              <span className="text-[11px] font-mono text-amber-700 font-semibold">
                Attempt {incident.attempts} of {incident.maxAttemptsAllowed}
              </span>

            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">

              <div>
                <span className="text-slate-500 block text-[11px]">
                  Decline Trigger
                </span>

                <span className="font-mono font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 inline-block">
                  {incident.errorCode}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">
                  Gateway / Rail
                </span>

                <span className="text-slate-800 font-medium">
                  {incident.metadata?.gatewayName || 'Stripe API / Card Scheme'}
                </span>
              </div>

              <div className="col-span-2">

                <span className="text-slate-500 block text-[11px]">
                  Raw Gateway Message
                </span>

                <span className="text-slate-700 font-mono text-[11px] bg-white p-2 rounded block border border-slate-200 mt-0.5">
                  {incident.errorMessage}
                </span>

              </div>

            </div>
          </div>

          {/* AI Root Cause & Intervention Blueprint */}
          <div className="bg-white border border-indigo-200/90 rounded-xl p-4 relative overflow-hidden shadow-xs">

            <div className="flex items-center justify-between mb-3">

              <div className="flex items-center gap-2">

                <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  AI Diagnostic & Recovery Strategy
                </h3>

              </div>

              <div className="flex items-center gap-2">

                <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-medium">
                  {incident.diagnosis?.aiModel || 'Groq — GPT-OSS-20B'}
                </span>

                <button
                  onClick={() => onDiagnoseWithAi(incident)}
                  disabled={isDiagnosing}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200 shadow-xs flex items-center gap-1 transition-colors"
                >
                  <RefreshCw
                    className={`w-3 h-3 ${
                      isDiagnosing ? 'animate-spin' : ''
                    }`}
                  />

                  Re-Analyze
                </button>

              </div>
            </div>

            {/* Root Cause */}
            <div className="mb-3">

              <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider block mb-1">
                Root Cause Diagnosis
              </span>

              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                {incident.diagnosis?.rootCause ||
                  'Analyzing payment stream patterns...'}
              </p>

            </div>

            {/* Intervention Recommended */}
            <div className="mb-3">

              <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider block mb-1">
                Recommended Bounded Intervention
              </span>

              <p className="text-xs text-emerald-800 font-medium bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 leading-relaxed">
                {incident.diagnosis?.intervention ||
                  'Awaiting strategy recommendation...'}
              </p>

            </div>

            {/* AI Decision Rationale */}
            <div className="mb-3">

              <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider block mb-1">
                AI Decision Rationale
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">

                {/* Signal */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">

                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Signal
                  </span>

                  <span className="text-xs text-slate-700 font-medium">
                    {incident.errorCode}
                  </span>

                </div>

                {/* Agent Decision */}
                <div className="bg-indigo-50/60 border border-indigo-200 rounded-lg p-2.5">

                  <span className="text-[10px] uppercase font-semibold text-indigo-500 block">
                    Agent Decision
                  </span>

                  <span className="text-xs text-indigo-800 font-medium">
                    {incident.diagnosis?.intervention ||
                      'Pending diagnosis'}
                  </span>

                </div>

                {/* Safety Boundary */}
                <div className="bg-rose-50/60 border border-rose-200 rounded-lg p-2.5">

                  <span className="text-[10px] uppercase font-semibold text-rose-500 block">
                    Safety Boundary
                  </span>

                  <span className="text-xs text-rose-800 font-medium">
                    {incident.diagnosis?.stoppingRule ||
                      'Bounded retry and escalation limits apply'}
                  </span>

                </div>

              </div>
            </div>

            {/* Metrics & Guardrails Summary */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">

              <div>

                <span className="text-[11px] text-slate-500 block">
                  Win Probability
                </span>

                <div className="flex items-center gap-2 mt-0.5">

                  <div className="w-24 bg-slate-100 rounded-full h-2 border border-slate-200">

                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{
                        width: `${
                          incident.diagnosis?.recoveryProbability ?? 75
                        }%`,
                      }}
                    />

                  </div>

                  <span className="font-bold text-slate-900">
                    {incident.diagnosis?.recoveryProbability ?? 75}%
                  </span>

                </div>
              </div>

              <div>

                <span className="text-[11px] text-slate-500 block">
                  Recommended Timing
                </span>

                <span className="text-slate-800 font-medium flex items-center gap-1 mt-0.5">

                  <Clock className="w-3 h-3 text-amber-600" />

                  {incident.diagnosis?.smartRetrySchedule ||
                    'Next clearing window'}

                </span>

              </div>

            </div>

          </div>

          {/* Compliance Shield */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">

            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2 flex items-center gap-1.5">

              <ShieldCheck className="w-4 h-4 text-emerald-600" />

              Compliance Shield & Stopping Rules

            </h3>

            <div className="space-y-2 text-xs">

              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700">

                <strong className="text-slate-900 block mb-0.5">
                  Active Policy Controls:
                </strong>

                {incident.diagnosis?.regulatoryFramework ||
                  'Commercial Payment Standards & Fair Collections'}

              </div>

              <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-800">

                <strong className="text-rose-900 block mb-0.5">
                  Enforced Stopping Rule:
                </strong>

                {incident.stoppingReason ||
                  incident.diagnosis?.stoppingRule ||
                  'Max 3 retry presentations. Suppress on dispute or hard card decline.'}

              </div>

            </div>

          </div>

          {/* Interactive Bounded Actions */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">

            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Execute Bounded Recovery Intervention
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">

              {/* Smart Retry */}
              <button
                id="btn-action-smart-retry"
                onClick={() => onExecuteRetry(incident)}
                disabled={
                  incident.status === 'recovered' ||
                  incident.status === 'stopped_compliant'
                }
                className="p-2.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
              >

                <RefreshCw className="w-4 h-4" />

                <span>
                  Smart Retry Cascade
                </span>

              </button>

              {/* Voice */}
              <button
                id="btn-action-voice-call"
                onClick={() => onOpenVoiceModal(incident)}
                className="p-2.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex flex-col items-center justify-center gap-1 transition-all shadow-xs"
              >

                <PhoneCall className="w-4 h-4" />

                <span>
                  Voice Recovery Studio
                </span>

              </button>

              {/* PTP */}
              <button
                id="btn-action-record-ptp"
                onClick={() => setShowPtpModal(true)}
                disabled={
                  incident.status === 'recovered' ||
                  incident.status === 'stopped_compliant'
                }
                className="p-2.5 rounded-lg text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50 shadow-xs"
              >

                <HandCoins className="w-4 h-4" />

                <span>
                  Log Promise to Pay
                </span>

              </button>

              {/* FastLink */}
              <button
                id="btn-action-copy-fastlink"
                onClick={handleCopyLink}
                className="p-2.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex flex-col items-center justify-center gap-1 transition-all"
              >

                {copiedLink ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}

                <span>
                  {copiedLink
                    ? 'Link Copied!'
                    : '1-Click FastLink'}
                </span>

              </button>

              {/* Compliant Halt */}
              <button
                id="btn-action-trigger-stop"
                onClick={() => setShowStopModal(true)}
                disabled={
                  incident.status === 'stopped_compliant'
                }
                className="p-2.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50 shadow-xs"
              >

                <ShieldAlert className="w-4 h-4" />

                <span>
                  Compliant Halt
                </span>

              </button>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 space-y-4">

          {/* Personalized Communication Script */}
          {incident.diagnosis?.voiceScript && (
            <div className="bg-indigo-50/40 border border-indigo-200/90 rounded-xl p-4 shadow-xs">

              <div className="flex items-center justify-between mb-2">

                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">

                  <PhoneCall className="w-3.5 h-3.5" />

                  Voice / Message Recovery Script

                </span>

                <span className="text-[10px] font-mono text-slate-500 font-medium">
                  {incident.channel === 'upi_mandate'
                    ? 'Hinglish Concierge'
                    : 'Empathetic English'}
                </span>

              </div>

              <p className="text-xs text-slate-700 italic bg-white p-3 rounded-lg border border-indigo-100 leading-relaxed font-sans shadow-xs">
                "{incident.diagnosis.voiceScript}"
              </p>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">

                <span>
                  Direct 1-click update payload included
                </span>

                <button
                  onClick={() => onOpenVoiceModal(incident)}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                >
                  Simulate Call

                  <ExternalLink className="w-3 h-3" />
                </button>

              </div>

            </div>
          )}

          {/* Audit Trail */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">

            <div className="flex items-center justify-between mb-3">

              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">

                <ShieldCheck className="w-4 h-4 text-emerald-600" />

                Tamper-Evident Audit Trail ({incident.auditTrail.length})

              </h3>

              <span className="text-[10px] font-mono text-slate-500 font-medium">
                SHA-256 Verified
              </span>

            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">

              {incident.auditTrail.map((entry) => {

                const isSystem = entry.actor === 'SYSTEM_GATEWAY';
                const isAi = entry.actor === 'AI_AGENT';
                const isCustomer = entry.actor === 'CUSTOMER';
                const isCompliance =
                  entry.actor === 'COMPLIANCE_ENGINE';

                return (
                  <div
                    key={entry.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                  >

                    <div className="flex items-center justify-between">

                      <span
                        className={`font-semibold text-[11px] px-1.5 py-0.2 rounded font-mono ${
                          isAi
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : isSystem
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : isCustomer
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : isCompliance
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {entry.actor}
                      </span>

                      <span className="text-[10px] text-slate-500 font-mono">

                        {new Date(
                          entry.timestamp
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}

                      </span>

                    </div>

                    <div className="font-semibold text-slate-900">
                      {entry.action.replace(/_/g, ' ')}
                    </div>

                    <p className="text-slate-600 leading-snug">
                      {entry.details}
                    </p>

                    {entry.stoppingRuleChecked && (
                      <div className="text-[11px] text-emerald-700 flex items-center gap-1 pt-0.5 font-medium">

                        <ShieldCheck className="w-3 h-3 text-emerald-600" />

                        <span>
                          {entry.stoppingRuleChecked}
                        </span>

                      </div>
                    )}

                    {entry.recoveredAmount && (
                      <div className="text-[11px] font-bold text-emerald-700">
                        + Settled:{' '}
                        {formatCurrency(
                          entry.recoveredAmount,
                          incident.currency
                        )}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200 flex items-center justify-between">

                      <span>
                        Hash: {entry.hash}
                      </span>

                      <span className="font-medium text-slate-500">
                        Immutable
                      </span>

                    </div>

                  </div>
                );

              })}

            </div>

          </div>

        </div>
      </div>

      {/* Modal: Log Promise-to-Pay */}
      {showPtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">

          <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-md w-full shadow-2xl text-slate-900">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">

              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">

                <HandCoins className="w-5 h-5 text-sky-600" />

                Structure Promise-to-Pay (PTP)

              </h3>

              <button
                onClick={() => setShowPtpModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <form
              onSubmit={handlePtpSubmit}
              className="mt-4 space-y-3.5 text-xs"
            >

              <div>

                <label className="block text-slate-700 font-medium mb-1">
                  Promised Settlement Date
                </label>

                <input
                  type="date"
                  value={ptpDate}
                  onChange={(e) => setPtpDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                  required
                />

              </div>

              <div>

                <label className="block text-slate-700 font-medium mb-1">
                  Promised Amount ({incident.currency})
                </label>

                <input
                  type="number"
                  value={ptpAmount}
                  onChange={(e) => setPtpAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                  required
                />

              </div>

              <div>

                <label className="block text-slate-700 font-medium mb-1">
                  Notes & Grace Terms
                </label>

                <textarea
                  value={ptpNotes}
                  onChange={(e) => setPtpNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                />

              </div>

              <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-[11px]">

                🛡️ <strong>Automated Grace Rule:</strong>{' '}
                Freezes dunning pings, preserves active subscriptions,
                and sets auto-retry for 08:30 AM on the promised day.

              </div>

              <div className="flex items-center justify-end gap-2 pt-2">

                <button
                  type="button"
                  onClick={() => setShowPtpModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-xs"
                >
                  Lock PTP Agreement
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal: Trigger Compliance Stop */}
      {showStopModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">

          <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-md w-full shadow-2xl text-slate-900">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">

              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">

                <ShieldAlert className="w-5 h-5 text-rose-600" />

                Enforce Stopping Rule

              </h3>

              <button
                onClick={() => setShowStopModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <form
              onSubmit={handleStopSubmit}
              className="mt-4 space-y-3.5 text-xs"
            >

              <div>

                <label className="block text-slate-700 font-medium mb-1">
                  Halt Justification
                </label>

                <select
                  value={stopReason}
                  onChange={(e) => setStopReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-rose-500"
                >

                  <option value="Recovery retry threshold reached: no further automated retries will be attempted.">
                    Recovery Retry Threshold Reached
                  </option>

                  <option value="Cardholder dispute registered: customer claims service cancellation.">
                    Customer Dispute / Cancellation Request
                  </option>

                  <option value="Hard decline code (stolen_card): Prohibited from retry by card network rules.">
                    Hard Card Decline (Stolen / Lost / Invalid)
                  </option>

                  <option value="TRAI / TCPA Quiet Hours: Customer time zone restricts outreach between 8 PM - 9 AM.">
                    Quiet Hours Boundary (TCPA / TRAI)
                  </option>

                  <option value="Max retry threshold exceeded: Prevents acquirer velocity surcharges.">
                    Max Velocity Cap Reached
                  </option>

                </select>

              </div>

              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">

                ⚠️ <strong>Audit Effect:</strong>{' '}
                Permanently stops automated contact and token presentation
                for this incident. Protects your merchant account from
                penalties.

              </div>

              <div className="flex items-center justify-end gap-2 pt-2">

                <button
                  type="button"
                  onClick={() => setShowStopModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs"
                >
                  Confirm Compliant Stop
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};