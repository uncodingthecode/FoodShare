# 🔗 Frontend Integration Guide

This guide will help you connect your Next.js frontend with the FoodShare backend API.

## 📋 Prerequisites

- ✅ Backend server running on `http://localhost:5000`
- ✅ Frontend running on `http://localhost:3000`
- ✅ Sample data seeded (run `npm run seed` in backend)

## 🔧 Frontend Setup

### 1. Create API Configuration File

Create `lib/api.ts` in your frontend:

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to make API requests
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
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

### 2. Update Authentication Functions

Replace the content of `lib/auth.ts`:

```typescript
// lib/auth.ts
import { apiRequest } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'donor' | 'ngo' | 'volunteer' | 'admin';
  phone: string;
  organization?: string;
  isApproved: boolean;
}

// Register user
export async function registerUser(userData: {
  email: string;
  password: string;
  name: string;
  role: string;
  phone: string;
  organization?: string;
}) {
  try {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success) {
      // Save token and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('userRole', response.user.role);
      return response.user;
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      // Save token and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('userRole', response.user.role);
      return response.user;
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const response = await apiRequest('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get user error:', error);
    logout();
    return null;
  }
}

// Logout
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  }
}

// Check if authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}

// Get user ID
export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userId');
}

// Get user role
export function getUserRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userRole');
}
```

### 3. Update Donation Functions

Replace the content of `lib/store.ts`:

```typescript
// lib/store.ts
import { apiRequest } from './api';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface FoodDonation {
  _id: string;
  donor: any;
  foodType: string;
  quantity: number;
  unit: string;
  expiryTime: Date;
  location: Location;
  description: string;
  status: 'available' | 'claimed' | 'expired' | 'cancelled';
  createdAt: Date;
  claimedBy?: any;
  claimedAt?: Date;
}

export interface Claim {
  _id: string;
  donation: any;
  ngo: any;
  claimedAt: Date;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface PickupRequest {
  _id: string;
  claim: any;
  donation: any;
  ngo: any;
  volunteer?: any;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  pickupLocation: Location;
  deliveryLocation: Location;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
}

// Donation Management
export async function addDonation(donationData: {
  foodType: string;
  quantity: number;
  unit: string;
  expiryHours: number;
  location: Location;
  description: string;
}) {
  try {
    const response = await apiRequest('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
    return response.data;
  } catch (error) {
    console.error('Add donation error:', error);
    throw error;
  }
}

export async function getAvailableDonations(): Promise<FoodDonation[]> {
  try {
    const response = await apiRequest('/donations/available');
    return response.data;
  } catch (error) {
    console.error('Get donations error:', error);
    throw error;
  }
}

export async function getMyDonations(): Promise<FoodDonation[]> {
  try {
    const response = await apiRequest('/donations/my-donations/list');
    return response.data;
  } catch (error) {
    console.error('Get my donations error:', error);
    throw error;
  }
}

export async function updateDonation(id: string, updates: any) {
  try {
    const response = await apiRequest(`/donations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  } catch (error) {
    console.error('Update donation error:', error);
    throw error;
  }
}

export async function deleteDonation(id: string) {
  try {
    const response = await apiRequest(`/donations/${id}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Delete donation error:', error);
    throw error;
  }
}

// Claim Management
export async function claimDonation(donationId: string, notes?: string) {
  try {
    const response = await apiRequest(`/claims/claim/${donationId}`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
    return response.data;
  } catch (error) {
    console.error('Claim donation error:', error);
    throw error;
  }
}

export async function getMyClaims(): Promise<Claim[]> {
  try {
    const response = await apiRequest('/claims/my-claims');
    return response.data;
  } catch (error) {
    console.error('Get my claims error:', error);
    throw error;
  }
}

// Pickup Management
export async function getAvailablePickups(): Promise<PickupRequest[]> {
  try {
    const response = await apiRequest('/pickups/available');
    return response.data;
  } catch (error) {
    console.error('Get available pickups error:', error);
    throw error;
  }
}

export async function acceptPickup(pickupId: string) {
  try {
    const response = await apiRequest(`/pickups/${pickupId}/accept`, {
      method: 'POST',
    });
    return response.data;
  } catch (error) {
    console.error('Accept pickup error:', error);
    throw error;
  }
}

export async function updatePickupStatus(pickupId: string, status: string) {
  try {
    const response = await apiRequest(`/pickups/${pickupId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.data;
  } catch (error) {
    console.error('Update pickup status error:', error);
    throw error;
  }
}

export async function getMyPickups(): Promise<PickupRequest[]> {
  try {
    const response = await apiRequest('/pickups/my-pickups/list');
    return response.data;
  } catch (error) {
    console.error('Get my pickups error:', error);
    throw error;
  }
}

// Admin Functions
export async function getDashboardStats() {
  try {
    const response = await apiRequest('/admin/stats');
    return response.data;
  } catch (error) {
    console.error('Get stats error:', error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const response = await apiRequest('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
}

// Notifications
export async function getNotifications() {
  try {
    const response = await apiRequest('/notifications');
    return response.data;
  } catch (error) {
    console.error('Get notifications error:', error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const response = await apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
    return response.data;
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
}
```

### 4. Add Environment Variable

Create or update `.env.local` in your frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5. Update Components

Your existing components should now work! Just make sure they're using the updated functions from `lib/store.ts` and `lib/auth.ts`.

## 🧪 Testing the Integration

### 1. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd ..  # Back to project root
npm run dev
```

### 2. Test Login Flow

1. Go to `http://localhost:3000/login`
2. Use these credentials (from seed data):
   - **Email**: donor1@example.com
   - **Password**: password123

### 3. Test Donor Flow

1. Login as donor
2. Go to donor dashboard
3. Create a new donation
4. View your donations list

### 4. Test NGO Flow

1. Logout and login as NGO:
   - **Email**: ngo1@example.com
   - **Password**: password123
2. Browse available donations
3. Claim a donation

### 5. Test Volunteer Flow

1. Logout and login as volunteer:
   - **Email**: volunteer1@example.com
   - **Password**: password123
2. View available pickups
3. Accept a pickup
4. Update status

## 🎨 UI Updates Needed

Since your frontend uses in-memory storage, update these components to use the new API:

### Login Page (`app/login/page.tsx`)
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const user = await loginUser(formData.email, formData.password);
    router.push(`/${user.role}/dashboard`);
  } catch (error) {
    setError(error.message);
  }
};
```

### Register Page (`app/register/page.tsx`)
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await registerUser(formData);
    router.push('/login');
  } catch (error) {
    setError(error.message);
  }
};
```

### Donation Form (`components/donor/add-donation-form.tsx`)
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await addDonation(formData);
    onDonationAdded();
  } catch (error) {
    setError(error.message);
  }
};
```

## 🔍 Debugging Tips

### Check Backend Logs
```bash
# In backend directory
npm run dev
# Watch for error messages
```

### Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for failed requests
4. Check request/response details

### Common Issues

**CORS Error:**
```
Access to fetch has been blocked by CORS policy
```
**Solution:** Backend already has CORS enabled for `http://localhost:3000`

**401 Unauthorized:**
```
Not authorized to access this route
```
**Solution:** Make sure token is being sent in Authorization header

**500 Server Error:**
Check backend terminal for error details

## 📱 Mobile/Responsive Testing

The backend supports all devices. Make sure your frontend:
1. Handles token storage properly
2. Manages authentication state
3. Shows loading states
4. Displays error messages

## 🚀 Production Deployment

When deploying:

1. **Update API URL in frontend:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

2. **Update CORS in backend:**
```javascript
// In src/server.js
app.use(cors({
  origin: 'https://your-frontend-url.com',
  credentials: true
}));
```

3. **Enable HTTPS** on both frontend and backend

## ✅ Integration Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] API functions updated in frontend
- [ ] Environment variables set
- [ ] Authentication working
- [ ] Can create donations
- [ ] Can claim donations
- [ ] Can accept pickups
- [ ] Notifications working
- [ ] Error handling implemented

## 🎉 You're All Set!

Your frontend is now connected to a fully functional backend with:
- ✅ Real database (MongoDB)
- ✅ Secure authentication (JWT)
- ✅ Role-based access control
- ✅ Real-time notifications
- ✅ Production-ready API

Happy coding! 🚀
