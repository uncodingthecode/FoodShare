"use client"

import Link from "next/link"
import { LogOut } from "lucide-react"

interface AdminHeaderProps {
  user: any
  onLogout: () => void
}

export default function AdminHeader({ user, onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:inline">FoodShare</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">Admin</span>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-muted hover:text-foreground transition-colors"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
