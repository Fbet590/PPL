import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#1F150F] text-primary-foreground">
      <div className="container mx-auto px-4 pt-px pb-10">

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-70">
              © {new Date().getFullYear()} Platinum AZ Turf. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm opacity-70">
              <Link href="#" className="hover:opacity-100">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:opacity-100">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
