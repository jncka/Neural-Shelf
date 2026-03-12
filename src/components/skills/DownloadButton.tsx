"use client"

import { useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Download, Loader2, Lock } from "lucide-react"

interface DownloadButtonProps {
  slug: string
}

export function DownloadButton({ slug }: DownloadButtonProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    if (!session) {
      signIn()
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/skills/${slug}/download`, { method: "POST" })
      const data = await res.json()

      if (!res.ok) {
        alert(data.error ?? "Download failed")
        return
      }

      // Trigger download
      if (data.zipUrl) {
        window.open(data.zipUrl, "_blank")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      Download Free
    </Button>
  )
}
