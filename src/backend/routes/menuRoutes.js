export const getMenu = async (req, res, context) => {
  try {
    // TODO: Implement menu fetching from database
    res.json({ items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
