'use client';

import { usePathname } from 'next/navigation';
import AnnouncementMarquee from './AnnouncementMarquee';
import CategoryNavbar from './CategoryNavbar';
import TopNavbar from './TopNavbar';

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const hideChrome =
    pathname === '/login' || pathname.startsWith('/admin');

  if (hideChrome) {
    return children;
  }

  return (
    <>
      <AnnouncementMarquee />
      <TopNavbar />
      <CategoryNavbar />
      {children}
    </>
  );
}
