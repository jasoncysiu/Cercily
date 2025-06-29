import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cercily - Mental OS and Decision canva",
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
      <body className={inter.className}>
        {children}
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
