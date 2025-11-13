# FoodShare Frontend

Next.js frontend for the Food Sharing & Surplus Management System.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Backend server running on `http://localhost:5000`

### Installation

1. **Install Dependencies**
```bash
npm install
# or
pnpm install
```

2. **Configure Environment Variables**

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. **Start Development Server**
```bash
npm run dev
# or
pnpm dev
```

The frontend will start at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js 13+ app directory
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── donor/               # Donor dashboard
│   ├── ngo/                 # NGO dashboard
│   ├── volunteer/           # Volunteer dashboard
│   └── admin/               # Admin dashboard
│
├── components/              # Reusable components
│   ├── ui/                  # UI components (shadcn/ui)
│   ├── donor/               # Donor-specific components
│   ├── ngo/                 # NGO-specific components
│   ├── volunteer/           # Volunteer-specific components
│   ├── admin/               # Admin-specific components
│   ├── navbar.tsx           # Navigation bar
│   ├── protected-route.tsx  # Route protection
│   └── theme-provider.tsx   # Theme provider
│
├── lib/                     # Utility functions
│   ├── auth.ts              # Authentication utilities
│   ├── store.ts             # Data management
│   └── utils.ts             # Helper functions
│
├── public/                  # Static assets
├── styles/                  # Additional styles
└── package.json             # Dependencies
```

## 🔗 Connecting to Backend

### Update API Functions

Replace `lib/api.ts` content (create if doesn't exist):

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export default API_BASE_URL;
```

See `../FRONTEND_INTEGRATION.md` for complete integration guide.

## 🎨 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🧪 Testing the Frontend

1. **Start Backend Server** (in separate terminal):
```bash
cd ../backend
npm run dev
```

2. **Start Frontend Server**:
```bash
npm run dev
```

3. **Login with Sample Credentials**:
- **Donor**: donor1@example.com / password123
- **NGO**: ngo1@example.com / password123
- **Volunteer**: volunteer1@example.com / password123
- **Admin**: admin@foodshare.com / admin123

## 🔐 User Roles

### Donor Dashboard (`/donor/dashboard`)
- Add food donations
- View donation history
- Edit/delete donations (if unclaimed)
- Receive notifications

### NGO Dashboard (`/ngo/dashboard`)
- Browse available donations
- Claim donations
- View claimed donations history

### Volunteer Dashboard (`/volunteer/dashboard`)
- View available pickup requests
- Accept pickup tasks
- Update delivery status

### Admin Dashboard (`/admin/dashboard`)
- View system statistics
- Manage users
- Oversee donations
- Generate reports

## 🎯 Key Features

- ✅ Role-based authentication
- ✅ Protected routes
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Real-time notifications (ready)
- ✅ Location tracking (Google Maps ready)
- ✅ Form validation
- ✅ Error handling

## 📦 Technologies Used

- **Framework**: Next.js 16.0
- **UI Library**: Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **Validation**: Zod (via @hookform/resolvers)
- **Icons**: Lucide React
- **Theme**: next-themes

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL=your-backend-url/api`
4. Deploy!

### Deploy to Netlify

```bash
npm run build
# Upload .next folder to Netlify
```

## 🔧 Configuration

### Update API URL

For production, update `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## 📚 Documentation

- **API Integration**: See `../FRONTEND_INTEGRATION.md`
- **Backend Setup**: See `../backend/README.md`
- **Quick Start**: See `../backend/QUICKSTART.md`

## 🐛 Troubleshooting

### CORS Error
Make sure backend CORS is configured for your frontend URL.

### API Connection Failed
1. Verify backend is running on port 5000
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure no firewall blocking

### Authentication Issues
1. Clear browser localStorage
2. Check JWT token in browser DevTools
3. Verify backend JWT_SECRET is set

## 🤝 Contributing

This is the frontend for the FoodShare project. Make sure backend is running when developing.

## 📄 License

This project is part of the FoodShare Food Sharing & Surplus Management System.

---

For complete system documentation, see the main README.md in the project root.
