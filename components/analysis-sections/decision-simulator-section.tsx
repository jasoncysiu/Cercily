"use client";

import React from "react";
import { DecisionSimulator } from "@/components/decision-simulator";

interface DecisionSimulatorSectionProps {
  problem: string;
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
}

export function DecisionSimulatorSection({ problem, decisionSimulator }: DecisionSimulatorSectionProps) {
  return (
    <div className="mt-5">
      <DecisionSimulator problem={problem} decisionSimulator={decisionSimulator} />
    </div>
  );
}