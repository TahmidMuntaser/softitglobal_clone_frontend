'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, fetchAll } from '../../../../../lib/api';
import { useParams } from 'next/navigation';

export default function AssignRolesPage() {
  const router = useRouter();
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [assignedRoleIds, setAssignedRoleIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch user details and their assigned roles
        const userData = await api.get(`/api/admin-users/${userId}/`);
        setUser(userData.data);
        setAssignedRoleIds(new Set(userData.data?.groups?.map(group => group.id) || []));

        // Fetch all available roles
        const rolesData = await fetchAll('/api/roles/');
        setAllRoles(rolesData);
      } catch (err) {
        console.error('Failed to load data', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId]);

  const handleRoleChange = (roleId, isChecked) => {
    setAssignedRoleIds((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(roleId);
      } else {
        newSet.delete(roleId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.post(`/api/admin-users/${userId}/roles/`, {
        groups: Array.from(assignedRoleIds),
      });
      alert('Roles assigned successfully!');
      router.push('/admin/admin-users');
    } catch (err) {
      console.error('Failed to assign roles', err);
      setError('Failed to assign roles. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Assign Roles</h1>
        <p>Loading user and roles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Assign Roles</h1>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Assign Roles for {user?.username}</h1>
      <p style={styles.subtitle}>Select the roles to assign to this user.</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.rolesGrid}>
          {allRoles.map((role) => (
            <div key={role.id} style={styles.roleItem}>
              <input
                type="checkbox"
                id={`role-${role.id}`}
                checked={assignedRoleIds.has(role.id)}
                onChange={(e) => handleRoleChange(role.id, e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor={`role-${role.id}`} style={styles.checkboxLabel}>
                {role.name}
              </label>
            </div>
          ))}
        </div>

        {error && <p style={styles.errorText}>{error}</p>}

        <div style={styles.formActions}>
          <button type="button" onClick={() => router.push('/admin/admin-users')} style={styles.secondaryButton}>
            Cancel
          </button>
          <button type="submit" disabled={submitting} style={styles.primaryButton}>
            {submitting ? 'Assigning...' : 'Assign Roles'}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  page: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
  },
  form: {
    marginTop: '30px',
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  rolesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  roleItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  checkbox: {
    marginRight: '10px',
    transform: 'scale(1.2)',
  },
  checkboxLabel: {
    fontSize: '16px',
    color: '#333',
    cursor: 'pointer',
    flexGrow: 1,
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '20px',
    borderTop: '1px solid #eee',
    paddingTop: '20px',
  },
  primaryButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  primaryButtonHover: {
    backgroundColor: '#0056b3',
  },
  secondaryButtonHover: {
    backgroundColor: '#545b62',
  },
  errorText: {
    color: '#dc3545',
    marginBottom: '15px',
    textAlign: 'center',
  },
};
