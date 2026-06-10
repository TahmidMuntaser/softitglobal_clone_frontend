'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, fetchAll } from '../../../lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll('/api/categories/')
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this category?')) return;
    await api.delete(`/api/categories/${id}/`);
    setCategories((prev) => prev.filter((item) => item.id !== id));
  }

  const categoryMap = Object.fromEntries(
    categories.map((category) => [String(category.id), category.name])
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Categories</h1>
          <p style={styles.subtitle}>Create, edit, and delete categories.</p>
        </div>
        <Link href="/admin/categories/new" style={styles.primaryButton}>
          New category
        </Link>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Slug</th>
              <th style={styles.th}>Parent</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td style={styles.td} colSpan={4}>
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td style={styles.td} colSpan={4}>
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td style={styles.td}>{category.name}</td>
                  <td style={styles.td}>{category.slug}</td>
                  <td style={styles.td}>
                    {typeof category.parent_category === 'object'
                      ? category.parent_category?.name || '-'
                      : categoryMap[String(category.parent_category)] || '-'}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionRow}>
                      <Link href={`/admin/categories/${category.id}`} style={styles.linkButton}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
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
  },
  actionRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
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
