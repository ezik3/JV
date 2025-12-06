import React, { useState } from 'react';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Plus, PackagePlus, AlertTriangle } from 'lucide-react';
import './nocturne.css';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const inventoryItems = [
    { sku: "SKU001", name: "Tomatoes", quantity: 50, unit: "kg", lowThreshold: 20, status: "ok" },
    { sku: "SKU002", name: "Chicken Breast", quantity: 15, unit: "kg", lowThreshold: 25, status: "low" },
    { sku: "SKU003", name: "Pasta", quantity: 100, unit: "kg", lowThreshold: 30, status: "ok" },
    { sku: "SKU004", name: "Mozzarella Cheese", quantity: 8, unit: "kg", lowThreshold: 15, status: "critical" },
    { sku: "SKU005", name: "Olive Oil", quantity: 25, unit: "L", lowThreshold: 10, status: "ok" },
    { sku: "SKU006", name: "Flour", quantity: 45, unit: "kg", lowThreshold: 20, status: "ok" },
    { sku: "SKU007", name: "Fresh Basil", quantity: 5, unit: "kg", lowThreshold: 8, status: "critical" },
    { sku: "SKU008", name: "Ground Beef", quantity: 22, unit: "kg", lowThreshold: 20, status: "ok" },
    { sku: "SKU009", name: "Lettuce", quantity: 18, unit: "kg", lowThreshold: 15, status: "ok" },
    { sku: "SKU010", name: "Salmon Fillet", quantity: 12, unit: "kg", lowThreshold: 18, status: "low" },
    { sku: "SKU011", name: "Coffee Beans", quantity: 8, unit: "kg", lowThreshold: 12, status: "low" },
    { sku: "SKU012", name: "Milk", quantity: 35, unit: "L", lowThreshold: 20, status: "ok" },
    { sku: "SKU013", name: "Eggs", quantity: 150, unit: "pcs", lowThreshold: 100, status: "ok" },
    { sku: "SKU014", name: "Butter", quantity: 20, unit: "kg", lowThreshold: 15, status: "ok" },
    { sku: "SKU015", name: "Onions", quantity: 40, unit: "kg", lowThreshold: 25, status: "ok" },
    { sku: "SKU016", name: "Potatoes", quantity: 60, unit: "kg", lowThreshold: 30, status: "ok" }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      ok: {
        badge: "bg-green-100 text-green-800 border-green-200",
        label: "In Stock"
      },
      low: {
        badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Low Stock"
      },
      critical: {
        badge: "bg-red-100 text-red-800 border-red-200",
        label: "Critical"
      }
    };
    return configs[status] || configs.ok;
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: inventoryItems.length,
    ok: inventoryItems.filter(i => i.status === "ok").length,
    low: inventoryItems.filter(i => i.status === "low").length,
    critical: inventoryItems.filter(i => i.status === "critical").length
  };

  return (
    <Layout>
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage your stock levels</p>
        </div>
        <Button className="neon-glow gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass border-border">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Items</div>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="glass border-border">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">In Stock</div>
            <div className="text-2xl font-bold text-green-600">{stats.ok}</div>
          </CardContent>
        </Card>
        <Card className="glass border-border">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Low Stock</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.low}</div>
          </CardContent>
        </Card>
        <Card className="glass border-border">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Critical</div>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="glass border-border">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name or SKU..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? "default" : "outline"}
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? "neon-glow" : ""}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'ok' ? "default" : "outline"}
                onClick={() => setFilterStatus('ok')}
                className={filterStatus === 'ok' ? "neon-glow" : ""}
              >
                In Stock
              </Button>
              <Button
                variant={filterStatus === 'low' ? "default" : "outline"}
                onClick={() => setFilterStatus('low')}
                className={filterStatus === 'low' ? "neon-glow" : ""}
              >
                Low
              </Button>
              <Button
                variant={filterStatus === 'critical' ? "default" : "outline"}
                onClick={() => setFilterStatus('critical')}
                className={filterStatus === 'critical' ? "neon-glow" : ""}
              >
                Critical
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="glass border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Inventory Items ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">SKU</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Item Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Low Threshold</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => {
                  const statusConfig = getStatusConfig(item.status);
                  return (
                    <tr
                      key={item.sku}
                      className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                        index % 2 === 0 ? 'bg-secondary/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-foreground">{item.sku}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {item.status === "critical" && (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium text-foreground">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${
                          item.status === "critical" ? "text-red-600" :
                          item.status === "low" ? "text-yellow-600" :
                          "text-foreground"
                        }`}>
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {item.lowThreshold} {item.unit}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusConfig.badge}>
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm" className="gap-1">
                          <PackagePlus className="h-4 w-4" />
                          Adjust
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredItems.length === 0 && (
        <Card className="glass border-border">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No inventory items found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
    </Layout>
  );
};
export default Inventory;
