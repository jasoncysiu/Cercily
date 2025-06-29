"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  Scale,
  Palette,
  Sparkles,
  Lightbulb,
  Target,
  MessageSquare,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { MentalModelCard } from "@/components/mental-model-card"
import { DecisionSimulator } from "@/components/decision-simulator"
import { ProConBoard } from "@/components/pro-con-board"
import { VisualCanvas } from "@/components/visual-canvas"
import { QuestionBoard } from "@/components/question-board"
import { CaseStudiesDetail } from "@/components/case-studies-detail"
import { MENTAL_MODELS } from "@/components/mental-model-library"

interface DecisionCanvasProps {
  problem: string
  activeModels: string[]
  selectedModels?: string[]
  onReset: () => void
  onBackToSelection?: () => void
}

export function DecisionCanvas({
  problem,
  activeModels,
  selectedModels = [],
  onReset,
  onBackToSelection,
}: DecisionCanvasProps) {
  const [suggestedModels, setSuggestedModels] = useState<any[]>([])
  const [aiInsights, setAiInsights] = useState<string>("")
  const [keyFactors, setKeyFactors] = useState<string[]>([])
  const [recommendation, setRecommendation] = useState<string>("")
  const [caseStudies, setCaseStudies] = useState<any[]>([])
  const [canvasItems, setCanvasItems] = useState<any[]>([])
  const [soulProvokingQuestions, setSoulProvokingQuestions] = useState<any>(null)
  const [proConAnalysis, setProConAnalysis] = useState<any>(null)
  const [decisionSimulator, setDecisionSimulator] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Section visibility state
  const [sectionsExpanded, setSectionsExpanded] = useState({
    insights: true,
    canvas: false,
    questions: false,
    models: false,
    proCon: false,
    simulator: false,
    caseStudies: false,
  })

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  useEffect(() => {
    // Call AI for analysis with selected models
    const analyzeWithAI = async () => {
      setIsLoading(true)

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problem,
            selectedModels: selectedModels.length > 0 ? selectedModels : undefined,
          }),
        })

        if (response.ok) {
          const analysis = await response.json()
          console.log("AI Analysis:", analysis)

          // Safely set all state with fallbacks
          setAiInsights(analysis.insights || "Analysis completed with Cercily")
          setKeyFactors(analysis.keyFactors || [])
          setRecommendation(analysis.recommendation || "")
          setCaseStudies(analysis.caseStudies || [])
          setCanvasItems(analysis.canvasItems || [])
          setSoulProvokingQuestions(analysis.soulProvokingQuestions || null)
          setProConAnalysis(analysis.proConAnalysis || null)
          setDecisionSimulator(analysis.decisionSimulator || null)
        } else {
          throw new Error(`API request failed with status: ${response.status}`)
        }
      } catch (error) {
        console.error("Failed to analyze with AI:", error)

        // Set safe fallback state
        setAiInsights("Using default analysis - AI temporarily unavailable")
        setKeyFactors([])
        setRecommendation("")
        setCaseStudies([])
        setCanvasItems([])
        setSoulProvokingQuestions(null)
        setProConAnalysis(null)
        setDecisionSimulator(null)
      } finally {
        setIsLoading(false)
      }
    }

    analyzeWithAI()
  }, [problem, selectedModels])

  // Filter models to only show active ones
  const activeModelData = MENTAL_MODELS.filter((model) => activeModels.includes(model.id))

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Cercily is Analyzing Your Problem</h3>
          <p className="text-gray-600">Generating personalized insights using your selected mental models...</p>
          <div className="mt-4 text-sm text-gray-500">Problem: "{problem}"</div>
          {selectedModels.length > 0 && (
            <div className="mt-2 text-sm text-purple-600">
              Using {selectedModels.length} selected mental model{selectedModels.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    )
  }

  const SectionHeader = ({
    icon,
    title,
    subtitle,
    sectionKey,
    badge,
  }: {
    icon: React.ReactNode
    title: string
    subtitle?: string
    sectionKey: keyof typeof sectionsExpanded
    badge?: string
  }) => (
    <Button
      variant="ghost"
      className="w-full justify-between p-3 h-auto hover:bg-gray-50"
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
        {badge && (
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        )}
      </div>
      {sectionsExpanded[sectionKey] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </Button>
  )

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" onClick={onReset}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Problem
              </Button>
              {onBackToSelection && (
                <Button variant="outline" size="sm" onClick={onBackToSelection}>
                  Back to Models
                </Button>
              )}
              <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                <Sparkles className="h-3 w-3" />
                Powered by Cercily AI
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-2">Decision Framework</h2>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">{problem}</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* AI Insights - Always expanded by default */}
            <section>
              <SectionHeader
                icon={<Sparkles className="h-5 w-5 text-purple-600" />}
                title="Cercily AI Analysis"
                sectionKey="insights"
              />

              {sectionsExpanded.insights && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                      <div className="flex items-start gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5" />
                        <h4 className="font-medium text-sm">Key Insights</h4>
                      </div>
                      <p className="text-sm text-gray-700">{aiInsights}</p>
                    </Card>

                    {recommendation && (
                      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                        <div className="flex items-start gap-2 mb-2">
                          <Target className="h-4 w-4 text-green-600 mt-0.5" />
                          <h4 className="font-medium text-sm">AI Recommendation</h4>
                        </div>
                        <p className="text-sm text-gray-700">{recommendation}</p>
                      </Card>
                    )}
                  </div>

                  {keyFactors.length > 0 && (
                    <Card className="p-4">
                      <h4 className="font-medium text-sm mb-3">Critical Factors for Your Decision:</h4>
                      <div className="flex flex-wrap gap-2">
                        {keyFactors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </section>

            {/* Visual Canvas */}
            <section>
              <SectionHeader
                icon={<Palette className="h-5 w-5 text-indigo-600" />}
                title="Visual Decision Canvas"
                subtitle="AI-generated decision map"
                sectionKey="canvas"
              />

              {sectionsExpanded.canvas && (
                <div className="mt-4">
                  <VisualCanvas problem={problem} activeModels={activeModelData} canvasItems={canvasItems} />
                </div>
              )}
            </section>

            {/* Question Board */}
            <section>
              <SectionHeader
                icon={<MessageSquare className="h-5 w-5 text-pink-600" />}
                title="Soul-Provoking Questions"
                subtitle="Deep reflection for both paths"
                sectionKey="questions"
              />

              {sectionsExpanded.questions && (
                <div className="mt-4">
                  <QuestionBoard problem={problem} soulProvokingQuestions={soulProvokingQuestions} />
                </div>
              )}
            </section>

            {/* Active Mental Models */}
            {activeModelData.length > 0 && (
              <section>
                <SectionHeader
                  icon={
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  }
                  title="Your Selected Mental Models"
                  sectionKey="models"
                  badge={`${activeModelData.length} active`}
                />

                {sectionsExpanded.models && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {activeModelData.map((model) => (
                        <MentalModelCard key={model.id} model={model} isActive={true} />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Pro/Con Board */}
            <section>
              <SectionHeader
                icon={<Scale className="h-5 w-5 text-purple-600" />}
                title="Pro/Con Analysis"
                sectionKey="proCon"
              />

              {sectionsExpanded.proCon && (
                <div className="mt-4">
                  <ProConBoard problem={problem} proConAnalysis={proConAnalysis} />
                </div>
              )}
            </section>

            {/* Decision Simulator */}
            <section>
              <SectionHeader
                icon={<TrendingUp className="h-5 w-5 text-green-600" />}
                title="Decision Simulator"
                sectionKey="simulator"
              />

              {sectionsExpanded.simulator && (
                <div className="mt-4">
                  <DecisionSimulator problem={problem} decisionSimulator={decisionSimulator} />
                </div>
              )}
            </section>

            {/* Case Studies */}
            <section>
              <SectionHeader
                icon={<AlertTriangle className="h-5 w-5 text-orange-600" />}
                title="Relevant Case Studies"
                subtitle="AI-curated examples with Naval's wisdom"
                sectionKey="caseStudies"
              />

              {sectionsExpanded.caseStudies && (
                <div className="mt-4">
                  <CaseStudiesDetail caseStudies={caseStudies} problem={problem} />
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
