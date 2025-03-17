import { Link } from "react-router-dom";
import { DollarSign } from "lucide-react";
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
      title: "Share and Earn", 
      href: "/makemoney/share",
    },
    { 
      title: "Collaboration? We are in", 
      href: "/makemoney/collaborate",
    },
    { 
      title: "Become an X57 Sales Executive", 
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
            
            {/* Right Section - Make Money - Aligned to the right */}
            <div className="md:text-right md:flex md:flex-col md:items-end">
              <h3 className="font-heading text-4xl md:text-5xl mb-4 flex items-center md:justify-end">
                <span className="text-[#1AFF00]">Make Money
                <DollarSign className="text-[#1AFF00] h-6 w-6 md:h-8 md:w-8 inline-flex mr-1 md:mr-2" /></span> with us
              </h3>
              
              <div className="grid grid-cols-1 gap-y-1">
                {moneyLinks.map((link, index) => (
                  <div key={index}>
                    <Link 
                      to={link.href}
                      className="text-xs md:text-sm opacity-90 hover:opacity-100 transition-all group md:justify-end hover:text-[#1AFF00]"
                    >
                      {link.title}
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