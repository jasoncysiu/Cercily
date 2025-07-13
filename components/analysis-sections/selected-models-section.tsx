"use client";

import React from "react";
import { MentalModelCard } from "@/components/mental-model-card";
import { MENTAL_MODELS } from "@/components/mental-model-library";

interface SelectedModelsSectionProps {
  activeModels: string[];
}

export function SelectedModelsSection({ activeModels }: SelectedModelsSectionProps) {
  const activeModelData = MENTAL_MODELS.filter((model) => activeModels.includes(model.id));

  if (activeModelData.length === 0) {
    return null; // Don't render if no models are active
  }

  return (
    <div className="mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {activeModelData.map((model) => (
          <MentalModelCard key={model.id} model={model} isActive={true} />
        ))}
      </div>
    </div>
  );
}