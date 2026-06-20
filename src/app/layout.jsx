import './globals.css';
import '../styles/hero/hero.css';
import '../styles/categories/categories.css';
import '../styles/topBrands/topBrands.css';
import '../styles/productCard/productCard.css';
import '../styles/productCategoryBlock/productCategoryBlock.css';
import '../styles/productListing/productListing.css';
import SiteChrome from '../components/SiteChrome';
import FooterChrome from '../components/FooterChrome';

export const metadata = {
  title: 'SoftITGlobal Clone Frontend',
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SiteChrome>{children}</SiteChrome>
        <FooterChrome />
      </body>
    </html>
  );
}
