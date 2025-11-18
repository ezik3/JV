// ============================================================================
// Orders Management Page - Order History & Management
// ============================================================================
// Route: /venue/pos/orders
// Purpose: Display all orders, filter by status, view details, manage lifecycle
// ============================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, usePOS } from '../../contexts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { formatCurrency, formatTime, getOrderStatusColor } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

const Orders = () => {
  const navigate = useNavigate();
  const { venue, isAuthenticated } = useAuth();
  const { refreshOrders } = usePOS();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/venue/pos/auth/manager');
    }
  }, [isAuthenticated, navigate]);

  // Fetch all orders
  const fetchOrders = async () => {
    if (!venue?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('venue_id', venue.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Set up real-time subscription
    const subscription = supabase
      .channel('orders-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `venue_id=eq.${venue?.id}` },
        (payload) => {
          console.log('Order changed:', payload);
          fetchOrders();
        }
      )
      .subscribe();

    // Refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [venue?.id]);

  // Filter orders by status
  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_number?.toString().includes(searchTerm) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.table_number?.toString().includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      fetchOrders();
      refreshOrders?.();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  // Calculate order total
  const calculateOrderTotal = (order) => {
    if (!order.order_items || order.order_items.length === 0) {
      return order.total_amount || 0;
    }
    return order.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Order status statistics
  const getOrderStats = () => {
    const stats = {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
    return stats;
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">View and manage all orders</p>
        </div>
        <Button onClick={() => navigate('/venue/pos/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <Input
            type="text"
            placeholder="Search by order number, customer name, or table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({stats.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="preparing">Preparing ({stats.preparing})</TabsTrigger>
          <TabsTrigger value="ready">Ready ({stats.ready})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({stats.cancelled})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {statusFilter === 'all' ? 'All Orders' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Orders`}
              </CardTitle>
              <CardDescription>
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.order_number || order.id.slice(0, 8)}</TableCell>
                        <TableCell>{formatTime(order.created_at)}</TableCell>
                        <TableCell className="capitalize">{order.order_type || 'dine-in'}</TableCell>
                        <TableCell>{order.customer_name || 'Walk-in'}</TableCell>
                        <TableCell>{order.order_items?.length || 0} items</TableCell>
                        <TableCell>{formatCurrency(calculateOrderTotal(order))}</TableCell>
                        <TableCell>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewOrderDetails(order)}
                            >
                              View
                            </Button>
                            {order.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                              >
                                Start
                              </Button>
                            )}
                            {order.status === 'preparing' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                              >
                                Ready
                              </Button>
                            )}
                            {order.status === 'ready' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                              >
                                Complete
                              </Button>
                            )}
                            {(order.status === 'pending' || order.status === 'preparing') && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Order #{selectedOrder.order_number || selectedOrder.id.slice(0, 8)}</CardTitle>
                  <CardDescription>{formatTime(selectedOrder.created_at)}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOrderDetail(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getOrderStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{selectedOrder.order_type || 'dine-in'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.customer_name || 'Walk-in'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Table</p>
                  <p className="font-medium">{selectedOrder.table_number || 'N/A'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium">{item.item_name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(calculateOrderTotal(selectedOrder))}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setShowOrderDetail(false);
                    // TODO: Add print receipt functionality
                  }}
                >
                  Print Receipt
                </Button>
                {selectedOrder.status === 'completed' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      // TODO: Add refund functionality
                    }}
                  >
                    Refund
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Orders;
