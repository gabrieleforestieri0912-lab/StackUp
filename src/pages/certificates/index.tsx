import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAccessToken } from '../../lib/auth-token';
import { useRouter } from 'next/router';
import SEO from '../../components/ui/SEO';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
 Award,
 Download,
 ExternalLink,
 ArrowLeft,
 Calendar,
 Loader2,
 Layout,
 Trophy,
 Settings,
 LogOut,
 Menu,
 X,
 FileText,
 BookOpen,
} from 'lucide-react';

interface User {
 _id?: string;
 name: string;
 email: string;
 authMethod?: string;
 createdAt?: string;
 enrolledCourses?: string[];
 studyHours?: number;
 [key: string]: any;
}

interface AuthContextType {
 user: User | null;
 logout: () => void;
 loading: boolean;
}

interface CertificateCourse {
 title?: string;
 slug?: string;
 duration?: number;
 [key: string]: any;
}

interface Certificate {
 _id: string;
 certificateId: string;
 completedAt: string;
 courseId?: CertificateCourse;
 [key: string]: any;
}

interface SidebarContentProps {
 user: User;
 pathname: string;
 logout: () => void;
 onNavClick?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ user, pathname, logout, onNavClick }) => {
 return (
 <>
 <div className="px-6 py-7">
 <div className="flex items-center gap-4 mb-8">
 <div className="w-12 h-12 bg-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-600/20 shrink-0">
 {user.name.charAt(0)}
 </div>
 <div className="min-w-0">
 <h2 className="font-jakarta font-bold text-zinc-100 leading-tight truncate">{user.name}</h2>
 <p className="text-xs text-zinc-400 font-medium truncate">{user.email}</p>
 </div>
 </div>

 <nav className="space-y-1.5">
 <Link
 href="/dashboard"
 onClick={onNavClick}
 className={`flex items-center gap-3 px-4 py-3.5 font-bold text-sm transition-all ${
 pathname === '/dashboard'
 ? 'bg-orange-50 text-orange-600'
 : 'text-zinc-400 hover:bg-black hover:text-white'
 }`}
 >
 <Layout size={18} />
 <span>Dashboard</span>
 </Link>
 <Link
 href="/certificates"
 onClick={onNavClick}
 className={`flex items-center gap-3 px-4 py-3.5 font-bold text-sm transition-all ${
 pathname === '/certificates'
 ? 'bg-orange-50 text-orange-600'
 : 'text-zinc-400 hover:bg-black hover:text-white'
 }`}
 >
 <Trophy size={18} />
 <span>Certificati</span>
 </Link>
 <Link
 href="/my-courses"
 onClick={onNavClick}
 className={`flex items-center gap-3 px-4 py-3.5 font-bold text-sm transition-all ${
 pathname === '/my-courses'
 ? 'bg-orange-50 text-orange-600'
 : 'text-zinc-400 hover:bg-black hover:text-white'
 }`}
 >
 <BookOpen size={18} />
 <span>I miei corsi</span>
 </Link>
 <Link
 href="/settings"
 onClick={onNavClick}
 className={`flex items-center gap-3 px-4 py-3.5 font-bold text-sm transition-all ${
 pathname === '/settings'
 ? 'bg-orange-50 text-orange-600'
 : 'text-zinc-400 hover:bg-black hover:text-white'
 }`}
 >
 <Settings size={18} />
 <span>Impostazioni</span>
 </Link>
 </nav>
 </div>

 <div className="mt-auto px-6 py-6 border-t border-zinc-800">
 <button
 onClick={() => { logout(); onNavClick?.(); }}
 className="flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 font-bold text-sm transition-all w-full"
 >
 <LogOut size={18} />
 <span>Esci</span>
 </button>
 </div>
 </>
 );
};

const CertificatesPage: React.FC = () => {
 const { user, logout, loading: authLoading } = useAuth() as AuthContextType;
 const router = useRouter();
 const { pathname } = router;
 const [certificates, setCertificates] = useState<Certificate[]>([]);
 const [loading, setLoading] = useState<boolean>(true);
 const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

 useEffect(() => {
 if (!authLoading && !user) {
 router.push('/login?redirect=/certificates');
 }
 }, [user, authLoading, router]);

 useEffect(() => {
 const fetchCertificates = async (): Promise<void> => {
 if (!user) return;
 try {
 const token = await getAccessToken();
 const res = await fetch('/api/certificates', {
 headers: { Authorization: `Bearer ${token}` },
 });
 const data = await res.json();
 if (data.success) {
 setCertificates(data.data || []);
 }
 } catch (err) {
 console.error('Error fetching certificates:', err);
 } finally {
 setLoading(false);
 }
 };

 fetchCertificates();
 }, [user]);

 const Sidebar: React.FC<{ onNavClick?: () => void }> = ({ onNavClick }) => (
 <aside className="bg-black/90 backdrop-blur-2xl border border-orange-200/80 shadow-[0_20px_50px_rgba(192,38,211,0.08)] flex flex-col overflow-hidden">
 <SidebarContent user={user!} pathname={pathname} logout={logout} onNavClick={onNavClick} />
 </aside>
 );

 if (authLoading || (loading && user)) {
 return (
 <>
 <SEO title="I tuoi Certificati" description="Visualizza e scarica i tuoi certificati di completamento su StackUp." url="/certificates" />
 <div className="min-h-screen bg-black">
 <div className="max-w-7xl mx-auto pt-28 md:pt-32 px-6 sm:px-10 lg:px-12 pb-20">
 <div className="flex gap-10">
 <aside className="hidden lg:block w-64 shrink-0">
 <div className="bg-black/90 backdrop-blur-2xl p-6 space-y-6 border border-orange-200/80 shadow-[0_20px_50px_rgba(192,38,211,0.08)]">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 skeleton" />
 <div className="space-y-2 flex-1">
 <div className="h-4 w-24 skeleton" />
 <div className="h-3 w-32 skeleton" />
 </div>
 </div>
 <div className="space-y-2">
 {[1,2,3,4].map(i => <div key={i} className="h-11 w-full skeleton " />)}
 </div>
 </div>
 </aside>
 <main className="flex-1">
 <div className="flex flex-col items-center justify-center gap-4 pt-20">
 <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
 <p className="text-sm font-bold text-zinc-400">Caricamento certificati...</p>
 </div>
 </main>
 </div>
 </div>
 </div>
 </>
 );
 }

 if (!user) return <SEO title="I tuoi Certificati" description="Visualizza e scarica i tuoi certificati di completamento su StackUp." url="/certificates" />;

 return (
 <div className="min-h-screen bg-black">
 <SEO title="I tuoi Certificati" description="Visualizza e scarica i tuoi certificati di completamento su StackUp." url="/certificates" />

 <AnimatePresence>
 {sidebarOpen && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 bg-black/40 z-40 lg:hidden"
 onClick={() => setSidebarOpen(false)}
 />
 )}
 </AnimatePresence>

 <AnimatePresence>
 {sidebarOpen && (
 <motion.aside
 initial={{ x: '-100%' }}
 animate={{ x: 0 }}
 exit={{ x: '-100%' }}
 transition={{ type: 'spring', damping: 30, stiffness: 300 }}
 className="fixed top-0 left-0 bottom-0 w-72 bg-black/95 backdrop-blur-2xl z-50 flex flex-col pt-6 shadow-2xl lg:hidden"
 >
 <div className="flex justify-end px-6 mb-2">
 <button
 onClick={() => setSidebarOpen(false)}
 className="p-2 hover:bg-zinc-900 transition-colors text-zinc-400"
 >
 <X size={20} />
 </button>
 </div>
 <SidebarContent user={user} pathname={pathname} logout={logout} onNavClick={() => setSidebarOpen(false)} />
 </motion.aside>
 )}
 </AnimatePresence>

 <div className="max-w-7xl mx-auto pt-28 md:pt-32 px-6 sm:px-10 lg:px-12 pb-20">
 <div className="flex gap-10">
 <aside className="hidden lg:block w-64 shrink-0">
 <div className="sticky top-28">
 <Sidebar />
 </div>
 </aside>

 <main className="flex-1 min-w-0">
 <header className="mb-6">
 <div className="flex items-start justify-between gap-4">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <button
 onClick={() => setSidebarOpen(true)}
 className="lg:hidden p-2.5 bg-black border border-zinc-800 shadow-sm text-zinc-400 hover:bg-black transition-colors"
 aria-label="Apri menu"
 >
 <Menu size={18} />
 </button>
 </div>
 <div className="flex items-center gap-4 mb-2">
 <span className="text-orange-600 font-mono text-[10px] font-black uppercase tracking-[0.3em]">Certificazioni</span>
 </div>
 <h1 className="text-xl sm:text-2xl font-jakarta font-black text-zinc-100 mb-1">
 I tuoi <span className="text-orange-600">Certificati</span>
 </h1>
 <p className="text-zinc-400 text-sm font-medium">
 {certificates.length > 0
 ? `Hai ${certificates.length} ${certificates.length === 1 ? 'certificato ottenuto' : 'certificati ottenuti'}.`
 : 'Completa un corso per ottenere il tuo primo certificato.'}
 </p>
 </div>
 </div>
 </header>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
 <div className="bg-black p-5 border border-zinc-800 shadow-sm flex items-center gap-4">
 <div className="w-11 h-11 bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
 <Award size={20} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Certificati</p>
 <p className="text-2xl font-black text-zinc-100">{certificates.length}</p>
 </div>
 </div>
 <div className="bg-black p-5 border border-zinc-800 shadow-sm flex items-center gap-4">
 <div className="w-11 h-11 bg-amber-900/40 flex items-center justify-center text-amber-400 shrink-0">
 <FileText size={20} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Certificato PDF</p>
 <p className="text-2xl font-black text-zinc-100">Stampabile</p>
 </div>
 </div>
 <div className="bg-black p-5 border border-zinc-800 shadow-sm flex items-center gap-4">
 <div className="w-11 h-11 bg-green-900/40 flex items-center justify-center text-green-400 shrink-0">
 <BookOpen size={20} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Corsi completati</p>
 <p className="text-2xl font-black text-zinc-100">{certificates.length}</p>
 </div>
 </div>
 </div>

 {certificates.length === 0 ? (
 <div className="bg-black border border-dashed border-zinc-300 p-12 text-center shadow-sm">
 <div className="w-20 h-20 bg-black flex items-center justify-center mx-auto mb-6">
 <Award size={36} className="text-zinc-300" />
 </div>
 <h2 className="text-2xl font-bold text-zinc-100 mb-3">Nessun certificato ancora</h2>
 <p className="text-zinc-400 font-medium mb-8 max-w-md mx-auto">
 I certificati vengono generati automaticamente al raggiungimento del 100% del corso.
 </p>
 <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold hover:bg-orange-600 transition-all shadow-lg group">
 <span>Vedi i corsi</span>
 <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
 </Link>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {certificates.map((cert, index) => {
 const course = cert.courseId || {};
 return (
 <motion.div
 key={cert.certificateId || cert._id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.05 }}
 >
 <div className="bg-black border border-zinc-800 shadow-sm overflow-hidden group hover:border-orange-500/50 hover:shadow-[0_20px_40px_rgba(192,38,211,0.1)] transition-all duration-500">
 <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-8 text-center relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 -translate-y-1/2 translate-x-1/2"></div>
 <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 translate-y-1/2 -translate-x-1/2"></div>
 <Award size={48} className="text-white/90 mx-auto mb-3" />
 <h3 className="text-white font-jakarta font-bold text-lg leading-tight">Certificato</h3>
 <p className="text-white/70 text-xs font-medium">di completamento</p>
 </div>
 <div className="p-6">
 <h4 className="font-jakarta font-bold text-zinc-100 mb-3 line-clamp-2">
 {course.title || 'Corso completato'}
 </h4>
 <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
 <Calendar size={12} />
 <span>
 {new Date(cert.completedAt).toLocaleDateString('it-IT', {
 year: 'numeric',
 month: 'long',
 day: 'numeric',
 })}
 </span>
 </div>
 <div className="flex gap-2">
 <Link
 href={`/certificates/${cert.certificateId}`}
 target="_blank"
 className="flex-1 py-3 px-4 bg-black text-white font-bold text-xs hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
 >
 <Download size={14} />
 <span>Scarica PDF</span>
 </Link>
 {course.slug && (
 <Link
 href={`/courses/${course.slug}`}
 className="py-3 px-4 bg-black border border-zinc-800 text-zinc-300 font-bold text-xs hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all flex items-center justify-center gap-2"
 >
 <ExternalLink size={14} />
 </Link>
 )}
 </div>
 </div>
 </div>
 </motion.div>
 );
 })}
 </div>
 )}
 </main>
 </div>
 </div>
 </div>
 );
};

export default CertificatesPage;

