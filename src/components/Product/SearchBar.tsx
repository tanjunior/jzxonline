'use client'

import { useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import type React from 'react' // Added import for React

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = useCallback(() => {
    onChange('')
    inputRef.current?.focus()
  }, [onChange])

  return (
    <form className="relative w-full">
      <Input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10"
        ref={inputRef}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => value && handleClear}
        className="absolute right-0 top-0 h-full px-3"
      >
        {value ? (
          <X size={20} className="text-muted-foreground" />
        ) : (
          <Search size={20} className="text-muted-foreground" />
        )}
        <span className="sr-only">{value ? 'Clear search' : 'Search'}</span>
      </Button>
    </form>
  )
}
