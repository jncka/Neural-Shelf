"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Search, Upload, Menu, LogOut, User } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const [search, setSearch] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/skills?q=${encodeURIComponent(search.trim())}`)
    }
  }

  const navLinks = (
    <>
      <Link href="/skills" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Browse
      </Link>
      <Link href="/skills?category=development" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Categories
      </Link>
      {session && (
        <Link href="/upload" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Upload
        </Link>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#A78BFA] text-primary-foreground text-sm font-bold shadow-sm">
            ⬡
          </div>
          <span className="font-semibold text-lg hidden sm:inline font-display tracking-tight">NeuralShelf</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks}
        </nav>

        {/* Search */}
        {!isHomePage && (
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </form>
        )}

        {/* Auth / Actions */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/upload" className={buttonVariants({ variant: "ghost", size: "sm" }) + " hidden sm:inline-flex"}>
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full focus:outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image ?? ""} />
                    <AvatarFallback>
                      {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push(`/users/${session.user?.id}`)}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button size="sm" onClick={() => signIn()}>
              Sign in
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-accent hover:text-accent-foreground">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks}
                <form onSubmit={handleSearch} className="sm:hidden">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </form>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
