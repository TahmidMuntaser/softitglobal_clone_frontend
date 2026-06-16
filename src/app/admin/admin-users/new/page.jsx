'use client';

import AdminUserForm from '../../../../components/admin/AdminUserForm';

export default function NewAdminUserPage() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Create New Admin User</h1>
      <AdminUserForm />
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
};