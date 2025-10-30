// Authentication utilities
export function getCurrentUser() {
  if (typeof window === "undefined") return null

  const userId = localStorage.getItem("userId")
  const userRole = localStorage.getItem("userRole")

  return userId && userRole ? { userId, userRole } : null
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")
  }
}

export function isAuthenticated() {
  return getCurrentUser() !== null
}
