// ============================================================================
// Inventory Management Page - Stock Tracking & Alerts
// ============================================================================
// Route: /venue/pos/inventory
// Purpose: Track stock levels, manage inventory, low stock alerts
// ============================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { supabase } from '../../lib/supabase';

const Inventory = () => {
  const navigate = useNavigate();
  const { venue, isAuthenticated } = useAuth();

  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustmentQty, setAdjustmentQty] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/venue/pos/auth/manager');
    }
  }, [isAuthenticated, navigate]);

  // Fetch menu items with inventory data
  const fetchInventory = async () => {
    if (!venue?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('venue_id', venue.id)
        .order('name');

      if (error) throw error;

      // Add stock_quantity and par_level if not in schema yet
      const itemsWithInventory = (data || []).map(item => ({
        ...item,
        stock_quantity: item.stock_quantity || 0,
        par_level: item.par_level || 10,
        low_stock_threshold: item.low_stock_threshold || 5,
      }));

      setMenuItems(itemsWithInventory);
      setFilteredItems(itemsWithInventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();

    // Refresh every 60 seconds
    const interval = setInterval(fetchInventory, 60000);
    return () => clearInterval(interval);
  }, [venue?.id]);

  // Search filter
  useEffect(() => {
    if (searchTerm) {
      setFilteredItems(
        menuItems.filter(item =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredItems(menuItems);
    }
  }, [searchTerm, menuItems]);

  // Get stock status
  const getStockStatus = (item) => {
    if (item.stock_quantity <= 0) {
      return { label: 'Out of Stock', color: 'bg-red-500' };
    } else if (item.stock_quantity <= item.low_stock_threshold) {
      return { label: 'Low Stock', color: 'bg-yellow-500' };
    } else if (item.stock_quantity < item.par_level) {
      return { label: 'Below Par', color: 'bg-orange-500' };
    } else {
      return { label: 'Adequate', color: 'bg-green-500' };
    }
  };

  // Inventory statistics
  const getInventoryStats = () => {
    const stats = {
      total: menuItems.length,
      outOfStock: menuItems.filter(item => item.stock_quantity <= 0).length,
      lowStock: menuItems.filter(item =>
        item.stock_quantity > 0 && item.stock_quantity <= item.low_stock_threshold
      ).length,
      belowPar: menuItems.filter(item =>
        item.stock_quantity > item.low_stock_threshold && item.stock_quantity < item.par_level
      ).length,
      adequate: menuItems.filter(item => item.stock_quantity >= item.par_level).length,
    };
    return stats;
  };

  // Open adjustment modal
  const openAdjustModal = (item) => {
    setSelectedItem(item);
    setAdjustmentQty(0);
    setAdjustmentReason('');
    setShowAdjustModal(true);
  };

  // Adjust inventory
  const adjustInventory = async () => {
    if (!selectedItem || adjustmentQty === 0) return;

    try {
      const newQuantity = selectedItem.stock_quantity + adjustmentQty;

      const { error } = await supabase
        .from('menu_items')
        .update({ stock_quantity: newQuantity })
        .eq('id', selectedItem.id);

      if (error) throw error;

      // TODO: Log adjustment in inventory_logs table
      // await supabase.from('inventory_logs').insert({
      //   menu_item_id: selectedItem.id,
      //   adjustment_qty: adjustmentQty,
      //   reason: adjustmentReason,
      //   previous_qty: selectedItem.stock_quantity,
      //   new_qty: newQuantity,
      // });

      setShowAdjustModal(false);
      fetchInventory();
    } catch (error) {
      console.error('Error adjusting inventory:', error);
    }
  };

  const stats = getInventoryStats();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Track stock levels and manage inventory</p>
        </div>
        <Button onClick={() => navigate('/venue/pos/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.outOfStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.lowStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Below Par</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.belowPar}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Adequate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.adequate}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <Input
            type="text"
            placeholder="Search by item name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>{filteredItems.length} items</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Par Level</TableHead>
                  <TableHead>Low Stock Alert</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="capitalize">{item.category || 'Uncategorized'}</TableCell>
                      <TableCell className="font-bold">{item.stock_quantity}</TableCell>
                      <TableCell>{item.par_level}</TableCell>
                      <TableCell>{item.low_stock_threshold}</TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openAdjustModal(item)}
                          >
                            Adjust
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Adjustment Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Adjust Inventory</CardTitle>
                  <CardDescription>{selectedItem.name}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdjustModal(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="text-2xl font-bold">{selectedItem.stock_quantity}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adjustment">Adjustment Quantity</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setAdjustmentQty(prev => prev - 1)}
                  >
                    -
                  </Button>
                  <Input
                    id="adjustment"
                    type="number"
                    value={adjustmentQty}
                    onChange={(e) => setAdjustmentQty(Number(e.target.value))}
                    className="text-center"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setAdjustmentQty(prev => prev + 1)}
                  >
                    +
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  New quantity: {selectedItem.stock_quantity + adjustmentQty}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Input
                  id="reason"
                  type="text"
                  placeholder="e.g., Restocked, Damaged, etc."
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={adjustInventory}
                  disabled={adjustmentQty === 0}
                >
                  Apply Adjustment
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAdjustModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Inventory;
