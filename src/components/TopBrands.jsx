'use client';

const brands = [
  "https://www.grocery2.softitglobal.com/posadmin/images/brand/20260503041411.png",
  "https://www.grocery2.softitglobal.com/posadmin/images/brand/20251123031656.png",
  "https://www.grocery2.softitglobal.com/posadmin/images/brand/20251123031638.png",
  "https://www.grocery2.softitglobal.com/posadmin/images/brand/20251123031747.jpg",
  "https://www.grocery2.softitglobal.com/posadmin/images/brand/20251123104831.jpg",
  "https://www.grocery2.softitglobal.com/posadmin/images/brand/20251123030715.png",
  "https://www.grocery2.softitglobal.com/posadmin/images/brand/20251123030700.png",
  "https://www.grocery2.softitglobal.com/posadmin/images/brand/20251123105237.png",
];

export default function TopBrands() {
  return (
    <section className="top-brands-section container-xl">
      <div className="top-brands-ribbon">Top Brands</div>

      <div className="top-brands-card">
        <div className="top-brands-scroll" aria-label="Top brands">
          <div className="top-brands-row">
            {brands.map((src, index) => (
              <div key={index} className="top-brand-badge">
                <img src={src} alt="brand" className="top-brand-img" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}