"use client";

import React from "react";
import { ProConBoard } from "@/components/pro-con-board";

interface ProConBoardSectionProps {
  problem: string;
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
}

export function ProConBoardSection({ problem, proConAnalysis }: ProConBoardSectionProps) {
  return (
    <div className="mt-5">
      <ProConBoard problem={problem} proConAnalysis={proConAnalysis} />
    </div>
  );
}