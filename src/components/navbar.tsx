import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
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
      <div className={`
        bg-[#EFEBDF] p-2 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center
        ${location.pathname === path 
          ? 'bg-secondary shadow-[0_0_15px_rgba(26,255,0,0.6)]' 
          : 'hover:bg-secondary hover:shadow-[0_0_10px_rgba(26,255,0,0.4)]'
        }
      `}>
        {icon}
        <span className="sr-only">{label}</span>
      </div>
      <motion.span
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap bg-[#201F1F] text-[#EFEBDF] px-2 py-1 rounded"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
    </Link>
  );
  
  return (
    <div className={`
      w-full px-3 md:px-4 py-2 fixed top-0 z-50 transition-all duration-300
      ${scrolled 
      ? 'backdrop-blur-md border-b border-[#1AFF00]/10' 
      : 'border-b border-transparent'
      }
    `}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
      {/* Logo */}
      <div className="flex-shrink-0 relative group">
        <Link to="/">
        <img src="/X57.svg" alt="X57 Logo" className="h-6 md:h-8 transition-all duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1AFF00]/10 to-transparent opacity-0 group-hover:opacity-100 blur-md -z-10 transition-opacity duration-700"></div>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden bg-transparent text-[#EFEBDF] p-1.5 rounded-full border border-transparent hover:border-[#1AFF00]/30 transition-all duration-300"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu size={20} />
        <span className="sr-only">Menu</span>
      </button>

      {/* Desktop Navigation Container */}
      <div className={`
        hidden md:flex items-center rounded-full border border-[#1AFF00]/20 
        transition-all duration-700 w-auto flex-1 ml-4 pr-1
        ${scrolled ? 'backdrop-blur-md bg-transparent' : 'bg-transparent'}
      `}>
        {/* Kudos Board Button */}
        <div className="flex-1 py-1.5 pl-4">
        <Link 
          to="/kudos"
          className={`
          block text-center transition-all duration-300 ease-in-out rounded-full px-6 py-1.5
          ${location.pathname === "/kudos"
            ? 'bg-transparent text-[#EFEBDF] border border-[#1AFF00]/50 shadow-[0_0_10px_rgba(26,255,0,0.3)]'
            : 'bg-transparent text-[#EFEBDF] hover:border-[#1AFF00]/30 hover:shadow-[0_0_8px_rgba(26,255,0,0.2)] border border-transparent'
          }
          `}
        >
          <span className="font-heading font-semibold text-base  text-black">Kudos!board</span>
        </Link>
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center gap-2 ml-4">
        {navItems.map((item) => (
          <div key={item.path} className="relative">
          <NavIcon path={item.path} icon={item.icon} label={item.label} />
          {location.pathname === item.path && (
            <motion.div
            className="absolute inset-0 rounded-full -z-10 opacity-30 blur-md bg-[#1AFF00]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            ></motion.div>
          )}
          </div>
        ))}
        </div>
      </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div 
        className={`
          md:hidden mt-3 p-3 border border-[#1AFF00]/20 rounded-2xl
          ${scrolled ? 'bg-transparent backdrop-blur-md' : 'bg-transparent'}
        `}
        initial={{ opacity: 0, height: 0, y: -5 }}
        animate={{ opacity: 1, height: "auto", y: 0 }}
        exit={{ opacity: 0, height: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        >
        <div>
          <Link 
            to="/kudos"
            className={`
              block mx-auto max-w-[250px] text-center transition-all duration-300 ease-in-out rounded-full px-4 py-1.5 mb-3
              ${location.pathname === "/kudos"
              ? 'bg-transparent text-[#EFEBDF] border border-[#1AFF00]/50 shadow-[0_0_10px_rgba(26,255,0,0.3)]'
              : 'bg-transparent text-[#EFEBDF] hover:shadow-[0_0_8px_rgba(26,255,0,0.2)] border border-transparent'
              }
            `}
          >
            <span className="font-heading font-semibold text-base text-black">Kudos! Board</span>
          </Link>
          
          <div className="flex justify-center gap-5 mt-4">
          {navItems.map((item) => (
            <div key={item.path} className="relative">
            <NavIcon path={item.path} icon={item.icon} label={item.label} />
            {location.pathname === item.path && (
              <div className="absolute inset-0 rounded-full -z-10 animate-pulse opacity-30 blur-md bg-[#1AFF00]"></div>
            )}
            </div>
          ))}
          </div>
        </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
