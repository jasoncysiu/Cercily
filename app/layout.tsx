import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google" // Re-imported Poppins
import "./globals.css"
import { QueryProvider } from "../src/providers/QueryProvider"
import { Toaster } from "@/components/ui/sonner"
import { UserModeProvider } from "@/providers/UserModeProvider" // Import UserModeProvider

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] }) // Re-configured Poppins

export const metadata: Metadata = {
  title: "Cercily - Decision Canva",
  description: "Your AI decision canva",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50"> {/* Moved bg-gray-50 here */}
        <QueryProvider>
          <UserModeProvider> {/* Wrap with UserModeProvider */}
            <div className="flex flex-col min-h-screen"> {/* Changed h-screen to min-h-screen */}
              {children}
            </div>
          </UserModeProvider>
        </QueryProvider>
        <Toaster />
        {/* Subtle credit */}
        <div className="fixed bottom-2 right-2 text-xs text-gray-400 opacity-50 hover:opacity-100 transition-opacity">
          <a href="https://jason-siu.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">
            Built by Jason Siu
          </a>
        </div>
      </body>
    </html>
  )
}