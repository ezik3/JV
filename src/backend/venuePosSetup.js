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

export const checkPOSSetup = async (req, context) => {
  try {
    const { venueId } = req.params;
    console.log('Checking POS setup for venue:', venueId);
    
    // For testing, return not setup
    return {
      isSetup: false,
      message: 'POS needs setup'
    };
  } catch (error) {
    console.error('Error checking POS setup:', error);
    throw new Error('Failed to check POS setup');
  }
};