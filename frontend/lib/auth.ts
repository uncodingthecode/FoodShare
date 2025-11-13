// Authentication utilities
export function getCurrentUser() {
  if (typeof window === "undefined") return null

  const userId = localStorage.getItem("userId")
  const userRole = localStorage.getItem("userRole")
  const userName = localStorage.getItem("userName")
  const authToken = localStorage.getItem("authToken")

  return userId && userRole && authToken ? { userId, userRole, userName, authToken } : null
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    localStorage.removeItem("authToken")
  }
}

export function isAuthenticated() {
  return getCurrentUser() !== null
}
