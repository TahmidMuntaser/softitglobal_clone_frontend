'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, fetchAll } from '../../../lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
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

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/api/products/${id}/`);
    setProducts((prev) => prev.filter((item) => item.id !== id));
  }

  const categoryMap = Object.fromEntries(
    categories.map((category) => [String(category.id), category.name])
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Products</h1>
          <p style={styles.subtitle}>Create, edit, and delete products.</p>
        </div>
        <Link href="/admin/products/new" style={styles.primaryButton}>
          New product
        </Link>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: '24%' }}>Name</th>
              <th style={styles.th}>Slug</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Category</th>
              <th style={{ ...styles.th, width: '16%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td style={styles.td} colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td style={styles.td} colSpan={5}>
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td style={{ ...styles.td, width: '18%' }}>{product.name}</td>
                  <td style={styles.td}>{product.slug}</td>
                  <td style={styles.td}>{product.price}</td>
                  <td style={styles.td}>
                    {typeof product.category === 'object'
                      ? product.category?.name || '-'
                      : categoryMap[String(product.category)] || '-'}
                  </td>
                  <td style={{ ...styles.td, width: '26%' }}>
                    <div style={styles.actionRow}>
                      <Link href={`/admin/products/${product.id}`} style={styles.linkButton}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        style={styles.dangerButton}
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
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'grid',
    gap: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
  },
  subtitle: {
    margin: '6px 0 0',
    color: '#475569',
  },
  primaryButton: {
    padding: '11px 14px',
    borderRadius: '8px',
    background: '#0f172a',
    color: '#fff',
    fontWeight: 600,
  },
  tableWrap: {
    background: '#fff',
    border: '1px solid #dbe3ee',
    borderRadius: '12px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
  },
  th: {
    textAlign: 'left',
    padding: '12px 14px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '14px',
  },
  td: {
    padding: '12px 14px',
    borderBottom: '1px solid #eef2f7',
    verticalAlign: 'top',
    overflowWrap: 'anywhere',
  },
  actionRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  linkButton: {
    padding: '8px 10px',
    borderRadius: '8px',
    background: '#e8f1ff',
    color: '#1d4ed8',
  },
  dangerButton: {
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid #fecdd3',
    background: '#fff1f2',
    color: '#be123c',
    cursor: 'pointer',
  },
};
