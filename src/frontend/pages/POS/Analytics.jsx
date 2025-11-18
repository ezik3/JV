// ============================================================================
// Analytics & Reports Page - Business Intelligence Dashboard
// ============================================================================
// Route: /venue/pos/analytics
// Purpose: Display sales analytics, trends, and performance metrics
// ============================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { formatCurrency, formatTime } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

const Analytics = () => {
  const navigate = useNavigate();
  const { venue, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today'); // today, week, month, year
  const [analytics, setAnalytics] = useState({
    revenue: 0,
    orders: 0,
    avgOrderValue: 0,
    topItems: [],
    revenueByDay: [],
    ordersByType: {},
    hourlyDistribution: [],
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/venue/pos/auth/manager');
    }
  }, [isAuthenticated, navigate]);

  // Fetch analytics data
  const fetchAnalytics = async () => {
    if (!venue?.id) return;

    try {
      setLoading(true);

      // Calculate date range
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Fetch orders in date range
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('venue_id', venue.id)
        .gte('created_at', startDate.toISOString())
        .in('status', ['completed', 'ready', 'preparing']);

      if (ordersError) throw ordersError;

      // Calculate total revenue
      const revenue = orders.reduce((sum, order) => {
        const orderTotal = order.order_items?.reduce((itemSum, item) =>
          itemSum + (item.price * item.quantity), 0) || 0;
        return sum + orderTotal;
      }, 0);

      // Calculate average order value
      const avgOrderValue = orders.length > 0 ? revenue / orders.length : 0;

      // Calculate top items
      const itemsMap = {};
      orders.forEach(order => {
        order.order_items?.forEach(item => {
          if (!itemsMap[item.item_name]) {
            itemsMap[item.item_name] = {
              name: item.item_name,
              quantity: 0,
              revenue: 0,
            };
          }
          itemsMap[item.item_name].quantity += item.quantity;
          itemsMap[item.item_name].revenue += item.price * item.quantity;
        });
      });

      const topItems = Object.values(itemsMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Calculate orders by type
      const ordersByType = orders.reduce((acc, order) => {
        const type = order.order_type || 'dine-in';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      // Calculate revenue by day
      const revenueByDay = {};
      orders.forEach(order => {
        const date = new Date(order.created_at).toLocaleDateString();
        const orderTotal = order.order_items?.reduce((sum, item) =>
          sum + (item.price * item.quantity), 0) || 0;
        revenueByDay[date] = (revenueByDay[date] || 0) + orderTotal;
      });

      // Calculate hourly distribution
      const hourlyDistribution = Array(24).fill(0);
      orders.forEach(order => {
        const hour = new Date(order.created_at).getHours();
        hourlyDistribution[hour]++;
      });

      setAnalytics({
        revenue,
        orders: orders.length,
        avgOrderValue,
        topItems,
        revenueByDay: Object.entries(revenueByDay).map(([date, revenue]) => ({
          date,
          revenue,
        })),
        ordersByType,
        hourlyDistribution: hourlyDistribution.map((count, hour) => ({
          hour,
          count,
        })).filter(h => h.count > 0),
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [venue?.id, dateRange]);

  // Export data as CSV
  const exportCSV = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Revenue', formatCurrency(analytics.revenue)],
      ['Total Orders', analytics.orders],
      ['Average Order Value', formatCurrency(analytics.avgOrderValue)],
      [''],
      ['Top Items', 'Quantity', 'Revenue'],
      ...analytics.topItems.map(item => [
        item.name,
        item.quantity,
        formatCurrency(item.revenue)
      ]),
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}-${new Date().toISOString()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">Business intelligence and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline">
            Export CSV
          </Button>
          <Button onClick={() => navigate('/venue/pos/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={dateRange === 'today' ? 'default' : 'outline'}
              onClick={() => setDateRange('today')}
            >
              Today
            </Button>
            <Button
              variant={dateRange === 'week' ? 'default' : 'outline'}
              onClick={() => setDateRange('week')}
            >
              Last 7 Days
            </Button>
            <Button
              variant={dateRange === 'month' ? 'default' : 'outline'}
              onClick={() => setDateRange('month')}
            >
              Last 30 Days
            </Button>
            <Button
              variant={dateRange === 'year' ? 'default' : 'outline'}
              onClick={() => setDateRange('year')}
            >
              Last Year
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(analytics.revenue)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {dateRange === 'today' ? 'Today' :
               dateRange === 'week' ? 'Last 7 days' :
               dateRange === 'month' ? 'Last 30 days' : 'Last year'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {analytics.orders}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Orders processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {formatCurrency(analytics.avgOrderValue)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Per order average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Different Analytics */}
      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Top Items</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Trend</TabsTrigger>
          <TabsTrigger value="orders">Order Types</TabsTrigger>
          <TabsTrigger value="hourly">Peak Hours</TabsTrigger>
        </TabsList>

        {/* Top Items Tab */}
        <TabsContent value="items" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
              <CardDescription>Best performing menu items by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.topItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Quantity Sold</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Avg Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.topItems.map((item, index) => (
                      <TableRow key={item.name}>
                        <TableCell className="font-bold">#{index + 1}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          {formatCurrency(item.revenue)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.revenue / item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Trend Tab */}
        <TabsContent value="revenue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Day</CardTitle>
              <CardDescription>Daily revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.revenueByDay.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {analytics.revenueByDay.map((day) => (
                    <div key={day.date} className="flex justify-between items-center p-3 bg-muted rounded">
                      <span className="font-medium">{day.date}</span>
                      <span className="text-green-600 font-bold">
                        {formatCurrency(day.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Order Types Tab */}
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders by Type</CardTitle>
              <CardDescription>Distribution of order types</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(analytics.ordersByType).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analytics.ordersByType).map(([type, count]) => (
                    <Card key={type}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium capitalize">
                          {type}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{count}</div>
                        <p className="text-sm text-muted-foreground">
                          {((count / analytics.orders) * 100).toFixed(1)}%
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hourly Distribution Tab */}
        <TabsContent value="hourly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders by Hour</CardTitle>
              <CardDescription>Peak hours analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.hourlyDistribution.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {analytics.hourlyDistribution
                    .sort((a, b) => b.count - a.count)
                    .map((hour) => {
                      const maxCount = Math.max(...analytics.hourlyDistribution.map(h => h.count));
                      const percentage = (hour.count / maxCount) * 100;
                      return (
                        <div key={hour.hour} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">
                              {hour.hour === 0 ? '12 AM' :
                               hour.hour < 12 ? `${hour.hour} AM` :
                               hour.hour === 12 ? '12 PM' :
                               `${hour.hour - 12} PM`}
                            </span>
                            <span className="text-muted-foreground">{hour.count} orders</span>
                          </div>
                          <div className="h-2 bg-muted rounded overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
