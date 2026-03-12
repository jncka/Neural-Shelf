import { PrismaClient } from "../generated/prisma/client.js"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { join } from "path"

const adapter = new PrismaBetterSqlite3({ url: `file:${join(process.cwd(), "dev.db")}` })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = new PrismaClient({ adapter } as any)

async function main() {
  const creator = await db.user.upsert({
    where: { email: "creator@neuralshelf.dev" },
    update: {},
    create: {
      email: "creator@neuralshelf.dev",
      name: "NeuralShelf Team",
      username: "neuralshelf",
      bio: "The official NeuralShelf team, building the future of AI Agent Skills.",
      image: null,
    },
  })

  const secondCreator = await db.user.upsert({
    where: { email: "alex@example.com" },
    update: {},
    create: {
      email: "alex@example.com",
      name: "Alex Chen",
      username: "alexchen",
      bio: "Full-stack developer and AI enthusiast. Building tools that make AI more useful.",
      image: null,
    },
  })

  const reviewer = await db.user.upsert({
    where: { email: "reviewer@example.com" },
    update: {},
    create: {
      email: "reviewer@example.com",
      name: "Sam Rivera",
      username: "samrivera",
      bio: "Power user and skill reviewer.",
      image: null,
    },
  })

  const skills = [
    {
      authorId: creator.id,
      name: "Web Development Pro",
      slug: "web-development-pro",
      description: "Full-stack web development skill covering React, Next.js, HTML/CSS/JS, and modern design patterns. Produces production-grade code with minimal, elegant aesthetics.",
      category: "Development",
      tags: JSON.stringify(["react", "nextjs", "tailwind", "typescript", "web"]),
      downloadCount: 347,
      skillMdContent: "---\nname: web-development-pro\ndescription: Full-stack web development with modern patterns\n---\n\n# Web Development Pro\n\nA comprehensive skill for building production-grade websites.",
      aiCompatibility: JSON.stringify(["Claude.ai", "Claude Code", "Anthropic API"]),
      isFeatured: true,
    },
    {
      authorId: creator.id,
      name: "Technical Writer",
      slug: "technical-writer",
      description: "Transforms complex technical concepts into clear, well-structured documentation. Handles API docs, tutorials, READMEs, and changelog entries.",
      category: "Writing",
      tags: JSON.stringify(["documentation", "api-docs", "tutorials", "readme"]),
      downloadCount: 182,
      skillMdContent: "---\nname: technical-writer\ndescription: Clear technical documentation and API guides\n---\n\n# Technical Writer\n\nWrite crystal-clear technical documentation.",
      aiCompatibility: JSON.stringify(["Claude.ai", "Anthropic API"]),
      isFeatured: true,
    },
    {
      authorId: secondCreator.id,
      name: "Data Pipeline Architect",
      slug: "data-pipeline-architect",
      description: "Design and implement robust data pipelines using Python, SQL, and modern ETL tools. Covers data modeling, transformation, and orchestration.",
      category: "Data",
      tags: JSON.stringify(["python", "sql", "etl", "data-engineering", "airflow"]),
      downloadCount: 95,
      skillMdContent: "---\nname: data-pipeline-architect\ndescription: Design robust data pipelines and ETL workflows\n---\n\n# Data Pipeline Architect\n\nBuild production-grade data pipelines.",
      aiCompatibility: JSON.stringify(["Claude Code", "Anthropic API"]),
      isFeatured: true,
    },
    {
      authorId: secondCreator.id,
      name: "Brand Voice Creator",
      slug: "brand-voice-creator",
      description: "Develops consistent brand voice guidelines and generates on-brand marketing copy. Covers social media, email campaigns, and website copy.",
      category: "Marketing",
      tags: JSON.stringify(["branding", "copywriting", "social-media", "marketing"]),
      downloadCount: 128,
      skillMdContent: "---\nname: brand-voice-creator\ndescription: Consistent brand voice and marketing copy generation\n---\n\n# Brand Voice Creator\n\nCreate and maintain a consistent brand voice.",
      aiCompatibility: JSON.stringify(["Claude.ai"]),
      isFeatured: true,
    },
    {
      authorId: creator.id,
      name: "UI/UX Design System",
      slug: "ui-ux-design-system",
      description: "Creates comprehensive design systems with tokens, components, and usage guidelines. Generates Figma-ready specifications and CSS implementations.",
      category: "Design",
      tags: JSON.stringify(["design-system", "ui", "ux", "figma", "css"]),
      downloadCount: 256,
      skillMdContent: "---\nname: ui-ux-design-system\ndescription: Comprehensive design system creation and documentation\n---\n\n# UI/UX Design System\n\nBuild beautiful, consistent design systems.",
      aiCompatibility: JSON.stringify(["Claude.ai", "Claude Code"]),
      isFeatured: true,
    },
    {
      authorId: secondCreator.id,
      name: "Python Testing Expert",
      slug: "python-testing-expert",
      description: "Writes comprehensive test suites using pytest, unittest, and testing best practices. Covers unit tests, integration tests, mocking, and CI/CD integration.",
      category: "Development",
      tags: JSON.stringify(["python", "pytest", "testing", "ci-cd", "tdd"]),
      downloadCount: 189,
      skillMdContent: "---\nname: python-testing-expert\ndescription: Comprehensive Python testing with pytest\n---\n\n# Python Testing Expert\n\nWrite robust test suites for Python projects.",
      aiCompatibility: JSON.stringify(["Claude Code", "Anthropic API"]),
      isFeatured: true,
    },
    {
      authorId: creator.id,
      name: "Lesson Plan Builder",
      slug: "lesson-plan-builder",
      description: "Creates structured, engaging lesson plans for any subject and grade level. Includes learning objectives, activities, assessments, and differentiation strategies.",
      category: "Education",
      tags: JSON.stringify(["teaching", "lesson-plans", "curriculum", "education"]),
      downloadCount: 74,
      skillMdContent: "---\nname: lesson-plan-builder\ndescription: Structured lesson plan creation for educators\n---\n\n# Lesson Plan Builder\n\nCreate engaging, standards-aligned lesson plans.",
      aiCompatibility: JSON.stringify(["Claude.ai"]),
      isFeatured: false,
    },
    {
      authorId: secondCreator.id,
      name: "API Design Specialist",
      slug: "api-design-specialist",
      description: "Designs RESTful and GraphQL APIs following best practices. Generates OpenAPI specs, handles versioning, pagination, error handling, and security.",
      category: "Development",
      tags: JSON.stringify(["api", "rest", "graphql", "openapi", "backend"]),
      downloadCount: 142,
      skillMdContent: "---\nname: api-design-specialist\ndescription: Production-grade API design and documentation\n---\n\n# API Design Specialist\n\nDesign robust, well-documented APIs.",
      aiCompatibility: JSON.stringify(["Claude Code", "Anthropic API"]),
      isFeatured: false,
    },
    {
      authorId: creator.id,
      name: "Productivity Automator",
      slug: "productivity-automator",
      description: "Automates repetitive tasks with scripts, workflows, and integrations. Covers shell scripting, task scheduling, email automation, and data processing.",
      category: "Productivity",
      tags: JSON.stringify(["automation", "scripting", "workflows", "productivity"]),
      downloadCount: 203,
      skillMdContent: "---\nname: productivity-automator\ndescription: Automate repetitive tasks and workflows\n---\n\n# Productivity Automator\n\nStreamline your work with intelligent automation.",
      aiCompatibility: JSON.stringify(["Claude.ai", "Claude Code"]),
      isFeatured: false,
    },
    {
      authorId: secondCreator.id,
      name: "Business Plan Writer",
      slug: "business-plan-writer",
      description: "Creates professional business plans with market analysis, financial projections, competitive landscape, and growth strategy sections.",
      category: "Business",
      tags: JSON.stringify(["business-plan", "strategy", "finance", "startup"]),
      downloadCount: 67,
      skillMdContent: "---\nname: business-plan-writer\ndescription: Professional business plan creation and analysis\n---\n\n# Business Plan Writer\n\nCraft investor-ready business plans.",
      aiCompatibility: JSON.stringify(["Claude.ai", "Anthropic API"]),
      isFeatured: false,
    },
  ]

  for (const skill of skills) {
    await db.skill.upsert({
      where: { slug: skill.slug },
      update: skill,
      create: skill,
    })
  }

  const webDevSkill = await db.skill.findUnique({ where: { slug: "web-development-pro" } })
  const techWriterSkill = await db.skill.findUnique({ where: { slug: "technical-writer" } })
  const designSkill = await db.skill.findUnique({ where: { slug: "ui-ux-design-system" } })

  if (webDevSkill) {
    await db.review.upsert({
      where: { skillId_userId: { skillId: webDevSkill.id, userId: reviewer.id } },
      update: {},
      create: { skillId: webDevSkill.id, userId: reviewer.id, rating: 5, body: "Incredible skill! The code quality is production-ready and the design patterns are exactly what I needed." },
    })
    await db.review.upsert({
      where: { skillId_userId: { skillId: webDevSkill.id, userId: secondCreator.id } },
      update: {},
      create: { skillId: webDevSkill.id, userId: secondCreator.id, rating: 4, body: "Great for scaffolding new projects. The Tailwind configurations are spot on." },
    })
  }

  if (techWriterSkill) {
    await db.review.upsert({
      where: { skillId_userId: { skillId: techWriterSkill.id, userId: reviewer.id } },
      update: {},
      create: { skillId: techWriterSkill.id, userId: reviewer.id, rating: 5, body: "Best documentation skill I've found. Produces clear, well-structured docs every time." },
    })
  }

  if (designSkill) {
    await db.review.upsert({
      where: { skillId_userId: { skillId: designSkill.id, userId: reviewer.id } },
      update: {},
      create: { skillId: designSkill.id, userId: reviewer.id, rating: 4, body: "Solid design system generator. The token system is well thought out." },
    })
  }

  console.log("Seed data created successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
