'use client';

import React, { useEffect, useState } from 'react';
import { api, fetchAll } from '../../../lib/api';

const STATUS_OPTIONS = ['pending', 'delivered'];

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: '#9ca3af', flexShrink: 0 }}
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    fetchAll('/api/orders/')
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const statusCounts = {
    All: orders.length,
    Pending: orders.filter((o) => (o._nextStatus || o.status || o.order_status) === 'pending').length,
    Delivered: orders.filter((o) => (o._nextStatus || o.status || o.order_status) === 'delivered').length,
  };

  const filteredOrders = orders.filter((o) => {
    if (filter !== 'All') {
      const s = o._nextStatus || o.status || o.order_status;
      if (s !== filter.toLowerCase()) return false;
    }
    if (searchTerm.trim() === '') return true;
    const term = searchTerm.trim().toLowerCase();
    const customerName =
      o.user?.username ||
      o.customer?.name ||
      o.customer_name ||
      o.email ||
      '';
    const phone = o.phone || o.customer?.phone || '';
    return (
      customerName.toLowerCase().includes(term) ||
      phone.toString().toLowerCase().includes(term)
    );
  });

  async function handleStatusSave(order) {
    const nextStatus = order._nextStatus || order.status || order.order_status || 'pending';
    setSavingId(order.id);
    try {
      await api.patch(`/api/orders/${order.id}/`, { status: nextStatus });
      setOrders((prev) =>
        prev.map((item) =>
          item.id === order.id ? { ...item, status: nextStatus, _nextStatus: undefined } : item
        )
      );
    } finally {
      setSavingId(null);
    }
  }

  function updateOrderStatus(id, value) {
    setOrders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, _nextStatus: value } : item))
    );
  }

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>Manage and update order statuses</p>
        </div>
      </div>

      {/* Search Bar — full width, standalone row */}
      <div
        style={{
          ...styles.searchRow,
          ...(searchFocused ? styles.searchRowFocused : {}),
        }}
      >
        <SearchIcon />
        <input
          type="text"
          placeholder="Search by customer name or phone number…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={styles.searchInput}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            style={styles.searchClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={styles.tabRow}>
        {['All', 'Pending', 'Delivered'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            style={filter === tab ? styles.activeTab : styles.inactiveTab}
          >
            {tab}
            <span
              style={{
                ...styles.badge,
                ...(tab === 'Pending' ? styles.badgePending :
                    tab === 'Delivered' ? styles.badgeDelivered :
                    styles.badgeAll),
              }}
            >
              {statusCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <colgroup>
            <col style={{ width: '40px' }} />
            <col style={{ width: '100px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '100px' }} />
            <col style={{ width: '90px' }} />
            <col style={{ width: '130px' }} />
            <col style={{ width: '80px' }} />
          </colgroup>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}></th>
              <th style={styles.th}>Order</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td style={styles.tdEmpty} colSpan={8}>Loading...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td style={styles.tdEmpty} colSpan={8}>No orders found.</td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const currentStatus = order._nextStatus || order.status || order.order_status || 'pending';
                const customer =
                  order.user?.username ||
                  order.customer?.name ||
                  order.customer_name ||
                  order.email ||
                  '-';
                const phone = order.phone || order.customer?.phone;
                const isExpanded = expandedId === order.id;
                const isSaving = savingId === order.id;
                const options = Array.from(new Set([currentStatus, ...STATUS_OPTIONS].filter(Boolean)));

                return (
                  <React.Fragment key={order.id}>
                    <tr style={styles.dataRow}>
                      <td style={styles.td}>
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : order.id)}
                          style={styles.expandButton}
                        >
                          {isExpanded ? '▲' : '▼'}
                        </button>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.orderId}>{order.id}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.custName}>{customer}</div>
                        {phone && <div style={styles.custPhone}>{phone}</div>}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.address}>{order.address || order.customer?.address || '-'}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.dateText}>
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.amountText}>
                          {order.total_amount ? `৳${parseFloat(order.total_amount).toLocaleString()}` : '-'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <select
                          value={currentStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={styles.select}
                        >
                          {options.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td style={styles.td}>
                        <button
                          type="button"
                          onClick={() => handleStatusSave(order)}
                          style={styles.saveButton}
                          disabled={isSaving}
                        >
                          {isSaving ? 'Saving…' : 'Save'}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan={8} style={{ padding: 0, borderBottom: '0.5px solid #e2e8f0' }}>
                          <div style={styles.detailOuter}>

                            <div style={styles.detailSectionLabel}>
                              Order items · {order.items?.length || 0} product{order.items?.length !== 1 ? 's' : ''}
                            </div>

                            <div style={styles.itemsCard}>
                              <div style={styles.itemsHeader}>
                                <span style={{ flex: 1 }}>Product</span>
                                <span style={styles.itemsHeaderRight}>Qty</span>
                                <span style={styles.itemsHeaderRight}>Subtotal</span>
                              </div>
                              {order.items?.length ? (
                                order.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      ...styles.itemRow,
                                      borderBottom: idx < order.items.length - 1
                                        ? '0.5px solid #e2e8f0'
                                        : 'none',
                                    }}
                                  >
                                    <span style={{ flex: 1 }}>{item.product?.name || '-'}</span>
                                    <span style={styles.itemQty}>× {item.quantity}</span>
                                    <span style={styles.itemPrice}>
                                      ৳{item.price_snapshot
                                        ? (parseFloat(item.price_snapshot) * item.quantity).toLocaleString()
                                        : '-'}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div style={styles.itemRow}>
                                  <span style={{ color: '#9ca3af' }}>No items</span>
                                </div>
                              )}
                              {order.total_amount && (
                                <div style={styles.itemsTotalRow}>
                                  <span style={styles.itemsTotalLabel}>Total</span>
                                  <span style={styles.itemsTotalValue}>
                                    ৳{parseFloat(order.total_amount).toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div style={styles.detailFooter}>
                              <span
                                style={
                                  currentStatus === 'delivered'
                                    ? styles.pillDelivered
                                    : styles.pillPending
                                }
                              >
                                <span
                                  style={
                                    currentStatus === 'delivered'
                                      ? styles.dotDelivered
                                      : styles.dotPending
                                  }
                                />
                                {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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

  /* Header */
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    margin: 0,
    fontSize: '36px',
    fontWeight: 500,
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '17px',
    color: '#6b7280',
  },

  /* Search bar — full-width standalone row */
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#fff',
    borderWidth: '0.5px',
    borderStyle: 'solid',
    borderColor: '#d1d5db',
    borderRadius: '12px',
    padding: '0 14px',
    height: '44px',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  searchRowFocused: {
    borderColor: '#6b7280',
    boxShadow: '0 0 0 3px rgba(0,0,0,0.06)',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '14px',
    color: '#111827',
    fontFamily: 'inherit',
  },
  searchClear: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    fontSize: '13px',
    padding: '2px 4px',
    borderRadius: '4px',
    lineHeight: 1,
    flexShrink: 0,
  },

  /* Tabs */
  tabRow: {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    background: '#f1f5f9',
    borderRadius: '10px',
    width: 'fit-content',
  },
  activeTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#fff',
    color: '#111827',
    border: '0.5px solid #e2e8f0',
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '16px',
  },
  inactiveTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'transparent',
    color: '#6b7280',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 400,
    fontSize: '16px',
  },
  badge: {
    borderRadius: '999px',
    padding: '2px 7px',
    fontSize: '16px',
    fontWeight: 500,
  },
  badgeAll: {
    background: '#dbeafe',
    color: '#1e40af',
  },
  badgePending: {
    background: '#FAEEDA',
    color: '#633806',
  },
  badgeDelivered: {
    background: '#EAF3DE',
    color: '#27500A',
  },

  /* Table */
  tableWrap: {
    background: '#fff',
    border: '0.5px solid #e2e8f0',
    borderRadius: '12px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
    fontSize: '13px',
  },
  theadRow: {
    background: '#f8fafc',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: '0.5px solid #e2e8f0',
    fontSize: '12px',
    fontWeight: 500,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  td: {
    padding: '11px 12px',
    borderBottom: '0.5px solid #f1f5f9',
    verticalAlign: 'middle',
    color: '#111827',
    fontSize: '14px',
  },
  tdEmpty: {
    padding: '28px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '13px',
  },
  dataRow: {
    cursor: 'default',
  },

  /* Table cell content */
  orderId: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#6b7280',
  },
  custName: {
    fontWeight: 500,
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  custPhone: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '2px',
  },
  address: {
    fontSize: '13px',
    color: '#111827',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dateText: {
    fontSize: '13px',
    color: '#6b7280',
  },
  amountText: {
    fontWeight: 500,
    fontSize: '14px',
  },
  select: {
    width: '100%',
    padding: '5px 8px',
    borderRadius: '8px',
    border: '0.5px solid #d1d5db',
    background: '#fff',
    color: '#111827',
    fontSize: '13px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '5px 12px',
    borderRadius: '8px',
    border: 'none',
    background: '#0f172a',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  expandButton: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    border: '0.5px solid #e2e8f0',
    background: '#f8fafc',
    color: '#6b7280',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
  },

  /* Expanded detail panel */
  detailOuter: {
    padding: '12px 16px 14px 52px',
    background: '#f8fafc',
  },
  detailSectionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 500,
    color: '#6b7280',
    marginBottom: '10px',
  },
  itemsCard: {
    background: '#fff',
    border: '0.5px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  itemsHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 10px',
    background: '#f8fafc',
    borderBottom: '0.5px solid #e2e8f0',
    fontSize: '11px',
    fontWeight: 500,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    gap: '16px',
  },
  itemsHeaderRight: {
    width: '70px',
    textAlign: 'right',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '8px 10px',
    fontSize: '13px',
  },
  itemQty: {
    width: '70px',
    textAlign: 'right',
    color: '#6b7280',
    fontSize: '12px',
  },
  itemPrice: {
    width: '70px',
    textAlign: 'right',
    fontWeight: 500,
    fontSize: '13px',
  },
  itemsTotalRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '16px',
    padding: '8px 10px',
    borderTop: '0.5px solid #e2e8f0',
  },
  itemsTotalLabel: {
    fontSize: '12px',
    color: '#6b7280',
  },
  itemsTotalValue: {
    fontSize: '14px',
    fontWeight: 500,
    width: '70px',
    textAlign: 'right',
  },
  detailFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '10px',
  },

  /* Status pills */
  pillPending: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '11px',
    fontWeight: 500,
    padding: '3px 9px',
    borderRadius: '999px',
    background: '#FAEEDA',
    color: '#633806',
  },
  pillDelivered: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '11px',
    fontWeight: 500,
    padding: '3px 9px',
    borderRadius: '999px',
    background: '#EAF3DE',
    color: '#27500A',
  },
  dotPending: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    display: 'inline-block',
    background: '#854F0B',
    flexShrink: 0,
  },
  dotDelivered: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    display: 'inline-block',
    background: '#3B6D11',
    flexShrink: 0,
  },
};