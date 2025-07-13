"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckCircle } from "lucide-react"
import { MentalModelCard } from "./mental-model-card" // Added this import

// Define the MentalModel interface here as it's used by this component
interface MentalModel {
  id: string
  name: string
  description: string
  category: string
  relevance?: number
  icon: string
  keyQuestions: string[]
  reasoning?: string
}

interface MentalModelLibraryProps {
  models: MentalModel[] // Now accepts a 'models' prop
  activeModels: string[]
  onModelToggle?: (modelId: string) => void // Made optional
  showRelevance?: boolean
  aiSuggestions?: any[]
}

export function MentalModelLibrary({
  models, // Use the passed models prop
  activeModels,
  onModelToggle, // This can now be undefined
  showRelevance = false,
  aiSuggestions = [],
}: MentalModelLibraryProps) {
  // Defensive check: Ensure models is an array before mapping
  if (!models || !Array.isArray(models)) {
    console.error("MentalModelLibrary received invalid models prop:", models);
    return null; // Or render a fallback UI, like a loading spinner or empty state
  }

  return (
    <div className="space-y-3">
      {models.map((model) => ( // Map over the passed models
        <MentalModelCard
          key={model.id}
          model={model}
          isActive={activeModels.includes(model.id)}
          onToggle={onModelToggle} // Pass it down if it exists
          showRelevance={showRelevance}
        />
      ))}
    </div>
  )
}

// Keep MENTAL_MODELS export here for other files that directly import it
const MENTAL_MODELS = [
  {
    id: "pareto-principle",
    name: "80/20 Rule (Pareto Principle)",
    description: "80% of effects come from 20% of causes. Focus on the vital few factors that drive most results.",
    category: "Efficiency",
    icon: "📊",
    keyQuestions: [
      "What 20% of factors will drive 80% of the outcome?",
      "Which inputs have the highest leverage?",
      "What can I eliminate to focus on what matters most?",
    ],
  },
  {
    id: "theory-of-constraints",
    name: "Theory of Constraints",
    description: "System performance is limited by its weakest link. Identify and address bottlenecks.",
    category: "Systems Thinking",
    icon: "🔗",
    keyQuestions: [
      "What's the biggest constraint limiting progress?",
      "Which bottleneck should I address first?",
      "How can I strengthen the weakest link?",
    ],
  },
  {
    id: "first-principles",
    name: "First Principles",
    description: "Break down complex problems to fundamental truths and rebuild from scratch.",
    category: "Problem Solving",
    icon: "🔬",
    keyQuestions: [
      "What are the fundamental truths here?",
      "What assumptions can I challenge?",
      "How would I approach this from scratch?",
    ],
  },
  {
    id: "occams-razor",
    name: "Occam's Razor",
    description: "The simplest solution is usually the best one. Prefer simplicity over complexity.",
    category: "Decision Making",
    icon: "✂️",
    keyQuestions: [
      "What's the simplest solution that could work?",
      "Am I overcomplicating this?",
      "Which option requires fewer assumptions?",
    ],
  },
  {
    id: "hock-principle",
    name: "Hock Principle",
    description: "Reveal counterintuitive insights by questioning conventional wisdom and assumptions.",
    category: "Critical Thinking",
    icon: "🔍",
    keyQuestions: [
      "What if the opposite were true?",
      "What assumptions might be wrong?",
      "How might this look completely different?",
    ],
  },
  {
    id: "interest-based-counting",
    name: "Interest-Based Counting",
    description: "Focus on underlying interests and motivations, not stated positions.",
    category: "Negotiation",
    icon: "🎯",
    keyQuestions: [
      "What are the real interests behind positions?",
      "What does each party actually want?",
      "How can interests be aligned?",
    ],
  },
  {
    id: "via-negativa",
    name: "Via Negativa",
    description: "Improve by subtraction and elimination, not just addition.",
    category: "Simplification",
    icon: "➖",
    keyQuestions: ["What can I remove or eliminate?", "What should I stop doing?", "How can I subtract complexity?"],
  },
  {
    id: "inversion",
    name: "Inversion",
    description: "Think backwards from failure to identify what to avoid and prevent problems.",
    category: "Risk Management",
    icon: "🔄",
    keyQuestions: [
      "How could this fail spectacularly?",
      "What would guarantee a bad outcome?",
      "What should I avoid at all costs?",
    ],
  },
  {
    id: "relativity",
    name: "Relativity",
    description: "Everything is relative to context, perspective, and frame of reference.",
    category: "Perspective",
    icon: "🌐",
    keyQuestions: [
      "Relative to what am I comparing this?",
      "How does context change the situation?",
      "What's the appropriate frame of reference?",
    ],
  },
  {
    id: "velocity-vs-speed",
    name: "Velocity vs Speed",
    description: "Direction matters more than just moving fast. Velocity includes both speed and direction.",
    category: "Strategy",
    icon: "🧭",
    keyQuestions: [
      "Am I moving fast in the right direction?",
      "What direction should I be heading?",
      "Is this speed without proper velocity?",
    ],
  },
  {
    id: "asymmetric-bets",
    name: "Asymmetric Bets",
    description: "Identifying decisions with limited downside and large potential upside.",
    category: "Risk Management",
    icon: "📈",
    keyQuestions: [
      "What's the worst that could happen vs. the best?",
      "Is this a low-risk, high-reward opportunity?",
      "How can I limit downside while maximizing upside?",
    ],
  },
  {
    id: "antifragility",
    name: "Antifragility",
    description: "Favoring choices that thrive under uncertainty and volatility.",
    category: "Resilience",
    icon: "💪",
    keyQuestions: [
      "How could this decision make me stronger from stress?",
      "What benefits from disorder and uncertainty?",
      "How can I gain from volatility rather than just survive it?",
    ],
  },
]

export { MENTAL_MODELS }