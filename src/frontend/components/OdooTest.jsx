// src/frontend/components/OdooTest.jsx
import React, { useState, useEffect } from 'react';
import odooApi from '../services/odooApi';

const styles = {
  container: {
    padding: '20px',
    color: 'white',
    maxWidth: '800px',
    margin: '0 auto'
  },
  heading: {
    color: '#00e5ff',
    marginBottom: '20px'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '5px'
  },
  error: {
    color: '#ff4444',
    padding: '10px',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: '5px'
  },
  loading: {
    color: '#00e5ff'
  }
};

const OdooTest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await odooApi.getProducts();
        setProducts(products);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Odoo Products Test</h2>
      {loading && <p style={styles.loading}>Loading products...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}
      <div>
        {products.length > 0 ? (
          <ul style={styles.list}>
            {products.map((product, index) => (
              <li key={index} style={styles.listItem}>
                {product.name} - ${product.list_price}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default OdooTest;
