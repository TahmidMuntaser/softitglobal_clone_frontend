import './globals.css';
import '../styles/hero/hero.css';
import '../styles/categories/categories.css';
import AnnouncementMarquee from '../components/AnnouncementMarquee';
import CategoryNavbar from '../components/CategoryNavbar';
import TopNavbar from '../components/TopNavbar';

export const metadata = {
  title: 'SoftITGlobal Clone Frontend',
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnnouncementMarquee />
        <TopNavbar />
        <CategoryNavbar />
        {children}
      </body>
    </html>
  );
}
