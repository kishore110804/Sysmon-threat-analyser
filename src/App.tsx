import { Route, Routes } from "react-router-dom"
import { FirebaseProvider } from "./providers/firebase-provider"

import Home from "./pages/home"
import Hoods from "./pages/hoods"
import Kudos from "./pages/kudos"
import Cart from "./pages/cart"
import Profile from "./pages/profile"
import CoCreations from "./pages/cocreations"

// Auth Pages
import AuthPage from "./pages/auth"
import NameStep from "./pages/auth/onboarding/name"
import PhoneStep from "./pages/auth/onboarding/phone"
import AddressStep from "./pages/auth/onboarding/address"
import RoleStep from "./pages/auth/onboarding/role"
import OnboardingCompleted from "./pages/auth/onboarding/completed"

// Designer Pages
import DesignerApplication from "./pages/designer/apply"

// Policy Pages
import TermsOfService from "./pages/policies/terms"
import PrivacyPolicy from "./pages/policies/privacy"
import ReturnPolicy from "./pages/policies/returns"
import ShippingPolicy from "./pages/policies/shipping"

// Make Money Pages
import ShareAndEarn from "./pages/makemoney/share"
import CollaborateForm1 from "./pages/makemoney/collaborate/page1"
import CollaborateForm2 from "./pages/makemoney/collaborate/page2"
import SalesExecutive from "./pages/makemoney/sales"

// Clothing Pages
import HoodFits from "./pages/clothingpages/hoodfits"
import MiniMoves from "./pages/clothingpages/minimoves"
import EzTees from "./pages/clothingpages/eztees"
import SwagLoops from "./pages/clothingpages/swagloops"
import CapsVault from "./pages/clothingpages/capsvault"
import FlowPants from "./pages/clothingpages/flowpants"

// Admin Pages
import AdminRedirect from './pages/admin-redirect';
import AdminDashboard from './pages/admin/index';
import AdminSettings from './pages/admin/settings/index';
import NewProductPage from './pages/admin/products/new';
import DesignerApplicationsList from './pages/admin/designers/applications/index';
import CommissionsPage from './pages/admin/finance/commissions';

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
            
            {/* Designer Routes */}
            <Route path="/designer/apply" element={<DesignerApplication />} />
            
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/onboarding/name" element={<NameStep />} />
            <Route path="/auth/onboarding/phone" element={<PhoneStep />} />
            <Route path="/auth/onboarding/address" element={<AddressStep />} />
            <Route path="/auth/onboarding/role" element={<RoleStep />} />
            <Route path="/auth/onboarding/completed" element={<OnboardingCompleted />} />
            
            {/* Policy Pages */}
            <Route path="/policies/terms" element={<TermsOfService />} />
            <Route path="/policies/privacy" element={<PrivacyPolicy />} />
            <Route path="/policies/returns" element={<ReturnPolicy />} />
            <Route path="/policies/shipping" element={<ShippingPolicy />} />
            
            {/* Make Money Pages */}
            <Route path="/makemoney/share" element={<ShareAndEarn />} />
            <Route path="/makemoney/collaborate/page1" element={<CollaborateForm1/>} />
            <Route path="/makemoney/collaborate/page2" element={<CollaborateForm2/>} />
            <Route path="/makemoney/sales" element={<SalesExecutive />} />
            
            {/* Clothing Pages */}
            <Route path="/clothingpages/hoodfits" element={<HoodFits />} />
            <Route path="/clothingpages/minimoves" element={<MiniMoves />} />
            <Route path="/clothingpages/eztees" element={<EzTees />} />
            <Route path="/clothingpages/swagloops" element={<SwagLoops />} />
            <Route path="/clothingpages/capsvault" element={<CapsVault />} />
            <Route path="/clothingpages/flowpants" element={<FlowPants />} />

            {/* Admin Pages */}
            <Route path="/admin-redirect" element={<AdminRedirect />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/products/new" element={<NewProductPage />} />
            <Route path="/admin/designers/applications" element={<DesignerApplicationsList />} />
            <Route path="/admin/finance/commissions" element={<CommissionsPage />} />
          </Routes>
        </div>
      </div>
    </FirebaseProvider>
  )
}

export default App
