/**
 * Formatting utilities tailored for Indian business compliance dashboard
 */

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatINRShort(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(1)}Cr`;
  }
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(1)}L`;
  }
  if (abs >= 1000) {
    return `${sign}₹${(abs / 1000).toFixed(1)}K`;
  }
  return `${sign}₹${abs}`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

export function formatDelta(value: number): { text: string; isPositive: boolean; isNeutral: boolean } {
  if (isNaN(value) || value === 0) {
    return { text: '0.0%', isPositive: false, isNeutral: true };
  }
  const isPositive = value > 0;
  return {
    text: `${isPositive ? '+' : ''}${value.toFixed(1)}%`,
    isPositive,
    isNeutral: false
  };
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    })}, ${d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })}`;
  } catch {
    return isoString;
  }
}

export function formatDateSimple(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
