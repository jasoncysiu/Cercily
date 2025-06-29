"use client"

import { useState } from "react"
import { DecisionCanvas } from "@/components/decision-canvas"
import { ModelSelectionStep } from "@/components/model-selection-step"
import { ProblemInput } from "@/components/problem-input"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { MENTAL_MODELS } from "@/components/mental-model-library"

export default function Cercily() {
  const [currentProblem, setCurrentProblem] = useState("")
  const [activeModels, setActiveModels] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<"input" | "selection" | "results">("input")

  const handleProblemSubmit = async (problem: string) => {
    setCurrentProblem(problem)
    // Select all models by default when moving to selection step
    const allModelIds = MENTAL_MODELS.map((model) => model.id)
    setActiveModels(allModelIds)
    setCurrentStep("selection")
  }

  const handleProceedToResults = () => {
    setCurrentStep("results")
  }

  const handleBackToInput = () => {
    setCurrentStep("input")
    setCurrentProblem("")
    setActiveModels([])
  }

  const handleBackToSelection = () => {
    setCurrentStep("selection")
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeModels={activeModels}
          onModelToggle={(modelId) => {
            setActiveModels((prev) =>
              prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId],
            )
          }}
        />

        <main className="flex-1 flex flex-col">
          {currentStep === "input" && (
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
              <div className="max-w-2xl w-full">
                <div className="text-center mb-6 md:mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cercily</h1>
                  <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
                    Your AI-powered decision cockpit. Describe any problem and get instant mental model frameworks.
                  </p>
                </div>

                <ProblemInput
                  onSubmit={handleProblemSubmit}
                  placeholder="Describe your decision or problem... (e.g., 'Should I quit my job to freelance?')"
                />

                <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-sm border">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <span className="text-xl md:text-2xl">🧠</span>
                    </div>
                    <h3 className="font-semibold mb-2 text-sm md:text-base">AI Mental Models</h3>
                    <p className="text-xs md:text-sm text-gray-600">Get relevant frameworks instantly</p>
                  </div>

                  <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-sm border">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <span className="text-xl md:text-2xl">🎯</span>
                    </div>
                    <h3 className="font-semibold mb-2 text-sm md:text-base">Visual Canvas</h3>
                    <p className="text-xs md:text-sm text-gray-600">Drag, adjust, and simulate decisions</p>
                  </div>

                  <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-sm border">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <span className="text-xl md:text-2xl">📊</span>
                    </div>
                    <h3 className="font-semibold mb-2 text-sm md:text-base">Case Studies</h3>
                    <p className="text-xs md:text-sm text-gray-600">Learn from real examples</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === "selection" && (
            <ModelSelectionStep
              problem={currentProblem}
              aiSuggestions={[]}
              activeModels={activeModels}
              onModelToggle={(modelId) => {
                setActiveModels((prev) =>
                  prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId],
                )
              }}
              onProceed={handleProceedToResults}
              onBack={handleBackToInput}
            />
          )}

          {currentStep === "results" && (
            <DecisionCanvas
              problem={currentProblem}
              activeModels={activeModels}
              selectedModels={activeModels}
              onReset={handleBackToInput}
              onBackToSelection={handleBackToSelection}
            />
          )}
        </main>
      </div>
    </div>
  )
}
