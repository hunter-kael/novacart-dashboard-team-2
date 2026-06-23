/**
 * CustomersView.js — Customer List page
 *
 * This page shows:
 *   - A sortable table of top 20 customers by revenue
 *   - Columns: Name | City | State | Orders | Total Spent
 *   - A date range filter
 *
 * The data fetching is already wired up.
 * Your job: implement the UI and the sorting logic.
 */

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
// import { getCustomers } from '../utils/api';

const MOCK_CUSTOMERS = [
  { customer_id: 'C001', name: 'Alice Johnson', city: 'Austin', state: 'TX', total_orders: 24, total_spent: 15430.50, last_order_date: '2022-12-15' },
  { customer_id: 'C002', name: 'Marcus Lee', city: 'Chicago', state: 'IL', total_orders: 19, total_spent: 13280.00, last_order_date: '2022-11-28' },
  { customer_id: 'C003', name: 'Nina Patel', city: 'San Francisco', state: 'CA', total_orders: 27, total_spent: 12640.75, last_order_date: '2022-12-08' },
  { customer_id: 'C004', name: 'Samuel Green', city: 'Miami', state: 'FL', total_orders: 18, total_spent: 11890.30, last_order_date: '2022-10-20' },
  { customer_id: 'C005', name: 'Isabella Cruz', city: 'Dallas', state: 'TX', total_orders: 21, total_spent: 11420.60, last_order_date: '2022-12-03' },
  { customer_id: 'C006', name: 'Diego Morales', city: 'Los Angeles', state: 'CA', total_orders: 16, total_spent: 10975.25, last_order_date: '2022-11-14' },
  { customer_id: 'C007', name: 'Maya Chen', city: 'Seattle', state: 'WA', total_orders: 22, total_spent: 10350.00, last_order_date: '2022-11-30' },
  { customer_id: 'C008', name: 'Ethan Kim', city: 'Boston', state: 'MA', total_orders: 14, total_spent: 9840.35, last_order_date: '2022-10-10' },
  { customer_id: 'C009', name: 'Olivia Davis', city: 'Denver', state: 'CO', total_orders: 15, total_spent: 9320.15, last_order_date: '2022-12-01' },
  { customer_id: 'C010', name: 'Lucas Brown', city: 'Phoenix', state: 'AZ', total_orders: 13, total_spent: 8912.90, last_order_date: '2022-09-25' },
  { customer_id: 'C011', name: 'Sofia Rivera', city: 'Atlanta', state: 'GA', total_orders: 17, total_spent: 8650.40, last_order_date: '2022-11-05' },
  { customer_id: 'C012', name: 'Owen Walker', city: 'Portland', state: 'OR', total_orders: 12, total_spent: 8185.00, last_order_date: '2022-12-11' },
  { customer_id: 'C013', name: 'Chloe Nguyen', city: 'Philadelphia', state: 'PA', total_orders: 10, total_spent: 7820.80, last_order_date: '2022-10-22' },
  { customer_id: 'C014', name: 'Liam Thompson', city: 'San Diego', state: 'CA', total_orders: 11, total_spent: 7540.20, last_order_date: '2022-11-18' },
  { customer_id: 'C015', name: 'Ava Martinez', city: 'Houston', state: 'TX', total_orders: 9, total_spent: 6920.60, last_order_date: '2022-12-09' },
  { customer_id: 'C016', name: 'Noah Walker', city: 'Nashville', state: 'TN', total_orders: 8, total_spent: 6483.90, last_order_date: '2022-09-30' },
  { customer_id: 'C017', name: 'Grace Cooper', city: 'Minneapolis', state: 'MN', total_orders: 7, total_spent: 6105.40, last_order_date: '2022-11-25' },
  { customer_id: 'C018', name: 'Henry Scott', city: 'Kansas City', state: 'MO', total_orders: 6, total_spent: 5870.10, last_order_date: '2022-10-14' },
  { customer_id: 'C019', name: 'Emma Foster', city: 'Salt Lake City', state: 'UT', total_orders: 5, total_spent: 5420.00, last_order_date: '2022-12-13' },
  { customer_id: 'C020', name: 'Lily Brooks', city: 'Detroit', state: 'MI', total_orders: 4, total_spent: 4980.75, last_order_date: '2022-09-12' },
];

function formatCurrency(value) {
  if (!value) return '$0';
  return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CustomersView() {
  const [startDate,  setStartDate]  = useState('2022-01-01');
  const [endDate,    setEndDate]    = useState('2022-12-31');
  const [customers,  setCustomers]  = useState([]);
  const [sortBy,     setSortBy]     = useState('total_spent');
  const [sortDir,    setSortDir]    = useState('desc');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      //const data = await getCustomers(startDate, endDate);
      setCustomers(MOCK_CUSTOMERS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Sort handler — toggles direction if same column, resets to desc if new column
  function handleSort(column) {
    if (sortBy === column) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
  }

  // Apply sort to customers array
  const sorted = [...customers].sort((a, b) => {
    const va = a[sortBy], vb = b[sortBy];
    if (typeof va === 'number') return sortDir === 'asc' ? va - vb : vb - va;
    return sortDir === 'asc'
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va));
  });

  // Sort indicator helper
  const sortIcon = (col) => sortBy === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  const headerStyle = {
    textAlign: 'left',
    padding: '14px 12px',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const cellStyle = {
    padding: '14px 12px',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: 14,
  };

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
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>
            {customers.length} customers
          </span>
        </div>

        {error && (
          <div style={{ color: '#C62828', padding: 16, background: '#FFEBEE', borderRadius: 8, marginBottom: 16 }}>
            Error: {error}
          </div>
        )}

        {loading && <div className="loading">Loading customers…</div>}

        {!loading && !error && (
          <div className="card">
            <div className="section-title" style={{ marginBottom: 16 }}>
              Top Customers by Revenue
            </div>

            {/*
              STEP 1 — Sortable table
              sorted is: [{ customer_id, name, city, state, total_orders, total_spent }]

              Build a table with these columns:
                Name | City | State | Orders | Total Spent

              Each column header should be clickable and call handleSort(columnName).
              Use sortIcon(columnName) to show ↑ or ↓ on the active sort column.

              Hint: use a standard HTML <table> with <thead> and <tbody>.
              Style alternating rows with different background colors.
              Format total_spent with formatCurrency().
            */}

            {sorted.length ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                  <thead>
                    <tr>
                      <th style={headerStyle} onClick={() => handleSort('name')}>
                        Name{sortIcon('name')}
                      </th>
                      <th style={headerStyle} onClick={() => handleSort('city')}>
                        City{sortIcon('city')}
                      </th>
                      <th style={headerStyle} onClick={() => handleSort('state')}>
                        State{sortIcon('state')}
                      </th>
                      <th style={{ ...headerStyle, textAlign: 'right' }} onClick={() => handleSort('total_orders')}>
                        Orders{sortIcon('total_orders')}
                      </th>
                      <th style={{ ...headerStyle, textAlign: 'right' }} onClick={() => handleSort('total_spent')}>
                        Total Spent{sortIcon('total_spent')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((customer, index) => (
                      <tr
                        key={customer.customer_id}
                        style={{
                          background: index % 2 === 0 ? 'rgba(0,0,0,0.03)' : 'transparent',
                          cursor: 'default',
                        }}
                      >
                        <td style={cellStyle}>{customer.name}</td>
                        <td style={cellStyle}>{customer.city || '—'}</td>
                        <td style={cellStyle}>{customer.state || '—'}</td>
                        <td style={{ ...cellStyle, textAlign: 'right' }}>{Number(customer.total_orders).toLocaleString()}</td>
                        <td style={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(customer.total_spent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="loading" style={{ minHeight: 200 }}>
                No customers found for the selected date range.
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
