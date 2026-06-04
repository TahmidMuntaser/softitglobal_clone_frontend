"use client";

import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const categories = [
  { name: "Honey", slug: "honey", img: "/images/logo.webp" },
  { name: "Spices", slug: "spices", img: "/images/logo.webp" },
  { name: "Frozen Snacks", slug: "frozen-snacks", img: "/images/logo.webp" },
  { name: "Tea", slug: "tea", img: "/images/logo.webp" },
  { name: "Rice", slug: "rice", img: "/images/logo.webp" },
  { name: "Oil", slug: "oil", img: "/images/logo.webp" },
  
];

export default function PopularCategories() {
  
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="container-fluid popular-categories-section">
      
      <div className="category-title-row">
        <b />
        <span>Popular Categories</span>
        <b />
      </div>

      <div className="scroll-wrapper">
        <button className="arrow left" onClick={() => scroll("left")}>
          <FaChevronLeft />
        </button>

        <div className="category-scroll" ref={scrollRef}>
          {categories.map((c) => (
            <a key={c.slug} href={`/shop/${c.slug}`} className="category-card">
              <img src={c.img} alt={c.name} className="category-image" />
              <span className="ctgName">{c.name}</span>
            </a>
          ))}
        </div>

        <button className="arrow right" onClick={() => scroll("right")}>
          <FaChevronRight />
        </button>

      </div>
    </section>
  );
}