import React, { useState } from 'react';

const PaymentSection = ({ order, onPayment }) => {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async () => {
        try {
            setProcessing(true);
            setError(null);
            
            // TODO: Implement JV Coin payment processing
            console.log('Processing payment:', order);
            
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            if(onPayment) {
                onPayment(order);
            }
            
        } catch (error) {
            setError('Payment failed. Please try again.');
            console.error('Payment error:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="payment-section">
            {error && <div className="payment-error">{error}</div>}
            
            <button 
                className="pay-button"
                onClick={handlePayment}
                disabled={processing || order.total <= 0}
            >
                {processing ? 'Processing...' : `Pay ${order.total.toFixed(2)} JV`}
            </button>
        </div>
    );
};

export default PaymentSection;