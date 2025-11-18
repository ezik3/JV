# Wasp Setup and Installation Guide

## 📋 Overview

This guide explains how to install Wasp, set up the database, and run the POS-integrated Wasp project.

## 🔧 Prerequisites

- Node.js 18+ and npm
- Linux, macOS, or WSL on Windows
- Terminal/shell access

## 📦 Step 1: Install Wasp CLI

### On Linux / macOS:

```bash
curl -sSL https://get.wasp-lang.dev/installer.sh | sh
```

### Verify Installation:

```bash
wasp version
```

Expected output: `0.14.2` or similar

### Add Wasp to PATH (if needed):

```bash
export PATH="$HOME/.local/bin:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## 🗄️ Step 2: Set Up Database

Wasp uses Prisma with SQLite by default. The schema is ready at `/schema.prisma`.

### Run Database Migration:

```bash
cd /home/user/JV
wasp db migrate-dev --name init-pos-system
```

This will:
- Create the SQLite database
- Generate Prisma client
- Create all POS tables (Venue, MenuItem, Order, Staff, etc.)

### If migration fails:

```bash
# Reset database (WARNING: Deletes all data)
wasp db reset

# Then try migration again
wasp db migrate-dev --name init-pos-system
```

## 🚀 Step 3: Build and Start the Project

### Clean Build (recommended first time):

```bash
wasp clean
wasp build
```

### Start Development Server:

```bash
wasp start
```

This will:
- Start the backend server (Node.js + Express)
- Start the frontend dev server (Vite + React)
- Open browser at `http://localhost:3000`

Expected output:
```
[ Server ] Server listening on port 3001
[ Client ] VITE ready in X ms
[ Client ] ➜ Local: http://localhost:3000/
```

## 🔍 Step 4: Verify Everything Works

### Check for TypeScript Errors:

When you run `wasp start`, watch for compilation errors. If successful, you should see:
- No TypeScript errors
- Server and client both running
- No import errors

### Test the POS Pages:

Navigate to these URLs:
- Main POS: `http://localhost:3000/venue/pos`
- Dashboard: `http://localhost:3000/venue/pos/dashboard`
- Orders: `http://localhost:3000/venue/pos/orders`
- Inventory: `http://localhost:3000/venue/pos/inventory`
- Menu Builder: `http://localhost:3000/venue/pos/menu`

## ⚠️ Common Issues

### Issue 1: "wasp: command not found"

**Solution:**
```bash
export PATH="$HOME/.local/bin:$PATH"
wasp version
```

### Issue 2: "Module not found: wasp/client/operations"

**Cause:** Wasp hasn't been built yet, so the SDK doesn't exist.

**Solution:**
```bash
wasp clean
wasp build
wasp start
```

### Issue 3: Database Migration Errors

**Solution:**
```bash
# Check if database is locked
rm -f .wasp/out/db/vibe.db-shm .wasp/out/db/vibe.db-wal

# Reset and migrate
wasp db reset
wasp db migrate-dev --name fresh-start
```

### Issue 4: Port Already in Use

**Solution:**
```bash
# Find and kill process on port 3000 or 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Then restart
wasp start
```

### Issue 5: npm Dependencies Missing

**Cause:** The `wasp` package depends on `.wasp/out/sdk/wasp` which is created during build.

**Solution:**
```bash
# Wasp build creates the SDK
wasp build

# After build, dependencies should resolve
npm list | grep wasp
```

## 🛠️ Development Workflow

### Making Changes:

1. **Edit schema.prisma** → Run `wasp db migrate-dev`
2. **Edit main.wasp** → Restart `wasp start`
3. **Edit React components** → Hot reload automatic
4. **Edit backend code** → Automatic restart

### Useful Commands:

```bash
# View database
wasp db studio

# Generate Prisma client
wasp db generate-client

# Check Wasp status
wasp info

# Clean build artifacts
wasp clean

# View logs
wasp start --debug
```

## 📊 Database Seeding (Optional)

To add sample data for testing, create `src/seed.js`:

```javascript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create a test venue
  const venue = await prisma.venue.create({
    data: {
      name: 'Test Venue',
      address: '123 Main St',
      user: {
        connect: { id: 1 } // Adjust to match your user ID
      }
    }
  })

  // Create menu categories
  const category = await prisma.menuCategory.create({
    data: {
      name: 'Drinks',
      icon: '🍹',
      venueId: venue.id
    }
  })

  // Add menu items
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Premium Vodka Cocktail',
        description: 'Signature cocktail',
        price: 12.99,
        categoryId: category.id,
        venueId: venue.id
      },
      {
        name: 'Craft Beer',
        description: 'Local craft beer',
        price: 8.99,
        categoryId: category.id,
        venueId: venue.id
      }
    ]
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run seeding:
```bash
node src/seed.js
```

## ✅ Success Checklist

- [ ] Wasp CLI installed and in PATH
- [ ] `wasp version` shows 0.14.2
- [ ] `wasp db migrate-dev` completes successfully
- [ ] `wasp build` completes without errors
- [ ] `wasp start` runs both server and client
- [ ] No TypeScript compilation errors
- [ ] POS pages load in browser
- [ ] Database queries work (check browser console)

## 📞 Getting Help

If you encounter issues:

1. **Check Wasp docs:** https://wasp-lang.dev/docs
2. **Check this project's handoff doc:** `/home/user/JV/WASP_POS_FIX_HANDOFF.md`
3. **View Wasp logs:** The terminal output from `wasp start` shows errors
4. **Check browser console:** Look for network errors or React errors

## 🎯 Next Steps After Setup

Once Wasp is running successfully:

1. ✅ Verify all POS pages render
2. ✅ Test menu item creation
3. ✅ Test order placement
4. ✅ Test staff management
5. ✅ Test inventory updates
6. ✅ Review and fix any remaining errors
7. ✅ Add sample data for demo

---

**Document Created:** 2025-11-18
**For Project:** JoinVibe POS System
**Wasp Version:** 0.14.2
