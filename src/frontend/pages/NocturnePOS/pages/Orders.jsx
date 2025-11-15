import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { usePOS } from '../contexts/POSContext';

export default function Orders() {
  const { orders } = usePOS();

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { background: 'rgba(234, 179, 8, 0.2)', color: '#eab308' };
      case "preparing":
        return { background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' };
      case "completed":
        return { background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' };
      default:
        return { background: '#e2e8f0', color: '#64748b' };
    }
  };

  return (
    <div style={{ padding: '2rem', background: '#f7fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Orders
        </h1>
        <p style={{ color: '#64748b' }}>Manage all venue orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '1rem', fontWeight: '600' }}>Order #</th>
                  <th style={{ padding: '1rem', fontWeight: '600' }}>Table</th>
                  <th style={{ padding: '1rem', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '1rem', fontWeight: '600' }}>Items</th>
                  <th style={{ padding: '1rem', fontWeight: '600' }}>Total</th>
                  <th style={{ padding: '1rem', fontWeight: '600' }}>Time</th>
                  <th style={{ padding: '1rem', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '1rem', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: '600' }}>
                        #{order.id.substring(order.id.length - 4)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        Table {order.tableNumber}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {order.customerName}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>
                        {order.items.length} items
                      </td>
                      <td style={{ padding: '1rem', fontWeight: '600', color: '#667eea' }}>
                        ${order.total.toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                            ...getStatusStyle(order.status)
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            color: '#64748b',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onClick={() => alert(`View details for order ${order.id}`)}
                        >
                          👁️ View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
