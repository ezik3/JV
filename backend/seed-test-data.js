/**
 * Test Data Seeding Script
 * This script adds sample menu items for testing purposes
 * Run with: node backend/seed-test-data.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const MenuItem = require('./models/menu');
const User = require('./models/user');

const sampleMenuItems = [
  {
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and our special sauce',
    price: 12.99,
    category: 'Burgers',
    available: true
  },
  {
    name: 'Chicken Caesar Salad',
    description: 'Fresh romaine lettuce with grilled chicken, parmesan, and Caesar dressing',
    price: 10.99,
    category: 'Salads',
    available: true
  },
  {
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, and basil',
    price: 14.99,
    category: 'Pizza',
    available: true
  },
  {
    name: 'French Fries',
    description: 'Crispy golden fries served with ketchup',
    price: 4.99,
    category: 'Sides',
    available: true
  },
  {
    name: 'Coca-Cola',
    description: 'Classic Coke - 12oz can',
    price: 2.99,
    category: 'Beverages',
    available: true
  },
  {
    name: 'Beer - Craft IPA',
    description: 'Local craft IPA on tap',
    price: 6.99,
    category: 'Beverages',
    available: true
  },
  {
    name: 'Chicken Wings',
    description: '10 pieces with your choice of sauce',
    price: 11.99,
    category: 'Appetizers',
    available: true
  },
  {
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie with vanilla ice cream',
    price: 6.99,
    category: 'Desserts',
    available: true
  }
];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    // Find a venue user (or use a specific venueId)
    const venueUser = await User.findOne({ role: 'venue' });
    
    if (!venueUser) {
      console.log('No venue user found. Please create a venue first.');
      console.log('You can register a venue through the UI or create one manually.');
      process.exit(1);
    }

    console.log(`Found venue: ${venueUser.venueName || venueUser.username} (ID: ${venueUser._id})`);

    // Check if menu items already exist for this venue
    const existingItems = await MenuItem.find({ venueId: venueUser._id });
    if (existingItems.length > 0) {
      console.log(`Venue already has ${existingItems.length} menu items.`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('Delete and re-seed? (yes/no): ', resolve);
      });
      readline.close();
      
      if (answer.toLowerCase() === 'yes') {
        await MenuItem.deleteMany({ venueId: venueUser._id });
        console.log('Deleted existing menu items.');
      } else {
        console.log('Keeping existing menu items. Exiting.');
        process.exit(0);
      }
    }

    // Add venueId to each menu item and save
    const menuItemsWithVenue = sampleMenuItems.map(item => ({
      ...item,
      venueId: venueUser._id
    }));

    const createdItems = await MenuItem.insertMany(menuItemsWithVenue);
    console.log(`✅ Successfully created ${createdItems.length} menu items for ${venueUser.venueName || venueUser.username}`);
    
    // Display summary
    console.log('\n📋 Menu Items Summary:');
    const categories = {};
    createdItems.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });
    
    Object.entries(categories).forEach(([category, items]) => {
      console.log(`\n${category}:`);
      items.forEach(item => {
        console.log(`  - ${item.name}: $${item.price.toFixed(2)}`);
      });
    });

    console.log('\n✅ Seeding completed successfully!');
    console.log(`\nYou can now test ordering with venueId: ${venueUser._id}`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the seeding function
seedData();
