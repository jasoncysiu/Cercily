"use client"

import { Sparkles } from "lucide-react"

interface LoadingPageProps {
  problem: string;
  selectedModelsCount: number;
}

export function LoadingPage({ problem, selectedModelsCount }: LoadingPageProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-8 w-8 text-white animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Cercily is Analyzing Your Problem</h3>
        <p className="text-gray-600">Generating personalized insights using your selected mental models...</p>
        <div className="mt-4 text-sm text-gray-500">Problem: "{problem}"</div>
        {selectedModelsCount > 0 && (
          <div className="mt-2 text-sm text-purple-600">
            Using {selectedModelsCount} selected mental model{selectedModelsCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  )
}