// ============================================================================
// Kitchen Display Page - Unified View with 3 Modes
// ============================================================================
// Route: /venue/pos/kitchen
// Purpose: Real-time kitchen order display with Card, List, and Kanban views
// CRITICAL: ONE page with 3 view modes, NOT separate pages
// ============================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, usePOS } from '../../contexts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { formatCurrency, formatTime, getOrderStatusColor } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

const KitchenDisplay = () => {
  const navigate = useNavigate();
  const { venue, isAuthenticated } = useAuth();
  const { activeOrders, ordersLoading, refreshActiveOrders } = usePOS();

  const [viewMode, setViewMode] = useState('card'); // 'card', 'list', or 'kanban'
  const [selectedStatus, setSelectedStatus] = useState('all'); // filter

  // ============================================================================
  // REDIRECT IF NOT AUTHENTICATED
  // ============================================================================

  useEffect(() => {
    if (!isAuthenticated || !venue) {
      navigate('/venue/pos/auth/manager');
    }
  }, [isAuthenticated, venue, navigate]);

  // ============================================================================
  // AUTO-REFRESH ORDERS
  // ============================================================================

  useEffect(() => {
    if (venue) {
      refreshActiveOrders();

      // Refresh every 10 seconds
      const interval = setInterval(refreshActiveOrders, 10000);

      return () => clearInterval(interval);
    }
  }, [venue, refreshActiveOrders]);

  // ============================================================================
  // UPDATE ORDER STATUS
  // ============================================================================

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('pos_orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Refresh orders
      refreshActiveOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  // ============================================================================
  // FILTER ORDERS BY STATUS
  // ============================================================================

  const filteredOrders =
    selectedStatus === 'all'
      ? activeOrders
      : activeOrders.filter((order) => order.status === selectedStatus);

  // ============================================================================
  // GROUP ORDERS FOR KANBAN VIEW
  // ============================================================================

  const groupedOrders = {
    pending: activeOrders.filter((o) => o.status === 'pending' || o.status === 'confirmed'),
    preparing: activeOrders.filter((o) => o.status === 'preparing'),
    ready: activeOrders.filter((o) => o.status === 'ready'),
  };

  // ============================================================================
  // RENDER ORDER CARD (used in Card and Kanban views)
  // ============================================================================

  const renderOrderCard = (order) => (
    <Card key={order.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">#{order.order_number}</CardTitle>
            <CardDescription className="text-sm">
              {formatTime(order.created_at)}
            </CardDescription>
          </div>
          <Badge variant={getOrderStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Order Type & Table */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium capitalize">
              {order.order_type?.replace('_', ' ')}
            </span>
            {order.pos_tables && (
              <span className="text-muted-foreground">
                • Table {order.pos_tables.table_number}
              </span>
            )}
          </div>

          {/* Items */}
          <div className="space-y-1">
            {order.pos_order_items?.map((item, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{item.quantity}x</span>{' '}
                <span>{item.menu_item?.name || 'Item'}</span>
              </div>
            ))}
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
              📝 {order.notes}
            </div>
          )}

          {/* Total */}
          <div className="text-lg font-bold border-t pt-2">
            {formatCurrency(order.total_amount)}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {order.status === 'pending' && (
              <Button
                size="sm"
                className="flex-1"
                onClick={() => updateOrderStatus(order.id, 'preparing')}
              >
                Start Preparing
              </Button>
            )}
            {order.status === 'confirmed' && (
              <Button
                size="sm"
                className="flex-1"
                onClick={() => updateOrderStatus(order.id, 'preparing')}
              >
                Start Preparing
              </Button>
            )}
            {order.status === 'preparing' && (
              <Button
                size="sm"
                className="flex-1"
                onClick={() => updateOrderStatus(order.id, 'ready')}
              >
                Mark Ready
              </Button>
            )}
            {order.status === 'ready' && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => updateOrderStatus(order.id, 'delivered')}
              >
                Mark Delivered
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!venue) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Kitchen Display</h1>
            <p className="text-muted-foreground">
              {activeOrders.length} active orders
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={refreshActiveOrders}
              disabled={ordersLoading}
            >
              {ordersLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button variant="outline" onClick={() => navigate('/venue/pos/dashboard')}>
              ← Dashboard
            </Button>
          </div>
        </div>

        {/* View Mode Toggle - CRITICAL: All 3 modes in ONE page */}
        <div className="flex items-center justify-between">
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList>
              <TabsTrigger value="card">Card View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="kanban">Kanban View</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Status Filter (for Card and List views) */}
          {viewMode !== 'kanban' && (
            <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="preparing">Preparing</TabsTrigger>
                <TabsTrigger value="ready">Ready</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>

        {/* Content Area */}
        {activeOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No active orders in the kitchen
            </CardContent>
          </Card>
        ) : (
          <>
            {/* CARD VIEW */}
            {viewMode === 'card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map(renderOrderCard)}
              </div>
            )}

            {/* LIST VIEW */}
            {viewMode === 'list' && (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-bold">
                            #{order.order_number}
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
                          <TableCell className="font-medium">
                            {formatCurrency(order.total_amount)}
                          </TableCell>
                          <TableCell>
                            {order.status === 'pending' ||
                            order.status === 'confirmed' ? (
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateOrderStatus(order.id, 'preparing')
                                }
                              >
                                Start
                              </Button>
                            ) : order.status === 'preparing' ? (
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateOrderStatus(order.id, 'ready')
                                }
                              >
                                Ready
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateOrderStatus(order.id, 'delivered')
                                }
                              >
                                Deliver
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* KANBAN VIEW */}
            {viewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Column */}
                <div className="space-y-4">
                  <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3">
                    <h3 className="font-bold text-lg">
                      Pending ({groupedOrders.pending.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {groupedOrders.pending.map(renderOrderCard)}
                  </div>
                </div>

                {/* Preparing Column */}
                <div className="space-y-4">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
                    <h3 className="font-bold text-lg">
                      Preparing ({groupedOrders.preparing.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {groupedOrders.preparing.map(renderOrderCard)}
                  </div>
                </div>

                {/* Ready Column */}
                <div className="space-y-4">
                  <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3">
                    <h3 className="font-bold text-lg">
                      Ready ({groupedOrders.ready.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {groupedOrders.ready.map(renderOrderCard)}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;
