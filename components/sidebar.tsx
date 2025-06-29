"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Brain, BookOpen, Target, ChevronDown, ChevronRight, Info } from "lucide-react"
import { MentalModelLibrary } from "@/components/mental-model-library"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeModels: string[]
  onModelToggle: (modelId: string) => void
}

export function Sidebar({ isOpen, onClose, activeModels, onModelToggle }: SidebarProps) {
  const [mentalModelsExpanded, setMentalModelsExpanded] = useState(false)
  const [caseStudiesExpanded, setCaseStudiesExpanded] = useState(false)
  const [quickActionsExpanded, setQuickActionsExpanded] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden flex-shrink-0">
          <h2 className="font-semibold">Mental Model Library</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Mental Models Section */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
                onClick={() => setMentalModelsExpanded(!mentalModelsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="font-semibold">Mental Model Library</span>
                  {activeModels.length > 0 && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {activeModels.length} selected
                    </span>
                  )}
                </div>
                {mentalModelsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>

              {mentalModelsExpanded && (
                <div className="mt-2">
                  <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    Browse all available mental models. After generating your framework, you'll see AI-matched models
                    with relevance scores.
                  </div>
                  <MentalModelLibrary activeModels={activeModels} onModelToggle={onModelToggle} showRelevance={false} />
                </div>
              )}
            </div>

            {/* Case Studies Section */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
                onClick={() => setCaseStudiesExpanded(!caseStudiesExpanded)}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-semibold">Case Studies</span>
                </div>
                {caseStudiesExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>

              {caseStudiesExpanded && (
                <div className="mt-2 space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="font-medium">Naval's Career Pivot</div>
                    <div className="text-gray-600">From employee to entrepreneur</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="font-medium">Bezos' Regret Framework</div>
                    <div className="text-gray-600">Leaving Wall Street for Amazon</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="font-medium">Jobs' Simplicity Principle</div>
                    <div className="text-gray-600">Focus on essential features only</div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Section */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
                onClick={() => setQuickActionsExpanded(!quickActionsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="font-semibold">Quick Actions</span>
                </div>
                {quickActionsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>

              {quickActionsExpanded && (
                <div className="mt-2 space-y-3">
                  {/* Instructions */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Info className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-blue-900 mb-2">How Cercily Works</h4>
                        <p className="text-xs text-blue-800 mb-3 leading-relaxed">
                          <strong>Value:</strong> Transform any decision into a structured framework with AI-powered
                          mental models and Naval's wisdom.
                        </p>

                        <div className="space-y-2 text-xs text-blue-700">
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-[10px] flex-shrink-0 mt-0.5">
                              1
                            </span>
                            <span>Describe your problem in the main input</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-[10px] flex-shrink-0 mt-0.5">
                              2
                            </span>
                            <span>AI analyzes and suggests relevant mental models with % match</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-[10px] flex-shrink-0 mt-0.5">
                              3
                            </span>
                            <span>Select models to customize your decision framework</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-[10px] flex-shrink-0 mt-0.5">
                              4
                            </span>
                            <span>Explore visual canvas, pro/con analysis, and Naval's case studies</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clear All Models */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => {
                      // Clear all selected models
                      activeModels.forEach((modelId) => onModelToggle(modelId))
                    }}
                  >
                    Clear All Models
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
