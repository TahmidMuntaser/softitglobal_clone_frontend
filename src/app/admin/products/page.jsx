'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, fetchAll } from '../../../lib/api';

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: '#9ca3af', flexShrink: 0 }}
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    async function load() {
      try {
        const [productList, categoryList] = await Promise.all([
          fetchAll('/api/products/'),
          fetchAll('/api/categories/'),
        ]);
        setProducts(productList);
        setCategories(categoryList);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, products]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/api/products/${id}/`);
    setProducts((prev) => prev.filter((item) => item.id !== id));
  }

  const categoryMap = Object.fromEntries(
    categories.map((c) => [String(c.id), c.name])
  );

  const filteredProducts = products.filter((product) => {
    const matchesName = product.name
      .toString()
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' ||
      (typeof product.category === 'object'
        ? product.category?.name === categoryFilter
        : categoryMap[String(product.category)] === categoryFilter);
    return matchesName && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Products</h1>
          <p style={styles.subtitle}>Create, edit, and delete products.</p>
        </div>
        <Link href="/admin/products/new" style={styles.primaryButton}>
          New product
        </Link>
      </div>

      {/* Search + Category Filter Row */}
      <div style={styles.filterRow}>
        <div
          style={{
            ...styles.searchRow,
            ...(searchFocused ? styles.searchRowFocused : {}),
          }}
        >
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by product name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={styles.searchClear}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.categorySelect}
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={{ ...styles.th, width: '70px' }}>Image</th>
              <th style={{ ...styles.th, width: '15%' }}>Name</th>
              <th style={{ ...styles.th, width: '15%' }}>Slug</th>
              <th style={{ ...styles.th, width: '80px' }}>Price</th>
              <th style={{ ...styles.th, width: '100px' }}>Category</th>
              <th style={{ ...styles.th, width: '110px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td style={styles.tdEmpty} colSpan={6}>Loading...</td>
              </tr>
            ) : displayedProducts.length === 0 ? (
              <tr>
                <td style={styles.tdEmpty} colSpan={6}>No products found.</td>
              </tr>
            ) : (
              displayedProducts.map((product) => (
                <tr key={product.id} style={styles.dataRow}>
                  <td style={styles.td}>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={styles.productImage}
                      />
                    ) : (
                      <div style={styles.imagePlaceholder}>—</div>
                    )}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.productName}>{product.name}</span>
                  </td>
                  <td style={{ ...styles.td, width: '15%' }}>
                    <span style={styles.slugText}>{product.slug}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.amountText}>
                      ৳{parseFloat(product.price).toLocaleString()}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.categoryBadge}>
                      {typeof product.category === 'object'
                        ? product.category?.name || '-'
                        : categoryMap[String(product.category)] || '-'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionRow}>
                      <Link href={`/admin/products/${product.id}`} style={styles.editButton}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                ...styles.pageButton,
                ...(currentPage === 1 ? styles.pageButtonDisabled : {}),
              }}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 5) return true;
                if (page === 1 || page === totalPages) return true;
                return Math.abs(page - currentPage) <= 2;
              })
              .map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  style={page === currentPage ? styles.pageButtonActive : styles.pageButton}
                >
                  {page}
                </button>
              ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                ...styles.pageButton,
                ...(currentPage === totalPages ? styles.pageButtonDisabled : {}),
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'grid',
    gap: '16px',
  },

  /* Header */
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    margin: 0,
    fontSize: '36px',
    fontWeight: 500,
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '17px',
    color: '#6b7280',
  },
  primaryButton: {
    padding: '9px 16px',
    borderRadius: '10px',
    background: '#0f172a',
    color: '#fff',
    fontWeight: 500,
    fontSize: '14px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    alignSelf: 'center',
  },

  /* Search + filter row */
  filterRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  searchRow: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#fff',
    borderWidth: '0.5px',
    borderStyle: 'solid',
    borderColor: '#d1d5db',
    borderRadius: '12px',
    padding: '0 14px',
    height: '44px',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  searchRowFocused: {
    borderColor: '#6b7280',
    boxShadow: '0 0 0 3px rgba(0,0,0,0.06)',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '14px',
    color: '#111827',
    fontFamily: 'inherit',
  },
  searchClear: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    fontSize: '13px',
    padding: '2px 4px',
    borderRadius: '4px',
    lineHeight: 1,
    flexShrink: 0,
  },
  categorySelect: {
    height: '44px',
    padding: '0 12px',
    borderRadius: '12px',
    borderWidth: '0.5px',
    borderStyle: 'solid',
    borderColor: '#d1d5db',
    background: '#fff',
    color: '#111827',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    outline: 'none',
    flexShrink: 0,
  },

  /* Table */
  tableWrap: {
    background: '#fff',
    border: '0.5px solid #e2e8f0',
    borderRadius: '12px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
    fontSize: '13px',
  },
  theadRow: {
    background: '#f8fafc',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: '0.5px solid #e2e8f0',
    fontSize: '12px',
    fontWeight: 500,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  td: {
    padding: '11px 12px',
    borderBottom: '0.5px solid #f1f5f9',
    verticalAlign: 'middle',
    color: '#111827',
    fontSize: '14px',
  },
  tdEmpty: {
    padding: '28px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '13px',
  },
  dataRow: {
    cursor: 'default',
  },

  /* Cell content */
  productImage: {
    width: '44px',
    height: '44px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '0.5px solid #e2e8f0',
    display: 'block',
  },
  imagePlaceholder: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    background: '#f1f5f9',
    border: '0.5px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    fontSize: '13px',
  },
  productName: {
    fontWeight: 500,
    fontSize: '14px',
    color: '#111827',
  },
  slugText: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#6b7280',
  },
  amountText: {
    fontWeight: 500,
    fontSize: '14px',
    color: '#111827',
  },
  categoryBadge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: 500,
    padding: '3px 9px',
    borderRadius: '999px',
    background: '#dbeafe',
    color: '#1e40af',
  },
  actionRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  editButton: {
    padding: '5px 12px',
    borderRadius: '8px',
    background: '#f1f5f9',
    color: '#0f172a',
    fontSize: '13px',
    fontWeight: 500,
    textDecoration: 'none',
    border: '0.5px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },
  deleteButton: {
    padding: '5px 12px',
    borderRadius: '8px',
    background: '#fff1f2',
    color: '#be123c',
    fontSize: '13px',
    fontWeight: 500,
    border: '0.5px solid #fecdd3',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  /* Pagination */
  pagination: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '14px 0',
  },
  pageButton: {
    padding: '5px 11px',
    borderRadius: '8px',
    border: '0.5px solid #e2e8f0',
    background: '#fff',
    color: '#374151',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  pageButtonActive: {
    padding: '5px 11px',
    borderRadius: '8px',
    border: '0.5px solid #0f172a',
    background: '#0f172a',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'default',
  },
  pageButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
};