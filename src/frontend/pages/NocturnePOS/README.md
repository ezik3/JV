# Nocturne POS Directory

## 📍 Purpose

This directory is reserved for the **Nocturne POS** system when it becomes available.

## 📂 What Goes Here

When you integrate the nocturne-pos repository, copy or clone its contents into this directory:

```
NocturnePOS/
├── components/      # Nocturne POS components
├── pages/          # Nocturne POS pages
├── styles/         # Nocturne POS styles
├── utils/          # Nocturne POS utilities
├── config/         # Nocturne POS configuration
├── Main.jsx        # Main entry point
└── README.md       # Nocturne POS documentation
```

## 🚀 Integration Methods

### Git Submodule (Recommended)
```bash
cd /home/runner/work/JV/JV
git submodule add https://github.com/ezik3/nocturne-pos.git src/frontend/pages/NocturnePOS
git submodule update --init --recursive
```

### Direct Copy
```bash
# Clone nocturne-pos elsewhere
cd /tmp
git clone https://github.com/ezik3/nocturne-pos.git

# Copy to this directory
cp -r nocturne-pos/src/* /home/runner/work/JV/JV/src/frontend/pages/NocturnePOS/
```

## ⚙️ After Integration

1. Update the import in `../POS/POSAdapter.jsx`:
   ```javascript
   const NocturnePOS = lazy(() => import('../../NocturnePOS/Main'));
   ```

2. Switch to Nocturne POS in `../POS/config/posConfig.js`:
   ```javascript
   export const ACTIVE_POS_SYSTEM = POS_SYSTEMS.NOCTURNE;
   ```

3. Update feature configuration in `posConfig.js` to match Nocturne POS capabilities

4. Test thoroughly before merging to main

## 📚 Documentation

- **Integration Guide**: `/INTEGRATION_GUIDE.md`
- **Quick Start**: `/NOCTURNE_INTEGRATION.md`
- **POS Config**: `../POS/config/posConfig.js`
- **POS Adapter**: `../POS/POSAdapter.jsx`

## ⚠️ Important Notes

- This directory is currently empty and waiting for nocturne-pos integration
- Do not commit empty directories - add a `.gitkeep` file if needed
- Ensure nocturne-pos components are compatible with React
- Map API calls to JV backend endpoints
- Use JV's authentication system

## 🔗 Links

- **JV Repository**: https://github.com/ezik3/JV
- **Nocturne POS**: https://github.com/ezik3/nocturne-pos (when available)

---

**Status**: Awaiting nocturne-pos integration
**Created**: 2025-11-14
