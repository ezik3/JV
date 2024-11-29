const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '.env');
console.log('Attempting to load .env from:', envPath);

if (fs.existsSync(envPath)) {
  console.log('.env file found');
  const envContents = fs.readFileSync(envPath, 'utf8');
  console.log('Env file contents:', envContents);
  
  const envConfig = dotenv.parse(envContents);
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
} else {
  console.log('.env file not found');
}

// Verify that the environment variables are set
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const xrpService = require('./xrpService');
const authRoutes = require('./routes/auth');
const { detectFaces } = require('./faceDetection');
const multer = require('multer');
const checkInRoutes = require('./routes/checkIn');
const orderRoutes = require('./routes/orders');
const http = require('http');
const { Server } = require('socket.io');
const aiWaiterRoutes = require('./routes/aiWaiter');
const venueRoutes = require('./routes/venueRoutes');
const jvCoinRoutes = require('./routes/jvCoinRoutes');
const odooRoutes = require('./routes/odoo/odooRoutes');
const posRouter = require('./routes/pos');
const menuRoutes = require('./routes/menuRoutes');
const profileRoutes = require('./routes/profileRoutes');
const posRoutes = require('./routes/posRoutes');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Express CORS
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));
app.use(express.json());

app.use('/api/profile', profileRoutes);
// Socket.IO CORS 
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],  // Add both ports
    methods: ['GET', 'POST'],
    credentials: true
  },
});

// CORS middleware must come before routes
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
// Add this before your auth routes
app.use('/api/auth/*', (req, res, next) => {
  console.log('\n=== Auth Request Details ===');
  console.log('Endpoint:', req.path);
  console.log('Method:', req.method);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('========================\n');
  next();
});

// Update your existing logging middleware to be more verbose
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api', checkInRoutes);
app.use('/api/ai-waiter', aiWaiterRoutes);
app.use('/api/venue', venueRoutes);
app.use('/api/jv-coin', jvCoinRoutes);
app.use('/api/odoo', odooRoutes);
app.use('/api/pos', posRouter);
app.use('/api/menu', menuRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/pos', posRoutes);
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use('/api/orders', orderRoutes);

// Add this route to handle venue registration directly in server.js
app.post('/api/auth/register-venue', (req, res) => {
  console.log('Received venue registration request:', req.body);
  // Generate a unique venueId (you might want to use a more robust method in production)
  const venueId = 'venue_' + Date.now();
  // Your venue registration logic here
  // For now, just send a success response with the generated venueId
  res.json({ venueId: venueId, message: 'Venue registered successfully' });
});

// New route to send venue email verification
app.post('/api/auth/send-venue-verification-email', (req, res) => {
  const { email, venueId } = req.body;
  console.log('Sending verification email to:', email);
  console.log('Venue ID:', venueId);
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  // Generate a verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  
  // TODO: Save this code in your database associated with the venueId
  
  // TODO: Implement actual email sending here
  console.log('Verification code for venue email:', verificationCode);
  
  res.json({ message: 'Verification email sent' });
});

// New route to verify venue email
app.post('/api/auth/verify-venue-email', (req, res) => {
  const { venueId, verificationCode } = req.body;
  console.log('Verifying email for venue:', venueId, 'with code:', verificationCode);
  
  // TODO: Check if the verification code matches what's stored in the database
  // For now, we'll just accept any code
  
  res.json({ message: 'Email verified successfully' });
});

// New route to send venue phone verification SMS
app.post('/api/auth/send-venue-verification-sms', (req, res) => {
  const { phone, venueId } = req.body;
  console.log('Sending verification SMS to:', phone);
  console.log('Venue ID:', venueId);
  
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  
  // Generate a verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  
  // TODO: Save this code in your database associated with the venueId
  
  // TODO: Implement actual SMS sending here (e.g., using Twilio)
  console.log('Verification code for venue phone:', verificationCode);
  
  res.json({ message: 'Verification SMS sent' });
});

// New route to verify venue phone
app.post('/api/auth/verify-venue-phone', (req, res) => {
  const { venueId, verificationCode } = req.body;
  console.log('Verifying phone for venue:', venueId, 'with code:', verificationCode);
  
  // TODO: Check if the verification code matches what's stored in the database
  // For now, we'll just accept any code
  
  res.json({ message: 'Phone verified successfully' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  // Don't exit the process, just log the error
});

// Connect to XRP Ledger
xrpService.connect()
  .then(() => console.log('Connected to XRP Ledger'))
  .catch(err => console.log('Failed to connect to XRP Ledger', err));

// First, ensure the uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Then configure multer properly
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer with the storage configuration
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Then use it in your route
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const imagePath = req.file.path;
    const faces = await detectFaces(imagePath);
    
    // Delete the uploaded file after processing
    fs.unlinkSync(imagePath);

    res.json({ faces });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image');
  }
});

// XRP routes
app.use('/api/xrp', require('./routes/xrp'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Make sure this line exists and is before the catch-all route
app.use('/api/profile', profileRoutes);
// This should be last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:', err);
  // Don't exit the process, just log the error
});

// Import routes
const posSetupRoutes = require('./routes/posSetup');

// Use routes
app.use('/api/venue', posSetupRoutes);

// NFT Purchase endpoint
app.post('/api/nft/purchase', async (req, res) => {
  try {
    const { cityId, amount, paymentMethod } = req.body;
    
    // Verify VIBE token balance and process payment
    // Mint NFT on XRP Ledger
    // Update database with new NFT ownership
    
    res.json({ success: true, message: 'NFT purchased successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Purchase failed' });
  }
});

const nftRoutes = require('./routes/nftRoutes');
// Add this with your other app.use statements
app.use('/api/nft', nftRoutes);
