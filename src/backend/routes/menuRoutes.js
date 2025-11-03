import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the MongoDB MenuItem model
const menuModelPath = path.resolve(__dirname, '../../../backend/models/menu.js');
let MenuItem;

// Dynamically import the MenuItem model
const loadMenuItem = async () => {
  if (!MenuItem) {
    const module = await import(menuModelPath);
    MenuItem = module.default || module;
  }
  return MenuItem;
};

export const getMenu = async (req, res, context) => {
  try {
    const { venueId } = req.query;
    
    if (!venueId) {
      return res.status(400).json({ error: 'venueId is required' });
    }

    // Validate venueId format
    if (!mongoose.Types.ObjectId.isValid(venueId)) {
      return res.status(400).json({ error: 'Invalid venueId format' });
    }

    // Ensure MenuItem model is loaded
    const MenuItemModel = await loadMenuItem();
    
    // Fetch menu items from MongoDB
    const menuItems = await MenuItemModel.find({ 
      venueId: new mongoose.Types.ObjectId(venueId),
      available: true 
    }).sort({ category: 1, name: 1 });
    
    res.json({ items: menuItems });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
};
