"use client";

import { rawApi, getSessionId } from "../lib/api";

export default function ProductCard({ product, quantity = 1, onQuantityChange }) {
  const imageSrc = product.image_url || product.image;
  async function handleAddToCart() {
    const sid = getSessionId();
    if (!sid) return;
    try {
      const response = await rawApi.post("/api/public/cart/add/", {
        session_id: sid,
        product_id: product.id,
        quantity,
      });
    } 
    catch (e) {
      console.error("Failed to add to cart", e);
    }
  }

  return (
    <article className="product-card">
      {/* Image */}
      <div className="product-image-box">
        <img src={imageSrc} alt={product.name} className="product-image" />
      </div>

      <div className="product-card-content">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">{product.price} Tk</div>
        <div className="product-actions">
          {/* Quantity selector */}
          <div className="quantity-selector">
            <button
              type="button"
              className="quantity-button"
              onClick={() => onQuantityChange?.(product.id, -1)}
            >
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              type="button"
              className="quantity-button"
              onClick={() => onQuantityChange?.(product.id, 1)}
            >
              +
            </button>
          </div>

          {/* Add‑to‑cart button */}
          <button type="button" className="add-cart-button" onClick={handleAddToCart}>
            কার্টে রাখুন
          </button>
        </div>

        {/* Order now button */}
        <button type="button" className="order-now-button">
          অর্ডার করুন
        </button>
      </div>
    </article>
  );
}
