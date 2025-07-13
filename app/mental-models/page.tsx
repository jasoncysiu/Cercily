"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Brain, Lightbulb } from "lucide-react"
import { MentalModelLibrary, MENTAL_MODELS } from "@/components/mental-model-library"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function MentalModelsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [activeModels, setActiveModels] = useState<string[]>([]) // Add state for active models

  // Function to toggle model selection
  const handleModelToggle = (modelId: string) => {
    setActiveModels((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId],
    )
  }

  // Get unique categories from MENTAL_MODELS
  const categories = Array.from(new Set(MENTAL_MODELS.map(model => model.category))).sort()

  // Filter models based on selected category
  const filteredModels = selectedCategory === "all"
    ? MENTAL_MODELS
    : MENTAL_MODELS.filter(model => model.category === selectedCategory)

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 p-3 md:p-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <h2 className="text-lg font-semibold mb-2">Mental Model Library</h2>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
              Explore all available mental models.
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 md:p-4 space-y-4 md:space-y-6">
          <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">All Mental Models ({filteredModels.length})</h3>
                </div>
                <div className="w-full sm:w-auto">
                  <Label htmlFor="category-filter" className="sr-only">Filter by Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category-filter" className="w-full">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {/* Pass filteredModels, activeModels, and onModelToggle to MentalModelLibrary */}
                <MentalModelLibrary
                  models={filteredModels}
                  activeModels={activeModels}
                  onModelToggle={handleModelToggle} // Pass the toggle function
                />
              </div>
            </section>

            <section>
              <Card className="p-3 md:p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">What are Mental Models?</h4>
                    <p className="text-sm text-blue-800">
                      Mental models are frameworks or lenses through which we view the world. They help us understand,
                      interpret, and make decisions more effectively by simplifying complexity and revealing underlying
                      structures.
                    </p>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}