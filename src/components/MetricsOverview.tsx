import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  HandCoins,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { RecoveryIncident } from '../types';

interface MetricsOverviewProps {
  incidents: RecoveryIncident[];
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  incidents
}) => {

  // =========================================================
  // CURRENCY NORMALIZATION
  // =========================================================

  // Demo normalization for multi-currency reporting.
  // These values are approximate USD equivalents and are used
  // only for dashboard aggregation.
  const toUsd = (amt: number, curr: string) => {
    if (curr === '₹') return amt / 83;
    if (curr === '€') return amt / 0.92;
    if (curr === '£') return amt / 0.78;
    if (curr === 'A$') return amt / 1.5;
    return amt;
  };


  // =========================================================
  // ACTIVE RECOVERY ITEMS
  // =========================================================

  const pendingIncidents = incidents.filter(
    i =>
      i.status === 'at_risk' ||
      i.status === 'intervention_active'
  );

  const hasActiveRecovery = pendingIncidents.length > 0;


  // =========================================================
  // TOTAL MONITORED EXPOSURE
  // =========================================================

  const totalMonitoredUsd = incidents.reduce((acc, inc) => {
    return acc + toUsd(inc.amount, inc.currency);
  }, 0);


  // =========================================================
  // CURRENT ACTIVE EXPOSURE
  // =========================================================

  // Outstanding Exposure represents only incidents that
  // are still active and require recovery action.

  const activeExposureUsd = pendingIncidents.reduce((acc, inc) => {
    return acc + toUsd(inc.amount, inc.currency);
  }, 0);


  // =========================================================
  // RECOVERED
  // =========================================================

  const recoveredIncidents = incidents.filter(
    i => i.status === 'recovered'
  );

  const totalRecoveredUsd = recoveredIncidents.reduce((acc, inc) => {
    return acc + toUsd(
      inc.recoveredAmount || inc.amount,
      inc.currency
    );
  }, 0);


  // =========================================================
  // PROMISE TO PAY
  // =========================================================

  const ptpIncidents = incidents.filter(
    i => i.status === 'ptp_active'
  );

  const totalPtpUsd = ptpIncidents.reduce((acc, inc) => {
    const amt =
      inc.promiseToPay?.promisedAmount ||
      inc.amount;

    return acc + toUsd(
      amt,
      inc.currency
    );
  }, 0);


  // =========================================================
  // STOPPED / COMPLIANT HALTS
  // =========================================================

  const stoppedIncidents = incidents.filter(
    i => i.status === 'stopped_compliant'
  );

  const totalStoppedUsd = stoppedIncidents.reduce((acc, inc) => {
    return acc + toUsd(
      inc.amount,
      inc.currency
    );
  }, 0);


  // =========================================================
  // RECOVERY RATE
  // =========================================================

  const recoveryRate =
    totalMonitoredUsd > 0
      ? (totalRecoveredUsd / totalMonitoredUsd) * 100
      : 0;


  // =========================================================
  // COMMITTED RECOVERY RATE
  // =========================================================

  const committedRecoveryRate =
    totalMonitoredUsd > 0
      ? ((totalRecoveredUsd + totalPtpUsd) / totalMonitoredUsd) * 100
      : 0;


  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

      {/* =====================================================
          1. MEASURED MONEY RECOVERED — OVERALL
         ===================================================== */}

      <div
        id="metric-card-recovered"
        className="bg-white border border-emerald-200 rounded-xl p-4 shadow-xs relative overflow-hidden bg-gradient-to-b from-white to-emerald-50/40"
      >

        <div className="flex items-center justify-between mb-2">

          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">

            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />

            Measured Money Recovered — Overall

          </span>

          <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">

            <TrendingUp className="w-3 h-3 mr-0.5 text-emerald-600" />

            {recoveryRate.toFixed(1)}% Recovery Rate

          </span>

        </div>


        <div className="flex items-baseline gap-2">

          <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            ${Math.round(totalRecoveredUsd).toLocaleString()}
          </span>

          <span className="text-xs text-slate-500">
            across {recoveredIncidents.length} accounts
          </span>

        </div>


        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1 border-t border-slate-100 pt-2">

          <ArrowUpRight className="w-3 h-3 text-emerald-600" />

          <span>
            Recovery execution completed for{' '}
            <strong className="text-slate-700">
              {recoveredIncidents.length}
            </strong>{' '}
            accounts
          </span>

        </div>

      </div>


      {/* =====================================================
          2. OUTSTANDING EXPOSURE
         ===================================================== */}

      <div
        id="metric-card-at-risk"
        className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs"
      >

        <div className="flex items-center justify-between mb-2">

          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">

            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />

            Outstanding Exposure

          </span>

          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60">

            {pendingIncidents.length} active recovery items

          </span>

        </div>


        <div className="flex items-baseline gap-2">

          <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">

            ${Math.round(activeExposureUsd).toLocaleString()}

          </span>

          <span className="text-xs text-slate-500">

            {hasActiveRecovery
              ? 'remaining exposure'
              : 'active exposure'}

          </span>

        </div>


        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1 border-t border-slate-100 pt-2">

          <Clock className="w-3 h-3 text-amber-600" />

          <span>

            {hasActiveRecovery
              ? 'Recovery actions pending execution'
              : 'All identified risks have been processed'}

          </span>

        </div>

      </div>


      {/* =====================================================
          3. PROMISE-TO-PAY — OVERALL
         ===================================================== */}

      <div
        id="metric-card-ptp"
        className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs"
      >

        <div className="flex items-center justify-between mb-2">

          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">

            <HandCoins className="w-3.5 h-3.5 text-sky-600" />

            Promise-to-Pay (PTP) — Overall

          </span>

          <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">

            {ptpIncidents.length} committed

          </span>

        </div>


        <div className="flex items-baseline gap-2">

          <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">

            ${Math.round(totalPtpUsd).toLocaleString()}

          </span>

          <span className="text-xs text-slate-500">
            committed exposure
          </span>

        </div>


        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1 border-t border-slate-100 pt-2">

          <span>
            Projected recovery coverage:{' '}

            <strong className="text-sky-700">
              {committedRecoveryRate.toFixed(1)}%
            </strong>

          </span>

        </div>

      </div>


      {/* =====================================================
          4. STOPPING RULES — OVERALL
         ===================================================== */}

      <div
        id="metric-card-stopped"
        className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs"
      >

        <div className="flex items-center justify-between mb-2">

          <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">

            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />

            Stopping Rules — Overall

          </span>

          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">

            {stoppedIncidents.length} halted

          </span>

        </div>


        <div className="flex items-baseline gap-2">

          <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">

            ${Math.round(totalStoppedUsd).toLocaleString()}

          </span>

          <span className="text-xs text-slate-500">
            exposure protected
          </span>

        </div>


        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1 border-t border-slate-100 pt-2">

          <span>
            Hard declines and quiet-hour cases halted
          </span>

        </div>

      </div>


      {/* =====================================================
          DEMO / TRANSPARENCY NOTE
         ===================================================== */}

      <div className="lg:col-span-4 mt-1">

        <div className="text-[10px] text-slate-400 text-right">
          USD values are normalized demo equivalents for
          cross-currency aggregation. Payment execution is simulated.
        </div>

      </div>

    </div>
  );
};