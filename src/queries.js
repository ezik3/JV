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

// Menu Items
export const getMenuItems = async (args, context) => {
  const venueId = await getVenueId(context.user, context)

  return context.entities.MenuItem.findMany({
    where: { venueId },
    include: {
      inventory: true,
      category: true
    },
    orderBy: { name: 'asc' }
  })
}

// Menu Categories
export const getMenuCategories = async (args, context) => {
  const venueId = await getVenueId(context.user, context)

  return context.entities.MenuCategory.findMany({
    where: { venueId },
    include: {
      menuItems: {
        include: { inventory: true }
      }
    },
    orderBy: { displayOrder: 'asc' }
  })
}

// Inventory
export const getInventory = async (args, context) => {
  const venueId = await getVenueId(context.user, context)

  return context.entities.Inventory.findMany({
    where: { venueId },
    include: {
      menuItems: true
    },
    orderBy: { name: 'asc' }
  })
}

// Orders
export const getOrders = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { status, startDate, endDate } = args || {}

  const where = { venueId }

  if (status) {
    where.status = status
  }

  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = new Date(startDate)
    if (endDate) where.createdAt.lte = new Date(endDate)
  }

  return context.entities.Order.findMany({
    where,
    include: {
      items: {
        include: { menuItem: true }
      },
      payments: true,
      staff: true,
      customer: {
        select: { id: true, username: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

// Single Order
export const getOrder = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { id } = args

  const order = await context.entities.Order.findFirst({
    where: { id, venueId },
    include: {
      items: {
        include: { menuItem: true }
      },
      payments: true,
      staff: true,
      customer: {
        select: { id: true, username: true }
      }
    }
  })

  if (!order) {
    throw new HttpError(404, 'Order not found')
  }

  return order
}

// Staff
export const getStaff = async (args, context) => {
  const venueId = await getVenueId(context.user, context)

  return context.entities.Staff.findMany({
    where: { venueId },
    include: {
      shifts: {
        where: {
          clockOut: null // Active shifts only
        }
      },
      _count: {
        select: {
          orders: true,
          shifts: true
        }
      }
    },
    orderBy: { firstName: 'asc' }
  })
}

// Active Shifts
export const getActiveShifts = async (args, context) => {
  const venueId = await getVenueId(context.user, context)

  return context.entities.Shift.findMany({
    where: {
      venueId,
      clockOut: null
    },
    include: {
      staff: true
    },
    orderBy: { clockIn: 'asc' }
  })
}

// Venue Settings
export const getVenueSettings = async (args, context) => {
  const venueId = await getVenueId(context.user, context)

  let settings = await context.entities.VenueSettings.findUnique({
    where: { venueId }
  })

  // Create default settings if they don't exist
  if (!settings) {
    settings = await context.entities.VenueSettings.create({
      data: { venueId }
    })
  }

  return settings
}

// Dashboard Analytics
export const getDashboardStats = async (args, context) => {
  const venueId = await getVenueId(context.user, context)
  const { startDate, endDate } = args || {}

  const dateFilter = {}
  if (startDate) dateFilter.gte = new Date(startDate)
  if (endDate) dateFilter.lte = new Date(endDate)

  const where = { venueId }
  if (startDate || endDate) {
    where.createdAt = dateFilter
  }

  // Get orders in parallel
  const [orders, totalRevenue, todayOrders] = await Promise.all([
    context.entities.Order.findMany({
      where,
      include: {
        items: true,
        payments: true
      }
    }),
    context.entities.Order.aggregate({
      where: {
        ...where,
        status: 'completed'
      },
      _sum: {
        total: true
      }
    }),
    context.entities.Order.count({
      where: {
        venueId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })
  ])

  const activeOrders = orders.filter(o =>
    ['pending', 'preparing', 'ready'].includes(o.status)
  ).length

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    activeOrders,
    todayOrders,
    averageOrderValue: todayOrders > 0
      ? (totalRevenue._sum.total || 0) / todayOrders
      : 0,
    orders: orders.slice(0, 10) // Recent 10 orders
  }
}
