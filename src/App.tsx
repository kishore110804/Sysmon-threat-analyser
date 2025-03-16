import { Route, Routes } from "react-router-dom"
import { TailwindIndicator } from "./components/tailwind-indicator"
import Home from "./pages/home"
import Hoods from "./pages/hoods"
import Kudos from "./pages/kudos"
import Cart from "./pages/cart"
import Profile from "./pages/profile"

function App() {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hoods" element={<Hoods />} />
            <Route path="/kudos" element={<Kudos />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
      <TailwindIndicator />
    </>
  )
}

export default App
