"use client";

import { useEffect, useState } from "react";
import ProductCategoryBlock from "./ProductCategoryBlock";

export default function ProductListingSection() {
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
  let active = true;

  async function loadProducts() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const url = `${baseUrl}/api/products/`;

      const allProducts = [];
      let nextUrl = url;

      while (nextUrl) {
        const res = await fetch(nextUrl);
        const data = await res.json();

        allProducts.push(...(data.results || []));
        nextUrl = data.next;
      }

      if (!active) return;

      const grouped = groupByCategory(allProducts);

      setCategories(grouped);
      setQuantities(createQuantities(grouped));
    } 
    
    
    catch (err) {
      console.error("Failed to load products", err);
      setCategories([]);
      setQuantities({});
    }

  }

  loadProducts();

  return () => {
    active = false;
  };
}, []);


  function groupByCategory(products) {
    const map = {};

    products.forEach((product) => {
      const category = product.category;
      if (!category || !category.slug) return;

      if (!map[category.slug]) {
        map[category.slug] = {
          id: category.id,
          name: category.name,
          slug: category.slug,
          delivered_count: category.delivered_count || 0,
          products: [],
        };
      }

      if (map[category.slug].products.length < 5) {
        map[category.slug].products.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
        });
      }
    });

    return Object.values(map)
      .sort((a, b) => {
        if (b.delivered_count === a.delivered_count) {
          return a.name.localeCompare(b.name);
        }
        return b.delivered_count - a.delivered_count;
      })
      .slice(0, 3);
  }

  function createQuantities(categories) {
    const qty = {};

    categories.forEach((category) => {
      category.products.forEach((product) => {
        qty[product.id] = 1;
      });                                 
    });

    return qty;
  }

  function handleQuantityChange(productId, step) {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + step),
    }));
  }

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