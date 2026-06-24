import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useFilters } from '../contexts/FilterContext';
import { getCustomers } from '../utils/api';
import { fmtCurrency } from '../utils/utils';
import { Avatar } from '../components/Avatar';
import { SortIcon } from '../components/SortIcon';

const COLUMNS = [
  { key: 'name',         label: 'Customer',    align: 'left'  },
  { key: 'city',         label: 'City',        align: 'left'  },
  { key: 'state',        label: 'State',       align: 'left'  },
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
      const data = await getCustomers(startDate, endDate);
      console.log('API data:', data);
      setCustomers(data && Array.isArray(data) ? data : []);
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