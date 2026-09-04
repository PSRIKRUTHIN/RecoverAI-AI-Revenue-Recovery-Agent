import React, { useState } from 'react';
import { X, Plus, Sparkles, AlertTriangle } from 'lucide-react';
import { RecoveryIncident, ChannelType } from '../types';
import { createAuditEntry } from '../utils/audit';

interface NewIncidentModalProps {
  onClose: () => void;
  onAddIncident: (incident: RecoveryIncident) => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  onClose,
  onAddIncident,
}) => {
  const [customerName, setCustomerName] = useState('Ananya Sen');
  const [customerEmail, setCustomerEmail] = useState('ananya.sen@technova.in');
  const [companyName, setCompanyName] = useState('TechNova Solutions');
  const [channel, setChannel] = useState<ChannelType>('upi_mandate');
  const [amount, setAmount] = useState('4999');
  const [currency, setCurrency] = useState('₹');
  const [errorCode, setErrorCode] = useState('insufficient_funds');
  const [errorMessage, setErrorMessage] = useState('Bank debit failed: account balance below transaction threshold at month-end');
  const [customerLtv, setCustomerLtv] = useState('₹ 65,000');
  const [locale, setLocale] = useState('en-IN');

  const applyPreset = (type: 'upi' | 'card' | 'cart' | 'b2b') => {
    if (type === 'upi') {
      setCustomerName('Ananya Sen');
      setCustomerEmail('ananya.sen@technova.in');
      setCompanyName('TechNova Solutions');
      setChannel('upi_mandate');
      setAmount('4999');
      setCurrency('₹');
      setErrorCode('insufficient_funds');
      setErrorMessage('NPCI auto-debit rejected: account balance insufficient prior to payday cycle');
      setCustomerLtv('₹ 65,000');
      setLocale('en-IN');
    } else if (type === 'card') {
      setCustomerName('Jordan Blake');
      setCustomerEmail('j.blake@apexcloud.io');
      setCompanyName('Apex Cloud Services');
      setChannel('card_payment_degradation');
      setAmount('1890');
      setCurrency('$');
      setErrorCode('do_not_honor');
      setErrorMessage('Card processor soft decline 05: issuer risk threshold exceeded');
      setCustomerLtv('$24,000');
      setLocale('en-US');
    } else if (type === 'cart') {
      setCustomerName('Sophie Martin');
      setCustomerEmail('sophie.m@atelierparis.fr');
      setCompanyName('');
      setChannel('checkout_abandon');
      setAmount('420');
      setCurrency('€');
      setErrorCode('3ds_challenge_abandoned');
      setErrorMessage('Mobile cart shopper abandoned after 150 seconds on bank SMS OTP screen');
      setCustomerLtv('€ 2,400');
      setLocale('fr-FR');
    } else if (type === 'b2b') {
      setCustomerName('Pinnacle Health Corp');
      setCustomerEmail('ap@pinnaclehealth.com');
      setCompanyName('Pinnacle Health Systems');
      setChannel('b2b_invoice');
      setAmount('28500');
      setCurrency('$');
      setErrorCode('missing_po_three_way_match');
      setErrorMessage('Accounts payable invoice stalled 35 days past due: awaiting line-item receiving ticket');
      setCustomerLtv('$180,000');
      setLocale('en-US');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `REC-${Math.floor(1061 + Math.random() * 900)}`;
    const newIncident: RecoveryIncident = {
      id: newId,
      customerName,
      customerEmail,
      companyName: companyName || undefined,
      channel,
      amount: Number(amount),
      currency,
      status: 'at_risk',
      errorCode,
      errorMessage,
      attempts: 1,
      maxAttemptsAllowed: 3,
      daysOverdue: channel === 'b2b_invoice' ? 18 : 1,
      customerLtv,
      locale,
      createdAt: new Date().toISOString(),
      auditTrail: [
        createAuditEntry(
          'INCIDENT_INGESTED',
          'SYSTEM_GATEWAY',
          `New revenue risk ingested from payment gateway webhook. Code: ${errorCode}`
        ),
      ],
    };

    onAddIncident(newIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              Ingest Revenue At Risk Incident
            </h3>
            <p className="text-xs text-slate-500">
              Simulate an incoming webhook from Stripe, Adyen, Razorpay, or ERP
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('upi')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 whitespace-nowrap transition-colors shadow-xs font-medium"
          >
            UPI AutoPay Mandate
          </button>
          <button
            type="button"
            onClick={() => applyPreset('card')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 whitespace-nowrap transition-colors shadow-xs font-medium"
          >
            Card Degradation
          </button>
          <button
            type="button"
            onClick={() => applyPreset('cart')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 whitespace-nowrap transition-colors shadow-xs font-medium"
          >
            Checkout Abandon
          </button>
          <button
            type="button"
            onClick={() => applyPreset('b2b')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 whitespace-nowrap transition-colors shadow-xs font-medium"
          >
            B2B Invoice
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Customer / Contact Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Company (Optional)</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Recovery Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as ChannelType)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                <option value="upi_mandate">UPI Mandate AutoPay</option>
                <option value="card_payment_degradation">Card Payment Degradation</option>
                <option value="checkout_abandon">Checkout Drop-Off</option>
                <option value="failed_subscription">Failed Subscription Billing</option>
                <option value="b2b_invoice">B2B Overdue Receivables</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-slate-700 font-medium mb-1">Amount at Risk</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                <option value="$">USD ($)</option>
                <option value="₹">INR (₹)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="A$">AUD (A$)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Decline / Failure Code</label>
              <input
                type="text"
                value={errorCode}
                onChange={(e) => setErrorCode(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-mono shadow-xs"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Customer LTV</label>
              <input
                type="text"
                value={customerLtv}
                onChange={(e) => setCustomerLtv(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Raw Error / Gateway Message</label>
            <textarea
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              rows={2}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Ingest & Trigger Agent</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
