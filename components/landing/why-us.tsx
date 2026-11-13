"use client"

import { useEffect, useRef, useState } from "react"
import { Award, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const reasons = [
  {
    icon: Award,
    title: "15+ Years Experience",
  },
  {
    icon: Clock,
    title: "Fast, On-Time Installs",
  },
]

export function WhyUs() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="why-us" className="py-12 bg-muted" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 transition-all duration-500",
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-[#1F150F] flex items-center justify-center">
                <reason.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="font-semibold text-foreground">{reason.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
