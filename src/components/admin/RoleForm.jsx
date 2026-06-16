'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, fetchAll } from '../../lib/api';

export default function RoleForm({ initialRole = null, roleId = null }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: '' });
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialRole) {
      setForm({ name: initialRole.name || '' });
      setSelectedPermissions(initialRole.permissions || []);
    }
  }, [initialRole]);

  useEffect(() => {
    fetchAll('/api/permissions/')
      .then(setPermissions)
      .catch(() => setPermissions([]));
  }, []);

  const submitLabel = useMemo(() => {
    return roleId ? 'Update role' : 'Create role';
  }, [roleId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePermissionChange(permId) {
    setSelectedPermissions((prev) => {
      if (prev.includes(permId)) {
        return prev.filter((id) => id !== permId);
      } else {
        return [...prev, permId];
      }
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      name: form.name.trim(),
    };

    try {
      let currentRoleId = roleId;

      if (currentRoleId) {
        // Updated endpoint for editing a role (PUT on the update URL)
        await api.put(`/api/roles/${currentRoleId}/update/`, payload);
      } else {
        const { data } = await api.post('/api/roles/create/', payload);
        currentRoleId = data.id;
      }

      // Update permissions
      if (currentRoleId) {
        try {
          await api.post(`/api/roles/${currentRoleId}/permissions/`, { permissions: selectedPermissions });
        } catch (e) {
          // Fallback if backend expects permission_ids or a raw list
          if (e.response && e.response.status === 400) {
            try {
              await api.post(`/api/roles/${currentRoleId}/permissions/`, { permission_ids: selectedPermissions });
            } catch (e2) {
              await api.post(`/api/roles/${currentRoleId}/permissions/`, selectedPermissions);
            }
          } else {
            throw e;
          }
        }
      }

      router.push('/admin/roles');
      router.refresh();
    } catch (err) {
      setError('Could not save the role.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.grid}>
        <label style={styles.label}>
          <span>Role Name <span style={{ color: 'red' }}>*</span></span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>
      </div>

      <div style={styles.permissionsContainer}>
        <h3 style={styles.permissionsTitle}>Permissions</h3>
        <div style={styles.permissionsGrid}>
          {permissions.map((perm) => (
            <label key={perm.id} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedPermissions.includes(perm.id)}
                onChange={() => handlePermissionChange(perm.id)}
                style={styles.checkbox}
              />
              {perm.name || perm.codename}
            </label>
          ))}
        </div>
      </div>

      {error ? <div style={styles.error}>{error}</div> : null}

      <div style={styles.actions}>
        <button type="button" onClick={() => router.back()} style={styles.secondaryButton}>
          Back
        </button>
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
    gap: '24px',
    background: '#fff',
    border: '1px solid #dbe3ee',
    borderRadius: '12px',
    padding: '24px',
  },
  grid: {
    display: 'grid',
    gap: '14px',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  },
  label: {
    display: 'grid',
    gap: '6px',
    fontSize: '14px',
    color: '#0f172a',
    fontWeight: 500,
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
  permissionsContainer: {
    marginTop: '8px',
  },
  permissionsTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: 600,
    color: '#0f172a',
  },
  permissionsGrid: {
    display: 'grid',
    gap: '10px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    background: '#f8fafc',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#334155',
    cursor: 'pointer',
  },
  checkbox: {
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
