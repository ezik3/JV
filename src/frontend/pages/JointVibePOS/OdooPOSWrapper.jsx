import React from 'react';

const OdooPOSWrapper = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <iframe
        src="http://localhost:8069/pos/ui"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          flex: 1
        }}
        title="Odoo POS Interface"
      />
    </div>
  );
};

export default OdooPOSWrapper;