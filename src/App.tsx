import { Route, Routes } from "react-router-dom"
import { FirebaseProvider } from "./providers/firebase-provider"

import Home from "./pages/home"
import Hoods from "./pages/hoods"
import Kudos from "./pages/kudos"
import Cart from "./pages/cart"
import Profile from "./pages/profile"
import CoCreations from "./pages/cocreations"

// Policy Pages
import TermsOfService from "./pages/policies/terms"
import PrivacyPolicy from "./pages/policies/privacy"
import ReturnPolicy from "./pages/policies/returns"
import ShippingPolicy from "./pages/policies/shipping"

// Make Money Pages
import ShareAndEarn from "./pages/makemoney/share"
import Collaborate from "./pages/makemoney/collaborate"
import SalesExecutive from "./pages/makemoney/sales"

// Clothing Pages
import HoodFits from "./pages/clothingpages/hoodfits"
import MiniMoves from "./pages/clothingpages/minimoves"
import EzTees from "./pages/clothingpages/eztees"
import SwagLoops from "./pages/clothingpages/swagloops"
import CapsVault from "./pages/clothingpages/capsvault"
import FlowPants from "./pages/clothingpages/flowpants"

function App() {
  return (
    <FirebaseProvider>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hoods" element={<Hoods />} />
            <Route path="/kudos" element={<Kudos />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cocreations" element={<CoCreations />} />
            
            {/* Policy Pages */}
            <Route path="/policies/terms" element={<TermsOfService />} />
            <Route path="/policies/privacy" element={<PrivacyPolicy />} />
            <Route path="/policies/returns" element={<ReturnPolicy />} />
            <Route path="/policies/shipping" element={<ShippingPolicy />} />
            
            {/* Make Money Pages */}
            <Route path="/makemoney/share" element={<ShareAndEarn />} />
            <Route path="/makemoney/collaborate" element={<Collaborate />} />
            <Route path="/makemoney/sales" element={<SalesExecutive />} />
            
            {/* Clothing Pages */}
            <Route path="/clothingpages/hoodfits" element={<HoodFits />} />
            <Route path="/clothingpages/minimoves" element={<MiniMoves />} />
            <Route path="/clothingpages/eztees" element={<EzTees />} />
            <Route path="/clothingpages/swagloops" element={<SwagLoops />} />
            <Route path="/clothingpages/capsvault" element={<CapsVault />} />
            <Route path="/clothingpages/flowpants" element={<FlowPants />} />
          </Routes>
        </div>
      </div>
    </FirebaseProvider>
  )
}

export default App
