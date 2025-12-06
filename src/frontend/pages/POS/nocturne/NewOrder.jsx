import React, { useState } from 'react';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import './nocturne.css';

const NewOrder = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];

  const menuItems = [
    { id: 1, name: "Margherita Pizza", category: "Main Course", price: 18.00, image: "🍕" },
    { id: 2, name: "Caesar Salad", category: "Appetizers", price: 13.00, image: "🥗" },
    { id: 3, name: "Grilled Salmon", category: "Main Course", price: 26.50, image: "🐟" },
    { id: 4, name: "Pasta Carbonara", category: "Main Course", price: 19.00, image: "🍝" },
    { id: 5, name: "Tiramisu", category: "Desserts", price: 8.50, image: "🍰" },
    { id: 6, name: "Bruschetta", category: "Appetizers", price: 10.00, image: "🥖" },
    { id: 7, name: "Chicken Wings", category: "Appetizers", price: 12.50, image: "🍗" },
    { id: 8, name: "Steak", category: "Main Course", price: 32.00, image: "🥩" },
    { id: 9, name: "Ice Cream", category: "Desserts", price: 6.00, image: "🍨" },
    { id: 10, name: "Coffee", category: "Beverages", price: 4.50, image: "☕" },
    { id: 11, name: "Fresh Juice", category: "Beverages", price: 5.50, image: "🥤" },
    { id: 12, name: "Cheesecake", category: "Desserts", price: 9.00, image: "🧀" }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Layout>
      <div className="flex h-screen bg-background">
      {/* Menu Section */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">New Order</h1>
          <p className="text-muted-foreground">Select items to add to order</p>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search menu items..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "neon-glow" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <Card
              key={item.id}
              className="glass glass-hover cursor-pointer border-border"
              onClick={() => addToCart(item)}
            >
              <CardContent className="p-4">
                <div className="text-5xl text-center mb-3">{item.image}</div>
                <h3 className="font-semibold text-foreground text-center mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground text-center mb-2">{item.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">${item.price.toFixed(2)}</span>
                  <Plus className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-card border-l border-border p-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Current Order
          </h2>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No items in cart</p>
              <p className="text-sm">Add items from menu</p>
            </div>
          ) : (
            cart.map(item => (
              <Card key={item.id} className="glass border-border">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-semibold text-foreground w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex justify-between text-foreground">
            <span>Subtotal:</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-foreground">
            <span>Tax (10%):</span>
            <span className="font-semibold">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-foreground border-t border-border pt-3">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full neon-glow"
            size="lg"
            disabled={cart.length === 0}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default NewOrder;
