const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const xrpService = require('./xrpService'); // Add this line

// Keep your existing imports for facial recognition
const { detectFaces } = require('./faceDetection');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Connect to XRP Ledger
xrpService.connect()
  .then(() => console.log('Connected to XRP Ledger'))
  .catch(err => console.log('Failed to connect to XRP Ledger', err));

// Keep your existing multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Keep your existing routes
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

// Routes (we'll add these later)
// app.use('/api/users', require('./routes/users'));
// app.use('/api/venues', require('./routes/venues'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));