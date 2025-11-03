# Known Limitations and Future Enhancements

This document tracks known limitations in the current implementation and planned future enhancements.

## Current Limitations

### Real-Time Notifications (Partial Implementation)

**Status:** Socket.IO infrastructure exists but not fully integrated with Wasp routes

**What Works:**
- Backend routes (`/api/orders/pos/*`) emit Socket.IO events
- Frontend components (VenueOrders) listen for real-time updates
- POS order creation triggers `newOrder` event
- Order status updates trigger `orderStatusUpdated` event

**What Doesn't Work:**
- Wasp API routes (`/api/orders/place-order`, etc.) cannot emit Socket.IO events
- Customer order notifications not implemented
- Real-time menu updates not implemented

**Why:**
- Wasp routes don't have direct access to Socket.IO instance
- Would require middleware to pass Socket.IO context to Wasp handlers
- Current workaround: Backend routes handle real-time notifications

**Workaround:**
- Customer orders placed through backend routes DO trigger real-time events
- Venue dashboard receives real-time order notifications
- Order status updates propagate to both venue and customer

**Future Enhancement:**
```javascript
// Potential solution: Pass Socket.IO via middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Then in Wasp routes:
export const placeOrder = async (req, res, context) => {
  // ... save order ...
  req.io?.to(`venue_${venueId}`).emit('newOrder', order);
};
```

**TODO Locations:**
- `src/backend/routes/orders.js:116-117` - placeOrder real-time notification
- `src/backend/routes/orders.js:231` - updateOrderStatus customer notification

---

### Path Resolution in Wasp Routes

**Status:** Works but fragile

**Issue:**
The Wasp routes use relative path resolution to import MongoDB models:
```javascript
const orderModelPath = path.resolve(__dirname, '../../../backend/models/order.js');
```

**Why:**
- Wasp routes are in `src/backend/routes/`
- MongoDB models are in `backend/models/`
- Need to traverse directory structure to import CommonJS modules into ES modules

**Risk:**
- Breaking if directory structure changes
- Complex path resolution logic
- Mix of ES modules and CommonJS

**Affected Files:**
- `src/backend/routes/orders.js:8-10`
- `src/backend/routes/menuRoutes.js:8-9`

**Future Enhancement:**
- Standardize on ES modules throughout
- Use module path mapping in build config
- Or migrate MongoDB models to Prisma (match Wasp's preferred ORM)

---

### Payment Processing

**Status:** Not implemented

**Current Behavior:**
- Orders are created with `paymentStatus: 'pending'`
- Payment method defaults to 'jvcoin'
- No actual payment processing occurs

**Required:**
1. JVCoin wallet integration
2. Stripe payment processing
3. Payment verification
4. Payment failure handling
5. Refund processing

**TODO:**
- Implement JVCoin balance checking
- Implement Stripe checkout flow
- Add payment webhooks
- Add transaction logging

---

### Order Cancellation

**Status:** Not implemented

**Current Behavior:**
- Orders can be marked as 'cancelled' via status update
- No dedicated cancellation flow
- No refund logic

**Required:**
1. Customer-initiated cancellation
2. Time-based cancellation rules (e.g., can't cancel after 5 minutes)
3. Refund processing if payment was completed
4. Notification to venue

---

### Menu Image Uploads

**Status:** Not implemented

**Current Behavior:**
- Menu items have an `image` field
- No upload functionality
- Images not displayed

**Required:**
1. File upload endpoint
2. Image storage (S3/local)
3. Image optimization/resizing
4. Display in menu components

---

### Customer Order History UI

**Status:** Backend exists, frontend missing

**What Exists:**
- `/api/orders/my-orders` endpoint works
- `/api/orders/:orderId` endpoint works
- Order status tracking works

**What's Missing:**
- Customer-facing order history page
- Order details view
- Order tracking UI
- Reorder functionality

**TODO:**
- Create `/orders` or `/my-orders` page
- Display order history with status
- Allow viewing order details
- Add reorder button

---

### Input Validation Edge Cases

**Status:** Basic validation implemented

**Covered:**
- ObjectId format validation
- Required field validation
- Order amount range (0-100,000)
- Status enum validation

**Not Covered:**
- Item name length limits
- Maximum items per order
- Duplicate item detection
- Special characters in names
- Price precision validation

---

### Error Handling

**Status:** Basic error handling

**Current:**
- Try-catch blocks in all routes
- Generic error messages
- 500 errors for unexpected issues

**Missing:**
- Detailed error codes
- User-friendly error messages
- Error logging/monitoring
- Retry logic for transient failures

---

### Testing

**Status:** Manual testing only

**Missing:**
- Unit tests for API endpoints
- Integration tests for order flow
- E2E tests for user journeys
- Load testing
- Security testing

**Future:**
- Jest/Mocha for unit tests
- Supertest for API testing
- Playwright for E2E tests

---

### Rate Limiting Scope

**Status:** IP-based rate limiting

**Current:**
- 100 requests per 15 minutes per IP
- Applied to all order endpoints

**Limitations:**
- Multiple users behind NAT share rate limit
- No per-user rate limiting
- No differentiation between endpoints

**Future Enhancement:**
- User-based rate limiting
- Different limits for different endpoints
- Stricter limits for unauthenticated users

---

## Priority Roadmap

### High Priority (Core Functionality):
1. ✅ Menu API implementation
2. ✅ Order placement API
3. ✅ Order status tracking
4. ✅ Venue order management
5. ⏳ Payment processing integration
6. ⏳ Customer order history UI

### Medium Priority (User Experience):
7. ⏳ Real-time notifications (full integration)
8. ⏳ Order cancellation flow
9. ⏳ Menu image uploads
10. ⏳ Better error messages

### Low Priority (Nice to Have):
11. ⏳ Advanced order filtering
12. ⏳ Order analytics
13. ⏳ Customer reviews
14. ⏳ Group ordering/split bills
15. ⏳ Table management

---

## How to Contribute

If you're working on any of these items:

1. Update this document to mark item as "In Progress"
2. Add your name and date
3. Link to the PR or branch
4. Update status when complete

Example:
```markdown
### Payment Processing
**Status:** In Progress (John Doe, 2025-01-15)
**Branch:** feature/payment-integration
**PR:** #123
```
