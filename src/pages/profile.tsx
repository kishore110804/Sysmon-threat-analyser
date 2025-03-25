import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useFirebase } from '@/providers/firebase-provider';
import { User, ArrowRight, Shield, Cog } from 'lucide-react';
import CustomerProfile from './profile/customer-profile';
import ResellerProfile from './profile/reseller-profile';
import DesignerProfile from './profile/designer-profile';
import Navbar from '@/components/navbar';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData({ 
              ...userDoc.data(),
              id: currentUser.uid,
              email: currentUser.email
            });
          } else {
            // User document doesn't exist, redirect to onboarding
            navigate('/auth/onboarding/name');
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#eceae4] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gray-300 mb-4"></div>
            <div className="h-4 w-48 bg-gray-300 rounded"></div>
          </div>
        </div>
      </>
    );
  }

  // Not logged in state
  if (!currentUser) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#eceae4] pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="bg-white p-8 rounded-lg shadow-md border border-black/10 text-center">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-black/5 flex items-center justify-center">
                  <User size={32} className="text-black/60" />
                </div>
              </div>
              
              <h1 className="text-3xl font-heading font-bold mb-4">Sign In Required</h1>
              
              <p className="text-black/70 mb-8">
                Please sign in to view your profile and manage your account.
              </p>
              
              <Link 
                to="/auth" 
                className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-black/90 transition-all inline-flex items-center justify-center gap-2 group"
              >
                Sign In / Create Account
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Render the appropriate profile based on user role
  const userRole = userData?.role?.toLowerCase() || 'customer';

  if (userData?.role === 'admin') {
    return (
      <div className="mb-6 bg-black text-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-bold mb-3 flex items-center">
          <Shield size={20} className="mr-2" />
          Admin Access
        </h2>
        <p className="mb-4">You have administrator privileges. Access the admin dashboard to manage the platform.</p>
        <Link 
          to="/admin" 
          className="inline-flex items-center px-4 py-2 bg-[#1AFF00] text-black rounded-md hover:bg-[#1AFF00]/80 transition-colors font-medium"
        >
          <Cog size={16} className="mr-2" />
          Access Admin Dashboard
        </Link>
      </div>
    );
  }

  switch (userRole) {
    case 'designer':
      return <DesignerProfile userData={userData} />;
    case 'reseller':
      return <ResellerProfile userData={userData} />;
    case 'customer':
    default:
      return <CustomerProfile userData={userData} />;
  }
}
