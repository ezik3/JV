import React from 'react';
import { usePOS } from '../contexts/POSContext';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Orders() {
  const { orders } = usePOS();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', color: '#92400e' };
      case 'preparing': return { bg: '#dbeafe', color: '#1e3a8a' };
      case 'completed': return { bg: '#d1fae5', color: '#065f46' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div style={{ padding: '2rem', background: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 1.5rem 0' }}>Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>No orders yet</p>
          </CardContent>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => {
            const statusStyle = getStatusColor(order.status);
            return (
              <Card key={order.id}>
                <CardContent style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Order #{order.id}</h3>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{order.table}</p>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {order.status}
                    </span>
                  </div>
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0'
                      }}>
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div style={{
                      borderTop: '1px solid #e5e7eb',
                      marginTop: '0.5rem',
                      paddingTop: '0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 'bold',
                      fontSize: '1.125rem'
                    }}>
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
