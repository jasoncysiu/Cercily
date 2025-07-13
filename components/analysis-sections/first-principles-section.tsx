"use client";

import React from "react";
import { Card } from "@/components/ui/card";

interface FirstPrinciplesAnalysis {
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
}

interface FirstPrinciplesSectionProps {
  firstPrinciplesAnalysis: FirstPrinciplesAnalysis;
}

export function FirstPrinciplesSection({ firstPrinciplesAnalysis }: FirstPrinciplesSectionProps) {
  return (
    <div className="mt-5 space-y-5">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h4 className="font-medium text-sm mb-3">What is First Principles Thinking?</h4>
        <p className="text-sm text-gray-700">{firstPrinciplesAnalysis.explanation}</p>
      </Card>
      <Card className="p-6">
        <h4 className="font-medium text-sm mb-3">Applying First Principles to Your Problem:</h4>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-sm text-gray-800">{firstPrinciplesAnalysis.problemApplication.question1}</p>
            <p className="text-sm text-gray-600 pl-4">{firstPrinciplesAnalysis.problemApplication.answer1}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">{firstPrinciplesAnalysis.problemApplication.question2}</p>
            <p className="text-sm text-gray-600 pl-4">{firstPrinciplesAnalysis.problemApplication.answer2}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">{firstPrinciplesAnalysis.problemApplication.question3}</p>
            <p className="text-sm text-gray-600 pl-4">{firstPrinciplesAnalysis.problemApplication.answer3}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">Solution from First Principles:</p>
            <p className="text-sm text-gray-600 pl-4">{firstPrinciplesAnalysis.problemApplication.solution}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}