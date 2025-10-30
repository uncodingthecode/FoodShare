"use client"

import type { FoodDonation } from "@/lib/store"
import { Clock, MapPin, Package, Trash2 } from "lucide-react"

interface DonationsListProps {
  donations: FoodDonation[]
  onRefresh: () => void
}

export default function DonationsList({ donations, onRefresh }: DonationsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-50 text-green-700 border-green-200"
      case "claimed":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "expired":
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

  if (donations.length === 0) {
    return (
      <div className="card text-center py-12 animate-fade-in">
        <Package size={48} className="mx-auto text-muted mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No donations yet</h3>
        <p className="text-muted">Start by adding your first food donation to help the community</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">Your Donations</h2>
      {donations.map((donation, idx) => (
        <div
          key={donation.id}
          className="card border-l-4 border-l-primary animate-fade-in hover:shadow-lg transition-all duration-300"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">{donation.foodType}</h3>
              <p className="text-muted text-sm">ID: {donation.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(donation.status)}`}>
              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
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
              <span>{getTimeRemaining(donation.expiryTime)}</span>
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

          {donation.claimedBy && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-pulse-soft">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Claimed by:</span> {donation.claimedBy}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-border">
            <button className="flex-1 px-4 py-2 text-muted hover:text-foreground transition-colors flex items-center justify-center gap-2 hover:bg-surface rounded-lg">
              <Trash2 size={18} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
