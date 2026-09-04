import { AuditLogEntry } from '../types';

export function createAuditEntry(
  action: string,
  actor: AuditLogEntry['actor'],
  details: string,
  stoppingRuleChecked?: string,
  recoveredAmount?: number
): AuditLogEntry {
  const timestamp = new Date().toISOString();
  // Simple deterministic hash simulation for audit immutability display
  const raw = `${timestamp}-${action}-${actor}-${details}`;
  let hashVal = 0;
  for (let i = 0; i < raw.length; i++) {
    hashVal = (hashVal << 5) - hashVal + raw.charCodeAt(i);
    hashVal |= 0;
  }
  const hex = Math.abs(hashVal).toString(16).padStart(8, '0');
  const shortHash = `${hex.substring(0, 4)}...${hex.substring(4, 8)}`;

  return {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    action,
    actor,
    details,
    hash: shortHash,
    stoppingRuleChecked,
    recoveredAmount,
  };
}

export function formatCurrency(amount: number, currency: string = '$'): string {
  if (currency === '₹') {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  }
  if (currency === '€') {
    return `€ ${amount.toLocaleString('de-DE')}`;
  }
  if (currency === '£') {
    return `£ ${amount.toLocaleString('en-GB')}`;
  }
  if (currency === 'A$') {
    return `A$ ${amount.toLocaleString('en-AU')}`;
  }
  return `$ ${amount.toLocaleString('en-US')}`;
}
