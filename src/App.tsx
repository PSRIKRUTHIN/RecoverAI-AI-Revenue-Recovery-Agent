// import React, { useState, useEffect } from 'react';
// import { initialIncidents } from './data/mockIncidents';
// import { RecoveryIncident } from './types';
// import { Header } from './components/Header';
// import { MetricsOverview } from './components/MetricsOverview';
// import { IncidentList } from './components/IncidentList';
// import { IncidentDetail } from './components/IncidentDetail';
// import { VoiceSimulatorModal } from './components/VoiceSimulatorModal';
// import { MandateSequencerView } from './components/MandateSequencerView';
// import { PtpTrackerView } from './components/PtpTrackerView';
// import { ComplianceShieldView } from './components/ComplianceShieldView';
// import { VoiceStudioView } from './components/VoiceStudioView';
// import { NewIncidentModal } from './components/NewIncidentModal';
// import { requestAiDiagnosis } from './services/api';
// import { createAuditEntry, formatCurrency } from './utils/audit';
// import { Sparkles } from 'lucide-react';

// export default function App() {
//   // Load saved incidents after refresh, otherwise use initial dataset
//   const [incidents, setIncidents] = useState<RecoveryIncident[]>(() => {
//     const saved = localStorage.getItem('recovery_incidents');

//     if (saved) {
//       try {
//         return JSON.parse(saved);
//       } catch {
//         console.warn('Could not load saved recovery incidents.');
//       }
//     }

//     return initialIncidents;
//   });

//   // Persist incidents whenever they change
//   useEffect(() => {
//     localStorage.setItem('recovery_incidents', JSON.stringify(incidents));
//   }, [incidents]);

//   const [selectedIncident, setSelectedIncident] = useState<RecoveryIncident | null>(null);
//   const [activeTab, setActiveTab] = useState<'queue' | 'sequencer' | 'voice' | 'ptp' | 'compliance'>('queue');
//   const [isBatchRunning, setIsBatchRunning] = useState(false);
//   const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);
//   const [voiceModalIncident, setVoiceModalIncident] = useState<RecoveryIncident | null>(null);
//   const [isDiagnosing, setIsDiagnosing] = useState(false);
//   const [batchBanner, setBatchBanner] = useState<string | null>(null);

//   const pendingCount = incidents.filter(
//     (i) => i.status === 'at_risk' || i.status === 'intervention_active'
//   ).length;

//   // Single AI Diagnosis Trigger
//   const handleDiagnoseWithAi = async (incident: RecoveryIncident) => {
//     setIsDiagnosing(true);

//     try {
//       const diagnosis = await requestAiDiagnosis(incident);

//       const auditEntry = createAuditEntry(
//         'AI_DIAGNOSIS_COMPLETED',
//         'AI_AGENT',
//         `Diagnosed root cause: ${diagnosis.rootCause}. Recommended intervention: ${diagnosis.intervention}`,
//         diagnosis.stoppingRule
//       );

//       const updated: RecoveryIncident = {
//         ...incident,
//         diagnosis,
//         auditTrail: [auditEntry, ...incident.auditTrail],
//       };

//       setIncidents((prev) =>
//         prev.map((item) => (item.id === incident.id ? updated : item))
//       );

//       if (selectedIncident?.id === incident.id) {
//         setSelectedIncident(updated);
//       }
//     } catch (err) {
//       console.error('Diagnosis failed:', err);
//     } finally {
//       setIsDiagnosing(false);
//     }
//   };

//   // Execute Retry / Recovery
//   const handleExecuteRetry = (incident: RecoveryIncident) => {
//     // Check if hard decline
//     if (
//       incident.errorCode.includes('stolen') ||
//       incident.errorCode.includes('lost')
//     ) {
//       handleTriggerStoppingRule(
//         incident,
//         'Hard decline (code 43/04): Card network rules strictly forbid automated retry.'
//       );
//       return;
//     }

//     const auditEntry = createAuditEntry(
//       'SMART_CASCADE_RETRY_EXECUTED',
//       'SYSTEM_GATEWAY',
//       `Auto-retry presented during optimal banking latency slot. Settlement confirmed.`,
//       `Verified velocity limit: Attempt ${incident.attempts + 1} of ${incident.maxAttemptsAllowed}`,
//       incident.amount
//     );

//     const updated: RecoveryIncident = {
//       ...incident,
//       status: 'recovered',
//       recoveredAmount: incident.amount,
//       recoveredAt: new Date().toISOString(),
//       attempts: incident.attempts + 1,
//       auditTrail: [auditEntry, ...incident.auditTrail],
//     };

//     setIncidents((prev) =>
//       prev.map((item) => (item.id === incident.id ? updated : item))
//     );

//     if (selectedIncident?.id === incident.id) {
//       setSelectedIncident(updated);
//     }

//     setBatchBanner(
//       `Recovered ${formatCurrency(
//         incident.amount,
//         incident.currency
//       )} from ${incident.customerName} via Smart Cascade Retry.`
//     );

//     setTimeout(() => setBatchBanner(null), 4500);
//   };

//   // Record Promise-to-Pay (PTP)
//   const handleRecordPtp = (
//     incident: RecoveryIncident,
//     promisedDate: string,
//     amount: number,
//     notes: string
//   ) => {
//     const auditEntry = createAuditEntry(
//       'PTP_AGREEMENT_LOCKED',
//       'CUSTOMER',
//       `Customer pledged settlement for ${promisedDate}. Automated dunning frozen.`,
//       'All automated SMS & calls suppressed until grace date'
//     );

//     const updated: RecoveryIncident = {
//       ...incident,
//       status: 'ptp_active',
//       promiseToPay: {
//         promisedDate,
//         promisedAmount: amount,
//         contactChannel: 'Self-Service Concierge Flow',
//         notes,
//         status: 'pending',
//         gracePeriodUntil: `${promisedDate}T23:59:59Z`,
//       },
//       auditTrail: [auditEntry, ...incident.auditTrail],
//     };

//     setIncidents((prev) =>
//       prev.map((item) => (item.id === incident.id ? updated : item))
//     );

//     if (selectedIncident?.id === incident.id) {
//       setSelectedIncident(updated);
//     }

//     setBatchBanner(
//       `Promise-to-Pay locked for ${incident.customerName} until ${promisedDate}. Nudges frozen.`
//     );

//     setTimeout(() => setBatchBanner(null), 4500);
//   };

//   // Compliant Halt
//   const handleTriggerStoppingRule = (
//     incident: RecoveryIncident,
//     reason: string
//   ) => {
//     const auditEntry = createAuditEntry(
//       'COMPLIANCE_STOPPING_RULE_ENFORCED',
//       'COMPLIANCE_ENGINE',
//       `Automated recovery halted: ${reason}`,
//       'Permanent suppression of payment presentation and direct communications'
//     );

//     const updated: RecoveryIncident = {
//       ...incident,
//       status: 'stopped_compliant',
//       stoppingReason: reason,
//       auditTrail: [auditEntry, ...incident.auditTrail],
//     };

//     setIncidents((prev) =>
//       prev.map((item) => (item.id === incident.id ? updated : item))
//     );

//     if (selectedIncident?.id === incident.id) {
//       setSelectedIncident(updated);
//     }

//     setBatchBanner(
//       `Stopping rule enforced for ${incident.customerName}. No further retries dispatched.`
//     );

//     setTimeout(() => setBatchBanner(null), 4500);
//   };

//   // Run Autonomous Batch Recovery
//   const handleRunBatchRecovery = async () => {
//     setIsBatchRunning(true);

//     setBatchBanner(
//       'Autonomous Agent initialized: triaging outstanding revenue at risk queue...'
//     );

//     const pending = incidents.filter((i) => i.status === 'at_risk');

//     let recoveredTotal = 0;
//     let haltedTotal = 0;

//     for (let index = 0; index < pending.length; index++) {
//       const inc = pending[index];

//       // Small delay to show autonomous step-by-step progress
//       await new Promise((r) => setTimeout(r, 600));

//       // 1. Check stopping rules: hard declines
//       if (
//         inc.errorCode.includes('stolen') ||
//         inc.errorCode.includes('lost') ||
//         inc.attempts >= inc.maxAttemptsAllowed
//       ) {
//         haltedTotal += 1;

//         setIncidents((prev) =>
//           prev.map((item) => {
//             if (item.id === inc.id) {
//               const audit = createAuditEntry(
//                 'BATCH_STOPPING_RULE_ENFORCED',
//                 'COMPLIANCE_ENGINE',
//                 'Hard decline intercepted during batch triage. Retries suppressed to avoid scheme fines.',
//                 'Visa Rule 5.4.1 compliance verified'
//               );

//               return {
//                 ...item,
//                 status: 'stopped_compliant',
//                 stoppingReason: 'Hard decline code intercepted. Retries halted.',
//                 auditTrail: [audit, ...item.auditTrail],
//               };
//             }

//             return item;
//           })
//         );
//       }

//       // 2. Check for PTP candidate
//       else if (
//         inc.channel === 'b2b_invoice' ||
//         inc.errorCode === 'insufficient_funds'
//       ) {
//         setIncidents((prev) =>
//           prev.map((item) => {
//             if (item.id === inc.id) {
//               const audit = createAuditEntry(
//                 'BATCH_PTP_CONCIERGE_ENGAGED',
//                 'AI_AGENT',
//                 'Auto-negotiated grace period aligned with client disbursement schedule.',
//                 'Quiet hours honored; dunning frozen'
//               );

//               const futureDate = new Date();
//               futureDate.setDate(futureDate.getDate() + 4);

//               return {
//                 ...item,
//                 status: 'ptp_active',
//                 promiseToPay: {
//                   promisedDate: futureDate.toISOString().split('T')[0],
//                   promisedAmount: item.amount,
//                   contactChannel: 'AI Batch Concierge',
//                   notes: 'Auto-negotiated during batch triage.',
//                   status: 'pending',
//                   gracePeriodUntil: `${
//                     futureDate.toISOString().split('T')[0]
//                   }T23:59:59Z`,
//                 },
//                 auditTrail: [audit, ...item.auditTrail],
//               };
//             }

//             return item;
//           })
//         );
//       }

//       // 3. Normal recoverable candidate
//       else {
//         recoveredTotal += 1;

//         setIncidents((prev) =>
//           prev.map((item) => {
//             if (item.id === inc.id) {
//               const audit = createAuditEntry(
//                 'BATCH_RECOVERY_EXECUTED',
//                 'AI_AGENT',
//                 `Executed bounded recovery via ${
//                   item.diagnosis?.channelRecommended || 'smart_retry'
//                 }. Approvals verified.`,
//                 'Card scheme velocity limits verified',
//                 item.amount
//               );

//               return {
//                 ...item,
//                 status: 'recovered',
//                 recoveredAmount: item.amount,
//                 recoveredAt: new Date().toISOString(),
//                 auditTrail: [audit, ...item.auditTrail],
//               };
//             }

//             return item;
//           })
//         );
//       }
//     }

//     setIsBatchRunning(false);

//     setBatchBanner(
//       `Batch Finished: Successfully recovered ${recoveredTotal} accounts, secured PTP on liquidity gaps, and compliantly halted ${haltedTotal} high-risk declines.`
//     );

//     setTimeout(() => setBatchBanner(null), 6000);
//   };

//   const handleResetData = () => {
//     setIncidents(initialIncidents);
//     setSelectedIncident(null);
//     setBatchBanner('Reset to benchmark baseline dataset.');

//     setTimeout(() => setBatchBanner(null), 3000);
//   };

//   const handleAddIncident = (newIncident: RecoveryIncident) => {
//     setIncidents((prev) => [newIncident, ...prev]);
//     setSelectedIncident(newIncident);

//     setBatchBanner(
//       `Ingested new incident ${newIncident.id} (${newIncident.customerName}). Ready for diagnosis.`
//     );

//     setTimeout(() => setBatchBanner(null), 4000);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">

//       {/* Top Navbar Header */}
//       <Header
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         onRunBatch={handleRunBatchRecovery}
//         isBatchRunning={isBatchRunning}
//         onOpenNewIncident={() => setShowNewIncidentModal(true)}
//         onResetData={handleResetData}
//         pendingCount={pendingCount}
//       />

//       {/* Main Container */}
//       <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">

//         {/* Dynamic Notification Toast / Banner */}
//         {batchBanner && (
//           <div
//             id="batch-toast-banner"
//             className="mb-5 p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs flex items-center justify-between text-xs text-emerald-800 animate-fadeIn"
//           >
//             <div className="flex items-center gap-2.5">
//               <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
//                 <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
//               </div>

//               <span className="font-medium text-slate-800">
//                 {batchBanner}
//               </span>
//             </div>

//             <button
//               onClick={() => setBatchBanner(null)}
//               className="text-slate-400 hover:text-slate-700 text-xs px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
//             >
//               ✕
//             </button>
//           </div>
//         )}

//         {/* Measured Financial Metrics Bar */}
//         <MetricsOverview incidents={incidents} />

//         {/* View Switcher */}
//         {activeTab === 'queue' && (
//           <div className="space-y-6">

//             {selectedIncident && (
//               <IncidentDetail
//                 incident={selectedIncident}
//                 onClose={() => setSelectedIncident(null)}
//                 onDiagnoseWithAi={handleDiagnoseWithAi}
//                 onExecuteRetry={handleExecuteRetry}
//                 onOpenVoiceModal={(inc) => setVoiceModalIncident(inc)}
//                 onRecordPtp={handleRecordPtp}
//                 onTriggerStoppingRule={handleTriggerStoppingRule}
//                 isDiagnosing={isDiagnosing}
//               />
//             )}

//             <IncidentList
//               incidents={incidents}
//               selectedIncident={selectedIncident}
//               onSelectIncident={(inc) => setSelectedIncident(inc)}
//               onQuickDiagnose={handleDiagnoseWithAi}
//               onQuickRecover={handleExecuteRetry}
//               onQuickVoiceCall={(inc) => setVoiceModalIncident(inc)}
//             />
//           </div>
//         )}

//         {activeTab === 'sequencer' && (
//           <MandateSequencerView
//             incidents={incidents}
//             onExecuteRetry={handleExecuteRetry}
//           />
//         )}

//         {activeTab === 'voice' && (
//           <VoiceStudioView
//             incidents={incidents}
//             onOpenVoiceModal={(inc) => setVoiceModalIncident(inc)}
//           />
//         )}

//         {activeTab === 'ptp' && (
//           <PtpTrackerView
//             incidents={incidents}
//             onSettlePtp={handleExecuteRetry}
//             onExtendGrace={(inc) => {
//               if (inc.promiseToPay) {
//                 const current = new Date(
//                   inc.promiseToPay.promisedDate
//                 );

//                 current.setDate(current.getDate() + 2);

//                 handleRecordPtp(
//                   inc,
//                   current.toISOString().split('T')[0],
//                   inc.promiseToPay.promisedAmount,
//                   'Extended +48h grace period via PTP ledger'
//                 );
//               }
//             }}
//           />
//         )}



//         {activeTab === 'compliance' && (
//           <ComplianceShieldView incidents={incidents} />
//         )}
//       </main>


//       {/* Voice Call Simulation Modal */}
//       {voiceModalIncident && (
//         <VoiceSimulatorModal
//           incident={voiceModalIncident}
//           onClose={() => setVoiceModalIncident(null)}
//           onPaymentRecovered={(inc) => {
//             handleExecuteRetry(inc);
//             setVoiceModalIncident(null);
//           }}
//           onPtpAgreed={(inc, date, notes) => {
//             handleRecordPtp(inc, date, inc.amount, notes);
//             setVoiceModalIncident(null);
//           }}
//           onCompliantStop={(inc, reason) => {
//             handleTriggerStoppingRule(inc, reason);
//             setVoiceModalIncident(null);
//           }}
//         />
//       )}

//       {/* Ingest Incident Modal */}
//       {showNewIncidentModal && (
//         <NewIncidentModal
//           onClose={() => setShowNewIncidentModal(false)}
//           onAddIncident={handleAddIncident}
//         />
//       )}

//       {/* Footer */}
//       <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
//         <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
//           <span>
//             AI Revenue Recovery Agent • Bounded Interventions & Audit Trail
//           </span>

//           <span className="font-mono text-[11px] text-slate-400">
//             Policy-constrained recovery demo • compliance rules are illustrative, not legal certification
//           </span>
//         </div>
//       </footer>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { initialIncidents } from './data/mockIncidents';
import { RecoveryIncident } from './types';
import { Header } from './components/Header';
import { MetricsOverview } from './components/MetricsOverview';
import { IncidentList } from './components/IncidentList';
import { IncidentDetail } from './components/IncidentDetail';
import { VoiceSimulatorModal } from './components/VoiceSimulatorModal';
import { MandateSequencerView } from './components/MandateSequencerView';
import { PtpTrackerView } from './components/PtpTrackerView';
import { ComplianceShieldView } from './components/ComplianceShieldView';
import { VoiceStudioView } from './components/VoiceStudioView';
import { NewIncidentModal } from './components/NewIncidentModal';
import { RecoveryCheckout } from './components/RecoveryCheckout';
import { requestAiDiagnosis } from './services/api';
import { createAuditEntry, formatCurrency } from './utils/audit';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Start with the original benchmark dataset every time the app loads.
  // No localStorage persistence is used.
  const [incidents, setIncidents] =
    useState<RecoveryIncident[]>(initialIncidents);

  const [selectedIncident, setSelectedIncident] =
    useState<RecoveryIncident | null>(null);

  const [activeTab, setActiveTab] = useState<
    'queue' | 'sequencer' | 'voice' | 'ptp' | 'compliance'
  >('queue');

  const [isBatchRunning, setIsBatchRunning] =
    useState(false);

  const [showNewIncidentModal, setShowNewIncidentModal] =
    useState(false);

  const [voiceModalIncident, setVoiceModalIncident] =
    useState<RecoveryIncident | null>(null);

  const [checkoutIncident, setCheckoutIncident] =
    useState<RecoveryIncident | null>(null);

  const [isDiagnosing, setIsDiagnosing] =
    useState(false);

  const [batchBanner, setBatchBanner] =
    useState<string | null>(null);

  // =========================================================
  // PENDING COUNT
  // =========================================================

  const pendingCount = incidents.filter(
    (i) =>
      i.status === 'at_risk' ||
      i.status === 'intervention_active'
  ).length;

  // =========================================================
  // SINGLE AI DIAGNOSIS
  // =========================================================

  const handleDiagnoseWithAi = async (
    incident: RecoveryIncident
  ) => {
    setIsDiagnosing(true);

    try {
      const diagnosis =
        await requestAiDiagnosis(incident);

      const auditEntry = createAuditEntry(
        'AI_DIAGNOSIS_COMPLETED',
        'AI_AGENT',
        `Diagnosed root cause: ${diagnosis.rootCause}. Recommended intervention: ${diagnosis.intervention}`,
        diagnosis.stoppingRule
      );

      const updated: RecoveryIncident = {
        ...incident,
        diagnosis,
        auditTrail: [
          auditEntry,
          ...incident.auditTrail,
        ],
      };

      setIncidents((prev) =>
        prev.map((item) =>
          item.id === incident.id
            ? updated
            : item
        )
      );

      if (
        selectedIncident?.id === incident.id
      ) {
        setSelectedIncident(updated);
      }
    } catch (err) {
      console.error(
        'Diagnosis failed:',
        err
      );
    } finally {
      setIsDiagnosing(false);
    }
  };

  // =========================================================
  // EXECUTE RETRY / RECOVERY
  // =========================================================

  const handleExecuteRetry = (
    incident: RecoveryIncident
  ) => {
    // Hard decline protection
    if (
      incident.errorCode.includes('stolen') ||
      incident.errorCode.includes('lost')
    ) {
      handleTriggerStoppingRule(
        incident,
        'Hard decline (code 43/04): Card network rules strictly forbid automated retry.'
      );

      return;
    }

    const auditEntry = createAuditEntry(
      'SMART_CASCADE_RETRY_EXECUTED',
      'SYSTEM_GATEWAY',
      'Auto-retry presented during optimal banking latency slot. Settlement confirmed.',
      `Verified velocity limit: Attempt ${
        incident.attempts + 1
      } of ${incident.maxAttemptsAllowed}`,
      incident.amount
    );

    const updated: RecoveryIncident = {
      ...incident,
      status: 'recovered',
      recoveredAmount: incident.amount,
      recoveredAt:
        new Date().toISOString(),
      attempts:
        incident.attempts + 1,
      auditTrail: [
        auditEntry,
        ...incident.auditTrail,
      ],
    };

    setIncidents((prev) =>
      prev.map((item) =>
        item.id === incident.id
          ? updated
          : item
      )
    );

    if (
      selectedIncident?.id === incident.id
    ) {
      setSelectedIncident(updated);
    }

    setBatchBanner(
      `Recovered ${formatCurrency(
        incident.amount,
        incident.currency
      )} from ${incident.customerName} via Smart Cascade Retry.`
    );

    setTimeout(
      () => setBatchBanner(null),
      4500
    );
  };

  // =========================================================
  // 1-CLICK FASTLINK RECOVERY
  // =========================================================

  const handleFastLinkRecovery = (
    incident: RecoveryIncident
  ) => {
    const auditEntry = createAuditEntry(
      'FASTLINK_RECOVERY_EXECUTED',
      'SYSTEM_GATEWAY',
      `One-click recovery checkout completed for ${incident.customerName}. Simulated settlement confirmed.`,
      'Single bounded recovery nudge executed through secure demo checkout.',
      incident.amount
    );

    const updated: RecoveryIncident = {
      ...incident,
      status: 'recovered',
      recoveredAmount: incident.amount,
      recoveredAt: new Date().toISOString(),
      auditTrail: [
        auditEntry,
        ...incident.auditTrail,
      ],
    };

    setIncidents((prev) =>
      prev.map((item) =>
        item.id === incident.id
          ? updated
          : item
      )
    );

    if (
      selectedIncident?.id === incident.id
    ) {
      setSelectedIncident(updated);
    }

    setCheckoutIncident(null);

    setBatchBanner(
      `Recovered ${formatCurrency(
        incident.amount,
        incident.currency
      )} from ${incident.customerName} via 1-Click FastLink.`
    );

    setTimeout(
      () => setBatchBanner(null),
      4500
    );
  };

  // =========================================================
  // RECORD PROMISE-TO-PAY
  // =========================================================

  const handleRecordPtp = (
    incident: RecoveryIncident,
    promisedDate: string,
    amount: number,
    notes: string
  ) => {
    const auditEntry = createAuditEntry(
      'PTP_AGREEMENT_LOCKED',
      'CUSTOMER',
      `Customer pledged settlement for ${promisedDate}. Automated dunning frozen.`,
      'All automated SMS & calls suppressed until grace date'
    );

    const updated: RecoveryIncident = {
      ...incident,
      status: 'ptp_active',
      promiseToPay: {
        promisedDate,
        promisedAmount: amount,
        contactChannel:
          'Self-Service Concierge Flow',
        notes,
        status: 'pending',
        gracePeriodUntil:
          `${promisedDate}T23:59:59Z`,
      },
      auditTrail: [
        auditEntry,
        ...incident.auditTrail,
      ],
    };

    setIncidents((prev) =>
      prev.map((item) =>
        item.id === incident.id
          ? updated
          : item
      )
    );

    if (
      selectedIncident?.id === incident.id
    ) {
      setSelectedIncident(updated);
    }

    setBatchBanner(
      `Promise-to-Pay locked for ${incident.customerName} until ${promisedDate}. Nudges frozen.`
    );

    setTimeout(
      () => setBatchBanner(null),
      4500
    );
  };

  // =========================================================
  // COMPLIANT STOPPING RULE
  // =========================================================

  const handleTriggerStoppingRule = (
    incident: RecoveryIncident,
    reason: string
  ) => {
    const auditEntry = createAuditEntry(
      'COMPLIANCE_STOPPING_RULE_ENFORCED',
      'COMPLIANCE_ENGINE',
      `Automated recovery halted: ${reason}`,
      'Permanent suppression of payment presentation and direct communications'
    );

    const updated: RecoveryIncident = {
      ...incident,
      status: 'stopped_compliant',
      stoppingReason: reason,
      auditTrail: [
        auditEntry,
        ...incident.auditTrail,
      ],
    };

    setIncidents((prev) =>
      prev.map((item) =>
        item.id === incident.id
          ? updated
          : item
      )
    );

    if (
      selectedIncident?.id === incident.id
    ) {
      setSelectedIncident(updated);
    }

    setBatchBanner(
      `Stopping rule enforced for ${incident.customerName}. No further retries dispatched.`
    );

    setTimeout(
      () => setBatchBanner(null),
      4500
    );
  };

  // =========================================================
  // AUTONOMOUS BATCH RECOVERY
  // =========================================================

  const handleRunBatchRecovery = async () => {
    setIsBatchRunning(true);

    setBatchBanner(
      'Autonomous Agent initialized: triaging outstanding revenue at risk queue...'
    );

    // Only incidents currently at risk are processed
    // by this batch run.
    const pending = incidents.filter(
      (i) => i.status === 'at_risk'
    );

    // Batch-specific counters.
    let recoveredTotal = 0;
    let haltedTotal = 0;
    let ptpTotal = 0;

    // =======================================================
    // PROCESS EACH AT-RISK INCIDENT
    // =======================================================

    for (
      let index = 0;
      index < pending.length;
      index++
    ) {
      const inc = pending[index];

      // Small delay so the UI visibly processes
      // the queue step-by-step.
      await new Promise((r) =>
        setTimeout(r, 600)
      );

      // =====================================================
      // 1. STOPPING RULE
      // =====================================================

      if (
        inc.errorCode.includes('stolen') ||
        inc.errorCode.includes('lost') ||
        inc.attempts >=
          inc.maxAttemptsAllowed
      ) {
        haltedTotal += 1;

        setIncidents((prev) =>
          prev.map((item) => {
            if (item.id === inc.id) {
              const audit =
                createAuditEntry(
                  'BATCH_STOPPING_RULE_ENFORCED',
                  'COMPLIANCE_ENGINE',
                  'Hard decline intercepted during batch triage. Retries suppressed.',
                  'Stopping rule verified before automated retry'
                );

              return {
                ...item,
                status:
                  'stopped_compliant',
                stoppingReason:
                  'Hard decline code intercepted. Retries halted.',
                auditTrail: [
                  audit,
                  ...item.auditTrail,
                ],
              };
            }

            return item;
          })
        );
      }

      // =====================================================
      // 2. PTP CANDIDATE
      // =====================================================

      else if (
        inc.channel === 'b2b_invoice' ||
        inc.errorCode ===
          'insufficient_funds'
      ) {
        // Count ONLY PTP commitments created
        // during this batch execution.
        ptpTotal += 1;

        setIncidents((prev) =>
          prev.map((item) => {
            if (item.id === inc.id) {
              const audit =
                createAuditEntry(
                  'BATCH_PTP_CONCIERGE_ENGAGED',
                  'AI_AGENT',
                  'Auto-negotiated grace period aligned with client disbursement schedule.',
                  'Quiet hours honored; dunning frozen'
                );

              const futureDate =
                new Date();

              futureDate.setDate(
                futureDate.getDate() + 4
              );

              const promisedDate =
                futureDate
                  .toISOString()
                  .split('T')[0];

              return {
                ...item,
                status: 'ptp_active',
                promiseToPay: {
                  promisedDate,
                  promisedAmount:
                    item.amount,
                  contactChannel:
                    'AI Batch Concierge',
                  notes:
                    'Auto-negotiated during batch triage.',
                  status: 'pending',
                  gracePeriodUntil:
                    `${promisedDate}T23:59:59Z`,
                },
                auditTrail: [
                  audit,
                  ...item.auditTrail,
                ],
              };
            }

            return item;
          })
        );
      }

      // =====================================================
      // 3. NORMAL RECOVERABLE
      // =====================================================

      else {
        recoveredTotal += 1;

        setIncidents((prev) =>
          prev.map((item) => {
            if (item.id === inc.id) {
              const audit =
                createAuditEntry(
                  'BATCH_RECOVERY_EXECUTED',
                  'AI_AGENT',
                  `Executed bounded recovery via ${
                    item.diagnosis
                      ?.channelRecommended ||
                    'smart_retry'
                  }. Approvals verified.`,
                  'Card scheme velocity limits verified',
                  item.amount
                );

              return {
                ...item,
                status: 'recovered',
                recoveredAmount:
                  item.amount,
                recoveredAt:
                  new Date().toISOString(),
                auditTrail: [
                  audit,
                  ...item.auditTrail,
                ],
              };
            }

            return item;
          })
        );
      }
    }

    // =======================================================
    // BATCH COMPLETE
    // =======================================================

    setIsBatchRunning(false);

    setBatchBanner(
      `Batch Finished: ${recoveredTotal} recoveries executed • ${ptpTotal} PTP commitments secured • ${haltedTotal} high-risk cases compliantly halted • ${pending.length} at-risk cases processed.`
    );

    setTimeout(
      () => setBatchBanner(null),
      6000
    );
  };

  // =========================================================
  // RESET DATA
  // =========================================================

  const handleResetData = () => {
    setIncidents(initialIncidents);
    setSelectedIncident(null);
    setCheckoutIncident(null);

    setBatchBanner(
      'Reset to benchmark baseline dataset.'
    );

    setTimeout(
      () => setBatchBanner(null),
      3000
    );
  };

  // =========================================================
  // ADD NEW INCIDENT
  // =========================================================

  const handleAddIncident = (
    newIncident: RecoveryIncident
  ) => {
    setIncidents((prev) => [
      newIncident,
      ...prev,
    ]);

    setSelectedIncident(newIncident);

    setBatchBanner(
      `Ingested new incident ${newIncident.id} (${newIncident.customerName}). Ready for diagnosis.`
    );

    setTimeout(
      () => setBatchBanner(null),
      4000
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">

      {/* ===================================================
          HEADER
      =================================================== */}

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunBatch={handleRunBatchRecovery}
        isBatchRunning={isBatchRunning}
        onOpenNewIncident={() =>
          setShowNewIncidentModal(true)
        }
        onResetData={handleResetData}
        pendingCount={pendingCount}
      />

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">

        {/* =================================================
            BATCH NOTIFICATION
        ================================================= */}

        {batchBanner && (
          <div
            id="batch-toast-banner"
            className="mb-5 p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs flex items-center justify-between text-xs text-emerald-800 animate-fadeIn"
          >
            <div className="flex items-center gap-2.5">

              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              </div>

              <span className="font-medium text-slate-800">
                {batchBanner}
              </span>

            </div>

            <button
              onClick={() =>
                setBatchBanner(null)
              }
              className="text-slate-400 hover:text-slate-700 text-xs px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* =================================================
            FINANCIAL METRICS
        ================================================= */}

        <MetricsOverview
          incidents={incidents}
        />

        {/* =================================================
            RECOVERY QUEUE
        ================================================= */}

        {activeTab === 'queue' && (
          <div className="space-y-6">

            {selectedIncident && (
              <IncidentDetail
                incident={
                  selectedIncident
                }
                onClose={() =>
                  setSelectedIncident(null)
                }
                onOpenFastLink={(inc) =>
                  setCheckoutIncident(inc)
                }
                onDiagnoseWithAi={
                  handleDiagnoseWithAi
                }
                onExecuteRetry={
                  handleExecuteRetry
                }
                onOpenVoiceModal={(inc) =>
                  setVoiceModalIncident(
                    inc
                  )
                }
                onRecordPtp={
                  handleRecordPtp
                }
                onTriggerStoppingRule={
                  handleTriggerStoppingRule
                }
                isDiagnosing={
                  isDiagnosing
                }
              />
            )}

            <IncidentList
              incidents={incidents}
              selectedIncident={
                selectedIncident
              }
              onSelectIncident={(inc) =>
                setSelectedIncident(
                  inc
                )
              }
              onQuickDiagnose={
                handleDiagnoseWithAi
              }
              onQuickRecover={
                handleExecuteRetry
              }
              onQuickVoiceCall={(inc) =>
                setVoiceModalIncident(
                  inc
                )
              }
            />

          </div>
        )}

        {/* =================================================
            MANDATE SEQUENCER
        ================================================= */}

        {activeTab === 'sequencer' && (
          <MandateSequencerView
            incidents={incidents}
            onExecuteRetry={
              handleExecuteRetry
            }
          />
        )}

        {/* =================================================
            VOICE RECOVERY
        ================================================= */}

        {activeTab === 'voice' && (
          <VoiceStudioView
            incidents={incidents}
            onOpenVoiceModal={(inc) =>
              setVoiceModalIncident(
                inc
              )
            }
          />
        )}

        {/* =================================================
            PTP TRACKER
        ================================================= */}

        {activeTab === 'ptp' && (
          <PtpTrackerView
            incidents={incidents}
            onSettlePtp={
              handleExecuteRetry
            }
            onExtendGrace={(inc) => {
              if (inc.promiseToPay) {
                const current =
                  new Date(
                    inc.promiseToPay
                      .promisedDate
                  );

                current.setDate(
                  current.getDate() + 2
                );

                handleRecordPtp(
                  inc,
                  current
                    .toISOString()
                    .split('T')[0],
                  inc.promiseToPay
                    .promisedAmount,
                  'Extended +48h grace period via PTP ledger'
                );
              }
            }}
          />
        )}

        {/* =================================================
            COMPLIANCE
        ================================================= */}

        {activeTab === 'compliance' && (
          <ComplianceShieldView
            incidents={incidents}
          />
        )}

      </main>

      {/* ===================================================
          1-CLICK FASTLINK CHECKOUT
      =================================================== */}

      {checkoutIncident && (
        <RecoveryCheckout
          incident={checkoutIncident}
          onClose={() =>
            setCheckoutIncident(null)
          }
          onPaymentRecovered={
            handleFastLinkRecovery
          }
        />
      )}

      {/* ===================================================
          VOICE SIMULATOR MODAL
      =================================================== */}

      {voiceModalIncident && (
        <VoiceSimulatorModal
          incident={
            voiceModalIncident
          }
          onClose={() =>
            setVoiceModalIncident(null)
          }
          onPaymentRecovered={(inc) => {
            handleExecuteRetry(inc);
            setVoiceModalIncident(
              null
            );
          }}
          onPtpAgreed={(
            inc,
            date,
            notes
          ) => {
            handleRecordPtp(
              inc,
              date,
              inc.amount,
              notes
            );

            setVoiceModalIncident(
              null
            );
          }}
          onCompliantStop={(
            inc,
            reason
          ) => {
            handleTriggerStoppingRule(
              inc,
              reason
            );

            setVoiceModalIncident(
              null
            );
          }}
        />
      )}

      {/* ===================================================
          NEW INCIDENT MODAL
      =================================================== */}

      {showNewIncidentModal && (
        <NewIncidentModal
          onClose={() =>
            setShowNewIncidentModal(false)
          }
          onAddIncident={
            handleAddIncident
          }
        />
      )}

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">

        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">

          <span>
            AI Revenue Recovery Agent • Bounded Interventions & Audit Trail
          </span>

          <span className="font-mono text-[11px] text-slate-400">
            Demo environment • recovery execution is simulated; compliance controls are illustrative, not legal certification
          </span>

        </div>

      </footer>

    </div>
  );
}