"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  max?: number
  min?: number
  step?: number
  className?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, max = 100, min = 0, step = 1, ...props }, ref) => (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([Number.parseInt(e.target.value)])}
      className={cn("w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider", className)}
      {...props}
    />
  ),
)
Slider.displayName = "Slider"

export { Slider }
