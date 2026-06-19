'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredTokens, logout, api } from '../lib/api';
import '../styles/AdminShell.css';
import Breadcrumb from './Breadcrumb';


const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products', requiredPermissions: ['catalog.view_product'] },
  { href: '/admin/categories', label: 'Categories', requiredPermissions: ['catalog.view_category'] },
  { href: '/admin/orders', label: 'Orders', requiredPermissions: ['orders.view_order'] },
  { href: '/admin/roles', label: 'Roles', superuserOnly: true },
  { href: '/admin/admin-users', label: 'User List', superuserOnly: true },
];

function hasAccess(item, userInfo) {
  if (!item.requiredPermissions && !item.superuserOnly) return true;
  if (!userInfo) return false;
  if (userInfo.is_superuser) return true;
  if (item.superuserOnly) return false;
  return item.requiredPermissions.some((perm) => userInfo.permissions?.includes(perm));
}

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoaded, setUserInfoLoaded] = useState(false);

  useEffect(() => {
    const tokens = getStoredTokens();
    if (!tokens.access) {
      router.replace('/login');
      return;
    }

    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    api
      .get('/api/me/')
      .then((res) => setUserInfo(res.data))
      .catch((err) => console.error('Failed to fetch admin user info', err))
      .finally(() => setUserInfoLoaded(true));
  }, [ready]);


  useEffect(() => {
    if (!userInfoLoaded) return;
    const matchedItem = navItems.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    if (matchedItem && !hasAccess(matchedItem, userInfo)) {
      router.replace('/admin/dashboard');
    }
  }, [userInfoLoaded, userInfo, pathname, router]);

  const visibleNavItems = navItems.filter((item) => {
    if (!item.requiredPermissions && !item.superuserOnly) return true;
    return userInfoLoaded && hasAccess(item, userInfo);
  });

  return (
    <div className="page">
      <aside className="sidebar">
        <div className="brand">
          {userInfo?.username}
        </div>
        <button type="button" onClick={logout} className="logoutButton">
          Log out
        </button>
        <nav className="nav">
          {visibleNavItems.map((item) => {
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