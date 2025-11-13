# 🚀 Quick Start Guide

Get your FoodShare backend up and running in 5 minutes!

## Prerequisites

- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ MongoDB installed locally OR MongoDB Atlas account ([Get Free Account](https://www.mongodb.com/cloud/atlas))
- ✅ npm or pnpm package manager

## Installation Steps

### 1️⃣ Navigate to Backend Directory

```bash
cd backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

This will install all required packages including:
- express (web framework)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- And many more...

### 3️⃣ Setup Environment Variables

The `.env` file is already created with default values. **For production, update:**

```env
# IMPORTANT: Change this for production!
JWT_SECRET=your_super_secure_random_string_here

# Use MongoDB Atlas for production
MONGODB_URI=mongodb://localhost:27017/foodshare

# Update with your frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4️⃣ Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
net start MongoDB

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in `.env`

### 5️⃣ Seed the Database (Optional but Recommended)

This creates sample users and data for testing:

```bash
npm run seed
```

**Sample Login Credentials Created:**
- **Admin**: admin@foodshare.com / admin123
- **Donor**: donor1@example.com / password123
- **NGO**: ngo1@example.com / password123
- **Volunteer**: volunteer1@example.com / password123

### 6️⃣ Start the Server

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### 7️⃣ Verify Installation

Open your browser or use curl:

```bash
curl http://localhost:5000/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-11-07T..."
}
```

## 🎉 Success! Your API is Running!

- **API Base URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Docs**: See `API_TESTING.md`

## Next Steps

### 1. Test the API

**Using cURL:**
```bash
# Register a new user
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

**Using Postman:**
1. Import `FoodShare_API.postman_collection.json`
2. Set `baseUrl` to `http://localhost:5000`
3. Start testing!

### 2. Connect Your Frontend

Update your Next.js frontend to use the API:

```typescript
// In your frontend config
const API_BASE_URL = 'http://localhost:5000/api';

// Example: Login
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

### 3. Explore the API

Check out these files:
- 📖 `API_TESTING.md` - Complete API documentation
- 🚀 `DEPLOYMENT.md` - Deploy to production
- 📮 `FoodShare_API.postman_collection.json` - Postman collection

## Common Issues

### MongoDB Connection Error

**Error:** `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
- Make sure MongoDB is running
- Or use MongoDB Atlas cloud database

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Change PORT in .env file
PORT=5001
```

### JWT Secret Warning

**Warning:** "JWT_SECRET is using default value"

**Solution:**
- Generate a secure random string
- Update `JWT_SECRET` in `.env`

```bash
# Generate secure secret (Node.js)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📚 Available Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with auto-reload
npm run seed    # Seed database with sample data
```

## 🔐 Security Notes

Before deploying to production:

1. ✅ Change `JWT_SECRET` to a strong random string
2. ✅ Use MongoDB Atlas or secure MongoDB instance
3. ✅ Enable HTTPS/SSL
4. ✅ Update CORS settings in `src/server.js`
5. ✅ Review and adjust rate limiting
6. ✅ Enable MongoDB authentication
7. ✅ Set `NODE_ENV=production`

## 📞 Need Help?

- Check `README.md` for detailed information
- Review `API_TESTING.md` for API examples
- See `DEPLOYMENT.md` for production deployment

## 🎯 What's Next?

1. **Test all endpoints** using Postman or curl
2. **Connect your frontend** to the API
3. **Customize** the code for your needs
4. **Deploy** to production (see DEPLOYMENT.md)

---

Happy Coding! 🚀
