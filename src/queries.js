import { HttpError } from 'wasp/server'

export const getMenuItems = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const venueId = context.user.venueId

  return context.entities.MenuItem.findMany({
    where: { venueId },
    include: { inventory: true }
  })
}

export const getInventory = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const venueId = context.user.venueId

  return context.entities.Inventory.findMany({
    where: { venueId },
    include: { menuItem: true }
  })
}

export const getOrders = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const venueId = context.user.venueId
  const { status } = args || {}

  return context.entities.Order.findMany({
    where: { 
      venueId,
      ...(status && { status })
    },
    include: {
      items: {
        include: {
          menuItem: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const getOrderById = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const { id } = args
  const venueId = context.user.venueId

  const order = await context.entities.Order.findFirst({
    where: { id, venueId },
    include: {
      items: {
        include: {
          menuItem: true
        }
      }
    }
  })

  if (!order) { throw new HttpError(404, 'Order not found') }

  return order
}
