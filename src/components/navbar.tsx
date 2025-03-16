import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Navigation items for reuse
  const navItems = [
    {
      path: "/",
      icon: <Home size={20} />,
      label: "Home"
    },
    {
      path: "/cart",
      icon: <ShoppingCart size={20} />,
      label: "Cart"
    },
    {
      path: "/profile",
      icon: <User size={20} />,
      label: "Profile"
    }
  ];

  // Reusable navigation icon component
  const NavIcon = ({ path, icon, label }: { path: string, icon: React.ReactNode, label: string }) => (
    <Link to={path} className="relative group">
      <div className={`bg-[#EFEBDF] p-2 rounded-full hover:bg-secondary transition-colors duration-300 ease-in-out ${location.pathname === path ? 'bg-secondary' : ''}`}>
        {icon}
        <span className="sr-only">{label}</span>
      </div>
      <motion.span
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap bg-[#201F1F] text-[#EFEBDF] px-2 py-1 rounded"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        {label}
      </motion.span>
    </Link>
  );
  
  return (
    <div className="w-full px-3 md:px-4 py-2 fixed top-0 z-50 bg-[#EFEBDF]">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img src="/X57.svg" alt="X57 Logo" className="h-6 md:h-8" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden bg-[#201F1F] text-[#EFEBDF] p-1.5 rounded-full"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={20} />
          <span className="sr-only">Menu</span>
        </button>

        {/* Desktop Navigation Container */}
        <div className="hidden md:flex items-center bg-[#201F1F] rounded-full px-3 py-1.5 shadow-md w-11/12">
          {/* Kudos Board Button */}
          <div className="flex-1 mr-3">
            <Link 
              to="/kudos"
              className={`block bg-[#EFEBDF] text-[#201F1F] hover:bg-[#201F1F] hover:text-[#EFEBDF] rounded-full px-4 py-1.5 text-center transition-colors duration-300 ease-in-out w-[98%] ${location.pathname === "/kudos" ? 'bg-[#201F1F] text-[#EFEBDF]' : ''}`}
            >
              <span className="font-heading font-semibold text-base">Kudos board</span>
            </Link>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <div key={item.path}>
                <NavIcon path={item.path} icon={item.icon} label={item.label} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden mt-3 bg-[#201F1F] rounded-2xl p-3 shadow-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Link 
                to="/kudos"
                className={`block w-[98%] bg-[#EFEBDF] text-[#201F1F] hover:bg-[#201F1F] hover:text-[#EFEBDF] rounded-full px-4 py-1.5 mb-3 text-center transition-colors duration-300 ease-in-out ${location.pathname === "/kudos" ? 'bg-[#201F1F] text-[#EFEBDF]' : ''}`}
              >
                <span className="font-heading font-semibold text-base">Kudos board</span>
              </Link>
              
              <div className="flex justify-center space-x-3 mt-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <NavIcon path={item.path} icon={item.icon} label={item.label} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
