import React from 'react';
import { 
  PhoneCall, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Globe2, 
  Play
} from 'lucide-react';
import { RecoveryIncident } from '../types';
import { formatCurrency } from '../utils/audit';

interface VoiceStudioViewProps {
  incidents: RecoveryIncident[];
  onOpenVoiceModal: (incident: RecoveryIncident) => void;
}

export const VoiceStudioView: React.FC<VoiceStudioViewProps> = ({
  incidents,
  onOpenVoiceModal,
}) => {
  const eligibleIncidents = incidents.filter(
    (i) => i.channel === 'upi_mandate' || i.diagnosis?.channelRecommended === 'hinglish_voice' || i.customerPhone
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                <PhoneCall className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Hinglish & Localized AI Voice Recovery Studio
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Traditional robo-callers alienate customers. Our agent employs natural conversational Hinglish (Hindi-English colloquial blend) and empathetic tone modulation to resolve failed mandates and arrange payday commitments.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Conversational Lift</span>
              <span className="text-emerald-700 font-bold text-sm">+41.2% Over SMS</span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">TRAI Compliance</span>
              <span className="text-indigo-700 font-bold text-sm">Quiet Hours Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acoustic & Cultural Archetypes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-indigo-700 font-semibold text-xs uppercase tracking-wider">
            <Globe2 className="w-4 h-4" />
            <span>Colloquial Hinglish Blend</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Blends respectful Hindi honorifics ("Aarav ji", "Shukriya") with frictionless technical terms ("UPI auto-debit", "1-click PhonePe link"). Zero robotic intimidation.
          </p>
          <div className="mt-3 text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
            "Namaste ji, aapka Rs. 3,499 ka renewal process nahi ho paya tha. WhatsApp pe link bhej rahe hain..."
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-sky-700 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Dynamic Intent Negotiation</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dynamically detects if customer has temporary liquidity shortages and seamlessly pivots the conversation into a compliant Promise-to-Pay (PTP) agreement.
          </p>
          <div className="mt-3 text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
            "Koi baat nahi, Friday tak humne saari dunning pings freeze kar di hain..."
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-emerald-700 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Automated Stopping on Opt-out</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            If the subscriber expresses intent to cancel or reports economic hardship, the voice agent acknowledges respectfully and permanently halts automated collections.
          </p>
          <div className="mt-3 text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
            "Samajh gaya ji, stopping rules ke mutabik humne retries halt kar di hain..."
          </div>
        </div>
      </div>

      {/* Voice Targets Queue */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Voice Concierge Queue</h3>
            <p className="text-xs text-slate-500">
              Interactive test console: launch synthetic phone calls to test agent dialog and recovery outcomes
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 font-medium">
            Web Speech Voice Engine & Groq AI Recovery Engine Ready
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {eligibleIncidents.map((inc) => {
            const isHinglish = inc.channel === 'upi_mandate' || inc.locale === 'en-IN';
            return (
              <div
                key={inc.id}
                className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{inc.customerName}</span>
                    <span className="text-[11px] font-mono text-slate-500 font-medium">
                      {inc.customerPhone || '+91 98201 44521'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                      {isHinglish ? 'Hinglish Concierge' : 'English Concierge'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 max-w-xl italic">
                    "{inc.diagnosis?.voiceScript || 'Namaste, your payment concierge regarding subscription renewal...'}"
                  </p>

                  <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                    <span>At Risk: <strong className="text-slate-900 font-semibold">{formatCurrency(inc.amount, inc.currency)}</strong></span>
                    <span>•</span>
                    <span>Channel: {inc.channel.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    id={`btn-launch-call-${inc.id}`}
                    onClick={() => onOpenVoiceModal(inc)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 transition-all shadow-xs active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Launch Voice Call</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
