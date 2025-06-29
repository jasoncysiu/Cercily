import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { problem, selectedModels } = await request.json()

    if (!problem) {
      return NextResponse.json({ error: "Problem is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Build the prompt based on selected models
    const selectedModelsText =
      selectedModels && selectedModels.length > 0
        ? `The user has selected these specific mental models to apply: ${selectedModels.join(", ")}. Focus your analysis using these models.`
        : "Use the most relevant mental models for this problem."

    const prompt = `
You are an expert decision-making consultant. Analyze this specific problem and provide highly relevant, actionable advice.

Problem: "${problem}"

${selectedModelsText}

Available Mental Models:
1. 80/20 Rule (Pareto Principle) - Focus on the vital few factors that drive most results
2. Theory of Constraints - Identify and address the biggest bottleneck limiting progress
3. First Principles - Break down to fundamental truths and rebuild from scratch
4. Occam's Razor - Choose the simplest solution that solves the problem
5. Hock Principle - Question assumptions and reveal counterintuitive insights
6. Interest-Based Counting - Focus on underlying interests, not stated positions
7. Via Negativa - Improve by removing/avoiding rather than adding
8. Inversion - Think backwards from failure to identify what to avoid
9. Relativity - Consider how context and perspective change the decision
10. Velocity vs Speed - Ensure you're moving in the right direction, not just fast
11. Asymmetric Bets - Identifying decisions with limited downside and large potential upside
12. Antifragility - Favoring choices that thrive under uncertainty and volatility
13. F.I.T. (Focus, Segment, Conflict) - Challenge biases, clarify focus, and simplify complexity

Respond with a JSON object containing:

{
  "insights": "2-3 sentences of specific, actionable advice for this exact problem. Be concrete and practical.",
  "keyFactors": [
    "Most important factor 1 for this specific decision",
    "Critical consideration 2 unique to this situation",
    "Key element 3 that will determine success/failure"
  ],
  "recommendation": "Clear, specific recommendation with reasoning for this exact problem",
  "caseStudies": [
    {
      "title": "Relevant case study title",
      "description": "Brief description of someone who faced a similar decision",
      "outcome": "What happened and key lessons learned",
      "appliedModels": "Which mental models were used"
    }
  ],
  "canvasItems": [
    {
      "id": "main-decision",
      "type": "decision",
      "title": "Your main decision question",
      "content": "Reframed version of the problem",
      "x": 400,
      "y": 50
    },
    {
      "id": "option-1",
      "type": "outcome",
      "title": "Option 1 (Yes/Proceed)",
      "content": "What choosing yes means",
      "x": 200,
      "y": 200
    },
    {
      "id": "option-2", 
      "type": "outcome",
      "title": "Option 2 (No/Wait)",
      "content": "What choosing no/waiting means",
      "x": 600,
      "y": 200
    },
    {
      "id": "factor-1",
      "type": "factor",
      "title": "Key Factor 1",
      "content": "Most important consideration",
      "x": 100,
      "y": 350
    },
    {
      "id": "factor-2",
      "type": "factor", 
      "title": "Key Factor 2",
      "content": "Second most important factor",
      "x": 300,
      "y": 350
    },
    {
      "id": "factor-3",
      "type": "factor",
      "title": "Key Factor 3", 
      "content": "Third critical factor",
      "x": 500,
      "y": 350
    }
  ],
  "soulProvokingQuestions": {
    "yesQuestions": [
      "Deep question that challenges you to consider proceeding",
      "Provocative question about the benefits of saying yes",
      "Soul-searching question about growth through this choice"
    ],
    "noQuestions": [
      "Deep question that challenges you to consider waiting/declining", 
      "Provocative question about the wisdom of saying no",
      "Soul-searching question about what you might be avoiding"
    ]
  },
  "proConAnalysis": {
    "option1": {
      "title": "Specific title for yes/proceed option",
      "pros": [
        {"text": "Specific pro 1", "weight": "High"},
        {"text": "Specific pro 2", "weight": "Medium"},
        {"text": "Specific pro 3", "weight": "Low"}
      ],
      "cons": [
        {"text": "Specific con 1", "weight": "High"},
        {"text": "Specific con 2", "weight": "Medium"}
      ]
    },
    "option2": {
      "title": "Specific title for no/wait option",
      "pros": [
        {"text": "Specific pro 1", "weight": "High"},
        {"text": "Specific pro 2", "weight": "Medium"}
      ],
      "cons": [
        {"text": "Specific con 1", "weight": "High"},
        {"text": "Specific con 2", "weight": "Low"}
      ]
    }
  },
  "decisionSimulator": {
    "option1Title": "Specific name for yes option",
    "option2Title": "Specific name for no option",
    "parameters": [
      {
        "name": "Parameter 1 specific to this decision",
        "description": "What this parameter means for this decision",
        "impact": "How this affects the choice"
      },
      {
        "name": "Parameter 2 specific to this decision", 
        "description": "What this parameter means",
        "impact": "How this affects the outcome"
      },
      {
        "name": "Parameter 3 specific to this decision",
        "description": "What this parameter represents",
        "impact": "How this influences the decision"
      }
    ],
    "recommendation": "Specific guidance based on typical parameter values for this decision type"
  }
}

Make everything highly specific to the problem "${problem}". Avoid generic advice.

Respond only with valid JSON.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean the response to ensure it's valid JSON
    let cleanedText = text.trim()
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/, "").replace(/\n?```$/, "")
    }
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/, "").replace(/\n?```$/, "")
    }

    // Strip trailing commas that break JSON
    cleanedText = cleanedText.replace(/,\s*([}\]])/g, "$1")

    // Parse the JSON response
    let analysis
    try {
      analysis = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw text:", text)

      // Fallback analysis
      analysis = {
        insights: `For your decision, focus on understanding your core needs and constraints before making a choice.`,
        keyFactors: ["Your specific circumstances", "Long-term implications", "Available alternatives"],
        recommendation: "Take time to clearly define what success looks like for this decision.",
        caseStudies: [
          {
            title: "A Similar Decision",
            description: "Someone faced a comparable choice",
            outcome: "They learned valuable lessons about decision-making",
            appliedModels: "First Principles",
          },
        ],
        canvasItems: [
          { id: "main-decision", type: "decision", title: "Your Decision", content: problem, x: 400, y: 50 },
          { id: "option-1", type: "outcome", title: "Yes", content: "Proceed with this choice", x: 200, y: 200 },
          { id: "option-2", type: "outcome", title: "No", content: "Decline or wait", x: 600, y: 200 },
          { id: "factor-1", type: "factor", title: "Key Factor 1", content: "Important consideration", x: 100, y: 350 },
          { id: "factor-2", type: "factor", title: "Key Factor 2", content: "Another factor", x: 300, y: 350 },
          { id: "factor-3", type: "factor", title: "Key Factor 3", content: "Third factor", x: 500, y: 350 },
        ],
        soulProvokingQuestions: {
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
        },
        proConAnalysis: {
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
        },
        decisionSimulator: {
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
        },
      }
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to analyze problem" }, { status: 500 })
  }
}
