"use client";

import { useEffect, useState } from "react";
import { fetchAll } from "../lib/api";

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
      {type === "right" && <path d="m9 6 6 6-6 6" />}
    </svg>
  );
}

export default function CategoryNavbar() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeParent, setActiveParent] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const list = await fetchAll("/api/public/categories/", {
          publicRequest: true,
        });
        setCategories(list);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const parents = categories.filter((c) => c.parent_category === null);

  const childrenOf = (parentId) =>
    categories.filter((c) => c.parent_category === parentId);

  return (
    <div className="category_navbar">
      <div className="container-xl category_nav_inner">
        <div
          className="category_button"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => {
            setOpen(false);
            setActiveParent(null);
          }}
        >
          <Icon type="menu" />
          <span>BROWSE CATEGORIES</span>
          <Icon type="down" />

          {open && (
            <div className="category_dropdown">
              {parents.map((c) => {
                const children = childrenOf(c.id);

                return (
                  <div
                    key={c.id}
                    className="dropdown_row"
                    onMouseEnter={() => setActiveParent(c.id)}
                  >
                    <a href={`/shop/${c.slug}`} className="dropdown_item">
                      <span>{c.name}</span>

                      {children.length > 0 && (
                        <span className="arrow_icon">
                          <Icon type="right" />
                        </span>
                      )}
                    </a>

                    {activeParent === c.id && children.length > 0 && (
                      <div className="subcategory_dropdown">
                        {children.map((sub) => (
                          <a
                            key={sub.id}
                            href={`/shop/${sub.slug}`}
                            className="dropdown_item sub_item"
                          >
                            {sub.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
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
