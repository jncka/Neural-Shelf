import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  // Try to find by username first, then by id
  const user = await db.user.findFirst({
    where: {
      OR: [{ username }, { id: username }],
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      createdAt: true,
      skills: {
        orderBy: { downloadCount: "desc" },
        include: {
          reviews: { select: { rating: true } },
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const skills = user.skills.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    category: s.category,
    tags: JSON.parse(s.tags),
    downloadCount: s.downloadCount,
    averageRating:
      s.reviews.length > 0
        ? s.reviews.reduce((sum, r) => sum + r.rating, 0) / s.reviews.length
        : 0,
    reviewCount: s.reviews.length,
    aiCompatibility: JSON.parse(s.aiCompatibility),
  }))

  return NextResponse.json({
    id: user.id,
    name: user.name,
    username: user.username,
    image: user.image,
    bio: user.bio,
    createdAt: user.createdAt,
    skills,
    totalDownloads: skills.reduce((sum, s) => sum + s.downloadCount, 0),
  })
}
