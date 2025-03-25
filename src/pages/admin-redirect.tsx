import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '@/providers/firebase-provider';
import { isUserAdmin } from '@/scripts/setup-admin-users';

export default function AdminRedirect() {
  const { currentUser, loading } = useFirebase();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const checkAdminAndRedirect = async () => {
      if (loading) return; // Wait until authentication state is loaded
      
      if (!currentUser) {
        // Not logged in, redirect to auth
        navigate('/auth', { state: { returnUrl: '/admin' } });
        return;
      }

      try {
        console.log("Checking admin status for:", currentUser.uid);
        // Check if user is admin
        const admin = await isUserAdmin(currentUser.uid);
        console.log("Is admin:", admin);
        
        if (admin) {
          // Successful admin verification, redirect to admin dashboard
          navigate('/admin');
        } else {
          // Not an admin, redirect to home with message
          console.log("Not an admin, redirecting to home");
          navigate('/', { 
            replace: true,
            state: { message: 'You do not have admin privileges' } 
          });
        }
      } catch (error) {
        console.error("Error verifying admin status:", error);
        navigate('/', { 
          replace: true,
          state: { message: 'Error verifying admin access' } 
        });
      } finally {
        setVerifying(false);
      }
    };

    checkAdminAndRedirect();
  }, [currentUser, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying admin privileges...</p>
        {!verifying && !loading && !currentUser && (
          <p className="text-red-500 mt-2">Authentication required. Redirecting...</p>
        )}
      </div>
    </div>
  );
}
