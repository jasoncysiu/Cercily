"use client";

import React from "react";
import { CaseStudiesDetail } from "@/components/case-studies-detail";

interface CaseStudy {
  title: string;
  description: string;
  outcome: string;
  appliedModels: string;
}

interface CaseStudiesSectionProps {
  caseStudies: CaseStudy[];
  problem: string;
}

export function CaseStudiesSection({ caseStudies, problem }: CaseStudiesSectionProps) {
  return (
    <div className="mt-5">
      <CaseStudiesDetail caseStudies={caseStudies} problem={problem} />
    </div>
  );
}