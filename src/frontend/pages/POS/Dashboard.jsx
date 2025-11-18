// ============================================================================
// Dashboard Page - Real-time POS Metrics & Overview
// ============================================================================
// Route: /venue/pos/dashboard
// Purpose: Display live sales stats, active orders, and quick actions
// ============================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, usePOS } from '../../contexts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { formatCurrency, formatTime, getOrderStatusColor } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const { venue, isAuthenticated } = useAuth();
  const { activeOrders, ordersLoading, refreshActiveOrders } = usePOS();

  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    activeOrders: 0,
    avgOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);

  // ============================================================================
  // REDIRECT IF NOT AUTHENTICATED
  // ============================================================================

  useEffect(() => {
    if (!isAuthenticated || !venue) {
      navigate('/venue/pos/auth/manager');
    }
  }, [isAuthenticated, venue, navigate]);

  // ============================================================================
  // FETCH TODAY'S STATS
  // ============================================================================

  useEffect(() => {
    const fetchStats = async () => {
      if (!venue) return;

      setLoading(true);
      try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Fetch today's orders
        const { data: orders, error } = await supabase
          .from('pos_orders')
          .select('*')
          .eq('venue_id', venue.id)
          .gte('created_at', startOfDay.toISOString());

        if (error) throw error;

        const completedOrders = orders?.filter(o => o.status === 'completed') || [];
        const active = orders?.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)) || [];

        const totalSales = completedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const avgValue = completedOrders.length > 0 ? totalSales / completedOrders.length : 0;

        setStats({
          todaySales: totalSales,
          todayOrders: completedOrders.length,
          activeOrders: active.length,
          avgOrderValue: avgValue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, [venue]);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!venue) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{venue.name} - Dashboard</h1>
            <p className="text-muted-foreground">Real-time POS overview</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/venue/pos/new-order')}>
              New Order
            </Button>
            <Button variant="outline" onClick={() => navigate('/venue/pos/kitchen')}>
              Kitchen Display
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Today's Sales</CardDescription>
              <CardTitle className="text-3xl">
                {loading ? '...' : formatCurrency(stats.todaySales)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {stats.todayOrders} orders completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Orders</CardDescription>
              <CardTitle className="text-3xl">
                {loading ? '...' : stats.activeOrders}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                In progress right now
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Order Value</CardDescription>
              <CardTitle className="text-3xl">
                {loading ? '...' : formatCurrency(stats.avgOrderValue)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Per completed order
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Orders Today</CardDescription>
              <CardTitle className="text-3xl">
                {loading ? '...' : stats.todayOrders}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Total completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Orders</CardTitle>
                <CardDescription>
                  {activeOrders.length} orders in progress
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshActiveOrders}
                disabled={ordersLoading}
              >
                {ordersLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active orders
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell className="capitalize">
                        {order.order_type?.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        {order.pos_order_items?.length || 0} items
                      </TableCell>
                      <TableCell>
                        <Badge variant={getOrderStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTime(order.created_at)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/venue/pos/new-order')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">➕</span>
                New Order
              </CardTitle>
              <CardDescription>
                Create a new order and add items
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/venue/pos/kitchen')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🍳</span>
                Kitchen Display
              </CardTitle>
              <CardDescription>
                View and manage kitchen orders
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/venue/pos/menu')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Menu Management
              </CardTitle>
              <CardDescription>
                Edit menu items and categories
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
