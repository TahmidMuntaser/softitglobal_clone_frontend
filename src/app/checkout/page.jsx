'use client';

import { useState } from 'react';
import '../../styles/shopPage/checkout.css';

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('অর্ডার কনফার্ম করা হয়েছে!');
  };

  const [cartItem, setCartItem] = useState({
    code: 'Sundarban',
    name: 'Liquiid Gold Honey',
    weight: '1kg',
    price: 1300.00,
    discount: 0.00,
    quantity: 1,
    image: '/images/honey-placeholder.jpg'
  });

  const [deliveryCharge, setDeliveryCharge] = useState(100);

  const incrementQuantity = () => {
    setCartItem(prev => ({ ...prev, quantity: prev.quantity + 1 }));
  };

  const decrementQuantity = () => {
    setCartItem(prev => ({
      ...prev,
      quantity: prev.quantity > 1 ? prev.quantity - 1 : 1
    }));
  };

  const getSubtotal = () => cartItem.price * cartItem.quantity;

  const getTotal = () => getSubtotal() + deliveryCharge;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Left Form Section */}
        <div className="checkout-form-section">
          <div className="checkout-notice">
            অর্ডার কনফার্ম করতে আপনার নাম, ঠিকানা এবং মোবাইল নম্বর দিয়ে "অর্ডার কনফার্ম করুন" বাটনে ক্লিক করুন।
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Name Field */}
            <div className="form-group">
              <fieldset>
                <legend>আপনার নাম</legend>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=""
                  required
                />
              </fieldset>
            </div>

            {/* Mobile Field */}
            <div className="form-group">
              <fieldset>
                <legend>আপনার মোবাইল নম্বর</legend>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder=""
                  required
                />
              </fieldset>
            </div>

            {/* Address Field */}
            <div className="form-group textarea-group">
              <fieldset>
                <legend>আপনার সম্পূর্ণ ঠিকানা</legend>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder=""
                  rows="4"
                  required
                />
              </fieldset>
            </div>

            <div className="form-tags">
              <button type="button" className={`tag green ${deliveryCharge === 60 ? 'active' : ''}`} onClick={() => setDeliveryCharge(60)}>চাকার মধ্যে - 60</button>
              <button type="button" className={`tag green ${deliveryCharge === 100 ? 'active' : ''}`} onClick={() => setDeliveryCharge(100)}>চাকার বাইরে - 100</button>
            </div>

            <button type="submit" className="submit-btn">
              অর্ডার কনফার্ম করুন
            </button>
          </form>
        </div>

        {/* Right Cart Summary Section */}
        <div className="cart-summary-section">
          <h2 className="cart-title">Cart - 1 items</h2>

          <div className="cart-item-card">
            <button type="button" className="remove-btn">
              <span className="remove-icon">×</span>
            </button>
            
            <div className="cart-item-image">
              <img src={cartItem.image} alt={cartItem.name} />
            </div>

            <div className="cart-item-info">
              <p className="cart-item-title">{cartItem.name}</p>
              <p className="cart-item-variant">Weight: {cartItem.weight}</p>
            </div>

            <div className="quantity-controls">
              <button type="button" className="qty-btn minus" onClick={decrementQuantity}>−</button>
              <span className="qty-value">{cartItem.quantity}</span>
              <button type="button" className="qty-btn plus" onClick={incrementQuantity}>+</button>
            </div>

            <div className="price-column">
              <span className="item-price">৳{cartItem.price.toFixed(2)}</span>
              {cartItem.discount > 0 && (
                <span className="item-discount">Discount: {cartItem.discount.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div className="cart-divider"></div>
          
          <div className="cart-summary-rows">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>৳{getSubtotal().toFixed(0)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charge</span>
              <span>৳{deliveryCharge}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>৳{getTotal().toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
