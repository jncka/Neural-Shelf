import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const skill = await db.skill.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true, username: true, bio: true } },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 })
  }

  return NextResponse.json({
    ...skill,
    tags: JSON.parse(skill.tags),
    previewImages: JSON.parse(skill.previewImages),
    aiCompatibility: JSON.parse(skill.aiCompatibility),
    averageRating:
      skill.reviews.length > 0
        ? skill.reviews.reduce((sum, r) => sum + r.rating, 0) / skill.reviews.length
        : 0,
  })
}
