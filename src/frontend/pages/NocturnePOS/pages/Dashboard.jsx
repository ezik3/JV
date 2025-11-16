import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Dashboard() {
  const stats = [
    { title: "Today's Sales", value: "$2,543.00", icon: "💵", trend: "+12.5%" },
    { title: "Orders", value: "48", icon: "🛒", trend: "+8.2%" },
    { title: "Active Tables", value: "12", icon: "👥", trend: "+3" },
    { title: "Avg. Order", value: "$52.98", icon: "📈", trend: "+5.3%" },
  ];

  const recentOrders = [1, 2, 3, 4, 5].map(i => ({
    id: 1000 + i,
    table: i,
    total: (45 + i * 10).toFixed(2)
  }));

  const topItems = [
    'Signature Cocktail',
    'House Wine',
    'Premium Beer',
    'Appetizer Platter',
    'Dessert Special'
  ];

  return (
    <div style={{ padding: '2rem', background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Dashboard</h1>
        <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0' }}>Welcome to Nocturne POS</p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => (
          <Card key={index} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none'
          }}>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>{stat.title}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{stat.value}</p>
                  <p style={{ fontSize: '0.875rem', opacity: 0.8, margin: '0.25rem 0 0 0' }}>{stat.trend}</p>
                </div>
                <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentOrders.map(order => (
                <div key={order.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: '#f9fafb',
                  borderRadius: '6px'
                }}>
                  <span>Order #{order.id} - Table {order.table}</span>
                  <span style={{ fontWeight: '600' }}>${order.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topItems.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: '#f9fafb',
                  borderRadius: '6px'
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
