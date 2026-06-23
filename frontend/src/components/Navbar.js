import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import ServiceStatus from './ServiceStatus';

const links = [
  { label: 'Orders',    path: '/orders',    icon: 'ti-chart-bar'    },
  { label: 'Products',  path: '/products',  icon: 'ti-package'      },
  { label: 'Customers', path: '/customers', icon: 'ti-users'        },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark, toggle } = useTheme();

  return (
    <>
      {/* Tabler icons font */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />

      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 54,
        background: dark ? '#0A1520' : '#0D2B4E',
        borderBottom: dark ? '1px solid #1E3248' : '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>

        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        >
          <i className="ti ti-shopping-cart" style={{ fontSize: 18, color: 'var(--accent)' }} aria-hidden="true" />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em' }}>
            NovaCart
          </span>
          <span style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: 13,
            fontWeight: 400,
            marginLeft: 2,
          }}>
            Dashboard
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 2 }}>
          {links.map(({ label, path, icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: active ? 'rgba(77,182,172,0.15)' : 'transparent',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                  color: active ? 'var(--accent)' : 'rgba(255,255,255,0.5)',
                  borderRadius: 0,
                  padding: '0 14px',
                  height: 54,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  transition: 'color 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                }}
              >
                <i className={`ti ${icon}`} style={{ fontSize: 15 }} aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ServiceStatus />

          <button
            onClick={toggle}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 6,
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: 15,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
          >
            <i className={dark ? 'ti ti-sun' : 'ti ti-moon'} aria-hidden="true" />
          </button>
        </div>
      </nav>
    </>
  );
}