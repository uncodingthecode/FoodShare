"use client"

import { useState, useEffect } from "react"
import { donationsAPI } from "@/lib/api"
import { X } from "lucide-react"

interface Donation {
  _id: string
  foodType: string
  quantity: number
  unit: string
  expiryTime: string
  location: {
    address: string
    coordinates?: [number, number]
  }
  description?: string
}

interface EditDonationFormProps {
  donation: Donation
  onDonationUpdated: () => void
  onCancel: () => void
}

export default function EditDonationForm({ donation, onDonationUpdated, onCancel }: EditDonationFormProps) {
  // Calculate hours until expiry
  const calculateExpiryHours = () => {
    const now = new Date()
    const expiry = new Date(donation.expiryTime)
    const diffMs = expiry.getTime() - now.getTime()
    const diffHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)))
    return diffHours.toString()
  }

  const [formData, setFormData] = useState({
    foodType: donation.foodType,
    quantity: donation.quantity.toString(),
    unit: donation.unit,
    expiryHours: calculateExpiryHours(),
    address: donation.location.address,
    description: donation.description || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const updateData = {
        foodType: formData.foodType,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        expiryHours: Number(formData.expiryHours),
        location: {
          address: formData.address,
          latitude: donation.location.coordinates?.[1],
          longitude: donation.location.coordinates?.[0]
        },
        description: formData.description,
      }

      await donationsAPI.update(donation._id, updateData)
      alert('Donation updated successfully!')
      onDonationUpdated()
    } catch (err: any) {
      console.error("Error updating donation:", err)
      setError(err.message || "Failed to update donation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card mb-8 border-2 border-primary">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-foreground">Edit Donation</h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-surface rounded-lg transition-colors"
          type="button"
        >
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Food Type *</label>
          <input
            type="text"
            required
            value={formData.foodType}
            onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
            className="input-field"
            placeholder="e.g., Cooked Rice, Bread, Fruits"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Quantity *</label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="input-field"
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Unit *</label>
            <select
              required
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="input-field"
            >
              <option value="">Select unit</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="grams">Grams</option>
              <option value="liters">Liters</option>
              <option value="pieces">Pieces</option>
              <option value="plates">Plates</option>
              <option value="boxes">Boxes</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Hours Until Expiry *</label>
          <input
            type="number"
            min="1"
            step="0.5"
            required
            value={formData.expiryHours}
            onChange={(e) => setFormData({ ...formData, expiryHours: e.target.value })}
            className="input-field"
            placeholder="e.g., 2"
          />
          <p className="text-xs text-muted mt-1">How many hours from now until the food expires</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Pickup Address *</label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="input-field"
            placeholder="e.g., 123 Main St, Mumbai"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field min-h-[100px]"
            placeholder="Any additional details about the food donation"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Donation"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-border text-muted hover:bg-surface rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
