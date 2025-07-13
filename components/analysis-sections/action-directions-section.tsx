"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { ListChecks, Lightbulb } from "lucide-react";

interface ActionDirectionsSectionProps {
  topActions: string[];
  newDirections: string[];
}

export function ActionDirectionsSection({ topActions, newDirections }: ActionDirectionsSectionProps) {
  return (
    <div className="mt-5 space-y-5">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-3 mb-4">
          <ListChecks className="h-5 w-5 text-blue-600 mt-0.5" />
          <h4 className="font-medium text-base">Top 3 Actions to Take Now</h4>
        </div>
        <ul className="space-y-3 list-disc pl-5 text-sm text-gray-700">
          {topActions.length > 0 ? (
            topActions.map((action, index) => (
              <li key={index}>{action}</li>
            ))
          ) : (
            <li>No specific actions suggested at this time.</li>
          )}
        </ul>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <div className="flex items-start gap-3 mb-4">
          <Lightbulb className="h-5 w-5 text-orange-600 mt-0.5" />
          <h4 className="font-medium text-base">3 New Directions / Considerations</h4>
        </div>
        <ul className="space-y-3 list-disc pl-5 text-sm text-gray-700">
          {newDirections.length > 0 ? (
            newDirections.map((direction, index) => (
              <li key={index}>{direction}</li>
            ))
          ) : (
            <li>No new directions suggested at this time.</li>
          )}
        </ul>
      </Card>
    </div>
  );
}