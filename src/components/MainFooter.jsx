import React from 'react';
import {
  FaHouse,
  FaBook,
  FaStar,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaMagnifyingGlass,
} from 'react-icons/fa6';
import '../styles/footer/mainFooter.css';

export default function MainFooter() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Column 1 – Head Office */}
        <div className="footer-col col-head-office">
          <h4 className="footer-title">
            <FaHouse className="footer-title-icon" /> HEAD OFFICE
          </h4>
          <address className="footer-address">
            <p>Address: Soft it Global, 3rd floor,(4 tola)</p>
            <p className="indent-line">House # 36, Road # 3, Mohammadpur</p>
            <p className="contact-line">Hotline: 01615597820</p>
            <p className="contact-line">E-mail: softitglobal@gmail.com</p>
          </address>
        </div>

        {/* Column 2 – Pages + Social */}
        <div className="footer-col col-pages-social">
          <h4 className="footer-title">
            <FaBook className="footer-title-icon" /> PAGE
          </h4>
          <ul className="footer-links">
            <li>About Ecom</li>
            <li>Delivery Policy</li>
            <li>Terms &amp; Condition</li>
            <li>Return Policy</li>
          </ul>
          <h4 className="footer-title social-title">
            <FaStar className="footer-title-icon" /> FOLLOW US
          </h4>
          <div className="social-icons">
            <a href="https://facebook.com" className="social-icon fb" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://youtube.com" className="social-icon yt" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="https://instagram.com" className="social-icon ig" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://tiktok.com" className="social-icon tt" aria-label="TikTok">
              <FaTiktok />
            </a>
            <a href="https://x.com" className="social-icon tw" aria-label="X (Twitter)">
              <FaXTwitter />
            </a>
          </div>
        </div>

        {/* Column 3 – Brand Area */}
        <div className="footer-col col-brand">
          <div className="brand-row">
            <div className="brand-logo">
              <img src="/images/logo.webp" alt="SoftITGlobal" />
            </div>
          </div>

          <button className="track-order-btn">
            <FaMagnifyingGlass className="track-icon" /> Track Order
          </button>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="copyright-bar">
        All right reserved@softitglobal.com Develop by{' '}
        <a href="https://softitglobal.com" className="copyright-link">
          Softitglobal.com
        </a>
      </div>
    </footer>
  );
}