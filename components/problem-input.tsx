"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

interface ProblemInputProps {
  onSubmit: (problem: string) => void
  placeholder?: string
}

export function ProblemInput({ onSubmit, placeholder }: ProblemInputProps) {
  const [problem, setProblem] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!problem.trim()) return

    setIsLoading(true)
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onSubmit(problem)
    setIsLoading(false)
  }

  const exampleProblems = [
    "Should I quit my job to freelance?",
    "Which startup idea should I pursue?",
    "Should we pivot our product strategy?",
    "How do I choose between two job offers?",
  ]

  return (
    <div className="space-y-6">
      <div className="relative">
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder={placeholder || "Describe your decision or problem..."}
          className="w-full min-h-[120px] text-lg resize-none p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />

        <Button
          onClick={handleSubmit}
          disabled={!problem.trim() || isLoading}
          className="absolute bottom-4 right-4"
          size="sm"
        >
          {isLoading ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Generate Framework
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleProblems.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setProblem(example)}
              className="text-xs"
              disabled={isLoading}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
