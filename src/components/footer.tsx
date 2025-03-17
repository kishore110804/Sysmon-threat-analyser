import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, DollarSign, Share2, Users, Briefcase } from "lucide-react";

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
    <footer className="bg-[#201F1F] text-[#EFEBDF] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section - Contact */}
          <div>
            <h3 className="font-heading text-2xl mb-6">CONTACT US</h3>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mb-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {policyLinks.map((policy, index) => (
                <Link 
                  key={index}
                  to={policy.href}
                  className="opacity-80 hover:opacity-100 hover:text-[#1AFF00] transition-colors"
                >
                  {policy.title}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right Section - Make Money */}
          <div>
            <h3 className="font-heading text-2xl mb-6">
              MAKE <span className="text-[#1AFF00]">MONEY</span> WITH US
            </h3>
            
            <div className="space-y-4">
              {moneyLinks.map((link, index) => (
                <div key={index}>
                  <Link 
                    to={link.href}
                    className="flex items-center opacity-90 hover:opacity-100 transition-all group"
                  >
                    {link.icon}
                    <span className="font-heading group-hover:text-[#1AFF00]">{link.title}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-[#EFEBDF]/10 text-center text-sm opacity-60">
          <p>© {new Date().getFullYear()} X57 | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
