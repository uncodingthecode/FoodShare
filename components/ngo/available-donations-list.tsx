"use client"

import type { FoodDonation } from "@/lib/store"
import { claimDonation, getUserById } from "@/lib/store"
import { getCurrentUser } from "@/lib/auth"
import { Clock, MapPin, Package, Check } from "lucide-react"
import { useState } from "react"

interface AvailableDonationsListProps {
  donations: FoodDonation[]
  onDonationClaimed: () => void
}

export default function AvailableDonationsList({ donations, onDonationClaimed }: AvailableDonationsListProps) {
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set())

  const getTimeRemaining = (expiryTime: Date) => {
    const now = new Date()
    const diff = new Date(expiryTime).getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours < 0) return "Expired"
    if (hours === 0) return `${minutes}m left`
    return `${hours}h ${minutes}m left`
  }

  const handleClaim = (donationId: string) => {
    const currentUser = getCurrentUser()
    if (!currentUser) return

    setClaimingId(donationId)

    const user = getUserById(currentUser.userId)
    if (!user) {
      setClaimingId(null)
      return
    }

    const claim = claimDonation(donationId, currentUser.userId, user.organization || "")

    if (claim) {
      setClaimedIds((prev) => new Set([...prev, donationId]))
      setTimeout(() => {
        setClaimingId(null)
        onDonationClaimed()
      }, 1000)
    } else {
      setClaimingId(null)
    }
  }

  if (donations.length === 0) {
    return (
      <div className="card text-center py-12">
        <Package size={48} className="mx-auto text-muted mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No available donations</h3>
        <p className="text-muted">Check back soon for new food donations in your area</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">Available Donations</h2>
      {donations.map((donation) => (
        <div key={donation.id} className="card border-l-4 border-l-secondary hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">{donation.foodType}</h3>
              <p className="text-muted text-sm">From: {donation.donorName}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
              Available
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-muted">
              <Package size={18} />
              <span>
                {donation.quantity} {donation.unit}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Clock size={18} />
              <span className={getTimeRemaining(donation.expiryTime) === "Expired" ? "text-red-600 font-semibold" : ""}>
                {getTimeRemaining(donation.expiryTime)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted md:col-span-2">
              <MapPin size={18} />
              <span>{donation.location.address}</span>
            </div>
          </div>

          {donation.description && (
            <div className="mb-4 p-3 bg-surface rounded-lg">
              <p className="text-sm text-foreground">{donation.description}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-border">
            <button
              onClick={() => handleClaim(donation.id)}
              disabled={claimingId === donation.id || claimedIds.has(donation.id)}
              className="flex-1 px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {claimedIds.has(donation.id) ? (
                <>
                  <Check size={18} />
                  <span>Claimed</span>
                </>
              ) : claimingId === donation.id ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Claiming...</span>
                </>
              ) : (
                <>
                  <span>Claim Donation</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
