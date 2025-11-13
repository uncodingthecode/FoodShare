# 🍱 FoodShare - Food Sharing & Surplus Management System

A complete web platform that connects food donors with NGOs and coordinates volunteers for pickup/delivery to reduce food wastage.

## 📁 Project Structure

```
FoodShare/
├── frontend/                # Next.js Frontend Application
│   ├── app/                # Next.js pages
│   ├── components/         # React components
│   ├── lib/                # Utilities & API
│   ├── public/             # Static assets
│   └── package.json
│
├── backend/                # Node.js + Express + MongoDB Backend
│   ├── src/
│   │   ├── models/        # Database models
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth & validation
│   │   └── server.js      # Main server
│   └── package.json
│
├── FRONTEND_INTEGRATION.md # Frontend-Backend integration guide
├── BACKEND_COMPLETE.md     # Backend completion summary
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed (local) OR MongoDB Atlas account
- npm or pnpm package manager

### 1. Start Backend Server

```bash
cd backend
npm install
npm run seed    # Create sample data
npm run dev     # Start on port 5000
```

**Backend will run at:** `http://localhost:5000`

### 2. Start Frontend Application

```bash
cd frontend
npm install
npm run dev     # Start on port 3000
```

**Frontend will run at:** `http://localhost:3000`

## 🧪 Test Accounts

After seeding the database, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@foodshare.com | admin123 |
| **Donor** | donor1@example.com | password123 |
| **NGO** | ngo1@example.com | password123 |
| **Volunteer** | volunteer1@example.com | password123 |

## ✨ Features

### 👥 User Roles

#### 🍛 Donors
- Add food donations with expiry dates
- Manage donation listings
- Track donation history
- Receive notifications when claimed

#### 🏢 NGOs
- Browse available food donations
- Claim donations (first-come-first-served)
- View claim history
- Receive pickup notifications

#### 🚚 Volunteers
- View available pickup requests
- Accept pickup tasks
- Update delivery status
- Track completed deliveries

#### 👔 Admins
- System dashboard with analytics
- User management
- Donation oversight
- Generate reports

### 🔐 Security Features
- JWT-based authentication
- Password hashing (bcryptjs)
- Role-based access control
- Input validation & sanitization
- Rate limiting
- CORS protection

### 📊 Core Functionality
- ✅ Automatic expiry validation
- ✅ Duplicate claim prevention
- ✅ Real-time notifications
- ✅ Location tracking (Google Maps ready)
- ✅ Multi-stage delivery tracking
- ✅ Admin dashboard & reports

## 📚 Documentation

- **Frontend Setup**: `frontend/README.md`
- **Backend Setup**: `backend/README.md`
- **Quick Start Guide**: `backend/QUICKSTART.md`
- **API Documentation**: `backend/API_TESTING.md`
- **Deployment Guide**: `backend/DEPLOYMENT.md`
- **Integration Guide**: `FRONTEND_INTEGRATION.md`
- **Backend Complete**: `BACKEND_COMPLETE.md`

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Donations
- `POST /donations` - Create donation (Donor)
- `GET /donations/available` - Get available donations
- `GET /donations/my-donations/list` - Get my donations (Donor)
- `PUT /donations/:id` - Update donation (Donor)
- `DELETE /donations/:id` - Delete donation (Donor)

### Claims
- `POST /claims/claim/:donationId` - Claim donation (NGO)
- `GET /claims/my-claims` - Get my claims (NGO)

### Pickups
- `GET /pickups/available` - Get available pickups (Volunteer)
- `POST /pickups/:id/accept` - Accept pickup (Volunteer)
- `PUT /pickups/:id/status` - Update status (Volunteer)
- `GET /pickups/my-pickups/list` - Get my pickups (Volunteer)

### Admin
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/users` - Get all users
- `GET /admin/reports` - Generate reports

### Notifications
- `GET /notifications` - Get my notifications
- `PUT /notifications/:id/read` - Mark as read

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 16.0 (React)
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Theme**: next-themes
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18
- **Database**: MongoDB with Mongoose 8.0
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: express-validator

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev     # Starts with nodemon (auto-reload)
```

### Frontend Development
```bash
cd frontend
npm run dev     # Starts Next.js dev server
```

### Database Seeding
```bash
cd backend
npm run seed    # Populates database with sample data
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm start       # Production mode
```

### Frontend
```bash
cd frontend
npm run build   # Build for production
npm start       # Start production server
```

## 🚀 Deployment

### Backend Deployment
Deploy to Render, Railway, Heroku, DigitalOcean, or AWS EC2.
See `backend/DEPLOYMENT.md` for detailed guides.

### Frontend Deployment
Deploy to Vercel (recommended), Netlify, or any Node.js hosting.

**Important:** Update environment variables:
- Frontend: `NEXT_PUBLIC_API_URL=https://your-backend-url.com/api`
- Backend: `FRONTEND_URL=https://your-frontend-url.com`

## 🧪 Testing

### Test Backend API
```bash
cd backend
# Import FoodShare_API.postman_collection.json in Postman
# Or use curl commands from API_TESTING.md
```

### Test Frontend
1. Start both backend and frontend
2. Navigate to `http://localhost:3000`
3. Login with test credentials
4. Test all user flows

## 🗂️ Database Schema

### Collections
- **Users** - User accounts with roles
- **Donations** - Food donations with expiry
- **Claims** - NGO claims on donations
- **PickupRequests** - Volunteer pickup tasks
- **Notifications** - User notifications

See `backend/STRUCTURE.md` for detailed schema.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

- **Setup Issues**: Check `backend/QUICKSTART.md`
- **API Questions**: See `backend/API_TESTING.md`
- **Integration Help**: Read `FRONTEND_INTEGRATION.md`
- **Deployment**: Refer to `backend/DEPLOYMENT.md`

## 🎯 System Requirements Met

✅ Four user roles (Donor, NGO, Volunteer, Admin)  
✅ Secure authentication with password hashing  
✅ Role-based access control  
✅ Donation management with expiry validation  
✅ First-come-first-served claim system  
✅ Automatic pickup request generation  
✅ Multi-stage delivery tracking  
✅ Real-time notifications  
✅ Admin dashboard with analytics  
✅ Location tracking support  
✅ Production-ready code  

## 🌟 Project Status

**Status**: ✅ Complete & Production Ready

Both frontend and backend are fully functional with all required features implemented.

---

## ⚙️ Environment

Create a `.env` file (or copy `.env.example`) and set the required variables before running the apps. A root-level `.env.example` has been added with common values for local development.

Example variables (in `.env` or `backend/.env` and `frontend/.env`):

```
# Backend
MONGO_URI=mongodb://localhost:27017/foodshare
PORT=5001
JWT_SECRET=your_jwt_secret_here

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

## ✅ Continuous Integration (GitHub Actions)

A basic CI workflow has been added at `.github/workflows/ci.yml`. It runs on push to `main` and performs the following steps on Ubuntu runners:

- Checks out the code
- Installs dependencies for `frontend` and `backend` (using `npm ci`)
- Runs `npm run lint` in each package if a `lint` script exists

If you want tests to run in CI, add a `test` script to `frontend/package.json` and/or `backend/package.json` and update the workflow accordingly.

---

**Made with ❤️ for reducing food wastage and helping communities**