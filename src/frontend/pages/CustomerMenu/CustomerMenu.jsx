import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ShoppingCart, Search, Filter, ChevronRight, Plus, Minus, X } from 'lucide-react';
import './CustomerMenu.css';

const CustomerMenu = () => {
  const { venueId } = useParams();
  const history = useHistory();
  const [venue, setVenue] = useState({ name: 'Loading...', description: '' });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [orderType, setOrderType] = useState('dine-in');

  useEffect(() => {
    fetchMenu();
  }, [venueId]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/menu/items?venueId=${venueId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch menu');

      const data = await response.json();
      setCategories(data.categories || []);
      if (data.categories && data.categories.length > 0) {
        setSelectedCategory(data.categories[0].id);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (menuItem, quantity = 1) => {
    const existingItem = cart.find(item => item.id === menuItem.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === menuItem.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...menuItem, quantity }]);
    }
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const handleCheckout = () => {
    // Save cart to localStorage or context
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('orderType', orderType);
    localStorage.setItem('venueId', venueId);
    history.push('/checkout');
  };

  const filteredItems = (categoryItems) => {
    if (!searchQuery) return categoryItems;
    return categoryItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  if (loading) {
    return (
      <div className="customer-menu-loading">
        <div className="loading-spinner"></div>
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="customer-menu">
      {/* Header */}
      <div className="customer-menu-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => history.goBack()}>
            ←
          </button>
          <div className="venue-info">
            <h1>{venue.name}</h1>
            {venue.description && <p>{venue.description}</p>}
          </div>
          <button className="cart-btn" onClick={() => setShowCart(true)}>
            <ShoppingCart size={24} />
            {getCartItemCount() > 0 && (
              <span className="cart-badge">{getCartItemCount()}</span>
            )}
          </button>
        </div>

        {/* Order Type Selection */}
        <div className="order-type-selector">
          <button
            className={`order-type-btn ${orderType === 'dine-in' ? 'active' : ''}`}
            onClick={() => setOrderType('dine-in')}
          >
            🍽️ Dine In
          </button>
          <button
            className={`order-type-btn ${orderType === 'takeout' ? 'active' : ''}`}
            onClick={() => setOrderType('takeout')}
          >
            🥡 Takeout
          </button>
          <button
            className={`order-type-btn ${orderType === 'pre-order' ? 'active' : ''}`}
            onClick={() => setOrderType('pre-order')}
          >
            ⏰ Pre-Order
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="categories-nav">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="menu-content">
        {categories.map(category => (
          <div
            key={category.id}
            className={`category-section ${selectedCategory === category.id ? 'visible' : 'hidden'}`}
          >
            <h2 className="category-title">{category.name}</h2>
            {category.description && (
              <p className="category-description">{category.description}</p>
            )}

            <div className="menu-items-grid">
              {filteredItems(category.menuItems || []).map(item => (
                <div
                  key={item.id}
                  className="menu-item-card"
                  onClick={() => setSelectedItem(item)}
                >
                  {item.imageUrl && (
                    <div className="item-image">
                      <img src={item.imageUrl} alt={item.name} />
                    </div>
                  )}
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    {item.description && <p>{item.description}</p>}
                    {item.calories && (
                      <span className="calories">{item.calories} cal</span>
                    )}
                    <div className="item-footer">
                      <span className="price">${item.price.toFixed(2)}</span>
                      <button
                        className="add-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="item-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedItem(null)}>
              <X size={24} />
            </button>
            
            {selectedItem.imageUrl && (
              <div className="modal-image">
                <img src={selectedItem.imageUrl} alt={selectedItem.name} />
              </div>
            )}

            <div className="modal-content">
              <h2>{selectedItem.name}</h2>
              {selectedItem.description && <p>{selectedItem.description}</p>}
              
              <div className="modal-info">
                {selectedItem.calories && (
                  <span className="info-badge">🔥 {selectedItem.calories} cal</span>
                )}
                {selectedItem.preparationTime && (
                  <span className="info-badge">⏱️ {selectedItem.preparationTime} min</span>
                )}
                {selectedItem.allergens && (
                  <span className="info-badge allergen">⚠️ {selectedItem.allergens}</span>
                )}
              </div>

              <div className="modal-actions">
                <span className="modal-price">${selectedItem.price.toFixed(2)}</span>
                <button
                  className="add-to-cart-btn"
                  onClick={() => {
                    addToCart(selectedItem);
                    setSelectedItem(null);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Your Order</h2>
              <button onClick={() => setShowCart(false)}>
                <X size={24} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingCart size={48} />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <span className="cart-item-price">${item.price.toFixed(2)}</span>
                      </div>
                      <div className="cart-item-actions">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                          <Plus size={16} />
                        </button>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total</span>
                    <span className="total-amount">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Cart Button (Mobile) */}
      {cart.length > 0 && !showCart && (
        <button className="floating-cart-btn" onClick={() => setShowCart(true)}>
          <ShoppingCart size={24} />
          <span>{getCartItemCount()} items • ${getCartTotal().toFixed(2)}</span>
        </button>
      )}
    </div>
  );
};

export default CustomerMenu;
