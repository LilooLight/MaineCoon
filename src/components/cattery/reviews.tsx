"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Heart } from "lucide-react";
import type { Review } from "@/lib/types/cattery";

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const featured = reviews.filter((r) => r.featured).slice(0, 3);
  const others = reviews.filter((r) => !r.featured);

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10 lg:mb-14">
          <Badge variant="outline" className="mb-4 border-accent/30 bg-accent/5 text-accent">
            <Heart className="h-3.5 w-3.5 mr-1.5" />
            Выпускники · истории семей
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-5">
            Не отзывы — а истории «выпускников»
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Мы не прячем отзывы в мессенджерах. Каждая семья — отдельный кейс:
            какой котёнок, в какую семью, как сложилась жизнь. Это и есть честный
            подход.
          </p>
        </div>

        {/* Featured reviews — large cards */}
        {loading ? (
          <div className="grid lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-card animate-pulse ring-1 ring-border" />
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-5 mb-10">
            {featured.map((review) => (
              <FeaturedReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* Other reviews — compact list */}
        {others.length > 0 && (
          <div className="mt-8">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
              Ещё истории
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {others.map((review) => (
                <CompactReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedReviewCard({ review }: { review: Review }) {
  return (
    <Card className="overflow-hidden border-border bg-card hover:shadow-md transition-shadow flex flex-col">
      {review.imageUrl && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={review.imageUrl}
            alt={`Выпускник ${review.kittenName}`}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-foreground border border-border">
            {review.adoptedAt}
          </div>
        </div>
      )}
      <CardContent className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex gap-0.5">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
            ))}
          </div>
          <Quote className="h-5 w-5 text-muted-foreground/40" />
        </div>
        <p className="text-foreground/90 leading-relaxed text-sm flex-1 line-clamp-5">
          «{review.text}»
        </p>
        <div className="pt-3 border-t border-border">
          <p className="font-serif text-lg font-semibold text-foreground leading-tight">
            {review.authorName}
          </p>
          <p className="text-xs text-muted-foreground">{review.authorRole}</p>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-primary">
            <Heart className="h-3 w-3" />
            <span>{review.kittenName}</span>
            <span className="text-muted-foreground">· {review.kittenColor}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompactReviewCard({ review }: { review: Review }) {
  return (
    <Card className="border-border bg-card hover:shadow-sm transition-shadow">
      <CardContent className="p-5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex gap-0.5">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{review.adoptedAt}</span>
        </div>
        <p className="text-foreground/90 leading-relaxed text-sm line-clamp-3">
          «{review.text}»
        </p>
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{review.authorName}</p>
            <p className="text-xs text-muted-foreground">{review.authorRole}</p>
          </div>
          <span className="text-xs text-primary flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {review.kittenName}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
