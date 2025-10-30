"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { getAllUsers, getAllClaims, getStatistics, type User, type Claim } from "@/lib/store"
import AdminHeader from "@/components/admin/admin-header"
import { Users, Package, CheckCircle, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.userRole !== "admin") {
      router.push("/login")
      return
    }

    // For demo purposes, create an admin user if not exists
    const userData = { id: currentUser.userId, name: "Admin", role: "admin" }
    setUser(userData)

    const allUsers = getAllUsers()
    setUsers(allUsers)

    const allClaims = getAllClaims()
    setClaims(allClaims)

    const statistics = getStatistics()
    setStats(statistics)

    setLoading(false)
  }, [router])

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

  return (
    <div className="min-h-screen bg-surface">
      <AdminHeader user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted">Monitor platform activity and manage the food sharing network</p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-primary">{stats?.totalUsers || 0}</p>
              </div>
              <Users size={32} className="text-primary-light" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm mb-1">Total Donations</p>
                <p className="text-3xl font-bold text-secondary">{stats?.totalDonations || 0}</p>
              </div>
              <Package size={32} className="text-secondary-light" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm mb-1">Claimed</p>
                <p className="text-3xl font-bold text-accent">{stats?.claimedDonations || 0}</p>
              </div>
              <CheckCircle size={32} className="text-accent-light" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm mb-1">Total Claims</p>
                <p className="text-3xl font-bold text-primary">{stats?.totalClaims || 0}</p>
              </div>
              <TrendingUp size={32} className="text-primary-light" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
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
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border hover:bg-surface transition-colors">
                        <td className="py-3 px-4 text-foreground">{u.name}</td>
                        <td className="py-3 px-4 text-muted">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              u.role === "donor"
                                ? "bg-primary-light text-primary"
                                : u.role === "ngo"
                                  ? "bg-secondary-light text-secondary"
                                  : u.role === "volunteer"
                                    ? "bg-accent-light text-accent"
                                    : "bg-muted text-foreground"
                            }`}
                          >
                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted">{u.organization || "-"}</td>
                        <td className="py-3 px-4 text-muted text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="claims" className="mt-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-foreground mb-6">All Claims</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Claim ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Donation ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">NGO</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Claimed On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim) => (
                      <tr key={claim.id} className="border-b border-border hover:bg-surface transition-colors">
                        <td className="py-3 px-4 text-foreground font-mono text-sm">{claim.id}</td>
                        <td className="py-3 px-4 text-muted font-mono text-sm">{claim.donationId}</td>
                        <td className="py-3 px-4 text-foreground">{claim.ngoName}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              claim.status === "pending"
                                ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                : claim.status === "completed"
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted text-sm">
                          {new Date(claim.claimedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
