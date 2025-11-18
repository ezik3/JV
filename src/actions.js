import { HttpError } from 'wasp/server'

// Helper to get venue ID
const getVenueId = async (user, context) => {
  if (!user) throw new HttpError(401, 'Not authenticated')

  const userWithVenue = await context.entities.User.findUnique({
    where: { id: user.id },
    include: { venue: true }
  })

  if (!userWithVenue?.venue) {
    throw new HttpError(404, 'Venue not found for user')
  }

  return userWithVenue.venue.id
}

// ============== MENU ITEMS ==============

export const createMenuItem = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { name, description, price, categoryId, imageUrl, inventoryName, preparationTime } = args

  const menuItem = await context.entities.MenuItem.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      categoryId,
      imageUrl,
      preparationTime,
      venue: { connect: { id: venueId } },
      ...(inventoryName && {
        inventory: {
          create: {
            name: inventoryName,
            quantity: 0,
            lowStockThreshold: 10,
            venue: { connect: { id: venueId } }
          }
        }
      })
    },
    include: {
      category: true,
      inventory: true
    }
  })

  return menuItem
}

export const updateMenuItem = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { id, ...data } = args

  const menuItem = await context.entities.MenuItem.findFirst({
    where: { id, venueId }
  })

  if (!menuItem) {
    throw new HttpError(404, 'Menu item not found')
  }

  return context.entities.MenuItem.update({
    where: { id },
    data: {
      ...data,
      ...(data.price && { price: parseFloat(data.price) })
    },
    include: {
      category: true,
      inventory: true
    }
  })
}

export const deleteMenuItem = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { id } = args

  const menuItem = await context.entities.MenuItem.findFirst({
    where: { id, venueId }
  })

  if (!menuItem) {
    throw new HttpError(404, 'Menu item not found')
  }

  return context.entities.MenuItem.delete({
    where: { id }
  })
}

// ============== MENU CATEGORIES ==============

export const createMenuCategory = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { name, description, icon, displayOrder } = args

  return context.entities.MenuCategory.create({
    data: {
      name,
      description,
      icon,
      displayOrder: displayOrder || 0,
      venue: { connect: { id: venueId } }
    }
  })
}

export const updateMenuCategory = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { id, ...data } = args

  const category = await context.entities.MenuCategory.findFirst({
    where: { id, venueId }
  })

  if (!category) {
    throw new HttpError(404, 'Category not found')
  }

  return context.entities.MenuCategory.update({
    where: { id },
    data
  })
}

export const deleteMenuCategory = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { id } = args

  const category = await context.entities.MenuCategory.findFirst({
    where: { id, venueId }
  })

  if (!category) {
    throw new HttpError(404, 'Category not found')
  }

  return context.entities.MenuCategory.delete({
    where: { id }
  })
}

// ============== INVENTORY ==============

export const updateInventory = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { id, quantity, lowStockThreshold } = args

  const inventory = await context.entities.Inventory.findFirst({
    where: { id, venueId }
  })

  if (!inventory) {
    throw new HttpError(404, 'Inventory not found')
  }

  return context.entities.Inventory.update({
    where: { id },
    data: {
      ...(quantity !== undefined && { quantity }),
      ...(lowStockThreshold !== undefined && { lowStockThreshold })
    }
  })
}

export const createInventory = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { name, quantity, unit, lowStockThreshold } = args

  return context.entities.Inventory.create({
    data: {
      name,
      quantity: quantity || 0,
      unit: unit || 'units',
      lowStockThreshold: lowStockThreshold || 10,
      venue: { connect: { id: venueId } }
    }
  })
}

// ============== ORDERS ==============

export const createOrder = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { items, orderType, tableNumber, notes, staffId } = args

  // Calculate totals
  let subtotal = 0
  const orderItems = []

  for (const item of items) {
    const menuItem = await context.entities.MenuItem.findUnique({
      where: { id: item.menuItemId }
    })

    if (!menuItem) {
      throw new HttpError(404, `Menu item ${item.menuItemId} not found`)
    }

    const itemSubtotal = menuItem.price * item.quantity
    subtotal += itemSubtotal

    orderItems.push({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      price: menuItem.price,
      subtotal: itemSubtotal,
      notes: item.notes
    })
  }

  // Get venue settings for tax and service charge
  let settings = await context.entities.VenueSettings.findUnique({
    where: { venueId }
  })

  if (!settings) {
    settings = await context.entities.VenueSettings.create({
      data: { venueId }
    })
  }

  const tax = subtotal * settings.taxRate
  const serviceCharge = subtotal * settings.serviceChargeRate
  const total = subtotal + tax + serviceCharge

  // Generate unique order number
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  // Create order
  const order = await context.entities.Order.create({
    data: {
      orderNumber,
      venueId,
      orderType,
      tableNumber,
      notes,
      subtotal,
      tax,
      serviceCharge,
      total,
      ...(staffId && { staffId }),
      ...(context.user && { customerId: context.user.id }),
      items: {
        create: orderItems
      }
    },
    include: {
      items: {
        include: { menuItem: true }
      }
    }
  })

  return order
}

export const updateOrderStatus = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { id, status } = args

  const order = await context.entities.Order.findFirst({
    where: { id, venueId }
  })

  if (!order) {
    throw new HttpError(404, 'Order not found')
  }

  return context.entities.Order.update({
    where: { id },
    data: {
      status,
      ...(status === 'completed' && { completedAt: new Date() })
    },
    include: {
      items: {
        include: { menuItem: true }
      },
      payments: true
    }
  })
}

export const updateOrderItemStatus = async (args, context) => {
  const { orderItemId, status } = args

  return context.entities.OrderItem.update({
    where: { id: orderItemId },
    data: { status }
  })
}

// ============== PAYMENTS ==============

export const createPayment = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { orderId, amount, method, transactionId } = args

  // Verify order belongs to venue
  const order = await context.entities.Order.findFirst({
    where: { id: orderId, venueId }
  })

  if (!order) {
    throw new HttpError(404, 'Order not found')
  }

  const payment = await context.entities.Payment.create({
    data: {
      orderId,
      amount: parseFloat(amount),
      method,
      transactionId,
      status: 'completed'
    }
  })

  // Check if order is fully paid
  const payments = await context.entities.Payment.findMany({
    where: { orderId, status: 'completed' }
  })

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)

  if (totalPaid >= order.total) {
    await context.entities.Order.update({
      where: { id: orderId },
      data: {
        status: 'completed',
        completedAt: new Date()
      }
    })
  }

  return payment
}

// ============== STAFF ==============

export const createStaff = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { firstName, lastName, email, phone, pin, role } = args

  // Check if PIN is unique for this venue
  const existingStaff = await context.entities.Staff.findFirst({
    where: { venueId, pin }
  })

  if (existingStaff) {
    throw new HttpError(400, 'PIN already in use')
  }

  return context.entities.Staff.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      pin,
      role,
      venue: { connect: { id: venueId } }
    }
  })
}

export const updateStaff = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { id, ...data } = args

  const staff = await context.entities.Staff.findFirst({
    where: { id, venueId }
  })

  if (!staff) {
    throw new HttpError(404, 'Staff member not found')
  }

  // If updating PIN, check uniqueness
  if (data.pin) {
    const existingStaff = await context.entities.Staff.findFirst({
      where: {
        venueId,
        pin: data.pin,
        id: { not: id }
      }
    })

    if (existingStaff) {
      throw new HttpError(400, 'PIN already in use')
    }
  }

  return context.entities.Staff.update({
    where: { id },
    data
  })
}

export const deleteStaff = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { id } = args

  const staff = await context.entities.Staff.findFirst({
    where: { id, venueId }
  })

  if (!staff) {
    throw new HttpError(404, 'Staff member not found')
  }

  // Soft delete by marking inactive
  return context.entities.Staff.update({
    where: { id },
    data: { isActive: false }
  })
}

// ============== SHIFTS ==============

export const clockIn = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { staffId, pin } = args

  // Verify staff member
  const staff = await context.entities.Staff.findFirst({
    where: { id: staffId, venueId, pin, isActive: true }
  })

  if (!staff) {
    throw new HttpError(401, 'Invalid staff ID or PIN')
  }

  // Check if already clocked in
  const activeShift = await context.entities.Shift.findFirst({
    where: {
      staffId,
      clockOut: null
    }
  })

  if (activeShift) {
    throw new HttpError(400, 'Already clocked in')
  }

  return context.entities.Shift.create({
    data: {
      staffId,
      venueId
    },
    include: {
      staff: true
    }
  })
}

export const clockOut = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { staffId, notes } = args

  const activeShift = await context.entities.Shift.findFirst({
    where: {
      staffId,
      venueId,
      clockOut: null
    }
  })

  if (!activeShift) {
    throw new HttpError(404, 'No active shift found')
  }

  return context.entities.Shift.update({
    where: { id: activeShift.id },
    data: {
      clockOut: new Date(),
      notes
    },
    include: {
      staff: true
    }
  })
}

// ============== VENUE SETTINGS ==============

export const updateVenueSettings = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { taxRate, serviceChargeRate, currency, timezone, ...otherSettings } = args

  let settings = await context.entities.VenueSettings.findUnique({
    where: { venueId }
  })

  if (!settings) {
    return context.entities.VenueSettings.create({
      data: {
        venueId,
        ...args
      }
    })
  }

  return context.entities.VenueSettings.update({
    where: { venueId },
    data: args
  })
}
