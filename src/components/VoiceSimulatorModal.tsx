import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX, 
  Send, 
  HandCoins, 
  ShieldAlert, 
  CheckCircle2, 
  Bot, 
  User,
  Sparkles
} from 'lucide-react';
import { RecoveryIncident } from '../types';
import { formatCurrency } from '../utils/audit';

interface VoiceSimulatorModalProps {
  incident: RecoveryIncident;
  onClose: () => void;
  onPaymentRecovered: (incident: RecoveryIncident) => void;
  onPtpAgreed: (incident: RecoveryIncident, date: string, notes: string) => void;
  onCompliantStop: (incident: RecoveryIncident, reason: string) => void;
}

interface Message {
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: string;
}

export const VoiceSimulatorModal: React.FC<VoiceSimulatorModalProps> = ({
  incident,
  onClose,
  onPaymentRecovered,
  onPtpAgreed,
  onCompliantStop,
}) => {
  const isHinglish = incident.channel === 'upi_mandate' || incident.locale === 'en-IN';
  const [callActive, setCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentScenario, setCurrentScenario] = useState<'intro' | 'negotiating' | 'resolved' | 'ptp' | 'cancelled'>('intro');

  // Initial greeting
  useEffect(() => {
    const greeting = incident.diagnosis?.voiceScript || (
      isHinglish 
        ? `Namaste ${incident.customerName} ji, main aapke billing concierge desk se bol raha hoon. Aapka ${incident.currency} ${incident.amount} ka auto-debit complete nahi ho paya tha. Kya hum 1-click WhatsApp link share karein?`
        : `Hello ${incident.customerName}, this is your automated account concierge regarding invoice #${incident.id} for ${formatCurrency(incident.amount, incident.currency)}. We have prepared a zero-friction recovery link for you.`
    );

    setMessages([
      {
        speaker: 'agent',
        text: greeting,
        timestamp: '00:02',
      },
    ]);

    // Speech synthesis if available
    speakText(greeting);
  }, [incident, isHinglish]);

  // Call timer
  useEffect(() => {
    if (!callActive) return;
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [callActive]);

  const speakText = (text: string) => {
    if (audioMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    // Prefer Indian English voice if hinglish
    const voices = window.speechSynthesis.getVoices();
    if (isHinglish) {
      const inVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India'));
      if (inVoice) utterance.voice = inVoice;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleMuteToggle = () => {
    if (!audioMuted) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
    setAudioMuted(!audioMuted);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Customer responses
  const handleCustomerOption = (type: 'pay_now' | 'ptp_request' | 'cancel_request') => {
    const curTime = formatTimer(callDuration + 2);

    if (type === 'pay_now') {
      const customerText = isHinglish
        ? "Haan, please WhatsApp pe PhonePe/GPay link bhej dijiye, main turant approve kar deta hoon."
        : "Yes, please send me the 1-click payment link. I will settle it right away.";
      
      const agentReply = isHinglish
        ? `Shukriya ${incident.customerName} ji! Link generate ho gaya hai. Aapka transaction verify ho gaya aur account instantly active hai.`
        : `Thank you ${incident.customerName}! Link dispatched. Transaction verified and fully settled.`;

      setMessages((prev) => [
        ...prev,
        { speaker: 'customer', text: customerText, timestamp: curTime },
        { speaker: 'agent', text: agentReply, timestamp: formatTimer(callDuration + 4) },
      ]);

      setCurrentScenario('resolved');
      speakText(agentReply);
      setTimeout(() => {
        onPaymentRecovered(incident);
        setCallActive(false);
      }, 3500);
    } 
    else if (type === 'ptp_request') {
      const customerText = isHinglish
        ? "Mera salary Friday (5th) ko credit hoga. Kya main tab settle kar sakta hoon?"
        : "Our AP payment run is scheduled for this Friday. Can we settle then?";

      const agentReply = isHinglish
        ? `Bilkul! Humne aapka Promise-to-Pay log kar diya hai. Saari automated dunning pings 5th tak freeze hain aur koi late fine nahi lagega.`
        : `Understood. We have logged a binding Promise-to-Pay for Friday. All reminder pings are suspended and your services remain uninterrupted.`;

      setMessages((prev) => [
        ...prev,
        { speaker: 'customer', text: customerText, timestamp: curTime },
        { speaker: 'agent', text: agentReply, timestamp: formatTimer(callDuration + 4) },
      ]);

      setCurrentScenario('ptp');
      speakText(agentReply);
      setTimeout(() => {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 3);
        onPtpAgreed(incident, nextDate.toISOString().split('T')[0], 'Agreed via Hinglish/English Voice Concierge call');
        setCallActive(false);
      }, 3500);
    } 
    else if (type === 'cancel_request') {
      const customerText = isHinglish
        ? "Mujhe ye subscription cancel karna hai, please retries mat kijiye."
        : "I want to cancel this service. Please stop charging my card.";

      const agentReply = isHinglish
        ? `Ji samajh gaya. Compliant stopping rules ke tehat humne sabhi mandate presentations turant halt kar di hain. Aapko koi harassment notification nahi aayega.`
        : `Understood. In accordance with compliance stopping rules, all retry presentations have been permanently halted. Your account is flagged for respectful cancellation.`;

      setMessages((prev) => [
        ...prev,
        { speaker: 'customer', text: customerText, timestamp: curTime },
        { speaker: 'agent', text: agentReply, timestamp: formatTimer(callDuration + 4) },
      ]);

      setCurrentScenario('cancelled');
      speakText(agentReply);
      setTimeout(() => {
        onCompliantStop(incident, 'Customer explicitly requested cancellation during voice concierge interaction.');
        setCallActive(false);
      }, 3500);
    }
  };

  const endCall = () => {
    window.speechSynthesis?.cancel();
    setCallActive(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Call Header */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${callActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
              <Phone className={`w-5 h-5 ${callActive ? 'animate-bounce' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  {isHinglish ? 'Hinglish Voice Recovery Concierge' : 'Autonomous Voice Agent'}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  TRAI / TCPA Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Connected to {incident.customerName} ({incident.customerPhone || '+91 98201 44521'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMuteToggle}
              title={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-colors"
            >
              {audioMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>
            <button onClick={endCall} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Status Bar with Equalizer */}
        <div className="px-4 py-2 bg-slate-100/70 flex items-center justify-between border-b border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${callActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-slate-700 font-mono font-medium">{callActive ? 'CALL IN PROGRESS' : 'CALL ENDED'}</span>
            <span className="text-slate-500 font-mono">• {formatTimer(callDuration)}</span>
          </div>

          {/* Equalizer animation */}
          {callActive && (
            <div className="flex items-center gap-0.5 h-3">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="w-1 bg-emerald-500 rounded-full animate-pulse"
                  style={{
                    height: isSpeaking ? `${Math.sin(i * 1.2 + callDuration * 3) * 8 + 10}px` : '4px',
                    transition: 'height 0.15s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Conversation Transcript */}
        <div className="p-4 space-y-3 h-64 overflow-y-auto bg-slate-50/50 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${msg.speaker === 'agent' ? 'justify-start' : 'justify-end'}`}
            >
              {msg.speaker === 'agent' && (
                <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3 rounded-xl leading-relaxed ${
                  msg.speaker === 'agent'
                    ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-xs'
                    : 'bg-indigo-600 text-white font-medium rounded-tr-none shadow-xs'
                }`}
              >
                <div className={`flex items-center justify-between gap-3 text-[10px] mb-1 ${msg.speaker === 'agent' ? 'text-slate-400' : 'text-indigo-200'}`}>
                  <span>{msg.speaker === 'agent' ? 'AI Concierge' : incident.customerName}</span>
                  <span className="font-mono">{msg.timestamp}</span>
                </div>
                <p>{msg.text}</p>
              </div>

              {msg.speaker === 'customer' && (
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Interactive Response Triggers (Customer Choices) */}
        {callActive && currentScenario === 'intro' && (
          <div className="p-4 bg-white border-t border-slate-200">
            <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider block mb-2">
              Select Customer Response to Test Agent:
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                id="btn-voice-option-pay-now"
                onClick={() => handleCustomerOption('pay_now')}
                className="p-2.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100/70 text-emerald-800 border border-emerald-200 flex items-center justify-between text-left transition-all shadow-xs"
              >
                <span>
                  🟢 <strong>Agree to 1-Click Pay:</strong> "WhatsApp pe link bhej dijiye, main turant approve kar deta hoon"
                </span>
                <Send className="w-4 h-4 shrink-0 text-emerald-600 ml-2" />
              </button>

              <button
                id="btn-voice-option-ptp"
                onClick={() => handleCustomerOption('ptp_request')}
                className="p-2.5 rounded-lg text-xs font-semibold bg-sky-50 hover:bg-sky-100/70 text-sky-800 border border-sky-200 flex items-center justify-between text-left transition-all shadow-xs"
              >
                <span>
                  🔵 <strong>Request Payday PTP:</strong> "Mera salary Friday (5th) ko credit hoga. Kya tab kar sakta hoon?"
                </span>
                <HandCoins className="w-4 h-4 shrink-0 text-sky-600 ml-2" />
              </button>

              <button
                id="btn-voice-option-cancel"
                onClick={() => handleCustomerOption('cancel_request')}
                className="p-2.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100/70 text-rose-800 border border-rose-200 flex items-center justify-between text-left transition-all shadow-xs"
              >
                <span>
                  🔴 <strong>Request Cancellation:</strong> "Mujhe ye cancel karna hai, please retries mat kijiye"
                </span>
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Settlement Notice on Outcome */}
        {currentScenario === 'resolved' && (
          <div className="p-4 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
            <span className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Payment settled! {formatCurrency(incident.amount, incident.currency)} recovered to ledger.
            </span>
            <button onClick={endCall} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs">
              Done
            </button>
          </div>
        )}

        {currentScenario === 'ptp' && (
          <div className="p-4 bg-sky-50 border-t border-sky-200 flex items-center justify-between text-xs text-sky-800">
            <span className="flex items-center gap-2 font-semibold">
              <HandCoins className="w-4 h-4 text-sky-600" />
              Promise-to-Pay locked. Automated grace period active until Friday.
            </span>
            <button onClick={endCall} className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold shadow-xs">
              Done
            </button>
          </div>
        )}

        {currentScenario === 'cancelled' && (
          <div className="p-4 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-800">
            <span className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Compliant stopping rule enforced. All presentations cancelled.
            </span>
            <button onClick={endCall} className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-xs">
              Close
            </button>
          </div>
        )}

        {/* Footer End Call */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Audio synthesized using Web Speech Engine • Dialog powered by Groq GPT-OSS-20B
          </span>
          <button
            onClick={endCall}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
