import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StarRating } from "@/components/reviews/StarRating"
import { ExportGuide } from "@/components/skills/ExportGuide"
import { ReviewSection } from "@/components/reviews/ReviewSection"
import { DownloadButton } from "@/components/skills/DownloadButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Calendar, Tag } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

async function getSkill(slug: string) {
  const skill = await db.skill.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true, username: true } },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  })
  return skill
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const skill = await getSkill(slug)
  if (!skill) return { title: "Skill Not Found" }
  return {
    title: skill.name,
    description: skill.description,
  }
}

export default async function SkillDetailPage({ params }: Props) {
  const { slug } = await params
  const skill = await getSkill(slug)

  if (!skill) notFound()

  const tags = JSON.parse(skill.tags) as string[]
  const aiCompatibility = JSON.parse(skill.aiCompatibility) as string[]
  const averageRating =
    skill.reviews.length > 0
      ? skill.reviews.reduce((sum, r) => sum + r.rating, 0) / skill.reviews.length
      : 0

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">{skill.category}</Badge>
            {aiCompatibility.map((platform) => (
              <Badge key={platform} variant="outline" className="text-xs">
                {platform}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl font-semibold mb-4 font-display">{skill.name}</h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {skill.description}
          </p>

          {/* Author */}
          <Link
            href={`/users/${skill.author.username ?? skill.author.id}`}
            className="flex items-center gap-3 mb-6 group"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={skill.author.image ?? ""} />
              <AvatarFallback>{skill.author.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium group-hover:underline">
                {skill.author.name ?? "Anonymous"}
              </p>
              <p className="text-xs text-muted-foreground">Creator</p>
            </div>
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {skill.reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(averageRating)} size="sm" />
                <span>
                  {averageRating.toFixed(1)} ({skill.reviews.length} review
                  {skill.reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {skill.downloadCount} downloads
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(skill.createdAt, "MMM d, yyyy")}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Download Card */}
        <div className="md:w-80 shrink-0">
          <div className="sticky top-24 rounded-2xl border bg-card p-6 space-y-4">
            <div className="text-center">
              <span className="text-3xl font-semibold">Free</span>
            </div>
            <DownloadButton slug={slug} />
            <p className="text-xs text-center text-muted-foreground">
              v{skill.version} &middot; ZIP package
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Export Guide, Reviews */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="export">Export Guide</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({skill.reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <div className="prose prose-neutral max-w-none">
            <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-6 rounded-xl border">
              {skill.skillMdContent}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <ExportGuide skillName={skill.name} slug={slug} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ReviewSection
            slug={slug}
            reviews={skill.reviews.map((r) => ({
              id: r.id,
              rating: r.rating,
              body: r.body,
              createdAt: r.createdAt.toISOString(),
              user: r.user,
            }))}
            averageRating={averageRating}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
