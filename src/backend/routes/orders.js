export const placeOrder = async (req, res, context) => {
  try {
    const { venueId, orderType, tableId, items, specialInstructions } = req.body;
    const userId = context.user.id;

    if (!venueId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate total amount
    let totalAmount = 0;
    const menuItems = await context.entities.MenuItem.findMany({
      where: {
        id: { in: items.map(item => item.menuItemId) }
      }
    });

    const orderItems = items.map(item => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        customizations: item.customizations ? JSON.stringify(item.customizations) : null
      };
    });

    // Generate unique order number using timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9).toUpperCase();
    const orderNumber = `ORD-${timestamp}-${randomString}`;

    // Create order
    const order = await context.entities.Order.create({
      data: {
        orderNumber,
        userId,
        venueId: parseInt(venueId),
        tableId: tableId ? parseInt(tableId) : null,
        orderType: orderType || 'dine-in',
        totalAmount,
        specialInstructions,
        orderItems: {
          create: orderItems
        }
      },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res, context) => {
  try {
    const userId = context.user.id;
    const { venueId, status } = req.query;

    const where = { userId };
    if (venueId) where.venueId = parseInt(venueId);
    if (status) where.status = status;

    const orders = await context.entities.Order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        },
        venue: true,
        table: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res, context) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const order = await context.entities.Order.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getVenueOrders = async (req, res, context) => {
  try {
    const { venueId } = req.params;
    const { status, date } = req.query;

    const where = { venueId: parseInt(venueId) };
    if (status) where.status = status;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      where.createdAt = { gte: startDate, lte: endDate };
    }

    const orders = await context.entities.Order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        },
        user: {
          select: {
            username: true
          }
        },
        table: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching venue orders:', error);
    res.status(500).json({ error: error.message });
  }
};
