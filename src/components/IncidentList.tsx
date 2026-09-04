import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  ShoppingCart, 
  RefreshCw, 
  Building2, 
  Smartphone, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  HandCoins, 
  ShieldAlert, 
  Sparkles,
  PhoneCall,
  Clock
} from 'lucide-react';
import { RecoveryIncident, ChannelType, IncidentStatus } from '../types';
import { formatCurrency } from '../utils/audit';

interface IncidentListProps {
  incidents: RecoveryIncident[];
  selectedIncident: RecoveryIncident | null;
  onSelectIncident: (incident: RecoveryIncident) => void;
  onQuickDiagnose: (incident: RecoveryIncident) => void;
  onQuickRecover: (incident: RecoveryIncident) => void;
  onQuickVoiceCall: (incident: RecoveryIncident) => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  onQuickDiagnose,
  onQuickRecover,
  onQuickVoiceCall,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredIncidents = useMemo(() => {
    return incidents.filter(item => {
      const matchesSearch = 
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.companyName && item.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.errorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesChannel = channelFilter === 'all' || item.channel === channelFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [incidents, searchQuery, channelFilter, statusFilter]);

  const getChannelBadge = (channel: ChannelType) => {
    switch (channel) {
      case 'card_payment_degradation':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            <CreditCard className="w-3 h-3" /> Card Degradation
          </span>
        );
      case 'checkout_abandon':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <ShoppingCart className="w-3 h-3" /> Checkout Abandon
          </span>
        );
      case 'failed_subscription':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-violet-50 text-violet-700 border border-violet-200">
            <RefreshCw className="w-3 h-3" /> Failed Subscription
          </span>
        );
      case 'b2b_invoice':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Building2 className="w-3 h-3" /> B2B Receivables
          </span>
        );
      case 'upi_mandate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Smartphone className="w-3 h-3" /> UPI Mandate AutoPay
          </span>
        );
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'recovered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Recovered
          </span>
        );
      case 'ptp_active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <HandCoins className="w-3 h-3" /> PTP Active
          </span>
        );
      case 'stopped_compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3" /> Stopped Compliant
          </span>
        );
      case 'intervention_active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 animate-spin" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> At Risk
          </span>
        );
    }
  };

  const getEscalationStagePill = (stage: number) => {
    const labels = [
      'Stage 0: Silent Retry',
      'Stage 1: Soft Notification',
      'Stage 2: Direct Outreach',
      'Stage 3: Concierge / Voice',
      'Stage 4: Grace Freeze'
    ];
    return (
      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200" title={labels[stage]}>
        L{stage}
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
      {/* Control Bar: Search & Filters */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 bg-white">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="input-search-incidents"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, invoice, error..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap justify-start md:justify-end">
          {/* Channel filter */}
          <select
            id="select-channel-filter"
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:bg-white focus:border-indigo-500"
          >
            <option value="all">All Channels ({incidents.length})</option>
            <option value="card_payment_degradation">Card Degradation</option>
            <option value="checkout_abandon">Checkout Abandon</option>
            <option value="failed_subscription">Failed Subscriptions</option>
            <option value="b2b_invoice">B2B Receivables</option>
            <option value="upi_mandate">UPI Mandates</option>
          </select>

          {/* Status filter */}
          <select
            id="select-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:bg-white focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="at_risk">At Risk</option>
            <option value="intervention_active">In Progress</option>
            <option value="ptp_active">PTP Active</option>
            <option value="recovered">Recovered</option>
            <option value="stopped_compliant">Stopped Compliant</option>
          </select>
        </div>
      </div>

      {/* Incidents Table / Cards */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              <th className="py-3 px-4">Customer & Channel</th>
              <th className="py-3 px-4">Amount at Risk</th>
              <th className="py-3 px-4">Trigger & Diagnostic Root Cause</th>
              <th className="py-3 px-4">Recovery Score</th>
              <th className="py-3 px-4">Status & Stage</th>
              <th className="py-3 px-4 text-right">Bounded Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                  No revenue recovery incidents match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredIncidents.map((incident) => {
                const isSelected = selectedIncident?.id === incident.id;
                const probability = incident.diagnosis?.recoveryProbability ?? 75;

                return (
                  <tr
                    key={incident.id}
                    id={`incident-row-${incident.id}`}
                    onClick={() => onSelectIncident(incident)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected 
                        ? 'bg-indigo-50/60 border-l-4 border-l-indigo-600' 
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Customer info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{incident.customerName}</span>
                            {incident.locale && (
                              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 uppercase font-mono">
                                {incident.locale}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {incident.companyName ? incident.companyName : incident.customerEmail}
                          </div>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            {getChannelBadge(incident.channel)}
                            <span className="text-[10px] text-slate-400 font-mono">
                              {incident.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-base font-bold text-slate-900 tracking-tight">
                        {formatCurrency(incident.amount, incident.currency)}
                      </div>
                      <div className="text-xs text-slate-500">
                        LTV: {incident.customerLtv}
                      </div>
                      {incident.daysOverdue > 0 && (
                        <span className="text-[11px] text-rose-600 font-medium">
                          +{incident.daysOverdue}d overdue
                        </span>
                      )}
                    </td>

                    {/* Diagnosis & Error */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                      <div className="text-xs font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 inline-block truncate max-w-full font-medium" title={incident.errorMessage}>
                        {incident.errorCode}
                      </div>
                      <div className="text-xs text-slate-600 mt-1 line-clamp-2" title={incident.diagnosis?.rootCause || incident.errorMessage}>
                        {incident.diagnosis?.rootCause || incident.errorMessage}
                      </div>
                      {incident.diagnosis?.smartRetrySchedule && (
                        <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{incident.diagnosis.smartRetrySchedule}</span>
                        </div>
                      )}
                    </td>

                    {/* Recovery Confidence */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              probability >= 80 
                                ? 'bg-emerald-500' 
                                : probability >= 50 
                                ? 'bg-amber-500' 
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${probability}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 font-mono">
                          {probability}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {incident.attempts} / {incident.maxAttemptsAllowed} attempts
                      </span>
                    </td>

                    {/* Status & Stage */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        {getStatusBadge(incident.status)}
                        <div className="flex items-center gap-1">
                          {getEscalationStagePill(incident.diagnosis?.escalationStage ?? 1)}
                          {incident.status === 'ptp_active' && incident.promiseToPay && (
                            <span className="text-[10px] text-sky-700 font-medium">
                              Due {incident.promiseToPay.promisedDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {incident.status === 'at_risk' && (
                          <>
                            <button
                              id={`btn-diagnose-${incident.id}`}
                              onClick={() => onQuickDiagnose(incident)}
                              title="Run AI Root Cause Diagnosis"
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1 transition-colors shadow-xs"
                            >
                              <Sparkles className="w-3 h-3 text-indigo-600" />
                              Diagnose
                            </button>

                            {incident.channel === 'upi_mandate' ? (
                              <button
                                id={`btn-voice-${incident.id}`}
                                onClick={() => onQuickVoiceCall(incident)}
                                title="Launch Hinglish Voice Agent"
                                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1 transition-colors shadow-xs"
                              >
                                <PhoneCall className="w-3 h-3" />
                                Hinglish
                              </button>
                            ) : (
                              <button
                                id={`btn-retry-${incident.id}`}
                                onClick={() => onQuickRecover(incident)}
                                title="Execute Bounded Intervention"
                                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
                              >
                                Recover
                              </button>
                            )}
                          </>
                        )}

                        {incident.status === 'ptp_active' && (
                          <button
                            id={`btn-settle-ptp-${incident.id}`}
                            onClick={() => onQuickRecover(incident)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors shadow-xs"
                          >
                            Settle PTP
                          </button>
                        )}

                        <button
                          onClick={() => onSelectIncident(incident)}
                          title="Open Case Dossier"
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
        <span>Showing {filteredIncidents.length} of {incidents.length} monitored revenue risks</span>
        <span className="text-[11px] font-mono text-slate-500">
          Groq — GPT-OSS-20B + Deterministic Safety Engine
        </span>
      </div>
    </div>
  );
};
