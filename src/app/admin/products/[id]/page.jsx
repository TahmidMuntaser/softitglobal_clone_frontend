'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api';
import ProductForm from '../../../../components/admin/ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/api/products/${params.id}/`).then((response) => {
      setProduct(response.data);
    });
  }, [params.id]);

  if (!product) {
    return <div style={styles.loading}>Loading product...</div>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Edit product</h1>
      <ProductForm initialProduct={product} productId={params.id} />
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
