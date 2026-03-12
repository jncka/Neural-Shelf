import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to download" }, { status: 401 })
  }

  const { slug } = await params

  const skill = await db.skill.findUnique({ where: { slug } })
  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 })
  }

  // Increment download count
  await db.skill.update({
    where: { id: skill.id },
    data: { downloadCount: { increment: 1 } },
  })

  return NextResponse.json({
    zipUrl: skill.zipUrl ?? `/api/skills/${slug}/download/file`,
    downloadCount: skill.downloadCount + 1,
  })
}
