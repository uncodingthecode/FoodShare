// In-memory data store for the food sharing app
export interface Location {
  latitude: number
  longitude: number
  address: string
}

export interface FoodDonation {
  id: string
  donorId: string
  donorName: string
  foodType: string
  quantity: number
  unit: string
  expiryTime: Date
  location: Location
  description: string
  status: "available" | "claimed" | "expired"
  createdAt: Date
  claimedBy?: string
  claimedAt?: Date
}

export interface Claim {
  id: string
  donationId: string
  ngoId: string
  ngoName: string
  claimedAt: Date
  status: "pending" | "completed" | "cancelled"
}

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: "donor" | "ngo" | "volunteer" | "admin"
  phone: string
  organization?: string
  createdAt: Date
}

// In-memory storage
const users: User[] = []
const donations: FoodDonation[] = []
const claims: Claim[] = []
let nextUserId = 1
let nextDonationId = 1
let nextClaimId = 1

// User Management
export function registerUser(userData: Omit<User, "id" | "createdAt">): User {
  const user: User = {
    ...userData,
    id: `user_${nextUserId++}`,
    createdAt: new Date(),
  }
  users.push(user)
  return user
}

export function loginUser(email: string, password: string): User | null {
  return users.find((u) => u.email === email && u.password === password) || null
}

export function getUserById(id: string): User | null {
  return users.find((u) => u.id === id) || null
}

export function getAllUsers(): User[] {
  return users
}

// Donation Management
export function addDonation(donationData: Omit<FoodDonation, "id" | "createdAt" | "status">): FoodDonation {
  const donation: FoodDonation = {
    ...donationData,
    id: `donation_${nextDonationId++}`,
    status: "available",
    createdAt: new Date(),
  }
  donations.push(donation)
  return donation
}

export function getDonationById(id: string): FoodDonation | null {
  return donations.find((d) => d.id === id) || null
}

export function getAvailableDonations(): FoodDonation[] {
  return donations.filter((d) => d.status === "available" && d.expiryTime > new Date())
}

export function getDonationsByDonor(donorId: string): FoodDonation[] {
  return donations.filter((d) => d.donorId === donorId)
}

export function updateDonationStatus(donationId: string, status: FoodDonation["status"]): FoodDonation | null {
  const donation = donations.find((d) => d.id === donationId)
  if (donation) {
    donation.status = status
  }
  return donation || null
}

export function claimDonation(donationId: string, ngoId: string, ngoName: string): Claim | null {
  const donation = donations.find((d) => d.id === donationId)
  if (!donation || donation.status !== "available") return null

  const claim: Claim = {
    id: `claim_${nextClaimId++}`,
    donationId,
    ngoId,
    ngoName,
    claimedAt: new Date(),
    status: "pending",
  }
  claims.push(claim)
  donation.status = "claimed"
  donation.claimedBy = ngoId
  donation.claimedAt = new Date()
  return claim
}

export function getClaimsByNGO(ngoId: string): Claim[] {
  return claims.filter((c) => c.ngoId === ngoId)
}

export function getAllClaims(): Claim[] {
  return claims
}

export function updateClaimStatus(claimId: string, status: Claim["status"]): Claim | null {
  const claim = claims.find((c) => c.id === claimId)
  if (claim) {
    claim.status = status
  }
  return claim || null
}

// Statistics
export function getStatistics() {
  return {
    totalDonations: donations.length,
    availableDonations: getAvailableDonations().length,
    claimedDonations: donations.filter((d) => d.status === "claimed").length,
    totalUsers: users.length,
    totalClaims: claims.length,
  }
}
