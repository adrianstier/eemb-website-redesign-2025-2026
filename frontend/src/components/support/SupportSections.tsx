'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function CollapsibleSection({ id, title, defaultOpen = false, children }: {
  id: string
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen)

  return (
    <div id={id} className="border border-warm-200 rounded-lg bg-white">
      <button
        onClick={() => setIsExpanded(prev => !prev)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-warm-50 transition-colors"
      >
        <h3 className="font-medium text-warm-800">{title}</h3>
        <ChevronDown className={`w-5 h-5 text-warm-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-warm-100">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  )
}
