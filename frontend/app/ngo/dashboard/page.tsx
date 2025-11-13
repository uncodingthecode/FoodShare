"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { donationsAPI, claimsAPI } from "@/lib/api"
import NGOHeader from "@/components/ngo/ngo-header"
import AvailableDonationsList from "@/components/ngo/available-donations-list"
import ClaimedDonationsList from "@/components/ngo/claimed-donations-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NGODashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [availableDonations, setAvailableDonations] = useState<any[]>([])
  const [claimedDonations, setClaimedDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("available")
  const [error, setError] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.userRole !== "ngo") {
      router.push("/login")
      return
    }

    setUser(currentUser)
    refreshData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData()
    }, 30000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [router])

  const refreshData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [availableResponse, claimedResponse] = await Promise.all([
        donationsAPI.getAvailable(),
        claimsAPI.getMyClaims()
      ])

      // Ensure both are arrays
      setAvailableDonations(Array.isArray(availableResponse.data) ? availableResponse.data : Array.isArray(availableResponse) ? availableResponse : [])
      setClaimedDonations(Array.isArray(claimedResponse.data) ? claimedResponse.data : Array.isArray(claimedResponse) ? claimedResponse : [])
    } catch (err: any) {
      console.error("Error fetching NGO data:", err)
      setError(err.message || "Failed to load data")
      setAvailableDonations([])
      setClaimedDonations([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleDonationClaimed = () => {
    refreshData()
    setActiveTab("claimed")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <NGOHeader user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {user?.organization}!</h1>
          <p className="text-muted">Find and claim available food donations for your beneficiaries</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-muted text-sm mb-1">Available Donations</p>
            <p className="text-3xl font-bold text-secondary">{availableDonations.length}</p>
          </div>
          <div className="card">
            <p className="text-muted text-sm mb-1">Claimed</p>
            <p className="text-3xl font-bold text-primary">{claimedDonations.length}</p>
          </div>
          <div className="card">
            <p className="text-muted text-sm mb-1">Pending Pickup</p>
            <p className="text-3xl font-bold text-accent">
              {claimedDonations.filter((c) => c.status === "pending").length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="available">Available Donations</TabsTrigger>
            <TabsTrigger value="claimed">My Claims</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            <AvailableDonationsList donations={availableDonations} onDonationClaimed={handleDonationClaimed} />
          </TabsContent>

          <TabsContent value="claimed" className="mt-6">
            <ClaimedDonationsList claims={claimedDonations} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
