export const getMenu = async (req, res, context) => {
  try {
    const { venueId } = req.query;
    
    if (!venueId) {
      return res.status(400).json({ error: 'Venue ID is required' });
    }

    // Fetch menu items with categories for a specific venue
    const categories = await context.entities.Category.findMany({
      where: {
        venueId: parseInt(venueId),
        isActive: true
      },
      include: {
        menuItems: {
          where: {
            isAvailable: true
          },
          orderBy: {
            name: 'asc'
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    res.json({ categories });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createMenuItem = async (req, res, context) => {
  try {
    const { name, description, price, categoryId, venueId, imageUrl, preparationTime, allergens } = req.body;

    if (!name || !price || !categoryId || !venueId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const menuItem = await context.entities.MenuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        venueId: parseInt(venueId),
        imageUrl,
        preparationTime: preparationTime ? parseInt(preparationTime) : null,
        allergens
      }
    });

    res.json({ success: true, menuItem });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateMenuItem = async (req, res, context) => {
  try {
    const { id } = req.params;
    const { name, description, price, isAvailable, imageUrl, preparationTime, allergens } = req.body;

    const menuItem = await context.entities.MenuItem.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(preparationTime && { preparationTime: parseInt(preparationTime) }),
        ...(allergens !== undefined && { allergens })
      }
    });

    res.json({ success: true, menuItem });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteMenuItem = async (req, res, context) => {
  try {
    const { id } = req.params;

    await context.entities.MenuItem.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req, res, context) => {
  try {
    const { name, description, venueId, imageUrl, sortOrder } = req.body;

    if (!name || !venueId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const category = await context.entities.Category.create({
      data: {
        name,
        description,
        venueId: parseInt(venueId),
        imageUrl,
        sortOrder: sortOrder || 0
      }
    });

    res.json({ success: true, category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: error.message });
  }
};
