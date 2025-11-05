import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the MongoDB Order model
const orderModelPath = path.resolve(__dirname, '../../../backend/models/order.js');
const menuModelPath = path.resolve(__dirname, '../../../backend/models/menu.js');
let Order, MenuItem;

// Dynamically import models
const loadModels = async () => {
  if (!Order) {
    const orderModule = await import(orderModelPath);
    Order = orderModule.default || orderModule;
  }
  if (!MenuItem) {
    const menuModule = await import(menuModelPath);
    MenuItem = menuModule.default || menuModule;
  }
  return { Order, MenuItem };
};

export const placeOrder = async (req, res, context) => {
  try {
    const { venueId, items, totalAmount, orderType, tableNumber, customerName } = req.body;
    
    // Validate required fields
    if (!venueId || !items || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'venueId and items are required' 
      });
    }

    // Validate venueId format
    if (!mongoose.Types.ObjectId.isValid(venueId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid venueId format' 
      });
    }

    // Validate items
    if (!Array.isArray(items)) {
      return res.status(400).json({ 
        success: false,
        error: 'items must be an array' 
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.name || typeof item.name !== 'string') {
        return res.status(400).json({ 
          success: false,
          error: 'Each item must have a valid name' 
        });
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Each item must have a valid quantity' 
        });
      }
      if (typeof item.price !== 'number' || item.price < 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Each item must have a valid price' 
        });
      }
    }

    // Ensure models are loaded
    const { Order: OrderModel } = await loadModels();
    
    // Get user ID from context if authenticated
    const userId = context?.user?.id;
    
    // Calculate total if not provided
    const calculatedTotal = totalAmount || items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    
    // Validate total amount (prevent negative or unreasonably large orders)
    if (calculatedTotal < 0 || calculatedTotal > 100000) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid order total amount' 
      });
    }
    
    // Create the order in MongoDB
    const order = new OrderModel({
      customerName: customerName || context?.user?.username || 'Guest',
      userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      venueId: new mongoose.Types.ObjectId(venueId),
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        itemId: item.id ? new mongoose.Types.ObjectId(item.id) : undefined
      })),
      totalAmount: calculatedTotal,
      status: 'pending',
      paymentMethod: 'jvcoin',
      paymentStatus: 'pending',
      tableNumber: tableNumber,
      orderType: orderType || 'customer'
    });

    await order.save();
    
    // TODO: Emit real-time notification to venue
    // This would require access to Socket.IO instance
    
    res.json({ 
      success: true, 
      orderId: order._id,
      order: order
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const getVenueOrders = async (req, res, context) => {
  try {
    const { venueId } = req.params;
    
    if (!venueId) {
      return res.status(400).json({ error: 'venueId is required' });
    }

    // Validate venueId format
    if (!mongoose.Types.ObjectId.isValid(venueId)) {
      return res.status(400).json({ error: 'Invalid venueId format' });
    }

    // Ensure models are loaded
    const { Order: OrderModel } = await loadModels();
    
    // Fetch orders for the venue
    const orders = await OrderModel.find({ 
      venueId: new mongoose.Types.ObjectId(venueId)
    })
    .sort({ createdAt: -1 })
    .limit(100); // Limit to latest 100 orders
    
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching venue orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderStatus = async (req, res, context) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    // Validate orderId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: 'Invalid orderId format' });
    }

    // Ensure models are loaded
    const { Order: OrderModel } = await loadModels();
    
    // Fetch the order
    const order = await OrderModel.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ order });
  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({ error: 'Failed to fetch order status' });
  }
};

export const updateOrderStatus = async (req, res, context) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!orderId || !status) {
      return res.status(400).json({ 
        error: 'orderId and status are required' 
      });
    }

    // Validate orderId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: 'Invalid orderId format' });
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'paid', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Ensure models are loaded
    const { Order: OrderModel } = await loadModels();
    
    // Update the order
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // TODO: Emit real-time notification to customer
    
    res.json({ 
      success: true,
      order 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
