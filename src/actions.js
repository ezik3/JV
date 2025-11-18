import { HttpError } from 'wasp/server'

export const createMenuItem = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }
  
  const { name, description, price, category, image } = args
  const venueId = context.user.venueId

  const menuItem = await context.entities.MenuItem.create({
    data: {
      name,
      description,
      price,
      category,
      image,
      venue: { connect: { id: venueId } },
      inventory: {
        create: {
          quantity: 0,
          lowStockThreshold: 10,
          venue: { connect: { id: venueId } }
        }
      }
    }
  })

  return menuItem
}

export const updateMenuItem = async (args, context) => {
    if (!context.user) { throw new HttpError(401) }
  
    const { id, ...data } = args
    const venueId = context.user.venueId
  
    const menuItem = await context.entities.MenuItem.findFirst({
      where: { id, venueId }
    })
  
    if (!menuItem) { throw new HttpError(404, 'Menu item not found') }
  
    return context.entities.MenuItem.update({
      where: { id },
      data
    })
  }
  
  export const deleteMenuItem = async (args, context) => {
    if (!context.user) { throw new HttpError(401) }
  
    const { id } = args
    const venueId = context.user.venueId
  
    const menuItem = await context.entities.MenuItem.findFirst({
      where: { id, venueId }
    })

    if (!menuItem) { throw new HttpError(404, 'Menu item not found') }

  return context.entities.MenuItem.delete({
    where: { id }
  })
}

export const updateInventory = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const { menuItemId, quantity } = args
  const venueId = context.user.venueId

  const inventory = await context.entities.Inventory.findFirst({
    where: { menuItemId, venueId }
  })

  if (!inventory) { throw new HttpError(404, 'Inventory not found') }

  return context.entities.Inventory.update({
    where: { id: inventory.id },
    data: { quantity }
  })
}

export const createOrder = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const { items, orderType, subtotal, tax, tip, total } = args
  const venueId = context.user.venueId

  const order = await context.entities.Order.create({
    data: {
      venueId,
      orderType,
      status: 'pending',
      subtotal,
      tax,
      tip,
      total,
      items: {
        create: items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    },
    include: {
      items: {
        include: {
          menuItem: true
        }
      }
    }
  })

  return order
}

export const updateOrderStatus = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const { id, status } = args
  const venueId = context.user.venueId

  const order = await context.entities.Order.findFirst({
    where: { id, venueId }
  })

  if (!order) { throw new HttpError(404, 'Order not found') }

  return context.entities.Order.update({
    where: { id },
    data: { 
      status,
      completedAt: status === 'completed' ? new Date() : undefined
    }
  })
}
