"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { adminAPI } from "@/lib/api"
import AdminHeader from "@/components/admin/admin-header"
import { Users, Package, CheckCircle, TrendingUp, RefreshCw } from "lucide-react"

interface User {
  _id: string
  name: string
  email: string
  role: string
  organization?: string
  createdAt: string
}

interface Stats {
  users: {
    total: number
    donors: number
    ngos: number
    volunteers: number
    pendingApprovals?: number
  }
  donations: {
    total: number
    available: number
    claimed: number
    expired?: number
  }
  claims: {
    total: number
    pending?: number
    completed?: number
  }
  pickups: {
    total: number
    pending: number
    active?: number
    completed: number
  }
  impact?: {
    totalFoodSaved: number
    nGOsServed: number
    activeVolunteers: number
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ userId: string; userName: string | null; userRole: string } | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.userRole !== "admin") {
      router.push("/login")
      return
    }

    setUser(currentUser)
    fetchData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData()
    }, 30000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [router])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Fetch stats and users from backend
      const [statsResponse, usersResponse] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers()
      ])

      console.log('Stats Response:', statsResponse)
      console.log('Users Response:', usersResponse)

      // Ensure we're setting the correct data
      setStats(statsResponse.data || statsResponse)
      setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : Array.isArray(usersResponse) ? usersResponse : [])
    } catch (err: any) {
      console.error("Error fetching admin data:", err)
      setError(err.message || "Failed to load dashboard data")
      setStats(null)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <AdminHeader user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted">Monitor platform activity and manage the food sharing network</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-primary">{stats?.users?.total || 0}</p>
              </div>
              <Users size={32} className="text-primary-light" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm mb-1">Total Donations</p>
                <p className="text-3xl font-bold text-secondary">{stats?.donations?.total || 0}</p>
              </div>
              <Package size={32} className="text-secondary-light" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm mb-1">Claimed</p>
                <p className="text-3xl font-bold text-accent">{stats?.donations?.claimed || 0}</p>
              </div>
              <CheckCircle size={32} className="text-accent-light" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm mb-1">Total Claims</p>
                <p className="text-3xl font-bold text-primary">{stats?.claims?.total || 0}</p>
              </div>
              <TrendingUp size={32} className="text-primary-light" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <h2 className="text-2xl font-bold text-foreground mb-6">Registered Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Organization</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {!Array.isArray(users) || users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u: User) => (
                    <tr key={u._id} className="border-b border-border hover:bg-surface transition-colors">
                      <td className="py-3 px-4 text-foreground">{u.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-muted">{u.email || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            u.role === "donor"
                              ? "bg-orange-100 text-orange-700 border border-orange-300"
                              : u.role === "ngo"
                                ? "bg-red-100 text-red-700 border border-red-300"
                                : u.role === "volunteer"
                                  ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                  : "bg-gray-100 text-gray-700 border border-gray-300"
                          }`}
                        >
                          {u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted">{u.organization || "-"}</td>
                      <td className="py-3 px-4 text-muted text-sm">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
