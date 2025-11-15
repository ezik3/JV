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
    <div style={{ padding: '2rem', background: '#f7fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Dashboard
        </h1>
        <p style={{ color: '#64748b' }}>Welcome back to Nocturne POS</p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat) => (
          <Card key={stat.title} style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
          }}>
            <CardHeader style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.5rem'
            }}>
              <CardTitle style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>
                {stat.title}
              </CardTitle>
              <span style={{ fontSize: '1.25rem' }}>{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{stat.value}</div>
              <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>
                {stat.trend} from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders & Top Items */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: '500' }}>Order #{order.id}</p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Table {order.table}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '600' }}>${order.total}</p>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      background: 'rgba(102, 126, 234, 0.2)',
                      color: '#667eea'
                    }}>
                      Preparing
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Items */}
        <Card>
          <CardHeader>
            <CardTitle>Top Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {topItems.map((item, i) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{item}</span>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {24 - i * 3} sold
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
