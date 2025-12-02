import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Search, Eye, Filter } from 'lucide-react';
import './nocturne.css';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const orders = [
    { id: "#1047", table: "Table 12", items: "3 items", total: "$45.50", time: "14:32", status: "pending" },
    { id: "#1046", table: "Table 8", items: "5 items", total: "$78.25", time: "14:28", status: "preparing" },
    { id: "#1045", table: "Table 3", items: "2 items", total: "$32.00", time: "14:25", status: "ready" },
    { id: "#1044", table: "Table 15", items: "4 items", total: "$67.80", time: "14:20", status: "completed" },
    { id: "#1043", table: "Table 6", items: "6 items", total: "$125.50", time: "14:17", status: "completed" },
    { id: "#1042", table: "Table 9", items: "3 items", total: "$54.20", time: "14:12", status: "completed" },
    { id: "#1041", table: "Table 2", items: "4 items", total: "$89.00", time: "14:08", status: "preparing" },
    { id: "#1040", table: "Table 11", items: "2 items", total: "$38.50", time: "14:05", status: "ready" },
    { id: "#1039", table: "Table 7", items: "5 items", total: "$112.75", time: "14:00", status: "completed" },
    { id: "#1038", table: "Table 14", items: "3 items", total: "$67.30", time: "13:55", status: "completed" },
    { id: "#1037", table: "Table 5", items: "4 items", total: "$92.40", time: "13:50", status: "completed" },
    { id: "#1036", table: "Table 1", items: "2 items", total: "$41.00", time: "13:45", status: "pending" }
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.table.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage and track all orders</p>
        </div>
        <Button className="neon-glow">
          New Order
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card className="glass border-border">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by order # or table..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {statusOptions.map(option => (
                <Button
                  key={option.value}
                  variant={filterStatus === option.value ? "default" : "outline"}
                  onClick={() => setFilterStatus(option.value)}
                  className={filterStatus === option.value ? "neon-glow" : ""}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="glass border-border">
        <CardHeader>
          <CardTitle className="text-foreground">All Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Order #</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Table</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Items</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                      index % 2 === 0 ? 'bg-secondary/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground">{order.id}</span>
                    </td>
                    <td className="py-3 px-4 text-foreground">{order.table}</td>
                    <td className="py-3 px-4 text-muted-foreground">{order.items}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground">{order.total}</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{order.time}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
