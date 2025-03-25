import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useFirebase } from '@/providers/firebase-provider';
import OnboardingLayout from './layout';

type UserRole = 'customer' | 'reseller' | 'designer';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
}

const roleOptions: RoleOption[] = [
  {
    id: 'customer',
    title: 'Customer',
    description: 'I want to purchase items for personal use'
  },
  {
    id: 'reseller',
    title: 'Reseller',
    description: 'I want to buy and resell X57 products'
  },
  {
    id: 'designer',
    title: 'Designer',
    description: 'I want to collaborate on new designs'
  }
];

export default function RoleStep() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
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
          if (userDoc.exists() && userDoc.data().role) {
            setSelectedRole(userDoc.data().role as UserRole);
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
    navigate('/auth/onboarding/address');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      
      // Save to Firestore
      const userRef = doc(firestore, 'users', currentUser.uid);
      await setDoc(userRef, {
        role: selectedRole,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      
      // Save completion status to localStorage
      localStorage.setItem(`onboarding_complete_${currentUser.uid}`, 'true');
      
      // Navigate to completed page
      navigate('/auth/onboarding/completed');
    } catch (err: any) {
      setError(err.message || 'Failed to save role information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={4} totalSteps={4}>
      <h1 className="font-heading text-2xl font-bold mb-6 text-center">
        How would you like to use X57?
      </h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          {roleOptions.map((role) => (
            <div key={role.id} className="relative">
              <input
                type="radio"
                id={role.id}
                name="role"
                className="hidden peer"
                checked={selectedRole === role.id}
                onChange={() => setSelectedRole(role.id)}
              />
              <label
                htmlFor={role.id}
                className="block border border-gray-300 rounded-lg p-4 cursor-pointer transition-all
                  peer-checked:border-[#1AFF00] peer-checked:ring-2 peer-checked:ring-[#1AFF00]/50
                  hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="w-5 h-5 border border-gray-300 rounded-full mr-3 flex-shrink-0
                    peer-checked:bg-[#1AFF00] peer-checked:border-[#1AFF00]">
                    {selectedRole === role.id && (
                      <div className="w-3 h-3 bg-white rounded-full m-auto"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{role.title}</div>
                    <div className="text-sm text-gray-500">{role.description}</div>
                  </div>
                </div>
              </label>
              {selectedRole === role.id && (
                <div className="absolute top-0 right-0 w-4 h-4 bg-[#1AFF00] rounded-full -mt-1 -mr-1"></div>
              )}
            </div>
          ))}
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
            {loading ? 'Saving...' : 'Complete'}
          </button>
        </div>
      </form>
    </OnboardingLayout>
  );
}
