import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import AdminLayout from '@/components/admin/admin-layout';
import { Search, ChevronLeft, ChevronRight, BadgeCheck, Brush, Package } from 'lucide-react';

export default function VerifiedDesignersList() {
  const [designers, setDesigners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchVerifiedDesigners = async () => {
      setLoading(true);
      try {
        // Query for users with verified designer status
        const designersQuery = query(
          collection(firestore, 'users'),
          where('designerVerification.status', '==', 'verified'),
          orderBy('firstName', 'asc')
        );
        
        const querySnapshot = await getDocs(designersQuery);
        const designersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as any[];
        
        // Filter by search query if provided
        let filteredData = designersData;
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          filteredData = designersData.filter((designer: any) => 
            (designer.firstName && designer.firstName.toLowerCase().includes(lowerQuery)) ||
            (designer.lastName && designer.lastName.toLowerCase().includes(lowerQuery)) ||
            (designer.email && designer.email.toLowerCase().includes(lowerQuery))
          );
        }
        
        // Pagination
        setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
        
        // Get current page data
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
        
        setDesigners(paginatedData);
      } catch (error) {
        console.error('Error fetching verified designers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVerifiedDesigners();
  }, [searchQuery, currentPage]);

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

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <AdminLayout 
      title="Verified Designers" 
      subtitle="Manage verified designers and their designs"
    >
      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>
      
      {/* Designers table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse">Loading designers...</div>
          </div>
        ) : designers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg mb-2">No verified designers found</p>
            <p className="text-sm">Try adjusting your search or review pending applications.</p>
            <Link 
              to="/admin/designers/applications" 
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              View pending applications
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designs
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {designers.map((designer) => (
                    <tr key={designer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#1AFF00]/20 rounded-full flex items-center justify-center text-lg font-bold text-[#1AFF00]">
                            {designer.firstName?.charAt(0) || designer.email?.charAt(0) || '?'}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {designer.firstName && designer.lastName 
                                  ? `${designer.firstName} ${designer.lastName}` 
                                  : designer.displayName || designer.email}
                              </div>
                              <BadgeCheck size={16} className="ml-1 text-[#1AFF00]" />
                            </div>
                            <div className="text-sm text-gray-500">{designer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(designer.designerVerification?.verifiedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Brush size={16} className="text-purple-500 mr-2" />
                          <span className="text-sm">{designer.designs?.length || 0} designs</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package size={16} className="text-blue-500 mr-2" />
                          <span className="text-sm">0 active products</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/admin/designers/${designer.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View Profile
                        </Link>
                        <Link 
                          to={`/admin/designers/${designer.id}/designs`}
                          className="text-green-600 hover:text-green-900"
                        >
                          View Designs
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, designers.length)}
                  </span>{' '}
                  of <span className="font-medium">{designers.length}</span> designers
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
