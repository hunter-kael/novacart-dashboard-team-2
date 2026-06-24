import {fmtCurrency} from '../utils/utils';

export function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '10px 14px',
      boxShadow: 'var(--shadow)',
      fontSize: 12,
      minWidth: 160,
    }}>
      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
        {d?.name}
      </div>
      <div style={{ color: 'var(--text-secondary)', marginBottom: 2 }}>
        Revenue: <strong style={{ color: 'var(--text-primary)' }}>{fmtCurrency(d?.revenue)}</strong>
      </div>
      <div style={{ color: 'var(--text-secondary)', marginBottom: 2 }}>
        Units: <strong style={{ color: 'var(--text-primary)' }}>{Number(d?.units_sold).toLocaleString()}</strong>
      </div>
      <div style={{ color: 'var(--text-secondary)' }}>
        Rev / unit: <strong style={{ color: 'var(--text-primary)' }}>
          {fmtCurrency(Math.round(d?.revenue / d?.units_sold))}
        </strong>
      </div>
    </div>
  );
}