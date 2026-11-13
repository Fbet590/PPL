"use client"

import { useState, useEffect, useCallback } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    name: "Mike & Sarah Johnson",
    location: "Scottsdale, AZ",
    rating: 5,
    text: "So grateful to have been connected with a great contractor who transformed our backyard beyond our wildest dreams! The paver patio and outdoor kitchen are absolutely stunning. Their attention to detail and professionalism made the entire process smooth and enjoyable.",
    project: "Paver Patio & Outdoor Kitchen",
  },
  {
    name: "Jennifer Martinez",
    location: "Gilbert, AZ",
    rating: 5,
    text: "I cannot begin to say how pleased we are, and how thankful we are to have been able to get multiple bids before choosing our contractor. PROFESSIONAL in what they do and are people of their word. Our fire pit area looks fantastic and has become the centerpiece of our backyard gatherings.",
    project: "Custom Fire Pit",
  },
  {
    name: "Robert & Linda Chen",
    location: "Mesa, AZ",
    rating: 5,
    text: "We were so glad to have the option of being contacted by several pros. From the initial consultation to the final walkthrough, the contractor we chose exceeded our expectations. The retaining wall they built not only solved our drainage issues but looks beautiful with native Arizona plants.",
    project: "Retaining Wall & Landscaping",
  },
  {
    name: "David Thompson",
    location: "Chandler, AZ",
    rating: 5,
    text: "Grateful to have been connected with a great contractor, and working with them was a pleasure from start to finish. They handled all the permits, communicated clearly throughout, and delivered a backyard that looks like it belongs in a magazine. Highly recommend!",
    project: "Complete Backyard Renovation",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const goPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(goNext, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, goNext])

  return (
    <section id="testimonials" className="py-20 bg-[#1F150F] text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
            Don&apos;t Just Take Our Word For It
          </h2>
          <p className="mt-4 opacity-80 text-lg">
            See what our past clients had to say about working with us
          </p>
        </div>

        <div
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Quote Icon */}
          <Quote className="absolute -top-4 -left-4 h-16 w-16 text-accent/30 hidden md:block" />

          {/* Testimonial Card */}
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
            <div className="flex gap-1 mb-4">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-accent text-accent" />
              ))}
            </div>

            <p className="text-lg md:text-xl leading-relaxed mb-6">
              &ldquo;{testimonials[currentIndex].text}&rdquo;
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="font-semibold text-lg">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-sm opacity-70">
                  {testimonials[currentIndex].location} •{" "}
                  {testimonials[currentIndex].project}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={goPrev}
                  className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goNext}
                  className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  currentIndex === index
                    ? "bg-accent w-6"
                    : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
