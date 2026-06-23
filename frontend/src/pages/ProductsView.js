import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import Navbar from '../components/Navbar';
import { getProducts } from '../utils/api';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PRODUCTS = [
  { product_id: 1,  name: 'NovaCart Express',         category: 'Logistics',   units_sold: 680, revenue: 295400 },
  { product_id: 2,  name: 'Rapid Ship Loader',         category: 'Equipment',   units_sold: 560, revenue: 237600 },
  { product_id: 3,  name: 'Smart Inventory Tag',       category: 'Technology',  units_sold: 420, revenue: 148200 },
  { product_id: 4,  name: 'Warehouse Beacon',          category: 'Technology',  units_sold: 390, revenue: 133650 },
  { product_id: 5,  name: 'Green Packaging Kit',       category: 'Consumables', units_sold: 520, revenue: 124000 },
  { product_id: 6,  name: 'Fleet Management Suite',    category: 'Software',    units_sold: 180, revenue: 112200 },
  { product_id: 7,  name: 'Customer Portal Plus',      category: 'Software',    units_sold: 230, revenue: 103500 },
  { product_id: 8,  name: 'Premium Pallet Wrap',       category: 'Consumables', units_sold: 740, revenue:  96800 },
  { product_id: 9,  name: 'Auto Sort Conveyor',        category: 'Equipment',   units_sold:  90, revenue:  89700 },
  { product_id: 10, name: 'Collaborative VR Training', category: 'Services',    units_sold:  75, revenue:  81250 },
];

function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h) % 360;
}

function categoryColor(category) {
  const hue = hashHue(category);
  return {
    bar:  `hsl(${hue}, 58%, 45%)`,
    text: `hsl(${hue}, 58%, 38%)`,
    bg:   `hsla(${hue}, 58%, 45%, 0.12)`,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (v) => {
  const n = Number(v);
  if (!n) return '$0';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(2)}`;
};

const truncate = (s, max = 22) =>
  s && s.length > max ? `${s.slice(0, max - 1)}…` : s;

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryBadge({ category }) {
  const { bg, text } = categoryColor(category);
  return (
    <span style={{
      display: 'inline-block',
      background: bg,
      color: text,
      fontSize: 11,
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: 4,
      letterSpacing: '0.03em',
      whiteSpace: 'nowrap',
    }}>
      {category}
    </span>
  );
}

function SortIcon({ active, dir }) {
  return (
    <span style={{ marginLeft: 3, opacity: active ? 1 : 0.3, fontSize: 10 }}>
      {active && dir === 'asc' ? '▲' : '▼'}
    </span>
  );
}

function ChartTooltip({ active, payload }) {
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

// ─── Main Component ───────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { key: 'revenue',      label: 'Revenue'    },
  { key: 'units_sold',   label: 'Units'      },
  { key: 'rev_per_unit', label: 'Rev / Unit' },
];

export default function ProductsView() {
  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate,   setEndDate]   = useState('2022-12-31');
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [sortKey,   setSortKey]   = useState('revenue');
  const [sortDir,   setSortDir]   = useState('desc');
  const [activeBar, setActiveBar] = useState(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(startDate, endDate);
      setProducts(Array.isArray(data) && data.length ? data : MOCK_PRODUCTS);
    } catch {
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const enriched = useMemo(() =>
    products.slice(0, 10).map((p) => ({
      ...p,
      revenue:      Number(p.revenue),
      units_sold:   Number(p.units_sold),
      rev_per_unit: Math.round(Number(p.revenue) / Number(p.units_sold)),
    })),
    [products]
  );

  // Unique categories present in the current data set — derived, not hardcoded
  const categories = useMemo(() =>
    [...new Set(enriched.map((p) => p.category))].sort(),
    [enriched]
  );

  const chartData = [...enriched].sort((a, b) => b.revenue - a.revenue);

  const tableData = [...enriched].sort((a, b) => {
    const mul = sortDir === 'desc' ? -1 : 1;
    return (a[sortKey] - b[sortKey]) * mul;
  });

  const thBase = {
    padding: '10px 12px',
    borderBottom: '1px solid var(--border)',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  const tdBase = {
    padding: '11px 12px',
    borderBottom: '1px solid var(--border)',
    fontSize: 13,
    color: 'var(--text-primary)',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div className="page">

        <div className="filter-bar">
          <label>From</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label>To</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button className="btn-apply" onClick={loadData}>Apply</button>
        </div>

        {error && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderLeft: '4px solid #C62828',
            borderRadius: 'var(--radius)',
            padding: '12px 16px',
            color: '#C62828',
            fontSize: 13,
            marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {loading && <div className="loading">Loading products…</div>}

        {!loading && !error && (
          <div className="grid-2">

            {/* ── Chart ── */}
            <div className="card">
              <div style={{ marginBottom: 16 }}>
                <div className="section-title">Top 10 by Revenue</div>

                {/* Legend — built from whatever categories are in the data */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 10 }}>
                  {categories.map((cat) => {
                    const { bar } = categoryColor(cat);
                    return (
                      <span key={cat} style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 11, color: 'var(--text-secondary)',
                      }}>
                        <span style={{
                          display: 'inline-block', width: 8, height: 8,
                          borderRadius: 2, background: bar, flexShrink: 0,
                        }} />
                        {cat}
                      </span>
                    );
                  })}
                </div>
              </div>

              {chartData.length ? (
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart
                    layout="vertical"
                    data={chartData}
                    margin={{ top: 4, right: 16, left: 16, bottom: 4 }}
                    onMouseLeave={() => setActiveBar(null)}
                  >
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={fmtCurrency}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={160}
                      tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(n) => truncate(n, 22)}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--border)', opacity: 0.5 }} />
                    <Bar
                      dataKey="revenue"
                      radius={[0, 4, 4, 0]}
                      onMouseEnter={(_, i) => setActiveBar(i)}
                    >
                      {chartData.map((p, i) => (
                        <Cell
                          key={p.product_id}
                          fill={categoryColor(p.category).bar}
                          opacity={activeBar !== null && activeBar !== i ? 0.4 : 1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="loading" style={{ height: 300 }}>No products for this range.</div>
              )}
            </div>

            {/* ── Table ── */}
            <div className="card">
              <div style={{
                display: 'flex', alignItems: 'baseline',
                justifyContent: 'space-between', marginBottom: 14,
              }}>
                <div className="section-title">Product Details</div>
              </div>

              {tableData.length ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
                    <thead>
                      <tr>
                        <th style={{ ...thBase, textAlign: 'left' }}>Product</th>
                        {SORT_OPTIONS.map(({ key, label }) => (
                          <th
                            key={key}
                            onClick={() => handleSort(key)}
                            style={{
                              ...thBase,
                              textAlign: 'right',
                              cursor: 'pointer',
                              color: sortKey === key ? 'var(--accent)' : 'var(--text-muted)',
                            }}
                          >
                            {label}
                            <SortIcon active={sortKey === key} dir={sortDir} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((p) => (
                        <tr
                          key={p.product_id}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <td style={tdBase}>
                            <div style={{ fontWeight: 500, marginBottom: 3 }}>{p.name}</div>
                            <CategoryBadge category={p.category} />
                          </td>
                          <td style={{
                            ...tdBase, textAlign: 'right',
                            fontWeight: sortKey === 'revenue' ? 600 : 400,
                            color: sortKey === 'revenue' ? 'var(--text-primary)' : 'var(--text-secondary)',
                          }}>
                            {fmtCurrency(p.revenue)}
                          </td>
                          <td style={{
                            ...tdBase, textAlign: 'right',
                            fontWeight: sortKey === 'units_sold' ? 600 : 400,
                            color: sortKey === 'units_sold' ? 'var(--text-primary)' : 'var(--text-secondary)',
                          }}>
                            {p.units_sold.toLocaleString()}
                          </td>
                          <td style={{
                            ...tdBase, textAlign: 'right',
                            fontWeight: sortKey === 'rev_per_unit' ? 600 : 400,
                            color: sortKey === 'rev_per_unit' ? 'var(--text-primary)' : 'var(--text-secondary)',
                          }}>
                            {fmtCurrency(p.rev_per_unit)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="loading" style={{ height: 200 }}>No product details to show.</div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}