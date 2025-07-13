"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react" // Removed Save, Check, Share2 icons
import { toast } from "sonner" // Import toast for notifications

interface HeaderProps {
  onToggleSidebar: () => void
  // Removed shareableLink, onSaveSession, isSessionSaved props
}

export function Header({ onToggleSidebar }: HeaderProps) {
  // Removed handleShare function

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-semibold text-lg">Cercily</span>
        </div>
      </div>

      {/* Removed Share and Save buttons from here */}
      <div className="flex items-center gap-2"></div>
    </header>
  )
}