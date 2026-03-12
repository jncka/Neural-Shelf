"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CATEGORIES, AI_PLATFORMS } from "@/lib/constants"
import { Upload, Check, AlertCircle, Loader2, X } from "lucide-react"

type Step = "upload" | "details" | "review"

export function UploadForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("upload")
  const [skillMdContent, setSkillMdContent] = useState("")
  const [fileName, setFileName] = useState("")
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Form fields
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [aiCompatibility, setAiCompatibility] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setSkillMdContent(content)

      // Basic client-side validation
      const errors: string[] = []
      if (!content.startsWith("---")) {
        errors.push("SKILL.md must start with YAML frontmatter (---)")
      }
      const match = content.match(/^---\s*\n[\s\S]*?\n---/)
      if (!match) {
        errors.push("Missing closing --- delimiter for frontmatter")
      }
      setValidationErrors(errors)

      if (errors.length === 0) {
        // Try to extract name from frontmatter
        const nameMatch = content.match(/name:\s*(.+)/)
        if (nameMatch) {
          setName(nameMatch[1].trim().replace(/^['"]|['"]$/g, ""))
        }
        const descMatch = content.match(/description:\s*\n?\s*(.+)/)
        if (descMatch) {
          setDescription(descMatch[1].trim().replace(/^['"]|['"]$/g, ""))
        }
      }
    }
    reader.readAsText(file)
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag])
      setTagInput("")
    }
  }

  function togglePlatform(platform: string) {
    setAiCompatibility((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/skills/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          category,
          tags,
          aiCompatibility,
          skillMdContent,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : data.details?.join(", ") ?? "Upload failed"
        )
        return
      }

      router.push(`/skills/${data.slug}`)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        {(["upload", "details", "review"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="w-8 h-px bg-border" />}
            <span
              className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-medium ${
                step === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>
            <span className={step === s ? "font-medium text-foreground" : ""}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Upload SKILL.md */}
      {step === "upload" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-medium">Upload SKILL.md</h2>
            <p className="text-sm text-muted-foreground">
              Your skill must include a SKILL.md file with YAML frontmatter containing
              a name and description.
            </p>

            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 cursor-pointer hover:border-primary/40 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mb-3" />
              <span className="text-sm font-medium">
                {fileName || "Click to upload SKILL.md"}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                Markdown file with YAML frontmatter
              </span>
              <input
                type="file"
                accept=".md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {validationErrors.length > 0 && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <ul className="space-y-1">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {skillMdContent && validationErrors.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <Check className="h-4 w-4" />
                SKILL.md validated successfully
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setStep("details")}
                disabled={!skillMdContent || validationErrors.length > 0}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Details */}
      {step === "details" && (
        <Card>
          <CardContent className="p-6 space-y-5">
            <h2 className="font-medium">Skill Details</h2>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Skill" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this skill do?"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">AI Compatibility</label>
              <div className="flex flex-wrap gap-2">
                {AI_PLATFORMS.map((platform) => (
                  <Button
                    key={platform}
                    type="button"
                    variant={aiCompatibility.includes(platform) ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePlatform(platform)}
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep("upload")}>
                Back
              </Button>
              <Button
                onClick={() => setStep("review")}
                disabled={!name || !description || !category}
              >
                Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Submit */}
      {step === "review" && (
        <Card>
          <CardContent className="p-6 space-y-5">
            <h2 className="font-medium">Review & Publish</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="secondary">{category}</Badge>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Tags</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                  {tags.length === 0 && <span className="text-muted-foreground">None</span>}
                </div>
              </div>
              <div className="py-2 border-b">
                <span className="text-muted-foreground block mb-2">Description</span>
                <p className="text-foreground">{description}</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep("details")}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Publish Skill
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
