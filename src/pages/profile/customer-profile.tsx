import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package2, MapPin, History, LogOut, Shield } from 'lucide-react';
import { useFirebase } from '@/providers/firebase-provider';
import ProfileLayout from '@/components/profile/profile-layout';
import { isUserAdmin } from '@/scripts/setup-admin-users';

export default function CustomerProfile({ userData }: { userData: any }) {
  const { logOut } = useFirebase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (userData?.id) {
        const adminStatus = await isUserAdmin(userData.id);
        setIsAdmin(adminStatus);
      }
    };
    
    checkAdminStatus();
  }, [userData]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };
  
  const headerContent = (
    <div className="mt-4 flex gap-4">
      <div className="text-white/80 flex items-center">
        <Package2 size={16} className="mr-1" /> 
        <span>0 Orders</span>
      </div>
      <div className="text-white/80 flex items-center">
        <User size={16} className="mr-1" /> 
        <span>Member since {new Date(userData?.createdAt?.seconds * 1000).toLocaleDateString()}</span>
      </div>
    </div>
  );

  return (
    <ProfileLayout userData={userData} headerContent={headerContent}>
      {isAdmin && (
        <div className="mb-6 bg-black text-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-3 flex items-center">
            <Shield size={20} className="mr-2" />
            Admin Access
          </h2>
          <p className="mb-4">You have administrator privileges. Access the admin dashboard to manage the platform.</p>
          <Link 
            to="/admin-redirect" 
            className="inline-flex items-center px-4 py-2 bg-[#1AFF00] text-black rounded-md hover:bg-[#1AFF00]/80 transition-colors font-medium"
          >
            Access Admin Dashboard
          </Link>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-4">
            <nav>
              <ul>
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
