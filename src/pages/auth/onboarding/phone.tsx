import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useFirebase } from '@/providers/firebase-provider';
import OnboardingLayout from './layout';

export default function PhoneStep() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useFirebase();
  const navigate = useNavigate();

  // Check if data already exists (for back navigation)
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data().phone) {
            setPhone(userDoc.data().phone);
          }
        } catch (err) {
          console.error('Error fetching user data', err);
        }
      }
    };
    
    fetchData();
  }, [currentUser]);

  // Handle back button
  const handleBack = () => {
    navigate('/auth/onboarding/name');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      
      // Simple validation
      const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
      if (!phoneRegex.test(phone)) {
        throw new Error('Please enter a valid phone number');
      }
      
      // Save to Firestore
      const userRef = doc(firestore, 'users', currentUser.uid);
      await setDoc(userRef, {
        phone,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      
      // Navigate to next step
      navigate('/auth/onboarding/address');
    } catch (err: any) {
      setError(err.message || 'Failed to save phone information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={2} totalSteps={4}>
      <h1 className="font-heading text-2xl font-bold mb-6 text-center">
        Your Contact Information
      </h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
            required
            placeholder="+1 (555) 123-4567"
          />
          <p className="mt-1 text-xs text-gray-500">
            We'll use this to contact you about your orders
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 bg-white text-black border border-black py-3 px-4 rounded-md font-medium hover:bg-gray-100 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-black/90 transition-all"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </form>
    </OnboardingLayout>
  );
}
