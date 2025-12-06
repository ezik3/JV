import React from 'react';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DollarSign, ShoppingCart, Users, TrendingUp, Clock } from 'lucide-react';
import './nocturne.css';

const Analytics = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      changeType: "positive",
      icon: DollarSign,
      description: "from last month"
    },
    {
      title: "Orders",
      value: "2,350",
      change: "+180",
      changeType: "positive",
      icon: ShoppingCart,
      description: "from last month"
    },
    {
      title: "Customers",
      value: "1,245",
      change: "+15%",
      changeType: "positive",
      icon: Users,
      description: "from last month"
    },
    {
      title: "Avg Order Value",
      value: "$52.40",
      change: "+2.5%",
      changeType: "positive",
      icon: TrendingUp,
      description: "from last month"
    }
  ];

  const weeklyPerformance = [
    { day: "Mon", revenue: 2400, orders: 45 },
    { day: "Tue", revenue: 3200, orders: 58 },
    { day: "Wed", revenue: 2800, orders: 52 },
    { day: "Thu", revenue: 3800, orders: 68 },
    { day: "Fri", revenue: 5200, orders: 92 },
    { day: "Sat", revenue: 6800, orders: 118 },
    { day: "Sun", revenue: 5400, orders: 95 }
  ];

  const peakHours = [
    { hour: "11:00", orders: 12 },
    { hour: "12:00", orders: 28 },
    { hour: "13:00", orders: 35 },
    { hour: "14:00", orders: 22 },
    { hour: "18:00", orders: 18 },
    { hour: "19:00", orders: 42 },
    { hour: "20:00", orders: 48 },
    { hour: "21:00", orders: 31 }
  ];

  const revenueByCategory = [
    { category: "Main Course", revenue: 18500, percentage: 45 },
    { category: "Appetizers", revenue: 9800, percentage: 24 },
    { category: "Beverages", revenue: 7400, percentage: 18 },
    { category: "Desserts", revenue: 5300, percentage: 13 }
  ];

  const maxRevenue = Math.max(...weeklyPerformance.map(d => d.revenue));
  const maxOrders = Math.max(...peakHours.map(h => h.orders));

  return (
    <Layout>
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track your business performance and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glass border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Weekly Performance */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyPerformance.map((day) => (
                <div key={day.day} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{day.day}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{day.orders} orders</span>
                      <span className="font-semibold text-foreground">${day.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all"
                      style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Peak Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {peakHours.map((hour) => (
                <div key={hour.hour} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{hour.hour}</span>
                    <span className="font-semibold text-foreground">{hour.orders} orders</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-green-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${(hour.orders / maxOrders) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Category */}
      <Card className="glass border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueByCategory.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">{item.category}</span>
                    <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <span className="font-bold text-foreground">${item.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Items */}
      <Card className="glass border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Top Performing Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Item</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Orders</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Revenue</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: 1, item: "Margherita Pizza", orders: 156, revenue: 2808, avgPrice: 18.00 },
                  { rank: 2, item: "Grilled Salmon", orders: 128, revenue: 3392, avgPrice: 26.50 },
                  { rank: 3, item: "Caesar Salad", orders: 98, revenue: 1274, avgPrice: 13.00 },
                  { rank: 4, item: "Pasta Carbonara", orders: 87, revenue: 1653, avgPrice: 19.00 },
                  { rank: 5, item: "Steak", orders: 72, revenue: 2304, avgPrice: 32.00 }
                ].map((item, index) => (
                  <tr
                    key={item.rank}
                    className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                      index % 2 === 0 ? 'bg-secondary/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {item.rank}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">{item.item}</td>
                    <td className="py-3 px-4 text-foreground">{item.orders}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">${item.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-muted-foreground">${item.avgPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
    </Layout>
  );
};
export default Analytics;
