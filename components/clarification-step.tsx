"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, Lightbulb } from "lucide-react";
import { useUserMode } from "@/providers/UserModeProvider";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox

interface SubQuestion {
  id: string;
  text: string;
  type: "multiselect"; // Only multiselect for sub-questions
  options: string[];
}

interface ClarificationQuestion {
  mainId?: string; // For main topics
  mainText?: string; // For main topics
  subQuestions?: SubQuestion[]; // Nested sub-questions
  id?: string; // For the final open-ended question
  text: string; // For the final open-ended question
  type: "text" | "multiselect"; // 'text' for the final question, 'multiselect' for sub-questions
  options?: string[]; // Only for multiselect type
}

interface ClarificationStepProps {
  problem: string;
  preliminaryInsights: string[]; // Changed to string[]
  clarificationQuestions: ClarificationQuestion[];
  onRefineSubmit: (answers: Record<string, string | string[]>) => void; // Answers are now string or string[]
  onSkipRefinement: () => void;
  isLoading: boolean;
}

export function ClarificationStep({
  problem,
  preliminaryInsights,
  clarificationQuestions,
  onRefineSubmit,
  onSkipRefinement,
  isLoading,
}: ClarificationStepProps) {
  const { userMode } = useUserMode();
  // Answers will now be a map of questionId to string (for text) or string[] (for multiselect)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    // Initialize answers state with empty arrays for multiselect and empty strings for text
    const initialAnswers: Record<string, string | string[]> = {};
    clarificationQuestions.forEach(q => {
      if (q.type === "text") {
        initialAnswers[q.id!] = "";
      } else if (q.type === "multiselect") { // Initialize standalone multiselects
        initialAnswers[q.id!] = [];
      } else if (q.subQuestions) {
        q.subQuestions.forEach(subQ => {
          initialAnswers[subQ.id] = [];
        });
      }
    });
    setAnswers(initialAnswers);
  }, [clarificationQuestions]);

  const handleMultiSelectChange = (questionId: string, option: string, isChecked: boolean) => {
    setAnswers(prev => {
      const currentSelections = (prev[questionId] as string[] || []);
      if (isChecked) {
        return { ...prev, [questionId]: [...currentSelections, option] };
      } else {
        return { ...prev, [questionId]: currentSelections.filter(item => item !== option) };
      }
    });
  };

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    onRefineSubmit(answers);
  };

  let questionCounter = 0; // Initialize counter for all questions

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 p-3 md:p-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Refine Your Problem</h2>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">{problem}</p>
          </div>
        </div>
      </div>

      {/* Preliminary Insights */}
      <section className="p-3 md:p-4 flex-shrink-0">
        <div className="max-w-6xl mx-auto"> {/* Added max-w-6xl mx-auto here */}
          <Card className="p-3 md:p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Here's a summary of your problem:</h4>
                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                  {preliminaryInsights.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Clarification Questions */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 md:p-4 space-y-4 md:space-y-6">
          <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-4">
                {userMode === "QuickThinker" ? "Quick Questions" : "Help us understand better:"}
              </h3>
              <div className="space-y-8">
                {clarificationQuestions.map((q) => {
                  if (q.subQuestions) {
                    // This is a main clarification topic with sub-questions
                    // Do NOT increment questionCounter for the main topic, just format it
                    return (
                      <div key={q.mainId} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                        <h4 className="text-base font-bold text-gray-800">
                          {q.mainText}
                        </h4>
                        <div className="space-y-6">
                          {q.subQuestions.map(subQ => {
                            questionCounter++; // Increment for each sub-question
                            return (
                              <div key={subQ.id} className="space-y-2">
                                <Label htmlFor={subQ.id} className="text-sm font-bold block">
                                  {questionCounter}. {subQ.text}
                                </Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {subQ.options.map(option => (
                                    <div key={option} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${subQ.id}-${option}`}
                                        checked={(answers[subQ.id] as string[] || []).includes(option)}
                                        onCheckedChange={(checked) =>
                                          handleMultiSelectChange(subQ.id, option, !!checked)
                                        }
                                        disabled={isLoading}
                                      />
                                      <Label htmlFor={`${subQ.id}-${option}`} className="text-sm font-normal cursor-pointer">
                                        {option}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  } else if (q.type === "multiselect" || q.type === "text") {
                    questionCounter++;
                    return (
                      <div key={q.id} className="space-y-2 p-4 border rounded-lg bg-gray-50">
                        <Label htmlFor={q.id} className="text-sm font-bold block">
                          {questionCounter}. {q.text}
                        </Label>
                        {q.type === "multiselect" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options?.map(option => (
                              <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${q.id}-${option}`}
                                  checked={(answers[q.id!] as string[] || []).includes(option)}
                                  onCheckedChange={(checked) =>
                                    handleMultiSelectChange(q.id!, option, !!checked)
                                  }
                                  disabled={isLoading}
                                />
                                <Label htmlFor={`${q.id}-${option}`} className="text-sm font-normal cursor-pointer">
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                        {q.type === "text" && (
                          <Textarea
                            id={q.id}
                            value={answers[q.id!] as string || ""}
                            onChange={(e) => handleTextChange(q.id!, e.target.value)}
                            placeholder="Your additional context or thoughts..."
                            className="w-full min-h-[100px] resize-none"
                            disabled={isLoading}
                          />
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="bg-white border-t border-gray-200 p-3 md:p-4 flex-shrink-0 flex justify-end gap-2">
        <div className="max-w-6xl mx-auto w-full flex justify-end gap-2"> {/* Added max-w-6xl mx-auto w-full here */}
          <Button
            variant="outline"
            onClick={onSkipRefinement}
            disabled={isLoading}
          >
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Refining...
              </>
            ) : (
              <>
                Refine Analysis
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}