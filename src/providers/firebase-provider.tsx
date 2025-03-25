import React, { createContext, useContext, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  setDoc,
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, firestore } from '../lib/firebase';

type FirebaseContextType = {
  currentUser: User | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, displayName: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logOut: () => Promise<void>;
  loading: boolean;
};

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName });

      // Create user document in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        firstName: displayName.split(' ')[0],
        lastName: displayName.split(' ').slice(1).join(' ') || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        onboardingCompleted: false
      });

      return userCredential;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      
      // Don't add scopes as they might be causing issues
      // Just set custom parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      console.log("Starting Google sign-in process...");
      const userCredential = await signInWithPopup(auth, provider);
      console.log("Sign-in successful:", userCredential.user.displayName);
      
      const user = userCredential.user;

      // Check if this is user's first sign in
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        // New user - create profile in Firestore
        const names = user.displayName ? user.displayName.split(' ') : ['', ''];
        const firstName = names[0] || '';
        const lastName = names.slice(1).join(' ') || '';
        
        console.log("Creating new user document for:", user.displayName);
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          firstName,
          lastName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          onboardingCompleted: false,
          authProvider: 'google'
        });
        
        // New users need to complete onboarding
        localStorage.removeItem(`onboarding_complete_${user.uid}`);
      } else {
        // Existing user - update last login and mark onboarding as complete
        console.log("Updating existing user document for:", user.displayName);
        await setDoc(userDocRef, {
          updatedAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        }, { merge: true });
        
        // Existing users can skip onboarding
        localStorage.setItem(`onboarding_complete_${user.uid}`, 'true');
      }

      return userCredential;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const logOut = async () => {
    if (currentUser) {
      // Remove onboarding completion status from localStorage
      localStorage.removeItem(`onboarding_complete_${currentUser.uid}`);
    }
    return signOut(auth);
  };

  const value = {
    currentUser,
    signIn,
    signUp,
    signInWithGoogle,
    logOut,
    loading
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
