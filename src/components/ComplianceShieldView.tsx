import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  FileText,
  AlertTriangle,
  Scale
} from 'lucide-react';
import { RecoveryIncident, AuditLogEntry } from '../types';
import { formatCurrency } from '../utils/audit';

interface ComplianceShieldViewProps {
  incidents: RecoveryIncident[];
}

export const ComplianceShieldView: React.FC<ComplianceShieldViewProps> = ({ incidents }) => {
  const [filterActor, setFilterActor] = useState<string>('all');
  const [searchHash, setSearchHash] = useState<string>('');

  // Collect all audit entries from all incidents
  const allAuditEntries: (AuditLogEntry & { incidentId: string; customerName: string; currency: string })[] = [];
  incidents.forEach((inc) => {
    inc.auditTrail.forEach((aud) => {
      allAuditEntries.push({
        ...aud,
        incidentId: inc.id,
        customerName: inc.customerName,
        currency: inc.currency,
      });
    });
  });

  // Sort descending by timestamp
  allAuditEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredLogs = allAuditEntries.filter((entry) => {
    const matchesActor = filterActor === 'all' || entry.actor === filterActor;
    const matchesSearch = 
      entry.details.toLowerCase().includes(searchHash.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchHash.toLowerCase()) ||
      entry.hash.toLowerCase().includes(searchHash.toLowerCase()) ||
      entry.customerName.toLowerCase().includes(searchHash.toLowerCase()) ||
      entry.incidentId.toLowerCase().includes(searchHash.toLowerCase());
    return matchesActor && matchesSearch;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allAuditEntries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `revenue_recovery_audit_trail_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Scale className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Compliant Escalation Ladder & Tamper-Evident Audit Shield
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Strict stopping rules protect businesses from predatory collection fines, card network velocity surcharges, and customer harassment. Every action generates an immutable SHA-verified audit record.
            </p>
          </div>

          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors shrink-0"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Regulatory Audit Log</span>
          </button>
        </div>
      </div>

      {/* Escalation Ladder (Stage 0 to 4) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Bounded 5-Stage Autonomous Escalation Ladder
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-[10px] font-mono font-bold text-emerald-700 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
              STAGE 0
            </span>
            <h4 className="font-bold text-slate-900 text-xs mt-2">Silent Smart Retry</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Acquirer cascade & bank latency clearing. Zero customer contact or friction.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-[10px] font-mono font-bold text-teal-700 px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200">
              STAGE 1
            </span>
            <h4 className="font-bold text-slate-900 text-xs mt-2">Soft In-App Alert</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Passive banner & tokenized 1-click self-serve card update link.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-[10px] font-mono font-bold text-sky-700 px-1.5 py-0.5 rounded bg-sky-50 border border-sky-200">
              STAGE 2
            </span>
            <h4 className="font-bold text-slate-900 text-xs mt-2">Direct Push Outreach</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Single WhatsApp/SMS payment intent with Apple Pay or UPI AutoPay trigger.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-[10px] font-mono font-bold text-indigo-700 px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200">
              STAGE 3
            </span>
            <h4 className="font-bold text-slate-900 text-xs mt-2">Voice & PTP Concierge</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Hinglish or localized phone concierge. Negotiate payday promise-to-pay.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-[10px] font-mono font-bold text-rose-700 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200">
              STAGE 4
            </span>
            <h4 className="font-bold text-slate-900 text-xs mt-2">Grace Period Freeze</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Grace lockout. Halted prior to service termination to protect LTV.
            </p>
          </div>
        </div>
      </div>

      {/* Active Stopping Rules Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-rose-700 font-semibold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Hard Stopping Rules (Instant Termination)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Hard Decline Code 43/04 (Stolen Card):</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">Zero retry presentations allowed under Visa Rule 5.4.1. Prevents $25-$100 acquirer penalty fees.</p>
              </div>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Customer Cancellation Request:</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">If cardholder flags cancellation in voice or chat, agent halts all retries immediately.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-emerald-700 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Operational Quiet Hours & Velocity Caps</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">TRAI & TCPA Quiet Hours (8 PM - 9 AM):</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">Suppresses all interactive telephone and SMS outreach during consumer rest hours in local timezone.</p>
              </div>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Card Brand Velocity Ceiling:</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">Caps re-authorizations at max 3 attempts per 14-day cycle to prevent velocity blacklisting.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Complete Audit Ledger */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Master Immutable Audit Ledger ({filteredLogs.length} Events)
            </h3>
            <p className="text-xs text-slate-500">
              Cryptographically timestamped action history for compliance audits
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                placeholder="Search audit trail or hash..."
                className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>

            <select
              value={filterActor}
              onChange={(e) => setFilterActor(e.target.value)}
              className="bg-white border border-slate-200 text-xs text-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500 shadow-xs"
            >
              <option value="all">All Actors</option>
              <option value="AI_AGENT">AI_AGENT</option>
              <option value="SYSTEM_GATEWAY">SYSTEM_GATEWAY</option>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="COMPLIANCE_ENGINE">COMPLIANCE_ENGINE</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Actor & Action</th>
                <th className="py-2.5 px-4">Account Reference</th>
                <th className="py-2.5 px-4">Details & Stopping Rule Verified</th>
                <th className="py-2.5 px-4 text-right">Integrity Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                    {new Date(entry.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span
                      className={`font-semibold text-[10px] px-2 py-0.5 rounded font-mono mr-1.5 ${
                        entry.actor === 'AI_AGENT'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : entry.actor === 'SYSTEM_GATEWAY'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : entry.actor === 'CUSTOMER'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {entry.actor}
                    </span>
                    <strong className="text-slate-900">{entry.action.replace(/_/g, ' ')}</strong>
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span className="font-medium text-slate-900">{entry.customerName}</span>
                    <span className="text-[10px] text-slate-500 block font-mono">{entry.incidentId}</span>
                  </td>
                  <td className="py-2.5 px-4 max-w-md">
                    <div className="text-slate-600">{entry.details}</div>
                    {entry.stoppingRuleChecked && (
                      <div className="text-[10px] text-emerald-700 font-mono flex items-center gap-1 mt-0.5 font-medium">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {entry.stoppingRuleChecked}
                      </div>
                    )}
                    {entry.recoveredAmount && (
                      <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                        Recovered: {formatCurrency(entry.recoveredAmount, entry.currency)}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-right whitespace-nowrap font-mono text-slate-400 text-[10px]">
                    {entry.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
