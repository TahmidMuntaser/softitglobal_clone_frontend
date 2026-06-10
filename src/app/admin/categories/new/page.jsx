'use client';

import CategoryForm from '../../../../components/admin/CategoryForm';

export default function NewCategoryPage() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>New category</h1>
      <CategoryForm />
    </div>
  );
}

const styles = {
  page: {
    display: 'grid',
    gap: '16px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
  },
};
