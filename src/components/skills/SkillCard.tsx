import Link from "next/link"
import { Download, Star, Box } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export interface SkillCardData {
  id: string
  name: string
  slug: string
  description: string
  category: string
  tags: string[]
  downloadCount: number
  averageRating: number
  reviewCount: number
  author: {
    name: string | null
    image: string | null
  }
  aiCompatibility: string[]
}

export function SkillCard({ skill }: { skill: SkillCardData }) {
  return (
    <Link href={`/skills/${skill.slug}`}>
      <Card className="group h-full relative overflow-hidden bg-card border-border transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_10px_30px_-10px_rgba(94,255,216,0.1)] before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-primary before:opacity-0 hover:before:opacity-100 before:transition-opacity">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Top Row: Icon */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
               <Box className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Title & Category */}
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider bg-secondary/50 text-muted-foreground hover:bg-secondary border-0">
              {skill.category}
            </Badge>
          </div>
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1 font-display">
            {skill.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">
            {skill.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {skill.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] px-2 py-0.5 rounded-full font-normal hover:bg-secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Footer: Author + Stats */}
          <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
            <span>{skill.author.name ?? "Anonymous"}</span>
            <div className="flex items-center gap-3">
              {skill.reviewCount > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  {skill.averageRating.toFixed(1)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {skill.downloadCount}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
