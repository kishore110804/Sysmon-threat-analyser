import { useState, useEffect } from "react"

// Define a type for Theme, which can be 'dark', 'light', or 'system'
type Theme = "dark" | "light" | "system"

// The useTheme custom hook for managing the theme
const useTheme = (
  defaultTheme: Theme = "light", // Changed default to light
  storageKey: string = "vite-ui-theme",
) => {
  // useState to hold the current theme state
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  )

  // useEffect hook to apply changes whenever the theme state changes
  useEffect(() => {
    const root = window.document.documentElement
    // We're always using our custom light theme regardless of system preference
    // This ensures our #EFEBDF background color is always applied
    root.classList.remove("dark")
    root.classList.add("light")
    
    // Still save the user's preference even though we're always using light mode visually
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  return { theme, setTheme }
}

export default useTheme
