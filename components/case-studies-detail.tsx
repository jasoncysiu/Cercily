"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Maximize, X, BookOpen } from "lucide-react"

interface CaseStudy {
  title: string
  description: string
  outcome: string
  appliedModels: string
}

interface CaseStudiesDetailProps {
  caseStudies: CaseStudy[]
  problem: string
}

export function CaseStudiesDetail({ caseStudies, problem }: CaseStudiesDetailProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null)

  const getNavalWisdom = (study: CaseStudy, problem: string) => {
    // Generate Naval-style wisdom based on the case study
    const isCarRelated = problem.toLowerCase().includes("car")
    const isInvestmentRelated = problem.toLowerCase().includes("invest") || problem.toLowerCase().includes("stock")

    if (isCarRelated) {
      return {
        paragraph1:
          "The modern world tricks you into thinking ownership equals freedom. But every possession owns you back. This person learned what I've always said: the things you own end up owning you. A car isn't just $30K—it's $30K plus opportunity cost, plus maintenance, plus the mental overhead of ownership.",
        paragraph2:
          "Wealth is not about having things. Wealth is having options. When you tie up capital in depreciating assets, you're trading future optionality for present convenience. The wealthy understand this intuitively—they rent what depreciates and own what appreciates. Your car loses 20% of its value the moment you drive it off the lot, but that same money in index funds compounds at 7% annually.",
        paragraph3:
          "The real lesson here isn't about cars—it's about thinking in systems, not events. Every financial decision is really a decision about time and freedom. Ask yourself: does this purchase increase my long-term optionality, or does it constrain it? The answer will guide you toward wealth, not just the appearance of it.",
      }
    }

    if (isInvestmentRelated) {
      return {
        paragraph1:
          "Investing is not about being right—it's about being less wrong than the market. This case study reveals a fundamental truth: concentration builds wealth, but diversification preserves it. The person who bet everything on one stock was playing a different game than they thought. They were gambling, not investing.",
        paragraph2:
          "Time is the most powerful force in investing, not intelligence. A 25-year-old with a diversified portfolio will outperform a genius stock picker over 30 years, simply because time and compounding do the heavy lifting. The market rewards patience, not cleverness. Most people can't handle the boredom of getting rich slowly, so they try to get rich quickly and end up poor.",
        paragraph3:
          "The meta-lesson is this: in a complex system like the market, simple strategies often outperform complex ones. Buy index funds, automate your investments, and focus your energy on increasing your earning power. Your career is your best investment—everything else is just asset allocation.",
      }
    }

    // Generic wisdom
    return {
      paragraph1:
        "Every decision is really a bet on the future. This case study shows someone who made a bet without fully understanding the odds. The key insight isn't what they did wrong—it's recognizing that all of us are constantly making similar bets with incomplete information.",
      paragraph2:
        "Optionality is more valuable than optimization. When you over-optimize for one outcome, you become fragile to change. The person in this story optimized for one scenario and couldn't adapt when reality shifted. Smart people hedge their bets and maintain multiple paths to success.",
      paragraph3:
        "The real skill isn't predicting the future—it's building systems that work across multiple futures. Focus on decisions that have asymmetric upside: limited downside with unlimited upside. This is how you build antifragility into your life and wealth.",
    }
  }

  const openFullScreen = (study: CaseStudy) => {
    setSelectedCase(study)
    setIsFullScreen(true)
  }

  const closeFullScreen = () => {
    setIsFullScreen(false)
    setSelectedCase(null)
  }

  if (isFullScreen && selectedCase) {
    const wisdom = getNavalWisdom(selectedCase, problem)

    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          {/* Header */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Case Study Analysis</h1>
                  <p className="text-sm text-gray-500">Wisdom from Naval Ravikant</p>
                </div>
              </div>
              <Button variant="outline" onClick={closeFullScreen} className="gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Close
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto p-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Case Study Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-7 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedCase.title}</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">{selectedCase.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    Applied: {selectedCase.appliedModels}
                  </span>
                  <span className="text-gray-500">Outcome: {selectedCase.outcome}</span>
                </div>
              </div>

              {/* Naval's Analysis */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                    Naval's Perspective
                  </h3>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                      <div className="pl-6">
                        <p className="text-gray-800 leading-relaxed text-lg font-light">{wisdom.paragraph1}</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                      <div className="pl-6">
                        <p className="text-gray-800 leading-relaxed text-lg font-light">{wisdom.paragraph2}</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                      <div className="pl-6">
                        <p className="text-gray-800 leading-relaxed text-lg font-light">{wisdom.paragraph3}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Takeaways */}
                <div className="mt-10 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Takeaways</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Think in systems, not events</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Preserve optionality over optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Build antifragility into your decisions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {caseStudies.length > 0 ? (
        caseStudies.map((study, index) => (
          <Card key={index} className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start gap-2">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">{index === 0 ? "📚" : "💡"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold mb-1 text-sm">{study.title}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openFullScreen(study)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mb-1">{study.description}</p>
                <p className="text-xs text-gray-700 mb-1">
                  <strong>Outcome:</strong> {study.outcome}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-blue-600 font-medium">Applied: {study.appliedModels}</div>
                  <Button variant="outline" size="sm" onClick={() => openFullScreen(study)} className="text-xs h-6">
                    Read Analysis
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <>
          <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start gap-2">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🚗</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold mb-1 text-sm">The $30K Car That Cost $60K</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      openFullScreen({
                        title: "The $30K Car That Cost $60K",
                        description: "Young professional bought a $30K car without considering total ownership costs",
                        outcome: "Ended up spending $60K over 5 years due to insurance, maintenance, and depreciation",
                        appliedModels: "80/20 Rule + First Principles",
                      })
                    }
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  Young professional bought a $30K car without considering total ownership costs
                </p>
                <p className="text-xs text-gray-700 mb-1">
                  <strong>Outcome:</strong> Ended up spending $60K over 5 years due to insurance, maintenance, and
                  depreciation
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-blue-600 font-medium">Applied: 80/20 Rule + First Principles</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openFullScreen({
                        title: "The $30K Car That Cost $60K",
                        description: "Young professional bought a $30K car without considering total ownership costs",
                        outcome: "Ended up spending $60K over 5 years due to insurance, maintenance, and depreciation",
                        appliedModels: "80/20 Rule + First Principles",
                      })
                    }
                    className="text-xs h-6"
                  >
                    Read Analysis
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start gap-2">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🚇</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold mb-1 text-sm">The $40K Investment Instead</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      openFullScreen({
                        title: "The $40K Investment Instead",
                        description: "NYC resident chose subway + occasional Uber over car ownership",
                        outcome: "Invested car money in index funds, built $200K portfolio over 10 years",
                        appliedModels: "Via Negativa + Inversion",
                      })
                    }
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  NYC resident chose subway + occasional Uber over car ownership
                </p>
                <p className="text-xs text-gray-700 mb-1">
                  <strong>Outcome:</strong> Invested car money in index funds, built $200K portfolio over 10 years
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-green-600 font-medium">Applied: Via Negativa + Inversion</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openFullScreen({
                        title: "The $40K Investment Instead",
                        description: "NYC resident chose subway + occasional Uber over car ownership",
                        outcome: "Invested car money in index funds, built $200K portfolio over 10 years",
                        appliedModels: "Via Negativa + Inversion",
                      })
                    }
                    className="text-xs h-6"
                  >
                    Read Analysis
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}