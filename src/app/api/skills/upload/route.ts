import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { validateSkillMd } from "@/lib/skill-validator"
import { z } from "zod"
import AdmZip from "adm-zip"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const uploadSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10).max(2000),
  category: z.string().min(1),
  tags: z.array(z.string()).max(10),
  aiCompatibility: z.array(z.string()),
  skillMdContent: z.string().min(1),
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to upload" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = uploadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 })
  }

  // Validate SKILL.md content
  const validation = validateSkillMd(parsed.data.skillMdContent)
  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid SKILL.md", details: validation.errors },
      { status: 400 }
    )
  }

  // Generate slug
  let slug = slugify(parsed.data.name)
  const existing = await db.skill.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  // Create ZIP package
  const zip = new AdmZip()
  zip.addFile("SKILL.md", Buffer.from(parsed.data.skillMdContent, "utf-8"))

  const uploadsDir = join(process.cwd(), "uploads")
  await mkdir(uploadsDir, { recursive: true })
  const zipPath = join(uploadsDir, `${slug}.zip`)
  await writeFile(zipPath, zip.toBuffer())

  // Create skill record
  const skill = await db.skill.create({
    data: {
      authorId: session.user.id,
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      category: parsed.data.category,
      tags: JSON.stringify(parsed.data.tags),
      skillMdContent: parsed.data.skillMdContent,
      aiCompatibility: JSON.stringify(parsed.data.aiCompatibility),
      zipUrl: `/uploads/${slug}.zip`,
    },
  })

  return NextResponse.json({ skill, slug }, { status: 201 })
}
