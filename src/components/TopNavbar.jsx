'use client';

import { useState } from 'react';


function Icon({ type }) {
  return (
      <svg className="nav_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      
      {type === 'bars' && <path d="M4 6h16M4 12h16M4 18h16"/>}
      {type === 'search' && (
        <>
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </>
      )}
      {type === 'user' && (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c1.8-3.5 5-5 7-5s5.2 1.5 7 5" />
        </>
      )}
      {type === 'bag' && (
        <>
          <path d="M6 8h12l-1 11H7L6 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </>
      )}
      {type === 'phone' && (
        <path d="M6.8 4.8c.6-.6 1.5-.7 2.2-.2l1.8 1.3c.7.5 1 1.4.7 2.2l-.7 1.8c-.2.6-.1 1.3.3 1.8l2.8 2.8c.5.5 1.2.6 1.8.3l1.8-.7c.8-.3 1.7 0 2.2.7l1.3 1.8c.5.7.4 1.6-.2 2.2l-1 1c-.8.8-2 .9-3 .4-4.7-2.1-8.6-6-10.7-10.7-.5-1-.4-2.2.4-3l1-1Z" />
      )}

    </svg>
  );
}

export default function TopNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);


  return (
    <>
      <nav className="navbar navbar-expand-lg top_nav navbar-light bg-light">
        <div className="container-xl top_nav_inner">
          
          {/* logo+menu */}
          <div className="top_nav_left">
            
            <button
              type="button"
              className="navbar-toggler display_sm"
              onClick={() => setMenuOpen(true)}
            >
              <Icon type="bars" />
            </button>

            <a className="navbar-brand" href="/">
              <img src="/images/logo.webp" alt="SoftITGlobal logo" />
            </a>

          </div>


          {/* searchbar  */}
          <form className="header_search">
           
            <input id="searchInput" placeholder="Search products..."/>
            <button type="submit">
              <Icon type="search" />
            </button>

          </form>


          {/* action-phn, login, cart */}
          <div className="top_nav_right">

            {/* mobile action */}
            <div className="display_sm mobile_action_group">
              <button type="button" className="search_toggle" onClick={() => setSearchOpen((v) => !v)} aria-label="Toggle search">
                <Icon type="search" />
              </button>

              <a href="/login">
                <Icon type="user" />
              </a>

              <a className="cart_link" href="/cart">
                <Icon type="bag" />
              </a>
            </div>

            {/* desktop action */}
            <div className="display_lg d-lg-flex desktop_action_group">
              <button
                className="pulse-phone"
                onClick={() => window.location.href = "tel:+8801615597820"}
              >
                <Icon type="phone" />
                <span>01615597820</span>
              </button>
              <a href="/login">
                <Icon type="user" />
              </a>
              <a className="cart_link" href="/cart" aria-label="Cart">
                <Icon type="bag" />
              </a>
            </div>

          </div>


        </div>
      </nav>
      
      {/* mobile sidebar */}
      {menuOpen && (
        <div className="menu_sidebar">
          
          <div
            className="sidebar_overlay"
            onClick={() => setMenuOpen(false)}
          />

          <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/login" onClick={() => setMenuOpen(false)}>Login</a>
          <a href="/cart" onClick={() => setMenuOpen(false)}>Cart</a>

        </div>
      )}
    </>
  );
}
