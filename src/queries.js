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
