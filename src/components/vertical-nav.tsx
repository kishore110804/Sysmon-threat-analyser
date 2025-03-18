import { Link, useLocation } from "react-router-dom";

import { useState } from "react";

type VerticalNavProps = {
  className?: string;
};

export const VerticalNav = ({ className = "" }: VerticalNavProps) => {
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);
  
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
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`flex flex-row gap-2 transition-all duration-500 ${isHovering || location.pathname.includes('/clothingpages/') ? 'opacity-100' : 'opacity-30'}`}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link to={item.path} key={item.path} className="relative group">
              <div 
                className={`
                  relative h-16 w-32 flex items-center justify-center rounded-lg 
                  transition-all duration-300 backdrop-blur-[2px]
                  ${isActive 
                    ? 'bg-black/90 text-white border border-black' 
                    : 'bg-transparent text-black/70 border border-black/20 hover:border-black hover:bg-black/70 hover:text-white'
                  }
                `}
              >
                {/* Active state box glow - no shadows */}
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

                {/* Label text - no glow */}
                <span 
                  className={`text-sm font-bold tracking-tight uppercase transition-colors duration-300 px-1 text-center
                    ${isActive ? 'text-white' : 'text-black/70 group-hover:text-white'}`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalNav;
