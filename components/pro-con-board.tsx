"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface ProConBoardProps {
  problem: string
  proConAnalysis?: {
    option1: {
      title: string
      pros: Array<{ text: string; weight: string }>
      cons: Array<{ text: string; weight: string }>
    }
    option2: {
      title: string
      pros: Array<{ text: string; weight: string }>
      cons: Array<{ text: string; weight: string }>
    }
  }
}

export function ProConBoard({ problem, proConAnalysis }: ProConBoardProps) {
  // Ensure problem is defined
  const safeProblem = problem || ""

  // Fallback pros and cons if no AI analysis provided
  const getDefaultProsCons = () => {
    if (safeProblem.toLowerCase().includes("car")) {
      return {
        option1: {
          title: "Buy a Car",
          pros: [
            { text: "Reliable transportation anytime", weight: "High" },
            { text: "No dependency on others/schedules", weight: "High" },
            { text: "Can travel long distances easily", weight: "Medium" },
            { text: "Builds credit with auto loan", weight: "Low" },
            { text: "Status symbol and personal space", weight: "Low" },
          ],
          cons: [
            { text: "High upfront cost ($20K-40K+)", weight: "High" },
            { text: "Ongoing costs: insurance, maintenance, fuel", weight: "High" },
            { text: "Rapid depreciation (20% first year)", weight: "High" },
            { text: "Parking costs and hassles", weight: "Medium" },
            { text: "Environmental impact", weight: "Medium" },
          ],
        },
        option2: {
          title: "Wait / Use Alternatives",
          pros: [
            { text: "Save $30K+ for investments/emergency fund", weight: "High" },
            { text: "No maintenance, insurance, or repair costs", weight: "High" },
            { text: "Flexibility to move anywhere", weight: "Medium" },
            { text: "Lower environmental footprint", weight: "Medium" },
            { text: "Force yourself to explore alternatives", weight: "Low" },
          ],
          cons: [
            { text: "Less convenient for spontaneous trips", weight: "Medium" },
            { text: "Weather dependency for walking/biking", weight: "Medium" },
            { text: "Rideshare costs can add up", weight: "Medium" },
            { text: "Limited for family/group activities", weight: "Low" },
            { text: "Potential social limitations", weight: "Low" },
          ],
        },
      }
    }

    // Default generic pros/cons
    return {
      option1: {
        title: "Yes",
        pros: [
          { text: "Potential benefits and opportunities", weight: "Medium" },
          { text: "Move forward with decision", weight: "Medium" },
        ],
        cons: [
          { text: "Risks and potential downsides", weight: "Medium" },
          { text: "Resource commitment required", weight: "Medium" },
        ],
      },
      option2: {
        title: "No / Wait",
        pros: [
          { text: "Maintain status quo", weight: "Medium" },
          { text: "Avoid potential risks", weight: "Medium" },
        ],
        cons: [
          { text: "Miss potential opportunities", weight: "Medium" },
          { text: "Delay potential benefits", weight: "Medium" },
        ],
      },
    }
  }

  const analysis = proConAnalysis || getDefaultProsCons()

  // Add safety checks for the analysis structure
  const safeAnalysis = {
    option1: {
      title: analysis.option1?.title || "Option 1",
      pros: analysis.option1?.pros || [],
      cons: analysis.option1?.cons || [],
    },
    option2: {
      title: analysis.option2?.title || "Option 2",
      pros: analysis.option2?.pros || [],
      cons: analysis.option2?.cons || [],
    },
  }

  const getWeightColor = (weight: string) => {
    switch (weight) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Option 1 */}
      <Card className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">{safeAnalysis.option1.title}</h3>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">✅</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Pros */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              <h4 className="font-semibold text-green-600">Pros</h4>
            </div>
            <div className="space-y-2">
              {safeAnalysis.option1.pros.map((pro, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-1 text-sm">{pro.text}</div>
                  <Badge variant="secondary" className={`text-xs ${getWeightColor(pro.weight)}`}>
                    {pro.weight}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Cons */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ThumbsDown className="h-4 w-4 text-red-600" />
              <h4 className="font-semibold text-red-600">Cons</h4>
            </div>
            <div className="space-y-2">
              {safeAnalysis.option1.cons.map((con, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1 text-sm">{con.text}</div>
                  <Badge variant="secondary" className={`text-xs ${getWeightColor(con.weight)}`}>
                    {con.weight}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Option 2 */}
      <Card className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-orange-600 mb-2">{safeAnalysis.option2.title}</h3>
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">⏳</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Pros */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              <h4 className="font-semibold text-green-600">Pros</h4>
            </div>
            <div className="space-y-2">
              {safeAnalysis.option2.pros.map((pro, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-1 text-sm">{pro.text}</div>
                  <Badge variant="secondary" className={`text-xs ${getWeightColor(pro.weight)}`}>
                    {pro.weight}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Cons */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ThumbsDown className="h-4 w-4 text-red-600" />
              <h4 className="font-semibold text-red-600">Cons</h4>
            </div>
            <div className="space-y-2">
              {safeAnalysis.option2.cons.map((con, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1 text-sm">{con.text}</div>
                  <Badge variant="secondary" className={`text-xs ${getWeightColor(con.weight)}`}>
                    {con.weight}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
