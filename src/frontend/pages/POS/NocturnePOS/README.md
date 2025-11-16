# Nocturne POS Interface

This is a modern, glass morphism-styled POS interface inspired by the nocturne-pos repository. It features a dark theme optimized for nightclub and venue environments with neon accents and smooth animations.

## Features

- **Glass Morphism Design**: Translucent panels with backdrop blur effects
- **Dark Theme**: Optimized for low-light nightclub environments
- **Neon Glow Effects**: Interactive elements with subtle neon glows
- **Responsive Grid Layout**: Menu items displayed in an adaptive grid
- **Real-time Cart Management**: Add, remove, and update items in real-time
- **Professional Checkout**: Clean, intuitive checkout interface

## Routes

- `/venue/pos/nocturne/dashboard` - Main dashboard with sales statistics
- `/venue/pos/nocturne/new-order` - New order interface for taking orders

## Components

### POSLayout
Main layout component that provides the sidebar navigation and wraps page content.

### Sidebar
Navigation sidebar with glass morphism styling and neon glow for active items.

### Dashboard
Statistics dashboard showing sales, orders, active tables, and revenue metrics.

### NewOrder
Main POS ordering interface with:
- Menu item grid with search and category filtering
- Shopping cart with quantity controls
- Order summary with subtotal, tax, and total
- Place order and clear cart actions

## Technology Stack

- React 18
- Tailwind CSS with custom theme
- Lucide React icons
- React Hot Toast for notifications
- Glass morphism utilities

## Usage

```jsx
import POSLayout from './POSLayout';
import NewOrder from './NewOrder';

function NewOrderPage() {
  return (
    <POSLayout>
      <NewOrder />
    </POSLayout>
  );
}
```

## Customization

The theme can be customized via CSS variables in `src/frontend/index.css`:

```css
.dark {
  --primary: 263 70% 60%;      /* Purple primary color */
  --accent: 176 70% 50%;        /* Cyan accent color */
  --background: 220 26% 6%;     /* Dark background */
  --neon-glow: 263 70% 60% / 0.5; /* Neon glow effect */
}
```

## Dependencies

The following packages are required (should be in package.json):
- `clsx` - Class name utility
- `tailwind-merge` - Tailwind class merging
- `class-variance-authority` - Component variants
- `lucide-react` - Icon library (already in project)
- `react-hot-toast` - Toast notifications (already in project)
