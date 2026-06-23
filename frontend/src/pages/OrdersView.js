import React, { useState, useEffect } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import Navbar from '../components/Navbar';

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockSummary = {
  franchise_id: 'fr-123',
  total_revenue: 125430.75,
  total_orders: 4821,
  active_customers: 3120,
  date_range: { start: '2023-01-01', end: '2023-12-31' },
};

const mockOrders = [
  { month: '2023-01', month_name: 'Jan', order_count: 320, revenue: 8420 },
  { month: '2023-02', month_name: 'Feb', order_count: 280, revenue: 7920 },
  { month: '2023-03', month_name: 'Mar', order_count: 410, revenue: 12550 },
  { month: '2023-04', month_name: 'Apr', order_count: 450, revenue: 14500 },
  { month: '2023-05', month_name: 'May', order_count: 380, revenue: 11120 },
  { month: '2023-06', month_name: 'Jun', order_count: 420, revenue: 13230 },
  { month: '2023-07', month_name: 'Jul', order_count: 390, revenue: 11800 },
  { month: '2023-08', month_name: 'Aug', order_count: 430, revenue: 13900 },
  { month: '2023-09', month_name: 'Sep', order_count: 360, revenue: 10200 },
  { month: '2023-10', month_name: 'Oct', order_count: 420, revenue: 12800 },
  { month: '2023-11', month_name: 'Nov', order_count: 460, revenue: 15140 },
  { month: '2023-12', month_name: 'Dec', order_count: 510, revenue: 16850 },
];

const mockCountries = [
  { country: 'United States', revenue: 120500 },
  { country: 'Canada', revenue: 24500 },
  { country: 'Mexico', revenue: 15800 },
  { country: 'United Kingdom', revenue: 14200 },
  { country: 'Germany', revenue: 11000 },
  { country: 'France', revenue: 9400 },
  { country: 'Spain', revenue: 7600 },
  { country: 'Italy', revenue: 7100 },
  { country: 'Australia', revenue: 6500 },
  { country: 'India', revenue: 5900 },
  { country: 'Brazil', revenue: 5200 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (v) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(v);

const fmtShort = (v) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
  return `$${v}`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, accentVar }) {
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

function ChartTooltip({ active, payload, label }) {
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrdersView() {
  const [startDate, setStartDate] = useState(mockSummary.date_range.start);
  const [endDate, setEndDate] = useState(mockSummary.date_range.end);
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      // Swap these with real API calls when ready:
      // const [s, o, c] = await Promise.all([
      //   getSummary(franchiseId),
      //   getOrders(franchiseId, startDate, endDate),
      //   getCountries(franchiseId, startDate, endDate),
      // ]);

      const s = mockSummary;
      const startMonth = startDate.slice(0, 7);
      const endMonth = endDate.slice(0, 7);
      const o = mockOrders.filter((r) => r.month >= startMonth && r.month <= endMonth);
      const c = [...mockCountries].sort((a, b) => b.revenue - a.revenue);

      setSummary(s);
      setOrders(o);
      setCountries(c);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  const maxCountryRev = countries[0]?.revenue ?? 1;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="page">

        {/* Filter bar — reuses your existing .filter-bar and .btn-apply classes */}
        <div className="filter-bar">
          <label>From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label>To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="btn-apply" onClick={loadData}>Apply</button>
        </div>

        {/* Error */}
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

        {loading && <div className="loading">Loading…</div>}

        {!loading && !error && (
          <>
            {/*
             * Layout: KPI sidebar (240px) + Monthly chart (remaining width)
             * The other team stacks everything full-width. This sidebar approach
             * keeps KPIs always visible while charts take up the real estate.
             */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '240px 1fr',
              gap: 20,
              marginBottom: 20,
              alignItems: 'start',
            }}>

              {/* KPI cards stacked vertically */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <KpiCard
                  label="Total Revenue"
                  value={summary ? fmtCurrency(summary.total_revenue) : '—'}
                  sub={summary
                    ? `${summary.date_range.start} → ${summary.date_range.end}`
                    : null}
                  accentVar="--accent"
                />
                <KpiCard
                  label="Total Orders"
                  value={summary ? summary.total_orders.toLocaleString() : '—'}
                  sub="fiscal year"
                  accentVar="--blue"
                />
                <KpiCard
                  label="Active Customers"
                  value={summary ? summary.active_customers.toLocaleString() : '—'}
                  sub="unique accounts"
                  accentVar="--accent"
                />
              </div>

              {/*
               * Dual-axis chart: revenue as bars (left axis) + order count
               * as a line (right axis). Shows correlation between volume and
               * revenue in one view instead of two separate charts.
               */}
              <div className="card" style={{ marginBottom: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}>
                  <span className="section-title">Monthly Performance</span>
                  <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{
                        display: 'inline-block', width: 10, height: 10,
                        borderRadius: 2, background: 'var(--accent)',
                      }} />
                      Revenue
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{
                        display: 'inline-block', width: 10, height: 2,
                        background: 'var(--blue)',
                      }} />
                      Orders
                    </span>
                  </div>
                </div>

                {orders.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={orders} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis
                        dataKey="month_name"
                        tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                        axisLine={{ stroke: 'var(--border)' }}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="rev"
                        tickFormatter={fmtShort}
                        tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                        axisLine={false}
                        tickLine={false}
                        width={48}
                      />
                      <YAxis
                        yAxisId="ord"
                        orientation="right"
                        tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                        axisLine={false}
                        tickLine={false}
                        width={36}
                      />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--border)', opacity: 0.4 }} />
                      <Bar
                        yAxisId="rev"
                        dataKey="revenue"
                        fill="var(--accent)"
                        radius={[3, 3, 0, 0]}
                        opacity={0.85}
                      />
                      <Line
                        yAxisId="ord"
                        dataKey="order_count"
                        stroke="var(--blue)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: 'var(--blue)', strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="loading" style={{ height: 200 }}>
                    No data for selected range
                  </div>
                )}
              </div>
            </div>

            {/*
             * Country data as a ranked table with inline share bars.
             * Shows rank, name, share %, and revenue — more info than a
             * plain bar chart, and a completely different visual treatment.
             */}
            <div className="card">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 16,
              }}>
                <span className="section-title">Revenue by Country</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Top {Math.min(countries.length, 10)}
                </span>
              </div>

              {countries.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {[
                        { label: '#', align: 'center' },
                        { label: 'Country', align: 'left' },
                        { label: 'Share', align: 'left' },
                        { label: 'Revenue', align: 'right' },
                      ].map(({ label, align }) => (
                        <th key={label} style={{
                          padding: '6px 10px',
                          textAlign: align,
                          fontWeight: 600,
                          fontSize: 11,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                        }}>
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {countries.slice(0, 10).map((c, i) => {
                      const sharePct = Math.round((c.revenue / maxCountryRev) * 100);
                      const isTop = i === 0;
                      return (
                        <tr
                          key={c.country}
                          style={{ borderBottom: '1px solid var(--border)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          {/* Rank */}
                          <td style={{
                            padding: '10px 10px',
                            textAlign: 'center',
                            width: 36,
                            color: isTop ? 'var(--accent)' : 'var(--text-muted)',
                            fontWeight: isTop ? 700 : 400,
                            fontSize: 12,
                          }}>
                            {i + 1}
                          </td>

                          {/* Name */}
                          <td style={{
                            padding: '10px 10px',
                            color: 'var(--text-primary)',
                            fontWeight: isTop ? 600 : 400,
                          }}>
                            {c.country}
                          </td>

                          {/* Share bar */}
                          <td style={{ padding: '10px 10px', width: '40%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{
                                flex: 1,
                                height: 6,
                                background: 'var(--border)',
                                borderRadius: 3,
                                overflow: 'hidden',
                              }}>
                                <div style={{
                                  width: `${sharePct}%`,
                                  height: '100%',
                                  background: isTop ? 'var(--accent)' : 'var(--blue)',
                                  borderRadius: 3,
                                  opacity: isTop ? 1 : Math.max(0.4, 0.9 - i * 0.06),
                                }} />
                              </div>
                              <span style={{
                                fontSize: 11,
                                color: 'var(--text-muted)',
                                minWidth: 28,
                                textAlign: 'right',
                              }}>
                                {sharePct}%
                              </span>
                            </div>
                          </td>

                          {/* Revenue */}
                          <td style={{
                            padding: '10px 10px',
                            textAlign: 'right',
                            fontWeight: 600,
                            color: isTop ? 'var(--text-primary)' : 'var(--text-secondary)',
                            whiteSpace: 'nowrap',
                          }}>
                            {fmtCurrency(c.revenue)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="loading" style={{ height: 160 }}>No country data available</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}