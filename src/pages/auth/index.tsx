import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 

} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { auth } from '@/lib/firebase';
import { useFirebase } from '@/providers/firebase-provider';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, signInWithGoogle } = useFirebase();  // Add signInWithGoogle here
  
  // If user is already signed in, redirect appropriately
  useEffect(() => {
    if (currentUser) {
      // Check if user exists in Firestore
      const checkUserData = async () => {
        try {
          const userDocRef = doc(firestore, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            // If user exists in database, go directly to profile
            navigate('/profile');
          } else {
            // If user doesn't exist in database, start onboarding
            navigate('/auth/onboarding/name');
          }
        } catch (err) {
          console.error('Error checking user data:', err);
          // On error, default to onboarding
          navigate('/auth/onboarding/name');
        }
      };
      
      checkUserData();
    }
  }, [currentUser, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in with email and password
        await signInWithEmailAndPassword(auth, email, password);
        // Redirect handled by useEffect
      } else {
        // Validation for signup
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        // Create new account
        await createUserWithEmailAndPassword(auth, email, password);
        // Redirect handled by useEffect
      }
    } catch (err: any) {
      let errorMessage = 'Authentication error';
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);

    try {
      console.log("Initiating Google Authentication...");
      await signInWithGoogle();
      console.log("Google Authentication successful, waiting for redirect...");
      // Redirect handled by useEffect
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      let errorMessage = 'Google authentication error';
      
      // More specific error messages with solutions
      if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by your browser. Please allow popups for this site and try again.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Authentication was cancelled. Please try again.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Another authentication is in progress. Please wait.';
      } else if (err.code === 'auth/configuration-not-found') {
        errorMessage = 'Authentication configuration error. Please contact support.';
      } else if (err.code === 'auth/internal-error') {
        errorMessage = 'An internal error occurred. Please try again later.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eceae4] py-16 px-4 relative">
      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-black hover:text-black/70 transition-colors absolute top-8 left-8"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="max-w-md mx-auto mt-16">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Join X57'}
          </h1>
          <p className="text-black/70">
            {isLogin 
              ? 'Sign in to access your account and continue shopping' 
              : 'Create an account to get started with X57'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="bg-white p-8 rounded-lg shadow-md border border-black/10">
          {/* Google Auth Button */}
          <button 
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-black py-3 px-4 rounded-md font-medium mb-6 hover:bg-gray-50 transition-all"
          >
            <FcGoogle size={20} />
            <span>{isLogin ? 'Sign in with Google' : 'Sign up with Google'}</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email Auth Form */}
          <form onSubmit={handleEmailAuth}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
              />
            </div>

            {!isLogin && (
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-black/90 transition-all mb-4"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {/* Toggle between login and signup */}
          <div className="text-center mt-4">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button 
                  onClick={() => setIsLogin(false)}
                  className="text-[#1AFF00] hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  onClick={() => setIsLogin(true)}
                  className="text-[#1AFF00] hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#1AFF00]/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-10 w-40 h-40 rounded-full bg-black/5 blur-3xl -z-10"></div>
    </div>
  );
}
