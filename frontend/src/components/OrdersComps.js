import {fmtCurrency} from '../utils/utils';

export function KpiCard({ label, value, sub, accentVar }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderLeft: `4px solid var(${accentVar})`,
      borderRadius: 'var(--radius)',
      padding: '18px 20px',
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 26,
        fontWeight: 700,
        color: 'var(--text-primary)',
        lineHeight: 1,
        marginBottom: sub ? 6 : 0,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>
      )}
    </div>
  );
}

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '10px 14px',
      boxShadow: 'var(--shadow)',
      fontSize: 12,
      color: 'var(--text-primary)',
    }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text-secondary)',
          marginBottom: 2,
        }}>
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: p.dataKey === 'order_count' ? '50%' : 2,
            background: p.color,
            flexShrink: 0,
          }} />
          {p.dataKey === 'revenue'
            ? fmtCurrency(p.value)
            : `${p.value.toLocaleString()} orders`}
        </div>
      ))}
    </div>
  );
}