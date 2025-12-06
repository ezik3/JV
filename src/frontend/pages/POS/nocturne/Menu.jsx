import React, { useState } from 'react';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import './nocturne.css';

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];

  const menuItems = [
    { id: 1, name: "Margherita Pizza", category: "Main Course", price: 18.00, available: true },
    { id: 2, name: "Caesar Salad", category: "Appetizers", price: 13.00, available: true },
    { id: 3, name: "Grilled Salmon", category: "Main Course", price: 26.50, available: true },
    { id: 4, name: "Pasta Carbonara", category: "Main Course", price: 19.00, available: true },
    { id: 5, name: "Tiramisu", category: "Desserts", price: 8.50, available: true },
    { id: 6, name: "Bruschetta", category: "Appetizers", price: 10.00, available: true },
    { id: 7, name: "Chicken Wings", category: "Appetizers", price: 12.50, available: false },
    { id: 8, name: "Steak", category: "Main Course", price: 32.00, available: true },
    { id: 9, name: "Ice Cream", category: "Desserts", price: 6.00, available: true },
    { id: 10, name: "Coffee", category: "Beverages", price: 4.50, available: true },
    { id: 11, name: "Fresh Juice", category: "Beverages", price: 5.50, available: true },
    { id: 12, name: "Cheesecake", category: "Desserts", price: 9.00, available: true },
    { id: 13, name: "French Fries", category: "Appetizers", price: 7.00, available: true },
    { id: 14, name: "Burger", category: "Main Course", price: 15.50, available: true },
    { id: 15, name: "Soda", category: "Beverages", price: 3.00, available: true },
    { id: 16, name: "Chocolate Cake", category: "Desserts", price: 9.50, available: true }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      'Appetizers': 'bg-blue-100 text-blue-800 border-blue-200',
      'Main Course': 'bg-green-100 text-green-800 border-green-200',
      'Desserts': 'bg-pink-100 text-pink-800 border-pink-200',
      'Beverages': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Layout>
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground">Manage your menu items and pricing</p>
        </div>
        <Button className="neon-glow gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="glass border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search menu items..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "neon-glow" : ""}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map(item => (
          <Card key={item.id} className="glass border-border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-foreground">{item.name}</CardTitle>
                  <Badge className={`${getCategoryColor(item.category)} mt-2`}>
                    {item.category}
                  </Badge>
                </div>
                {!item.available && (
                  <Badge variant="destructive">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-foreground">${item.price.toFixed(2)}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="glass border-border">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No menu items found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
    </Layout>
  );
};
export default Menu;
