import type { Metadata } from "next"
import { DM_Sans, Syne, Azeret_Mono } from "next/font/google"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import "./globals.css"

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
})

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
})

const azeretMono = Azeret_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "NeuralShelf — AI Agent Skills Marketplace",
    template: "%s | NeuralShelf",
  },
  description:
    "Discover, share, and sell Agent Skills — modular instruction packages that extend AI platforms with specialized workflows.",
  openGraph: {
    type: "website",
    siteName: "NeuralShelf",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${syne.variable} ${azeretMono.variable} font-sans antialiased dark`}>
        <SessionProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
