import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Share2, Users, Briefcase } from "lucide-react";

export const Footer = () => {
  const socialLinks = [
    { icon: <Facebook size={20} />, href: "https://facebook.com", label: "Facebook" },
    { icon: <Twitter size={20} />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Instagram size={20} />, href: "https://instagram.com", label: "Instagram" },
    { icon: <Youtube size={20} />, href: "https://youtube.com", label: "YouTube" },
    { icon: <Linkedin size={20} />, href: "https://linkedin.com", label: "LinkedIn" },
  ];

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
      icon: <Share2 size={18} className="mr-2 text-[#1AFF00]" /> 
    },
    { 
      title: "Collaboration? We are in", 
      href: "/makemoney/collaborate", 
      icon: <Users size={18} className="mr-2 text-[#1AFF00]" /> 
    },
    { 
      title: "Become an X57 Sales Executive", 
      href: "/makemoney/sales", 
      icon: <Briefcase size={18} className="mr-2 text-[#1AFF00]" /> 
    },
  ];

  return (
    <footer className="bg-[#000000] text-[#EFEBDF] py-16 relative overflow-hidden">
      {/* Large background tagline text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h2 className="text-[15vw] md:text-[12vw] font-heading font-bold text-[#201F1F]/10 whitespace-nowrap select-none tracking-tight">
          THE BOX? BREAK IT!
        </h2>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-12">
          {/* Left Section - Contact */}
          <div>
            <h3 className="font-heading text-5xl md:text-6xl mb-8">
              <span className="text-[#1AFF00]">Contact</span>{" "}
              <span className="text-[#EFEBDF]">US</span>
            </h3>
            
            {/* Social Media Links */}
            <div className="flex space-x-5 mb-10">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#EFEBDF]/10 p-2 rounded-full hover:bg-[#1AFF00]/20 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            {/* Policies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {policyLinks.map((policy, index) => (
                <Link 
                  key={index}
                  to={policy.href}
                  className="text-sm md:text-base opacity-70 hover:opacity-100 hover:text-[#1AFF00] transition-colors"
                >
                  {policy.title}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right Section - Make Money - Aligned to the right */}
          <div className="md:text-right md:flex md:flex-col md:items-end">
            <h3 className="font-heading text-5xl md:text-6xl mb-8">
              <span className="text-[#1AFF00]">Make Money</span> with us
            </h3>
            
            <div className="space-y-5">
              {moneyLinks.map((link, index) => (
                <div key={index}>
                  <Link 
                    to={link.href}
                    className="flex items-center opacity-90 hover:opacity-100 transition-all group md:justify-end"
                  >
                    <span className="font-heading text-xl group-hover:text-[#1AFF00] md:order-1">{link.title}</span>
                    <span className="md:order-2 md:ml-2 flex-shrink-0">{link.icon}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-[#EFEBDF]/10 text-center text-sm opacity-60">
          <p>© {new Date().getFullYear()} X57 | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
