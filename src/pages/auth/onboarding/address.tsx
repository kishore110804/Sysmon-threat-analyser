import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useFirebase } from '@/providers/firebase-provider';
import OnboardingLayout from './layout';

export default function AddressStep() {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
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
          if (userDoc.exists() && userDoc.data().address) {
            setAddress(prevState => ({
              ...prevState,
              ...userDoc.data().address
            }));
          }
        } catch (err) {
          console.error('Error fetching user data', err);
        }
      }
    };
    
    fetchData();
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle back button
  const handleBack = () => {
    navigate('/auth/onboarding/phone');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      
      // Validation
      if (!address.street || !address.city || !address.state || !address.zipCode) {
        throw new Error('Please fill all address fields');
      }
      
      // Save to Firestore
      const userRef = doc(firestore, 'users', currentUser.uid);
      await setDoc(userRef, {
        address,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      
      // Navigate to next step
      navigate('/auth/onboarding/role');
    } catch (err: any) {
      setError(err.message || 'Failed to save address information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={4}>
      <h1 className="font-heading text-2xl font-bold mb-6 text-center">
        Shipping Address
      </h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="street" className="block text-sm font-medium mb-1">Street Address</label>
          <input
            id="street"
            name="street"
            type="text"
            value={address.street}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
            <input
              id="city"
              name="city"
              type="text"
              value={address.city}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
            <input
              id="state"
              name="state"
              type="text"
              value={address.state}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium mb-1">ZIP Code</label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              value={address.zipCode}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
            <select
              id="country"
              name="country"
              value={address.country}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
              required
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              {/* Add more countries as needed */}
            </select>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
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
