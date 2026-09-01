'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const noLayoutPages = ['/cart', '/login', '/register', '/auth/callback'];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const currentPath = pathname ?? '';
 const isNoLayoutPage = noLayoutPages.includes(currentPath);

  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-100 overflow-x-hidden w-full">
     {!isNoLayoutPage && (
      <a
       href="#main-content"
       className="absolute -translate-y-full focus:translate-y-0 focus:top-2 focus:left-2 focus:z-[3000] focus:px-4 focus:py-2 focus:bg-orange-600 focus:text-white rounded-md"
      >
       Salta al contenuto
      </a>
     )}
     {!isNoLayoutPage && <Navbar />}
     <main id="main-content" className="flex-1 w-full overflow-x-hidden scroll-mt-24">{children}</main>
    {!isNoLayoutPage && <Footer />}
   </div>
 );
}
