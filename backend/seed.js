const mongoose = require('mongoose');
const User = require('./models/User');
const ServiceRequest = require('./models/ServiceRequest');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostelease')
  .then(() => console.log('✅ Connected to MongoDB for seeding'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await ServiceRequest.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@hostelease.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
      isActive: true
    });
    console.log('👑 Created admin user:', adminUser.email);

    // Create staff user
    const staffUser = await User.create({
      name: 'Staff User',
      email: 'staff@hostelease.com',
      password: 'staff123',
      role: 'staff',
      phone: '9876543211',
      isActive: true
    });
    console.log('👷 Created staff user:', staffUser.email);

    // Create sample student users
    const student1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'student123',
      role: 'student',
      hostelBlock: 'A',
      roomNumber: 'A101',
      roomType: '2-bedded',
      acType: 'AC',
      hostelType: 'Men\'s',
      phone: '9876543212',
      isActive: true
    });

    const student2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'student123',
      role: 'student',
      hostelBlock: 'B',
      roomNumber: 'B201',
      roomType: '1-bedded',
      acType: 'Non-AC',
      hostelType: 'Women\'s',
      phone: '9876543213',
      isActive: true
    });

    console.log('👨‍🎓 Created sample students');

    // Create sample service requests
    const sampleRequests = [
      {
        user: student1._id,
        serviceType: 'cleaning',
        title: 'Room Cleaning Request',
        description: 'Need room cleaning service for A101',
        priority: 'medium',
        location: {
          block: 'A',
          roomNumber: 'A101'
        },
        serviceDetails: {
          cleaningType: 'room'
        }
      },
      {
        user: student1._id,
        serviceType: 'laundry',
        title: 'Laundry Pickup',
        description: 'Request for laundry pickup service',
        priority: 'low',
        location: {
          block: 'A',
          roomNumber: 'A101'
        },
        serviceDetails: {
          numberOfClothes: 15,
          pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
        }
      },
      {
        user: student2._id,
        serviceType: 'electrical',
        title: 'Electrical Issue',
        description: 'Power socket not working in room B201',
        priority: 'high',
        location: {
          block: 'B',
          roomNumber: 'B201'
        }
      },
      {
        user: student2._id,
        serviceType: 'wifi',
        title: 'WiFi Connection Problem',
        description: 'WiFi signal is very weak in room B201',
        priority: 'medium',
        location: {
          block: 'B',
          roomNumber: 'B201'
        }
      }
    ];

    await ServiceRequest.insertMany(sampleRequests);
    console.log('📝 Created sample service requests');

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('👑 Admin: admin@hostelease.com / admin123');
    console.log('👷 Staff: staff@hostelease.com / staff123');
    console.log('👨‍🎓 Student 1: john@example.com / student123');
    console.log('👩‍🎓 Student 2: jane@example.com / student123');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
};

// Run seeding
seedData();
