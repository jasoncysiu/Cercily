"use client";

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MENTAL_MODELS } from "@/components/mental-model-library"; // Assuming MENTAL_MODELS is still needed here for tooltips
import { useUserMode } from "@/providers/UserModeProvider"; // Import useUserMode

interface SectionWrapperProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  modelsUsed?: string[];
  children: React.ReactNode;
  sectionKey: string; // Unique key for the accordion item
  isExpanded: boolean;
  onToggle: (sectionKey: string) => void;
}

export function SectionWrapper({
  icon,
  title,
  subtitle,
  badge,
  modelsUsed,
  children,
  sectionKey,
  isExpanded,
  onToggle,
}: SectionWrapperProps) {
  const { userMode } = useUserMode(); // Get userMode from context
  const relevantModels = modelsUsed
    ? MENTAL_MODELS.filter(model => modelsUsed.includes(model.id))
    : [];

  return (
    <Accordion
      type="single"
      collapsible
      value={isExpanded ? sectionKey : ""}
      onValueChange={(val) => onToggle(sectionKey)}
    >
      <AccordionItem value={sectionKey} className="border-none">
        <AccordionTrigger className="w-full justify-between p-2 h-auto hover:bg-gray-50 hover:no-underline">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-base font-semibold">{title}</h3>
            {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
            {userMode === "OverThinker" && relevantModels.length > 0 && ( // Only show models for OverThinker
              <div className="flex flex-wrap gap-1 ml-2">
                {relevantModels.map(model => (
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
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-1 pt-0">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}