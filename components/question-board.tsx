"use client"

import { Card } from "@/components/ui/card"
import { MessageCircle, Heart, Brain } from "lucide-react"

interface QuestionBoardProps {
  problem: string
  soulProvokingQuestions?: {
    yesQuestions: string[]
    noQuestions: string[]
  }
}

export function QuestionBoard({ problem, soulProvokingQuestions }: QuestionBoardProps) {
  const defaultQuestions = {
    yesQuestions: [
      "What growth awaits you on the other side of this decision?",
      "How might saying yes align with your deepest values?",
      "What would your future self thank you for choosing?",
    ],
    noQuestions: [
      "What wisdom might come from patience and waiting?",
      "How could saying no create space for something better?",
      "What are you protecting by not moving forward?",
    ],
  }

  const questions = soulProvokingQuestions || defaultQuestions

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Yes/Proceed Questions */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-xl font-semibold text-green-700 mb-2">If You Say YES</h3>
          <p className="text-sm text-green-600">Soul-provoking questions to explore the path forward</p>
        </div>

        <div className="space-y-4">
          {questions.yesQuestions.map((question, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-green-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  {index === 0 && <Heart className="h-4 w-4 text-green-600" />}
                  {index === 1 && <Brain className="h-4 w-4 text-green-600" />}
                  {index === 2 && <MessageCircle className="h-4 w-4 text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 leading-relaxed">{question}</p>
                  <div className="mt-3 p-2 bg-green-50 rounded text-xs text-green-700">
                    <strong>Reflect:</strong> Take a moment to sit with this question. What comes up for you?
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-green-100 rounded-lg">
          <p className="text-xs text-green-700 text-center">
            <strong>💚 Growth Mindset:</strong> These questions explore the potential for expansion and positive change.
          </p>
        </div>
      </Card>

      {/* No/Wait Questions */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">⏳</span>
          </div>
          <h3 className="text-xl font-semibold text-orange-700 mb-2">If You Say NO/WAIT</h3>
          <p className="text-sm text-orange-600">Soul-provoking questions to explore the wisdom of patience</p>
        </div>

        <div className="space-y-4">
          {questions.noQuestions.map((question, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-orange-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  {index === 0 && <Heart className="h-4 w-4 text-orange-600" />}
                  {index === 1 && <Brain className="h-4 w-4 text-orange-600" />}
                  {index === 2 && <MessageCircle className="h-4 w-4 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 leading-relaxed">{question}</p>
                  <div className="mt-3 p-2 bg-orange-50 rounded text-xs text-orange-700">
                    <strong>Reflect:</strong> What wisdom might be hidden in this perspective?
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-orange-100 rounded-lg">
          <p className="text-xs text-orange-700 text-center">
            <strong>🧡 Wisdom Mindset:</strong> These questions explore the value of patience and discernment.
          </p>
        </div>
      </Card>
    </div>
  )
}
