"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface YearRangeSliderProps {
  minYear: number
  maxYear: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export function YearRangeSlider({ 
  minYear, 
  maxYear, 
  value, 
  onChange 
}: YearRangeSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="year-range" className="text-sm font-medium">
          Publication Year
        </Label>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {value[0]} - {value[1]}
        </span>
      </div>
      
      <Slider
        id="year-range"
        defaultValue={value}
        min={minYear}
        max={maxYear}
        step={1}
        value={value}
        onValueChange={(values) => onChange(values as [number, number])}
        className="w-full"
      />
      
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>{minYear}</span>
        <span>{maxYear}</span>
      </div>
    </div>
  )
} 