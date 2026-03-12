import Link from "next/link"
import { ArrowRight, Download, Users, Layers, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SkillGrid } from "@/components/skills/SkillGrid"
import { CATEGORIES } from "@/lib/constants"
import { db } from "@/lib/db"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

async function getFeaturedSkills() {
  const skills = await db.skill.findMany({
    where: { isFeatured: true },
    take: 6,
    orderBy: { downloadCount: "desc" },
    include: {
      author: { select: { name: true, image: true } },
      reviews: { select: { rating: true } },
    },
  })

  return skills.map((s) => ({
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
  }))
}

async function getStats() {
  const [skillCount, userCount, totalDownloads] = await Promise.all([
    db.skill.count(),
    db.user.count(),
    db.skill.aggregate({ _sum: { downloadCount: true } }),
  ])
  return {
    skills: skillCount,
    creators: userCount,
    downloads: totalDownloads._sum.downloadCount ?? 0,
  }
}

export default async function HomePage() {
  const [featured, stats] = await Promise.all([getFeaturedSkills(), getStats()])

  return (
    <>
      <ScrollReveal />
      {/* Hero */}
      <section className="hero relative pb-24 mx-auto min-h-[100vh] flex items-center overflow-hidden">
        <div className="hero-orb orb1 absolute blur-[90px] rounded-full pointer-events-none -z-10 mix-blend-screen w-[700px] h-[600px] bg-[radial-gradient(circle,rgba(94,255,216,.08)_0%,transparent_70%)] -top-[120px] -left-[250px] [animation:drift1_13s_ease-in-out_infinite]"></div>
        <div className="hero-orb orb2 absolute blur-[90px] rounded-full pointer-events-none -z-10 mix-blend-screen w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(167,139,250,.07)_0%,transparent_70%)] top-[80px] -right-[180px] [animation:drift2_15s_ease-in-out_infinite]"></div>
        
        <div className="container max-w-[1160px] mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[rgba(94,255,216,.12)] border border-[rgba(94,255,216,.2)] rounded-full px-3.5 py-1 font-mono text-[11px] text-primary tracking-[.08em] mb-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Beta · Powered by Agent Skills Standard
              </div>
              <h1 className="font-display text-[clamp(38px,4.8vw,62px)] font-extrabold leading-[1.05] tracking-tight mb-5 animate-in fade-in duration-700 delay-100 slide-in-from-bottom-4 fill-mode-both">
                The shelf for<br/>
                <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#A78BFA]">AI agent skills</em><br/>
                that actually work.
              </h1>
              <p className="text-[17px] text-[#9296B8] leading-[1.65] max-w-[440px] mb-9 animate-in fade-in duration-700 delay-200 slide-in-from-bottom-4 fill-mode-both">
                Browse, download, and publish modular AI skills for Claude and beyond. A curated marketplace where every skill ships with proof.
              </p>
              
              <div className="flex gap-3 flex-wrap animate-in fade-in duration-700 delay-300 slide-in-from-bottom-4 fill-mode-both">
                <Link href="/skills" className="bg-primary hover:bg-[#7DFFE3] hover:shadow-[0_0_32px_rgba(94,255,216,.35)] hover:-translate-y-[1px] text-[#040408] px-7 py-3 rounded-lg font-bold text-[15px] transition-all inline-flex items-center gap-2">
                  Browse Skills <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/upload" className="bg-transparent hover:bg-white/5 hover:-translate-y-[1px] hover:border-[#6B7094] text-foreground border border-[#252540] px-7 py-3 rounded-lg font-medium text-[15px] transition-all inline-flex items-center gap-2">
                  ↑ Publish a skill
                </Link>
              </div>
            </div>

            <div className="hero-visual hidden lg:block">
              <div className="shelf-frame">
                <div className="shelf-topbar">
                  <div className="dot dot-r"></div>
                  <div className="dot dot-y"></div>
                  <div className="dot dot-g"></div>
                  <div className="shelf-search">
                    <span className="text-primary">⌕</span>
                    Search {stats.skills.toLocaleString() || "1,240"} skills…
                  </div>
                </div>
                <div className="shelf-body">
                  <div className="mini-card" style={{ "--accent-color": "#5EFFD8" } as any}>
                    <div className="mini-icon" style={{ background: "rgba(94,255,216,.1)" }}>📄</div>
                    <div className="mini-info">
                      <div className="mini-name">DOCX Creator Pro</div>
                      <div className="mini-desc">Word docs with brand guidelines</div>
                    </div>
                    <div className="mini-meta">
                      <span className="tag-mono">claude.ai</span>
                      <span className="b-free-sm">FREE</span>
                    </div>
                  </div>
                  <div className="mini-card" style={{ "--accent-color": "#A78BFA" } as any}>
                    <div className="mini-icon" style={{ background: "rgba(167,139,250,.1)" }}>🧪</div>
                    <div className="mini-info">
                      <div className="mini-name">Web Tester</div>
                      <div className="mini-desc">Playwright UI automation skill</div>
                    </div>
                    <div className="mini-meta">
                      <span className="tag-mono">api</span>
                      <span className="b-pro-sm">$4</span>
                    </div>
                  </div>
                  <div className="mini-card" style={{ "--accent-color": "#FFB86C" } as any}>
                    <div className="mini-icon" style={{ background: "rgba(255,184,108,.1)" }}>🎨</div>
                    <div className="mini-info">
                      <div className="mini-name">Figma Annotator</div>
                      <div className="mini-desc">Auto-annotate design specs</div>
                    </div>
                    <div className="mini-meta">
                      <span className="tag-mono">code</span>
                      <span className="b-free-sm">FREE</span>
                    </div>
                  </div>
                  <div className="mini-card" style={{ "--accent-color": "#64DCFF" } as any}>
                    <div className="mini-icon" style={{ background: "rgba(100,220,255,.1)" }}>⚡</div>
                    <div className="mini-info">
                      <div className="mini-name">MCP Builder</div>
                      <div className="mini-desc">Generate MCP servers from specs</div>
                    </div>
                    <div className="mini-meta">
                      <span className="tag-mono">claude.ai</span>
                      <span className="b-free-sm">FREE</span>
                    </div>
                  </div>
                  <div className="mini-card" style={{ "--accent-color": "#F472B6" } as any}>
                    <div className="mini-icon" style={{ background: "rgba(244,114,182,.1)" }}>📊</div>
                    <div className="mini-info">
                      <div className="mini-name">Data Analyst</div>
                      <div className="mini-desc">pandas + matplotlib workflows</div>
                    </div>
                    <div className="mini-meta">
                      <span className="tag-mono">api</span>
                      <span className="b-pro-sm">$6</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar border-y border-border bg-[#0C0C1A] py-5 relative z-10 w-full overflow-hidden">
        <div className="flex flex-wrap items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2.5 px-6 md:px-12 border-r border-[#252540] last:border-r-0">
            <span className="font-display text-2xl font-extrabold text-foreground tracking-tight">1,<span className="text-primary">240</span></span>
            <span className="text-[13px] text-[#9296B8]">Published Skills</span>
          </div>
          <div className="flex items-center gap-2.5 px-6 md:px-12 border-r border-[#252540] last:border-r-0">
            <span className="font-display text-2xl font-extrabold text-foreground tracking-tight"><span className="text-primary">348</span></span>
            <span className="text-[13px] text-[#9296B8]">Creators</span>
          </div>
          <div className="flex items-center gap-2.5 px-6 md:px-12 border-r border-[#252540] last:border-r-0">
            <span className="font-display text-2xl font-extrabold text-foreground tracking-tight">92<span className="text-primary">k</span></span>
            <span className="text-[13px] text-[#9296B8]">Total Downloads</span>
          </div>
          <div className="flex items-center gap-2.5 px-6 md:px-12 border-r border-[#252540] last:border-r-0">
            <span className="font-display text-2xl font-extrabold text-foreground tracking-tight"><span className="text-primary">4</span> AIs</span>
            <span className="text-[13px] text-[#9296B8]">Compatible Platforms</span>
          </div>
        </div>
      </div>

      {/* Featured Skills */}
      {featured.length > 0 && (
        <section className="py-24 px-6 max-w-[1160px] mx-auto w-full relative z-10">
          <div className="section-header reveal">
            <div className="section-tag">Featured Skills</div>
            <h2 className="section-h2">Trending on the shelf</h2>
            <p className="section-sub">Handpicked skills with verified outputs, active maintainers, and thousands of happy users.</p>
          </div>
          <div className="reveal">
            <div className="h-px bg-[#252540] -mb-[2px] relative z-[1] shadow-[0_2px_8px_rgba(0,0,0,.4)]"></div>
            <SkillGrid skills={featured} />
          </div>
          <div className="text-center mt-10 reveal">
            <Link href="/skills?sort=popular" className="inline-block bg-transparent hover:bg-[#10101E] hover:-translate-y-[1px] hover:border-[#6B7094] text-foreground border border-[#252540] px-7 py-3 rounded-lg font-medium text-[15px] transition-all">
              Browse all {stats.skills.toLocaleString() || "1,240"} skills →
            </Link>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="how w-full relative z-10">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="section-header reveal">
            <div className="section-tag">How it works</div>
            <h2 className="section-h2">From shelf to running in minutes</h2>
            <p className="section-sub">Install any skill directly into Claude.ai, Claude Code, or the API with a single ZIP.</p>
          </div>
          <div className="steps reveal">
            <div className="step">
              <div className="step-num">01 — BROWSE</div>
              <div className="step-icon">🔍</div>
              <h3 className="step-h3">Find the right skill</h3>
              <p className="step-p">Search by category, use case, or AI platform. Filter by free vs paid, download count, or compatibility. Preview real outputs before you commit.</p>
            </div>
            <div className="step">
              <div className="step-num">02 — DOWNLOAD</div>
              <div className="step-icon">↓</div>
              <h3 className="step-h3">Download the ZIP</h3>
              <p className="step-p">Every skill ships as a validated ZIP containing a SKILL.md, optional scripts, and resource files — ready to drop into your AI tool of choice.</p>
            </div>
            <div className="step">
              <div className="step-num">03 — DEPLOY</div>
              <div className="step-icon">⚡</div>
              <h3 className="step-h3">Activate & run</h3>
              <p className="step-p">Upload to Claude.ai Settings → Capabilities, install via /plugin in Claude Code, or pass it to the API. Step-by-step guides for every platform are included.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section w-full relative z-10">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="section-header reveal">
            <div className="section-tag">Browse by category</div>
            <h2 className="section-h2">Every workflow, covered</h2>
          </div>
          <div className="cat-grid reveal">
            <Link className="cat-card" href="/skills?category=documents"><div className="cat-emoji">📄</div><div className="cat-name">Documents</div><div className="cat-count">214 skills</div></Link>
            <Link className="cat-card" href="/skills?category=development"><div className="cat-emoji">💻</div><div className="cat-name">Dev & Code</div><div className="cat-count">187 skills</div></Link>
            <Link className="cat-card" href="/skills?category=testing"><div className="cat-emoji">🧪</div><div className="cat-name">Testing</div><div className="cat-count">93 skills</div></Link>
            <Link className="cat-card" href="/skills?category=data"><div className="cat-emoji">📊</div><div className="cat-name">Data & Analytics</div><div className="cat-count">121 skills</div></Link>
            <Link className="cat-card" href="/skills?category=design"><div className="cat-emoji">🎨</div><div className="cat-name">Design</div><div className="cat-count">78 skills</div></Link>
            <Link className="cat-card" href="/skills?category=content"><div className="cat-emoji">✍️</div><div className="cat-name">Content</div><div className="cat-count">162 skills</div></Link>
            <Link className="cat-card" href="/skills?category=automation"><div className="cat-emoji">⚡</div><div className="cat-name">Automation</div><div className="cat-count">109 skills</div></Link>
            <Link className="cat-card" href="/skills?category=enterprise"><div className="cat-emoji">🏢</div><div className="cat-name">Enterprise</div><div className="cat-count">56 skills</div></Link>
          </div>
        </div>
      </section>

      {/* Creator CTA */}
      <section className="creator-cta w-full relative z-10">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="cta-box reveal">
            <span className="cta-tag">↑ For skill creators</span>
            <h2 className="cta-h2">Your skills deserve<br/>an audience.</h2>
            <p className="cta-sub">Publish your Agent Skills to thousands of AI developers and power users. Keep 80% of every sale.</p>
            <div className="cta-actions">
              <Link href="/upload" className="bg-primary hover:bg-[#7DFFE3] hover:shadow-[0_0_32px_rgba(94,255,216,.35)] hover:-translate-y-[1px] text-[#040408] px-7 py-3 rounded-lg font-bold text-[15px] transition-all inline-flex items-center gap-2">
                Start Publishing →
              </Link>
              <Link href="/docs" className="bg-transparent hover:bg-[#10101E] hover:-translate-y-[1px] hover:border-[#6B7094] text-foreground border border-[#252540] px-7 py-3 rounded-lg font-medium text-[15px] transition-all inline-flex items-center gap-2">
                Read the docs
              </Link>
            </div>
            <div className="terminal">
              <div className="t-line"><span className="t-p">$</span><span className="t-c">neuralshelf publish ./my-skill/</span></div>
              <div className="t-line"><span className="t-p" style={{color: "var(--muted)"} as any}>→</span><span style={{color: "#9296B8"} as any}>Validating SKILL.md…</span><span className="t-ok"> ✓</span></div>
              <div className="t-line"><span className="t-p" style={{color: "var(--muted)"} as any}>→</span><span style={{color: "#9296B8"} as any}>Packaging ZIP…</span><span className="t-ok"> ✓</span></div>
              <div className="t-line"><span className="t-p" style={{color: "var(--muted)"} as any}>→</span><span className="t-link">Published: neuralshelf.io/s/my-skill</span></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
