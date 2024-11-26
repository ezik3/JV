import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export function GenerateKeys() {
    const [confetti, setConfetti] = useState([]);
    const history = useHistory();

    const generateKeys = () => {
        alert("VIP keys generated! In a real scenario, these would be securely created and provided to you. Welcome to the elite circle of Joint Vibe!");
        createConfetti();
        // Redirect to VenueOwnerHome page after generating keys
        history.push('/venue/home');
    };

    const createConfetti = () => {
        const newConfetti = [];
        for (let i = 0; i < 50; i++) {
            newConfetti.push({
                left: Math.random() * window.innerWidth,
                animationDuration: (Math.random() * 3 + 2),
                opacity: Math.random(),
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#feb236', '#ff4081'][Math.floor(Math.random() * 4)]
            });
        }
        setConfetti(newConfetti);
        setTimeout(() => setConfetti([]), 5000);
    };

    const styles = {
        body: {
            margin: 0,
            padding: 0,
            fontFamily: "'Poppins', sans-serif",
            background: 'linear-gradient(135deg, #1a1a1a, #2c2c2c)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            color: '#fff',
        },
        container: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            padding: '40px',
            width: '90%',
            maxWidth: '450px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.18)',
        },
        logo: {
            width: '100px',
            height: '100px',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            borderRadius: '50%',
            margin: '0 auto 30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '32px',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
        },
        h1: {
            color: '#ff6b6b',
            fontSize: '28px',
            marginBottom: '15px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        },
        p: {
            color: '#e0e0e0',
            fontSize: '16px',
            marginBottom: '25px',
            lineHeight: 1.6,
        },
        warning: {
            background: 'rgba(255, 87, 51, 0.2)',
            border: '1px solid #ff5733',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '25px',
            fontSize: '14px',
            color: '#ffcccb',
        },
        button: {
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '15px 30px',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(78, 205, 196, 0.4)',
        },
        confetti: {
            position: 'fixed',
            width: '10px',
            height: '10px',
            pointerEvents: 'none',
        },
    };

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                <div style={styles.logo}>JV</div>
                <h1 style={styles.h1}>VIP Access Granted!</h1>
                <p style={styles.p}>Welcome to the exclusive world of Joint Vibe! Your VIP account is ready to elevate your nightlife experience.</p>
                <div style={styles.warning}>
                    <strong>Attention VIP:</strong> Click below to generate your exclusive access keys. These keys are your passport to premium features and events. Guard them as closely as your favorite vintage champagne – they're irreplaceable!
                </div>
                <button style={styles.button} onClick={generateKeys}>Generate VIP Keys</button>
            </div>
            {confetti.map((c, index) => (
                <div key={index} style={{
                    ...styles.confetti,
                    left: c.left + 'px',
                    animation: `confetti ${c.animationDuration}s ease-in-out`,
                    opacity: c.opacity,
                    backgroundColor: c.backgroundColor,
                }} />
            ))}
            <style>
                {`
                @keyframes confetti {
                    0% { transform: translateY(0) rotateZ(0deg); opacity: 1; }
                    100% { transform: translateY(1000px) rotateZ(720deg); opacity: 0; }
                }
                `}
            </style>
        </div>
    );
}

export default GenerateKeys;