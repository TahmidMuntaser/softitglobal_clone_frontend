import React from 'react';
import { FaLocationDot, FaArrowRotateLeft, FaGlobe, FaLock } from 'react-icons/fa6';
import '../styles/footer/serviceFeaturesBar.css';

const features = [
  {
    icon: <FaLocationDot className="service-icon" />,
    title: 'Free Delivery',
    description: 'On all order above BDT 5000',
  },
  {
    icon: <FaArrowRotateLeft className="service-icon" />,
    title: 'Easy 7 days return',
    description: '7 days Easy return Guaranty',
  },
  {
    icon: <FaGlobe className="service-icon" />,
    title: 'International Warranty',
    description: '1 year official warranty',
  },
  {
    icon: <FaLock className="service-icon" />,
    title: '100% secure checkout',
    description: 'COD/Mobile banking/visa',
  },
];

export default function ServiceFeaturesBar() {
  return (
    <section className="service-features-bar">
      <div className="service-container">
        {features.map((item, idx) => (
          <div key={idx} className="service-item">
            {item.icon}
            <div className="service-text">
              <h4 className="service-title">{item.title}</h4>
              <p className="service-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}