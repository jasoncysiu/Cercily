"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Sparkles,
  Palette,
  MessageSquare,
  Scale,
  TrendingUp,
  AlertTriangle,
  Atom,
  Save,
  Check,
  Share2,
  ChevronsUpDown,
  ListChecks,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useUserMode } from "@/providers/UserModeProvider";

// Import new section components
import { SectionWrapper } from "@/components/section-wrapper";
import { InsightsSection } from "@/components/analysis-sections/insights-section";
import { FirstPrinciplesSection } from "@/components/analysis-sections/first-principles-section";
import { VisualCanvasSection } from "@/components/analysis-sections/visual-canvas-section";
import { QuestionBoardSection } from "@/components/analysis-sections/question-board-section";
import { SelectedModelsSection } from "@/components/analysis-sections/selected-models-section";
import { ProConBoardSection } from "@/components/analysis-sections/pro-con-board-section";
import { DecisionSimulatorSection } from "@/components/analysis-sections/decision-simulator-section";
import { CaseStudiesSection } from "@/components/analysis-sections/case-studies-section"; // Corrected import
import { ActionDirectionsSection } from "@/components/analysis-sections/action-directions-section";

interface DecisionCanvasProps {
  problem: string;
  activeModels: string[];
  selectedModels?: string[];
  onReset: () => void;
  onBackToSelection?: () => void;
  initialAnalysis?: any;
  onSaveSession?: () => void;
  isSessionSaved?: boolean;
  shareableLink?: string;
}

export function DecisionCanvas({
  problem,
  activeModels,
  selectedModels = [],
  onReset,
  onBackToSelection,
  initialAnalysis,
  onSaveSession,
  isSessionSaved,
  shareableLink,
}: DecisionCanvasProps) {
  const { userMode } = useUserMode();
  const [analysisData, setAnalysisData] = useState<any>(initialAnalysis);

  const [sectionsExpanded, setSectionsExpanded] = useState({
    insights: true,
    canvas: false,
    questions: false,
    models: false,
    proCon: false,
    simulator: false,
    caseStudies: false,
    firstPrinciples: false,
    actionDirections: false,
  });

  const allSectionsAreExpanded = Object.values(sectionsExpanded).every(Boolean);

  const toggleSection = (sectionKey: string) => {
    setSectionsExpanded((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey as keyof typeof sectionsExpanded],
    }));
  };

  const handleToggleAllSections = () => {
    const newState = !allSectionsAreExpanded;
    const newSectionsExpanded = Object.fromEntries(
      Object.keys(sectionsExpanded).map(key => [key, newState])
    ) as typeof sectionsExpanded;
    setSectionsExpanded(newSectionsExpanded);
  };

  useEffect(() => {
    if (initialAnalysis) {
      setAnalysisData(initialAnalysis);
      return;
    }

    const analyzeWithAI = async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problem,
            context: "",
            selectedModels: selectedModels.length > 0 ? selectedModels : undefined,
            userMode: userMode,
          }),
        });

        if (response.ok) {
          const analysis = await response.json();
          setAnalysisData(analysis);
        } else {
          throw new Error(`API request failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error("Failed to analyze with AI:", error);
        setAnalysisData({
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
          topActions: [],
          newDirections: [],
        });
      }
    };

    if (!initialAnalysis) {
      analyzeWithAI();
    }
  }, [problem, selectedModels, initialAnalysis, userMode]);

  const handleShare = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink)
        .then(() => {
          toast.success("Link copied to clipboard!", {
            description: "Share this URL to let others view your session.",
          });
        })
        .catch((err) => {
          toast.error("Failed to copy link.", {
            description: "Please copy the link manually: " + shareableLink,
          });
          console.error("Failed to copy link:", err);
        });
    } else {
      toast.info("No shareable link available for this view.");
    }
  };

  if (!analysisData) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-purple-500 animate-pulse mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Generating Analysis...</h3>
          <p className="text-gray-600">Please wait while Cercily processes your problem.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header for New Problem, Save, and Share */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button variant="ghost" size="sm" onClick={onReset}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            New Problem
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToggleAllSections} className="flex-shrink-0">
              <ChevronsUpDown className={`h-4 w-4 transition-transform duration-200 ${allSectionsAreExpanded ? '' : 'rotate-180'}`} />
            </Button>
            {shareableLink && (
              <Button variant="outline" size="sm" onClick={handleShare} className="flex-shrink-0">
                <Share2 className="h-4 w-4" />
              </Button>
            )}
            {onSaveSession && (
              <Button
                variant={isSessionSaved ? "secondary" : "default"}
                size="sm"
                onClick={onSaveSession}
                disabled={isSessionSaved}
                className="flex-shrink-0"
              >
                {isSessionSaved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Session
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Problem Statement */}
      <div className="px-3 pt-2 pb-0 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <SectionWrapper
            icon={<Sparkles className="h-5 w-5 text-purple-600" />}
            title="Problem Statement"
            sectionKey="problemStatement"
            isExpanded={sectionsExpanded.insights}
            onToggle={() => toggleSection("insights")}
          >
            <Card className="p-5 bg-white">
              <p className="text-sm text-gray-700">{problem}</p>
            </Card>
          </SectionWrapper>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 space-y-5">
          <div className="max-w-6xl mx-auto space-y-5">
            {/* AI Insights */}
            <section>
              <SectionWrapper
                icon={<Sparkles className="h-5 w-5 text-purple-600" />}
                title="Suggestion"
                sectionKey="insights"
                isExpanded={sectionsExpanded.insights}
                onToggle={() => toggleSection("insights")}
                modelsUsed={userMode === "OverThinker" ? analysisData.insightsModelsUsed : []}
              >
                <InsightsSection
                  aiInsights={analysisData.insights}
                  insightsModelsUsed={userMode === "OverThinker" ? analysisData.insightsModelsUsed : []}
                  keyFactors={analysisData.keyFactors}
                  keyFactorsModelsUsed={userMode === "OverThinker" ? analysisData.keyFactorsModelsUsed : []}
                  recommendation={analysisData.recommendation}
                  recommendationModelsUsed={userMode === "OverThinker" ? analysisData.recommendationModelsUsed : []}
                />
              </SectionWrapper>
            </section>

            {/* First Principles Analysis */}
            {analysisData.firstPrinciplesAnalysis && (
              <section>
                <SectionWrapper
                  icon={<Atom className="h-5 w-5 text-blue-600" />}
                  title={userMode === "QuickThinker" ? "Break It Down" : "First Principles Analysis"}
                  sectionKey="firstPrinciples"
                  isExpanded={sectionsExpanded.firstPrinciples}
                  onToggle={() => toggleSection("firstPrinciples")}
                  modelsUsed={userMode === "OverThinker" ? analysisData.firstPrinciplesAnalysis.modelsUsed : []}
                >
                  <FirstPrinciplesSection firstPrinciplesAnalysis={analysisData.firstPrinciplesAnalysis} />
                </SectionWrapper>
              </section>
            )}

            {/* Visual Canvas */}
            <section>
              <SectionWrapper
                icon={<Palette className="h-5 w-5 text-indigo-600" />}
                title={userMode === "QuickThinker" ? "Decision Map" : "Visual Decision Canvas"}
                sectionKey="canvas"
                isExpanded={sectionsExpanded.canvas}
                onToggle={() => toggleSection("canvas")}
              >
                <VisualCanvasSection problem={problem} activeModels={activeModels} canvasItems={analysisData.canvasItems} />
              </SectionWrapper>
            </section>

            {/* Pro/Con Board */}
            <section>
              <SectionWrapper
                icon={<Scale className="h-5 w-5 text-purple-600" />}
                title={userMode === "QuickThinker" ? "Pros & Cons" : "Pro/Con Analysis"}
                sectionKey="proCon"
                isExpanded={sectionsExpanded.proCon}
                onToggle={() => toggleSection("proCon")}
                modelsUsed={userMode === "OverThinker" ? analysisData.proConAnalysis?.modelsUsed : []}
              >
                <ProConBoardSection problem={problem} proConAnalysis={analysisData.proConAnalysis} />
              </SectionWrapper>
            </section>

            {/* Question Board */}
            <section>
              <SectionWrapper
                icon={<MessageSquare className="h-5 w-5 text-pink-600" />}
                title={userMode === "QuickThinker" ? "Deep Questions" : "Soul-Provoking Questions"}
                sectionKey="questions"
                isExpanded={sectionsExpanded.questions}
                onToggle={() => toggleSection("questions")}
                modelsUsed={userMode === "OverThinker" ? analysisData.soulProvokingQuestions?.modelsUsed : []}
              >
                <QuestionBoardSection problem={problem} soulProvokingQuestions={analysisData.soulProvokingQuestions} />
              </SectionWrapper>
            </section>

            {/* Active Mental Models - Only show for OverThinker */}
            {userMode === "OverThinker" && activeModels.length > 0 && (
              <section>
                <SectionWrapper
                  icon={
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  }
                  title="Your Selected Mental Models"
                  sectionKey="models"
                  isExpanded={sectionsExpanded.models}
                  onToggle={() => toggleSection("models")}
                  badge={`${activeModels.length} active`}
                >
                  <SelectedModelsSection activeModels={activeModels} />
                </SectionWrapper>
              </section>
            )}

            {/* Decision Simulator */}
            <section>
              <SectionWrapper
                icon={<TrendingUp className="h-5 w-5 text-green-600" />}
                title={userMode === "QuickThinker" ? "Decision Test" : "Decision Simulator"}
                sectionKey="simulator"
                isExpanded={sectionsExpanded.simulator}
                onToggle={() => toggleSection("simulator")}
                modelsUsed={userMode === "OverThinker" ? analysisData.decisionSimulator?.modelsUsed : []}
              >
                <DecisionSimulatorSection problem={problem} decisionSimulator={analysisData.decisionSimulator} />
              </SectionWrapper>
            </section>

            {/* Case Studies */}
            <section>
              <SectionWrapper
                icon={<AlertTriangle className="h-5 w-5 text-orange-600" />}
                title={userMode === "QuickThinker" ? "Real Examples" : "Relevant Case Studies"}
                sectionKey="caseStudies"
                isExpanded={sectionsExpanded.caseStudies}
                onToggle={() => toggleSection("caseStudies")}
              >
                <CaseStudiesSection caseStudies={analysisData.caseStudies} problem={problem} />
              </SectionWrapper>
            </section>

            {/* Top Actions & New Directions - New Section */}
            <section>
              <SectionWrapper
                icon={<ListChecks className="h-5 w-5 text-blue-600" />}
                title={userMode === "QuickThinker" ? "Next Steps" : "Top Actions & New Directions"}
                sectionKey="actionDirections"
                isExpanded={sectionsExpanded.actionDirections}
                onToggle={() => toggleSection("actionDirections")}
              >
                <ActionDirectionsSection
                  topActions={analysisData.topActions || []}
                  newDirections={analysisData.newDirections || []}
                />
              </SectionWrapper>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}