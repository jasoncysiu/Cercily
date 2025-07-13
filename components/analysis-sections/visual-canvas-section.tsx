"use client";

import React from "react";
import { VisualCanvas } from "@/components/visual-canvas";

interface VisualCanvasSectionProps {
  problem: string;
  activeModels: any[];
  canvasItems: any[];
}

export function VisualCanvasSection({ problem, activeModels, canvasItems }: VisualCanvasSectionProps) {
  return (
    <div className="mt-5">
      <VisualCanvas problem={problem} activeModels={activeModels} canvasItems={canvasItems} />
    </div>
  );
}