"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export function withProtectedRoute(Component: React.ComponentType<any>, allowedRoles?: string[]) {
  return function ProtectedComponent(props: any) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const user = getCurrentUser()

      if (!user) {
        router.push("/login")
        return
      }

      if (allowedRoles && !allowedRoles.includes(user.userRole)) {
        router.push("/")
        return
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }, [router])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted">Loading...</p>
          </div>
        </div>
      )
    }

    return isAuthorized ? <Component {...props} /> : null
  }
}
