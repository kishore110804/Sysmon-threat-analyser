import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import AdminLayout from '@/components/admin/admin-layout';
import { DollarSign, ArrowDown, ArrowUp, Search, Download, Calendar, Filter, Printer } from 'lucide-react';

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [totals, setTotals] = useState({
    designerCommissions: 0,
    resellerCommissions: 0,
    platformCommissions: 0,
    totalSales: 0
  });

  // Fetch commissions data
  useEffect(() => {
    const fetchCommissions = async () => {
      setLoading(true);
      try {
        // Base query
        let commissionsQuery = query(
          collection(firestore, 'commissions'),
          orderBy(sortField, sortDirection)
        );
        
        // Apply date filter if needed
        if (dateRange !== 'all') {
          const today = new Date();
          let startDate;
          
          if (dateRange === 'today') {
            startDate = new Date(today.setHours(0, 0, 0, 0));
          } else if (dateRange === 'week') {
            startDate = new Date(today.setDate(today.getDate() - 7));
          } else if (dateRange === 'month') {
            startDate = new Date(today.setMonth(today.getMonth() - 1));
          }
          
          commissionsQuery = query(
            commissionsQuery,
            where('createdAt', '>=', startDate)
          );
        }
        
        // Apply role filter if needed
        if (filter === 'designers') {
          commissionsQuery = query(
            commissionsQuery,
            where('designerPercentage', '>', 0)
          );
        } else if (filter === 'resellers') {
          commissionsQuery = query(
            commissionsQuery,
            where('resellerPercentage', '>', 0)
          );
        }
        
        const querySnapshot = await getDocs(commissionsQuery);
        let fetchedCommissions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Apply search filter client-side
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          fetchedCommissions = fetchedCommissions.filter(com => 
            (com.designerName && com.designerName.toLowerCase().includes(lowerQuery)) ||
            (com.resellerName && com.resellerName.toLowerCase().includes(lowerQuery)) ||
            (com.productName && com.productName.toLowerCase().includes(lowerQuery))
          );
        }
        
        // Calculate totals
        const calculatedTotals = fetchedCommissions.reduce((acc, curr) => {
          const totalSale = curr.totalSales || 0;
          const designerCommission = totalSale * (curr.designerPercentage / 100) || 0;
          const resellerCommission = totalSale * (curr.resellerPercentage / 100) || 0;
          const platformCommission = totalSale - designerCommission - resellerCommission;
          
          return {
            designerCommissions: acc.designerCommissions + designerCommission,
            resellerCommissions: acc.resellerCommissions + resellerCommission,
            platformCommissions: acc.platformCommissions + platformCommission,
            totalSales: acc.totalSales + totalSale
          };
        }, {
          designerCommissions: 0,
          resellerCommissions: 0,
          platformCommissions: 0,
          totalSales: 0
        });
        
        setTotals(calculatedTotals);
        setCommissions(fetchedCommissions);
      } catch (error) {
        console.error('Error fetching commissions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommissions();
  }, [filter, dateRange, sortField, sortDirection, searchQuery]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format percentage
  const formatPercentage = (percentage: number) => {
    return `${percentage}%`;
  };
  
  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? 
      <ArrowUp size={14} className="ml-1" /> : 
      <ArrowDown size={14} className="ml-1" />;
  };
  
  // Export report as CSV
  const exportCSV = () => {
    const headers = [
      'Product',
      'Designer',
      'Designer %',
      'Reseller',
      'Reseller %',
      'Sales',
      'Designer Commission',
      'Reseller Commission',
      'Platform Revenue',
      'Date'
    ];
    
    const rows = commissions.map(com => [
      com.productName || 'Unknown Product',
      com.designerName || 'No Designer',
      com.designerPercentage,
      com.resellerName || 'No Reseller',
      com.resellerPercentage,
      com.totalSales || 0,
      (com.totalSales || 0) * (com.designerPercentage / 100),
      (com.totalSales || 0) * (com.resellerPercentage / 100),
      (com.totalSales || 0) - ((com.totalSales || 0) * (com.designerPercentage / 100)) - ((com.totalSales || 0) * (com.resellerPercentage / 100)),
      formatDate(com.createdAt)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `commissions_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout title="Commission Management" subtitle="Track and manage product commissions">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(totals.totalSales)}</h3>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Designer Commissions</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(totals.designerCommissions)}</h3>
            </div>
            <div className="rounded-full bg-[#1AFF00]/20 p-3">
              <DollarSign className="h-6 w-6 text-[#1AFF00]" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Reseller Commissions</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(totals.resellerCommissions)}</h3>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Platform Revenue</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(totals.platformCommissions)}</h3>
            </div>
            <div className="rounded-full bg-gray-100 p-3">
              <DollarSign className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters and controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by role */}
            <div className="flex items-center">
              <Filter size={16} className="text-gray-500 mr-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Commissions</option>
                <option value="designers">Designer Commissions</option>
                <option value="resellers">Reseller Commissions</option>
              </select>
            </div>
            
            {/* Date range */}
            <div className="flex items-center">
              <Calendar size={16} className="text-gray-500 mr-2" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search commissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Export button */}
            <button 
              onClick={exportCSV}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            
            {/* Print button */}
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Printer size={16} />
              <span className="hidden md:inline">Print</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Commission table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse">Loading commission data...</div>
          </div>
        ) : commissions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No commission data found</p>
            <p className="text-sm">Create products and generate sales to track commissions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('productName')}
                  >
                    <div className="flex items-center">
                      Product
                      {renderSortIndicator('productName')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('designerName')}
                  >
                    <div className="flex items-center">
                      Designer
                      {renderSortIndicator('designerName')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designer %
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('resellerName')}
                  >
                    <div className="flex items-center">
                      Reseller
                      {renderSortIndicator('resellerName')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reseller %
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('totalSales')}
                  >
                    <div className="flex items-center justify-end">
                      Sales
                      {renderSortIndicator('totalSales')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designer Commission
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reseller Commission
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commissions.map((commission) => {
                  const totalSales = commission.totalSales || 0;
                  const designerCommission = totalSales * (commission.designerPercentage / 100);
                  const resellerCommission = totalSales * (commission.resellerPercentage / 100);
                  const platformRevenue = totalSales - designerCommission - resellerCommission;
                  
                  return (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">{commission.productName || 'Unknown Product'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {commission.designerName || 'No Designer'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {formatPercentage(commission.designerPercentage)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {commission.resellerName || 'No Reseller'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {formatPercentage(commission.resellerPercentage)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {formatCurrency(totalSales)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {formatCurrency(designerCommission)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {formatCurrency(resellerCommission)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {formatCurrency(platformRevenue)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
