import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck, CheckCircle2, AlertTriangle,
  Users, TrendingUp, DollarSign, ShoppingBag
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import AdminLayout from '@/components/admin/admin-layout';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingApplications: 0,
    verifiedDesigners: 0,
    activeProducts: 0,
    totalResellers: 0
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get pending applications count
        const pendingAppsQuery = query(
          collection(firestore, 'designerApplications'),
          where('status', '==', 'pending_review')
        );
        const pendingAppsSnapshot = await getDocs(pendingAppsQuery);
        
        // Get verified designers count
        const verifiedDesignersQuery = query(
          collection(firestore, 'users'),
          where('designerVerification.status', '==', 'verified')
        );
        const verifiedDesignersSnapshot = await getDocs(verifiedDesignersQuery);
        
        // Get active products count (simplified)
        const productsQuery = query(collection(firestore, 'products'));
        const productsSnapshot = await getDocs(productsQuery);
        
        // Get resellers count
        const resellersQuery = query(
          collection(firestore, 'users'),
          where('role', '==', 'reseller')
        );
        const resellersSnapshot = await getDocs(resellersQuery);
        
        // Get recent applications
        const recentAppsQuery = query(
          collection(firestore, 'designerApplications'),
          orderBy('submittedAt', 'desc'),
          limit(5)
        );
        const recentAppsSnapshot = await getDocs(recentAppsQuery);
        const recentApps = recentAppsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setStats({
          pendingApplications: pendingAppsSnapshot.size,
          verifiedDesigners: verifiedDesignersSnapshot.size,
          activeProducts: productsSnapshot.size,
          totalResellers: resellersSnapshot.size
        });
        
        setRecentApplications(recentApps);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format timestamp to readable date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    // Handle Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <AdminLayout title="Dashboard" subtitle="Overview and summary">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Loading dashboard data...</div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 flex items-start">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Applications</p>
                <h3 className="text-2xl font-bold mt-1">{stats.pendingApplications}</h3>
                <Link to="/admin/designers/applications" className="text-blue-600 text-sm hover:underline mt-1 inline-block">
                  View all
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 flex items-start">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Verified Designers</p>
                <h3 className="text-2xl font-bold mt-1">{stats.verifiedDesigners}</h3>
                <Link to="/admin/designers/verified" className="text-green-600 text-sm hover:underline mt-1 inline-block">
                  Manage designers
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 flex items-start">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Products</p>
                <h3 className="text-2xl font-bold mt-1">{stats.activeProducts}</h3>
                <Link to="/admin/products" className="text-purple-600 text-sm hover:underline mt-1 inline-block">
                  View products
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 flex items-start">
              <div className="rounded-full bg-orange-100 p-3 mr-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Resellers</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalResellers}</h3>
                <Link to="/admin/resellers" className="text-orange-600 text-sm hover:underline mt-1 inline-block">
                  View resellers
                </Link>
              </div>
            </div>
          </div>
          
          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">Recent Designer Applications</h2>
              <Link 
                to="/admin/designers/applications" 
                className="text-sm text-blue-600 hover:underline"
              >
                View all
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              {recentApplications.length > 0 ? (
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Designer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Categories
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{app.userName || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{app.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(app.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="max-w-xs truncate">
                            {app.productCategories?.map((cat: string) => (
                              <span 
                                key={cat} 
                                className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs mr-1 mb-1"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${app.status === 'pending_review' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : app.status === 'approved' || app.status === 'verified'
                                ? 'bg-green-100 text-green-800'
                                : app.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {app.status === 'pending_review' ? 'Pending Review' : 
                             app.status === 'approved' ? 'Approved' : 
                             app.status === 'verified' ? 'Verified' :
                             app.status === 'rejected' ? 'Rejected' : 'Processing'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Link 
                            to={`/admin/designers/applications/${app.id}`}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-gray-500 flex flex-col items-center">
                  <AlertTriangle className="h-10 w-10 text-gray-400 mb-2" />
                  <p>No recent applications found</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Analytics Teaser */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">Revenue Overview</h2>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-md">Last 30 days</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium">Total Sales</span>
                </div>
                <p className="text-2xl font-bold">$0</p>
                <p className="text-xs text-gray-500 mt-1">No sales data available yet</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-5 w-5 text-[#1AFF00] mr-2" />
                  <span className="text-sm font-medium">Designer Commissions</span>
                </div>
                <p className="text-2xl font-bold">$0</p>
                <p className="text-xs text-gray-500 mt-1">No commission data yet</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium">Reseller Earnings</span>
                </div>
                <p className="text-2xl font-bold">$0</p>
                <p className="text-xs text-gray-500 mt-1">No earnings data yet</p>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
