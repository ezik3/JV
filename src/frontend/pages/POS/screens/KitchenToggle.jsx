// src/frontend/pages/POS/screens/KitchenToggle.jsx
import React, { useState } from 'react';
import KitchenListView from '../components/Kitchen';
import KitchenGridView from './Kitchen2';

const KitchenToggle = () => {
  const [viewMode, setViewMode] = useState('grid');

  const toggleView = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  return viewMode === 'grid' ? (
    <KitchenGridView onToggleView={toggleView} />
  ) : (
    <KitchenListView onToggleView={toggleView} />
  );
};

export default KitchenToggle;