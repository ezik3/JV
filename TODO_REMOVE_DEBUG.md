# TODO: Remove Debug Features

## Temporary Debugging Features

### Sidebar Lime Border
**File:** `src/frontend/components/Sidebar.jsx`  
**Line:** 24  
**Code:** `style={{ border: '3px solid lime' }}`

**Purpose:** Temporary visual indicator to verify Sidebar is rendering and visible during initial testing.

**Action Required:** 
1. Test POS pages in browser
2. Verify Sidebar is visible
3. Remove the lime border style attribute:
   ```jsx
   // Change this:
   <aside className="pos-sidebar" style={{ border: '3px solid lime' }}>
   
   // To this:
   <aside className="pos-sidebar">
   ```

## Testing Checklist

Before removing debug features, verify:
- [ ] Navigate to `/venue/pos/dashboard`
- [ ] Verify Sidebar appears on the left side
- [ ] Click all menu items and verify navigation works
- [ ] Test direct URL access (e.g., `/venue/pos/inventory`)
- [ ] Verify no console errors
- [ ] Verify POSProvider context works (no "usePOS must be used within a POSProvider" errors)

Once all items are checked, remove the lime border and commit the cleanup.

## Command to Remove Lime Border

```bash
# Edit the file
nano src/frontend/components/Sidebar.jsx

# Or use sed to remove it automatically
sed -i 's/ style={{ border: '\''3px solid lime'\'' }}//' src/frontend/components/Sidebar.jsx

# Verify the change
git diff src/frontend/components/Sidebar.jsx

# Commit the cleanup
git add src/frontend/components/Sidebar.jsx
git commit -m "Remove temporary lime border from Sidebar"
git push
```
