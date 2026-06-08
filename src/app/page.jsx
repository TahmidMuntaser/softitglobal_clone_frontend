import HeroSection from '../components/HeroSection';
import PopularCategories from '../components/PopularCategories';
import ProductListingSection from '../components/ProductListingSection';
import TopBrands from '../components/TopBrands';



export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <PopularCategories />
      <ProductListingSection />
      <TopBrands />
    </main>
  );
}
