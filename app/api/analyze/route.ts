import { type NextRequest, NextResponse } from "next/server";
import { analyzeProblemWithAI } from "@/services/ai-service";

export async function POST(request: NextRequest) {
  try {
    const { problem, context, selectedModels, selectedAiModel, userMode, userAnswers } = await request.json();

    if (!problem) {
      return NextResponse.json({ error: "Problem is required" }, { status: 400 });
    }

    let prompt: string;
    let responseData: any;

    if (userAnswers) {
      // Phase 2: User has provided answers, generate final analysis
      const selectedModelsText =
        selectedModels && selectedModels.length > 0
          ? `The user has selected these specific mental models to apply: ${selectedModels.join(", ")}. Focus your analysis using these models.`
          : "Use the most relevant mental models for this problem.";

      const contextText = context ? `\nAdditional Context/Key Background: "${context}"` : "";
      const userAnswersText = Object.entries(userAnswers)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `User's answer for "${key}": [${value.join(", ")}]`;
          }
          return `User's answer for "${key}": "${value}"`;
        })
        .join("\n");

      prompt = `
You are an expert decision-making consultant. Analyze this specific problem and provide highly relevant, actionable advice.
Original Problem: "${problem}"
${contextText}
${userAnswersText ? `\nAdditional user clarifications:\n${userAnswersText}` : ""}

**CRITICAL INSTRUCTION: Deeply personalize the entire analysis.**
Identify and utilize *all* explicit personal information provided by the user (e.g., age, location, country, profession, specific life situations, PII) from the original problem, context, and their clarification answers. This is paramount for a truly tailored experience. Do NOT invent any personal details; *only* use what is explicitly stated or clearly implied.

${selectedModelsText}

Available Mental Models:
1. 80/20 Rule (Pareto Principle) - Focus on the vital few factors that drive most results (ID: pareto-principle)
2. Theory of Constraints - Identify and address the biggest bottleneck limiting progress (ID: theory-of-constraints)
3. First Principles - Break down complex problems to fundamental truths and rebuild from scratch (ID: first-principles)
4. Occam's Razor - Choose the simplest solution that solves the problem (ID: occams-razor)
5. Hock Principle - Question assumptions and reveal counterintuitive insights (ID: hock-principle)
6. Interest-Based Counting - Focus on underlying interests, not stated positions (ID: interest-based-counting)
7. Via Negativa - Improve by removing/avoiding rather than adding (ID: via-negativa)
8. Inversion - Think backwards from failure to identify what to avoid and prevent problems (ID: inversion)
9. Relativity - Consider how context and perspective change the decision (ID: relativity)
10. Velocity vs Speed - Ensure you're moving fast in the right direction, not just fast (ID: velocity-vs-speed)
11. Asymmetric Bets - Identifying decisions with limited downside and large potential upside (ID: asymmetric-bets)
12. Antifragility - Favoring choices that thrive under uncertainty and volatility. (ID: antifragility)

Respond with a JSON object containing the full, comprehensive analysis for the DecisionCanvas. Every single field in the JSON, including insights, key factors, recommendation, case studies, canvas items, soul-provoking questions, pro/con analysis, decision simulator, first principles analysis, top actions, and new directions, MUST be populated based on the problem, context, selected models, and **especially all user clarifications (userAnswers)**. The goal is to make the analysis feel uniquely tailored to their situation. Avoid generic advice.

{
  "insights": "2-3 sentences of specific, actionable advice for this exact problem, directly incorporating user's personal situation and clarifications.",
  "insightsModelsUsed": ["id-of-model-1", "id-of-model-2"],
  "keyFactors": [
    "Most important factor 1 for this specific decision, directly influenced by user's personal context and input",
    "Critical consideration 2 unique to this situation, directly influenced by user's personal context and input",
    "Key element 3 that will determine success/failure, directly influenced by user's personal context and input"
  ],
  "keyFactorsModelsUsed": ["id-of-model-3"],
  "recommendation": "Clear, specific recommendation with reasoning for this exact problem, directly incorporating user's personal situation and clarifications.",
  "recommendationModelsUsed": ["id-of-model-1", "id-of-model-3"],
  "caseStudies": [
    {
      "title": "Relevant case study title, tailored by user's personal context and input",
      "description": "Brief description of someone who faced a similar decision, considering user's personal situation",
      "outcome": "What happened and key lessons learned, relevant to user's personal context",
      "appliedModels": "Which mental models were used",
      "modelsUsed": ["id-of-model-4"]
    }
  ],
  "canvasItems": [
    {
      "id": "main-decision",
      "type": "decision",
      "title": "Your main decision question, refined by user's personal context and input",
      "content": "Reframed version of the problem, incorporating insights from user's personal situation and clarifications",
      "x": 400,
      "y": 50
    },
    {
      "id": "option-1",
      "type": "outcome",
      "title": "Option 1 (Yes/Proceed), tailored by user's personal context and input",
      "content": "What choosing yes means, considering user's personal situation and clarifications",
      "x": 200,
      "y": 200
    },
    {
      "id": "option-2",
      "type": "outcome",
      "title": "Option 2 (No/Wait), tailored by user's personal context and input",
      "content": "What choosing no/waiting means, considering user's personal situation and clarifications",
      "x": 600,
      "y": 200
    },
    {
      "id": "factor-1",
      "type": "factor",
      "title": "Key Factor 1, derived from user's personal context and input",
      "content": "Most important consideration, directly from user's personal situation and clarifications",
      "x": 100,
      "y": 350
    },
    {
      "id": "factor-2",
      "type": "factor",
      "content": "Second most important factor, directly from user's personal situation and clarifications",
      "x": 300,
      "y": 350
    },
    {
      "id": "factor-3",
      "type": "factor",
      "content": "Third critical factor, directly from user's personal situation and clarifications",
      "x": 500,
      "y": 350
    }
  ],
  "soulProvokingQuestions": {
    "yesQuestions": [
      "Deep question that challenges you to consider proceeding, tailored by user's personal context and input",
      "Provocative question about the benefits of saying yes, considering user's personal situation and clarifications",
      "Soul-searching question about growth through this choice, influenced by user's personal context and input"
    ],
    "noQuestions": [
      "Deep question that challenges you to consider waiting/declining, tailored by user's personal context and input",
      "Provocative question about the wisdom of saying no, considering user's personal situation and clarifications",
      "Soul-searching question about what you might be avoiding, influenced by user's personal context and input"
    ],
    "modelsUsed": ["id-of-model-5"]
  },
  "proConAnalysis": {
    "option1": {
      "title": "Specific title for yes/proceed option, tailored by user's personal context and input",
      "pros": [
        {"text": "Specific pro 1, influenced by user's personal context and input", "weight": "High"},
        {"text": "Specific pro 2, influenced by user's personal context and input", "weight": "Medium"},
        {"text": "Specific pro 3, influenced by user's personal context and input", "weight": "Low"}
      ],
      "cons": [
        {"text": "Specific con 1, influenced by user's personal context and input", "weight": "High"},
        {"text": "Specific con 2, influenced by user's personal context and input", "weight": "Medium"}
      ]
    },
    "option2": {
      "title": "Specific title for no/wait option, tailored by user's personal context and input",
      "pros": [
        {"text": "Specific pro 1, influenced by user's personal context and input", "weight": "High"},
        {"text": "Specific pro 2, influenced by user's personal context and input", "weight": "Medium"}
      ],
      "cons": [
        {"text": "Specific con 1, influenced by user's personal context and input", "weight": "High"},
        {"text": "Specific con 2, influenced by user's personal context and input", "weight": "Low"}
      ]
    },
    "modelsUsed": ["id-of-model-6"]
  },
  "decisionSimulator": {
    "option1Title": "Specific name for yes option, tailored by user's personal context and input",
    "option2Title": "Specific name for no option, tailored by user's personal context and input",
    "parameters": [
      {
        "name": "Parameter 1 specific to this decision, influenced by user's personal context and input",
        "description": "What this parameter means for this decision, considering user's personal situation and input",
        "impact": "How this affects the choice, considering user's personal situation and input"
      },
      {
        "name": "Parameter 2 specific to this decision, influenced by user's personal context and input",
        "description": "What this parameter means, considering user's personal situation and input",
        "impact": "How this affects the outcome, considering user's personal situation and input"
      },
      {
        "name": "Parameter 3 specific to this decision, influenced by user's personal context and input",
        "description": "What this parameter represents, considering user's personal situation and input",
        "impact": "How this influences the decision, considering user's personal situation and input"
      }
    ],
    "recommendation": "Specific guidance based on typical parameter values for this decision type, directly incorporating user's personal context and input",
    "modelsUsed": ["id-of-model-7"]
  },
  "firstPrinciplesAnalysis": {
    "explanation": "First Principles thinking involves breaking down complex problems to fundamental truths and rebuilding from scratch, avoiding assumptions.",
    "problemApplication": {
      "question1": "Generate a dynamic, specific question for the user's problem, asking for its fundamental, irreducible components or truths, influenced by user's personal context and input.",
      "answer1": "Provide a specific breakdown of the user's problem into its most basic elements, stripping away assumptions, and incorporating user's personal context and input.",
      "question2": "Generate a dynamic, specific question for the user's problem, asking for the core, undeniable reality or essential resource involved, influenced by user's personal context and input.",
      "answer2": "Identify the absolute minimum or most basic element relevant to the user's problem, similar to raw material cost, and incorporating user's personal context and input.",
      "question3": "Generate a dynamic, specific question for the user's problem, asking why it is currently difficult, expensive, or unsolved by conventional methods, influenced by user's personal context and input.",
      "answer3": "Identify the underlying assumptions, traditional inefficiencies, or inherited biases specific to the user's problem, and incorporating user's personal context and input.",
      "solution": "Reconstruct a solution based purely on the fundamental truths, leading to innovative approaches, and incorporating user's personal context and input."
    },
    "modelsUsed": ["id-of-model-3"]
  },
  "topActions": [
    "Action 1: A concrete, actionable step based on the analysis and user's personal context and input.",
    "Action 2: Another practical step to move forward, tailored to user's situation.",
    "Action 3: A third actionable item, considering user's personal context."
  ],
  "newDirections": [
    "New Direction 1: A fresh perspective or consideration the user/AI might have missed, tailored to user's situation.",
    "New Direction 2: An alternative approach or angle to explore, considering user's personal context.",
    "New Direction 3: A potential blind spot or unconsidered factor, relevant to user's situation."
  ]
}

Respond only with valid JSON.
`;
      const text = await analyzeProblemWithAI(prompt, selectedAiModel);
      responseData = parseAndCleanAIResponse(text, problem, userMode);
    } else {
      // Phase 1: Initial problem submission, generate preliminary analysis and clarification questions
      const contextText = context ? `\nHere's some background: "${context}"` : "";

      prompt = `
You are an expert decision-making assistant. The user has provided an initial problem and context. Your task is to:
1. Provide a brief, preliminary analysis of the problem.
2. Generate exactly ONE main clarification area with exactly THREE distinct, thought-provoking sub-questions.
3. Each sub-question MUST be of 'type: "multiselect"' and MUST have exactly FOUR distinct, personal, and **concise and highly relevant** 'options'.
4. Generate ONE additional 'multiselect' question with 3-4 options for 'Critical Factors' that are highly relevant to the problem and could influence the decision. These options should be concise and actionable.
5. Add ONE more 'multiselect' question to categorize the problem type. Based on the problem and context, generate 3-4 distinct and highly relevant problem categories. These categories should be one level more specific than broad fields (e.g., instead of 'Economics', think 'Efficiency' or 'Investment Strategy'; instead of 'Communication', think 'Negotiation' or 'Conflict Resolution'). The last option MUST be "Not sure".
6. Finally, add ONE additional question at the end of type 'text' asking if any of the *summarized context* is irrelevant or should be de-emphasized.

This will result in a total of 6 questions.

Problem: "${problem}"${contextText}

**CRITICAL INSTRUCTION: Deeply personalize the clarification questions.**
Identify and utilize *all* explicit personal information provided by the user (e.g., age, location, country, profession, specific life situations, PII) from the original problem and context. Weave these details into the questions and especially the *options* to make them directly relevant and personal to the user's implied or stated situation. Do NOT invent any personal details; *only* use what is explicitly stated or clearly implied.

**Question Focus:**
- For the main clarification topic, focus on the user's *past experiences*, *future aspirations*, or *personal values* related to the decision, rather than just the immediate problem.
- **Crucially, ensure the sub-questions within the main topic specifically ask for "What, Where, When, Who, Why, How" details about the problem itself. The options for these questions MUST be highly specific and derived directly from the problem and context, not generic examples.**
- Ensure questions and options are as **sleek and succinct** as possible, avoiding overloaded phrasing.

Provide a JSON object with the following structure:

{
  "preliminaryAnalysis": {
    "insights": [
      "You've presented a problem that requires careful consideration.",
      "Your provided context offers valuable background for analysis.",
      "This decision likely involves trade-offs and potential risks.",
      "We'll help you break it down to find clarity."
    ],
    "keyFactors": ["Initial factor 1", "Initial factor 2"]
  },
  "clarificationQuestions": [
    {
      "mainId": "problem-context-details",
      "mainText": "Problem Context & Details",
      "subQuestions": [
        {
          "id": "problem-what",
          "text": "What is the core nature of this decision?",
          "type": "multiselect",
          "options": [
            "Career Change",
            "Financial Investment",
            "Relationship Issue",
            "Business Strategy"
          ]
        },
        {
          "id": "problem-who",
          "text": "Who are the key people involved?",
          "type": "multiselect",
          "options": [
            "Family/Partner",
            "Colleagues/Boss",
            "Clients/Customers",
            "Self Only"
          ]
        },
        {
          "id": "problem-why",
          "text": "What's the primary motivation for this decision?",
          "type": "multiselect",
          "options": [
            "Financial Gain",
            "Personal Growth",
            "Avoid Loss",
            "New Opportunity"
          ]
        }
      ]
    },
    {
      "id": "critical-factors-selection",
      "text": "Which critical factors resonate most? (Select all that apply)",
      "type": "multiselect",
      "options": [
        "Financial Impact",
        "Time Commitment",
        "Personal Growth",
        "Risk Exposure",
        "Reputational Impact",
        "Resource Availability"
      ]
    },
    {
      "id": "problem-type-categorization",
      "text": "Categorize this problem:",
      "type": "multiselect",
      "options": [
        "Career Transition",
        "Investment Choice",
        "Relationship Dilemma",
        "Startup Strategy",
        "Not sure"
      ]
    },
    {
      "id": "irrelevant-context",
      "text": "Any irrelevant context to de-emphasize?",
      "type": "text"
    }
  ]
}

Respond only with valid JSON.
`;
      const text = await analyzeProblemWithAI(prompt, selectedAiModel);
      responseData = parseAndCleanAIResponse(text, problem, userMode, true);
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to analyze problem" }, { status: 500 });
  }
}

// Helper function to parse and clean AI response
function parseAndCleanAIResponse(text: string, problem: string, userMode: string, isPreliminary = false) {
  let cleanedText = text.trim();
  if (cleanedText.startsWith("```json")) {
    cleanedText = cleanedText.replace(/```json\n?/, "").replace(/\n?```$/, "");
  }
  if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText.replace(/```\n?/, "").replace(/\n?```$/, "");
  }
  cleanedText = cleanedText.replace(/,\s*([}\]])/g, "$1"); // Strip trailing commas

  try {
    return JSON.parse(cleanedText);
  } catch (parseError) {
    console.error("JSON Parse Error:", parseError, "Raw text:", text);

    // Fallback structure for preliminary analysis
    if (isPreliminary) {
      const defaultQuestions = [
        {
          mainId: "problem-context-details",
          mainText: "Problem Context & Details",
          subQuestions: [
            {
              id: "problem-what",
              text: "What is the core nature of this decision?",
              type: "multiselect",
              options: [
                "Career Change",
                "Financial Investment",
                "Relationship Issue",
                "Business Strategy"
              ]
            },
            {
              id: "problem-who",
              text: "Who are the key people involved?",
              type: "multiselect",
              options: [
                "Family/Partner",
                "Colleagues/Boss",
                "Clients/Customers",
                "Self Only"
              ]
            },
            {
              id: "problem-why",
              text: "What's the primary motivation for this decision?",
              type: "multiselect",
              options: [
                "Financial Gain",
                "Personal Growth",
                "Avoid Loss",
                "New Opportunity"
              ]
            }
          ]
        },
        {
          id: "critical-factors-selection",
          text: "Which critical factors resonate most? (Select all that apply)",
          type: "multiselect",
          options: [
            "Financial Impact",
            "Time Commitment",
            "Personal Growth",
            "Risk Exposure",
            "Reputational Impact",
            "Resource Availability"
          ]
        },
        {
          id: "problem-type-categorization",
          text: "Categorize this problem:",
          type: "multiselect",
          options: [
            "Career Transition",
            "Investment Choice",
            "Relationship Dilemma",
            "Startup Strategy",
            "Not sure"
          ]
        },
        {
          id: "irrelevant-context",
          text: "Any irrelevant context to de-emphasize?",
          type: "text"
        }
      ];

      return {
        preliminaryAnalysis: {
          insights: [
            `You've presented a problem that requires careful consideration.`,
            `Your provided context offers valuable background for analysis.`,
            `This decision likely involves trade-offs and potential risks.`,
            `We'll help you break it down to find clarity.`
          ],
          keyFactors: ["Initial Factor 1", "Initial Factor 2"]
        },
        clarificationQuestions: defaultQuestions
      };
    }

    // Fallback structure for final analysis (similar to existing fallback)
    return {
      insights: `For your decision, focus on understanding your core needs and constraints before making a choice.`,
      insightsModelsUsed: userMode === "OverThinker" ? ["occams-razor"] : [],
      keyFactors: ["Your specific circumstances", "Long-term implications", "Available alternatives"],
      keyFactorsModelsUsed: userMode === "OverThinker" ? ["pareto-principle"] : [],
      recommendation: "Take time to clearly define what success looks like for this decision.",
      recommendationModelsUsed: userMode === "OverThinker" ? ["velocity-vs-speed"] : [],
      caseStudies: [
        {
          title: "A Similar Decision",
          description: "Someone faced a comparable choice",
          outcome: "They learned valuable lessons about decision-making",
          appliedModels: userMode === "OverThinker" ? "First Principles" : "Thinking Simply",
          modelsUsed: userMode === "OverThinker" ? ["first-principles"] : [],
        },
      ],
      canvasItems: [
        { id: "main-decision", type: "decision", title: "Your Decision", content: problem, x: 400, y: 50 },
        { id: "option-1", type: "outcome", title: "Yes", content: "Proceed with this choice", x: 200, y: 200 },
        { id: "option-2", type: "outcome", title: "No", content: "Decline or wait", x: 600, y: 200 },
        { id: "factor-1", type: "factor", title: "Key Factor 1", content: "Important consideration", x: 100, y: 350 },
        { id: "factor-2", type: "factor", content: "Another factor", x: 300, y: 350 },
        { id: "factor-3", type: "factor", content: "Third factor", x: 500, y: 350 },
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
        modelsUsed: userMode === "OverThinker" ? ["inversion"] : [],
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
            { text: "Delay potential benefits", "weight": "Medium" },
          ],
        },
        modelsUsed: userMode === "OverThinker" ? ["relativity"] : [],
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
            description: "Your available time, money and energy",
            impact: "More resources make proceeding easier",
          },
        ],
        recommendation: "Consider your specific circumstances and constraints when making this decision.",
        modelsUsed: userMode === "OverThinker" ? ["asymmetric-bets"] : [],
      },
      firstPrinciplesAnalysis: {
        explanation: userMode === "OverThinker" ? "First Principles thinking involves breaking down complex problems to fundamental truths and rebuilding from scratch, avoiding assumptions." : "First Principles means breaking a problem down to its most basic facts, like building from scratch.",
        problemApplication: {
            question1: userMode === "OverThinker" ? "What are the fundamental components of this problem?" : "What are the absolute basics of this problem?",
            answer1: userMode === "OverThinker" ? "Identify the core elements without preconceived notions." : "The core parts are...",
            question2: userMode === "OverThinker" ? "What is the absolute minimum or essential truth here?" : "What's the simplest truth here?",
            answer2: userMode === "OverThinker" ? "Strip away all non-essential layers to find the core." : "The undeniable reality is...",
            question3: userMode === "OverThinker" ? "Why is this problem typically approached in a certain way?" : "Why is this usually hard?",
            answer3: userMode === "OverThinker" ? "Challenge conventional wisdom and common assumptions." : "It's often hard because of common assumptions like...",
            solution: userMode === "OverThinker" ? "Reconstruct a solution based purely on the fundamental truths, leading to innovative approaches." : "A simple way to solve this, based on the basics, is..."
        },
        modelsUsed: userMode === "OverThinker" ? ["first-principles"] : [],
      },
      topActions: [
        "Action 1: A concrete, actionable step based on the analysis.",
        "Action 2: Another practical step to move forward.",
        "Action 3: A third actionable item."
      ],
      newDirections: [
        "New Direction 1: A fresh perspective or consideration.",
        "New Direction 2: An alternative approach or angle to explore.",
        "New Direction 3: A potential blind spot or unconsidered factor."
      ]
    };
  }
}