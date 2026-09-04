import React from 'react';
import {
  ShieldCheck,
  Play,
  Plus,
  RotateCcw,
  Calendar,
  PhoneCall,
  HandCoins,
  SlidersHorizontal,
  Sparkles,
  Bot,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'queue' | 'sequencer' | 'voice' | 'ptp' | 'compliance';
  setActiveTab: (
    tab: 'queue' | 'sequencer' | 'voice' | 'ptp' | 'compliance'
  ) => void;
  onRunBatch: () => void;
  isBatchRunning: boolean;
  onOpenNewIncident: () => void;
  onResetData: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRunBatch,
  isBatchRunning,
  onOpenNewIncident,
  onResetData,
  pendingCount,
}) => {

  const batchComplete =
    !isBatchRunning && pendingCount === 0;

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-30 shadow-xs">

      {/* =====================================================
          TOP BANNER
         ===================================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Brand */}

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20 text-white font-bold">
            <Bot className="w-5 h-5 text-white" />
          </div>

          <div>

            <div className="flex items-center gap-2">

              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                RecoverAI — AI Revenue Recovery Agent
              </h1>

              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />

                AI Recovery Agent

              </span>

            </div>

            <p className="text-xs text-slate-500">
              Detects revenue at risk, diagnoses root causes, & executes bounded compliant interventions
            </p>

          </div>

        </div>


        {/* =====================================================
            ACTION BUTTONS
           ===================================================== */}

        <div className="flex items-center gap-2.5 flex-wrap justify-end">

          {/* BATCH RECOVERY BUTTON */}

          <button
            id="btn-run-batch-recovery"
            onClick={onRunBatch}
            disabled={isBatchRunning || batchComplete}
            title={
              batchComplete
                ? 'All identified revenue risks have been processed'
                : undefined
            }
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-xs ${
              isBatchRunning
                ? 'bg-indigo-400 text-white cursor-not-allowed'
                : batchComplete
                ? 'bg-emerald-50 text-emerald-700 cursor-not-allowed border border-emerald-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 active:scale-95'
            }`}
          >

            {isBatchRunning ? (

              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />

                <span>
                  Processing Batch Recovery...
                </span>
              </>

            ) : batchComplete ? (

              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />

                <span>
                  Batch Recovery Complete
                </span>
              </>

            ) : (

              <>
                <Play className="w-4 h-4 fill-current" />

                <span>
                  Run Batch Recovery ({pendingCount} At Risk)
                </span>
              </>

            )}

          </button>


          {/* INGEST INCIDENT */}

          <button
            id="btn-ingest-incident"
            onClick={onOpenNewIncident}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 transition-colors shadow-xs"
          >

            <Plus className="w-4 h-4 text-indigo-600" />

            <span>
              + Ingest Incident
            </span>

          </button>


          {/* RESET */}

          <button
            id="btn-reset-data"
            onClick={onResetData}
            title="Reset to benchmark dataset"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-xs"
          >

            <RotateCcw className="w-4 h-4" />

          </button>

        </div>

      </div>


      {/* =====================================================
          NAVIGATION SUB-TABS
         ===================================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 py-2 scrollbar-none">

          {/* QUEUE */}

          <button
            id="nav-tab-queue"
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'queue'
                ? 'bg-slate-100 text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >

            <SlidersHorizontal className="w-3.5 h-3.5" />

            <span>
              Recovery Queue & Batch
            </span>

            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/80 text-slate-700 font-semibold">
              Live
            </span>

          </button>


          {/* MANDATE SEQUENCER */}

          <button
            id="nav-tab-sequencer"
            onClick={() => setActiveTab('sequencer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'sequencer'
                ? 'bg-slate-100 text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >

            <Calendar className="w-3.5 h-3.5" />

            <span>
              Mandate Retry Sequencer
            </span>

          </button>


          {/* VOICE */}

          <button
            id="nav-tab-voice"
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'voice'
                ? 'bg-slate-100 text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >

            <PhoneCall className="w-3.5 h-3.5" />

            <span>
              Hinglish Voice Recovery Studio
            </span>

          </button>


          {/* PTP */}

          <button
            id="nav-tab-ptp"
            onClick={() => setActiveTab('ptp')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'ptp'
                ? 'bg-slate-100 text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >

            <HandCoins className="w-3.5 h-3.5" />

            <span>
              Promise-to-Pay (PTP) Tracker
            </span>

          </button>


          {/* COMPLIANCE */}

          <button
            id="nav-tab-compliance"
            onClick={() => setActiveTab('compliance')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'compliance'
                ? 'bg-slate-100 text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >

            <ShieldCheck className="w-3.5 h-3.5" />

            <span>
              Stopping Rules & Audit Trail
            </span>

          </button>

        </div>

      </div>

    </header>
  );
};