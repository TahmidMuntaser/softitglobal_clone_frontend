'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredTokens, logout } from '../lib/api';
import '../styles/AdminShell.css';
import Breadcrumb from './Breadcrumb';

// Navigation items for the admin panel. Includes Dashboard and the original Products tab.
const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/roles', label: 'Roles' },
  { href: '/admin/admin-users', label: 'User List' },
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
    return <>{children}</>;
  }

  return (
    <div className="page">
      <aside className="sidebar">
        <div className="brand">Admin</div>
        <button type="button" onClick={logout} className="logoutButton">
          Log out
        </button>
        <nav className="nav">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`navLink ${active ? 'navLinkActive' : ''}`.trim()}
                >
                  {item.label}
                </Link>
            );
          })}
        </nav>
      </aside>

      <main className="main">
        <Breadcrumb />
        {children}
      </main>
    </div>
  );
}


