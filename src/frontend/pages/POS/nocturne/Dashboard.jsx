import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import './nocturne.css';

const Dashboard = () => {
  const stats = [
    {
      title: "Today's Sales",
      value: "$2,847.50",
      icon: DollarSign,
      change: "+12.5%",
      changeType: "positive"
    },
    {
      title: "Orders",
      value: "48",
      icon: ShoppingCart,
      change: "+8.2%",
      changeType: "positive"
    },
    {
      title: "Active Tables",
      value: "12/24",
      icon: Users,
      change: "50%",
      changeType: "neutral"
    },
    {
      title: "Avg Order",
      value: "$59.32",
      icon: TrendingUp,
      change: "+4.3%",
      changeType: "positive"
    }
  ];

  const recentOrders = [
    { id: "#1047", table: "Table 12", items: "3 items", total: "$45.50", time: "2m ago", status: "pending" },
    { id: "#1046", table: "Table 8", items: "5 items", total: "$78.25", time: "5m ago", status: "preparing" },
    { id: "#1045", table: "Table 3", items: "2 items", total: "$32.00", time: "8m ago", status: "ready" },
    { id: "#1044", table: "Table 15", items: "4 items", total: "$67.80", time: "12m ago", status: "completed" },
    { id: "#1043", table: "Table 6", items: "6 items", total: "$125.50", time: "15m ago", status: "completed" }
  ];

  const topItems = [
    { name: "Margherita Pizza", orders: 24, revenue: "$432.00" },
    { name: "Caesar Salad", orders: 18, revenue: "$234.00" },
    { name: "Grilled Salmon", orders: 15, revenue: "$397.50" },
    { name: "Pasta Carbonara", orders: 12, revenue: "$228.00" },
    { name: "Tiramisu", orders: 10, revenue: "$85.00" }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      preparing: "bg-blue-100 text-blue-800 border-blue-200",
      ready: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
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
              <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : 'text-muted-foreground'}`}>
                {stat.change} from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Orders */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{order.id}</span>
                      <span className="text-sm text-muted-foreground">{order.table}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{order.items}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{order.total}</div>
                    <div className="text-sm text-muted-foreground">{order.time}</div>
                  </div>
                  <div className="ml-4">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Items */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Top Items Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.orders} orders</div>
                    </div>
                  </div>
                  <div className="font-semibold text-foreground">{item.revenue}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
