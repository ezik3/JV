import React from 'react';

const OrderSection = ({ currentOrder, setCurrentOrder }) => {
    const removeItem = (index) => {
        const newItems = [...currentOrder.items];
        newItems.splice(index, 1);
        
        setCurrentOrder({
            items: newItems,
            total: newItems.reduce((sum, item) => sum + item.price, 0)
        });
    };

    const clearOrder = () => {
        setCurrentOrder({
            items: [],
            total: 0
        });
    };

    return (
        <div className="order-section">
            <div className="order-header">
                <h2>Current Order</h2>
                {currentOrder.items.length > 0 && (
                    <button className="clear-btn" onClick={clearOrder}>
                        Clear All
                    </button>
                )}
            </div>
            
            <div className="order-items">
                {currentOrder.items.map((item, index) => (
                    <div key={index} className="order-item">
                        <div className="item-details">
                            <span className="item-name">{item.name}</span>
                            <span className="item-price">{item.price} JV</span>
                        </div>
                        <button 
                            className="remove-btn"
                            onClick={() => removeItem(index)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div className="order-total">
                <span>Total:</span>
                <span>{currentOrder.total.toFixed(2)} JV</span>
            </div>
        </div>
    );
};

export default OrderSection;