"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { pickupsAPI } from "@/lib/api"
import VolunteerHeader from "@/components/volunteer/volunteer-header"
import { MapPin, Package, Clock, AlertCircle } from "lucide-react"

export default function VolunteerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [availablePickups, setAvailablePickups] = useState<any[]>([])
  const [myPickups, setMyPickups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("available")
  const [acceptingId, setAcceptingId] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.userRole !== "volunteer") {
      router.push("/login")
      return
    }

    setUser(currentUser)
    fetchPickups()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchPickups()
    }, 30000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [router])

  const fetchPickups = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Fetch both available pickups and my pickups
      const [availableResponse, myPickupsResponse] = await Promise.all([
        pickupsAPI.getAvailable(),
        pickupsAPI.getMyPickups()
      ])
      
      // Ensure both are arrays
      setAvailablePickups(Array.isArray(availableResponse.data) ? availableResponse.data : Array.isArray(availableResponse) ? availableResponse : [])
      setMyPickups(Array.isArray(myPickupsResponse.data) ? myPickupsResponse.data : Array.isArray(myPickupsResponse) ? myPickupsResponse : [])
    } catch (err: any) {
      console.error("Error fetching pickups:", err)
      setError(err.message || "Failed to load pickups")
      setAvailablePickups([])
      setMyPickups([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleAcceptPickup = async (pickupId: string) => {
    if (!confirm('Accept this pickup request?')) {
      return
    }

    setAcceptingId(pickupId)
    try {
      await pickupsAPI.accept(pickupId)
      alert('Pickup accepted successfully!')
      fetchPickups()
    } catch (error: any) {
      console.error('Failed to accept pickup:', error)
      alert(error.message || 'Failed to accept pickup')
    } finally {
      setAcceptingId(null)
    }
  }

  const handleUpdateStatus = async (pickupId: string, status: string) => {
    if (!confirm(`Update pickup status to ${status}?`)) {
      return
    }

    try {
      await pickupsAPI.updateStatus(pickupId, status)
      alert(`Pickup status updated to ${status}!`)
      fetchPickups()
    } catch (error: any) {
      console.error('Failed to update pickup status:', error)
      alert(error.message || 'Failed to update status')
    }
  }

  const getTimeRemaining = (expiryTime: string) => {
    const now = new Date()
    const diff = new Date(expiryTime).getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours < 0) return "Expired"
    if (hours === 0) return `${minutes}m left`
    return `${hours}h ${minutes}m left`
  }

  const getUrgency = (expiryTime: string) => {
    const now = new Date()
    const diff = new Date(expiryTime).getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 0) return "expired"
    if (hours <= 1) return "urgent"
    if (hours <= 3) return "soon"
    return "normal"
  }

  // Determine which pickups to show based on filter
  const displayPickups = filter === "available" ? availablePickups : myPickups
  
  // Count statistics
  const totalAvailable = availablePickups.length
  const totalMine = myPickups.length
  const pendingCount = myPickups.filter((p: any) => p.status === "pending").length
  const inProgressCount = myPickups.filter((p: any) => p.status === "accepted" || p.status === "picked_up" || p.status === "in_transit").length

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
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {user?.userName || 'Volunteer'}!</h1>
          <p className="text-muted">Help coordinate food donations and support the network</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-muted text-sm mb-1">Available to Accept</p>
            <p className="text-3xl font-bold text-accent">{totalAvailable}</p>
          </div>
          <div className="card">
            <p className="text-muted text-sm mb-1">My Pickups</p>
            <p className="text-3xl font-bold text-orange-600">
              {totalMine}
            </p>
          </div>
          <div className="card">
            <p className="text-muted text-sm mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">
              {inProgressCount}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("available")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "available"
                ? "bg-accent text-white"
                : "bg-white border border-border text-foreground hover:bg-surface"
            }`}
          >
            Available to Accept ({totalAvailable})
          </button>
          <button
            onClick={() => setFilter("myPickups")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "myPickups"
                ? "bg-accent text-white"
                : "bg-white border border-border text-foreground hover:bg-surface"
            }`}
          >
            My Pickups ({totalMine})
          </button>
        </div>

        {/* Donations List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {filter === "available" ? "Available Pickup Requests" : "My Active Pickups"}
          </h2>
          {displayPickups.length === 0 ? (
            <div className="card text-center py-12">
              <Package size={48} className="mx-auto text-muted mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No pickup requests found</h3>
              <p className="text-muted">Check back later for new requests</p>
            </div>
          ) : (
            displayPickups.map((pickup: any) => {
              return (
                <div
                  key={pickup._id}
                  className="card border-l-4 border-l-accent"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{pickup.donation?.foodType || 'Food Donation'}</h3>
                      <p className="text-muted text-sm">Pickup ID: {pickup._id.slice(-8)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      pickup.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      pickup.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                      pickup.status === 'in_transit' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1).replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-foreground">
                      <Package size={18} />
                      <span>
                        {pickup.donation?.quantity || 'N/A'} {pickup.donation?.unit || ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Clock size={18} />
                      <span>
                        {pickup.scheduledPickupTime ? new Date(pickup.scheduledPickupTime).toLocaleString() : 'Not scheduled'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground md:col-span-2">
                      <MapPin size={18} />
                      <span>{pickup.donation?.location?.address || 'Address not available'}</span>
                    </div>
                  </div>

                  {pickup.donation?.description && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-border">
                      <p className="text-sm text-foreground">{pickup.donation.description}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-border mt-4">
                    {pickup.status === 'pending' && (
                      <button 
                        className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        onClick={() => handleAcceptPickup(pickup._id)}
                        disabled={acceptingId === pickup._id}
                      >
                        {acceptingId === pickup._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Accepting...</span>
                          </>
                        ) : (
                          <span>Accept Pickup</span>
                        )}
                      </button>
                    )}

                    {pickup.status === 'accepted' && (
                      <button 
                        className="flex-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                        onClick={() => handleUpdateStatus(pickup._id, 'picked_up')}
                      >
                        Mark as Picked Up
                      </button>
                    )}

                    {pickup.status === 'picked_up' && (
                      <button 
                        className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => handleUpdateStatus(pickup._id, 'in_transit')}
                      >
                        Start Transit
                      </button>
                    )}

                    {pickup.status === 'in_transit' && (
                      <button 
                        className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                        onClick={() => handleUpdateStatus(pickup._id, 'delivered')}
                      >
                        Mark as Delivered
                      </button>
                    )}

                    {pickup.status === 'completed' && (
                      <div className="flex-1 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-center">
                        <span className="text-green-700 font-semibold">✓ Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
