const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function createAdminUser() {
  try {
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpassword',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdminUser();