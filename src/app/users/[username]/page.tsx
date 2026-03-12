import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SkillGrid } from "@/components/skills/SkillGrid"
import { Calendar, Download } from "lucide-react"
import { format } from "date-fns"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ username: string }>
}

async function getUser(username: string) {
  const user = await db.user.findFirst({
    where: { OR: [{ username }, { id: username }] },
    include: {
      skills: {
        orderBy: { downloadCount: "desc" },
        include: {
          author: { select: { name: true, image: true } },
          reviews: { select: { rating: true } },
        },
      },
    },
  })
  return user
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const user = await getUser(username)
  if (!user) return { title: "User Not Found" }
  return {
    title: user.name ?? user.username ?? "Creator Profile",
    description: user.bio ?? `Check out ${user.name}'s skills on NeuralShelf.`,
  }
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params
  const user = await getUser(username)

  if (!user) notFound()

  const skills = user.skills.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    category: s.category,
    tags: JSON.parse(s.tags) as string[],
    downloadCount: s.downloadCount,
    averageRating:
      s.reviews.length > 0
        ? s.reviews.reduce((sum, r) => sum + r.rating, 0) / s.reviews.length
        : 0,
    reviewCount: s.reviews.length,
    author: { name: user.name, image: user.image },
    aiCompatibility: JSON.parse(s.aiCompatibility) as string[],
  }))

  const totalDownloads = skills.reduce((sum, s) => sum + s.downloadCount, 0)

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Profile Header */}
      <div className="flex items-start gap-6 mb-12">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.image ?? ""} />
          <AvatarFallback className="text-2xl">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-semibold font-display mb-1">
            {user.name ?? "Anonymous Creator"}
          </h1>
          {user.username && (
            <p className="text-muted-foreground mb-3">@{user.username}</p>
          )}
          {user.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-lg">
              {user.bio}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {format(user.createdAt, "MMM yyyy")}
            </span>
            <Badge variant="secondary">{skills.length} skills</Badge>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {totalDownloads.toLocaleString()} downloads
            </span>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <h2 className="text-xl font-semibold mb-6">Published Skills</h2>
      <SkillGrid skills={skills} />
    </div>
  )
}
