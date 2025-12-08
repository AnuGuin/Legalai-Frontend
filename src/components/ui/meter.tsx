"use client"

import * as React from "react"
import { Meter as BaseMeter } from '@base-ui-components/react/meter'
import { cn } from "@/lib/utils"

interface MeterProps {
  value: number
  max?: number
  label?: string
  className?: string
}

export function Meter({ value, max = 100, label, className }: MeterProps) {
  return (
    <BaseMeter.Root value={value} max={max} className={cn("flex flex-col gap-2 w-full", className)}>
      {label && (
        <div className="flex justify-between text-xs font-medium">
          <BaseMeter.Label className="text-zinc-400">{label}</BaseMeter.Label>
          <span className="text-zinc-400">
            {value} / {max}
          </span>
        </div>
      )}
      <BaseMeter.Track className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
        <BaseMeter.Indicator className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-in-out" />
      </BaseMeter.Track>
    </BaseMeter.Root>
  )
}