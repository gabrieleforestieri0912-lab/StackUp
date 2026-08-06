import React from 'react';
import Link from 'next/link';
import SEO from '../components/ui/SEO';
import { motion } from 'framer-motion';
import { ArrowRight, Frown } from 'lucide-react';

const Custom404: React.FC = () => {
 return (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="min-h-screen flex items-center justify-center px-6 bg-black"
 >
 <SEO title="Pagina non trovata" description="La pagina che stai cercando non esiste." url="/404" />

 <div className="text-center max-w-md">
 <div className="w-20 h-20 bg-orange-100 flex items-center justify-center mx-auto mb-8">
 <Frown size={40} className="text-orange-600" />
 </div>
 <h1 className="text-6xl font-jakarta font-black text-zinc-100 mb-4">404</h1>
 <p className="text-xl font-bold text-zinc-400 mb-2">Pagina non trovata</p>
 <p className="text-zinc-400 font-medium mb-6">
 La pagina che stai cercando non esiste o è stata spostata.
 </p>
 <Link
 href="/"
 className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold hover:bg-orange-600 transition-all shadow-lg group"
 >
 Torna alla Home
 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
 </Link>
 </div>
 </motion.div>
 );
};

export default Custom404;

