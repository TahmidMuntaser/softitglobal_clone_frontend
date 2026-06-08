"use client";

const testImage = "/images/logo.webp";

export default function ProductCard({ product, quantity = 1, onQuantityChange }) {
  return (
    <article className="product-card">
      
      {/* img  */}
      <div className="product-image-box">
        <img src={testImage} alt={product.name} className="product-image"/>
      </div>

      <div className="product-card-content">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">{product.price} Tk</div>

        <div className="product-actions">

          <div className="quantity-selector">
            <button type="button" className="quantity-button" onClick={() => onQuantityChange?.(product.id, -1)}>
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button type="button" className="quantity-button" onClick={() => onQuantityChange?.(product.id, 1)}>
              +
            </button>
          </div>

          {/* cart btn  */}
          <button type="button" className="add-cart-button">
            কার্টে রাখুন
          </button>

        </div>

        {/* order btn  */}
        <button type="button" className="order-now-button">
          অর্ডার করুন
        </button>

      </div>
    </article>
  );
}