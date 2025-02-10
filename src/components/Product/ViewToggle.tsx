'use client'

import { useCallback } from 'react'
import { List, Grid } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ViewMode } from './ProductList'

type ViewToggleProps = {
  value: ViewMode
  onChange: (value: ViewMode) => void
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  const handleChange = useCallback(
    (newValue: string) => {
      if (newValue) {
        onChange(newValue as ViewMode)
      }
    },
    [onChange],
  )

  return (
    <ToggleGroup type="single" value={value} onValueChange={handleChange}>
      <ToggleGroupItem value="grid" aria-label="Grid View">
        <Grid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List View">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
