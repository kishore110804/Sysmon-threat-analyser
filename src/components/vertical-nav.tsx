import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

type VerticalNavProps = {
  className?: string;
};

export const VerticalNav = ({ className = "" }: VerticalNavProps) => {
  const location = useLocation();
  
  const navItems = [
    { label: "HOOD FITS", path: "/clothingpages/hoodfits" },
    { label: "MINI MOVES", path: "/clothingpages/minimoves" },
    { label: "EZ-TEES", path: "/clothingpages/eztees" },
    { label: "SWAG LOOPS", path: "/clothingpages/swagloops" },
    { label: "CAPS VAULT", path: "/clothingpages/capsvault" },
    { label: "FLOW PANTS", path: "/clothingpages/flowpants" },
  ];

  return (
    <div className={`fixed right-6 lg:right-12 top-1/2 transform -translate-y-1/2 z-40 ${className}`}>
      <div className="flex flex-col gap-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link to={item.path} key={item.path} className="relative group">
              <div 
                className={`
                  w-3 h-16 rounded-full transition-all duration-300 border border-[#000000] relative
                  ${isActive 
                    ? 'bg-[#000000] shadow-[0_0_10px_rgba(0,0,0,0.6)]' 
                    : 'bg-[#EFEBDF] hover:bg-[#000000] hover:shadow-[0_0_8px_rgba(0,0,0,0.4)]'
                  }
                `}
              >
                <span className="sr-only">{item.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full -z-10 opacity-20 blur-sm bg-[#000000]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                  />
                )}
              </div>
              <span 
                className={`
                  absolute top-1/2 -right-[110px] -translate-y-1/2 whitespace-nowrap text-sm font-heading font-semibold
                  transition-colors duration-300
                  ${isActive 
                    ? 'text-[#EFEBDF]' 
                    : 'text-[#000000] group-hover:text-[#EFEBDF]'
                  }
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalNav;
