'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredTokens, logout } from '../lib/api';

const navItems = [
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/orders', label: 'Orders' },
];

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tokens = getStoredTokens();
    if (!tokens.access) {
      router.replace('/login');
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <main style={panelStyles.shell}>
        <div style={panelStyles.loading}>Loading admin panel...</div>
      </main>
    );
  }

  return (
    <div style={panelStyles.page}>
      <aside style={panelStyles.sidebar}>
        <div style={panelStyles.brand}>Admin</div>
        <button type="button" onClick={logout} style={panelStyles.logoutButton}>
          Log out
        </button>
        <nav style={panelStyles.nav}>
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  ...panelStyles.navLink,
                  ...(active ? panelStyles.navLinkActive : null),
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </aside>

      <main style={panelStyles.main}>{children}</main>
    </div>
  );
}

const panelStyles = {
  page: {
    display: 'grid',
    gridTemplateColumns: '220px minmax(0, 1fr)',
    minHeight: '100vh',
    background: '#f5f7fb',
  },
  sidebar: {
    borderRight: '1px solid #dbe3ee',
    background: '#fff',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  brand: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#0f172a',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navLink: {
    padding: '10px 12px',
    borderRadius: '8px',
    color: '#0f172a',
    background: '#f8fafc',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'transparent',
  },
  navLinkActive: {
    background: '#e8f1ff',
    borderColor: '#bcd3ff',
    fontWeight: 600,
  },
  logoutButton: {
    marginTop: '4px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    background: '#fff',
    cursor: 'pointer',
  },
  main: {
    padding: '24px',
  },
  shell: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: '#f5f7fb',
  },
  loading: {
    padding: '16px 20px',
    background: '#fff',
    border: '1px solid #dbe3ee',
    borderRadius: '10px',
  },
};
