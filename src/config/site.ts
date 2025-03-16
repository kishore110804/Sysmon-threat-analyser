export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "X57",
  description: "Premium fashion and accessories.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Hoods",
      href: "/hoods",
    },
    {
      title: "Kudos",
      href: "/kudos",
    },
    {
      title: "Cart",
      href: "/cart",
    },
    {
      title: "Profile",
      href: "/profile",
    },
  ],
  links: {
    youtube: "https://youtube.com/@m6io",
    github: "https://github.com/m6io/shadcn-vite-template",
    docs: "https://ui.shadcn.com",
  },
}
