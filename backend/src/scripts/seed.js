import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Donation from '../models/Donation.js';
import Claim from '../models/Claim.js';
import PickupRequest from '../models/PickupRequest.js';
import Notification from '../models/Notification.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Donation.deleteMany({});
    await Claim.deleteMany({});
    await PickupRequest.deleteMany({});
    await Notification.deleteMany({});

    // Create Admin
    console.log('Creating admin user...');
    const admin = await User.create({
      email: 'admin@foodshare.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      phone: '+1234567890',
      isApproved: true
    });

    // Create Donors
    console.log('Creating donors...');
    const donor1 = await User.create({
      email: 'donor1@example.com',
      password: 'password123',
      name: 'John Restaurant',
      role: 'donor',
      phone: '+1234567891',
      organization: 'John\'s Restaurant',
      address: '123 Main St, New York, NY',
      isApproved: true
    });

    const donor2 = await User.create({
      email: 'donor2@example.com',
      password: 'password123',
      name: 'Maria Catering',
      role: 'donor',
      phone: '+1234567892',
      organization: 'Maria\'s Catering',
      address: '456 Oak Ave, New York, NY',
      isApproved: true
    });

    // Create NGOs
    console.log('Creating NGOs...');
    const ngo1 = await User.create({
      email: 'ngo1@example.com',
      password: 'password123',
      name: 'Hope Foundation',
      role: 'ngo',
      phone: '+1234567893',
      organization: 'Hope Foundation',
      address: '789 Elm St, New York, NY',
      isApproved: true
    });

    const ngo2 = await User.create({
      email: 'ngo2@example.com',
      password: 'password123',
      name: 'Food for All',
      role: 'ngo',
      phone: '+1234567894',
      organization: 'Food for All NGO',
      address: '321 Pine St, New York, NY',
      isApproved: true
    });

    // Create Volunteers
    console.log('Creating volunteers...');
    const volunteer1 = await User.create({
      email: 'volunteer1@example.com',
      password: 'password123',
      name: 'David Wilson',
      role: 'volunteer',
      phone: '+1234567895',
      address: '555 Maple Dr, New York, NY',
      isApproved: true
    });

    const volunteer2 = await User.create({
      email: 'volunteer2@example.com',
      password: 'password123',
      name: 'Sarah Johnson',
      role: 'volunteer',
      phone: '+1234567896',
      address: '777 Cedar Ln, New York, NY',
      isApproved: true
    });

    // Create Donations
    console.log('Creating donations...');
    
    // Available donations
    const donation1 = await Donation.create({
      donor: donor1._id,
      foodType: 'Cooked Rice',
      quantity: 15,
      unit: 'kg',
      expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      location: {
        address: '123 Main St, New York, NY',
        latitude: 40.7128,
        longitude: -74.0060
      },
      description: 'Fresh cooked rice from lunch buffet',
      status: 'available'
    });

    const donation2 = await Donation.create({
      donor: donor2._id,
      foodType: 'Mixed Vegetables',
      quantity: 10,
      unit: 'kg',
      expiryTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      location: {
        address: '456 Oak Ave, New York, NY',
        latitude: 40.7589,
        longitude: -73.9851
      },
      description: 'Fresh vegetables from catering event',
      status: 'available'
    });

    const donation3 = await Donation.create({
      donor: donor1._id,
      foodType: 'Bread and Pastries',
      quantity: 50,
      unit: 'pieces',
      expiryTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      location: {
        address: '123 Main St, New York, NY',
        latitude: 40.7128,
        longitude: -74.0060
      },
      description: 'Unsold bread and pastries from bakery',
      status: 'available'
    });

    // Claimed donation with pickup
    const donation4 = await Donation.create({
      donor: donor2._id,
      foodType: 'Cooked Chicken',
      quantity: 8,
      unit: 'kg',
      expiryTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      location: {
        address: '456 Oak Ave, New York, NY',
        latitude: 40.7589,
        longitude: -73.9851
      },
      description: 'Leftover grilled chicken',
      status: 'claimed',
      claimedBy: ngo1._id,
      claimedAt: new Date()
    });

    // Create Claims
    console.log('Creating claims...');
    const claim1 = await Claim.create({
      donation: donation4._id,
      ngo: ngo1._id,
      status: 'pending',
      notes: 'Need urgently for evening distribution'
    });

    // Create Pickup Requests
    console.log('Creating pickup requests...');
    
    // Pending pickup
    const pickup1 = await PickupRequest.create({
      claim: claim1._id,
      donation: donation4._id,
      ngo: ngo1._id,
      status: 'pending',
      pickupLocation: {
        address: '456 Oak Ave, New York, NY',
        latitude: 40.7589,
        longitude: -73.9851
      },
      deliveryLocation: {
        address: '789 Elm St, New York, NY',
        latitude: 40.7614,
        longitude: -73.9776
      }
    });

    // Accepted pickup
    const donation5 = await Donation.create({
      donor: donor1._id,
      foodType: 'Fruit Salad',
      quantity: 5,
      unit: 'kg',
      expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      location: {
        address: '123 Main St, New York, NY',
        latitude: 40.7128,
        longitude: -74.0060
      },
      description: 'Fresh fruit salad',
      status: 'claimed',
      claimedBy: ngo2._id,
      claimedAt: new Date(Date.now() - 30 * 60 * 1000) // 30 mins ago
    });

    const claim2 = await Claim.create({
      donation: donation5._id,
      ngo: ngo2._id,
      status: 'pending'
    });

    const pickup2 = await PickupRequest.create({
      claim: claim2._id,
      donation: donation5._id,
      ngo: ngo2._id,
      volunteer: volunteer1._id,
      status: 'accepted',
      pickupLocation: {
        address: '123 Main St, New York, NY',
        latitude: 40.7128,
        longitude: -74.0060
      },
      deliveryLocation: {
        address: '321 Pine St, New York, NY',
        latitude: 40.7505,
        longitude: -73.9934
      },
      acceptedAt: new Date()
    });

    // Create Notifications
    console.log('Creating notifications...');
    await Notification.create({
      user: donor2._id,
      type: 'donation_claimed',
      title: 'Donation Claimed',
      message: `Your donation has been claimed by ${ngo1.name}`,
      relatedId: donation4._id,
      relatedModel: 'Donation',
      isRead: false
    });

    await Notification.create({
      user: ngo1._id,
      type: 'pickup_assigned',
      title: 'Pickup Request Created',
      message: 'A new pickup request has been created for your claim',
      relatedId: pickup1._id,
      relatedModel: 'PickupRequest',
      isRead: false
    });

    await Notification.create({
      user: ngo2._id,
      type: 'pickup_accepted',
      title: 'Pickup Accepted',
      message: `${volunteer1.name} has accepted the pickup request`,
      relatedId: pickup2._id,
      relatedModel: 'PickupRequest',
      isRead: false
    });

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Sample Login Credentials:');
    console.log('========================');
    console.log('\nAdmin:');
    console.log('Email: admin@foodshare.com');
    console.log('Password: admin123');
    console.log('\nDonor:');
    console.log('Email: donor1@example.com');
    console.log('Password: password123');
    console.log('\nNGO:');
    console.log('Email: ngo1@example.com');
    console.log('Password: password123');
    console.log('\nVolunteer:');
    console.log('Email: volunteer1@example.com');
    console.log('Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
connectDB().then(seedData);
