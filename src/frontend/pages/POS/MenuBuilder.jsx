// ============================================================================
// Menu Builder Page - Menu Item Management
// ============================================================================
// Route: /venue/pos/menu
// Purpose: Create, edit, delete menu items and manage categories
// ============================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { formatCurrency } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

const MenuBuilder = () => {
  const navigate = useNavigate();
  const { venue, isAuthenticated } = useAuth();

  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
    featured: false,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/venue/pos/auth/manager');
    }
  }, [isAuthenticated, navigate]);

  // Fetch menu items
  const fetchMenuItems = async () => {
    if (!venue?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('venue_id', venue.id)
        .order('category')
        .order('name');

      if (error) throw error;

      setMenuItems(data || []);
      setFilteredItems(data || []);

      // Extract unique categories
      const uniqueCategories = [...new Set((data || []).map(item => item.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [venue?.id]);

  // Filter items
  useEffect(() => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [menuItems, selectedCategory, searchTerm]);

  // Open modal for new item
  const openNewItemModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      available: true,
      featured: false,
    });
    setShowItemModal(true);
  };

  // Open modal for editing
  const openEditItemModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price?.toString() || '',
      category: item.category || '',
      available: item.available !== false,
      featured: item.featured || false,
    });
    setShowItemModal(true);
  };

  // Save menu item
  const saveMenuItem = async () => {
    if (!formData.name || !formData.price) {
      alert('Please fill in required fields (name and price)');
      return;
    }

    try {
      const itemData = {
        venue_id: venue.id,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        available: formData.available,
        featured: formData.featured,
      };

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase
          .from('menu_items')
          .insert([itemData]);

        if (error) throw error;
      }

      setShowItemModal(false);
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Error saving menu item: ' + error.message);
    }
  };

  // Delete menu item
  const deleteMenuItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Error deleting menu item: ' + error.message);
    }
  };

  // Toggle availability
  const toggleAvailability = async (item) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ available: !item.available })
        .eq('id', item.id);

      if (error) throw error;

      fetchMenuItems();
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Menu Builder</h1>
          <p className="text-muted-foreground">Create and manage menu items</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openNewItemModal}>Add New Item</Button>
          <Button variant="outline" onClick={() => navigate('/venue/pos/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">All ({menuItems.length})</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category} ({menuItems.filter(i => i.category === category).length})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">No menu items found</p>
                  <Button onClick={openNewItemModal}>Create Your First Item</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className={!item.available ? 'opacity-60' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {item.description || 'No description'}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        {item.featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                        {!item.available && (
                          <Badge variant="destructive">Unavailable</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="text-lg font-bold">{formatCurrency(item.price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <Badge variant="outline">{item.category || 'Uncategorized'}</Badge>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => openEditItemModal(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={item.available ? 'secondary' : 'default'}
                        className="flex-1"
                        onClick={() => toggleAvailability(item)}
                      >
                        {item.available ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMenuItem(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Item Edit/Create Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{editingItem ? 'Edit Menu Item' : 'New Menu Item'}</CardTitle>
                  <CardDescription>
                    {editingItem ? 'Update menu item details' : 'Create a new menu item'}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowItemModal(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Cheeseburger"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the menu item..."
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Burgers, Drinks"
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="available" className="cursor-pointer">
                    Available for ordering
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Feature this item
                  </Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={saveMenuItem}>
                  {editingItem ? 'Update Item' : 'Create Item'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowItemModal(false)}
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

export default MenuBuilder;
