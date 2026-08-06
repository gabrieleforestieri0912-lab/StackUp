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
    {!isNoLayoutPage && <Navbar />}
    <main className="flex-1 w-full overflow-x-hidden">{children}</main>
    {!isNoLayoutPage && <Footer />}
   </div>
 );
}
