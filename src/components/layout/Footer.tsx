import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#0C0C1A] pt-12 pb-8 reveal">
      <div className="mx-auto max-w-[1160px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex flex-row items-center gap-2.5 font-display font-extrabold text-[18px] text-foreground tracking-[-.3px] mb-3.5 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[#A78BFA] flex items-center justify-center text-[15px] font-bold text-[#040408]">
                ⬡
              </div>
              NeuralShelf
            </Link>
            <p className="text-[13px] text-muted-foreground leading-[1.6] max-w-[220px]">
              A curated marketplace for AI Agent Skills. Browse, share, and sell modular AI workflows that actually work.
            </p>
          </div>

          <div>
            <h4 className="font-display text-[13px] font-bold text-foreground mb-3.5">Marketplace</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="/skills" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Browse Skills</Link></li>
              <li><Link href="/skills?category=development" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Categories</Link></li>
              <li><Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Collections</Link></li>
              <li><Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">New Arrivals</Link></li>
              <li><Link href="/skills?sort=popular" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Trending</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-[13px] font-bold text-foreground mb-3.5">Creators</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="/upload" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Publish a Skill</Link></li>
              <li><Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Creator Dashboard</Link></li>
              <li><Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Skill Guidelines</Link></li>
              <li><Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Payouts</Link></li>
              <li><Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Partner Program</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-[13px] font-bold text-foreground mb-3.5">Resources</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="/docs" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Agent Skills Spec</Link></li>
              <li><Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Export Guides</Link></li>
              <li><Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">GitHub</Link></li>
              <li><Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Status</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-7 flex items-center justify-between flex-wrap gap-3">
          <div className="font-mono text-[11px] text-muted-foreground">
            &copy; {new Date().getFullYear()} NeuralShelf · Built with <span className="text-primary">♥</span> for the Agent Skills community
          </div>
          <div className="flex gap-5">
            <Link href="#" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">agentskills.io</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
