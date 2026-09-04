import React from 'react';
import { 
  HandCoins, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Send, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { RecoveryIncident } from '../types';
import { formatCurrency } from '../utils/audit';

interface PtpTrackerViewProps {
  incidents: RecoveryIncident[];
  onSettlePtp: (incident: RecoveryIncident) => void;
  onExtendGrace: (incident: RecoveryIncident) => void;
}

export const PtpTrackerView: React.FC<PtpTrackerViewProps> = ({
  incidents,
  onSettlePtp,
  onExtendGrace,
}) => {
  const ptpIncidents = incidents.filter(
    (i) => i.promiseToPay || i.status === 'ptp_active'
  );

  const totalCommitted = ptpIncidents.reduce((acc, inc) => {
    return acc + (inc.promiseToPay?.promisedAmount || inc.amount);
  }, 0);

  const honoredCount = ptpIncidents.filter((i) => i.status === 'recovered').length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                <HandCoins className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Promise-to-Pay (PTP) Ledger & Grace Engine
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Eliminate involuntary churn by converting rigid dunning threats into collaborative settlement commitments. The agent freezes account downgrades and silences marketing nudges during active grace windows.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Active PTP Agreements</span>
              <span className="text-sky-700 font-bold text-sm">{ptpIncidents.length} Accounts</span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Committed Value</span>
              <span className="text-slate-900 font-bold text-sm">${totalCommitted.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PTP Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ptpIncidents.length === 0 ? (
          <div className="col-span-2 bg-white border border-slate-200/90 rounded-xl p-12 text-center text-slate-500 text-sm">
            No active Promise-to-Pay agreements recorded. Log commitments directly from incident dossiers or voice calls.
          </div>
        ) : (
          ptpIncidents.map((inc) => {
            const ptp = inc.promiseToPay;
            const isSettled = inc.status === 'recovered';

            return (
              <div
                key={inc.id}
                className="bg-white border border-slate-200/90 hover:border-sky-300 rounded-xl p-4 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{inc.customerName}</h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {inc.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {inc.companyName || inc.customerEmail}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-slate-900">
                        {formatCurrency(ptp?.promisedAmount || inc.amount, inc.currency)}
                      </div>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        {ptp?.installments ? `${ptp.installments} Installments` : 'Full Settlement'}
                      </span>
                    </div>
                  </div>

                  {/* Agreement Terms */}
                  <div className="mt-3.5 bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        Promised Date:
                      </span>
                      <span className="font-bold text-sky-700 font-mono">
                        {ptp?.promisedDate || '2026-09-05'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Grace Period Freeze:
                      </span>
                      <span className="text-emerald-700 font-mono text-[11px] font-medium">
                        Active • Dunning Silenced
                      </span>
                    </div>

                    {ptp?.notes && (
                      <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200 italic leading-relaxed">
                        "{ptp.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Channel: <strong className="text-slate-800">{ptp?.contactChannel || 'Voice Concierge'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSettled ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Fulfilled & Settled
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => onExtendGrace(inc)}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors"
                        >
                          +48h Grace
                        </button>
                        <button
                          id={`btn-fulfill-ptp-${inc.id}`}
                          onClick={() => onSettlePtp(inc)}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-xs"
                        >
                          Confirm Paid
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
