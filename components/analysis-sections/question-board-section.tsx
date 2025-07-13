"use client";

import React from "react";
import { QuestionBoard } from "@/components/question-board";

interface QuestionBoardSectionProps {
  problem: string;
  soulProvokingQuestions: {
    yesQuestions: string[];
    noQuestions: string[];
    modelsUsed: string[];
  };
}

export function QuestionBoardSection({ problem, soulProvokingQuestions }: QuestionBoardSectionProps) {
  return (
    <div className="mt-5">
      <QuestionBoard problem={problem} soulProvokingQuestions={soulProvokingQuestions} />
    </div>
  );
}