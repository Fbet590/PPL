import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const leadData = await request.json()
    
    console.log("[v0] Received lead data:", leadData)

    // Add timestamp
    const dataWithTimestamp = {
      ...leadData,
      timestamp: new Date().toISOString(),
    }

    // Send to both webhooks in parallel from server-side (no CORS issues)
    const results = await Promise.allSettled([
      // GoHighLevel webhook
      fetch("https://services.leadconnectorhq.com/hooks/qPfcbKLjQTVPRhcC22Qq/webhook-trigger/ddf35372-3213-4ab5-811e-5d0b2d7efc4d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithTimestamp),
      }).then(async (res) => {
        const text = await res.text().catch(() => "")
        console.log("[v0] GoHighLevel response:", res.status, text)
        return { status: res.status, body: text }
      }),
      
      // Zapier webhook
      fetch("https://hooks.zapier.com/hooks/catch/24750736/4y2k7sq/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithTimestamp),
      }).then(async (res) => {
        const text = await res.text().catch(() => "")
        console.log("[v0] Zapier response:", res.status, text)
        return { status: res.status, body: text }
      }),
    ])

    console.log("[v0] Webhook results:", results)

    // Check results
    const ghlResult = results[0]
    const zapierResult = results[1]

    return NextResponse.json({
      success: true,
      ghl: ghlResult.status === "fulfilled" ? ghlResult.value : { error: ghlResult.reason?.message },
      zapier: zapierResult.status === "fulfilled" ? zapierResult.value : { error: zapierResult.reason?.message },
    })
  } catch (error) {
    console.error("[v0] API route error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit lead" },
      { status: 500 }
    )
  }
}
