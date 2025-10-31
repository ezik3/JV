// Sample menu data for testing the customer menu ordering system
// This can be used to seed the database with example menu items

export const sampleVenue = {
  name: "JointVibe Lounge",
  description: "Experience the best nightlife with amazing food and drinks",
  address: "123 Party Street, Brisbane, QLD",
  allowPreOrder: true,
  isActive: true
};

export const sampleCategories = [
  {
    name: "Signature Cocktails",
    description: "Our premium handcrafted cocktails",
    sortOrder: 1,
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b"
  },
  {
    name: "Premium Spirits",
    description: "Top-shelf spirits and bottle service",
    sortOrder: 2,
    imageUrl: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b"
  },
  {
    name: "Beer & Wine",
    description: "Craft beers and fine wines",
    sortOrder: 3,
    imageUrl: "https://images.unsplash.com/photo-1535958636474-b021ee887b13"
  },
  {
    name: "Food & Snacks",
    description: "Delicious bites to complement your drinks",
    sortOrder: 4,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"
  }
];

export const sampleMenuItems = [
  // Signature Cocktails
  {
    name: "Electric Vibe",
    description: "Vodka, blue curacao, lime juice, and energy drink with a glow-in-the-dark rim",
    price: 15.99,
    categoryName: "Signature Cocktails",
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
    preparationTime: 5,
    calories: 220,
    isAvailable: true
  },
  {
    name: "Tropical Paradise",
    description: "Rum, coconut cream, pineapple juice, and passion fruit",
    price: 14.99,
    categoryName: "Signature Cocktails",
    imageUrl: "https://images.unsplash.com/photo-1546171753-97d7676e4602",
    preparationTime: 5,
    calories: 250,
    isAvailable: true
  },
  {
    name: "Midnight Mojito",
    description: "Dark rum, fresh mint, lime, activated charcoal, and soda",
    price: 13.99,
    categoryName: "Signature Cocktails",
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b",
    preparationTime: 7,
    calories: 180,
    isAvailable: true
  },
  
  // Premium Spirits
  {
    name: "Premium Vodka Bottle",
    description: "750ml bottle of Grey Goose with mixers and ice",
    price: 299.99,
    categoryName: "Premium Spirits",
    imageUrl: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b",
    preparationTime: 10,
    isAvailable: true
  },
  {
    name: "Whiskey Flight",
    description: "Tasting of 3 premium whiskeys - Jack Daniel's, Jameson, and Glenlivet",
    price: 35.99,
    categoryName: "Premium Spirits",
    imageUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8",
    preparationTime: 3,
    calories: 300,
    isAvailable: true
  },
  
  // Beer & Wine
  {
    name: "Craft IPA",
    description: "Local craft IPA with citrus and pine notes",
    price: 8.99,
    categoryName: "Beer & Wine",
    imageUrl: "https://images.unsplash.com/photo-1535958636474-b021ee887b13",
    preparationTime: 2,
    calories: 180,
    isAvailable: true
  },
  {
    name: "Red Wine Glass",
    description: "Cabernet Sauvignon - full-bodied with rich berry flavors",
    price: 12.99,
    categoryName: "Beer & Wine",
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
    preparationTime: 2,
    calories: 125,
    isAvailable: true
  },
  {
    name: "Champagne Bottle",
    description: "Moet & Chandon Imperial - perfect for celebrations",
    price: 199.99,
    categoryName: "Beer & Wine",
    imageUrl: "https://images.unsplash.com/photo-1547595628-c61a29f496f0",
    preparationTime: 5,
    isAvailable: true
  },
  
  // Food & Snacks
  {
    name: "Loaded Nachos",
    description: "Tortilla chips topped with cheese, jalapeños, sour cream, guacamole",
    price: 16.99,
    categoryName: "Food & Snacks",
    imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d",
    preparationTime: 15,
    calories: 850,
    allergens: "Dairy, Gluten",
    isAvailable: true
  },
  {
    name: "Gourmet Burger",
    description: "Angus beef patty, bacon, cheese, lettuce, tomato, special sauce",
    price: 19.99,
    categoryName: "Food & Snacks",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    preparationTime: 20,
    calories: 980,
    allergens: "Gluten, Dairy, Eggs",
    isAvailable: true
  },
  {
    name: "Wings Platter",
    description: "12 crispy chicken wings with choice of sauce (BBQ, Buffalo, or Honey Mustard)",
    price: 18.99,
    categoryName: "Food & Snacks",
    imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2",
    preparationTime: 18,
    calories: 720,
    allergens: "Gluten",
    customizable: true,
    isAvailable: true
  },
  {
    name: "Truffle Fries",
    description: "Crispy fries with truffle oil, parmesan, and fresh herbs",
    price: 12.99,
    categoryName: "Food & Snacks",
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
    preparationTime: 12,
    calories: 420,
    allergens: "Dairy",
    isAvailable: true
  }
];

export const sampleTables = [
  { tableNumber: "T1", capacity: 2, isAvailable: true },
  { tableNumber: "T2", capacity: 4, isAvailable: true },
  { tableNumber: "T3", capacity: 6, isAvailable: false },
  { tableNumber: "T4", capacity: 4, isAvailable: true },
  { tableNumber: "T5", capacity: 2, isAvailable: true },
  { tableNumber: "T6", capacity: 8, isAvailable: true },
  { tableNumber: "VIP1", capacity: 10, isAvailable: false },
  { tableNumber: "VIP2", capacity: 12, isAvailable: true },
  { tableNumber: "Bar1", capacity: 1, isAvailable: true },
  { tableNumber: "Bar2", capacity: 1, isAvailable: true }
];

// Usage example:
// This data can be used to seed the database during development/testing
// Import this file and use Prisma client to create the records
