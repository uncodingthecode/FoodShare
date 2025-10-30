"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { getDonationsByDonor, getUserById, type FoodDonation } from "@/lib/store"
import DonorHeader from "@/components/donor/donor-header"
import AddDonationForm from "@/components/donor/add-donation-form"
import DonationsList from "@/components/donor/donations-list"
import { Plus } from "lucide-react"

export default function DonorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [donations, setDonations] = useState<FoodDonation[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.userRole !== "donor") {
      router.push("/login")
      return
    }

    const userData = getUserById(currentUser.userId)
    if (userData) {
      setUser(userData)
      const userDonations = getDonationsByDonor(currentUser.userId)
      setDonations(userDonations)
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleDonationAdded = () => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      const userDonations = getDonationsByDonor(currentUser.userId)
      setDonations(userDonations)
      setShowForm(false)
    }
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
            <p className="text-3xl font-bold text-primary">{donations.length}</p>
          </div>
          <div className="card">
            <p className="text-muted text-sm mb-1">Claimed</p>
            <p className="text-3xl font-bold text-secondary">
              {donations.filter((d) => d.status === "claimed").length}
            </p>
          </div>
          <div className="card">
            <p className="text-muted text-sm mb-1">Available</p>
            <p className="text-3xl font-bold text-accent">{donations.filter((d) => d.status === "available").length}</p>
          </div>
        </div>

        {/* Add Donation Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus size={20} />
            Add New Donation
          </button>
        </div>

        {/* Add Donation Form */}
        {showForm && <AddDonationForm onDonationAdded={handleDonationAdded} onCancel={() => setShowForm(false)} />}

        {/* Donations List */}
        <DonationsList donations={donations} onRefresh={handleDonationAdded} />
      </main>
    </div>
  )
}
