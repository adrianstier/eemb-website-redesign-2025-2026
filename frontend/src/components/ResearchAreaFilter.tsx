'use client'

import { useState, useCallback, useId } from 'react'
import type { ResearchArea, Database } from '@/lib/supabase/types'

type ResearchCategory = Database['public']['Enums']['research_category']

const categoryLabels: Record<ResearchCategory | 'All', string> = {
  'All': 'All Areas',
  'Ecology': 'Ecology',
  'Evolution': 'Evolution',
  'Marine Biology': 'Marine Biology',
  'Molecular Biology': 'Molecular Biology',
  'Conservation': 'Conservation',
  'Climate Science': 'Climate Science',
  'Microbiology': 'Microbiology',
  'Genomics': 'Genomics',
  'Physiology': 'Physiology',
  'Biodiversity': 'Biodiversity',
  'Other': 'Other',
}

const categoryColors: Record<ResearchCategory, string> = {
  'Ecology': 'bg-kelp-500',
  'Evolution': 'bg-ocean-blue',
  'Marine Biology': 'bg-ocean-teal',
  'Molecular Biology': 'bg-bioluminescent',
  'Conservation': 'bg-kelp-600',
  'Climate Science': 'bg-ocean-blue',
  'Microbiology': 'bg-ocean-teal',
  'Genomics': 'bg-bioluminescent',
  'Physiology': 'bg-ucsb-gold',
  'Biodiversity': 'bg-kelp-500',
  'Other': 'bg-warm-400',
}

interface ResearchAreaFilterProps {
  areas: ResearchArea[]
  selectedAreas?: string[]
  onFilterChange?: (selectedAreas: string[]) => void
  selectedCategory?: ResearchCategory | 'All'
  onCategoryChange?: (category: ResearchCategory | 'All') => void
  variant?: 'pills' | 'checkboxes' | 'dropdown'
  showCounts?: boolean
  className?: string
}

export default function ResearchAreaFilter({
  areas,
  selectedAreas = [],
  onFilterChange,
  selectedCategory = 'All',
  onCategoryChange,
  variant = 'pills',
  showCounts = true,
  className = '',
}: ResearchAreaFilterProps) {
  const [localSelectedAreas, setLocalSelectedAreas] = useState<string[]>(selectedAreas)
  const [localCategory, setLocalCategory] = useState<ResearchCategory | 'All'>(selectedCategory)
  const filterId = useId()

  // Get unique categories from areas
  const categories = Array.from(
    new Set(areas.map((a) => a.category).filter((c): c is ResearchCategory => c !== null))
  )

  // Count areas per category
  const categoryCounts = areas.reduce((acc, area) => {
    const cat = area.category || 'Other'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Filter areas by selected category
  const filteredAreas = localCategory === 'All'
    ? areas
    : areas.filter((a) => a.category === localCategory)

  const handleAreaToggle = useCallback((areaId: string) => {
    const newSelected = localSelectedAreas.includes(areaId)
      ? localSelectedAreas.filter((id) => id !== areaId)
      : [...localSelectedAreas, areaId]

    setLocalSelectedAreas(newSelected)
    onFilterChange?.(newSelected)
  }, [localSelectedAreas, onFilterChange])

  const handleCategoryChange = useCallback((category: ResearchCategory | 'All') => {
    setLocalCategory(category)
    onCategoryChange?.(category)
  }, [onCategoryChange])

  const clearAll = useCallback(() => {
    setLocalSelectedAreas([])
    setLocalCategory('All')
    onFilterChange?.([])
    onCategoryChange?.('All')
  }, [onFilterChange, onCategoryChange])

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <label htmlFor={filterId} className="sr-only">
          Filter by research area
        </label>
        <select
          id={filterId}
          value={localCategory}
          onChange={(e) => handleCategoryChange(e.target.value as ResearchCategory | 'All')}
          className="w-full px-4 py-3 rounded-xl border border-warm-200 bg-white text-ocean-deep font-medium focus:outline-none focus:ring-2 focus:ring-ocean-teal/50 focus:border-ocean-teal appearance-none cursor-pointer"
        >
          <option value="All">All Research Areas</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabels[cat]} {showCounts && `(${categoryCounts[cat] || 0})`}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    )
  }

  if (variant === 'checkboxes') {
    return (
      <fieldset className={className}>
        <legend className="sr-only">Filter by research areas</legend>

        {/* Category filters */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-ocean-deep mb-2">Categories</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('All')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                localCategory === 'All'
                  ? 'bg-ocean-teal text-white'
                  : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  localCategory === cat
                    ? 'bg-ocean-teal text-white'
                    : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                }`}
              >
                {categoryLabels[cat]}
                {showCounts && (
                  <span className="ml-1 text-xs opacity-70">({categoryCounts[cat] || 0})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Area checkboxes */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-ocean-deep mb-2">Specific Areas</p>
          {filteredAreas.map((area) => (
            <label
              key={area.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={localSelectedAreas.includes(area.id.toString())}
                onChange={() => handleAreaToggle(area.id.toString())}
                className="w-4 h-4 rounded border-warm-300 text-ocean-teal focus:ring-ocean-teal/50"
              />
              <span className="text-warm-700 group-hover:text-ocean-deep transition-colors">
                {area.name}
              </span>
              {area.category && (
                <span className={`w-2 h-2 rounded-full ${categoryColors[area.category]}`} />
              )}
            </label>
          ))}
        </div>

        {/* Clear button */}
        {(localSelectedAreas.length > 0 || localCategory !== 'All') && (
          <button
            onClick={clearAll}
            className="mt-4 text-sm text-ocean-teal hover:underline"
          >
            Clear all filters
          </button>
        )}
      </fieldset>
    )
  }

  // Default: pills variant
  return (
    <div className={className} role="group" aria-label="Research area filters">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleCategoryChange('All')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            localCategory === 'All'
              ? 'bg-gradient-to-r from-ocean-teal to-bioluminescent text-white shadow-md'
              : 'bg-white border border-warm-200 text-warm-600 hover:border-ocean-teal/30 hover:text-ocean-teal'
          }`}
          aria-pressed={localCategory === 'All'}
        >
          All Areas
          {showCounts && (
            <span className="ml-1.5 text-xs opacity-80">({areas.length})</span>
          )}
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              localCategory === cat
                ? 'bg-gradient-to-r from-ocean-teal to-bioluminescent text-white shadow-md'
                : 'bg-white border border-warm-200 text-warm-600 hover:border-ocean-teal/30 hover:text-ocean-teal'
            }`}
            aria-pressed={localCategory === cat}
          >
            {categoryLabels[cat]}
            {showCounts && (
              <span className="ml-1.5 text-xs opacity-80">({categoryCounts[cat] || 0})</span>
            )}
          </button>
        ))}
      </div>

      {/* Individual area pills (when a category is selected) */}
      {localCategory !== 'All' && (
        <div className="flex flex-wrap gap-2">
          {filteredAreas.map((area) => {
            const isSelected = localSelectedAreas.includes(area.id.toString())
            return (
              <button
                key={area.id}
                onClick={() => handleAreaToggle(area.id.toString())}
                className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                  isSelected
                    ? 'bg-ocean-deep text-white'
                    : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                }`}
                aria-pressed={isSelected}
              >
                {area.name}
              </button>
            )
          })}
        </div>
      )}

      {/* Active filter count */}
      {localSelectedAreas.length > 0 && (
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-warm-200">
          <span className="text-sm text-warm-500">
            {localSelectedAreas.length} area{localSelectedAreas.length !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={clearAll}
            className="text-sm text-ocean-teal hover:underline font-medium"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
