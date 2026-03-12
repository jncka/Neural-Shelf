"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { StarRating } from "./StarRating"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"

interface Review {
  id: string
  rating: number
  body: string | null
  createdAt: string
  user: { name: string | null; image: string | null }
}

interface ReviewSectionProps {
  slug: string
  reviews: Review[]
  averageRating: number
}

export function ReviewSection({ slug, reviews: initialReviews, averageRating }: ReviewSectionProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState(initialReviews)
  const [rating, setRating] = useState(0)
  const [body, setBody] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) return
    setSubmitting(true)

    try {
      const res = await fetch(`/api/skills/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, body: body || undefined }),
      })

      if (res.ok) {
        const review = await res.json()
        setReviews((prev) => [
          {
            id: review.id,
            rating: review.rating,
            body: review.body,
            createdAt: review.createdAt,
            user: {
              name: session?.user?.name ?? null,
              image: session?.user?.image ?? null,
            },
          },
          ...prev.filter((r) => r.id !== review.id),
        ])
        setRating(0)
        setBody("")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="text-4xl font-semibold">{averageRating.toFixed(1)}</div>
        <div>
          <StarRating rating={Math.round(averageRating)} />
          <p className="text-sm text-muted-foreground mt-1">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Review Form */}
      {session && (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-xl border bg-card">
          <h3 className="font-medium">Write a review</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Rating:</span>
            <StarRating rating={rating} interactive onChange={setRating} />
          </div>
          <Textarea
            placeholder="Share your experience with this skill... (optional)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
          />
          <Button type="submit" disabled={!rating || submitting} size="sm">
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-4">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={review.user.image ?? ""} />
              <AvatarFallback>{review.user.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-medium">{review.user.name ?? "Anonymous"}</span>
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-muted-foreground">
                  {format(new Date(review.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              {review.body && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.body}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
