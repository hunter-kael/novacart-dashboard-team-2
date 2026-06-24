import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useFilters } from '../contexts/FilterContext';
// import { getCustomers } from '../utils/api';

const MOCK_CUSTOMERS = [
  { customer_id: 'C001', name: 'Alice Johnson',  city: 'Austin',        state: 'TX', total_orders: 24, total_spent: 15430.50, last_order_date: '2022-12-15' },
  { customer_id: 'C002', name: 'Marcus Lee',     city: 'Chicago',       state: 'IL', total_orders: 19, total_spent: 13280.00, last_order_date: '2022-11-28' },
  { customer_id: 'C003', name: 'Nina Patel',     city: 'San Francisco', state: 'CA', total_orders: 27, total_spent: 12640.75, last_order_date: '2022-12-08' },
  { customer_id: 'C004', name: 'Samuel Green',   city: 'Miami',         state: 'FL', total_orders: 18, total_spent: 11890.30, last_order_date: '2022-10-20' },
  { customer_id: 'C005', name: 'Isabella Cruz',  city: 'Dallas',        state: 'TX', total_orders: 21, total_spent: 11420.60, last_order_date: '2022-12-03' },
  { customer_id: 'C006', name: 'Diego Morales',  city: 'Los Angeles',   state: 'CA', total_orders: 16, total_spent: 10975.25, last_order_date: '2022-11-14' },
  { customer_id: 'C007', name: 'Maya Chen',      city: 'Seattle',       state: 'WA', total_orders: 22, total_spent: 10350.00, last_order_date: '2022-11-30' },
  { customer_id: 'C008', name: 'Ethan Kim',      city: 'Boston',        state: 'MA', total_orders: 14, total_spent:  9840.35, last_order_date: '2022-10-10' },
  { customer_id: 'C009', name: 'Olivia Davis',   city: 'Denver',        state: 'CO', total_orders: 15, total_spent:  9320.15, last_order_date: '2022-12-01' },
  { customer_id: 'C010', name: 'Lucas Brown',    city: 'Phoenix',       state: 'AZ', total_orders: 13, total_spent:  8912.90, last_order_date: '2022-09-25' },
  { customer_id: 'C011', name: 'Sofia Rivera',   city: 'Atlanta',       state: 'GA', total_orders: 17, total_spent:  8650.40, last_order_date: '2022-11-05' },
  { customer_id: 'C012', name: 'Owen Walker',    city: 'Portland',      state: 'OR', total_orders: 12, total_spent:  8185.00, last_order_date: '2022-12-11' },
  { customer_id: 'C013', name: 'Chloe Nguyen',   city: 'Philadelphia',  state: 'PA', total_orders: 10, total_spent:  7820.80, last_order_date: '2022-10-22' },
  { customer_id: 'C014', name: 'Liam Thompson',  city: 'San Diego',     state: 'CA', total_orders: 11, total_spent:  7540.20, last_order_date: '2022-11-18' },
  { customer_id: 'C015', name: 'Ava Martinez',   city: 'Houston',       state: 'TX', total_orders:  9, total_spent:  6920.60, last_order_date: '2022-12-09' },
  { customer_id: 'C016', name: 'Noah Walker',    city: 'Nashville',     state: 'TN', total_orders:  8, total_spent:  6483.90, last_order_date: '2022-09-30' },
  { customer_id: 'C017', name: 'Grace Cooper',   city: 'Minneapolis',   state: 'MN', total_orders:  7, total_spent:  6105.40, last_order_date: '2022-11-25' },
  { customer_id: 'C018', name: 'Henry Scott',    city: 'Kansas City',   state: 'MO', total_orders:  6, total_spent:  5870.10, last_order_date: '2022-10-14' },
  { customer_id: 'C019', name: 'Emma Foster',    city: 'Salt Lake City',state: 'UT', total_orders:  5, total_spent:  5420.00, last_order_date: '2022-12-13' },
  { customer_id: 'C020', name: 'Lily Brooks',    city: 'Detroit',       state: 'MI', total_orders:  4, total_spent:  4980.75, last_order_date: '2022-09-12' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (v) =>
  `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

// Deterministic hue from string — same as ProductsView so the pattern is consistent
function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h) % 360;
}

function avatarColor(name) {
  const hue = hashHue(name);
  return {
    bg:   `hsla(${hue}, 50%, 45%, 0.15)`,
    text: `hsl(${hue}, 50%, 38%)`,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name }) {
  const { bg, text } = avatarColor(name);
  return (
    <div style={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      background: bg,
      color: text,
      fontSize: 11,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      letterSpacing: '0.03em',
    }}>
      {initials(name)}
    </div>
  );
}

function SortIcon({ active, dir }) {
  return (
    <span style={{ marginLeft: 3, opacity: active ? 1 : 0.3, fontSize: 10 }}>
      {active && dir === 'asc' ? '▲' : '▼'}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const COLUMNS = [
  { key: 'name',         label: 'Customer',    align: 'left'  },
  { key: 'city',         label: 'City',        align: 'left'  },
  { key: 'state',        label: 'State',       align: 'left'  },
  { key: 'last_order_date', label: 'Last Order', align: 'left' },
  { key: 'total_orders', label: 'Orders',      align: 'right' },
  { key: 'total_spent',  label: 'Total Spent', align: 'right' },
];

export default function CustomersView() {
  const [customers, setCustomers] = useState([]);
  const [sortBy,    setSortBy]    = useState('total_spent');
  const [sortDir,   setSortDir]   = useState('desc');
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const {startDate, endDate, setStartDate, setEndDate} = useFilters();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      // const data = await getCustomers(startDate, endDate);
      setCustomers(MOCK_CUSTOMERS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSort(col) {
    if (sortBy === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortDir('desc');
    }
  }

  const sorted = [...customers].sort((a, b) => {
    const va = a[sortBy], vb = b[sortBy];
    if (typeof va === 'number') return sortDir === 'asc' ? va - vb : vb - va;
    return sortDir === 'asc'
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va));
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
    cursor: 'pointer',
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

        {/* Filter bar */}
        <div className="filter-bar">
          <label>From</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label>To</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button className="btn-apply" onClick={loadData}>Apply</button>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
            {customers.length} customers
          </span>
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

        {loading && <div className="loading">Loading customers…</div>}

        {!loading && !error && (
          <div className="card">
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <span className="section-title">Top Customers by Revenue</span>
              {/* Sort buttons — mirrors ProductsView pattern */}
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { key: 'total_spent',  label: 'Spent'  },
                  { key: 'total_orders', label: 'Orders' },
                  { key: 'name',         label: 'Name'   },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleSort(key)}
                    style={{
                      background: sortBy === key ? 'var(--accent)' : 'transparent',
                      color: sortBy === key ? '#fff' : 'var(--text-muted)',
                      border: `1px solid ${sortBy === key ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 5,
                      padding: '3px 9px',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    {label}
                    <SortIcon active={sortBy === key} dir={sortDir} />
                  </button>
                ))}
              </div>
            </div>

            {sorted.length ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                  <thead>
                    <tr>
                      {COLUMNS.map(({ key, label, align }) => (
                        <th
                          key={key}
                          onClick={() => handleSort(key)}
                          style={{
                            ...thBase,
                            textAlign: align,
                            color: sortBy === key ? 'var(--accent)' : 'var(--text-muted)',
                          }}
                        >
                          {label}
                          <SortIcon active={sortBy === key} dir={sortDir} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((c) => {
                      const isTop = c.customer_id === sorted[0]?.customer_id;
                      return (
                        <tr
                          key={c.customer_id}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          {/* Name + avatar */}
                          <td style={tdBase}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <Avatar name={c.name} />
                              <span style={{ fontWeight: isTop ? 600 : 400 }}>{c.name}</span>
                            </div>
                          </td>

                          {/* City */}
                          <td style={{ ...tdBase, color: 'var(--text-secondary)' }}>
                            {c.city || '—'}
                          </td>

                          {/* State */}
                          <td style={{ ...tdBase, color: 'var(--text-secondary)', fontSize: 12 }}>
                            {c.state || '—'}
                          </td>

                          {/* Last order date */}
                          <td style={{ ...tdBase, color: 'var(--text-muted)', fontSize: 12 }}>
                            {c.last_order_date
                              ? new Date(c.last_order_date + 'T00:00:00').toLocaleDateString('en-US', {
                                  month: 'short', day: 'numeric', year: 'numeric',
                                })
                              : '—'}
                          </td>

                          {/* Orders */}
                          <td style={{
                            ...tdBase,
                            textAlign: 'right',
                            fontWeight: sortBy === 'total_orders' ? 600 : 400,
                            color: sortBy === 'total_orders' ? 'var(--text-primary)' : 'var(--text-secondary)',
                          }}>
                            {Number(c.total_orders).toLocaleString()}
                          </td>

                          {/* Total spent */}
                          <td style={{
                            ...tdBase,
                            textAlign: 'right',
                            fontWeight: sortBy === 'total_spent' ? 600 : 400,
                            color: isTop ? 'var(--accent)' : sortBy === 'total_spent' ? 'var(--text-primary)' : 'var(--text-secondary)',
                          }}>
                            {fmtCurrency(c.total_spent)}
                          </td>
                        </tr>
                      );
                    })}
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