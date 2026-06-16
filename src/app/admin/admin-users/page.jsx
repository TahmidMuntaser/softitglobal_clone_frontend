'use client';

import Link from 'next/link';
import { useEffect, useState, Fragment } from 'react';
import { api, fetchAll } from '../../../lib/api';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af', flexShrink: 0 }} aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ShieldIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M8 11l3 3 5-5" />
  </svg>
);

const CheckIcon = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const XIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Inline roles popover state
  const [rolesPanel, setRolesPanel] = useState(null); // { userId, username, pendingIds, allRoles }
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesSubmitting, setRolesSubmitting] = useState(false);
  const [rolesError, setRolesError] = useState(null);
  const [rolesSuccess, setRolesSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // First fetch the list of admin users
        const userList = await fetchAll('/api/admin-users/');
        // For each user, fetch detailed data to include groups/roles
        const usersWithGroups = await Promise.all(
          userList.map(async (u) => {
            try {
              const detail = await api.get(`/api/admin-users/${u.id}/`);
              // The detail response should contain a "groups" field (array of role objects)
              return { ...u, groups: detail.data?.groups || [] };
            } catch (e) {
              // If fetching detail fails, fallback to empty groups
              console.error('Failed to load groups for user', u.id, e);
              return { ...u, groups: [] };
            }
          })
        );
        setUsers(usersWithGroups);
      } catch (err) {
        console.error('Failed to load users', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, users]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this admin user?')) return;
    try {
      await api.delete(`/api/admin-users/${id}/`);
      setUsers((prev) => prev.filter((item) => item.id !== id));
      if (rolesPanel?.userId === id) setRolesPanel(null);
    } catch (err) {
      console.error('Failed to delete user', err);
      alert('Failed to delete user. Please try again.');
    }
  }

  async function openRolesPanel(user) {
    // Toggle off if already open
    if (rolesPanel?.userId === user.id) {
      setRolesPanel(null);
      setRolesError(null);
      setRolesSuccess(false);
      return;
    }

    setRolesPanel(null);
    setRolesError(null);
    setRolesSuccess(false);
    setRolesLoading(true);

    try {
      const [userData, rolesData] = await Promise.all([
        api.get(`/api/admin-users/${user.id}/`),
        fetchAll('/api/roles/'),
      ]);
      setRolesPanel({
        userId: user.id,
        username: user.username,
        pendingIds: new Set(userData.data?.groups?.map((g) => g.id) || []),
        allRoles: rolesData,
      });
    } catch (err) {
      console.error('Failed to load roles', err);
      setRolesError('Failed to load roles. Please try again.');
      setRolesPanel({ userId: user.id, username: user.username, pendingIds: new Set(), allRoles: [] });
    } finally {
      setRolesLoading(false);
    }
  }

  function toggleRole(roleId) {
    setRolesPanel((prev) => {
      const next = new Set(prev.pendingIds);
      next.has(roleId) ? next.delete(roleId) : next.add(roleId);
      return { ...prev, pendingIds: next };
    });
  }

  async function handleRolesSubmit() {
    if (!rolesPanel) return;
    setRolesSubmitting(true);
    setRolesError(null);
    setRolesSuccess(false);
    try {
      await api.post(`/api/admin-users/${rolesPanel.userId}/roles/`, {
        groups: Array.from(rolesPanel.pendingIds),
      });
      // Update local user list so badges reflect new roles immediately
      setUsers((prev) =>
        prev.map((u) =>
          u.id === rolesPanel.userId
            ? { ...u, groups: rolesPanel.allRoles.filter((r) => rolesPanel.pendingIds.has(r.id)) }
            : u
        )
      );
      setRolesSuccess(true);
      setTimeout(() => setRolesSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to assign roles', err);
      setRolesError('Failed to save roles. Please try again.');
    } finally {
      setRolesSubmitting(false);
    }
  }

  function closePanel() {
    setRolesPanel(null);
    setRolesError(null);
    setRolesSuccess(false);
  }

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.trim().toLowerCase();
    return (
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.first_name?.toLowerCase().includes(term) ||
      user.last_name?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Users</h1>
          <p style={styles.subtitle}>Manage admin users and assign roles.</p>
        </div>
        <Link href="/admin/admin-users/new" style={styles.primaryButton}>
          New Admin User
        </Link>
      </div>

      {/* Search */}
      <div style={styles.filterRow}>
        <div style={{ ...styles.searchRow, ...(searchFocused ? styles.searchRowFocused : {}) }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by username, email, name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} style={styles.searchClear} aria-label="Clear search">
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
              <th style={{ ...styles.th, width: '8%' }}>ID</th>
              <th style={{ ...styles.th, width: '18%' }}>Username</th>
              <th style={{ ...styles.th, width: '24%' }}>Email</th>
              <th style={{ ...styles.th, width: '26%' }}>Roles</th>
              <th style={{ ...styles.th, width: '24%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td style={styles.tdEmpty} colSpan={5}>Loading...</td></tr>
            ) : displayedUsers.length === 0 ? (
              <tr><td style={styles.tdEmpty} colSpan={5}>No users found.</td></tr>
            ) : (
              displayedUsers.map((user) => {
                const isActive = rolesPanel?.userId === user.id;
                const userGroups = user.groups || [];

                return (
                  <Fragment key={user.id}>
                    {/* Main user row */}
                    <tr
                      key={user.id}
                      style={{
                        ...styles.dataRow,
                        ...(isActive ? styles.dataRowActive : {}),
                      }}
                    >
                      <td style={styles.td}>
                        <span style={styles.monoText}>{user.id}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.productName}>{user.username}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.monoText}>{user.email}</span>
                      </td>
                      <td style={styles.td}>
                        <RoleBadges groups={userGroups} />
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <Link href={`/admin/admin-users/${user.id}`} style={styles.editButton}>
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => openRolesPanel(user)}
                            style={{
                              ...styles.assignButton,
                              ...(isActive ? styles.assignButtonActive : {}),
                            }}
                            aria-expanded={isActive}
                          >
                            <ShieldIcon />
                            Roles{userGroups.length > 0 ? ` (${userGroups.length})` : ''}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            style={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline roles popover row */}
                    {isActive && (
                      <tr key={`${user.id}-roles`} style={styles.popoverRow}>
                        <td colSpan={5} style={styles.popoverCell}>
                          <div style={styles.popoverPadding}>
                            <div style={styles.popoverInner}>
                              {/* Popover header */}
                              <div style={styles.popoverHeader}>
                                <div style={styles.popoverHeaderLeft}>
                                  <div style={styles.popoverIconWrap}>
                                    <ShieldIcon size={15} />
                                  </div>
                                  <div>
                                    <p style={styles.popoverTitle}>Assign Roles</p>
                                    <p style={styles.popoverSub}>{rolesPanel?.username}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={closePanel}
                                  style={styles.popoverClose}
                                  aria-label="Close"
                                >
                                  <XIcon />
                                </button>
                              </div>

                              {/* Popover body */}
                              {rolesLoading ? (
                                <div style={styles.popoverLoading}>Loading roles…</div>
                              ) : (
                                <>
                                  {rolesError && (
                                    <div style={styles.rolesError}>{rolesError}</div>
                                  )}

                                  {rolesPanel?.allRoles?.length === 0 ? (
                                    <p style={styles.rolesEmpty}>No roles available.</p>
                                  ) : (
                                    <div style={styles.rolesGrid}>
                                      {rolesPanel?.allRoles?.map((role) => {
                                        const assigned = rolesPanel.pendingIds.has(role.id);
                                        return (
                                          <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => toggleRole(role.id)}
                                            style={{
                                              ...styles.roleToggle,
                                              ...(assigned ? styles.roleToggleAssigned : {}),
                                            }}
                                            aria-pressed={assigned}
                                          >
                                            <div style={{
                                              ...styles.checkBox,
                                              ...(assigned ? styles.checkBoxChecked : {}),
                                            }}>
                                              {assigned && <CheckIcon />}
                                            </div>
                                            <span style={{
                                              ...styles.roleLabel,
                                              ...(assigned ? styles.roleLabelAssigned : {}),
                                            }}>
                                              {role.name}
                                            </span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Popover footer */}
                                  <div style={styles.popoverFooter}>
                                    <span style={styles.assignedSummary}>
                                      {rolesPanel?.pendingIds?.size === 0
                                        ? 'No roles selected'
                                        : <><strong style={{ color: '#3C3489' }}>{rolesPanel.pendingIds.size}</strong> role{rolesPanel.pendingIds.size !== 1 ? 's' : ''} selected</>
                                      }
                                      {rolesSuccess && (
                                        <span style={styles.successToast}>
                                          &nbsp;&nbsp;<CheckIcon size={12} /> Saved
                                        </span>
                                      )}
                                    </span>
                                    <div style={styles.footerActions}>
                                      <button type="button" onClick={closePanel} style={styles.cancelButton}>
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleRolesSubmit}
                                        disabled={rolesSubmitting}
                                        style={{
                                          ...styles.saveButton,
                                          ...(rolesSubmitting ? styles.saveButtonDisabled : {}),
                                        }}
                                      >
                                        {rolesSubmitting ? 'Saving…' : 'Save roles'}
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
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
              style={{ ...styles.pageButton, ...(currentPage === 1 ? styles.pageButtonDisabled : {}) }}
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
              style={{ ...styles.pageButton, ...(currentPage === totalPages ? styles.pageButtonDisabled : {}) }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Role badges component ────────────────────────────────────────────────────
function RoleBadges({ groups }) {
  if (!groups || groups.length === 0) {
    return <span style={styles.noRolesText}>No roles</span>;
  }
  const visible = groups.slice(0, 2);
  const overflow = groups.length - 2;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
      {visible.map((g) => (
        <span key={g.id} style={styles.roleBadge}>
          {g.name}
        </span>
      ))}
      {overflow > 0 && (
        <span style={styles.roleBadgeOverflow}>+{overflow} more</span>
      )}
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
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
    padding: '10px 14px',
    borderBottom: '0.5px solid #e2e8f0',
    fontSize: '11px',
    fontWeight: 500,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  td: {
    padding: '11px 14px',
    borderBottom: '0.5px solid #f1f5f9',
    verticalAlign: 'middle',
    color: '#111827',
    fontSize: '13px',
  },
  tdEmpty: {
    padding: '28px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '13px',
  },
  dataRow: {
    cursor: 'default',
    transition: 'background 0.1s',
  },
  dataRowActive: {
    background: '#F7F7FD',
  },
  productName: {
    fontWeight: 500,
    fontSize: '13px',
    color: '#111827',
  },
  monoText: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#6b7280',
  },
  actionRow: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  editButton: {
    padding: '4px 10px',
    borderRadius: '8px',
    background: '#f1f5f9',
    color: '#0f172a',
    fontSize: '12px',
    fontWeight: 500,
    textDecoration: 'none',
    border: '0.5px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },
  assignButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 10px',
    borderRadius: '8px',
    background: '#EEEDFE',
    color: '#3C3489',
    fontSize: '12px',
    fontWeight: 500,
    border: '0.5px solid #AFA9EC',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  assignButtonActive: {
    background: '#534AB7',
    color: '#fff',
    border: '0.5px solid #3C3489',
  },
  deleteButton: {
    padding: '4px 10px',
    borderRadius: '8px',
    background: '#fff1f2',
    color: '#be123c',
    fontSize: '12px',
    fontWeight: 500,
    border: '0.5px solid #fecdd3',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  // ── Role badges ────────────────────────────────────────────────────────────
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: '99px',
    background: '#EEEDFE',
    color: '#3C3489',
    fontSize: '11px',
    fontWeight: 500,
    border: '0.5px solid #AFA9EC',
    whiteSpace: 'nowrap',
  },
  roleBadgeOverflow: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: '99px',
    background: '#f1f5f9',
    color: '#6b7280',
    fontSize: '11px',
    fontWeight: 500,
    border: '0.5px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },
  noRolesText: {
    fontSize: '12px',
    color: '#9ca3af',
  },

  // ── Inline popover row ─────────────────────────────────────────────────────
  popoverRow: {
    background: '#F7F7FD',
  },
  popoverCell: {
    padding: 0,
    borderBottom: '0.5px solid #e2e8f0',
  },
  popoverPadding: {
    padding: '12px 16px 16px',
  },
  popoverInner: {
    background: '#fff',
    border: '0.5px solid #AFA9EC',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  popoverHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    borderBottom: '0.5px solid #f1f5f9',
    background: '#FAFAF9',
  },
  popoverHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  popoverIconWrap: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: '#EEEDFE',
    color: '#3C3489',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  popoverTitle: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 500,
    color: '#0f172a',
    lineHeight: 1.3,
  },
  popoverSub: {
    margin: 0,
    fontSize: '11px',
    color: '#6b7280',
    fontFamily: 'monospace',
    lineHeight: 1.4,
  },
  popoverClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    padding: '4px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  popoverLoading: {
    padding: '28px 16px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#9ca3af',
  },
  rolesEmpty: {
    fontSize: '13px',
    color: '#9ca3af',
    textAlign: 'center',
    padding: '20px 0',
  },
  rolesError: {
    margin: '10px 14px 0',
    padding: '8px 12px',
    background: '#fff1f2',
    border: '0.5px solid #fecdd3',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#be123c',
  },
  rolesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '8px',
    padding: '14px',
  },
  roleToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '0.5px solid #e2e8f0',
    background: '#f8fafc',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    transition: 'background 0.12s, border-color 0.12s',
  },
  roleToggleAssigned: {
    background: '#EEEDFE',
    borderColor: '#AFA9EC',
  },
  checkBox: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    border: '0.5px solid #d1d5db',
    background: '#fff',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxChecked: {
    background: '#534AB7',
    borderColor: '#3C3489',
    color: '#fff',
  },
  roleLabel: {
    fontSize: '12px',
    fontWeight: 400,
    color: '#374151',
  },
  roleLabelAssigned: {
    color: '#3C3489',
    fontWeight: 500,
  },
  popoverFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    borderTop: '0.5px solid #f1f5f9',
    background: '#FAFAF9',
  },
  assignedSummary: {
    fontSize: '12px',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  successToast: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#15803d',
    fontWeight: 500,
  },
  footerActions: {
    display: 'flex',
    gap: '8px',
  },
  cancelButton: {
    padding: '5px 12px',
    borderRadius: '8px',
    background: '#f1f5f9',
    color: '#374151',
    fontSize: '12px',
    fontWeight: 500,
    border: '0.5px solid #e2e8f0',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '5px 14px',
    borderRadius: '8px',
    background: '#0f172a',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
  },
  saveButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  // ── Pagination ─────────────────────────────────────────────────────────────
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