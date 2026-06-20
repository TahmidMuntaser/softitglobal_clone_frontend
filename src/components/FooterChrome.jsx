'use client';

import { usePathname } from 'next/navigation';
import ServiceFeaturesBar from './ServiceFeaturesBar';
import MainFooter from './MainFooter';

export default function FooterChrome() {
  const pathname = usePathname();
  const hideFooter =
    pathname === '/login' || pathname.startsWith('/admin');

  if (hideFooter) {
    return null;
  }

  return (
    <>
      <ServiceFeaturesBar />
      <MainFooter />
    </>
  );
}
