# 🚀 Quick Start Guide - Nocturne POS

## What You Got

A complete, modern POS interface inspired by nocturne-pos with:
- 🎨 Glass morphism design
- 🌙 Dark theme for nightclubs
- 💜 Purple/cyan neon accents
- 🛒 Full shopping cart functionality
- 📊 Dashboard with stats

## Install & Run (3 Commands)

```bash
# 1. Install new dependencies
npm install clsx tailwind-merge class-variance-authority --legacy-peer-deps

# 2. Start the app
wasp start

# 3. Open in browser
# http://localhost:3000/venue/pos/nocturne/new-order
```

## Access Points

### Main POS Interface
**URL:** `/venue/pos/nocturne/new-order`
- Search menu items
- Filter by category
- Add to cart
- Place orders

### Dashboard
**URL:** `/venue/pos/nocturne/dashboard`
- View sales stats
- Recent orders
- Revenue metrics

## Key Files

### Want to customize colors?
→ Edit `src/frontend/index.css` (lines 30-60)

### Want to add menu items?
→ Edit `src/frontend/context/POSContext.jsx` (lines 15-25)

### Want to change navigation?
→ Edit `src/frontend/pages/POS/NocturnePOS/Sidebar.jsx` (lines 16-28)

## Features You Can Use Right Now

✅ Click menu items to add to cart
✅ Use +/- buttons to adjust quantity
✅ Click trash icon to remove items
✅ Search for items with search bar
✅ Filter by category tabs
✅ See real-time total calculation
✅ Click "Place Order" to create order
✅ Click "Clear Cart" to empty cart

## Customization Quick Reference

### Change Primary Color (Purple)
```css
/* In src/frontend/index.css */
--primary: 263 70% 60%;  /* Change these numbers */
```

### Change Accent Color (Cyan)
```css
/* In src/frontend/index.css */
--accent: 176 70% 50%;  /* Change these numbers */
```

### Add New Menu Item
```javascript
// In src/frontend/context/POSContext.jsx
{ 
  id: '9', 
  name: 'Your Item', 
  description: 'Description here',
  category: 'Drinks',  // or 'Food', 'Champagne', 'VIP Service'
  price: 19.99, 
  available: true 
}
```

## Need More Help?

📖 **Full Guide:** Read `NOCTURNE_POS_GUIDE.md`
🎨 **Visual Guide:** See `VISUAL_GUIDE.md`
📊 **Comparison:** Check `src/frontend/pages/POS/NocturnePOS/COMPARISON.md`
🛠️ **Technical Docs:** View `src/frontend/pages/POS/NocturnePOS/README.md`

## Common Issues

### Styles not loading?
```bash
# Clean and restart
wasp clean
wasp start
```

### Dependencies not installing?
```bash
# Try without tensorflow first
npm remove @tensorflow/tfjs-node @tensorflow-models/blazeface
npm install clsx tailwind-merge class-variance-authority
npm install @tensorflow/tfjs-node @tensorflow-models/blazeface --legacy-peer-deps
```

### Routes not working?
```bash
# Rebuild Wasp
wasp clean && wasp start
```

## What's Next?

1. ✅ **Test it**: Open `/venue/pos/nocturne/new-order` and try it out
2. ✅ **Customize**: Change colors to match your brand
3. ✅ **Connect DB**: Hook up real menu items from your database
4. ✅ **Expand**: Add more pages (Analytics, Staff, Settings)

## Architecture Overview

```
Your App
├── Old POS (still works!)
│   ├── /venue/pos/dashboard
│   ├── /venue/pos/system
│   └── ...existing routes
│
└── New Nocturne POS
    ├── /venue/pos/nocturne/dashboard
    ├── /venue/pos/nocturne/new-order
    └── ...ready for more pages
```

## Support

All code is documented with comments. Each component is modular and can be customized independently. The design uses CSS variables for easy theming.

**You're ready to go! 🎉**

Open `/venue/pos/nocturne/new-order` and start using your new modern POS interface!
