import { Suspense } from "react"
import { db } from "@/lib/db"
import { SkillGrid } from "@/components/skills/SkillGrid"
import { SkillFilters } from "@/components/skills/SkillFilters"
import { buttonVariants } from "@/components/ui/button-variants"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Metadata } from "next"
import { Prisma } from "@/generated/prisma/client"

export const metadata: Metadata = {
  title: "Browse Skills",
  description: "Discover and download Agent Skills for Claude and other AI platforms.",
}

interface Props {
  searchParams: Promise<{
    q?: string
    category?: string
    sort?: string
    page?: string
  }>
}

async function getSkills(searchParams: Awaited<Props["searchParams"]>) {
  const q = searchParams.q ?? ""
  const category = searchParams.category ?? ""
  const sort = searchParams.sort ?? "newest"
  const page = Math.max(1, parseInt(searchParams.page ?? "1"))
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

  return {
    skills: skills.map((s) => ({
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
      author: s.author,
      aiCompatibility: JSON.parse(s.aiCompatibility) as string[],
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export default async function BrowsePage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const { skills, total, page, totalPages } = await getSkills(resolvedParams)

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold font-display mb-2">Browse Skills</h1>
        <p className="text-muted-foreground">
          {total} skill{total !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-56 shrink-0">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <SkillFilters />
          </Suspense>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <SkillGrid skills={skills} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && (
                <Link
                  href={`/skills?${new URLSearchParams({
                    ...resolvedParams,
                    page: String(page - 1),
                  }).toString()}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Link>
              )}
              <span className="text-sm text-muted-foreground px-4">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/skills?${new URLSearchParams({
                    ...resolvedParams,
                    page: String(page + 1),
                  }).toString()}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
