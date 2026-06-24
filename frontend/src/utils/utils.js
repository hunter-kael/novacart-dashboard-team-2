export const fmtCurrency = (v) => {
  const n = Number(v);
  if (!n) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
};

export const fmtShort = (v) => {
  const n = Number(v);
  if (!n) return '$0';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(2)}`;
};

export function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h) % 360;
}

export function categoryColor(category) {
  const hue = hashHue(category);
  return {
    bar:  `hsl(${hue}, 58%, 45%)`,
    text: `hsl(${hue}, 58%, 38%)`,
    bg:   `hsla(${hue}, 58%, 45%, 0.12)`,
  };
}

export const truncate = (s, max = 22) =>
  s && s.length > max ? `${s.slice(0, max - 1)}…` : s;
