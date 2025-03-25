import { BadgeCheck, ShoppingBag, Brush, Building2 } from 'lucide-react';

interface RoleBadgeProps {
  role: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const badgeStyles = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-1.5 px-3',
    lg: 'text-base py-2 px-4'
  };
  
  const baseClasses = `font-medium rounded-full inline-flex items-center gap-1.5 ${badgeStyles[size]}`;
  
  switch (role.toLowerCase()) {
    case 'customer':
      return (
        <div className={`${baseClasses} bg-blue-100 text-blue-800`}>
          <ShoppingBag size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
          Customer
        </div>
      );
    case 'designer':
      return (
        <div className={`${baseClasses} bg-[#1AFF00]/20 text-[#1AFF00]/90`}>
          <Brush size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
          Designer
          <BadgeCheck size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} className="ml-0.5" />
        </div>
      );
    case 'reseller':
      return (
        <div className={`${baseClasses} bg-purple-100 text-purple-800`}>
          <Building2 size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
          Reseller
        </div>
      );
    case 'admin':
      return (
        <div className={`${baseClasses} bg-black text-white`}>
          <BadgeCheck size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
          Admin
        </div>
      );
    default:
      return null;
  }
}
