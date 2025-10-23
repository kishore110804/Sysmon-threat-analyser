export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Sysmon Threat Analyzer",
  description: "Threat detection and analysis platform mapping Sysmon logs to MITRE ATT&CK techniques.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
  ],
  links: {
    github: "https://github.com/kishore110804",
    mitre: "https://attack.mitre.org",
    docs: "https://docs.microsoft.com/en-us/sysinternals/downloads/sysmon",
  },
}
