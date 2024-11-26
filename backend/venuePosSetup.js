// Make sure the export matches exactly
export const setupVenuePOS = async (req, context) => {
  console.log('API endpoint hit!'); // Add this to verify the endpoint is reached
  console.log('Received data:', req.body);

  try {
    return {
      success: true,
      message: 'POS setup received',
      data: {
        ...req.body,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: error.message,
      data: null
    };
  }
};