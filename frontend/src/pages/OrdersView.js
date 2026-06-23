import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Navbar from '../components/Navbar';
import { getSummary, getOrders, getCountries } from '../utils/api';

export default function OrdersView() {
  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate,   setEndDate]   = useState('2022-12-31');
  const [summary,   setSummary]   = useState(null);
  const [orders,    setOrders]    = useState([]);
  const [countries, setCountries]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [s, o, c] = await Promise.all([
        getSummary(),
        getOrders(startDate, endDate),
        getCountries(startDate, endDate),
      ]);
      setSummary(s);
      setOrders(o);
      setCountries(c);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div className="page">

        <div className="filter-bar">
          <label>From</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <label>To</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <button className="btn-apply" onClick={loadData}>Apply</button>
        </div>

        {error && (
          <div style={{ color: '#C62828', padding: 16, background: '#FFEBEE', borderRadius: 8, marginBottom: 16 }}>
            Error: {error}
          </div>
        )}

        {loading && <div className="loading">Loading orders data…</div>}

        {!loading && !error && (
          <>
            <div className="stat-row">
              <div className="stat-box">
                <div className="label">Total Revenue</div>
                <div className="value">TODO</div>
              </div>
              <div className="stat-box">
                <div className="label">Total Orders</div>
                <div className="value">TODO</div>
              </div>
              <div className="stat-box">
                <div className="label">Unique Customers</div>
                <div className="value">TODO</div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div className="section-title" style={{ marginBottom: 16 }}>Monthly Revenue</div>
              {/* TODO: add your chart here */}
              <div className="loading" style={{ height: 200 }}>
                Implement the monthly revenue chart using recharts BarChart
              </div>
            </div>

            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>Revenue by City</div>
              {/* TODO: add your chart here */}
              <div className="loading" style={{ height: 200 }}>
                Implement the countries chart using recharts BarChart with layout="vertical"
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
