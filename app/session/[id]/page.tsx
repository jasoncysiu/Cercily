"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { DecisionCanvas } from "@/components/decision-canvas"
import { LoadingPage } from "@/components/loading-page"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { MENTAL_MODELS } from "@/components/mental-model-library"
import { useUserMode } from "@/providers/UserModeProvider" // Import useUserMode

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

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const { userMode } = useUserMode(); // Get userMode from context

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);
  const [isSessionSaved, setIsSessionSaved] = useState(true);

  // Fetch the specific session data
  const { data: sessionData, isLoading, error } = useQuery<Session, Error>({
    queryKey: ['singleSession', sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/notion/sessions?id=${sessionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch session: ${response.statusText}`);
      }
      const data = await response.json();
      // Reconstruct the analysis object from the flat Notion properties
      return {
        id: data.id,
        problem: data.Problem,
        context: data.Context,
        activeModels: data["Active Models"],
        selectedAiModel: data["Selected AI Model"],
        timestamp: data.Timestamp,
        analysis: {
          insights: data.Insights,
          insightsModelsUsed: data.InsightsModelsUsed || [],
          keyFactors: data["Key Factors"],
          keyFactorsModelsUsed: data.KeyFactorsModelsUsed || [],
          recommendation: data.Recommendation,
          recommendationModelsUsed: data.RecommendationModelsUsed || [],
          caseStudies: data["Case Studies"] || [],
          canvasItems: data["Canvas Items"],
          soulProvokingQuestions: data["Soul Questions"],
          proConAnalysis: data["Pro Con"],
          decisionSimulator: data.Simulator,
          firstPrinciplesAnalysis: data["First Principles"],
        }
      };
    },
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 1,
  });

  // Load all sessions for the sidebar
  useEffect(() => {
    const loadAllSessions = async () => {
      setIsSessionsLoading(true);
      try {
        const response = await fetch("/api/notion/sessions");
        if (response.ok) {
          const data = await response.json();
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
              decisionSimulator: s.Simulator,
              firstPrinciplesAnalysis: s["First Principles"],
            }
          }));
          setSessions(loadedSessions);
        } else {
          toast.error("Failed to load sessions for sidebar.");
          // console.error("Failed to load sessions:", await response.text());
        }
      } catch (err) {
        toast.error("Error connecting to Notion to load sessions for sidebar.");
        // console.error("Error loading sessions:", err);
      } finally {
        setIsSessionsLoading(false);
      }
    };
    loadAllSessions();
  }, []);

  const handleSaveCurrentSession = async () => {
    if (!sessionData) {
      toast.error("No session data to save.");
      return;
    }

    const sessionToSave = {
      Problem: sessionData.problem,
      Context: sessionData.context,
      "Active Models": sessionData.activeModels,
      "Selected AI Model": sessionData.selectedAiModel,
      Timestamp: Date.now(),
      Insights: sessionData.analysis.insights,
      InsightsModelsUsed: sessionData.analysis.insightsModelsUsed,
      "Key Factors": sessionData.analysis.keyFactors,
      KeyFactorsModelsUsed: sessionData.analysis.keyFactorsModelsUsed,
      Recommendation: sessionData.analysis.recommendation,
      RecommendationModelsUsed: sessionData.analysis.recommendationModelsUsed,
      "Case Studies": sessionData.analysis.caseStudies,
      "Canvas Items": sessionData.analysis.canvasItems,
      "Soul Questions": sessionData.analysis.soulProvokingQuestions,
      "Pro Con": sessionData.analysis.proConAnalysis,
      Simulator: sessionData.analysis.decisionSimulator,
      "First Principles": sessionData.analysis.firstPrinciplesAnalysis,
    };

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
          analysis: sessionData.analysis,
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

  const handleDeleteSession = async (idToDelete: string) => {
    try {
      const response = await fetch("/api/notion/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idToDelete }),
      });

      if (response.ok) {
        setSessions((prevSessions) => prevSessions.filter((session) => session.id !== idToDelete));
        toast.success("Session deleted from Notion!");
        if (sessionId === idToDelete) {
          window.location.href = "/";
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
    window.location.href = "/";
  };

  const handleModelToggle = (modelId: string) => {
    toast.info("Model selection is not editable on a shared session page. Start a new session to customize.");
  };

  if (isLoading) {
    return (
      <LoadingPage problem="Loading session..." selectedModelsCount={0} />
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Session</h1>
        <p className="text-gray-700 mb-4">Could not retrieve session data. It might not exist or there was a network issue.</p>
        <p className="text-sm text-gray-500">Error: {error.message}</p>
        <button onClick={() => window.location.href = "/"} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md">
          Go to Home
        </button>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Session Not Found</h1>
        <p className="text-gray-700 mb-4">The session you are looking for does not exist.</p>
        <button onClick={() => window.location.href = "/"} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md">
          Go to Home
        </button>
      </div>
    );
  }

  const shareableLink = typeof window !== 'undefined' ? `${window.location.origin}/session/${sessionId}` : '';

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
            activeModels={sessionData.activeModels}
            onModelToggle={handleModelToggle}
            sessions={sessions}
            onLoadSession={handleLoadSession}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
            isSessionsLoading={isSessionsLoading}
            shareableLink={shareableLink}
          />

          <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out lg:${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
            <DecisionCanvas
              problem={sessionData.problem}
              activeModels={sessionData.activeModels}
              selectedModels={sessionData.activeModels}
              onReset={handleNewSession}
              onBackToSelection={() => window.location.href = "/"}
              initialAnalysis={sessionData.analysis}
              onSaveSession={handleSaveCurrentSession}
              isSessionSaved={isSessionSaved}
              shareableLink={shareableLink}
            />
          </main>
        </div>
      </TooltipProvider>
    </div>
  );
}