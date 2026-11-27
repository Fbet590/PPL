"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const projects = [
  {
    src: "/gallery/01.webp",
    thumb: "/gallery/01-thumb.webp",
    title: "Sunset Pergola & Outdoor Kitchen",
    category: "Full Landscape",
    location: "Scottsdale, AZ",
  },
  {
    src: "/gallery/02.webp",
    thumb: "/gallery/02-thumb.webp",
    title: "L-Shaped Outdoor Kitchen",
    category: "Outdoor Kitchens",
    location: "Paradise Valley, AZ",
  },
  {
    src: "/gallery/03.webp",
    thumb: "/gallery/03-thumb.webp",
    title: "Outdoor Kitchen at Night",
    category: "Outdoor Kitchens",
    location: "Mesa, AZ",
  },
  {
    src: "/gallery/04.webp",
    thumb: "/gallery/04-thumb.webp",
    title: "Modern Pergola Lounge",
    category: "Pergolas",
    location: "Gilbert, AZ",
  },
  {
    src: "/gallery/05.webp",
    thumb: "/gallery/05-thumb.webp",
    title: "Pet-Friendly Turf Installation",
    category: "Artificial Turf",
    location: "Chandler, AZ",
  },
  {
    src: "/gallery/06.webp",
    thumb: "/gallery/06-thumb.webp",
    title: "Luxurious Poolside Putting Green",
    category: "Putting Greens",
    location: "Arizona",
  },
  {
    src: "/gallery/07.webp",
    thumb: "/gallery/07-thumb.webp",
    title: "Modern Geometric Pool Retreat",
    category: "Poolscapes",
    location: "Arizona",
  },
  {
    src: "/gallery/08.webp",
    thumb: "/gallery/08-thumb.webp",
    title: "Modern Backyard Putting Green Oasis",
    category: "Putting Greens",
    location: "Arizona",
  },
  {
    src: "/gallery/09.webp",
    thumb: "/gallery/09-thumb.webp",
    title: "Modern Pergola Patio & Outdoor Kitchen",
    category: "Pergolas",
    location: "Arizona",
  },
  {
    src: "/gallery/10.webp",
    thumb: "/gallery/10-thumb.webp",
    title: "Modern Mountain Lodge Backyard",
    category: "Artificial Turf",
    location: "Arizona",
  },
  {
    src: "/gallery/11.webp",
    thumb: "/gallery/11-thumb.webp",
    title: "Modern Pergola Patio Retreat",
    category: "Pergolas",
    location: "Arizona",
  },
  {
    src: "/gallery/12.webp",
    thumb: "/gallery/12-thumb.webp",
    title: "Tree-Shaded Courtyard Landscape",
    category: "Landscape Design",
    location: "Arizona",
  },
  {
    src: "/gallery/13.webp",
    thumb: "/gallery/13-thumb.webp",
    title: "Backyard Putting Green Oasis",
    category: "Putting Greens",
    location: "Arizona",
  },
  {
    src: "/gallery/14.webp",
    thumb: "/gallery/14-thumb.webp",
    title: "Aerial View of Backyard Oasis",
    category: "Full Landscape",
    location: "Arizona",
  },
]

export function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }, [])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const openLightbox = () => {
    setLightboxOpen(true)
    setIsAutoPlaying(false)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  // Auto-play slideshow
  useEffect(() => {
    if (!isAutoPlaying || lightboxOpen) return
    const interval = setInterval(goNext, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, lightboxOpen, goNext])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "Escape") closeLightbox()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, goNext, goPrev])

  return (
    <section id="gallery" className="pt-[26px] pb-20 text-[24px] bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-[24px] uppercase tracking-wider">
            Our Work
          </span>
        </div>

        {/* Slideshow */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative aspect-[16/10] overflow-hidden cursor-pointer group"
            onClick={openLightbox}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {projects.map((project, index) => {
              const distance = Math.abs(index - currentIndex)
              const isNearby = Math.min(distance, projects.length - distance) <= 1
              if (!isNearby) return null
              return (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700",
                  index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <Image
                  src={project.src}
                  alt={project.title}
                  fill
                  sizes="(min-width: 896px) 896px, 100vw"
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                
              </div>
              )
            })}

            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Click to expand hint */}
            <div className="absolute top-4 right-4 bg-card/80 text-foreground text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              Click to expand
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "bg-accent w-8" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
            {projects.map((project, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "relative flex-shrink-0 w-24 h-16 overflow-hidden transition-all duration-300",
                  index === currentIndex 
                    ? "ring-2 ring-accent ring-offset-2 ring-offset-muted" 
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={project.thumb}
                  alt={project.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-primary/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-primary-foreground hover:text-accent transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-foreground hover:text-accent transition-colors z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="h-12 w-12" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground hover:text-accent transition-colors z-10"
            aria-label="Next"
          >
            <ChevronRight className="h-12 w-12" />
          </button>

          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={projects[currentIndex].src}
              alt={projects[currentIndex].title}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-contain"
            />
          </div>

          {/* Lightbox Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex 
                    ? "bg-accent w-6" 
                    : "bg-primary-foreground/50 hover:bg-primary-foreground"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
