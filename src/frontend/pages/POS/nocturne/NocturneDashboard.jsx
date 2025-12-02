import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { DollarSign, ShoppingCart, Users, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import './nocturne-pos.css';

const NocturneDashboard = () => {
  const stats = [
    {
      title: "Today's Sales",
      value: "$2,543.00",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: "48",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Active Tables",
      value: "12",
      change: "-2",
      trend: "down",
      icon: Users,
    },
    {
      title: "Average Order",
      value: "$52.98",
      change: "+4.3%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  const recentOrders = [
    { id: 1, table: "Table 7", amount: "$45.50", status: "Preparing" },
    { id: 2, table: "Table 3", amount: "$78.20", status: "Preparing" },
    { id: 3, table: "Table 12", amount: "$123.00", status: "Preparing" },
    { id: 4, table: "Table 5", amount: "$92.30", status: "Preparing" },
    { id: 5, table: "Table 9", amount: "$67.80", status: "Preparing" },
  ];

  const topItems = [
    { name: "Signature Cocktail", sales: 45 },
    { name: "Club Sandwich", sales: 38 },
    { name: "Caesar Salad", sales: 32 },
    { name: "Craft Beer", sales: 56 },
    { name: "Nachos Supreme", sales: 28 },
  ];

  return (
    <div className="nocturne-pos p-6 space-y-6">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl font-bold text-white neon-text">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome to JV POS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 fade-in">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-indigo-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="flex items-center text-xs mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="text-gray-400 ml-1">from yesterday</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="glass fade-in">
          <CardHeader>
            <CardTitle className="text-white">Recent Orders</CardTitle>
            <CardDescription className="text-gray-400">
              Latest orders from your venue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg glass hover:glass-strong transition-all"
                >
                  <div>
                    <p className="font-medium text-white">{order.table}</p>
                    <p className="text-sm text-gray-400">{order.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-indigo-400">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Items */}
        <Card className="glass fade-in">
          <CardHeader>
            <CardTitle className="text-white">Top Items</CardTitle>
            <CardDescription className="text-gray-400">
              Most popular items today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg glass hover:glass-strong transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400 font-semibold">
                      {index + 1}
                    </div>
                    <p className="font-medium text-white">{item.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">{item.sales} sold</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NocturneDashboard;
