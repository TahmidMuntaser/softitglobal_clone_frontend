const links = [
  'HOME',
  'New Arrival',
  'Offers',
];

function Icon({ type }) {
  return (
    <svg className="category_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {type === 'menu' && <path d="M4 6h16M4 12h16M4 18h16" />}
      {type === 'down' && <path d="m6 9 6 6 6-6" />}
    </svg>
  );
}

export default function CategoryNavbar() {
  return (
    <div className="category_navbar">
      <div className="container-xl category_nav_inner">
        <button type="button" className="category_button">
          <Icon type="menu" />
          <span>BROWSE CATEGORIES</span>
          <Icon type="down" />
        </button>

        <div className="category_links">
          {links.map((link) => (
            <a key={link} href="" className="category_link">
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
