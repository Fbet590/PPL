"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const BUDGET_MIN = 7000
export const BUDGET_MAX = 30000
export const BUDGET_STEP = 1000

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function formatBudget(value: number): string {
  const formatted = currencyFormatter.format(value)
  return value >= BUDGET_MAX ? `${formatted}+` : formatted
}

const clamp = (value: number) => Math.min(BUDGET_MAX, Math.max(BUDGET_MIN, value))

const snap = (value: number) =>
  clamp(Math.round((value - BUDGET_MIN) / BUDGET_STEP) * BUDGET_STEP + BUDGET_MIN)

interface BudgetSliderProps {
  value: number
  onChange: (value: number) => void
  className?: string
}

export function BudgetSlider({ value, onChange, className }: BudgetSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const percent = ((value - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      const next = snap(BUDGET_MIN + ratio * (BUDGET_MAX - BUDGET_MIN))
      if (next !== value) onChange(next)
    },
    [onChange, value],
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
    updateFromPointer(event.clientX)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    updateFromPointer(event.clientX)
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setIsDragging(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = value + BUDGET_STEP
        break
      case "ArrowLeft":
      case "ArrowDown":
        next = value - BUDGET_STEP
        break
      case "PageUp":
        next = value + BUDGET_STEP * 5
        break
      case "PageDown":
        next = value - BUDGET_STEP * 5
        break
      case "Home":
        next = BUDGET_MIN
        break
      case "End":
        next = BUDGET_MAX
        break
    }
    if (next === null) return
    event.preventDefault()
    onChange(clamp(next))
  }

  return (
    <div className={cn("w-full select-none", className)}>
      {/* Live value label that follows the handle without overflowing the edges */}
      <div className="relative h-12 mb-2 px-3.5">
        <div className="relative h-full">
          <div
            className="absolute top-0 whitespace-nowrap"
            style={{ left: `${percent}%`, transform: `translateX(-${percent}%)` }}
          >
            <span
              aria-live="polite"
              className="font-[family-name:var(--font-poppins)] text-3xl font-extrabold leading-none text-accent tabular-nums"
            >
              {formatBudget(value)}
            </span>
          </div>
        </div>
      </div>

      {/* Track area; horizontal padding leaves room for the handle at both ends */}
      <div
        className="group relative h-8 px-3.5 touch-none cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className="relative h-full">
          <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div
            role="slider"
            tabIndex={0}
            aria-label="Project budget"
            aria-valuemin={BUDGET_MIN}
            aria-valuemax={BUDGET_MAX}
            aria-valuenow={value}
            aria-valuetext={formatBudget(value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "absolute top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-white",
              "shadow-md transition-[box-shadow,transform] duration-150",
              "hover:scale-110 hover:shadow-lg group-hover:shadow-lg",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30",
              isDragging && "scale-110 shadow-xl cursor-grabbing",
            )}
            style={{ left: `${percent}%` }}
          />
        </div>
      </div>

      <div className="mt-1 flex justify-between text-xs font-medium text-muted-foreground">
        <span>{formatBudget(BUDGET_MIN)}</span>
        <span>{formatBudget(BUDGET_MAX)}</span>
      </div>
    </div>
  )
}
