"use client"

import { useState } from "react"
import Image from "next/image"
import { CheckCircle2, Shield, Award, FileCheck, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { BudgetSlider, BUDGET_MIN, formatBudget } from "@/components/landing/budget-slider"

const badges = [
  { icon: Shield, label: "Licensed" },
  { icon: Award, label: "Bonded" },
  { icon: FileCheck, label: "Insured" },
]

const projectOptions = ["Turf", "Pavers", "Plants", "Decorative Rock", "Drip Irrigation", "Pergola"]

const formSteps = [
  { field: "options", label: "What options would you like for your project?", placeholder: "", type: "options" },
  { field: "name", label: "What's your name?", placeholder: "Enter your name", type: "text" },
  { field: "budget", label: "What's your budget for this project?", placeholder: "", type: "budget" },
  { field: "phone", label: "What's your phone number?", placeholder: "Enter your phone number", type: "tel" },
  { field: "email", label: "What's your email?", placeholder: "Enter your email address", type: "email" },
  { field: "multipleBids", label: "Would you like more than one bid for this project?", placeholder: "", type: "choice" },
]

const bidOptions = ["Yes (Multiple bids is better)", "No (I only need a bid from 1 company)"]

// Validation functions
const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "")
  // Must be exactly 10 digits (US phone number)
  if (digits.length !== 10) return false
  // Cannot start with 0 or 1
  if (digits[0] === "0" || digits[0] === "1") return false
  // Cannot be all same digits
  if (/^(\d)\1+$/.test(digits)) return false
  // Cannot be sequential (1234567890)
  if (digits === "1234567890" || digits === "0987654321") return false
  return true
}

const validateEmail = (email: string): boolean => {
  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return false
  // Check for common fake domains
  const fakeDomains = ["test.com", "fake.com", "example.com", "asdf.com", "asd.com", "abc.com", "123.com"]
  const domain = email.split("@")[1]?.toLowerCase()
  if (fakeDomains.includes(domain)) return false
  // Check for keyboard patterns
  const localPart = email.split("@")[0]?.toLowerCase()
  const fakePatterns = ["asdf", "qwerty", "test", "fake", "aaa", "bbb", "123", "abc"]
  if (fakePatterns.some(pattern => localPart === pattern)) return false
  return true
}

const validateName = (name: string): boolean => {
  // Must be at least 2 characters
  if (name.trim().length < 2) return false
  // Must contain only letters, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return false
  // Cannot be all same character
  if (/^(.)\1+$/.test(name.replace(/\s/g, ""))) return false
  return true
}

// Format phone number as user types
const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

export function Hero() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    options: [] as string[],
    budget: BUDGET_MIN,
    multipleBids: "",
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateCurrentStep = (): boolean => {
    const currentField = formSteps[currentStep]
    
    switch (currentField.field) {
      case "name":
        if (!validateName(formData.name)) {
          setValidationError("Please enter a valid name (letters only, at least 2 characters)")
          return false
        }
        break
      case "phone":
        if (!validatePhone(formData.phone)) {
          setValidationError("Please enter a valid 10-digit US phone number")
          return false
        }
        break
      case "email":
        if (!validateEmail(formData.email)) {
          setValidationError("Please enter a valid email address")
          return false
        }
        break
      case "multipleBids":
        if (!formData.multipleBids) {
          setValidationError("Please select yes or no")
          return false
        }
        break
      case "options":
        if (formData.options.length === 0) {
          setValidationError("Please select at least one option")
          return false
        }
        break
    }
    setValidationError(null)
    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) return
    
    if (currentStep < formSteps.length - 1) {
      setDirection("forward")
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection("backward")
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return
    
    setIsSubmitting(true)
    
    const leadData = {
      name: formData.name,
      phone: formData.phone.replace(/\D/g, ""), // Send clean phone number
      email: formData.email,
      projectOptions: formData.options.join(", "),
      budget: formData.budget,
      budgetLabel: formatBudget(formData.budget),
      multipleBids: formData.multipleBids,
      source: "Platinum AZ Turf Landing Page",
      offer: "$9.5k Flat Rate Package",
    }

    // Send to server-side API route which handles webhooks without CORS issues
    try {
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      })
      
      const result = await response.json()
      console.log("[v0] Lead submission result:", result)
    } catch (error) {
      console.error("[v0] Lead submission error:", error)
    }
    
    // Track Lead conversion event with Facebook Pixel
    if (typeof window !== "undefined" && (window as typeof window & { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as typeof window & { fbq: (...args: unknown[]) => void }).fbq("track", "Lead", {
        content_name: "Free Quote Request",
        content_category: "Hardscape Services",
      })
    }
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const currentField = formSteps[currentStep]
  const isLastStep = currentStep === formSteps.length - 1
  const currentValue =
    currentField.field === "options" || currentField.field === "budget"
      ? ""
      : formData[currentField.field as "name" | "phone" | "email" | "multipleBids"]
  const canProceed =
    currentField.field === "options"
      ? formData.options.length > 0
      : currentField.field === "budget"
        ? true
        : currentValue.trim() !== ""

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canProceed) {
      e.preventDefault()
      if (isLastStep) {
        handleSubmit()
      } else {
        handleNext()
      }
    }
  }

  return (
    <section className="relative">
      {/* Hero Section with Background */}
      <div className="relative min-h-[85vh] flex items-center pt-20 pb-32 lg:pb-40">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-patio.jpg"
            alt="Luxury Arizona backyard with custom hardscaping"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-12 lg:py-16">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            {/* Left Content */}
            <div className="text-primary-foreground lg:col-span-3">
              <h1 className="font-[family-name:var(--font-poppins)] text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance">
                No More Looking at an Ugly Backyard!{" "}
                <span className="text-[#FB9109]">Transform it, YOUR way.</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl opacity-90 leading-relaxed max-w-xl">
                No more, no less. See if your project fits the scope.
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-3xl font-bold text-[#FB9109]">15+</div>
                  <div className="text-xs opacity-80">Years Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#FB9109]">200+</div>
                  <div className="text-xs opacity-80">Projects Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#FB9109]">5★</div>
                  <div className="text-xs opacity-80">Google Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Form - Overlapping */}
      <div className="relative z-20 -mt-24 lg:-mt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-xl shadow-2xl p-5 md:p-6 max-w-sm mx-auto border border-border/50 overflow-hidden">
            {!isSubmitted ? (
              <div className="relative">
                {/* Form Header */}
                <div className="text-center mb-5">
                  <p className="font-[family-name:var(--font-poppins)] text-base md:text-lg font-extrabold text-foreground tracking-wide uppercase mb-2">
                    GET THE BACKYARD MAKE OVER.
                  </p>
                  <h2 className="font-[family-name:var(--font-poppins)] text-lg font-bold text-foreground">
                    <span className="text-[#FB9109]">Not Every Home Qualifies.</span> Yours Might.
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fill out the form below and we'll do the rest!
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex gap-2 mb-4">
                  {formSteps.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-all duration-300",
                        index <= currentStep ? "bg-accent" : "bg-muted"
                      )}
                    />
                  ))}
                </div>

                {/* Step Counter */}
                <div className="text-xs text-muted-foreground mb-2">
                  Step {currentStep + 1} of {formSteps.length}
                </div>

                {/* Question */}
                <h2 className="font-serif text-xl font-bold text-foreground mb-4">
                  {currentField.label}
                </h2>

                {/* Slide Container */}
                <div className="relative">
                  <div
                    className={cn(
                      "transition-all duration-300 ease-out",
                      direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left"
                    )}
                    key={currentStep}
                  >
                    {currentField.type === "options" ? (
                      <div className="grid grid-cols-2 gap-3">
                        {projectOptions.map((option) => {
                          const isSelected = formData.options.includes(option)
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setValidationError(null)
                                setFormData({
                                  ...formData,
                                  options: isSelected
                                    ? formData.options.filter((o) => o !== option)
                                    : [...formData.options, option],
                                })
                              }}
                              className={cn(
                                "p-3 rounded-lg border-2 text-sm font-medium transition-all",
                                isSelected
                                  ? "border-accent bg-accent/10 text-accent"
                                  : "border-border hover:border-accent/50 text-foreground"
                              )}
                            >
                              {option}
                            </button>
                          )
                        })}
                      </div>
                    ) : currentField.type === "budget" ? (
                      <BudgetSlider
                        value={formData.budget}
                        onChange={(budget) => setFormData((prev) => ({ ...prev, budget }))}
                      />
                    ) : currentField.type === "choice" ? (
                      <div className="grid grid-cols-2 gap-3">
                        {bidOptions.map((option) => {
                          const isSelected = formData.multipleBids === option
                          return (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => {
                                setValidationError(null)
                                setFormData({ ...formData, multipleBids: option })
                              }}
                              className={cn(
                                "p-3 rounded-lg border-2 text-sm font-medium transition-all",
                                isSelected
                                  ? "border-accent bg-accent/10 text-accent"
                                  : "border-border hover:border-accent/50 text-foreground"
                              )}
                            >
                              {option}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <Input
                        type={currentField.type}
                        placeholder={currentField.placeholder}
                        value={currentValue}
                        onChange={(e) => {
                          setValidationError(null)
                          const value = currentField.field === "phone" 
                            ? formatPhoneNumber(e.target.value)
                            : e.target.value
                          setFormData({ ...formData, [currentField.field]: value })
                        }}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className={cn(
                          "h-12 text-base",
                          validationError && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                    )}
                    {validationError && (
                      <p className="text-sm text-destructive mt-2">{validationError}</p>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 mt-6">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="h-11 px-4"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    type="button"
                    disabled={!canProceed || isSubmitting}
                    onClick={isLastStep ? handleSubmit : handleNext}
                    className={cn(
                      "flex-1 h-11 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground",
                      (!canProceed || isSubmitting) && "opacity-70"
                    )}
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : isLastStep ? (
                      "See If I Qualify"
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Thank You!
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  We&apos;ll call you within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
