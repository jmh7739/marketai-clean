"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps {
  id?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
  disabled?: boolean
  children?: React.ReactNode
}

const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, id, disabled = false, children }, ref) => {
    const handleToggle = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        handleToggle()
      }
    }

    return (
      <div className="flex items-center space-x-2">
        <div
          ref={ref}
          id={id}
          role="checkbox"
          aria-checked={checked}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "h-4 w-4 rounded-sm border border-gray-300 bg-white flex items-center justify-center cursor-pointer transition-colors",
            "hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            checked && "bg-blue-600 border-blue-600",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
        >
          {checked && <Check className="h-3 w-3 text-white" />}
        </div>
        {children && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none cursor-pointer select-none"
            onClick={handleToggle}
          >
            {children}
          </label>
        )}
      </div>
    )
  },
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
