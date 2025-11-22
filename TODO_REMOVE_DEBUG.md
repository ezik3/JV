# TODO: Remove Debug Features & Security Improvements

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

## Security Improvements Needed

### Role Validation
**File:** `src/frontend/pages/POS/POSLayout.jsx`  
**Line:** 21  
**Current Code:** `const userRole = localStorage.getItem('venueRole') || 'staff';`

**Issue:** Using localStorage for role determination without validation is a security risk. Roles can be manipulated client-side.

**Recommended Fix:**
```jsx
// Option 1: Use VenueAuthContext to get authenticated role
import { useVenueAuth } from '../../context/VenueAuthContext';

const POSLayout = () => {
  const { user } = useVenueAuth();
  const userRole = user?.role || 'staff';
  // ...
};

// Option 2: Verify role with backend on mount
const [userRole, setUserRole] = useState('staff');
useEffect(() => {
  fetch('/api/venue/verify-role')
    .then(res => res.json())
    .then(data => setUserRole(data.role))
    .catch(() => setUserRole('staff'));
}, []);
```

**Priority:** HIGH - This affects access control

## Code Quality Improvements

### JV-LIST Placeholder
**File:** `src/frontend/pages/POS/POSLayout.jsx`  
**Line:** 38  
**Current Code:** `render={() => <div>JV-LIST - Coming Soon</div>}`

**Suggestion:** Create a dedicated placeholder component for consistency:
```jsx
// Create: src/frontend/pages/POS/components/JVList.jsx
const JVList = () => (
  <div className="coming-soon-placeholder">
    <h2>JV-LIST</h2>
    <p>This feature is coming soon</p>
  </div>
);

// Then in POSLayout.jsx:
<Route exact path="/venue/pos/jv-list" component={JVList} />
```

## Testing Checklist

Before removing debug features, verify:
- [ ] Navigate to `/venue/pos/dashboard`
- [ ] Verify Sidebar appears on the left side
- [ ] Click all menu items and verify navigation works
- [ ] Test direct URL access (e.g., `/venue/pos/inventory`)
- [ ] Verify no console errors
- [ ] Verify POSProvider context works (no "usePOS must be used within a POSProvider" errors)
- [ ] Test with both 'manager' and 'staff' roles
- [ ] Verify role-based menu items display correctly

Once all items are checked, remove the lime border and commit the cleanup.

## Commands

### Remove Lime Border
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

### Implement Role Validation
```bash
# Review the VenueAuthContext to understand available properties
cat src/frontend/context/VenueAuthContext.jsx

# Update POSLayout to use authenticated role
nano src/frontend/pages/POS/POSLayout.jsx

# Test thoroughly
npm run dev
```
