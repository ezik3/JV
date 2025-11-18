// ============================================================================
// New Order Page - Order Creation Interface
// ============================================================================
// Route: /venue/pos/new-order
// Purpose: Menu display, cart management, and order submission
// ============================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, usePOS } from '../../contexts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { formatCurrency, calculateCartItemTotal, getCartItemId } from '../../lib/utils';

const NewOrder = () => {
  const navigate = useNavigate();
  const { venue, isAuthenticated } = useAuth();
  const {
    cart,
    cartSubtotal,
    cartTax,
    cartTotal,
    currentOrderType,
    customerName,
    menuItems,
    menuItemsLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    setOrderType,
    setCustomerName,
    createOrder,
    refreshMenuItems,
  } = usePOS();

  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ============================================================================
  // REDIRECT IF NOT AUTHENTICATED
  // ============================================================================

  useEffect(() => {
    if (!isAuthenticated || !venue) {
      navigate('/venue/pos/auth/manager');
    } else {
      refreshMenuItems();
    }
  }, [isAuthenticated, venue, navigate]);

  // ============================================================================
  // FILTER MENU ITEMS
  // ============================================================================

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================================================================
  // HANDLE ADD TO CART
  // ============================================================================

  const handleAddItem = (item) => {
    addToCart(item, 1, []); // quantity 1, no modifiers for now
  };

  // ============================================================================
  // HANDLE CREATE ORDER
  // ============================================================================

  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    setCreating(true);
    try {
      const order = await createOrder();
      alert(`Order ${order.order_number} created successfully!`);
      navigate('/venue/pos/dashboard');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!venue) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Left Side - Menu */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">New Order</h1>
                <p className="text-muted-foreground">Select items to add to cart</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/venue/pos/dashboard')}>
                ← Back to Dashboard
              </Button>
            </div>

            {/* Order Type Tabs */}
            <Tabs value={currentOrderType} onValueChange={setOrderType}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dine_in">Dine In</TabsTrigger>
                <TabsTrigger value="takeout">Takeout</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search */}
            <div>
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Menu Grid */}
            {menuItemsLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading menu...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No menu items found
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleAddItem(item)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      {item.description && (
                        <CardDescription className="text-xs line-clamp-2">
                          {item.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(item.price)}
                        </span>
                        {!item.is_available && (
                          <Badge variant="destructive">Out</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Cart */}
        <div className="w-96 border-l bg-card p-6 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Cart</h2>

            {/* Customer Info */}
            <div className="mb-4 space-y-2">
              <Label htmlFor="customer-name">Customer Name (Optional)</Label>
              <Input
                id="customer-name"
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Cart is empty
                </div>
              ) : (
                cart.map((item) => {
                  const itemId = getCartItemId(item);
                  const itemTotal = calculateCartItemTotal(item);

                  return (
                    <Card key={itemId}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(item.unit_price)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(itemId)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateCartItem(itemId, item.quantity - 1)
                              }
                            >
                              −
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateCartItem(itemId, item.quantity + 1)
                              }
                            >
                              +
                            </Button>
                          </div>
                          <span className="font-bold">
                            {formatCurrency(itemTotal)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Cart Totals */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">{formatCurrency(cartTax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Total</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                className="w-full"
                size="lg"
                onClick={handleCreateOrder}
                disabled={cart.length === 0 || creating}
              >
                {creating ? 'Creating Order...' : 'Create Order'}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={clearCart}
                disabled={cart.length === 0}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
