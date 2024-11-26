import React, { useState, useEffect } from 'react';
import styles from './POSMain.module.css';  // Changed import to use CSS module

const POSMain = () => {
    const [categories, setCategories] = useState(['All', 'Food', 'Drinks', 'Specials']);
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState([]);
    const [menuItems, setMenuItems] = useState([
        { id: 1, name: 'Burger', price: 10, category: 'Food' },
        { id: 2, name: 'Pizza', price: 12, category: 'Food' },
        { id: 3, name: 'Cola', price: 3, category: 'Drinks' },
    ]);
    const [total, setTotal] = useState(0);
    const [jvBalance, setJvBalance] = useState(1000);

    useEffect(() => {
        calculateTotal();
    }, [cart]);

    const calculateTotal = () => {
        const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(newTotal);
    };

    const addToCart = (item) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    return (
        <div className={styles['pos-app']}>
            <div className={styles['pos-main-container']}>
                <header className={styles['pos-header']}>
                    <h1>JointVibe POS</h1>
                    <div className={styles['balance-display']}>
                        Balance: {jvBalance} JV
                    </div>
                </header>
                
                <div className={styles['pos-content']}>
                    {/* Menu Section */}
                    <div className={styles['menu-section']}>
                        <div className={styles['category-section']}>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`${styles['category-tab']} ${activeCategory === category ? styles['active'] : ''}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        
                        <div className={styles['menu-grid']}>
                            {menuItems
                                .filter(item => activeCategory === 'All' || item.category === activeCategory)
                                .map((item) => (
                                    <div
                                        key={item.id}
                                        className={styles['menu-item']}
                                        onClick={() => addToCart(item)}
                                    >
                                        <h3>{item.name}</h3>
                                        <p>{item.price} JV</p>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Cart Section */}
                    <div className={styles['cart-section']}>
                        <h2>Current Order</h2>
                        <div className={styles['order-items']}>
                            {cart.map((item) => (
                                <div key={item.id} className={styles['cart-item']}>
                                    <div className={styles['cart-item-details']}>
                                        <h3 className={styles['cart-item-name']}>{item.name}</h3>
                                        <p className={styles['cart-item-price']}>
                                            {item.quantity} x {item.price} JV
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className={styles['remove-btn']}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <div className={styles['order-total']}>
                            <span>Total:</span>
                            <span>{total} JV</span>
                        </div>
                        
                        <button
                            className={styles['process-payment-btn']}
                            disabled={cart.length === 0}
                            onClick={() => {
                                if (total <= jvBalance) {
                                    setJvBalance(prev => prev - total);
                                    setCart([]);
                                    alert('Payment successful!');
                                } else {
                                    alert('Insufficient JV balance!');
                                }
                            }}
                        >
                            Process Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POSMain;