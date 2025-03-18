import { Link } from "react-router-dom";
import { DollarSign, ArrowRight } from "lucide-react";
import { VerticalNav } from "./vertical-nav";

export const Footer = () => {
  const policyLinks = [
    { title: "Terms of Service", href: "/policies/terms" },
    { title: "Privacy Policy", href: "/policies/privacy" },
    { title: "Return Policy", href: "/policies/returns" },
    { title: "Shipping Policy", href: "/policies/shipping" },
  ];

  const moneyLinks = [
    { 
      title: "Share and earn", 
      href: "/makemoney/share",
    },
    { 
      title: "Collaboration? We are In!", 
      href: "/makemoney/collaborate",
    },
    { 
      title: "Become a sales executive ", 
      href: "/makemoney/sales",
    },
  ];

  return (
    <>
      {/* Vertical Navigation - Positioned outside of the footer */}
      <VerticalNav />
      
      {/* Footer with black background */}
      <footer className="bg-[#000000] text-[#EFEBDF] py-10 relative overflow-hidden">
        {/* Large background tagline text positioned at bottom */}
        <div className="absolute bottom-1 left-0 right-0 w-full overflow-hidden pointer-events-none z-0">
          <div className="flex flex-wrap justify-center pb-2">
            <span className="font-heading font-bold text-[10vw] md:text-[8vw] leading-[0.8] text-[#201F1F] text-center mx-1">
              The
            </span>
            <span className="font-heading font-bold text-[10vw] md:text-[8vw] leading-[0.8] text-[#201F1F] text-center mx-1">
              Box?
            </span>
            <span className="font-heading font-bold text-[10vw] md:text-[8vw] leading-[0.8] text-[#201F1F] text-center mx-1">
              Break
            </span>
            <span className="font-heading font-bold text-[10vw] md:text-[8vw] leading-[0.8] text-[#201F1F] text-center mx-1">
              it!
            </span>
          </div>
        </div>
        
        <div className="container mx-auto px-2 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
            {/* Left Section - Contact */}
            <div>
              <h3 className="font-heading text-4xl md:text-5xl mb-4">
                <span className="text-[#1AFF00]">Contact</span>{" "}
                <span className="text-[#EFEBDF]">US</span>
              </h3>
              
              {/* Policies - Single Column */}
              <div className="flex flex-col gap-1">
                {policyLinks.map((policy, index) => (
                  <Link 
                    key={index}
                    to={policy.href}
                    className="text-xs md:text-sm opacity-70 hover:opacity-100 hover:text-[#1AFF00] transition-colors"
                  >
                    {policy.title}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Right Section - Make Money - Aligned to the right - IMPROVED */}
            <div className="md:text-right md:flex md:flex-col md:items-end">
              <h3 className="font-heading text-5xl md:text-5xl mb-5 flex items-center md:justify-end text-[#1AFF00]">
                <DollarSign className="h-8 w-8 md:h-10 md:w-10 inline-flex mr-1 md:mr-2" />
                <span>Make Money</span>
              </h3>
              
              <div className="grid grid-cols-1 gap-y-3">
                {moneyLinks.map((link, index) => (
                  <div key={index} className="group">
                    <Link 
                      to={link.href}
                      className="relative flex items-center md:justify-end text-sm md:text-base opacity-90 
                                hover:opacity-100 transition-all bg-black hover:bg-black/80 p-3 rounded-md border
                                border-[#1AFF00]/20 hover:border-[#1AFF00]/80 hover:shadow-[0_0_10px_rgba(26,255,0,0.2)]"
                    >
                      <span className="font-heading tracking-tight text-white group-hover:text-[#1AFF00] transition-colors">
                        {link.title}
                      </span>
                      <ArrowRight 
                        size={16} 
                        className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 
                                  transition-all duration-300 text-[#1AFF00]" 
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#EFEBDF]/10 pt-3 text-[10px] opacity-50 relative z-10 flex justify-end">
            <p className="text-right">© {new Date().getFullYear()} X57 | All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;