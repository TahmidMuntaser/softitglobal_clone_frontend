'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredTokens, loginWithCredentials } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tokens = getStoredTokens();
    if (tokens.access) {
      router.replace('/admin/products');
    }
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithCredentials(username, password);
      router.replace('/admin/products');
    } catch (err) {
      setError('Login failed. Check your username and password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Admin login</h1>
        <p style={styles.subtitle}>Use the Django superuser account.</p>

        <label style={styles.label}>
          Username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            style={styles.input}
            autoComplete="username"
            required
          />
        </label>

        <label style={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={styles.input}
            autoComplete="current-password"
            required
          />
        </label>

        {error ? <div style={styles.error}>{error}</div> : null}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: '#f5f7fb',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#fff',
    border: '1px solid #dbe3ee',
    borderRadius: '12px',
    padding: '24px',
    display: 'grid',
    gap: '14px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
  },
  subtitle: {
    margin: 0,
    color: '#475569',
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
    padding: '11px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
  },
  error: {
    padding: '10px 12px',
    borderRadius: '8px',
    background: '#fff1f2',
    color: '#be123c',
    border: '1px solid #fecdd3',
  },
  button: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '0',
    background: '#0f172a',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
