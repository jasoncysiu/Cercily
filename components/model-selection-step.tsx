"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Sparkles, Lightbulb, Brain, CheckSquare, Square } from "lucide-react"
import { MentalModelLibrary, MENTAL_MODELS } from "@/components/mental-model-library" // Ensure MENTAL_MODELS is imported

interface ModelSelectionStepProps {
  problem: string
  aiSuggestions: any[]
  activeModels: string[]
  onModelToggle: (modelId: string) => void
  onProceed: () => void
  onBack: () => void
}

export function ModelSelectionStep({
  problem,
  aiSuggestions,
  activeModels,
  onModelToggle,
  onProceed,
  onBack,
}: ModelSelectionStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleProceed = async () => {
    setIsLoading(true)
    // Small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))
    onProceed()
    setIsLoading(false)
  }

  const handleSelectAll = () => {
    const allModelIds = MENTAL_MODELS.map((model) => model.id)
    // If all are selected, deselect all. Otherwise, select all.
    if (activeModels.length === allModelIds.length) {
      allModelIds.forEach((id) => {
        if (activeModels.includes(id)) {
          onModelToggle(id)
        }
      })
    } else {
      allModelIds.forEach((id) => {
        if (!activeModels.includes(id)) {
          onModelToggle(id)
        }
      })
    }
  }

  const allSelected = activeModels.length === MENTAL_MODELS.length

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 p-3 md:p-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <h2 className="text-lg font-semibold mb-2">Select Mental Models</h2>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">{problem}</p>
          </div>
        </div>
      </div>

      {/* Selected Models Summary - Moved to the top */}
      {activeModels.length > 0 && (
        <section className="p-3 md:p-4 flex-shrink-0">
          <Card className="p-3 md:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-green-800 mb-1">
                  {activeModels.length} Mental Model{activeModels.length !== 1 ? "s" : ""} Selected
                </h4>
                <p className="text-sm text-green-700">Ready to generate your personalized decision framework</p>
              </div>
              <Button
                onClick={handleProceed}
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto" // Changed color to primary
              >
                {isLoading ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate {/* Changed text from "Generate Framework" to "Generate" */}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 md:p-4 space-y-4 md:space-y-6">
          <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
            {/* All Mental Models */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Mental Model Library</h3>
                  <Badge variant="secondary" className="text-xs">
                    {activeModels.length} of {MENTAL_MODELS.length} selected
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="gap-2 bg-transparent w-full sm:w-auto"
                >
                  {allSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                  {allSelected ? "Deselect All" : "Select All"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <MentalModelLibrary
                  models={MENTAL_MODELS} // Pass the MENTAL_MODELS here
                  activeModels={activeModels}
                  onModelToggle={onModelToggle}
                  showRelevance={false}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}