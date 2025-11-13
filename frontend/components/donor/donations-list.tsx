"use client"

import { Clock, MapPin, Package, Trash2, Edit } from "lucide-react"
import { donationsAPI } from "@/lib/api"
import { useState } from "react"

interface Donation {
  _id: string
  foodType: string
  quantity: number
  unit: string
  expiryTime: string
  location: {
    address: string
  }
  status: string
  description?: string
  claimedBy?: {
    _id: string
    name: string
    email: string
    organization?: string
  } | string
  createdAt: string
}

interface DonationsListProps {
  donations: Donation[]
  onRefresh: () => void
  onEdit?: (donation: Donation) => void
}

export default function DonationsList({ donations, onRefresh, onEdit }: DonationsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (donationId: string) => {
    if (!confirm('Are you sure you want to delete this donation?')) {
      return
    }

    setDeletingId(donationId)
    try {
      await donationsAPI.delete(donationId)
      alert('Donation deleted successfully!')
      onRefresh()
    } catch (error: any) {
      console.error('Failed to delete donation:', error)
      alert(error.message || 'Failed to delete donation')
    } finally {
      setDeletingId(null)
    }
  }

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

  const getTimeRemaining = (expiryTime: string) => {
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
          key={donation._id}
          className="card border-l-4 border-l-primary animate-fade-in hover:shadow-lg transition-all duration-300"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">{donation.foodType}</h3>
              <p className="text-muted text-sm font-mono">ID: {donation._id.slice(-8)}</p>
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
                <span className="font-semibold">Claimed by:</span>{' '}
                {typeof donation.claimedBy === 'object' && donation.claimedBy.name
                  ? `${donation.claimedBy.name}${donation.claimedBy.organization ? ` (${donation.claimedBy.organization})` : ''}`
                  : typeof donation.claimedBy === 'string'
                  ? donation.claimedBy
                  : 'Unknown'}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-border">
            {onEdit && donation.status === 'available' && (
              <button 
                onClick={() => onEdit(donation)}
                className="flex-1 px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 rounded-lg border border-primary"
              >
                <Edit size={18} />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
            <button 
              onClick={() => handleDelete(donation._id)}
              disabled={deletingId === donation._id || donation.status === 'claimed'}
              className="flex-1 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title={donation.status === 'claimed' ? 'Cannot delete claimed donations' : 'Delete donation'}
            >
              {deletingId === donation._id ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={18} />
                  <span className="hidden sm:inline">Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
