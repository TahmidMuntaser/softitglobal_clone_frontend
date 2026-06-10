'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, fetchAll } from '../../lib/api';
import { slugify } from '../../lib/slug';

const emptyProduct = {
  name: '',
  slug: '',
  price: '',
  image_url: '',
  category_id: '',
};

function resolveCategoryId(product) {
  if (!product) return '';

  if (typeof product.category === 'object') {
    return product.category?.id || '';
  }

  return product.category_id || product.category || '';
}

export default function ProductForm({ initialProduct = null, productId = null }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyProduct);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [slugAuto, setSlugAuto] = useState(true);

  useEffect(() => {
    if (initialProduct) {
      const initialName = initialProduct.name || '';
      const initialSlug = initialProduct.slug || '';

      setForm({
        name: initialName,
        slug: initialSlug,
        price:
          initialProduct.price === undefined || initialProduct.price === null
            ? ''
            : String(initialProduct.price),
        image_url: initialProduct.image_url || '',
        category_id: resolveCategoryId(initialProduct),
      });

      setSlugAuto(!initialSlug || initialSlug === slugify(initialName));
      return;
    }

    setSlugAuto(true);
  }, [initialProduct]);

  useEffect(() => {
    fetchAll('/api/categories/')
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const submitLabel = useMemo(() => {
    return productId ? 'Update product' : 'Create product';
  }, [productId]);

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === 'name') {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: slugAuto ? slugify(value) : prev.slug,
      }));
      return;
    }

    if (name === 'slug') {
      setSlugAuto(false);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      price: form.price,
      image_url: form.image_url.trim(),
      category_id: form.category_id || null,
    };

    try {
      if (productId) {
        await api.patch(`/api/products/${productId}/`, payload);
      } else {
        await api.post('/api/products/', payload);
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError('Could not save the product.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.grid}>
        <label style={styles.label}>
          <span>Name <span style={{ color: 'red' }}>*</span></span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          <span>Slug <span style={{ color: 'red' }}>*</span></span>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            style={styles.input}
            required
          />
          {/* <span style={styles.helperText}>Auto-generated from the name, but you can edit it.</span> */}
        </label>

        <label style={styles.label}>
          <span>Price <span style={{ color: 'red' }}>*</span></span>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          <span>Image URL <span style={{ color: 'red' }}>*</span></span>
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          <span>Category <span style={{ color: 'red' }}>*</span></span>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
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
    gap: '16px',
    background: '#fff',
    border: '1px solid #dbe3ee',
    borderRadius: '12px',
    padding: '20px',
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
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  primaryButton: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: '0',
    background: '#0f172a',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    cursor: 'pointer',
  },
  error: {
    padding: '10px 12px',
    borderRadius: '8px',
    background: '#fff1f2',
    color: '#be123c',
    border: '1px solid #fecdd3',
  },
  helperText: {
    fontSize: '12px',
    color: '#64748b',
  },
};
