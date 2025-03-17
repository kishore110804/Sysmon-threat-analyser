import { Route, Routes } from "react-router-dom"
import { TailwindIndicator } from "./components/tailwind-indicator"
import Home from "./pages/home"
import Hoods from "./pages/hoods"
import Kudos from "./pages/kudos"
import Cart from "./pages/cart"
import Profile from "./pages/profile"

// Policy Pages
import TermsOfService from "./pages/policies/terms"
import PrivacyPolicy from "./pages/policies/privacy"
import ReturnPolicy from "./pages/policies/returns"
import ShippingPolicy from "./pages/policies/shipping"

// Make Money Pages
import ShareAndEarn from "./pages/makemoney/share"
import Collaborate from "./pages/makemoney/collaborate"
import SalesExecutive from "./pages/makemoney/sales"

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
            
            {/* Policy Pages */}
            <Route path="/policies/terms" element={<TermsOfService />} />
            <Route path="/policies/privacy" element={<PrivacyPolicy />} />
            <Route path="/policies/returns" element={<ReturnPolicy />} />
            <Route path="/policies/shipping" element={<ShippingPolicy />} />
            
            {/* Make Money Pages */}
            <Route path="/makemoney/share" element={<ShareAndEarn />} />
            <Route path="/makemoney/collaborate" element={<Collaborate />} />
            <Route path="/makemoney/sales" element={<SalesExecutive />} />
          </Routes>
        </div>
      </div>
      <TailwindIndicator />
    </>
  )
}

export default App
