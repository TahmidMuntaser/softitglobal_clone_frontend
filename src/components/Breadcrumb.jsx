"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Breadcrumb() {
  const pathname = usePathname();

  if (!pathname.startsWith('/admin')) return null;
  const rawParts = pathname.replace(/^\/|\/$/g, '').split('/');
  const displayParts = rawParts[0] === 'admin' ? rawParts.slice(1) : rawParts;


  if (displayParts.length === 1 && displayParts[0] === 'dashboard') return null;

  
  const crumbs = [];

  crumbs.push({ href: '/admin/dashboard', label: 'Dashboard' });

 
  displayParts.forEach((segment, index) => {
   
    if (segment === 'dashboard') return;
    const href = '/' + rawParts.slice(0, index + 2).join('/'); 
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    crumbs.push({ href, label });
  });

  return (
    <nav className="breadcrumb">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.href} className="breadcrumbItem">
          <Link href={crumb.href}>{crumb.label}</Link>
          {idx < crumbs.length - 1 && <span className="breadcrumbSeparator">/</span>}
        </span>
      ))}
    </nav>
  );
}
