"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckCircle } from "lucide-react"

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

interface MentalModelCardProps {
  model: MentalModel
  isActive?: boolean
  onToggle?: () => void
  showRelevance?: boolean
}

export function MentalModelCard({ model, isActive = false, onToggle, showRelevance = false }: MentalModelCardProps) {
  return (
    <Card
      className={`p-6 transition-all duration-200 ${isActive ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{model.icon}</div>
          <div>
            <h4 className="font-semibold text-sm">{model.name}</h4>
            <Badge variant="secondary" className="text-xs mt-1">
              {model.category}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showRelevance && model.relevance && <div className="text-xs text-gray-500">{model.relevance}% match</div>}
          {onToggle && (
            <Button variant={isActive ? "default" : "outline"} size="sm" onClick={onToggle}>
              {isActive ? <CheckCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{model.description}</p>

      {showRelevance && model.reasoning && (
        <div className="mb-4 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <strong>Why relevant:</strong> {model.reasoning}
        </div>
      )}

      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700">Key Questions:</div>
        {model.keyQuestions.slice(0, 2).map((question, index) => (
          <div key={index} className="text-xs text-gray-600 pl-2 border-l-2 border-gray-200">
            {question}
          </div>
        ))}
        {model.keyQuestions.length > 2 && (
          <div className="text-xs text-blue-600 font-medium">+{model.keyQuestions.length - 2} more questions</div>
        )}
      </div>
    </Card>
  )
}
