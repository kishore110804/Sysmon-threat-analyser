import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '@/providers/firebase-provider';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Check } from 'lucide-react';

export default function OnboardingCompleted() {
  const [userData, setUserData] = useState<any>(null);
  const { currentUser } = useFirebase();
  const navigate = useNavigate();

  // Fetch user data to display a personalized completion page
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (err) {
          console.error('Error fetching user data', err);
        }
      } else {
        // If not logged in, redirect to auth page
        navigate('/auth');
      }
    };
    
    fetchData();
  }, [currentUser, navigate]);

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#eceae4] py-16 px-4 relative">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow-md border border-black/10">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-[#1AFF00]/20 w-16 h-16 flex items-center justify-center">
              <Check size={32} className="text-[#1AFF00]" />
            </div>
          </div>
          
          <h1 className="font-heading text-2xl font-bold mb-2">
            Setup Complete!
          </h1>
          
          {userData && userData.firstName && (
            <p className="mb-6 text-lg">
              Welcome to X57, {userData.firstName}! Your account is now ready.
            </p>
          )}
          
          <p className="mb-8 text-gray-600">
            Thank you for completing your profile. You're all set to start exploring and shopping with X57.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleGoToHome}
              className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-black/90 transition-all"
            >
              Start Shopping
            </button>
            
            <button
              onClick={handleGoToProfile}
              className="w-full bg-white text-black border border-black py-3 px-4 rounded-md font-medium hover:bg-gray-100 transition-all"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#1AFF00]/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-10 w-40 h-40 rounded-full bg-black/5 blur-3xl -z-10"></div>
    </div>
  );
}
