"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { getAvailableDonations, getUserById, type FoodDonation } from "@/lib/store"
import VolunteerHeader from "@/components/volunteer/volunteer-header"
import { MapPin, Package, Clock, AlertCircle } from "lucide-react"

export default function VolunteerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [donations, setDonations] = useState<FoodDonation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.userRole !== "volunteer") {
      router.push("/login")
      return
    }

    const userData = getUserById(currentUser.userId)
    if (userData) {
      setUser(userData)
      const available = getAvailableDonations()
      setDonations(available)
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getTimeRemaining = (expiryTime: Date) => {
    const now = new Date()
    const diff = new Date(expiryTime).getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours < 0) return "Expired"
    if (hours === 0) return `${minutes}m left`
    return `${hours}h ${minutes}m left`
  }

  const getUrgency = (expiryTime: Date) => {
    const now = new Date()
    const diff = new Date(expiryTime).getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 0) return "expired"
    if (hours <= 1) return "urgent"
    if (hours <= 3) return "soon"
    return "normal"
  }

  const filteredDonations = donations.filter((d) => {
    if (filter === "urgent") return getUrgency(d.expiryTime) === "urgent"
    if (filter === "soon") return getUrgency(d.expiryTime) === "soon"
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <VolunteerHeader user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {user?.name}!</h1>
          <p className="text-muted">Help coordinate food donations and support the network</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-muted text-sm mb-1">Total Available</p>
            <p className="text-3xl font-bold text-accent">{donations.length}</p>
          </div>
          <div className="card">
            <p className="text-muted text-sm mb-1">Urgent (1h left)</p>
            <p className="text-3xl font-bold text-red-600">
              {donations.filter((d) => getUrgency(d.expiryTime) === "urgent").length}
            </p>
          </div>
          <div className="card">
            <p className="text-muted text-sm mb-1">Expiring Soon (3h)</p>
            <p className="text-3xl font-bold text-orange-600">
              {donations.filter((d) => getUrgency(d.expiryTime) === "soon").length}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-accent text-white"
                : "bg-white border border-border text-foreground hover:bg-surface"
            }`}
          >
            All Donations
          </button>
          <button
            onClick={() => setFilter("urgent")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "urgent"
                ? "bg-red-600 text-white"
                : "bg-white border border-border text-foreground hover:bg-surface"
            }`}
          >
            Urgent
          </button>
          <button
            onClick={() => setFilter("soon")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "soon"
                ? "bg-orange-600 text-white"
                : "bg-white border border-border text-foreground hover:bg-surface"
            }`}
          >
            Expiring Soon
          </button>
        </div>

        {/* Donations List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Available Donations</h2>
          {filteredDonations.length === 0 ? (
            <div className="card text-center py-12">
              <Package size={48} className="mx-auto text-muted mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No donations found</h3>
              <p className="text-muted">Try adjusting your filters</p>
            </div>
          ) : (
            filteredDonations.map((donation) => {
              const urgency = getUrgency(donation.expiryTime)
              return (
                <div
                  key={donation.id}
                  className={`card border-l-4 ${
                    urgency === "urgent"
                      ? "border-l-red-600 bg-red-50"
                      : urgency === "soon"
                        ? "border-l-orange-600 bg-orange-50"
                        : "border-l-accent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{donation.foodType}</h3>
                      <p className="text-muted text-sm">From: {donation.donorName}</p>
                    </div>
                    {urgency === "urgent" && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-600 text-white flex items-center gap-1">
                        <AlertCircle size={16} />
                        Urgent
                      </span>
                    )}
                    {urgency === "soon" && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-600 text-white">
                        Expiring Soon
                      </span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-foreground">
                      <Package size={18} />
                      <span>
                        {donation.quantity} {donation.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Clock size={18} />
                      <span className={urgency === "urgent" ? "font-bold text-red-600" : ""}>
                        {getTimeRemaining(donation.expiryTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground md:col-span-2">
                      <MapPin size={18} />
                      <span>{donation.location.address}</span>
                    </div>
                  </div>

                  {donation.description && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-border">
                      <p className="text-sm text-foreground">{donation.description}</p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
