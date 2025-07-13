"use client"

import { useState, useEffect } from "react"
import { DecisionCanvas } from "@/components/decision-canvas"
import { ModelSelectionStep } from "@/components/model-selection-step"
import { ProblemInput } from "@/components/problem-input"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { MENTAL_MODELS } from "@/components/mental-model-library"
import { LoadingPage } from "@/components/loading-page"
import { useAnalyzeProblem } from "../hooks/use-analyze-problem"
import { TooltipProvider } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { useUserMode } from "@/providers/UserModeProvider"
import { ClarificationStep } from "@/components/clarification-step" // Import the new component

interface Session {
  id: string;
  problem: string;
  context: string;
  activeModels: string[];
  analysis: {
    insights: string;
    insightsModelsUsed: string[];
    keyFactors: string[];
    keyFactorsModelsUsed: string[];
    recommendation: string;
    recommendationModelsUsed: string[];
    caseStudies: Array<{
      title: string;
      description: string;
      outcome: string;
      appliedModels: string;
      modelsUsed: string[];
    }>;
    canvasItems: any;
    soulProvokingQuestions: {
      yesQuestions: string[];
      noQuestions: string[];
      modelsUsed: string[];
    };
    proConAnalysis: {
      option1: {
        title: string;
        pros: Array<{ text: string; weight: string }>;
        cons: Array<{ text: string; weight: string }>;
      };
      option2: {
        title: string;
        pros: Array<{ text: string; weight: string }>;
        cons: Array<{ text: string; weight: string }>;
      };
      modelsUsed: string[];
    };
    decisionSimulator: {
      option1Title: string;
      option2Title: string;
      parameters: Array<{
        name: string;
        description: string;
        impact: string;
      }>;
      recommendation: string;
      modelsUsed: string[];
    };
    firstPrinciplesAnalysis: {
      explanation: string;
      problemApplication: {
        question1: string;
        answer1: string;
        question2: string;
        answer2: string;
        question3: string;
        answer3: string;
        solution: string;
      };
      modelsUsed: string[];
    };
  };
  timestamp: number;
  selectedAiModel: string;
}

interface SubQuestion {
  id: string;
  text: string;
  type: "multiselect";
  options: string[];
}

interface ClarificationQuestion {
  mainId?: string;
  mainText?: string;
  subQuestions?: SubQuestion[];
  id?: string;
  text: string;
  type: "text" | "multiselect";
  options?: string[];
}

export default function Cercily() {
  const { userMode } = useUserMode();
  const [currentProblem, setCurrentProblem] = useState("")
  const [currentContext, setCurrentContext] = useState("")
  const [activeModels, setActiveModels] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<"input" | "selection" | "clarification" | "results">("input") // Added "clarification"
  const [selectedAiModel, setSelectedAiModel] = useState<string>("gemini-pro");
  const [isSessionSaved, setIsSessionSaved] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);

  // New states for clarification loop
  const [preliminaryAnalysis, setPreliminaryAnalysis] = useState<any>(null);
  const [clarificationQuestions, setClarificationQuestions] = useState<ClarificationQuestion[]>([]);
  // userAnswers will now be a Record<string, string | string[]>
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});

  // State to hold the parameters for the AI analysis query
  const [analysisParams, setAnalysisParams] = useState<any | null>(null); // Can be initial or refined params
  // New state to hold analysis data when loaded from a session
  const [loadedAnalysisData, setLoadedAnalysisData] = useState<any>(null);

  // Use the custom hook for AI analysis
  const { data: aiResponse, isLoading: isGeneratingFramework, error, refetch } = useAnalyzeProblem(
    analysisParams || { problem: "", context: "", selectedModels: [], selectedAiModel: "", userMode: "QuickThinker" },
    !!analysisParams
  );

  // Effect to handle AI response for both phases
  useEffect(() => {
    if (aiResponse) {
      if (aiResponse.preliminaryAnalysis && aiResponse.clarificationQuestions) {
        // Phase 1 response: preliminary analysis and questions
        setPreliminaryAnalysis(aiResponse.preliminaryAnalysis);
        setClarificationQuestions(aiResponse.clarificationQuestions);
        setCurrentStep("clarification");
      } else {
        // Phase 2 response: final analysis
        setLoadedAnalysisData(aiResponse); // This is the final analysis
        setCurrentStep("results");
        setIsSessionSaved(false); // Mark as unsaved until explicitly saved
      }
    }
    if (error) {
      toast.error("AI Analysis Error", { description: error.message });
      // Fallback to default structure if AI analysis fails
      setLoadedAnalysisData({
        insights: "Using default analysis - AI temporarily unavailable.",
        insightsModelsUsed: [],
        keyFactors: ["Default Factor 1", "Default Factor 2"],
        keyFactorsModelsUsed: [],
        recommendation: "Consider basic principles.",
        recommendationModelsUsed: [],
        caseStudies: [],
        canvasItems: [],
        soulProvokingQuestions: null,
        proConAnalysis: null,
        decisionSimulator: null,
        firstPrinciplesAnalysis: null,
      });
      setCurrentStep("results"); // Move to results with fallback data
    }
  }, [aiResponse, error]);


  // Load sessions from Notion on component mount
  useEffect(() => {
    const loadSessions = async () => {
      setIsSessionsLoading(true);
      try {
        const response = await fetch("/api/notion/sessions");
        if (response.ok) {
          const data = await response.json();
          // Map Notion data to our Session interface
          const loadedSessions: Session[] = data.map((s: any) => ({
            id: s.id,
            problem: s.Problem,
            context: s.Context,
            activeModels: s["Active Models"],
            selectedAiModel: s["Selected AI Model"],
            timestamp: s.Timestamp,
            analysis: {
              insights: s.Insights,
              insightsModelsUsed: s.InsightsModelsUsed || [],
              keyFactors: s["Key Factors"],
              keyFactorsModelsUsed: s.KeyFactorsModelsUsed || [],
              recommendation: s.Recommendation,
              recommendationModelsUsed: s.RecommendationModelsUsed || [],
              caseStudies: s["Case Studies"] || [],
              canvasItems: s["Canvas Items"],
              soulProvokingQuestions: s["Soul Questions"],
              proConAnalysis: s["Pro Con"],
              decisionSimulator: s["Simulator"],
              firstPrinciplesAnalysis: s["First Principles"],
            }
          }));
          setSessions(loadedSessions);
        } else {
          toast.error("Failed to load sessions from Notion.");
          // console.error("Failed to load sessions:", await response.text());
        }
      } catch (err) {
        toast.error("Error connecting to Notion to load sessions.");
        // console.error("Error loading sessions:", err);
      } finally {
        setIsSessionsLoading(false);
      }
    };
    loadSessions();
  }, []);

  const handleProblemSubmit = async (problem: string, context: string, aiModel: string) => {
    setCurrentProblem(problem);
    setCurrentContext(context);
    setSelectedAiModel(aiModel);
    const allModelIds = MENTAL_MODELS.map((model) => model.id);
    setActiveModels(allModelIds); // Always start with all models for initial analysis

    // Trigger Phase 1 AI call for preliminary analysis and clarification questions
    setAnalysisParams({
      problem: problem,
      context: context,
      selectedModels: userMode === "QuickThinker" ? allModelIds : [], // QuickThinker uses all models by default, OverThinker selects later
      selectedAiModel: aiModel,
      userMode: userMode,
      userAnswers: undefined, // Indicate this is Phase 1
    });
    // The useEffect will handle setting currentStep to "clarification" once response is received
  };

  // userAnswers is now Record<string, string | string[]>
  const handleRefineSubmit = async (answers: Record<string, string | string[]>) => {
    setUserAnswers(answers);
    // Trigger Phase 2 AI call for final analysis
    setAnalysisParams({
      problem: currentProblem,
      context: currentContext,
      selectedModels: activeModels, // Use activeModels for final analysis
      selectedAiModel: selectedAiModel,
      userMode: userMode,
      userAnswers: answers, // Pass user answers for refinement
    });
    // The useEffect will handle setting currentStep to "results" once response is received
  };

  const handleSkipRefinement = () => {
    // If skipped, proceed to final analysis without additional answers
    setAnalysisParams({
      problem: currentProblem,
      context: currentContext,
      selectedModels: activeModels,
      selectedAiModel: selectedAiModel,
      userMode: userMode,
      userAnswers: {}, // Pass empty answers to indicate skip
    });
    // The useEffect will handle setting currentStep to "results" once response is received
  };

  const handleSaveCurrentSession = async () => {
    // Use the currently displayed analysis data (either newly generated or loaded)
    const analysisToSave = loadedAnalysisData || aiResponse;

    if (!analysisToSave || !currentProblem) {
      toast.error("No analysis to save.");
      return;
    }

    const sessionToSave = {
      Problem: currentProblem,
      Context: currentContext,
      "Active Models": activeModels,
      "Selected AI Model": selectedAiModel,
      Timestamp: Date.now(),
      Insights: analysisToSave.insights,
      InsightsModelsUsed: analysisToSave.insightsModelsUsed,
      "Key Factors": analysisToSave.keyFactors,
      KeyFactorsModelsUsed: analysisToSave.keyFactorsModelsUsed,
      Recommendation: analysisToSave.recommendation,
      RecommendationModelsUsed: analysisToSave.recommendationModelsUsed,
      "Case Studies": analysisToSave.caseStudies,
      "Canvas Items": analysisToSave.canvasItems,
      "Soul Questions": analysisToSave.soulProvokingQuestions,
      "Pro Con": analysisToSave.proConAnalysis,
      Simulator: analysisToSave.decisionSimulator,
      "First Principles": analysisToSave.firstPrinciplesAnalysis,
    };

    // Check if a session with the same problem, context, models, and AI model already exists to avoid duplicates
    const existingSession = sessions.find(s =>
      s.problem === sessionToSave.Problem &&
      s.context === sessionToSave.Context &&
      s.selectedAiModel === sessionToSave["Selected AI Model"] &&
      JSON.stringify(s.activeModels.sort()) === JSON.stringify(sessionToSave["Active Models"].sort())
    );

    if (existingSession) {
      toast.info("This session is already saved.");
      setIsSessionSaved(true);
      return;
    }

    try {
      const response = await fetch("/api/notion/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionToSave),
      });

      if (response.ok) {
        const savedPage = await response.json();
        const newSession: Session = {
          id: savedPage.id,
          problem: sessionToSave.Problem,
          context: sessionToSave.Context,
          activeModels: sessionToSave["Active Models"],
          selectedAiModel: sessionToSave["Selected AI Model"],
          timestamp: sessionToSave.Timestamp,
          analysis: analysisToSave,
        };
        setSessions((prevSessions) => [newSession, ...prevSessions]);
        setIsSessionSaved(true);
        toast.success("Session saved to Notion!");
      } else {
        toast.error("Failed to save session to Notion.");
        // console.error("Failed to save session:", await response.text());
      }
    } catch (error) {
      toast.error("Error saving session to Notion.");
      // console.error("Error saving session:", error);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await fetch("/api/notion/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sessionId }),
      });

      if (response.ok) {
        setSessions((prevSessions) => prevSessions.filter((session) => session.id !== sessionId));
        toast.success("Session deleted from Notion!");
        // If the currently viewed session is deleted, go back to input
        if ((loadedAnalysisData && loadedAnalysisData.id === sessionId) || (aiResponse && aiResponse.id === sessionId)) {
          handleBackToInput();
        }
      } else {
        toast.error("Failed to delete session from Notion.");
        // console.error("Failed to delete session:", await response.text());
      }
    } catch (error) {
      toast.error("Error deleting session from Notion.");
      // console.error("Error deleting session:", error);
    }
  };

  const handleLoadSession = (session: Session) => {
    window.location.href = `/session/${session.id}`;
  };

  const handleNewSession = () => {
    handleBackToInput();
    setSidebarOpen(false);
  };

  // Define handleBackToInput and handleBackToSelection
  const handleBackToInput = () => {
    setCurrentStep("input");
    setCurrentProblem("");
    setCurrentContext("");
    setActiveModels([]);
    setAnalysisParams(null); // Disable the query
    setLoadedAnalysisData(null); // Clear loaded data
    setPreliminaryAnalysis(null); // Clear preliminary data
    setClarificationQuestions([]); // Clear questions
    setUserAnswers({}); // Clear answers
    setIsSessionSaved(false); // Reset saved state
  };

  const handleBackToSelection = () => {
    setCurrentStep("selection");
    setAnalysisParams(null); // Disable the query
    setLoadedAnalysisData(null); // Clear loaded data
    setPreliminaryAnalysis(null); // Clear preliminary data
    setClarificationQuestions([]); // Clear questions
    setUserAnswers({}); // Clear answers
    setIsSessionSaved(false); // Reset saved state
  };

  // Determine which analysis data to pass to DecisionCanvas
  const analysisToDisplay = loadedAnalysisData || aiResponse; // aiResponse now holds the final analysis after clarification

  // Determine the shareable link for the current view
  const currentShareableLink = currentStep === "results" && analysisToDisplay?.id
    ? `${window.location.origin}/session/${analysisToDisplay.id}`
    : undefined;

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <TooltipProvider delayDuration={0}>
        <div className="flex-1 flex">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeModels={activeModels}
            onModelToggle={(modelId) => {
              setActiveModels((prev) =>
                prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId],
              )
            }}
            sessions={sessions}
            onLoadSession={handleLoadSession}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
            isSessionsLoading={isSessionsLoading}
            shareableLink={currentShareableLink}
          />

          <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out lg:${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
            {isGeneratingFramework && currentStep !== "clarification" ? ( // Only show loading if not in clarification step
              <LoadingPage problem={currentProblem} selectedModelsCount={activeModels.length} />
            ) : currentStep === "input" ? (
              <div className="flex-1 flex flex-col p-4 md:p-8">
                <div className="max-w-2xl w-full mx-auto">
                  <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cercily</h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
                      Describe any problem and get instant advice.
                    </p>
                  </div>

                  <ProblemInput
                    onSubmit={handleProblemSubmit}
                    placeholder="Describe your decision or problem... (e.g., 'Should I quit my job to freelance?')"
                    initialProblem={currentProblem}
                    initialContext={currentContext}
                    initialAiModel={selectedAiModel}
                  />

                  <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-sm border">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                        <span className="text-xl md:text-2xl">🧠</span>
                      </div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">AI Mental Models</h3>
                      <p className="text-xs md:text-sm text-gray-600">Get relevant frameworks instantly</p>
                    </div>

                    <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-sm border">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                        <span className="text-xl md:text-2xl">🎯</span>
                      </div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Visual Canvas</h3>
                      <p className="text-xs md:text-sm text-gray-600">Drag, adjust, and simulate decisions</p>
                    </div>

                    <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-sm border">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                        <span className="text-xl md:text-2xl">📊</span>
                      </div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Case Studies</h3>
                      <p className="text-xs md:text-sm text-gray-600">Learn from real examples</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : currentStep === "selection" ? (
              <ModelSelectionStep
                problem={currentProblem}
                aiSuggestions={[]}
                activeModels={activeModels}
                onModelToggle={(modelId) => {
                  setActiveModels((prev) =>
                    prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId],
                  )
                }}
                onProceed={handleRefineSubmit} // Changed to handleRefineSubmit
                onBack={handleBackToInput}
              />
            ) : currentStep === "clarification" && preliminaryAnalysis && clarificationQuestions.length > 0 ? (
              <ClarificationStep
                problem={currentProblem}
                preliminaryInsights={preliminaryAnalysis.insights}
                clarificationQuestions={clarificationQuestions}
                onRefineSubmit={handleRefineSubmit}
                onSkipRefinement={handleSkipRefinement}
                isLoading={isGeneratingFramework}
              />
            ) : currentStep === "results" && analysisToDisplay && (
              <DecisionCanvas
                problem={currentProblem}
                activeModels={activeModels}
                selectedModels={activeModels}
                onReset={handleBackToInput}
                onBackToSelection={handleBackToSelection}
                initialAnalysis={analysisToDisplay}
                onSaveSession={handleSaveCurrentSession}
                isSessionSaved={isSessionSaved}
                shareableLink={currentShareableLink}
              />
            )}
          </main>
        </div>
      </TooltipProvider>
    </div>
  )
}