import { useEffect, useState, ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Brush, Package, Settings, 
  LogOut, ChevronDown, ShoppingBag, FileCheck, CheckCircle2, DollarSign, CreditCard 
} from 'lucide-react';
import { useFirebase } from '@/providers/firebase-provider';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { currentUser, logOut } = useFirebase();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Verify user is an admin, redirect if not
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        navigate('/auth');
        return;
      }

      try {
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
        if (!userDoc.exists() || userDoc.data().role !== 'admin') {
          console.log('Access denied: Not an admin');
          navigate('/');
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [currentUser, navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white shadow-md fixed h-full z-10 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          {/* Logo and collapse button */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/admin" className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
              <img src="/X57.svg" alt="X57 Logo" className="h-8" />
              {sidebarOpen && <span className="font-heading font-bold ml-2">Admin</span>}
            </Link>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronDown 
                size={20} 
                className={`transform transition-transform ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`}
              />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-2 px-2">
              <li>
                <Link 
                  to="/admin" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LayoutDashboard size={20} className="shrink-0" />
                  {sidebarOpen && <span className="ml-3">Dashboard</span>}
                </Link>
              </li>
              
              {/* Designers section */}
              <li className="pt-2">
                <div className={`px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider ${!sidebarOpen && 'text-center'}`}>
                  {sidebarOpen ? 'Designers' : '—'}
                </div>
                <div className="mt-2 space-y-1">
                  <Link 
                    to="/admin/designers/applications" 
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FileCheck size={20} className="shrink-0" />
                    {sidebarOpen && <span className="ml-3">Applications</span>}
                  </Link>
                  <Link 
                    to="/admin/designers/verified" 
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <CheckCircle2 size={20} className="shrink-0" />
                    {sidebarOpen && <span className="ml-3">Verified Designers</span>}
                  </Link>
                  <Link 
                    to="/admin/designs" 
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Brush size={20} className="shrink-0" />
                    {sidebarOpen && <span className="ml-3">Designs</span>}
                  </Link>
                </div>
              </li>
              
              {/* Products and Resellers */}
              <li className="pt-2">
                <div className={`px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider ${!sidebarOpen && 'text-center'}`}>
                  {sidebarOpen ? 'Products' : '—'}
                </div>
                <div className="mt-2 space-y-1">
                  <Link 
                    to="/admin/products/new" 
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Package size={20} className="shrink-0" />
                    {sidebarOpen && <span className="ml-3">New Product</span>}
                  </Link>
                  <Link 
                    to="/admin/products" 
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ShoppingBag size={20} className="shrink-0" />
                    {sidebarOpen && <span className="ml-3">All Products</span>}
                  </Link>
                  <Link 
                    to="/admin/resellers" 
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Users size={20} className="shrink-0" />
                    {sidebarOpen && <span className="ml-3">Resellers</span>}
                  </Link>
                </div>
              </li>
              
              {/* Finance */}
              <li className="pt-2">
                <div className={`px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider ${!sidebarOpen && 'text-center'}`}>
                  {sidebarOpen ? 'Finance' : '—'}
                </div>
                <div className="mt-2 space-y-1">
                  <Link 
                    to="/admin/finance/commissions" 
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <DollarSign size={20} className="shrink-0" />
                    {sidebarOpen && <span className="ml-3">Commissions</span>}
                  </Link>
                  <Link 
                    to="/admin/finance/payouts" 
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <CreditCard size={20} className="shrink-0" />
                    {sidebarOpen && <span className="ml-3">Payouts</span>}
                  </Link>
                </div>
              </li>
              
              {/* Settings */}
              <li className="pt-2">
                <Link 
                  to="/admin/settings" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings size={20} className="shrink-0" />
                  {sidebarOpen && <span className="ml-3">Settings</span>}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Logout button */}
          <div className="border-t p-4">
            <button 
              onClick={handleLogout}
              className={`flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full ${!sidebarOpen && 'justify-center'}`}
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
          <h1 className="text-2xl font-bold font-heading">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </header>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
