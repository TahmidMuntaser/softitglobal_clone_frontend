'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api';
import CategoryForm from '../../../../components/admin/CategoryForm';

export default function EditCategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    api.get(`/api/categories/${params.id}/`).then((response) => {
      setCategory(response.data);
    });
  }, [params.id]);

  if (!category) {
    return <div style={styles.loading}>Loading category...</div>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Edit category</h1>
      <CategoryForm initialCategory={category} categoryId={params.id} />
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
  loading: {
    padding: '16px 0',
  },
};
