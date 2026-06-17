 'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api';
import AdminUserForm from '../../../../components/admin/AdminUserForm';


export default function EditAdminUserPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await api.get(`/api/admin-users/${id}/`);
        setUser(response.data);
      } catch (err) {
        console.error('Failed to load admin user', err);
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    }
    if (id) loadUser();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Edit Admin User</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Edit Admin User</h1>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Edit Admin User</h1>
      <AdminUserForm initialUser={user} userId={id} />
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
    marginBottom: '20px',
    color: '#333',
  },
  error: {
    color: '#dc3545',
  },
};