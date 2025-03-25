import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package2, MapPin, History, LogOut, Brush, Upload, PlusCircle, Award, CheckCircle2, Clock, FileCheck, Mail, DollarSign, BadgeCheck, ArrowRight } from 'lucide-react';
import { useFirebase } from '@/providers/firebase-provider';
import ProfileLayout from '@/components/profile/profile-layout';

export default function DesignerProfile({ userData }: { userData: any }) {
  const { logOut } = useFirebase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };
  
  // Determine designer verification status (for demo, all are unverified by default)
  const verificationStatus = userData?.designerVerification?.status || 'unverified';
  const isVerified = verificationStatus === 'verified';
  
  const headerContent = (
    <div className="mt-4 flex flex-wrap gap-4">
      <div className="text-white/80 flex items-center">
        <Brush size={16} className="mr-1" /> 
        <span>{userData?.designs?.length || 0} Designs</span>
      </div>
      <div className="text-white/80 flex items-center">
        <Award size={16} className="mr-1" /> 
        <span>Designer Status: {isVerified ? (
          <span className="text-[#1AFF00] flex items-center gap-1">
            Verified <BadgeCheck size={14} />
          </span>
        ) : (
          <span className="text-yellow-300">Unverified</span>
        )}</span>
      </div>
      {isVerified && (
        <div className="text-white/80 flex items-center">
          <DollarSign size={16} className="mr-1" /> 
          <span>Earnings: $0.00</span>
        </div>
      )}
      <div className="text-white/80 flex items-center">
        <User size={16} className="mr-1" /> 
        <span>Member since {new Date(userData?.createdAt?.seconds * 1000).toLocaleDateString()}</span>
      </div>
    </div>
  );

  return (
    <ProfileLayout userData={userData} headerContent={headerContent}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-4">
            <nav>
              <ul>
                <li>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-colors ${
                      activeTab === 'dashboard' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'
                    }`}
                  >
                    <CheckCircle2 size={18} className={`mr-3 ${activeTab === 'dashboard' ? 'text-[#1AFF00]' : 'text-black/70'}`} />
                    Designer Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('designs')}
                    className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-colors ${
                      activeTab === 'designs' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'
                    }`}
                  >
                    <Brush size={18} className={`mr-3 ${activeTab === 'designs' ? 'text-[#1AFF00]' : 'text-black/70'}`} />
                    My Designs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('account')}
                    className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-colors ${
                      activeTab === 'account' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'
                    }`}
                  >
                    <User size={18} className={`mr-3 ${activeTab === 'account' ? 'text-[#1AFF00]' : 'text-black/70'}`} />
                    Account Information
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-colors ${
                      activeTab === 'orders' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'
                    }`}
                  >
                    <History size={18} className={`mr-3 ${activeTab === 'orders' ? 'text-[#1AFF00]' : 'text-black/70'}`} />
                    Order History
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('address')}
                    className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-colors ${
                      activeTab === 'address' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'
                    }`}
                  >
                    <MapPin size={18} className={`mr-3 ${activeTab === 'address' ? 'text-[#1AFF00]' : 'text-black/70'}`} />
                    Shipping Address
                  </button>
                </li>
                <li className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-3 px-4 rounded-lg flex items-center text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} className="mr-3" />
                    Sign Out
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-xl font-bold font-heading mb-4">Designer Dashboard</h2>
                
                {/* Designer Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-4 shadow-sm">
                    <p className="text-green-600 text-sm font-medium mb-1">Designs</p>
                    <p className="text-2xl font-bold">{userData?.designs?.length || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4 shadow-sm">
                    <p className="text-blue-600 text-sm font-medium mb-1">Lifetime Sales</p>
                    <p className="text-2xl font-bold">0 units</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-4 shadow-sm">
                    <p className="text-purple-600 text-sm font-medium mb-1">Earnings</p>
                    <p className="text-2xl font-bold">$0.00</p>
                  </div>
                </div>
                
                {/* Designer Verification Process */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center">
                      <BadgeCheck size={20} className="mr-2 text-[#1AFF00]" />
                      Become a Verified Designer
                    </h3>
                    {isVerified ? (
                      <span className="bg-[#1AFF00]/20 text-[#1AFF00] text-sm py-1 px-3 rounded-full flex items-center">
                        <BadgeCheck size={14} className="mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-600 text-sm py-1 px-3 rounded-full">
                        {verificationStatus === 'pending' ? 'Under Review' : 'Not Started'}
                      </span>
                    )}
                  </div>
                  
                  {/* Timeline showing verification steps */}
                  <div className="border border-gray-100 rounded-lg p-5 bg-gray-50">
                    <ol className="relative border-l border-gray-300 ml-3">
                      {/* Step 1: Submit Application */}
                      <li className="mb-8 ml-6">
                        <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 
                          ${verificationStatus === 'unverified' 
                            ? 'bg-gray-100 border border-gray-300' 
                            : 'bg-[#1AFF00] text-white'}`}
                        >
                          {verificationStatus === 'unverified' ? '1' : <CheckCircle2 size={14} />}
                        </span>
                        <h3 className="font-semibold mb-1 ml-2">Submit Designer Application</h3>
                        <p className="text-sm text-gray-600 mb-2 ml-2">
                          Fill out the application form with your portfolio and design samples.
                        </p>
                        {verificationStatus === 'unverified' && (
                          <button 
                            onClick={() => navigate('/designer/apply')} 
                            className="ml-2 bg-black text-white py-2 px-4 rounded text-sm hover:bg-black/80 transition-colors"
                          >
                            Start Application
                          </button>
                        )}
                      </li>
                      
                      {/* Step 2: Design Review */}
                      <li className="mb-8 ml-6">
                        <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 
                          ${verificationStatus === 'unverified' 
                            ? 'bg-gray-100 border border-gray-300' 
                            : verificationStatus === 'pending' ? 'bg-yellow-400 text-white' : 'bg-[#1AFF00] text-white'}`}
                        >
                          {verificationStatus === 'unverified' ? '2' : 
                           verificationStatus === 'pending' ? <Clock size={14} /> : 
                           <CheckCircle2 size={14} />}
                        </span>
                        <h3 className="font-semibold mb-1 ml-2">Design Review</h3>
                        <p className="text-sm text-gray-600 ml-2">
                          Our design team reviews your submission for quality and originality. This process takes 7-10 business days.
                        </p>
                        {verificationStatus === 'pending' && (
                          <div className="ml-2 mt-2 flex items-center text-yellow-600 bg-yellow-50 p-2 rounded">
                            <Clock size={14} className="mr-2" />
                            <span className="text-xs">Under review - submitted on {new Date().toLocaleDateString()}</span>
                          </div>
                        )}
                      </li>
                      
                      {/* Step 3: Feedback & Iterations */}
                      <li className="mb-8 ml-6">
                        <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 
                          ${verificationStatus === 'unverified' || verificationStatus === 'pending'
                            ? 'bg-gray-100 border border-gray-300' 
                            : verificationStatus === 'feedback' ? 'bg-blue-500 text-white' : 'bg-[#1AFF00] text-white'}`}
                        >
                          {verificationStatus === 'unverified' || verificationStatus === 'pending' ? '3' : 
                           verificationStatus === 'feedback' ? <Mail size={14} /> : 
                           <CheckCircle2 size={14} />}
                        </span>
                        <h3 className="font-semibold mb-1 ml-2">Feedback & Iterations</h3>
                        <p className="text-sm text-gray-600 ml-2">
                          We may request changes or improvements to ensure your designs meet our quality standards.
                        </p>
                      </li>
                      
                      {/* Step 4: Verification */}
                      <li className="ml-6">
                        <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 
                          ${verificationStatus === 'verified' 
                            ? 'bg-[#1AFF00] text-white'
                            : 'bg-gray-100 border border-gray-300'}`}
                        >
                          {verificationStatus === 'verified' ? <BadgeCheck size={14} /> : '4'}
                        </span>
                        <h3 className="font-semibold mb-1 ml-2">Verification Complete</h3>
                        <p className="text-sm text-gray-600 ml-2">
                          Your designs are approved! You can now sell through X57 and participate in the Kudos! board.
                        </p>
                        {verificationStatus === 'verified' && (
                          <div className="flex gap-3 mt-3 ml-2">
                            <Link
                              to="/kudos"
                              className="bg-[#1AFF00] text-black py-2 px-4 rounded text-sm hover:bg-[#1AFF00]/80 transition-colors"
                            >
                              View Kudos! Board
                            </Link>
                            <Link
                              to="/designer/earnings"
                              className="bg-black text-white py-2 px-4 rounded text-sm hover:bg-black/80 transition-colors"
                            >
                              View Earnings Details
                            </Link>
                          </div>
                        )}
                      </li>
                    </ol>
                  </div>
                </div>
                
                {/* Commission & Earnings Info - Only visible to verified designers */}
                {isVerified && (
                  <div className="border border-[#1AFF00]/20 rounded-lg p-6 bg-[#1AFF00]/5 mb-8">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <DollarSign size={18} className="text-[#1AFF00]" />
                      Commission Structure
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm mb-4">
                      <li>Earn <span className="font-medium">15% commission</span> on each product sold with your designs</li>
                      <li>Additional <span className="font-medium">5% bonus</span> for featured designs on the Kudos! board</li>
                      <li>Lifetime earnings for as long as products with your designs are sold</li>
                      <li>Monthly payouts via direct deposit or PayPal</li>
                    </ul>
                    <Link 
                      to="/designer/earnings" 
                      className="text-sm text-[#1AFF00] hover:underline flex items-center gap-1"
                    >
                      View detailed earnings dashboard
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
                
                {/* Portfolio Feature Teaser */}
                <div className="border border-black/10 bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold flex items-center gap-2">
                      <FileCheck size={18} />
                      Designer Portfolio
                    </h3>
                    <span className="text-xs bg-black/10 text-black/70 px-2 py-1 rounded-full">Coming Soon</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Soon you'll be able to showcase your design portfolio directly on X57, giving you 
                    more visibility and helping you connect with potential clients and collaborators.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'designs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold font-heading">My Designs</h2>
                  <button className="flex items-center gap-2 bg-[#1AFF00] hover:bg-[#1AFF00]/80 text-black font-medium py-2 px-4 rounded-lg transition-colors">
                    <PlusCircle size={16} />
                    New Design
                  </button>
                </div>
                
                {/* Design Submission Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8">
                  <Upload size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Submit New Design</h3>
                  <p className="text-gray-500 mb-4">Upload your designs for X57 collaboration and earn royalties</p>
                  <div className="flex justify-center">
                    <button className="bg-black text-white py-2 px-4 rounded hover:bg-black/80 transition-colors">
                      Upload Artwork
                    </button>
                  </div>
                </div>
                
                {/* Design Submissions */}
                <div>
                  <h3 className="font-medium text-gray-600 mb-3">Previous Submissions</h3>
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                    <p>You haven't submitted any designs yet.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div>
                <h2 className="text-xl font-bold font-heading mb-4">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">First Name</label>
                    <div className="text-lg font-medium">{userData?.firstName || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                    <div className="text-lg font-medium">{userData?.lastName || 'Not provided'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <div className="text-lg font-medium">{userData?.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                    <div className="text-lg font-medium">{userData?.phone || 'Not provided'}</div>
                  </div>
                </div>
                
                {/* Designer-specific information */}
                {isVerified && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-medium mb-3">Designer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Verification Date</label>
                        <div className="text-base">{new Date().toLocaleDateString()}</div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Designer ID</label>
                        <div className="text-base">DSG-{userData?.uid?.substring(0, 6).toUpperCase()}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold font-heading mb-4">Order History</h2>
                <div className="text-center py-8 text-gray-500">
                  <Package2 size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>You haven't placed any orders yet.</p>
                  <button className="mt-4 bg-black text-white py-2 px-4 rounded hover:bg-black/80 transition-colors">
                    Start Shopping
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div>
                <h2 className="text-xl font-bold font-heading mb-4">Shipping Address</h2>
                {userData?.address ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="mb-1">{userData.address.street}</p>
                    <p className="mb-1">{userData.address.city}, {userData.address.state} {userData.address.zipCode}</p>
                    <p>{userData.address.country}</p>
                    <button className="mt-4 text-sm text-[#1AFF00] font-medium hover:underline">
                      Edit Address
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>You haven't added a shipping address yet.</p>
                    <button className="mt-4 bg-black text-white py-2 px-4 rounded hover:bg-black/80 transition-colors">
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}
