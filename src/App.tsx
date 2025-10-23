import { Route, Routes } from "react-router-dom"
import { FirebaseProvider } from "./providers/firebase-provider"
import { SiteHeader } from "./components/site-header"

// Pages
import Home from "./pages/home"
import About from "./pages/about"

function App() {
  return (
    <FirebaseProvider>
      <div className="relative flex min-h-screen flex-col bg-black">
        <SiteHeader />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </FirebaseProvider>
  )
}

export default App
