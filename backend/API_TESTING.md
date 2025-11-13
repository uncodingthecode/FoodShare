# API Testing Guide

This guide will help you test the FoodShare API using tools like Postman, Thunder Client, or curl.

## Base URL
```
http://localhost:5000
```

## Authentication Flow

### 1. Register a New User

**POST** `/api/auth/register`

```json
{
  "email": "testdonor@example.com",
  "password": "password123",
  "name": "Test Donor",
  "role": "donor",
  "phone": "+1234567890",
  "organization": "Test Restaurant"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "testdonor@example.com",
    "name": "Test Donor",
    "role": "donor",
    ...
  }
}
```

### 2. Login

**POST** `/api/auth/login`

```json
{
  "email": "testdonor@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### 3. Get Current User

**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <your-token>
```

## Donor Flow

### Create a Donation

**POST** `/api/donations`

**Headers:**
```
Authorization: Bearer <donor-token>
```

**Body:**
```json
{
  "foodType": "Cooked Rice",
  "quantity": 10,
  "unit": "kg",
  "expiryHours": 4,
  "location": {
    "address": "123 Main St, New York, NY",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "description": "Fresh cooked rice from lunch buffet"
}
```

### Get My Donations

**GET** `/api/donations/my-donations/list`

**Headers:**
```
Authorization: Bearer <donor-token>
```

### Update Donation

**PUT** `/api/donations/:id`

**Headers:**
```
Authorization: Bearer <donor-token>
```

**Body:**
```json
{
  "quantity": 15,
  "description": "Updated description"
}
```

### Delete Donation

**DELETE** `/api/donations/:id`

**Headers:**
```
Authorization: Bearer <donor-token>
```

## NGO Flow

### View Available Donations

**GET** `/api/donations/available`

**Headers:**
```
Authorization: Bearer <ngo-token>
```

### Claim a Donation

**POST** `/api/claims/claim/:donationId`

**Headers:**
```
Authorization: Bearer <ngo-token>
```

**Body (optional):**
```json
{
  "notes": "Need urgently for evening distribution"
}
```

### Get My Claims

**GET** `/api/claims/my-claims`

**Headers:**
```
Authorization: Bearer <ngo-token>
```

## Volunteer Flow

### View Available Pickups

**GET** `/api/pickups/available`

**Headers:**
```
Authorization: Bearer <volunteer-token>
```

### Accept Pickup Request

**POST** `/api/pickups/:id/accept`

**Headers:**
```
Authorization: Bearer <volunteer-token>
```

### Update Pickup Status

**PUT** `/api/pickups/:id/status`

**Headers:**
```
Authorization: Bearer <volunteer-token>
```

**Body:**
```json
{
  "status": "picked_up"
}
```

Valid statuses: `picked_up`, `in_transit`, `delivered`, `cancelled`

### Get My Pickups

**GET** `/api/pickups/my-pickups/list`

**Headers:**
```
Authorization: Bearer <volunteer-token>
```

## Admin Flow

### Get Dashboard Statistics

**GET** `/api/admin/stats`

**Headers:**
```
Authorization: Bearer <admin-token>
```

### Get All Users

**GET** `/api/admin/users`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters (optional):**
- `role`: Filter by role (donor, ngo, volunteer)
- `isApproved`: Filter by approval status (true/false)
- `isActive`: Filter by active status (true/false)

### Approve/Disapprove User

**PUT** `/api/admin/users/:id/approve`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "isApproved": true
}
```

### Activate/Deactivate User

**PUT** `/api/admin/users/:id/activate`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "isActive": false
}
```

### Delete User

**DELETE** `/api/admin/users/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

### Get All Donations

**GET** `/api/admin/donations`

**Headers:**
```
Authorization: Bearer <admin-token>
```

### Delete Donation

**DELETE** `/api/admin/donations/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

### Generate Reports

**GET** `/api/admin/reports`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters (optional):**
- `startDate`: Start date for report (ISO format)
- `endDate`: End date for report (ISO format)

## Notifications

### Get My Notifications

**GET** `/api/notifications`

**Headers:**
```
Authorization: Bearer <your-token>
```

### Mark Notification as Read

**PUT** `/api/notifications/:id/read`

**Headers:**
```
Authorization: Bearer <your-token>
```

### Mark All as Read

**PUT** `/api/notifications/read-all/mark`

**Headers:**
```
Authorization: Bearer <your-token>
```

### Delete Notification

**DELETE** `/api/notifications/:id`

**Headers:**
```
Authorization: Bearer <your-token>
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "donor",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Donation (with token)
```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "foodType": "Rice",
    "quantity": 10,
    "unit": "kg",
    "expiryHours": 4,
    "location": {
      "address": "123 Main St",
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  }'
```

## Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'donor' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```
