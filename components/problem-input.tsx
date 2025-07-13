"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useUserMode } from "@/providers/UserModeProvider" // Import useUserMode

interface ProblemInputProps {
  onSubmit: (problem: string, context: string, selectedAiModel: string) => void // No longer async here
  placeholder?: string
  initialProblem?: string;
  initialContext?: string;
  initialAiModel?: string;
}

export function ProblemInput({ onSubmit, placeholder, initialProblem = "", initialContext = "", initialAiModel = "gemini-pro" }: ProblemInputProps) {
  const { userMode } = useUserMode(); // Get userMode from context
  const [problem, setProblem] = useState(initialProblem)
  const [context, setContext] = useState(initialContext)
  const [selectedAiModel, setSelectedAiModel] = useState(initialAiModel)
  const [isLoading, setIsLoading] = useState(false) // Keep local loading for button state

  const handleSubmit = () => { // No longer async
    if (!problem.trim()) return

    setIsLoading(true) // Set loading true
    onSubmit(problem, context, selectedAiModel) // Call onSubmit, which will trigger AI call in parent
    // isLoading will be reset by parent when it transitions to next step
  }

  const exampleProblems = [
    "Should I quit my job to freelance?",
    "Which startup idea should I pursue?",
    "Should we pivot our product strategy?",
    "How do I choose between two job offers?",
  ]

  const handleExampleClick = (example: string) => {
    setProblem(example);
    if (example === "Should I quit my job to freelance?") {
      setContext("I've been feeling burnt out at my corporate job for a while. I have some savings, but I'm worried about inconsistent income and losing benefits. I also have a few potential clients lined up.");
    } else if (example === "Which startup idea should I pursue?") {
      setContext("I have two ideas: one is a SaaS tool for small businesses, the other is an e-commerce platform for sustainable products. I have a technical background but limited marketing experience.");
    } else if (example === "Should we pivot our product strategy?") {
      setContext("Our current product isn't gaining traction as expected, but we have a small, loyal user base. We're considering a pivot to target a different niche, but it would require significant re-development.");
    } else if (example === "How do I choose between two job offers?") {
      setContext("Offer A is from a large, stable company with good benefits but a lower salary. Offer B is from a fast-growing startup with a higher salary and equity, but less job security and longer hours.");
    } else {
      setContext("");
    }
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Problem:</h4>
          <Textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder={"Write your problem in one sentence. What makes it difficult? (e.g., Should I buy a car?)"}
            className="w-full min-h-[100px] text-base resize-none p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Context (Optional):</h4>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add key background, constraints, or context..."
            className="w-full min-h-[160px] resize-none p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        {userMode === "OverThinker" && ( // Conditionally render for OverThinker
          <div>
            <Label htmlFor="ai-model-select" className="text-sm font-medium mb-2 block">
              Select AI Model:
            </Label>
            <Select value={selectedAiModel} onValueChange={setSelectedAiModel} disabled={isLoading}>
              <SelectTrigger id="ai-model-select" className="w-full">
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-pro">Gemini 1.5 Flash</SelectItem>
                <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                <SelectItem value="deepseek-v3-0324">Deepseek v3-0324 (Beta)</SelectItem>
                <SelectItem value="claude-opus" disabled>Claude Opus (Disabled)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSubmit}
            disabled={!problem.trim() || isLoading}
            size="default"
            variant="default"
            className={problem.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
          >
            {isLoading ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Generate
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
                onClick={() => handleExampleClick(example)}
                className="text-xs"
                disabled={isLoading}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}