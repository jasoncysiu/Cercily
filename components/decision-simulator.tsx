"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface DecisionSimulatorProps {
  problem: string
  decisionSimulator?: {
    option1Title: string
    option2Title: string
    parameters: Array<{
      name: string
      description: string
      impact: string
    }>
    recommendation: string
  }
}

export function DecisionSimulator({ problem, decisionSimulator }: DecisionSimulatorProps) {
  // Ensure problem is defined
  const safeProblem = problem || ""

  const [param1Value, setParam1Value] = useState([50])
  const [param2Value, setParam2Value] = useState([50])
  const [param3Value, setParam3Value] = useState([50])

  // Default simulator config if no AI analysis provided
  const getDefaultSimulator = () => {
    if (safeProblem.toLowerCase().includes("car")) {
      return {
        option1Title: "Buy Car Now",
        option2Title: "Wait/Use Alternatives",
        parameters: [
          {
            name: "Monthly Transportation Budget",
            description: "How much you can afford for transportation monthly",
            impact: "Higher budget makes car ownership more feasible",
          },
          {
            name: "Transportation Frequency",
            description: "How often you need transportation per week",
            impact: "Higher frequency increases value of car ownership",
          },
          {
            name: "Alternative Availability",
            description: "Quality of public transit and rideshare in your area",
            impact: "Better alternatives reduce need for car ownership",
          },
        ],
        recommendation:
          "If you need transportation more than 10 times per week and have $600+ monthly budget, buying makes sense.",
      }
    }

    return {
      option1Title: "Proceed",
      option2Title: "Wait",
      parameters: [
        {
          name: "Risk Tolerance",
          description: "Your comfort level with uncertainty",
          impact: "Higher tolerance favors proceeding",
        },
        {
          name: "Time Sensitivity",
          description: "How urgent this decision is",
          impact: "Higher urgency favors quick action",
        },
        {
          name: "Resource Availability",
          description: "Your available time, money, and energy",
          impact: "More resources make proceeding easier",
        },
      ],
      recommendation: "Consider your specific circumstances and constraints when making this decision.",
    }
  }

  const simulator = decisionSimulator || getDefaultSimulator()

  // Add safety checks for the simulator structure
  const safeSimulator = {
    option1Title: simulator.option1Title || "Option 1",
    option2Title: simulator.option2Title || "Option 2",
    parameters: simulator.parameters || [],
    recommendation: simulator.recommendation || "Consider your specific circumstances.",
  }

  // Mock simulation results based on inputs
  const getSimulationResults = () => {
    const avg = (param1Value[0] + param2Value[0] + param3Value[0]) / 3

    // For car buying, higher values generally favor buying
    const option1Score = Math.max(0, Math.min(100, Math.round(30 + avg * 0.7)))
    const option2Score = Math.max(0, Math.min(100, Math.round(70 - avg * 0.7)))

    return {
      option1: option1Score,
      option2: option2Score,
    }
  }

  const results = getSimulationResults()

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <h4 className="font-semibold">Adjust Your Parameters</h4>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {safeSimulator.parameters[0]?.name}: {param1Value[0]}%
              </label>
              <Slider value={param1Value} onValueChange={setParam1Value} max={100} step={1} className="w-full" />
              <p className="text-xs text-gray-500 mt-1">{safeSimulator.parameters[0]?.description}</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {safeSimulator.parameters[1]?.name}: {param2Value[0]}%
              </label>
              <Slider value={param2Value} onValueChange={setParam2Value} max={100} step={1} className="w-full" />
              <p className="text-xs text-gray-500 mt-1">{safeSimulator.parameters[1]?.description}</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {safeSimulator.parameters[2]?.name}: {param3Value[0]}%
              </label>
              <Slider value={param3Value} onValueChange={setParam3Value} max={100} step={1} className="w-full" />
              <p className="text-xs text-gray-500 mt-1">{safeSimulator.parameters[2]?.description}</p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h4 className="font-semibold">Simulation Results</h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">{safeSimulator.option1Title}</div>
                  <div className="text-sm text-gray-600">{safeSimulator.parameters[0]?.impact}</div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {results.option1}% fit
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">{safeSimulator.option2Title}</div>
                  <div className="text-sm text-gray-600">{safeSimulator.parameters[1]?.impact}</div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {results.option2}% fit
              </Badge>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium mb-2">AI Recommendation:</div>
            <p className="text-sm text-gray-600">{safeSimulator.recommendation}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
