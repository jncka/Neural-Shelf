export const CATEGORIES = [
  "Development",
  "Writing",
  "Design",
  "Data",
  "Marketing",
  "Productivity",
  "Education",
  "Business",
] as const

export type Category = (typeof CATEGORIES)[number]

export const AI_PLATFORMS = [
  "Claude.ai",
  "Claude Code",
  "Anthropic API",
] as const

export type AIPlatform = (typeof AI_PLATFORMS)[number]

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Most Popular", value: "popular" },
  { label: "Highest Rated", value: "rating" },
] as const
