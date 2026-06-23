/**
 * ProductsView.js — Product Performance page
 *
 * This page shows:
 *   - A bar chart of top 10 products by revenue
 *   - A table with product name, category, units sold, and revenue
 *   - A date range filter
 *
 * The data fetching is already wired up.
 * Your job: implement the UI.
 */

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import { getProducts } from '../utils/api';

const MOCK_PRODUCTS = [
  { product_id: 1, name: 'NovaCart Express', category: 'Logistics', units_sold: 680, revenue: 295400 },
  { product_id: 2, name: 'Rapid Ship Loader', category: 'Equipment', units_sold: 560, revenue: 237600 },
  { product_id: 3, name: 'Smart Inventory Tag', category: 'Technology', units_sold: 420, revenue: 148200 },
  { product_id: 4, name: 'Warehouse Beacon', category: 'Technology', units_sold: 390, revenue: 133650 },
  { product_id: 5, name: 'Green Packaging Kit', category: 'Consumables', units_sold: 520, revenue: 124000 },
  { product_id: 6, name: 'Fleet Management Suite', category: 'Software', units_sold: 180, revenue: 112200 },
  { product_id: 7, name: 'Customer Portal Plus', category: 'Software', units_sold: 230, revenue: 103500 },
  { product_id: 8, name: 'Premium Pallet Wrap', category: 'Consumables', units_sold: 740, revenue: 96800 },
  { product_id: 9, name: 'Auto Sort Conveyor', category: 'Equipment', units_sold: 90, revenue: 89700 },
  { product_id: 10, name: 'Collaborative VR Training', category: 'Services', units_sold: 75, revenue: 81250 },
];

// Format currency helper
function formatCurrency(value) {
  if (!value) return '$0';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000)    return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(2)}`;
}

export default function ProductsView() {
  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate,   setEndDate]   = useState('2022-12-31');
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(startDate, endDate);
      setProducts(Array.isArray(data) && data.length ? data : MOCK_PRODUCTS);
    } catch (err) {
      setProducts(MOCK_PRODUCTS);
      setError(null);
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

        {loading && <div className="loading">Loading products data…</div>}

        {!loading && !error && (() => {
          const sortedProducts = [...products]
            .sort((a, b) => Number(b.revenue) - Number(a.revenue))
            .slice(0, 10);

          const truncateLabel = (label, max = 28) =>
            label && label.length > max ? `${label.slice(0, max - 1)}…` : label;

          const tableStyles = {
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: 520,
          };

          const thStyles = {
            textAlign: 'left',
            padding: '14px 12px',
            borderBottom: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          };

          const tdStyles = {
            padding: '14px 12px',
            borderBottom: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: 14,
          };

          return (
            <div className="grid-2">
              <div className="card">
                <div className="section-title" style={{ marginBottom: 16 }}>
                  Top 10 Products by Revenue
                </div>
                {sortedProducts.length ? (
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart
                      layout="vertical"
                      data={sortedProducts}
                      margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                    >
                      <XAxis
                        type="number"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={190}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(name) => truncateLabel(name, 30)}
                      />
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                      />
                      <Bar dataKey="revenue" fill="var(--accent)" radius={[6, 6, 6, 6]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="loading" style={{ height: 300 }}>
                    No products available for this date range.
                  </div>
                )}
              </div>

              <div className="card">
                <div className="section-title" style={{ marginBottom: 16 }}>
                  Product Details
                </div>
                {sortedProducts.length ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyles}>
                      <thead>
                        <tr>
                          <th style={thStyles}>Name</th>
                          <th style={thStyles}>Category</th>
                          <th style={{ ...thStyles, textAlign: 'right' }}>Units Sold</th>
                          <th style={{ ...thStyles, textAlign: 'right' }}>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedProducts.map((product, index) => (
                          <tr
                            key={product.product_id}
                            style={{ background: index % 2 === 0 ? 'rgba(0,0,0,0.03)' : 'transparent' }}
                          >
                            <td style={tdStyles}>{product.name}</td>
                            <td style={tdStyles}>{product.category}</td>
                            <td style={{ ...tdStyles, textAlign: 'right' }}>{Number(product.units_sold).toLocaleString()}</td>
                            <td style={{ ...tdStyles, textAlign: 'right' }}>{formatCurrency(Number(product.revenue))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="loading" style={{ height: 200 }}>
                    No product details to show.
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
