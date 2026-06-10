'use client';

import ProductForm from '../../../../components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>New product</h1>
      <ProductForm />
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
