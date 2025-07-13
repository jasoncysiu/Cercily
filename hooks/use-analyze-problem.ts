import { useQuery } from '@tanstack/react-query';

interface AnalyzeProblemParams {
  problem: string;
  context: string;
  selectedModels: string[];
  selectedAiModel: string;
  userMode: "QuickThinker" | "OverThinker";
  userAnswers?: Record<string, string | number | string[]>; // Added userAnswers
}

async function fetchAnalysis(params: AnalyzeProblemParams) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      problem: params.problem,
      context: params.context,
      selectedModels: params.selectedModels.length > 0 ? params.selectedModels : undefined,
      selectedAiModel: params.selectedAiModel,
      userMode: params.userMode,
      userAnswers: params.userAnswers, // Pass userAnswers to the API
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }

  return response.json();
}

export function useAnalyzeProblem(params: AnalyzeProblemParams, enabled: boolean) {
  return useQuery({
    queryKey: ['aiAnalysis', params], // Unique key for caching based on all params
    queryFn: () => fetchAnalysis(params),
    enabled: enabled,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 1,
  });
}