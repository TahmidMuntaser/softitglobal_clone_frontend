"use client";

import { useState, useEffect } from "react";
import { FaCartArrowDown, FaTimes } from "react-icons/fa";
import { rawApi, getSessionId } from "../lib/api";

export default function CartSidebar({ isOpen, onClose }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const loadCart = async () => {
      const sessionId = getSessionId();
      if (!sessionId) return;
      try {
        const { data } = await rawApi.get("/api/public/cart/", {
          params: { session_id: sessionId },
        });
        setItems(data.items || []);
      } 
      
      catch (e) {
        console.error("Failed to load cart", e);
        setItems([]);
      }
    };
    loadCart();
  }, [isOpen]);

  const handleQtyChange = async (id, delta) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    const newQty = Math.max(1, (item.quantity || item.qty || 1) + delta);
    const sessionId = getSessionId();
    if (!sessionId) return;
    try {
        await rawApi.patch(`/api/public/cart/item/${id}/`, {
        quantity: newQty,
        session_id: sessionId,
      });
      const { data } = await rawApi.get("/api/public/cart/", {
        params: { session_id: sessionId },
      });
      setItems(data.items || []);
    } catch (e) {
      console.error("Failed to update cart item", e);
    }
  };

  const handleRemove = async (id) => {
    const sessionId = getSessionId();
    if (!sessionId) return;
    try {
        await rawApi.delete(`/api/public/cart/item/${id}/`, {
        params: { session_id: sessionId },
      });
      
      const { data } = await rawApi.get("/api/public/cart/", {
        params: { session_id: sessionId },
      });
      setItems(data.items || []);
    } catch (e) {
      console.error("Failed to remove cart item", e);
    }
  };

  const subtotal = items.reduce((sum, it) => {
    const price = it.product?.price || it.price || 0;
    const qty = it.quantity || it.qty || 1;
    return sum + parseFloat(price) * qty;
  }, 0);

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
        {items.map((item) => {
          const price = parseFloat(item.product?.price || item.price || 0);
          const title = item.product?.name || item.title || "Product";
          const image = item.product?.image_url || item.image;
          const qty = item.quantity || item.qty || 1;
          
          return (
          <div key={item.id} className="cart_item">
            <button
              className="remove_btn"
              onClick={() => handleRemove(item.id)}
              aria-label="Remove item"
            >
              <FaTimes />
            </button>

            <img
              src={image}
              alt={title}
              className="product_image"
            />

            <div className="item_details">
              <p className="product_title" title={title}>
                {title}
              </p>

              <div className="qty_price_row">
                <span className="qty_label">{qty} x</span>
                <span className="product_price">
                  {price.toFixed(2)}
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
                <span className="qty_value">{qty}</span>
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
        )})}
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