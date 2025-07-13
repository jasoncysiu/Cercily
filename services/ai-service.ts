import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface OpenRouterCompletionResponse {
  id: string;
  choices: Array<{
    message: ChatMessage;
    finish_reason: string;
    index: number;
  }>;
  created: number;
  model: string;
  object: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

/**
 * Analyzes a problem using the OpenRouter API with a specified model.
 */
async function analyzeProblemWithOpenRouter(prompt: string, modelIdentifier: string): Promise<string> {
  // console.log('Entering analyzeProblemWithOpenRouter for model:', modelIdentifier);
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const YOUR_SITE_URL = process.env.YOUR_SITE_URL || "https://cercily.com";
  const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || "Cercily";

  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables.");
  }

  let modelToUse: string;
  switch (modelIdentifier) {
    case "deepseek-v3-0324":
      modelToUse = "deepseek/deepseek-chat-v3-0324:free";
      break;
    case "claude-opus":
      // This model is currently disabled as per your request in problem-input.tsx
      throw new Error("Claude Opus is currently disabled.");
    // Add other OpenRouter models here as needed
    default:
      modelToUse = "deepseek/deepseek-chat-v3-0324:free"; // Fallback to Deepseek
  }

  const messages: ChatMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": YOUR_SITE_URL,
      "X-Title": YOUR_SITE_NAME,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "model": modelToUse,
      "messages": messages,
      "temperature": 0.7, // Add a default temperature for better responses
      "max_tokens": 2000, // Set a reasonable max_tokens
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // console.error("OpenRouter API Error:", errorData);
    throw new Error(`Failed to get completion from OpenRouter: ${errorData.message || response.statusText}`);
  }

  const data: OpenRouterCompletionResponse = await response.json();
  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  } else {
    throw new Error("No content received from OpenRouter API.");
  }
}

/**
 * Analyzes a problem using the native Google Generative AI (Gemini) API.
 */
async function analyzeProblemWithGeminiNative(prompt: string, modelIdentifier: string): Promise<string> {
  // console.log('Entering analyzeProblemWithGeminiNative for model:', modelIdentifier);
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables for Gemini models.");
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  let modelName: string;

  switch (modelIdentifier) {
    case "gemini-pro":
      modelName = "gemini-1.5-flash"; // Use 1.5-flash for the 'pro' option
      break;
    case "gemini-2.5-flash":
      modelName = "gemini-1.5-flash"; // Assuming gemini-2.5-flash is not yet available, fallback to 1.5-flash
      // If gemini-2.5-flash becomes available, change this to "gemini-2.5-flash"
      break;
    default:
      modelName = "gemini-1.5-flash"; // Default fallback
  }

  const model = genAI.getGenerativeModel({ model: modelName });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

/**
 * Main function to analyze a problem using the specified AI model.
 */
export async function analyzeProblemWithAI(prompt: string, modelIdentifier: string): Promise<string> {
  // console.log('analyzeProblemWithAI called with modelIdentifier:', modelIdentifier);
  if (modelIdentifier.startsWith("gemini-")) { // Check if it's any Gemini model
    return analyzeProblemWithGeminiNative(prompt, modelIdentifier);
  } else {
    // Default to OpenRouter for other models, including Deepseek
    return analyzeProblemWithOpenRouter(prompt, modelIdentifier);
  }
}