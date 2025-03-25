import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '@/providers/firebase-provider';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingLayout({ 
  children, 
  currentStep, 
  totalSteps 
}: OnboardingLayoutProps) {
  const { currentUser, loading } = useFirebase();
  const navigate = useNavigate();
  
  // Protect onboarding routes - redirect to auth if not signed in
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/auth');
    }
  }, [currentUser, loading, navigate]);

  // Calculate progress percentage
  const progressPercentage = ((currentStep) / totalSteps) * 100;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#eceae4] flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eceae4] py-16 px-4 relative">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/X57.svg" alt="X57 Logo" className="h-12" />
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium">{Math.floor(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-[#1AFF00] h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-black/10">
          {children}
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#1AFF00]/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-10 w-40 h-40 rounded-full bg-black/5 blur-3xl -z-10"></div>
    </div>
  );
}
