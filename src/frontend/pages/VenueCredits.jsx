import React, { useState } from 'react';
import './VenueCredits.css';

const VenueCredits = () => {
    const [modalDisplay, setModalDisplay] = useState('none');
    const [purchaseDetails, setPurchaseDetails] = useState('');

    const handleBuyClick = (e, duration, packageType, price, notifications) => {
        e.stopPropagation();
        const details = `You are about to purchase a ${packageType} for ${duration}.<br>
                         You'll Receive ${notifications} Push Notifications.<br>
                         Cost: ${price}`;
        setPurchaseDetails(details);
        setModalDisplay('block');
    };

    const handleConfirmPurchase = () => {
        alert('Purchase confirmed! Proceeding to checkout...');
        setModalDisplay('none');
    };

    const handleCancelPurchase = () => {
        setModalDisplay('none');
    };

    const handleModalClick = (event) => {
        if (event.target.id === 'purchaseModal') {
            setModalDisplay('none');
        }
    };

    const renderTable = (title, data, isStandard = false) => (
        <div className="table-container">
            <h3>{title}</h3>
            <table>
                <thead>
                    <tr>
                        <th>{isStandard ? 'Duration' : 'Notifications'}</th>
                        <th>Local {isStandard ? '(≤ 25 km)' : ''}</th>
                        <th>Regional {isStandard ? '(≤ 100 km)' : ''}</th>
                        <th>State</th>
                        <th>National</th>
                        <th>International</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row[0]}</td>
                            {row.slice(1).map((price, idx) => (
                                <td key={idx}>
                                    ${price.toFixed(2)} 
                                    <button className="buy-btn" onClick={(e) => handleBuyClick(e, row[0], title, price.toFixed(2), isStandard ? '12' : row[0])}>
                                        Buy
                                    </button>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const standardPackages = [
        ['1 month', 40, 50, 60, 80, 120],
        ['3 months', 100, 125, 150, 200, 300],
        ['6 months', 175, 218.75, 262.50, 360, 525],
        ['12 months', 250, 312.50, 375, 500, 750]
    ];

    const additionalMonthly = [
        ['5', 17, 21.25, 25.50, 34, 51],
        ['10', 32, 40, 48, 64, 96],
        ['25', 70, 87.50, 105, 140, 210],
        ['50', 120, 150, 180, 240, 360]
    ];

    const additional6Months = [
        ['60', 144, 180, 216, 288, 432],
        ['120', 264, 330, 396, 528, 792],
        ['180', 360, 450, 540, 720, 1080],
        ['240', 432, 540, 648, 864, 1296]
    ];

    const additional12Months = [
        ['240', 432, 540, 648, 864, 1296],
        ['360', 612, 765, 918, 1224, 1836],
        ['480', 768, 960, 1152, 1536, 2304],
        ['600', 900, 1125, 1350, 1800, 2700]
    ];

    return (
        <div className="container">
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/menu">Menu</a></li>
                    <li><a href="/orders">Orders</a></li>
                    <li><a href="/credits" className="active">Credits</a></li>
                    <li><a href="/assign">Assign</a></li>
                    <li><a href="/notifications">Notifications</a></li>
                    <li><a href="/messages">Messages</a></li>
                    <li><a href="/account">Account</a></li>
                    <li><a href="/settings">Settings</a></li>
                </ul>
            </nav>

            <div className="credits-container">
                <h1>Push Notification Credits</h1>
                
                <div className="package-section">
                    <h2>Standard Packages (12 notifications per month)</h2>
                    {renderTable('Standard Packages', standardPackages, true)}
                </div>
                
                <div className="package-section">
                    <h2>Additional Notifications Packages</h2>
                    {renderTable('Per Month', additionalMonthly)}
                    {renderTable('Per 6 Months', additional6Months)}
                    {renderTable('Per 12 Months', additional12Months)}
                </div>
            </div>

            <div id="purchaseModal" className="modal" style={{display: modalDisplay}} onClick={handleModalClick}>
                <div className="modal-content">
                    <h2>Confirm Purchase</h2>
                    <p id="purchaseDetails" dangerouslySetInnerHTML={{__html: purchaseDetails}}></p>
                    <button id="confirmPurchase" className="confirm-btn" onClick={handleConfirmPurchase}>Confirm Purchase</button>
                    <button id="cancelPurchase" className="cancel-btn" onClick={handleCancelPurchase}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default VenueCredits;