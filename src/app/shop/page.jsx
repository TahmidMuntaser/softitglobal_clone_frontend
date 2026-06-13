"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAll } from "../../lib/api";
import "../../styles/shopPage/shopPage.css";

export default function ShopLanding() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchAll("/api/public/categories/", {
          publicRequest: true,
        });
        setCategories(list);
      } catch (e) {
        console.error("Failed to load categories", e);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <section className="shop-page">
      <h2 className="shop-page-title">Shop</h2>
      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.id} className="category-item">
            <Link href={`/shop/${cat.slug}`} className="category-link">
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
