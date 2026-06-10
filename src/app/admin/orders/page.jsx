'use client';

import { useEffect, useState } from 'react';
import { api, fetchAll } from '../../../lib/api';

const STATUS_OPTIONS = ['pending', 'delivered'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchAll('/api/orders/')
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusSave(order) {
    const nextStatus = order._nextStatus || order.status || order.order_status || 'pending';
    setSavingId(order.id);

    try {
      await api.patch(`/api/orders/${order.id}/`, { status: nextStatus });
      setOrders((prev) =>
        prev.map((item) =>
          item.id === order.id ? { ...item, status: nextStatus } : item
        )
      );
    } finally {
      setSavingId(null);
    }
  }

  function updateOrderStatus(id, value) {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, _nextStatus: value } : item
      )
    );
  }

  return (
    <div style={styles.page}>
      <div>
        <h1 style={styles.title}>Orders</h1>
        <p style={styles.subtitle}>Update status directly from the API.</p>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td style={styles.td} colSpan={4}>
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td style={styles.td} colSpan={4}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const currentStatus = order._nextStatus || order.status || order.order_status || 'pending';
                const customer =
                  order.user?.username ||
                  order.customer?.name ||
                  order.customer_name ||
                  order.email ||
                  '-';

                const options = Array.from(
                  new Set([currentStatus, ...STATUS_OPTIONS].filter(Boolean))
                );

                return (
                  <tr key={order.id}>
                    <td style={styles.td}>{order.id}</td>
                    <td style={styles.td}>
                      <select
                        value={currentStatus}
                        onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                        style={styles.input}
                      >
                        {options.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={styles.td}>{customer}</td>
                    <td style={styles.td}>
                      <button
                        type="button"
                        onClick={() => handleStatusSave(order)}
                        style={styles.primaryButton}
                        disabled={savingId === order.id}
                      >
                        {savingId === order.id ? 'Saving...' : 'Save'}
                      </button>
                      {/* <details style={styles.details}> */}
                        {/* <summary style={styles.summary}>View raw</summary> */}
                        {/* <pre style={styles.pre}>{JSON.stringify(order, null, 2)}</pre> */}
                       {/* </details> */}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
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
  subtitle: {
    margin: '6px 0 0',
    color: '#475569',
  },
  tableWrap: {
    background: '#fff',
    border: '1px solid #dbe3ee',
    borderRadius: '12px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 14px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '14px',
  },
  td: {
    padding: '12px 14px',
    borderBottom: '1px solid #eef2f7',
    verticalAlign: 'top',
  },
  input: {
    width: '100%',
    maxWidth: '180px',
    boxSizing: 'border-box',
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    background: '#fff',
  },
  primaryButton: {
    padding: '8px 10px',
    borderRadius: '8px',
    border: '0',
    background: '#0f172a',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  details: {
    marginTop: '8px',
  },
  summary: {
    cursor: 'pointer',
    color: '#1d4ed8',
  },
  pre: {
    margin: '8px 0 0',
    maxWidth: '420px',
    overflow: 'auto',
    background: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '12px',
  },
};
