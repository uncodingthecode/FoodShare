"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { donationsAPI } from "@/lib/api"
import DonorHeader from "@/components/donor/donor-header"
import AddDonationForm from "@/components/donor/add-donation-form"
import EditDonationForm from "@/components/donor/edit-donation-form"
import DonationsList from "@/components/donor/donations-list"
import { Plus } from "lucide-react"

export default function DonorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [donations, setDonations] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingDonation, setEditingDonation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.userRole !== "donor") {
      router.push("/login")
      return
    }

    setUser(currentUser)
    fetchDonations()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDonations()
    }, 30000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [router])

  const fetchDonations = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await donationsAPI.getMyDonations()
      // Response structure: { success: true, data: [...] }
      if (Array.isArray(response.data)) {
        setDonations(response.data)
      } else if (Array.isArray(response)) {
        setDonations(response)
      } else {
        setDonations([])
      }
    } catch (err: any) {
      console.error("Error fetching donations:", err)
      setError(err.message || "Failed to load donations")
      setDonations([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleDonationAdded = () => {
    fetchDonations()
    setShowForm(false)
  }

  const handleDonationUpdated = () => {
    fetchDonations()
    setEditingDonation(null)
  }

  const handleEdit = (donation: any) => {
    setEditingDonation(donation)
    setShowForm(false)
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
      <DonorHeader user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {user?.name}!</h1>
          <p className="text-muted">Share surplus food and make a difference in your community</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-muted text-sm mb-1">Total Donations</p>
            <p className="text-3xl font-bold text-primary">{Array.isArray(donations) ? donations.length : 0}</p>
          </div>
          <div className="card">
            <p className="text-muted text-sm mb-1">Claimed</p>
            <p className="text-3xl font-bold text-secondary">
              {Array.isArray(donations) ? donations.filter((d) => d.status === "claimed").length : 0}
            </p>
          </div>
          <div className="card">
            <p className="text-muted text-sm mb-1">Available</p>
            <p className="text-3xl font-bold text-accent">
              {Array.isArray(donations) ? donations.filter((d) => d.status === "available").length : 0}
            </p>
          </div>
        </div>

        {/* Add Donation Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingDonation(null)
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus size={20} />
            Add New Donation
          </button>
        </div>

        {/* Add Donation Form */}
        {showForm && <AddDonationForm onDonationAdded={handleDonationAdded} onCancel={() => setShowForm(false)} />}

        {/* Edit Donation Form */}
        {editingDonation && (
          <EditDonationForm 
            donation={editingDonation} 
            onDonationUpdated={handleDonationUpdated} 
            onCancel={() => setEditingDonation(null)} 
          />
        )}

        {/* Loading State */}
        {loading && !showForm && !editingDonation && (
          <div className="card text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted">Loading donations...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="card text-center py-12 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
            <button onClick={fetchDonations} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Retry
            </button>
          </div>
        )}

        {/* Donations List */}
        {!loading && !error && Array.isArray(donations) && (
          <DonationsList donations={donations} onRefresh={handleDonationAdded} onEdit={handleEdit} />
        )}
      </main>
    </div>
  )
}
