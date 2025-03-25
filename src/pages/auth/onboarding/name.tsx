import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { firestore, auth } from '@/lib/firebase';
import { useFirebase } from '@/providers/firebase-provider';
import OnboardingLayout from './layout';

export default function NameStep() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useFirebase();
  const navigate = useNavigate();
  
  // Check if the user already has data in Firestore
  useEffect(() => {
    const checkExistingData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // If we have complete user data, mark onboarding as complete and redirect
            if (userData.firstName && userData.lastName && userData.phone && userData.address && userData.role) {
              localStorage.setItem(`onboarding_complete_${currentUser.uid}`, 'true');
              navigate('/profile');
              return;
            }
            
            // Otherwise just populate what we have
            if (userData.firstName) setFirstName(userData.firstName);
            if (userData.lastName) setLastName(userData.lastName);
          }
        } catch (err) {
          console.error('Error fetching user data', err);
        }
      }
    };
    
    checkExistingData();
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      
      // Validation
      if (!firstName.trim() || !lastName.trim()) {
        throw new Error('Please enter both first and last name');
      }
      
      // Save to Firestore
      const userRef = doc(firestore, 'users', currentUser.uid);
      await setDoc(userRef, {
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      
      // Update profile display name
      await updateProfile(auth.currentUser!, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Navigate to next step
      navigate('/auth/onboarding/phone');
    } catch (err: any) {
      setError(err.message || 'Failed to save name information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={1} totalSteps={4}>
      <h1 className="font-heading text-2xl font-bold mb-6 text-center">
        Welcome! Let's Get to Know You
      </h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-black/90 transition-all"
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </OnboardingLayout>
  );
}
