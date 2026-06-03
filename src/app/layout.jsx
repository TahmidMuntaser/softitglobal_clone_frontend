import './globals.css';
import AnnouncementMarquee from '../components/AnnouncementMarquee';
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
        {children}
      </body>
    </html>
  );
}
