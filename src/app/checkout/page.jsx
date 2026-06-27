'use client';

import { useState } from 'react';
import '../../styles/shopPage/checkout.css';

const initialCartItems = [
  {
    id: 1,
    code: 'Sundarban',
    name: 'Liquiid Gold Honey',
    weight: '1kg',
    price: 1300.00,
    quantity: 1,
    image: '/images/logo.webp'
  },
  {
    id: 2,
    code: 'Organic',
    name: 'Pure Organic Honey',
    weight: '500gm',
    price: 850.00,
    quantity: 2,
    image: '/images/logo.webp'
  },
  {
    id: 3,
    code: 'Forest',
    name: 'Forest Raw Honey',
    weight: '1kg',
    price: 1100.00,
    quantity: 1,
    image: '/images/logo.webp'
  },
];

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

  const [cartItems, setCartItems] = useState(initialCartItems);

  const [deliveryCharge, setDeliveryCharge] = useState(100);

  const incrementQuantity = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const getSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getTotal = () => getSubtotal() + deliveryCharge;

  const getTotalItems = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
                  rows="3"
                  required
                />
              </fieldset>
            </div>

            <div className="form-tags">
              <button type="button" className={`tag green ${deliveryCharge === 60 ? 'active' : ''}`} onClick={() => setDeliveryCharge(60)}> ঢাকার মধ্যে - 60</button>
              <button type="button" className={`tag green ${deliveryCharge === 100 ? 'active' : ''}`} onClick={() => setDeliveryCharge(100)}> ঢাকার বাইরে - 100</button>
            </div>

            <button type="submit" className="submit-btn">
              অর্ডার কনফার্ম করুন
            </button>
          </form>
        </div>

        {/* Right Cart Summary Section */}
        <div className="cart-summary-section">
          <h2 className="cart-title">Cart - {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="cart-item-card">
              <div className="cart-item-image-wrapper">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <button type="button" className="remove-btn" onClick={() => removeItem(item.id)}>
                  <span className="remove-icon">×</span>
                </button>
              </div>

              <div className="cart-item-info">
                <p className="cart-item-title">{item.name}</p>
                <p className="cart-item-variant">Weight: {item.weight}</p>
                {item.code && <p className="cart-item-variant">Code: {item.code}</p>}
              </div>

              <div className="quantity-controls">
                <button type="button" className="qty-btn minus" onClick={() => decrementQuantity(item.id)}>−</button>
                <span className="qty-value">{item.quantity}</span>
                <button type="button" className="qty-btn plus" onClick={() => incrementQuantity(item.id)}>+</button>
              </div>

              <div className="price-column">
                <span className="item-price">৳{item.price.toFixed(2)}</span>
              </div>
            </div>
          ))}

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