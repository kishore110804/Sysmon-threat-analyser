import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AuthForm from '@/components/auth/auth-form';
import { useFirebase } from '@/providers/firebase-provider';

export default function Profile() {
  const { currentUser, logOut, loading } = useFirebase();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    console.log("Current user status:", !!currentUser);
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-20 flex justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="container grid items-center gap-6 pb-8 pt-16 md:py-20">
        {currentUser ? (
          <div className="grid gap-6">
            <div className="flex flex-col max-w-[980px] items-start gap-2">
              <h1 className="text-3xl font-extrabold font-heading leading-tight md:text-4xl">
                Welcome, {currentUser.displayName || currentUser.email}
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your account and preferences.
              </p>
            </div>
            
            <div className="grid gap-6">
              <div className="border border-border rounded-md p-6">
                <h2 className="font-heading text-xl mb-4">Account Information</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                  <p><span className="font-medium">Account created:</span> {currentUser.metadata.creationTime}</p>
                </div>
              </div>
              
              <div className="border border-border rounded-md p-6">
                <h2 className="font-heading text-xl mb-4">Actions</h2>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-black/80 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-heading font-bold mb-2">Account Access</h1>
              <p className="text-muted-foreground">
                {authMode === 'login' ? "Sign in to access your account" : "Create a new account"}
              </p>
            </div>
            
            <AuthForm mode={authMode} />
            
            <div className="mt-4 text-center">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="text-[#1AFF00] hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-[#1AFF00] hover:underline"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
