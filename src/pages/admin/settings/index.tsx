import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import AdminLayout from '@/components/admin/admin-layout';
import { Save, Shield, Settings as SettingsIcon, Sliders, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import { grantAdminPrivileges } from '@/scripts/setup-admin-users';
import { useFirebase } from '@/providers/firebase-provider';

export default function SettingsPage() {
  // eslint-disable-next-line no-empty-pattern
  const { } = useFirebase();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Commission Settings
  const [commissionSettings, setCommissionSettings] = useState({
    defaultDesignerCommission: 15,
    defaultResellerCommission: 10,
    featuredDesignBonus: 5,
    platformFee: 75, // The remaining percentage after designer and reseller commissions
  });

  // Fetch users when the admins tab is active
  useEffect(() => {
    if (activeTab !== 'admins') return;
    
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Fetch admin users
        const adminsQuery = query(
          collection(firestore, 'users'),
          where('role', '==', 'admin')
        );
        
        const querySnapshot = await getDocs(adminsQuery);
        const adminUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setUsers(adminUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load admin users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [activeTab]);

  // Fetch commission settings when the commissions tab is active
  useEffect(() => {
    if (activeTab !== 'commissions') return;
    
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const settingsDoc = await getDoc(doc(firestore, 'settings', 'commissions'));
        
        if (settingsDoc.exists()) {
          setCommissionSettings(settingsDoc.data() as any);
        } else {
          // If settings don't exist yet, create them with default values
          await setDoc(doc(firestore, 'settings', 'commissions'), commissionSettings);
        }
      } catch (error) {
        console.error('Error fetching commission settings:', error);
        setError('Failed to load commission settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [activeTab]);

  // Search for user by email
  const searchUserByEmail = async () => {
    if (!searchEmail.trim()) {
      setError('Please enter an email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSelectedUser(null);
    
    try {
      const usersQuery = query(
        collection(firestore, 'users'),
        where('email', '==', searchEmail.trim())
      );
      
      const querySnapshot = await getDocs(usersQuery);
      
      if (querySnapshot.empty) {
        setError('No user found with this email');
        return;
      }
      
      const userData = {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      };
      
      setSelectedUser(userData);
    } catch (error) {
      console.error('Error searching for user:', error);
      setError('Failed to search for user');
    } finally {
      setLoading(false);
    }
  };

  // Grant admin privileges
  const handleGrantAdmin = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await grantAdminPrivileges(selectedUser.id);
      
      setSuccess(`${selectedUser.email} has been granted admin privileges`);
      
      // Update the selected user
      setSelectedUser({
        ...selectedUser,
        role: 'admin'
      });
      
      // Update users list if the user wasn't already an admin
      if (selectedUser.role !== 'admin') {
        setUsers(prev => [...prev, { ...selectedUser, role: 'admin' }]);
      }
    } catch (error) {
      console.error('Error granting admin privileges:', error);
      setError('Failed to grant admin privileges');
    } finally {
      setLoading(false);
    }
  };

  // Save commission settings
  const saveCommissionSettings = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Calculate platform fee
      const platformFee = 100 - commissionSettings.defaultDesignerCommission - commissionSettings.defaultResellerCommission;
      
      if (platformFee < 0) {
        throw new Error('Total commissions cannot exceed 100%');
      }
      
      const updatedSettings = {
        ...commissionSettings,
        platformFee
      };
      
      await setDoc(doc(firestore, 'settings', 'commissions'), updatedSettings, { merge: true });
      
      setCommissionSettings(updatedSettings);
      setSuccess('Commission settings updated successfully');
    } catch (error: any) {
      console.error('Error saving commission settings:', error);
      setError(error.message || 'Failed to save commission settings');
    } finally {
      setLoading(false);
    }
  };

  // Handle commission setting changes
  const handleCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    setCommissionSettings(prev => ({
      ...prev,
      [name]: isNaN(numValue) ? 0 : numValue
    }));
  };

  return (
    <AdminLayout title="Settings" subtitle="Manage application settings">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Settings</h3>
            </div>
            <nav className="p-2">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center transition-colors ${
                  activeTab === 'general' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                <SettingsIcon size={16} className="mr-2" />
                General Settings
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center transition-colors ${
                  activeTab === 'admins' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                <Shield size={16} className="mr-2" />
                Admin Users
              </button>
              <button
                onClick={() => setActiveTab('commissions')}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center transition-colors ${
                  activeTab === 'commissions' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                <DollarSign size={16} className="mr-2" />
                Commission Settings
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center transition-colors ${
                  activeTab === 'appearance' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                <Sliders size={16} className="mr-2" />
                Appearance
              </button>
            </nav>
          </div>
        </div>
        
        {/* Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Success message */}
            {success && (
              <div className="m-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
                <CheckCircle size={20} className="mr-2" />
                {success}
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="m-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                <AlertTriangle size={20} className="mr-2" />
                {error}
              </div>
            )}
          
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">General Settings</h2>
                
                {/* App Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Application Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Application Name
                      </label>
                      <input
                        type="text"
                        value="X57 Designs"
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Version
                      </label>
                      <input
                        type="text"
                        value="1.0.0"
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value="aakaashanoop@gmail.com"
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Email
                      </label>
                      <input
                        type="email"
                        value="kishore110804n@gmail.com"
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Admin Users */}
            {activeTab === 'admins' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Admin Users</h2>
                
                {/* Search for users to add as admin */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Add Admin User</h3>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      placeholder="Enter user email"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={searchUserByEmail}
                      disabled={loading || !searchEmail.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  
                  {/* Selected User */}
                  {selectedUser && (
                    <div className="mt-4 border border-gray-200 rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {selectedUser.firstName && selectedUser.lastName 
                              ? `${selectedUser.firstName} ${selectedUser.lastName}`
                              : selectedUser.email}
                          </div>
                          <div className="text-sm text-gray-500">{selectedUser.email}</div>
                          <div className="mt-1 text-sm">
                            <span className="font-medium">Current Role:</span> {selectedUser.role || 'customer'}
                          </div>
                        </div>
                        <div>
                          {selectedUser.role === 'admin' ? (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Already an Admin
                            </span>
                          ) : (
                            <button
                              onClick={handleGrantAdmin}
                              disabled={loading}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                            >
                              {loading ? 'Processing...' : 'Grant Admin Access'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Current Admins List */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Current Admins</h3>
                  {loading && !selectedUser ? (
                    <div className="text-center py-4">Loading admin users...</div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 border border-gray-100 rounded-md">
                      <p className="text-gray-500">No admin users found</p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                                    {user.firstName?.charAt(0) || user.email?.charAt(0) || '?'}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.firstName && user.lastName 
                                        ? `${user.firstName} ${user.lastName}` 
                                        : 'No name provided'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{user.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                  Admin
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Commission Settings */}
            {activeTab === 'commissions' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Commission Settings</h2>
                
                <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <DollarSign size={18} className="text-green-600 mr-2" />
                    Default Commission Rates
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="defaultDesignerCommission" className="block text-sm font-medium text-gray-700 mb-1">
                        Default Designer Commission (%)
                      </label>
                      <input
                        type="number"
                        id="defaultDesignerCommission"
                        name="defaultDesignerCommission"
                        value={commissionSettings.defaultDesignerCommission}
                        onChange={handleCommissionChange}
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Standard percentage of sales that goes to designers
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="defaultResellerCommission" className="block text-sm font-medium text-gray-700 mb-1">
                        Default Reseller Commission (%)
                      </label>
                      <input
                        type="number"
                        id="defaultResellerCommission"
                        name="defaultResellerCommission"
                        value={commissionSettings.defaultResellerCommission}
                        onChange={handleCommissionChange}
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Standard percentage of sales that goes to resellers
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="featuredDesignBonus" className="block text-sm font-medium text-gray-700 mb-1">
                        Featured Design Bonus (%)
                      </label>
                      <input
                        type="number"
                        id="featuredDesignBonus"
                        name="featuredDesignBonus"
                        value={commissionSettings.featuredDesignBonus}
                        onChange={handleCommissionChange}
                        min="0"
                        max="50"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Additional percentage for designs featured on the Kudos board
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Platform Fee (%)
                      </label>
                      <input
                        type="number"
                        value={100 - commissionSettings.defaultDesignerCommission - commissionSettings.defaultResellerCommission}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Remainder after designer and reseller commissions (calculated automatically)
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={saveCommissionSettings}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      <Save size={16} className="mr-2" />
                      {loading ? 'Saving...' : 'Save Commission Settings'}
                    </button>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="font-medium text-blue-800 mb-2">About Commission Settings</h3>
                  <p className="text-sm text-blue-700">
                    These settings define the default commission rates for all products. Individual products can have custom commission rates set during creation or editing.
                  </p>
                  <ul className="list-disc text-sm text-blue-700 ml-5 mt-2">
                    <li>The platform fee is automatically calculated as the remainder after designer and reseller commissions</li>
                    <li>Featured designs receive an additional bonus percentage on top of the regular commission</li>
                    <li>Changes to these rates will only affect new products created after the change</li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Appearance Settings</h2>
                
                <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
                  <Sliders size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                  <p className="text-gray-500">
                    Appearance customization settings will be available in a future update.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
