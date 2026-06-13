"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchAll } from "../../../lib/api";
import ProductCard from "../../../components/ProductCard";
import "../../../styles/shopPage/shopPage.css";

export default function ShopCategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        const [categories, allProducts] = await Promise.all([
          fetchAll("/api/public/categories/", { publicRequest: true }),
          fetchAll("/api/public/products/", { publicRequest: true }),
        ]);

        const matched = categories.find((c) => c.slug === slug);
        setCategory(matched || null);

        const filtered = allProducts.filter(
          (p) => p.category && p.category.slug === slug
        );
        setProducts(filtered);
        const initQty = {};
        filtered.forEach((p) => {
          initQty[p.id] = 1;
        });
        setQuantities(initQty);
      } catch (err) {
        console.error("Failed to load shop data", err);
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  function handleQuantityChange(productId, step) {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + step),
    }));
  }

  if (loading) return <p>Loading...</p>;
  if (!category) return <p>Category not found.</p>;

  if (products.length === 0) {
    return (
      <section className="shop-page shop-page-empty-state">
        <div className="shop-page-empty-content">
          <p className="shop-page-empty-message">Products Not Found!!!</p>
          <Link href="/" className="shop-page-home-button">
            Go to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="shop-page">
      <h2 className="shop-page-title">{category.name}</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={quantities[product.id] || 1}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </div>
    </section>
  );
}
