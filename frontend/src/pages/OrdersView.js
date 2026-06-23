import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Navbar from '../components/Navbar';

const mockSummary = {
  franchise_id: 'fr-123',
  total_revenue: 125430.75,
  total_orders: 4821,
  active_customers: 3120,
  date_range: { start: '2023-01-01', end: '2023-12-31' },
};

const mockOrders = [
  { month: '2023-01', month_name: 'Jan 2023', order_count: 320, revenue: 8420 },
  { month: '2023-02', month_name: 'Feb 2023', order_count: 280, revenue: 7920 },
  { month: '2023-03', month_name: 'Mar 2023', order_count: 410, revenue: 12550 },
  { month: '2023-04', month_name: 'Apr 2023', order_count: 450, revenue: 14500 },
  { month: '2023-05', month_name: 'May 2023', order_count: 380, revenue: 11120 },
  { month: '2023-06', month_name: 'Jun 2023', order_count: 420, revenue: 13230 },
  { month: '2023-07', month_name: 'Jul 2023', order_count: 390, revenue: 11800 },
  { month: '2023-08', month_name: 'Aug 2023', order_count: 430, revenue: 13900 },
  { month: '2023-09', month_name: 'Sep 2023', order_count: 360, revenue: 10200 },
  { month: '2023-10', month_name: 'Oct 2023', order_count: 420, revenue: 12800 },
  { month: '2023-11', month_name: 'Nov 2023', order_count: 460, revenue: 15140 },
  { month: '2023-12', month_name: 'Dec 2023', order_count: 510, revenue: 16850 },
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


export default function OrdersView() {
  // default to the mock summary date range
  const [startDate, setStartDate] = useState(mockSummary.date_range.start);
  const [endDate, setEndDate] = useState(mockSummary.date_range.end);
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadData(); }, []);

  // NOTE: real fetching is commented out while mocking data
  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      // Uncomment and replace mocks when API is ready
      // const [s, o, c] = await Promise.all([
      //   getSummary(franchiseId),
      //   getOrders(franchiseId, startDate, endDate),
      //   getCountries(franchiseId, startDate, endDate),
      // ]);

      // Use mock data and apply simple date filtering for orders
      const s = mockSummary;

      const startMonth = startDate.slice(0, 7); // YYYY-MM
      const endMonth = endDate.slice(0, 7);
      const o = mockOrders.filter(row => row.month >= startMonth && row.month <= endMonth);

      // countries: show top countries (no date-driven change in the mock)
      const c = mockCountries.slice().sort((a, b) => b.revenue - a.revenue);

      setSummary(s);
      setOrders(o);
      setCountries(c);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  const fmtCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div className="page">

        {/* Filter bar */}
        <div className="filter-bar">
          <label>From</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <label>To</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <button className="btn-apply" onClick={loadData}>Apply</button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ color: '#C62828', padding: 16, background: '#FFEBEE', borderRadius: 8, marginBottom: 16 }}>
            Error: {error}
          </div>
        )}

        {/* Loading */}
        {loading && <div className="loading">Loading orders data…</div>}

        {!loading && !error && (
          <>
            {/* Stat cards */}
            <div className="stat-row">
              <div className="stat-box">
                <div className="label">Total Revenue</div>
                <div className="value">{summary ? fmtCurrency(summary.total_revenue) : '—'}</div>
                <div className="muted" style={{ fontSize: 12 }}>
                  {summary && `${summary.date_range.start} → ${summary.date_range.end}`}
                </div>
              </div>

              <div className="stat-box">
                <div className="label">Total Orders</div>
                <div className="value">{summary ? summary.total_orders.toLocaleString() : '—'}</div>
              </div>

              <div className="stat-box">
                <div className="label">Active Customers</div>
                <div className="value">{summary ? summary.active_customers.toLocaleString() : '—'}</div>
              </div>
            </div>

            {/* Monthly Revenue chart */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="section-title" style={{ marginBottom: 16 }}>Monthly Revenue</div>
              {orders && orders.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={orders} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month_name" />
                    <YAxis />
                    <Tooltip formatter={(value) => fmtCurrency(value)} />
                    <Bar dataKey="revenue" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="loading" style={{ height: 200 }}>No monthly data for selected range.</div>
              )}
            </div>

            {/* Revenue by City chart */}
            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>Revenue by Country</div>
                {countries && countries.length > 0 ? (
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={countries.slice(0, 10)} layout="vertical" margin={{ top: 10, right: 20, left: 80, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <YAxis dataKey="country" type="category" width={150} />
                      <Tooltip formatter={(value) => fmtCurrency(value)} />
                      <Bar dataKey="revenue" fill="#2e7d32" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="loading" style={{ height: 200 }}>No country data available.</div>
                )}
            </div>

          </>
        )}
      </div>
    </div>
  );
}
