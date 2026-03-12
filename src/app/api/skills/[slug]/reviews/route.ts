import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  body: z.string().max(2000).optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const skill = await db.skill.findUnique({
    where: { slug },
    select: { id: true },
  })

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 })
  }

  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") ?? "1"))
  const limit = 10

  const [reviews, total] = await Promise.all([
    db.review.findMany({
      where: { skillId: skill.id },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.review.count({ where: { skillId: skill.id } }),
  ])

  return NextResponse.json({ reviews, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to review" }, { status: 401 })
  }

  const { slug } = await params
  const skill = await db.skill.findUnique({ where: { slug }, select: { id: true, authorId: true } })
  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 })
  }

  if (skill.authorId === session.user.id) {
    return NextResponse.json({ error: "Cannot review your own skill" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 })
  }

  const review = await db.review.upsert({
    where: { skillId_userId: { skillId: skill.id, userId: session.user.id } },
    update: { rating: parsed.data.rating, body: parsed.data.body ?? null },
    create: {
      skillId: skill.id,
      userId: session.user.id,
      rating: parsed.data.rating,
      body: parsed.data.body ?? null,
    },
  })

  return NextResponse.json(review, { status: 201 })
}
