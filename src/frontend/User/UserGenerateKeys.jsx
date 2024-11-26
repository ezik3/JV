import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// BIP39 word list - standardized list of 2048 words
const wordList = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
    'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
    'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
    'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
    // ... (full list would be included here)
];

export function UserGenerateKeys() {
    const [seedPhrase, setSeedPhrase] = useState([]);
    const [isRevealed, setIsRevealed] = useState(false);
    const [confetti, setConfetti] = useState([]);
    const history = useHistory();

    const generateSeedPhrase = () => {
      const phrase = [];
      const usedIndices = new Set();

      while (phrase.length < 12) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        if (!usedIndices.has(randomIndex)) {
          usedIndices.add(randomIndex);
          phrase.push(wordList[randomIndex]);
        }
      }
      return phrase;
    };

    const handleReveal = () => {
      const newPhrase = generateSeedPhrase();
      setSeedPhrase(newPhrase);
      setIsRevealed(true);
      createConfetti();
    };

    const handleContinue = () => {
      history.push('/home');
    };

    const createConfetti = () => {
      const newConfetti = Array.from({ length: 50 }, () => ({
        left: Math.random() * window.innerWidth,
        animationDuration: Math.random() * 3 + 2,
        opacity: Math.random(),
        backgroundColor: ['#FFD700', '#00fff2', '#ff00ff'][Math.floor(Math.random() * 3)]
      }));
      setConfetti(newConfetti);
      setTimeout(() => setConfetti([]), 5000);
    };

    const styles = {
      container: {
        minHeight: '100vh',
        background: 'var(--bg-dark, #050505)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '"Orbitron", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      },
      keyBox: {
        background: 'rgba(5, 5, 5, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #00fff2',
        borderRadius: '15px',
        padding: '3rem',
        width: '90%',
        maxWidth: '600px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 0 30px rgba(0, 255, 242, 0.3)',
      },
      title: {
        color: '#00fff2',
        textAlign: 'center',
        fontSize: '2rem',
        marginBottom: '2rem',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        textShadow: '0 0 10px #00fff2',
      },
      seedGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        margin: '2rem 0',
      },
      wordBox: {
        background: 'rgba(0, 255, 242, 0.1)',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid rgba(0, 255, 242, 0.3)',
        color: '#00fff2',
        textAlign: 'center',
        fontSize: '1rem',
        letterSpacing: '1px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      },
      wordNumber: {
        color: 'rgba(0, 255, 242, 0.5)',
        fontSize: '0.8rem',
      },
      button: {
        width: '100%',
        padding: '1rem',
        background: 'transparent',
        border: '2px solid #00fff2',
        color: '#00fff2',
        fontSize: '1.1rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginTop: '20px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
      },
      warning: {
        color: '#ff4444',
        textAlign: 'center',
        marginTop: '1rem',
        padding: '1rem',
        border: '1px solid rgba(255, 68, 68, 0.3)',
        borderRadius: '8px',
        background: 'rgba(255, 68, 68, 0.1)',
      },
      confetti: {
        position: 'fixed',
        width: '10px',
        height: '10px',
        pointerEvents: 'none',
      },
    };

    return (
      <div style={styles.container}>
        <div style={styles.keyBox}>
          <h2 style={styles.title}>Your Recovery Phrase</h2>
        
          {!isRevealed ? (
            <>
              <p style={{ color: '#fff', textAlign: 'center', marginBottom: '2rem' }}>
                You are about to generate your unique 12-word recovery phrase.
                Keep it safe and never share it with anyone.
              </p>
              <button style={styles.button} onClick={handleReveal}>
                Generate Recovery Phrase
              </button>
            </>
          ) : (
            <>
              <div style={styles.seedGrid}>
                {seedPhrase.map((word, index) => (
                  <div key={index} style={styles.wordBox}>
                    <span style={styles.wordNumber}>{index + 1}.</span>
                    {word}
                  </div>
                ))}
              </div>
              <div style={styles.warning}>
                Warning: Store these 12 words securely. They are the only way to recover your account if you lose access.
              </div>
              <button style={styles.button} onClick={handleContinue}>
                I've Secured My Phrase
              </button>
            </>
          )}
        </div>

        {confetti.map((c, index) => (
          <div
            key={index}
            style={{
              ...styles.confetti,
              left: c.left + 'px',
              animation: `confetti ${c.animationDuration}s ease-in-out`,
              opacity: c.opacity,
              backgroundColor: c.backgroundColor,
            }}
          />
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

export default UserGenerateKeys;