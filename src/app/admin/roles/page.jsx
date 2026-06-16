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

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const roleList = await fetchAll('/api/roles/');
        setRoles(roleList);
      } catch (err) {
        console.error('Failed to load roles', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roles]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this role?')) return;
    try {
      // The backend expects DELETE on the update endpoint
      await api.delete(`/api/roles/${id}/update/`);
      setRoles((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete role', err);
      alert('Failed to delete role. Please try again.');
    }
  }

  const filteredRoles = roles.filter((role) =>
    role.name.toString().toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const displayedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Roles</h1>
          <p style={styles.subtitle}>Create, edit, and delete roles.</p>
        </div>
        <Link href="/admin/roles/new" style={styles.primaryButton}>
          New role
        </Link>
      </div>

      {/* Search */}
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
            placeholder="Search by role name…"
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
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={{ ...styles.th, width: '10%' }}>ID</th>
              <th style={{ ...styles.th, width: '40%' }}>Role Name</th>
              <th style={{ ...styles.th, width: '50%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td style={styles.tdEmpty} colSpan={3}>Loading...</td>
              </tr>
            ) : displayedRoles.length === 0 ? (
              <tr>
                <td style={styles.tdEmpty} colSpan={3}>No roles found.</td>
              </tr>
            ) : (
              displayedRoles.map((role) => (
                <tr key={role.id} style={styles.dataRow}>
                  <td style={styles.td}>
                    <span style={styles.slugText}>{role.id}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.productName}>{role.name}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionRow}>
                      <Link href={`/admin/roles/${role.id}`} style={styles.editButton}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(role.id)}
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
