'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';

/**
 * AdminUserForm is used for both creating a new admin user and editing an existing one.
 * It mirrors the pattern used by CategoryForm, ProductForm and RoleForm.
 *
 * Props:
 *   - initialUser: object with user data when editing (optional)
 *   - userId: id of the user being edited (optional)
 */
export default function AdminUserForm({ initialUser = null, userId = null }) {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Role assignment is handled on a separate page; no role fetching here.

  // Populate form when editing
  useEffect(() => {
    if (initialUser) {
      setForm({
        username: initialUser.username || '',
        email: initialUser.email || '',
        first_name: initialUser.first_name || '',
        last_name: initialUser.last_name || '',
        password: '', // never pre‑fill password
      });
    }
  }, [initialUser]);

  const submitLabel = useMemo(() => (userId ? 'Update admin user' : 'Create admin user'), [userId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }


  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);

    // Build payload for user creation / update (password only sent on create)
    // Build payload for user creation / update (password only sent on create)
    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
    };

    // Include password only when creating a new user
    if (!userId && form.password) {
      payload.password = form.password;
    }

    try {
      let savedUserId = userId;
      if (userId) {
        // Update existing user
        await api.put(`/api/admin-users/${userId}/`, payload);
      } else {
        // Create new user – API returns the created object
        const { data } = await api.post('/api/admin-users/', payload);
        savedUserId = data.id;
      }


      router.push('/admin/admin-users');
      router.refresh();
    } catch (err) {
      setError('Could not save the admin user.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.grid}>
        <label style={styles.label}>
          <span>Username <span style={{ color: 'red' }}>*</span></span>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
            required
            disabled={!!userId}
          />
        </label>

        <label style={styles.label}>
          <span>Email <span style={{ color: 'red' }}>*</span></span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          <span>First name</span>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          <span>Last name</span>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        {/* Password only shown when creating */}
        {!userId && (
          <label style={styles.label}>
            <span>Password <span style={{ color: 'red' }}>*</span></span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>
        )}

      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.actions}>
        <button type="button" onClick={() => router.back()} style={styles.secondaryButton}>Back</button>
        <button type="submit" style={styles.primaryButton} disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: {
    display: 'grid',
    gap: '16px',
    background: '#fff',
    border: '1px solid #dbe3ee',
    borderRadius: '12px',
    padding: '24px',
  },
  grid: {
    display: 'grid',
    gap: '14px',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
  label: {
    display: 'grid',
    gap: '6px',
    fontSize: '14px',
    color: '#0f172a',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    fontSize: '14px',
  },
  roleContainer: {
    gridColumn: 'span 2',
    marginTop: '8px',
  },
  roleTitle: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: 600,
    color: '#0f172a',
  },
  roleGrid: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    background: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#334155',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
  },
  primaryButton: {
    padding: '11px 16px',
    borderRadius: '8px',
    border: '0',
    background: '#0f172a',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px',
  },
  secondaryButton: {
    padding: '11px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#334155',
    fontWeight: 500,
  },
  error: {
    padding: '10px 12px',
    borderRadius: '8px',
    background: '#fff1f2',
    color: '#be123c',
    border: '1px solid #fecdd3',
    fontSize: '14px',
  },
};
