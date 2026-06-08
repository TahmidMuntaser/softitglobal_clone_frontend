"use client";

import { useState } from "react";
import ProductCategoryBlock from "./ProductCategoryBlock";

const demoCategories = [
  {
    id: 1,
    name: "Honey",
    slug: "honey",
    products: [
      { id: 101, name: "Sundarban Liquid Gold Honey", price: 1300, image: "/images/honey.jpg" },
      { id: 102, name: "Premium Forest Honey", price: 1450, image: "/images/honey.jpg" },
      { id: 103, name: "Pure Blossom Honey", price: 1200, image: "/images/honey.jpg" },
      { id: 104, name: "Natural Wild Honey", price: 1350, image: "/images/honey.jpg" },
      { id: 105, name: "Organic Forest Honey", price: 1550, image: "/images/honey.jpg" },
    ],
  },
  {
    id: 2,
    name: "Ghee",
    slug: "ghee",
    products: [
      { id: 201, name: "Deshi Cow Ghee", price: 980, image: "/images/ghee.jpg" },
      { id: 202, name: "Premium Organic Ghee", price: 1150, image: "/images/ghee.jpg" },
      { id: 203, name: "Pure Buffalo Ghee", price: 1020, image: "/images/ghee.jpg" },
      { id: 204, name: "Traditional Farm Ghee", price: 1250, image: "/images/ghee.jpg" },
      { id: 205, name: "A2 Milk Ghee", price: 1380, image: "/images/ghee.jpg" },
    ],
  },
  {
    id: 3,
    name: "Pickle",
    slug: "pickle",
    products: [
      { id: 301, name: "Mango Pickle", price: 320, image: "/images/pickle.jpg" },
      { id: 302, name: "Mixed Vegetable Pickle", price: 290, image: "/images/pickle.jpg" },
      { id: 303, name: "Aamshotto Pickle", price: 350, image: "/images/pickle.jpg" },
      { id: 304, name: "Lemon Pickle", price: 260, image: "/images/pickle.jpg" },
      { id: 305, name: "Green Chili Pickle", price: 240, image: "/images/pickle.jpg" },
    ],
  },
];

export default function ProductListingSection({ categories = demoCategories }) {
  const [quantities, setQuantities] = useState(() => {
    const initial = {};

    categories.forEach((category) => {
      category.products.forEach((product) => {
        initial[product.id] = 1;
      });
    });

    return initial;
  });

  const handleQuantityChange = (productId, step) => {
    setQuantities((current) => ({
      ...current,
      [productId]: Math.max(1, (current[productId] || 1) + step),
    }));
  };

  return (
    <section className="product-listing-section container-xl">
      {categories.map((category) => (
        <ProductCategoryBlock
          key={category.id}
          category={category}
          quantities={quantities}
          onQuantityChange={handleQuantityChange}
        />
      ))}
    </section>
  );
}
