import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"
import { Link, useLocation } from "react-router-dom"

export function SiteHeader() {
  const location = useLocation()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Icons.logo className="h-5 w-5 text-white" />
          <span className="text-sm font-semibold tracking-tight text-white">{siteConfig.name}</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              location.pathname === "/about"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            About
          </Link>
          
          {/* External Links */}
          <div className="ml-2 flex items-center gap-1 border-l border-white/10 pl-2">
            <Link
              to={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Icons.gitHub className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              to={siteConfig.links.mitre}
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Icons.target className="h-4 w-4" />
              <span className="sr-only">MITRE ATT&CK</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
