"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { loginUser } from "@/lib/store"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Please enter both email and password")
      setLoading(false)
      return
    }

    try {
      const user = loginUser(email, password)

      if (!user) {
        setError("Invalid email or password")
        setLoading(false)
        return
      }

      // Store user session
      localStorage.setItem("userId", user.id)
      localStorage.setItem("userRole", user.role)

      // Redirect based on role
      if (user.role === "donor") {
        router.push("/donor/dashboard")
      } else if (user.role === "ngo") {
        router.push("/ngo/dashboard")
      } else if (user.role === "volunteer") {
        router.push("/volunteer/dashboard")
      } else if (user.role === "admin") {
        router.push("/admin/dashboard")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-light via-white to-primary-light py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted mb-6">Sign in to your FoodShare account</p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-muted text-sm mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted mb-3 font-semibold">Demo Credentials:</p>
            <div className="space-y-2 text-xs">
              <div className="bg-surface p-2 rounded">
                <p className="font-mono text-foreground">Donor: donor@test.com / password</p>
              </div>
              <div className="bg-surface p-2 rounded">
                <p className="font-mono text-foreground">NGO: ngo@test.com / password</p>
              </div>
              <div className="bg-surface p-2 rounded">
                <p className="font-mono text-foreground">Volunteer: vol@test.com / password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
