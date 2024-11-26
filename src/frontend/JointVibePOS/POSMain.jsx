import React, { useState, useEffect } from 'react';
import MenuSection from './MenuSection';
import OrderSection from './OrderSection';
import PaymentSection from './PaymentSection';

const POSMain = () => {
    const [currentOrder, setCurrentOrder] = useState({
        items: [],
        total: 0
    });
    const [jvBalance, setJVBalance] = useState(0);
    const [venueInfo, setVenueInfo] = useState(null);

    useEffect(() => {
        // Fetch venue info and JV balance when component mounts
        fetchVenueInfo();
        fetchJVBalance();
    }, []);

    const fetchVenueInfo = async () => {
        try {
            // We'll implement this later with your backend
            console.log('Fetching venue info...');
        } catch (error) {
            console.error('Error fetching venue info:', error);
        }
    };

    const fetchJVBalance = async () => {
        try {
            // We'll implement this with your JV coin system
            console.log('Fetching JV balance...');
        } catch (error) {
            console.error('Error fetching JV balance:', error);
        }
    };

    const addItemToOrder = (item) => {
        setCurrentOrder(prevOrder => ({
            ...prevOrder,
            items: [...prevOrder.items, item],
            total: prevOrder.total + item.price
        }));
    };

    return (
        <div className="pos-main-container">
            <div className="pos-header">
                <h1>JointVibe POS</h1>
                <div className="balance-display">
                    Balance: {jvBalance} JV
                </div>
            </div>
            
            <div className="pos-content">
                <MenuSection onAddItem={addItemToOrder} />
                <OrderSection 
                    currentOrder={currentOrder}
                    setCurrentOrder={setCurrentOrder}
                />
                <PaymentSection 
                    order={currentOrder}
                    jvBalance={jvBalance}
                />
            </div>
        </div>
    );
};

export default POSMain;