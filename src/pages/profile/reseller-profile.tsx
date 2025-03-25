import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package2, MapPin, History, LogOut, BarChart2, DollarSign, Building2 } from 'lucide-react';
import { useFirebase } from '@/providers/firebase-provider';
import ProfileLayout from '@/components/profile/profile-layout';

export default function ResellerProfile({ userData }: { userData: any }) {
  const { logOut } = useFirebase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  
  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };
  
  const headerContent = (
    <div className="mt-4 flex flex-wrap gap-4">
      <div className="text-white/80 flex items-center">
        <Package2 size={16} className="mr-1" /> 
        <span>0 Orders</span>
      </div>
      <div className="text-white/80 flex items-center">
        <DollarSign size={16} className="mr-1" /> 
        <span>$0 Revenue</span>
      </div>
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
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-colors ${
                      activeTab === 'dashboard' ? 'bg-black/5 font-medium' : 'hover:bg-black/5'
                    }`}
                  >
                    <BarChart2 size={18} className={`mr-3 ${activeTab === 'dashboard' ? 'text-[#1AFF00]' : 'text-black/70'}`} />
                    Reseller Dashboard
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

            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-xl font-bold font-heading mb-4">Reseller Dashboard</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-4 shadow-sm">
                    <p className="text-purple-600 text-sm font-medium mb-1">Total Sales</p>
                    <p className="text-2xl font-bold">$0.00</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4 shadow-sm">
                    <p className="text-blue-600 text-sm font-medium mb-1">Commission Rate</p>
                    <p className="text-2xl font-bold">15%</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-4 shadow-sm">
                    <p className="text-green-600 text-sm font-medium mb-1">Products Sold</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
                
                {/* Business Setup */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 size={24} className="text-purple-700" />
                    <h3 className="text-lg font-bold">Business Information</h3>
                  </div>
                  
                  <div className="text-center py-6 text-gray-500">
                    <p>You haven't set up your business information yet.</p>
                    <button className="mt-4 bg-black text-white py-2 px-4 rounded hover:bg-black/80 transition-colors">
                      Set Up Business Profile
                    </button>
                  </div>
                </div>
                
                {/* Marketing Assets */}
                <div>
                  <h3 className="font-bold mb-3">Marketing Assets</h3>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <p>Access product photos, descriptions, and other marketing materials.</p>
                    <button className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
                      Access Asset Library
                    </button>
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
                    Order Bulk Inventory
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
