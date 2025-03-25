import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/navbar';
import { ArrowLeftIcon } from 'lucide-react';
import RoleBadge from './role-badge';

interface ProfileLayoutProps {
  userData: any;
  children: ReactNode;
  headerContent?: ReactNode;
}

export default function ProfileLayout({ userData, children, headerContent }: ProfileLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#eceae4] pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back navigation */}
          <Link 
            to="/" 
            className="inline-flex items-center mb-6 text-sm font-medium text-black/70 hover:text-black transition-colors"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Home
          </Link>

          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-black to-black/80 text-white p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-[#1AFF00]/20 flex items-center justify-center text-3xl font-bold text-[#1AFF00] border-4 border-[#1AFF00]/30">
                  {userData?.firstName?.charAt(0) || userData?.email?.charAt(0) || 'U'}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold font-heading">
                      {userData?.firstName && userData?.lastName 
                        ? `${userData.firstName} ${userData.lastName}` 
                        : userData?.displayName || userData?.email}
                    </h1>
                    
                    {/* Role Badge */}
                    {userData?.role && (
                      <RoleBadge role={userData.role} />
                    )}
                  </div>
                  
                  <p className="text-white/70 mt-1">{userData?.email}</p>
                  
                  {/* Custom header content for each profile type */}
                  {headerContent}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area - Different for each role */}
          {children}
        </div>
      </div>
    </>
  );
}
