"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const projects = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_aval6aaval6aaval.png-mLDtyjBTKBYjhc1vWWYuN9pvhwxJLQ.jpeg",
    title: "Sunset Pergola & Outdoor Kitchen",
    category: "Full Landscape",
    location: "Scottsdale, AZ",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_hr014uhr014uhr01.png-apEwcFg7Z4rUFl3C0y7sPVijqNcdvC.jpeg",
    title: "L-Shaped Outdoor Kitchen",
    category: "Outdoor Kitchens",
    location: "Paradise Valley, AZ",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_z26m1kz26m1kz26m.png-MwHMc2NuFgJUbgwj7rmBOz5R3XhzU8.jpeg",
    title: "Outdoor Kitchen at Night",
    category: "Outdoor Kitchens",
    location: "Mesa, AZ",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_nlv8jtnlv8jtnlv8.png-mMJ68nWSl8zavluNP7PS76ImtGxncA.jpeg",
    title: "Modern Pergola Lounge",
    category: "Pergolas",
    location: "Gilbert, AZ",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_l7r1otl7r1otl7r1.png-D4iYGXZx1KqLaEWRsmp73RQaxMKnqk.jpeg",
    title: "Pet-Friendly Turf Installation",
    category: "Artificial Turf",
    location: "Chandler, AZ",
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
    <section id="gallery" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Our Work
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
            See Our Stunning Results
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Explore our recent projects across the Phoenix Valley
          </p>
        </div>

        {/* Slideshow */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer group"
            onClick={openLightbox}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {projects.map((project, index) => (
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
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                
                {/* Slide Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                  <span className="text-sm text-accent font-medium uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-semibold mt-1">
                    {project.title}
                  </h3>
                  <p className="text-sm opacity-80">{project.location}</p>
                </div>
              </div>
            ))}

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
                  "relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-300",
                  index === currentIndex 
                    ? "ring-2 ring-accent ring-offset-2 ring-offset-muted" 
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={project.src}
                  alt={project.title}
                  fill
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
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center bg-gradient-to-t from-primary/80 to-transparent">
              <span className="text-sm text-accent font-medium uppercase tracking-wider">
                {projects[currentIndex].category}
              </span>
              <h3 className="text-2xl font-semibold text-primary-foreground mt-1">
                {projects[currentIndex].title}
              </h3>
              <p className="text-primary-foreground/80">
                {projects[currentIndex].location}
              </p>
            </div>
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
