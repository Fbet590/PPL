import Image from "next/image"

export function HeroCollage() {
  return (
    <div className="relative mt-8 w-full max-w-xl">
      {/* Top image: large base photo. The small floating photo is anchored to its bottom edge. */}
      <div className="relative z-10 aspect-[4/3] w-full">
        <div className="relative h-full w-full overflow-hidden shadow-lg">
          <Image
            src="/images/collage-2.webp"
            alt="Aerial view of a modern geometric pool and lounge patio"
            fill
            priority
            sizes="(min-width: 1024px) 576px, 100vw"
            className="object-cover"
          />
        </div>

        {/* Middle image: floats on top, straddling the bottom edge of the top image */}
        <div className="absolute right-[4%] top-full z-20 aspect-video w-[42%] -translate-y-1/2 overflow-hidden border-4 border-white shadow-xl">
          <Image
            src="/images/collage-1.webp"
            alt="Backyard putting green with a modern pergola and paver patio"
            fill
            sizes="(min-width: 1024px) 240px, 42vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Bottom image: centered and pushed down so the floating photo never covers it */}
      <div className="relative z-0 mx-auto mt-[12%] aspect-[3/2] w-3/4 overflow-hidden shadow-md">
        <Image
          src="/images/collage-3.webp"
          alt="Pergola patio with an outdoor kitchen and lounge seating"
          fill
          sizes="(min-width: 1024px) 432px, 75vw"
          className="object-cover"
        />
      </div>
    </div>
  )
}
