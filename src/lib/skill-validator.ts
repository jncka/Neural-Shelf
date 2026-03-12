import yaml from "js-yaml"
import { z } from "zod"

const frontmatterSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  description: z.string().min(1, "Skill description is required"),
})

export type SkillFrontmatter = z.infer<typeof frontmatterSchema>

export interface ValidationResult {
  valid: boolean
  frontmatter?: SkillFrontmatter
  content?: string
  errors?: string[]
}

export function validateSkillMd(raw: string): ValidationResult {
  const errors: string[] = []

  // Check for frontmatter delimiters
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (!match) {
    return {
      valid: false,
      errors: ["SKILL.md must start with YAML frontmatter between --- delimiters"],
    }
  }

  const [, yamlBlock, content] = match

  // Parse YAML
  let parsed: unknown
  try {
    parsed = yaml.load(yamlBlock)
  } catch {
    return {
      valid: false,
      errors: ["Invalid YAML in frontmatter"],
    }
  }

  // Validate frontmatter fields
  const result = frontmatterSchema.safeParse(parsed)
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues.map((i) => i.message),
    }
  }

  if (!content || content.trim().length < 10) {
    errors.push("SKILL.md body must contain meaningful instructions (at least 10 characters)")
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    frontmatter: result.data,
    content: content.trim(),
  }
}
