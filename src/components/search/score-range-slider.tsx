"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface ScoreRangeSliderProps {
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export function ScoreRangeSlider({ value, onChange }: ScoreRangeSliderProps) {
  // Convert decimal values to percentages for display
  const minPercent = Math.round(value[0] * 100)
  const maxPercent = Math.round(value[1] * 100)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="score-range" className="text-sm font-medium">
          Similarity Score
        </Label>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {minPercent}% - {maxPercent}%
        </span>
      </div>
      
      <Slider
        id="score-range"
        defaultValue={value}
        min={0}
        max={1}
        step={0.01}
        value={value}
        onValueChange={(values) => onChange(values as [number, number])}
        className="w-full"
      />
      
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  )
} 