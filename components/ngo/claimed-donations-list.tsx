"use client"

import type { Claim } from "@/lib/store"
import { getDonationById, updateClaimStatus } from "@/lib/store"
import { Clock, MapPin, Package, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

interface ClaimedDonationsListProps {
  claims: Claim[]
}

export default function ClaimedDonationsList({ claims }: ClaimedDonationsListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
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

  const handleMarkCompleted = (claimId: string) => {
    setUpdatingId(claimId)
    updateClaimStatus(claimId, "completed")
    setTimeout(() => {
      setUpdatingId(null)
    }, 500)
  }

  if (claims.length === 0) {
    return (
      <div className="card text-center py-12">
        <Package size={48} className="mx-auto text-muted mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No claimed donations</h3>
        <p className="text-muted">Claim available donations to see them here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">My Claims</h2>
      {claims.map((claim) => {
        const donation = getDonationById(claim.donationId)
        if (!donation) return null

        return (
          <div key={claim.id} className="card border-l-4 border-l-primary">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{donation.foodType}</h3>
                <p className="text-muted text-sm">Claimed on: {new Date(claim.claimedAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(claim.status)}`}>
                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
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
                <span
                  className={getTimeRemaining(donation.expiryTime) === "Expired" ? "text-red-600 font-semibold" : ""}
                >
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

            {claim.status === "pending" && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                <AlertCircle size={18} className="text-yellow-600" />
                <p className="text-sm text-yellow-700">Awaiting pickup. Mark as completed when done.</p>
              </div>
            )}

            {claim.status === "completed" && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" />
                <p className="text-sm text-green-700">Pickup completed successfully!</p>
              </div>
            )}

            {claim.status === "pending" && (
              <div className="flex gap-2 pt-4 border-t border-border">
                <button
                  onClick={() => handleMarkCompleted(claim.id)}
                  disabled={updatingId === claim.id}
                  className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updatingId === claim.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <span>Mark as Completed</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
