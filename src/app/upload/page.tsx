import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UploadForm } from "@/components/skills/UploadForm"

export const metadata: Metadata = {
  title: "Upload a Skill",
  description: "Share your Agent Skill with the NeuralShelf community.",
}

export default async function UploadPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/upload")
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-2 font-display">Upload a Skill</h1>
      <p className="text-muted-foreground mb-8">
        Share your Agent Skill with the NeuralShelf community. Upload a SKILL.md
        file and fill in the details.
      </p>
      <UploadForm />
    </div>
  )
}
