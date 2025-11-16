# Visual Guide: Nocturne POS Interface

## Layout Overview

The Nocturne POS uses a sidebar + main content layout with glass morphism effects:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         NOCTURNE POS INTERFACE                              │
└────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┬──────────────────────────────────────────────────────────┐
│                 │                                                          │
│   SIDEBAR       │                   MAIN CONTENT                           │
│   (Glass)       │                                                          │
│                 │                                                          │
│  ┌───────────┐  │                                                          │
│  │ JV POS    │  │                                                          │
│  │ Night     │  │                                                          │
│  │ Venue     │  │                                                          │
│  └───────────┘  │                                                          │
│                 │                                                          │
│  🏠 Dashboard   │                                                          │
│  🛒 New Order   │                                                          │
│  📋 Orders      │                                                          │
│  📖 Menu        │                                                          │
│  📦 Inventory   │                                                          │
│  📊 Analytics   │                                                          │
│  👥 Staff       │                                                          │
│  ⚙️  Settings   │                                                          │
│                 │                                                          │
└─────────────────┴──────────────────────────────────────────────────────────┘
```

## Dashboard View

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Dashboard                                                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ 💰 Total   │  │ 🛒 Orders  │  │ 👥 Active  │  │ 📈 Revenue │        │
│  │ Sales      │  │ Today      │  │ Tables     │  │            │        │
│  │ $12,345    │  │ 145        │  │ 23         │  │ $8,234     │        │
│  │ +12.5% ▲   │  │ +8.2% ▲    │  │ +3.1% ▲    │  │ +15.3% ▲   │        │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘        │
│                                                                           │
│  ┌──────────────────────────────────────────┐  ┌─────────────────┐     │
│  │ Recent Orders                             │  │ Quick Stats     │     │
│  ├──────────────────────────────────────────┤  ├─────────────────┤     │
│  │ Order #1234           Table 5 • 2 items  │  │ Avg Order Value │     │
│  │ $45.99               [Pending]           │  │ $32.50          │     │
│  │                                          │  │                 │     │
│  │ Order #1235           Table 8 • 5 items  │  │ Peak Hour       │     │
│  │ $89.50               [Preparing]         │  │ 9:00 PM         │     │
│  └──────────────────────────────────────────┘  └─────────────────┘     │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

## New Order View (Main POS Interface)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  New Order                                                                        │
├───────────────────────────────────────────────────┬───────────────────────────────┤
│                                                   │                               │
│  🔍 [Search menu...]                              │  Current Order                │
│                                                   │  Order ORD-1234567890         │
│  [All] [Drinks] [Food] [Champagne] [VIP Service] │                               │
│  Grid | List                                      │  ┌─────────────────────────┐ │
│                                                   │  │ Vodka Cocktail   $12.99 │ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │  │ [-] 2 [+]        $25.98 │ │
│  │  🍽️      │ │  🍽️      │ │  🍽️      │         │  └─────────────────────────┘ │
│  │          │ │          │ │          │         │                               │
│  │ Vodka    │ │ Whiskey  │ │ Mojito   │         │  ┌─────────────────────────┐ │
│  │ Cocktail │ │ Sour     │ │          │         │  │ Nachos           $12.99 │ │
│  │ Premium  │ │ Classic  │ │ Fresh    │         │  │ [-] 1 [+]        $12.99 │ │
│  │ $12.99   │ │ $14.99   │ │ $11.99   │         │  └─────────────────────────┘ │
│  └──────────┘ └──────────┘ └──────────┘         │                               │
│                                                   │  ───────────────────────────  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │  Subtotal:           $38.97   │
│  │  🍽️      │ │  🍽️      │ │  🍽️      │         │  Tax (10%):           $3.90   │
│  │          │ │          │ │          │         │  ───────────────────────────  │
│  │ Margarita│ │ Champagne│ │ VIP      │         │  Total:              $42.87   │
│  │ Classic  │ │ Dom      │ │ Bottle   │         │                               │
│  │ $13.99   │ │ Perignon │ │ Service  │         │  ┌─────────────────────────┐ │
│  └──────────┘ │ $299.99  │ │ $599.99  │         │  │   Place Order   💳      │ │
│               └──────────┘ └──────────┘         │  └─────────────────────────┘ │
│                                                   │                               │
│                                                   │  [Clear Cart]                 │
│                                                   │                               │
└───────────────────────────────────────────────────┴───────────────────────────────┘
```

## Color Scheme

### Dark Mode (Default)
```
Background:        #0f1117  (Dark blue-grey)
Foreground:        #f8f9fa  (Off-white)
Primary:           #8b5cf6  (Purple)
Accent:            #22d3ee  (Cyan)
Glass Background:  rgba(15, 17, 23, 0.8) with backdrop-blur
Borders:           rgba(255, 255, 255, 0.1)
```

### Neon Effects
```
Glow (Hover):      Purple/cyan with box-shadow
Active Items:      Purple background with neon glow
Buttons:           Purple with subtle glow on hover
```

## Interactive Elements

### Buttons
```
┌─────────────────────┐
│   Primary Button    │  ← Purple with neon glow
└─────────────────────┘

┌─────────────────────┐
│  Outline Button     │  ← Transparent with border
└─────────────────────┘

┌─────────────────────┐
│   Ghost Button      │  ← No border, subtle hover
└─────────────────────┘
```

### Cards (Glass Morphism)
```
┌─────────────────────────────────┐
│ ╔═══════════════════════════╗   │
│ ║                           ║   │  ← Translucent with blur
│ ║  Card Content             ║   │  ← Subtle border glow
│ ║                           ║   │  ← Shadow effect
│ ╚═══════════════════════════╝   │
└─────────────────────────────────┘
```

### Menu Items (Hover Effect)
```
Normal State:
┌──────────┐
│  🍽️      │
│          │
│ Item     │
│ $12.99   │
└──────────┘

Hover State:
╔══════════╗  ← Brighter
║  🍽️      ║  ← Neon glow
║          ║  ← Lifted shadow
║ Item     ║
║ $12.99   ║
╚══════════╝
```

## Responsive Behavior

### Desktop (1920x1080)
- Menu grid: 4 columns
- Cards: Large with full details
- Sidebar: Always visible

### Tablet (768x1024)
- Menu grid: 3 columns
- Cards: Medium size
- Sidebar: Collapsible

### Mobile (375x667)
- Menu grid: 2 columns
- Cards: Compact
- Sidebar: Drawer

## Animation Effects

1. **Hover Transitions**: 0.3s ease
2. **Button Clicks**: Scale down slightly
3. **Cart Updates**: Smooth fade in/out
4. **Modal Overlays**: Backdrop blur animation
5. **Neon Glow**: Pulsing effect on active elements

## Typography

- **Headings**: Poppins, Bold, 24-32px
- **Body**: Poppins, Regular, 14-16px
- **Captions**: Poppins, Light, 12-14px
- **Numbers**: Poppins, Semibold (for prices)

## Icon Usage

Using Lucide React icons throughout:
- 🏠 LayoutDashboard
- 🛒 ShoppingCart
- 📋 UtensilsCrossed
- 📖 Menu
- 📦 Package
- 📊 BarChart3
- 👥 Users
- ⚙️ Settings
- 🔍 Search
- ➕ Plus
- ➖ Minus
- 🗑️ Trash2
