import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

type VerticalNavProps = {
  className?: string;
};

export const VerticalNav = ({ className = "" }: VerticalNavProps) => {
  const location = useLocation();
  const [, setIsHovering] = useState(false);
  const [, setIsMobile] = useState(false);
  const [isAtFooter, setIsAtFooter] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check scroll position relative to footer
  const handleScroll = useCallback(() => {
    const footerEl = document.querySelector('footer');
    if (footerEl) {
      const footerRect = footerEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // If footer is in view, position the nav above it
      if (footerRect.top < viewportHeight) {
        setIsAtFooter(true);
      } else {
        setIsAtFooter(false);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  const navItems = [
    { label: "HOOD FITS", path: "/clothingpages/hoodfits" },
    { label: "MINI MOVES", path: "/clothingpages/minimoves" },
    { label: "EZ-TEES", path: "/clothingpages/eztees" },
    { label: "SWAG LOOPS", path: "/clothingpages/swagloops" },
    { label: "CAPS VAULT", path: "/clothingpages/capsvault" },
    { label: "FLOW PANTS", path: "/clothingpages/flowpants" },
  ];


  return (
    <div 
      className={`
        fixed left-0 right-0 z-40 px-4 py-3
        ${isAtFooter ? 'absolute bottom-auto translate-y-0' : 'bottom-0'}
        transition-all duration-300
        ${className}
      `}
      style={{ 
        bottom: isAtFooter ? 'auto' : 0,
        top: isAtFooter ? `calc(100% - ${document.querySelector('footer')?.offsetHeight || 0}px - 80px)` : 'auto'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Navigation container with backdrop */}
      <div className="backdrop-blur-md bg-[#EFEBDF]/90 border border-black/10 rounded-lg shadow-lg">
        {/* Grid layout for both mobile and desktop */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 p-2 transition-all duration-500 
                      ${isHovering || isClothingPage ? 'opacity-100' : 'opacity-80'}">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link to={item.path} key={item.path} className="relative group">
                <div 
                  className={`
                    relative h-12 w-full flex items-center justify-center rounded-lg 
                    transition-all duration-300 backdrop-blur-[2px]
                    ${isActive 
                      ? 'bg-black/90 text-white border border-black' 
                      : 'bg-transparent text-black/70 border border-black/20 hover:border-black hover:bg-black/70 hover:text-white'
                    }
                  `}
                >
                  {/* Active state box glow */}
                  {isActive && (
                    <div className="absolute -inset-[2px] rounded-lg bg-black/5 z-[-1]">
                      <div className="absolute inset-0 rounded-lg animate-pulse" 
                        style={{ 
                          boxShadow: '0 0 15px 2px rgba(0,0,0,0.3)', 
                          animation: 'pulse 2s infinite' 
                        }} 
                      />
                    </div>
                  )}

                  {/* Label text */}
                  <span 
                    className="text-xs font-bold tracking-tight uppercase transition-colors duration-300 px-1 text-center
                      ${isActive ? 'text-white' : 'text-black/70 group-hover:text-white'}"
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VerticalNav;
