"use client";

import { useState } from "react";
import { FaCartArrowDown, FaTimes } from "react-icons/fa";

const mockItems = [
  {
    id: 1,
    title: "Sundarban Liqiuid Gold Honey",
    price: 1300.0,
    qty: 2,
    image: "/images/logo.webp",
  },

  {
    id: 2,
    title: "Sundarban Liqiuid silver Honey",
    price: 300.0,
    qty: 1,
    image: "/images/logo.webp",
  },
];

export default function CartSidebar({ isOpen, onClose }) {
  const [items, setItems] = useState(mockItems);

  const handleQtyChange = (id, delta) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
      )
    );
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  // empty state
  const renderEmpty = () => (
    <div className="cart_empty_state">
      <FaCartArrowDown className="empty_icon" />
      <p className="empty_text">No products in the cart.</p>
      <button className="btn btn-dark text-cap" onClick={onClose}>
        Return To Shop
      </button>
    </div>
  );

  // with items
  const renderItems = () => (
    <>
      <div className="cart_item_scroll">
        {items.map((item) => (
          <div key={item.id} className="cart_item">
            <button
              className="remove_btn"
              onClick={() => handleRemove(item.id)}
              aria-label="Remove item"
            >
              <FaTimes />
            </button>

            <img
              src={item.image}
              alt={item.title}
              className="product_image"
            />

            <div className="item_details">
              <p className="product_title" title={item.title}>
                {item.title}
              </p>

              <div className="qty_price_row">
                <span className="qty_label">{item.qty} x</span>
                <span className="product_price">
                  {item.price.toFixed(2)}
                </span>
              </div>

              <div className="quantity_controls">
                <button
                  className="qty_btn"
                  aria-label="Decrease quantity"
                  onClick={() => handleQtyChange(item.id, -1)}
                >
                  −
                </button>
                <span className="qty_value">{item.qty}</span>
                <button
                  className="qty_btn"
                  aria-label="Increase quantity"
                  onClick={() => handleQtyChange(item.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky footer */}
      <div className="cart_footer">
        <div className="subtotal_row">
          <span className="subtotal_label">Subtotal:</span>
          <span className="subtotal_value">{subtotal.toFixed(0)}</span>
        </div>

        <button className="btn btn-dark text-cap checkout_btn">
          Checkout
        </button>

        <button className="btn btn-dark text-cap continue_btn" onClick={onClose}>
          আরো কিনতে চাই
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar drawer */}
      <aside className={`cart_sidebar ${isOpen ? "active" : ""}`}>
        <header className="cart_header">
          <h2 className="cart_title">Shopping Cart</h2>
          <button className="cart_dismiss" onClick={onClose} aria-label="Close">
            <FaTimes className="dismiss_icon" />
            <span>Close</span>
          </button>
        </header>

        <div className="cart_body">
          {items.length === 0 ? renderEmpty() : renderItems()}
        </div>
      </aside>
    </>
  );
}