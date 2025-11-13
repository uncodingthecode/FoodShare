# FoodShare Backend API

Backend API for Food Sharing & Surplus Management System built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT-based authentication
- 👥 Role-based access control (Donor, NGO, Volunteer, Admin)
- 🍱 Food donation management with expiry validation
- 📍 Location-based donation tracking
- 🚚 Volunteer pickup request system
- 📧 Real-time notifications
- 📊 Admin dashboard with analytics
- 🔒 Security best practices (helmet, rate limiting, input sanitization)

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or pnpm

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Configure email settings (optional)

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the server:

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "donor",
  "phone": "+1234567890",
  "organization": "ABC Corp" // Optional, for NGOs
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Donation Endpoints

#### Create Donation (Donor only)
```
POST /api/donations
Authorization: Bearer <token>
Content-Type: application/json

{
  "foodType": "Cooked Rice",
  "quantity": 10,
  "unit": "kg",
  "expiryHours": 4,
  "location": {
    "address": "123 Main St, City",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "description": "Fresh cooked rice"
}
```

#### Get All Available Donations
```
GET /api/donations/available
Authorization: Bearer <token>
```

#### Get My Donations (Donor only)
```
GET /api/donations/my-donations
Authorization: Bearer <token>
```

#### Update Donation (Donor only)
```
PUT /api/donations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "foodType": "Updated Food Type",
  "quantity": 15
}
```

#### Delete Donation (Donor only)
```
DELETE /api/donations/:id
Authorization: Bearer <token>
```

### Claim Endpoints

#### Claim Donation (NGO only)
```
POST /api/claims/claim/:donationId
Authorization: Bearer <token>
```

#### Get My Claims (NGO only)
```
GET /api/claims/my-claims
Authorization: Bearer <token>
```

### Pickup Request Endpoints

#### Get Available Pickup Requests (Volunteer only)
```
GET /api/pickups/available
Authorization: Bearer <token>
```

#### Accept Pickup Request (Volunteer only)
```
POST /api/pickups/:id/accept
Authorization: Bearer <token>
```

#### Update Pickup Status (Volunteer only)
```
PUT /api/pickups/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "picked_up" // or "in_transit", "delivered"
}
```

#### Get My Pickup Requests (Volunteer only)
```
GET /api/pickups/my-pickups
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get Dashboard Statistics
```
GET /api/admin/stats
Authorization: Bearer <token>
```

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer <token>
```

#### Approve/Block User
```
PUT /api/admin/users/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "isApproved": true
}
```

#### Delete User
```
DELETE /api/admin/users/:id
Authorization: Bearer <token>
```

#### Get All Donations
```
GET /api/admin/donations
Authorization: Bearer <token>
```

#### Remove Donation
```
DELETE /api/admin/donations/:id
Authorization: Bearer <token>
```

### Notification Endpoints

#### Get My Notifications
```
GET /api/notifications
Authorization: Bearer <token>
```

#### Mark Notification as Read
```
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

## Database Schema

### Users Collection
- email (unique)
- password (hashed)
- name
- role (donor/ngo/volunteer/admin)
- phone
- organization (for NGOs)
- isApproved (for admin approval)
- createdAt
- updatedAt

### Donations Collection
- donor (ref to User)
- foodType
- quantity
- unit
- expiryTime
- location (address, latitude, longitude)
- description
- status (available/claimed/expired/cancelled)
- images (array)
- createdAt
- updatedAt

### Claims Collection
- donation (ref to Donation)
- ngo (ref to User)
- claimedAt
- status (pending/completed/cancelled)

### PickupRequests Collection
- claim (ref to Claim)
- donation (ref to Donation)
- volunteer (ref to User, optional)
- status (pending/accepted/picked_up/in_transit/delivered)
- pickupLocation (from donation)
- deliveryLocation (from NGO)
- acceptedAt
- completedAt

### Notifications Collection
- user (ref to User)
- type (donation_added/donation_claimed/pickup_assigned/etc)
- title
- message
- relatedId (donation/claim/pickup ID)
- isRead
- createdAt

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting to prevent abuse
- Helmet for security headers
- CORS configuration
- MongoDB injection prevention

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if any
}
```

Success responses:

```json
{
  "success": true,
  "data": {},
  "message": "Optional success message"
}
```

## Testing

Seed database with sample data:
```bash
npm run seed
```

## License

ISC
