"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants"
import { Search } from "lucide-react"
import { useCallback, useState } from "react"

export function SkillFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const currentCategory = searchParams.get("category") ?? ""
  const currentSort = searchParams.get("sort") ?? "newest"

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`/skills?${params.toString()}`)
    },
    [router, searchParams]
  )

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateFilter("q", query)
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </form>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium mb-3">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter("category", "")}
            className={`block w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
              !currentCategory
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter("category", cat.toLowerCase())}
              className={`block w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                currentCategory === cat.toLowerCase()
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-sm font-medium mb-3">Sort by</h3>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("sort", opt.value)}
              className={`block w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                currentSort === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
