"use client";

import { useEffect, useState } from "react";

const links = ["HOME", "New Arrival", "Offers"];

function Icon({ type }) {
  return (
    <svg
      className="category_icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {type === "menu" && <path d="M4 6h16M4 12h16M4 18h16" />}
      {type === "down" && <path d="m6 9 6 6 6-6" />}
    </svg>
  );
}

export default function CategoryNavbar() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/`
      );

      const data = await res.json();
      setCategories(data.results || []);
    };

    fetchCategories();
  }, []);



  return (
    <div className="category_navbar">
      <div className="container-xl category_nav_inner">

        
        <div
          className="category_button"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          style={{ position: "relative" }}
        >
          <Icon type="menu" />
          <span>BROWSE CATEGORIES</span>
          <Icon type="down" />

          {open && (
            <div className="category_dropdown">
              {categories.map((c) => (
                <a
                  key={c.id}
                  href={`/shop/${c.slug}`}
                  className="dropdown_item"
                >
                  {c.name}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="category_links">
          {links.map((link) => (
            <a key={link} href="#" className="category_link">
              {link}
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}