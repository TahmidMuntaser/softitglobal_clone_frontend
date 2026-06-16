'use client';

import RoleForm from '../../../../components/admin/RoleForm';

export default function NewRolePage() {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>New Role</h1>
        <p style={styles.subtitle}>Create a new role.</p>
      </div>

      <RoleForm />
    </div>
  );
}

const styles = {
  page: {
    display: 'grid',
    gap: '20px',
  },
  header: {
    display: 'grid',
    gap: '4px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 600,
    color: '#0f172a',
  },
  subtitle: {
    margin: 0,
    fontSize: '15px',
    color: '#64748b',
  },
};
