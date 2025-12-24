// Centralized COP formatting utilities
export function formatCOP(value, { withSuffix = true, minimumFractionDigits = 0, maximumFractionDigits = 0 } = {}) {
  const number = Number(value) || 0;
  const formatted = number.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits,
    maximumFractionDigits,
  });
  if (withSuffix) return formatted.replace('COP', '').trim() + ' COP';
  // Return without currency symbol but localized thousands, e.g., 80.000
  return formatted
    .replace(/[^0-9.,]/g, '') // strip currency
    .trim();
}

export function formatCOPPlain(value, { withSuffix = true } = {}) {
  // Shortcut to format without currency symbol ($) but with thousands and optional suffix
  const number = Number(value) || 0;
  const formatted = number.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return withSuffix ? `$${formatted} COP` : `$${formatted}`;
}

export function ensureMinCOP(value, min = 80000) {
  const n = Number(value) || 0;
  return n < min ? min : n;
}
