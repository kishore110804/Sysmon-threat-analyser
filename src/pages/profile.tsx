import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/navbar';
import { firestore } from '@/lib/firebase';
import { useFirebase } from '@/providers/firebase-provider';
import { User, ArrowRight } from 'lucide-react';

export default function Profile() {
  const { currentUser, logOut, loading } = useFirebase();
  const [userData, setUserData] = useState<any>(null);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        setUserDataLoading(true);
        try {
          const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setUserDataLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (loading || userDataLoading) {
    return (
      <>
        <Navbar />
        <div className="container mt-20 flex justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="container grid items-center gap-6 pb-8 pt-16 md:py-20 min-h-screen">
        {currentUser ? (
          // User is signed in - show profile details
          <div className="grid gap-6">
            <div className="flex flex-col max-w-[980px] items-start gap-2">
              <h1 className="text-3xl font-extrabold font-heading leading-tight md:text-4xl">
                Welcome, {userData?.firstName || currentUser.displayName || currentUser.email}
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your account and preferences.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* User Information */}
              <div className="border border-border rounded-md p-6">
                <h2 className="font-heading text-xl mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="font-medium">Email:</p>
                    <p>{currentUser.email}</p>
                  </div>
                  
                  {userData?.firstName && (
                    <div className="grid grid-cols-2 gap-2">
                      <p className="font-medium">Name:</p>
                      <p>{userData.firstName} {userData.lastName}</p>
                    </div>
                  )}
                  
                  {userData?.phone && (
                    <div className="grid grid-cols-2 gap-2">
                      <p className="font-medium">Phone:</p>
                      <p>{userData.phone}</p>
                    </div>
                  )}
                  
                  {userData?.role && (
                    <div className="grid grid-cols-2 gap-2">
                      <p className="font-medium">Account Type:</p>
                      <p className="capitalize">{userData.role}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <p className="font-medium">Account created:</p>
                    <p>{new Date(currentUser.metadata.creationTime ?? Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              {/* Address Information - If available */}
              {userData?.address && (
                <div className="border border-border rounded-md p-6">
                  <h2 className="font-heading text-xl mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <p>{userData.address.street}</p>
                    <p>
                      {userData.address.city}, {userData.address.state} {userData.address.zipCode}
                    </p>
                    <p>{userData.address.country}</p>
                  </div>
                </div>
              )}
              
              {/* Order History - Placeholder */}
              <div className="border border-border rounded-md p-6 col-span-1 md:col-span-2">
                <h2 className="font-heading text-xl mb-4">Order History</h2>
                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
              </div>
              
              {/* Actions */}
              <div className="border border-border rounded-md p-6">
                <h2 className="font-heading text-xl mb-4">Account Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-black text-white rounded hover:bg-black/80 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // User is not signed in - show sign-in prompt
          <div className="max-w-md mx-auto w-full">
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
        )}
      </section>
    </>
  );
}
