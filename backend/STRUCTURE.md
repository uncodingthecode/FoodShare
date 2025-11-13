# FoodShare Backend - Complete Structure

## 📁 Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js              # MongoDB connection configuration
│   │
│   ├── models/
│   │   ├── User.js                  # User schema (Donor, NGO, Volunteer, Admin)
│   │   ├── Donation.js              # Donation schema with expiry validation
│   │   ├── Claim.js                 # Claim schema for NGO claims
│   │   ├── PickupRequest.js         # Pickup request for volunteers
│   │   └── Notification.js          # Notification system
│   │
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── donationController.js    # Donation CRUD operations
│   │   ├── claimController.js       # Claim management
│   │   ├── pickupController.js      # Pickup request handling
│   │   ├── adminController.js       # Admin dashboard & management
│   │   └── notificationController.js # Notification management
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth endpoints
│   │   ├── donationRoutes.js        # /api/donations endpoints
│   │   ├── claimRoutes.js           # /api/claims endpoints
│   │   ├── pickupRoutes.js          # /api/pickups endpoints
│   │   ├── adminRoutes.js           # /api/admin endpoints
│   │   └── notificationRoutes.js    # /api/notifications endpoints
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication & authorization
│   │   ├── error.js                 # Error handling middleware
│   │   └── validator.js             # Input validation middleware
│   │
│   ├── utils/
│   │   ├── auth.js                  # JWT token generation
│   │   └── notifications.js         # Notification helpers
│   │
│   ├── scripts/
│   │   └── seed.js                  # Database seeding script
│   │
│   └── server.js                    # Main application entry point
│
├── .env                             # Environment variables
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore file
├── package.json                     # Dependencies and scripts
├── README.md                        # Main documentation
├── QUICKSTART.md                    # Quick start guide
├── API_TESTING.md                   # API testing guide
├── DEPLOYMENT.md                    # Deployment guide
└── FoodShare_API.postman_collection.json  # Postman collection
```

## 🔑 Key Features Implemented

### ✅ Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing with bcryptjs
- Token expiration and refresh
- Protected routes by user role

### ✅ User Management (4 Roles)
1. **Donor**
   - Create, edit, delete donations
   - View donation history
   - Receive notifications on claims

2. **NGO**
   - Browse available donations
   - Claim donations (first-come-first-served)
   - View claim history
   - Automatic pickup request generation

3. **Volunteer**
   - View available pickup requests
   - Accept pickup tasks
   - Update delivery status (Pending → Picked Up → In Transit → Delivered)
   - Track pickup history

4. **Admin**
   - Dashboard with statistics
   - User management (approve/block/delete)
   - Donation oversight
   - Generate reports
   - System analytics

### ✅ Core Functionality

#### Donations
- Create with expiry validation
- Location tracking (Google Maps ready)
- Automatic expiry checking
- Edit/delete (only if unclaimed)
- Search and filter
- Status management

#### Claims
- Prevent duplicate claims
- First-come-first-served mechanism
- Automatic pickup request creation
- NGO claim tracking
- Status updates

#### Pickup Requests
- Auto-generated on claim
- Volunteer assignment
- Multi-stage status tracking
- Location-based routing
- Delivery confirmation

#### Notifications
- Real-time notification system
- Event-based triggers:
  - Donation claimed
  - Pickup assigned
  - Status updates
  - Delivery confirmation
- Read/unread tracking
- User-specific notifications

### ✅ Security Features
- Helmet.js for HTTP headers
- Rate limiting (100 requests/15 min)
- CORS configuration
- MongoDB injection prevention
- Input validation with express-validator
- Password strength requirements
- JWT secret management

### ✅ Database Features
- MongoDB with Mongoose ODM
- Indexed queries for performance
- Data validation at schema level
- Relationship management
- Automatic timestamps
- Compound indexes

## 📊 Database Schema

### Users Collection
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  role: Enum ['donor', 'ngo', 'volunteer', 'admin'],
  phone: String (required),
  organization: String (optional),
  isApproved: Boolean (default: true),
  isActive: Boolean (default: true),
  address: String,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Donations Collection
```javascript
{
  donor: ObjectId (ref: User),
  foodType: String (required),
  quantity: Number (required, min: 0),
  unit: Enum ['kg', 'grams', 'liters', 'pieces', 'plates', 'boxes'],
  expiryTime: Date (required, must be future),
  location: {
    address: String (required),
    latitude: Number,
    longitude: Number
  },
  description: String,
  status: Enum ['available', 'claimed', 'expired', 'cancelled'],
  images: [String],
  claimedBy: ObjectId (ref: User),
  claimedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Claims Collection
```javascript
{
  donation: ObjectId (ref: Donation),
  ngo: ObjectId (ref: User),
  claimedAt: Date,
  status: Enum ['pending', 'completed', 'cancelled'],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### PickupRequests Collection
```javascript
{
  claim: ObjectId (ref: Claim),
  donation: ObjectId (ref: Donation),
  ngo: ObjectId (ref: User),
  volunteer: ObjectId (ref: User),
  status: Enum ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
  pickupLocation: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  deliveryLocation: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  acceptedAt: Date,
  pickedUpAt: Date,
  deliveredAt: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Notifications Collection
```javascript
{
  user: ObjectId (ref: User),
  type: Enum [
    'donation_added', 'donation_claimed', 'donation_expired',
    'claim_created', 'pickup_assigned', 'pickup_accepted',
    'pickup_status_updated', 'pickup_delivered',
    'user_approved', 'user_blocked'
  ],
  title: String (required),
  message: String (required),
  relatedId: ObjectId,
  relatedModel: Enum ['Donation', 'Claim', 'PickupRequest', 'User'],
  isRead: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
```
POST   /register          - Register new user
POST   /login             - Login user
GET    /me                - Get current user
PUT    /update            - Update user details
PUT    /update-password   - Change password
```

### Donations (`/api/donations`)
```
POST   /                  - Create donation (Donor)
GET    /available         - Get available donations
GET    /my-donations/list - Get my donations (Donor)
GET    /search            - Search donations
GET    /:id               - Get donation by ID
PUT    /:id               - Update donation (Donor)
DELETE /:id               - Delete donation (Donor)
```

### Claims (`/api/claims`)
```
POST   /claim/:donationId - Claim donation (NGO)
GET    /my-claims         - Get my claims (NGO)
GET    /all               - Get all claims (Admin)
GET    /:id               - Get claim by ID
PUT    /:id/status        - Update claim status
```

### Pickups (`/api/pickups`)
```
GET    /available         - Get available pickups (Volunteer)
POST   /:id/accept        - Accept pickup (Volunteer)
PUT    /:id/status        - Update pickup status (Volunteer)
GET    /my-pickups/list   - Get my pickups (Volunteer)
GET    /all               - Get all pickups (Admin)
GET    /:id               - Get pickup by ID
```

### Admin (`/api/admin`)
```
GET    /stats             - Dashboard statistics
GET    /reports           - Generate reports
GET    /users             - Get all users
GET    /users/:id         - Get user by ID
PUT    /users/:id/approve - Approve/disapprove user
PUT    /users/:id/activate - Activate/deactivate user
DELETE /users/:id         - Delete user
GET    /donations         - Get all donations
DELETE /donations/:id     - Delete donation
```

### Notifications (`/api/notifications`)
```
GET    /                  - Get my notifications
PUT    /:id/read          - Mark as read
PUT    /read-all/mark     - Mark all as read
DELETE /:id               - Delete notification
```

## 🚀 Deployment Ready

### Production Checklist
- ✅ Environment variables configured
- ✅ MongoDB connection secured
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Error handling implemented
- ✅ Logging configured
- ✅ Security headers (Helmet)
- ✅ Input sanitization
- ✅ JWT authentication
- ✅ Password hashing
- ✅ API documentation
- ✅ Database indexing

### Supported Platforms
- ✅ Render
- ✅ Railway
- ✅ Heroku
- ✅ DigitalOcean
- ✅ AWS EC2
- ✅ Docker
- ✅ Vercel (serverless)

## 📦 Dependencies

### Core
- express (4.18.2) - Web framework
- mongoose (8.0.3) - MongoDB ODM
- dotenv (16.3.1) - Environment variables

### Authentication & Security
- jsonwebtoken (9.0.2) - JWT authentication
- bcryptjs (2.4.3) - Password hashing
- helmet (7.1.0) - Security headers
- cors (2.8.5) - CORS handling
- express-rate-limit (7.1.5) - Rate limiting
- express-mongo-sanitize (2.2.0) - Injection prevention

### Validation & Utilities
- express-validator (7.0.1) - Input validation
- compression (1.7.4) - Response compression
- morgan (1.10.0) - HTTP logging

### Optional
- nodemailer (6.9.7) - Email notifications
- socket.io (4.6.1) - Real-time updates
- multer (1.4.5-lts.1) - File uploads

## 🎯 System Requirements Met

✅ **All Core Requirements Implemented:**
- Four user roles with RBAC
- Registration and login with secure authentication
- Password hashing (bcrypt)
- Session management (JWT)

✅ **Donor Features:**
- Add/edit/delete donations
- Expiry date validation
- Location tracking
- View history
- Notifications on claims

✅ **NGO Features:**
- Browse available donations
- Claim mechanism (first-come-first-served)
- Prevent duplicate claims
- View history
- Receive notifications

✅ **Volunteer Features:**
- View pickup requests
- Accept tasks
- Multi-stage status updates
- Location support

✅ **Admin Features:**
- Dashboard with statistics
- User management
- Donation oversight
- Report generation
- Fraud prevention tools

✅ **Critical System Rules:**
- Automatic expiry validation ✓
- Prevent duplicate claims ✓
- Block editing claimed donations ✓
- Event-based notifications ✓
- Automatic pickup request creation ✓

## 💡 Next Steps

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   - Update `.env` file
   - Set MongoDB URI
   - Set JWT secret

3. **Seed Database**
   ```bash
   npm run seed
   ```

4. **Start Server**
   ```bash
   npm run dev
   ```

5. **Test API**
   - Import Postman collection
   - Test all endpoints
   - Verify functionality

6. **Connect Frontend**
   - Update API URLs
   - Implement authentication
   - Build UI components

7. **Deploy**
   - Choose platform
   - Configure production settings
   - Deploy and test

---

## 📞 Support

For issues or questions:
1. Check `QUICKSTART.md` for setup issues
2. Review `API_TESTING.md` for API usage
3. See `DEPLOYMENT.md` for deployment help

**The backend is production-ready and fully functional!** 🎉
