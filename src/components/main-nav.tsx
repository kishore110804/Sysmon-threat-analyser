import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { NavItem } from "@/types/nav"
import { Link, useLocation } from "react-router-dom"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const location = useLocation()
  
  return (
    <div className="flex items-center gap-6 md:gap-8">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Icons.logo className="h-5 w-5 text-white" />
        <span className="text-sm font-semibold tracking-tight text-white">{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="hidden md:flex items-center gap-1">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "text-white"
                      : "text-gray-400 hover:text-white",
                    item.disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  {item.title}
                </Link>
              ),
          )}
        </nav>
      ) : null}
    </div>
  )
}
