"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Lightbulb, Target, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MENTAL_MODELS } from "@/components/mental-model-library"; // Assuming MENTAL_MODELS is needed here for tooltips
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface InsightsSectionProps {
  aiInsights: string;
  insightsModelsUsed: string[];
  keyFactors: string[];
  keyFactorsModelsUsed: string[];
  recommendation: string;
  recommendationModelsUsed: string[];
}

export function InsightsSection({
  aiInsights,
  insightsModelsUsed,
  keyFactors,
  keyFactorsModelsUsed,
  recommendation,
  recommendationModelsUsed,
}: InsightsSectionProps) {
  return (
    <div className="mt-5 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start gap-3 mb-2">
            <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5" />
            <h4 className="font-medium text-sm">Key Insights</h4>
          </div>
          <p className="text-sm text-gray-700">{aiInsights}</p>
          {insightsModelsUsed && insightsModelsUsed.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {MENTAL_MODELS.filter(model => insightsModelsUsed.includes(model.id)).map(model => (
                <Tooltip key={model.id}>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 cursor-help">
                      {model.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-wrap">
                    {model.description}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}
        </Card>

        {recommendation && (
          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-start gap-3 mb-2">
              <Target className="h-4 w-4 text-green-600 mt-0.5" />
              <h4 className="font-medium text-sm">AI Recommendation</h4>
            </div>
            <p className="text-sm text-gray-700">{recommendation}</p>
            {recommendationModelsUsed && recommendationModelsUsed.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {MENTAL_MODELS.filter(model => recommendationModelsUsed.includes(model.id)).map(model => (
                  <Tooltip key={model.id}>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 cursor-help">
                        {model.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-wrap">
                      {model.description}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {keyFactors.length > 0 && (
        <Card className="p-6">
          <h4 className="font-medium text-sm mb-3">Critical Factors for Your Decision:</h4>
          <div className="flex flex-wrap gap-2">
            {keyFactors.map((factor, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {factor}
              </Badge>
            ))}
          </div>
          {keyFactorsModelsUsed && keyFactorsModelsUsed.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {MENTAL_MODELS.filter(model => keyFactorsModelsUsed.includes(model.id)).map(model => (
                <Tooltip key={model.id}>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 cursor-help">
                      {model.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-wrap">
                    {model.description}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}
        </Card>
      )}

      <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full w-fit mx-auto mt-3">
        <Sparkles className="h-3 w-3" />
        Powered by Cercily AI
      </div>
    </div>
  );
}