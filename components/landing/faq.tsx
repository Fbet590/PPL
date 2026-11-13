"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "How long does a typical hardscape project take?",
    answer:
      "Project timelines vary based on scope and complexity. A simple paver patio might take 3-5 days, while a complete outdoor kitchen could take 2-3 weeks. During your consultation, we'll provide a detailed timeline specific to your project.",
  },
  {
    question: "What materials work best in Arizona's climate?",
    answer:
      "We specialize in materials that thrive in the desert climate. Travertine, flagstone, and concrete pavers are excellent choices that stay cool underfoot. We'll guide you through options that match your style while standing up to intense sun and temperature swings.",
  },
  {
    question: "Do you offer financing options?",
    answer:
      "Yes! We understand that outdoor renovations are an investment. We partner with several financing companies to offer flexible payment plans with competitive rates. Ask about our 0% financing options during your free consultation.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve the entire Phoenix metropolitan area including Scottsdale, Mesa, Gilbert, Chandler, Tempe, Paradise Valley, Cave Creek, and surrounding communities. If you're unsure if we service your area, just give us a call!",
  },
  {
    question: "What kind of warranty do you offer?",
    answer:
      "We stand behind our work with comprehensive warranties. Our installation workmanship is covered for 5 years, and many materials come with manufacturer warranties up to 10+ years. We'll explain all warranty details during your project planning.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform flex-shrink-0",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}
              >
                <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
