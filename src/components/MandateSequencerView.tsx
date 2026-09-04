import React from 'react';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Play, 
  Sparkles
} from 'lucide-react';
import { RecoveryIncident } from '../types';
import { formatCurrency } from '../utils/audit';

interface MandateSequencerViewProps {
  incidents: RecoveryIncident[];
  onExecuteRetry: (incident: RecoveryIncident) => void;
}

export const MandateSequencerView: React.FC<MandateSequencerViewProps> = ({
  incidents,
  onExecuteRetry,
}) => {
  const mandateIncidents = incidents.filter(
    (i) => i.channel === 'upi_mandate' || i.channel === 'card_payment_degradation' || i.channel === 'failed_subscription'
  );

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Calendar className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Intelligent Mandate & Acquirer Retry Sequencer
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Unlike dumb dunning retries that hammer customer cards at random intervals, our autonomous sequencer aligns auto-debits with paydays, bank clearing windows, and secondary acquirer cascades.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">NSF Penalty Reduction</span>
              <span className="text-emerald-700 font-bold text-sm">84.6% Saved</span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Peak Recovery Slot</span>
              <span className="text-slate-900 font-bold text-sm">08:30 - 10:15 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithmic Clearing Windows Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-emerald-700 font-semibold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>1. Payday Liquidity Window</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Correlates presentation timing with national and corporate payroll cycles (1st, 5th, and alternate Fridays). Prevents non-sufficient fund (NSF) declines.
          </p>
          <div className="mt-3 text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded border border-slate-200">
            Window: +1 to +3 days post month-end
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-sky-700 font-semibold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>2. Gateway Latency Optimization</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Routes debit mandates during low-load interbank clearing windows when issuer anti-fraud velocity filters exhibit lowest false-positive drop-offs.
          </p>
          <div className="mt-3 text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded border border-slate-200">
            Window: 08:30 - 10:15 AM local time
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-indigo-700 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>3. Acquirer Cascade Fallback</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            When primary cross-border rails report soft decline (05: do_not_honor), dynamically cascades transaction through local domestic merchant of record.
          </p>
          <div className="mt-3 text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded border border-slate-200">
            Fallback: Secondary Domestic Routing
          </div>
        </div>
      </div>

      {/* Sequencer Incident Queue */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Mandate & Retry Schedules</h3>
            <p className="text-xs text-slate-500">
              {mandateIncidents.length} auto-debit accounts governed by compliance presentation limits
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
            Card Scheme Velocity Caps Active
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {mandateIncidents.map((inc) => {
            const isRecovered = inc.status === 'recovered';
            const isStopped = inc.status === 'stopped_compliant';

            return (
              <div
                key={inc.id}
                className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 mt-0.5">
                    {inc.channel === 'upi_mandate' ? (
                      <Smartphone className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{inc.customerName}</span>
                      <span className="text-[11px] font-mono text-slate-400">({inc.id})</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                        {inc.metadata?.gatewayName || 'Payment Engine'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      Decline: <span className="text-amber-800 bg-amber-50 px-1 py-0.2 rounded border border-amber-200 font-mono font-medium">{inc.errorCode}</span> • {inc.errorMessage}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {inc.diagnosis?.smartRetrySchedule || 'Scheduled for next clearing window'}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">
                        Velocity: {inc.attempts} of {inc.maxAttemptsAllowed} max presentations
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-base font-black text-slate-900">
                      {formatCurrency(inc.amount, inc.currency)}
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Recovery: {inc.diagnosis?.recoveryProbability ?? 80}%
                    </span>
                  </div>

                  <div>
                    {isRecovered ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                      </span>
                    ) : isStopped ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Halted
                      </span>
                    ) : (
                      <button
                        id={`btn-sequencer-retry-${inc.id}`}
                        onClick={() => onExecuteRetry(inc)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Execute Window Retry</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
