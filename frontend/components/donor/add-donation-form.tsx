"use client"

import type React from "react"

import { useState } from "react"
import { donationsAPI } from "@/lib/api"
import { AlertCircle, CheckCircle, X } from "lucide-react"

interface AddDonationFormProps {
  onDonationAdded: () => void
  onCancel: () => void
}

export default function AddDonationForm({ onDonationAdded, onCancel }: AddDonationFormProps) {
  const [formData, setFormData] = useState({
    foodType: "",
    quantity: "",
    unit: "kg",
    expiryHours: "2",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!formData.foodType || !formData.quantity || !formData.address) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      setError("Quantity must be a positive number")
      setLoading(false)
      return
    }

    if (isNaN(Number(formData.expiryHours)) || Number(formData.expiryHours) <= 0) {
      setError("Expiry time must be a positive number")
      setLoading(false)
      return
    }

    try {
      const donationData = {
        foodType: formData.foodType,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        expiryHours: Number(formData.expiryHours),
        location: {
          address: formData.address,
          latitude: formData.latitude ? Number(formData.latitude) : undefined,
          longitude: formData.longitude ? Number(formData.longitude) : undefined
        },
        description: formData.description || undefined
      }

      await donationsAPI.create(donationData)

      setSuccess(true)
      setTimeout(() => {
        onDonationAdded()
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to add donation. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="card mb-8 border-2 border-primary-light">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Add New Donation</h2>
        <button onClick={onCancel} className="p-2 hover:bg-surface rounded-lg transition-colors">
          <X size={24} className="text-muted" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-700 text-sm">Donation added successfully! Redirecting...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Food Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Food Type *</label>
            <input
              type="text"
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              placeholder="e.g., Rice, Vegetables, Cooked Meals"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Quantity *</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="10"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="kg">kg</option>
                <option value="grams">grams</option>
                <option value="liters">liters</option>
                <option value="pieces">pieces</option>
                <option value="plates">plates</option>
                <option value="boxes">boxes</option>
              </select>
            </div>
          </div>

          {/* Expiry Time */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Expires in (hours) *</label>
            <input
              type="number"
              name="expiryHours"
              value={formData.expiryHours}
              onChange={handleChange}
              placeholder="2"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Pickup Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, City"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Latitude */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Latitude (optional)</label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="40.7128"
              step="0.0001"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Longitude (optional)</label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="-74.0060"
              step="0.0001"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description (optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Any additional details about the food..."
            rows={3}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || success}
            className="flex-1 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Donation"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary-light transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
