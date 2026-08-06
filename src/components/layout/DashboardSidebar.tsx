import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout, Trophy, Settings, LogOut } from 'lucide-react';
import { User } from '../../context/AuthContext';

interface DashboardSidebarProps {
 user: User | null;
 logout: () => void;
 onNavClick?: () => void;
 className?: string;
}

interface NavItem {
 href: string;
 icon: React.ComponentType<{ size?: number }>;
 label: string;
}

const NAV_ITEMS: NavItem[] = [
 { href: '/dashboard', icon: Layout, label: 'I miei corsi' },
 { href: '/certificates', icon: Trophy, label: 'Certificati' },
 { href: '/settings', icon: Settings, label: 'Impostazioni' },
];

const DashboardSidebar = ({ user, logout, onNavClick, className = '' }: DashboardSidebarProps) => {
 const { pathname } = useRouter();

 return (
   <aside className={`bg-black shadow-sm border border-zinc-800 flex flex-col overflow-hidden rounded-2xl ${className}`}>
   <div className="px-6 py-7">
    <div className="flex items-center gap-4 mb-8">
       <div className="w-14 h-14 bg-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-orange-600/20 shrink-0 rounded-xl">
      {user?.name?.charAt(0) || '?'}
     </div>
     <div className="min-w-0">
       <h2 className="font-jakarta font-bold text-zinc-100 leading-tight truncate text-lg">{user?.name || ''}</h2>
       <p className="text-sm text-zinc-400 font-medium truncate">{user?.email || ''}</p>
     </div>
    </div>

    <nav className="space-y-1.5">
     {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
      <Link
       key={href}
       href={href}
       onClick={onNavClick}
         className={`flex items-center gap-3 px-4 py-4 font-bold text-base transition-all rounded-xl ${
         pathname === href
          ? 'bg-orange-500/20 text-orange-400'
          : 'text-zinc-400 hover:bg-black hover:text-white'
        }`}
      >
       <Icon size={18} />
       <span>{label}</span>
      </Link>
     ))}
    </nav>
   </div>

   <div className="mt-auto px-6 py-6 border-t border-zinc-800">
    <button
     onClick={() => { logout(); onNavClick?.(); }}
      className="flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-500/10 font-bold text-sm transition-all w-full rounded-xl"
    >
     <LogOut size={18} />
     <span>Esci</span>
    </button>
   </div>
  </aside>
 );
};

export default DashboardSidebar;

