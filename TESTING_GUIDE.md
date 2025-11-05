# Testing the Core Ordering Functionality

This document outlines how to test the newly implemented core ordering features.

## Prerequisites

1. MongoDB running and accessible
2. Environment variables configured (MONGO_URI)
3. Backend server running on port 5000
4. Frontend application running

## Setup Test Data

### 1. Create a Test Venue User

If you don't have a venue user yet, create one through the venue registration flow:
- Navigate to `/venue-signup`
- Complete the registration process

### 2. Seed Test Menu Items

Run the seeding script to add sample menu items:

```bash
cd backend
node seed-test-data.js
```

This will:
- Find an existing venue user
- Create 8 sample menu items across different categories
- Display the created items

## Testing Checklist

### End-User Flow (Customer):

#### ✅ Search for Venue
- [ ] Navigate to `/venues`
- [ ] Search functionality works
- [ ] Venues are displayed

#### ✅ View Venue Menu
- [ ] Click on a venue or navigate to `/venue/:venueId/ai-waiter`
- [ ] Ask AI waiter to "show menu"
- [ ] Menu items display correctly with prices and descriptions
- [ ] Items are grouped by category

#### ✅ Add Items to Cart
- [ ] Tell AI waiter "I want a burger" or select items
- [ ] Items are added to order
- [ ] Quantities can be adjusted

#### ✅ Checkout and Pay
- [ ] Review order total
- [ ] Click checkout/place order
- [ ] Order is submitted successfully
- [ ] Order ID is returned

#### ✅ Track Order Status
Test the order status endpoint:
```bash
# Get order status (replace ORDER_ID with actual order ID)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/orders/status/ORDER_ID
```

Expected response:
```json
{
  "order": {
    "_id": "...",
    "status": "pending",
    "items": [...],
    "totalAmount": 25.99
  }
}
```

#### ✅ View Order History
```bash
# Get my orders
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/orders/my-orders
```

### Venue Owner Flow:

#### ✅ Login to Dashboard
- [ ] Navigate to `/venue/home`
- [ ] Dashboard loads successfully

#### ✅ See Incoming Orders
- [ ] Navigate to `/venue/orders`
- [ ] Orders page loads
- [ ] Recent orders are displayed
- [ ] Real-time updates work (test by placing an order)

#### ✅ Accept/Update Orders
Test updating order status:
```bash
curl -X PATCH \
  -H "Authorization: Bearer VENUE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}' \
  http://localhost:5000/api/orders/pos/ORDER_ID/status
```

#### ✅ Manage Menu Items
- [ ] Navigate to `/venue/menu` or `/venue/pos/menu`
- [ ] View existing menu items
- [ ] Add new menu items
- [ ] Update menu item availability

## API Endpoints Testing

### Menu APIs

1. **Get Menu Items**
```bash
# Get menu for a specific venue
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/menu/items?venueId=VENUE_ID"
```

Expected response:
```json
{
  "items": [
    {
      "_id": "...",
      "name": "Classic Burger",
      "description": "...",
      "price": 12.99,
      "category": "Burgers",
      "available": true,
      "venueId": "..."
    }
  ]
}
```

### Order APIs

2. **Place Order** (Wasp API)
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "venueId": "VENUE_ID",
    "items": [
      {"name": "Classic Burger", "quantity": 2, "price": 12.99},
      {"name": "French Fries", "quantity": 1, "price": 4.99}
    ],
    "totalAmount": 30.97
  }' \
  http://localhost:3000/api/orders/place-order
```

3. **Get Venue Orders**
```bash
curl -H "Authorization: Bearer VENUE_TOKEN" \
  http://localhost:3000/api/orders/venue/VENUE_ID
```

4. **Update Order Status**
```bash
curl -X PATCH \
  -H "Authorization: Bearer VENUE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}' \
  http://localhost:3000/api/orders/ORDER_ID/status
```

## Real-Time Testing

### Socket.IO Events

1. **Connect to Socket.IO**
```javascript
const socket = io('http://localhost:5000');

// Join venue room (as venue owner)
socket.emit('join', `venue_${venueId}`);

// Listen for new orders
socket.on('newOrder', (order) => {
  console.log('New order received:', order);
});

// Listen for order status updates
socket.on('orderStatusUpdated', (order) => {
  console.log('Order status updated:', order);
});
```

2. **Test Real-Time Flow**
- [ ] Place an order as a customer
- [ ] Verify venue dashboard receives notification immediately
- [ ] Update order status as venue
- [ ] Verify customer receives status update (if listening)

## Known Issues / TODO

1. ❌ Real-time notifications not fully integrated with Wasp Socket.IO
2. ❌ Customer order history page not created yet
3. ❌ Payment processing integration pending
4. ❌ Menu image uploads not implemented
5. ❌ Order cancellation flow not implemented

## Success Criteria

The core ordering flow is working when:

✅ Customer can:
- View venue menu
- Add items to cart
- Place an order
- Receive order confirmation
- Track order status

✅ Venue can:
- Login to dashboard
- View incoming orders in real-time
- Update order status
- Manage menu items

✅ Backend:
- All API endpoints return correct responses
- Orders are persisted to MongoDB
- Menu items are retrieved correctly
- Authentication works properly

## Troubleshooting

### "Failed to fetch menu"
- Check MongoDB connection
- Verify venueId is correct
- Check authentication token

### "Order not created"
- Verify MongoDB is running
- Check request payload format
- Review backend logs

### "Orders not showing on venue dashboard"
- Verify venue is logged in
- Check JWT token includes venueId
- Review API endpoint being called

### Real-time updates not working
- Check Socket.IO connection
- Verify room joining logic
- Check backend Socket.IO setup
