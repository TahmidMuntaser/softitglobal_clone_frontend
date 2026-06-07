"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


export default function PopularCategories() {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories/`
        );

        const data = await res.json();

        const popular = (data.results || [])
          .filter((item) => item.parent_category === null)
          .sort((a, b) => {
            if (b.delivered_count !== a.delivered_count) {
              return b.delivered_count - a.delivered_count;
            }
            return a.name.localeCompare(b.name);
          })
          .slice(0, 6);

        setCategories(popular);
      } 
      
      catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();

  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="container-fluid popular-categories-section">
     
      {/* header  */}
      <div className="category-title-row">
        <b />
        <span>Popular Categories</span>
        <b />
      </div>

      <div className="scroll-wrapper">
        
        <button className="arrow left" onClick={() => scroll("left")}>
          <FaChevronLeft />
        </button>

        {/* category  */}
        <div className="category-scroll" ref={scrollRef}>
          
          {categories.map((c) => (
            <a key={c.id} href={`/shop/${c.slug}`} className="category-card">
              <img
                src={c.image_url}
                alt={c.name}
                className="category-image"
              />
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