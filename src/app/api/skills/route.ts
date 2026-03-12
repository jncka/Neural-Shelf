import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { Prisma } from "@/generated/prisma/client"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get("q") ?? ""
  const category = searchParams.get("category") ?? ""
  const sort = searchParams.get("sort") ?? "newest"
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const limit = 12

  const where: Prisma.SkillWhereInput = {}

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
    ]
  }

  if (category) {
    where.category = { equals: category }
  }

  let orderBy: Prisma.SkillOrderByWithRelationInput
  switch (sort) {
    case "popular":
      orderBy = { downloadCount: "desc" }
      break
    default:
      orderBy = { createdAt: "desc" }
  }

  const [skills, total] = await Promise.all([
    db.skill.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: { select: { name: true, image: true } },
        reviews: { select: { rating: true } },
      },
    }),
    db.skill.count({ where }),
  ])

  const data = skills.map((s) => ({
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
    author: s.author,
    aiCompatibility: JSON.parse(s.aiCompatibility),
  }))

  return NextResponse.json({
    skills: data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
