'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Tag, Megaphone, ArrowRight } from 'lucide-react';

type BarType = 'discount' | 'new' | 'announcement';

interface TopBarProps {
 message: string;
 type?: BarType;
 link?: { href: string; label: string };
 persistent?: boolean;
}

const typeStyles: Record<BarType, string> = {
 discount: 'bg-gradient-to-r from-orange-600 to-orange-600 text-white',
 new: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
 announcement: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
};

const typeIcons: Record<BarType, React.ComponentType<{ size?: number; className?: string }>> = {
 discount: Tag,
 new: Sparkles,
 announcement: Megaphone
};

const TopBar = ({ message, type = 'announcement', link, persistent = false }: TopBarProps) => {
 const [visible, setVisible] = useState(true);
 const Icon = typeIcons[type];

 return (
  <AnimatePresence>
   {visible && (
    <motion.div
     initial={{ height: 0, opacity: 0 }}
     animate={{ height: 'auto', opacity: 1 }}
     exit={{ height: 0, opacity: 0 }}
     transition={{ duration: 0.3, ease: 'easeInOut' }}
     className={`relative overflow-hidden ${typeStyles[type]}`}
    >
     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3 text-base font-medium">
       <Icon size={18} className="shrink-0" />
      <span>{message}</span>
       {link && (
        <Link
         href={link.href}
         className="inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold"
        >
         {link.label}
         <ArrowRight size={14} />
        </Link>
       )}
      {!persistent && (
       <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/20 transition-colors"
        aria-label="Chiudi"
       >
        <X size={16} />
       </button>
      )}
     </div>
    </motion.div>
   )}
  </AnimatePresence>
 );
};

export default TopBar;

