import React, { useState, useEffect } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import Navbar from '../components/Navbar';
import { fmtCurrency, fmtShort } from '../utils/utils';
import { KpiCard, ChartTooltip } from '../components/OrdersComps';
import { useFilters } from '../contexts/FilterContext';
import { getSummary, getOrders, getCities } from '../utils/api';

export default function OrdersView() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("orders", orders);

  const {startDate, endDate, setStartDate, setEndDate} = useFilters();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
       const [s, o, c] = await Promise.all([
         getSummary(startDate, endDate),
         getOrders(startDate, endDate),
         getCities(startDate, endDate),
       ]);

      const startMonth = startDate.slice(0, 7);
      const endMonth = endDate.slice(0, 7);

      setSummary(s);
      setOrders(o);
      setCities(c);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  const totalCityRev = cities.slice(0, 10).reduce((sum, c) => sum + c.revenue, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="page">

        {/* Filter bar */}
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
                  value={summary ? fmtCurrency(summary?.total_revenue) : '—'}
                  sub={summary
                    ? `${summary?.date_range.start} → ${summary?.date_range.end}`
                    : null}
                  accentVar="--accent"
                />
                <KpiCard
                  label="Total Orders"
                  value={summary ? summary?.total_orders.toLocaleString() : '—'}
                  sub="fiscal year"
                  accentVar="--blue"
                />
                <KpiCard
                  label="Active Customers"
                  value={summary ? summary.unique_customers.toLocaleString() : '—'}
                  sub="unique accounts"
                  accentVar="--accent"
                />
              </div>

              {/* Dual-axis monthly chart */}
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

                {orders?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={orders} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis
                        xAxisId="name"
                        dataKey="month_name"
                        tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                        axisLine={{ stroke: 'var(--border)' }}
                        tickLine={false}
                      />

// Add a second XAxis below it for month/year
                      <XAxis
                        xAxisId="month"
                        dataKey="month"
                        tick={{ fontSize: 10, fill: 'var(--text-muted)', opacity: 0.6 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val) => {
                        const [y, m] = val.split('-');
                        return `${m}/${y.slice(2)}`;
                        }}
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
                        xAxisId="name"
                        yAxisId="rev"
                        dataKey="revenue"
                        fill="var(--accent)"
                        radius={[3, 3, 0, 0]}
                        opacity={0.85}
                      />
                      <Line
                        xAxisId="name"
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

            {/* City revenue ranked table */}
            <div className="card">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 16,
              }}>
                <span className="section-title">Revenue by City</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Top {Math.min(cities.length, 10)}
                </span>
              </div>

              {cities.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {[
                        { label: '#',       align: 'center' },
                        { label: 'City',    align: 'left'   },
                        { label: 'State',   align: 'left'   },
                        { label: 'Share',   align: 'left'   },
                        { label: 'Orders',  align: 'right'  },
                        { label: 'Revenue', align: 'right'  },
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
                    {cities.slice(0, 10).map((c, i) => {
                      const sharePct = totalCityRev > 0
                        ? Math.round((c.revenue / totalCityRev) * 100)
                        : 0;
                      const isTop = i === 0;
                      return (
                        <tr
                          key={`${c.city}-${c.state}`}
                          style={{ borderBottom: '1px solid var(--border)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
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

                          {/* City */}
                          <td style={{
                            padding: '10px 10px',
                            color: 'var(--text-primary)',
                            fontWeight: isTop ? 600 : 400,
                          }}>
                            {c.city}
                          </td>

                          {/* State */}
                          <td style={{
                            padding: '10px 10px',
                            color: 'var(--text-secondary)',
                            fontSize: 12,
                          }}>
                            {c.state}
                          </td>

                          {/* Share bar */}
                          <td style={{ padding: '10px 10px', width: '34%' }}>
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

                          {/* Order count */}
                          <td style={{
                            padding: '10px 10px',
                            textAlign: 'right',
                            color: 'var(--text-secondary)',
                            fontSize: 12,
                          }}>
                            {c.order_count != null ? Number(c.order_count).toLocaleString() : '—'}
                          </td>

                          {/* Revenue */}
                          <td style={{
                            padding: '10px 10px',
                            textAlign: 'right',
                            fontWeight: 600,
                            color: isTop ? 'var(--text-primary)' : 'var(--text-secondary)',
                            whiteSpace: 'nowrap',
                          }}>
                            {c.revenue != null ? fmtCurrency(c.revenue) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="loading" style={{ height: 160 }}>No city data for selected range</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}