import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import SEO from '../components/ui/SEO';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
 BookOpen,
 Clock,
 ArrowRight,
 PlayCircle,
 CheckCircle2,
 GraduationCap,
 Sparkles,
 BookMarked,
 BarChart3
} from 'lucide-react';

interface Course {
 _id: string;
 title: string;
 slug: string;
 description?: string;
 duration?: number;
 imageUrl?: string;
 progress?: number;
}

const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
  opacity: 1,
  transition: { staggerChildren: 0.06 },
 },
};

const itemVariants = {
 hidden: { opacity: 0, y: 20 },
 visible: { opacity: 1, y: 0 },
};

const MyCourses: React.FC = () => {
 const auth = useAuth();
 const user = auth?.user;
 const loading = auth?.loading;
 const router = useRouter();
 const [courses, setCourses] = useState<Course[]>([]);
 const [pageLoading, setPageLoading] = useState(true);

 useEffect(() => {
 if (auth !== null && !loading && !user) {
 router.push('/login?redirect=/my-courses');
 }
 }, [user, loading, auth, router]);

 useEffect(() => {
 const fetchCourses = async () => {
 if (!user || !user.enrolledCourses || user.enrolledCourses.length === 0) {
 setPageLoading(false);
 return;
 }

 try {
 const response = await fetch('/api/courses');
 const data = await response.json();

 if (data.success && data.data) {
 const filtered = data.data.filter((course: Course) =>
 user.enrolledCourses.includes(course._id)
 );
 setCourses(filtered);
 }
 } catch (error) {
 console.error('Error fetching courses:', error);
 } finally {
 setPageLoading(false);
 }
 };

 if (user) fetchCourses();
 }, [user]);

 const totalHours = courses.reduce((acc: number, c: Course) => acc + (c.duration || 0), 0);

 if (loading || auth === null) {
 return (
 <>
 <SEO title="I Miei Corsi" description="Accedi ai tuoi corsi acquistati su StackUp." url="/my-courses" />
 <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 px-6">
 <div className="max-w-6xl mx-auto space-y-10">
 <div className="space-y-4">
 <div className="h-8 w-64 skeleton rounded-lg" />
 <div className="h-4 w-48 skeleton rounded-lg" />
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {[1, 2, 3].map(i => (
 <div key={i} className="bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden">
 <div className="aspect-video w-full skeleton" />
 <div className="p-5 space-y-3">
 <div className="h-5 w-3/4 skeleton rounded-md" />
 <div className="h-3 w-1/2 skeleton rounded-md" />
 <div className="h-10 w-full skeleton rounded-lg" />
 </div>
 </div>
 ))}   </div>
   </div>
 </div>
 </>
 );
 }

 if (!user) return <SEO title="I Miei Corsi" description="Accedi ai tuoi corsi acquistati su StackUp." url="/my-courses" />;

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="min-h-screen bg-[#0a0a0a] pt-20 md:pt-24 pb-16 px-6"
 >
 <Head>
  <title>I Miei Corsi | StackUp Room</title>
  <meta name="description" content="Accedi ai tuoi corsi acquistati su StackUp." />
 </Head>
 <SEO title="I Miei Corsi" description="Accedi ai tuoi corsi acquistati su StackUp." url="/my-courses" />

 <div className="max-w-6xl mx-auto">
 <header className="mb-10">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <GraduationCap size={22} className="text-orange-400" />
 <span className="text-orange-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">La mia area</span>
 </div>
 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-jakarta font-black text-white tracking-tight mb-2">
 I tuoi <span className="text-orange-400">corsi</span>
 </h1>
 <p className="text-zinc-400 font-medium">
 {courses.length > 0
 ? `Hai ${courses.length} corsi nel tuo catalogo.`
 : 'Non hai ancora acquistato corsi.'}
 </p>
 </div>
 <Link
 href="/courses"
 className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all shrink-0"
 >
 <Sparkles size={16} />
 <span>Esplora catalogo</span>
 <ArrowRight size={16} />
 </Link>
 </div>
 </header>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
 <div className="bg-[#111] border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-sm">
 <div className="w-11 h-11 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center shrink-0">
 <BookOpen size={20} />
 </div>
 <div>
 <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Corsi acquistati</p>
 <p className="text-2xl font-black text-white">{courses.length}</p>
 </div>
 </div>
 <div className="bg-[#111] border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-sm">
 <div className="w-11 h-11 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center shrink-0">
 <Clock size={20} />
 </div>
 <div>
 <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Ore di contenuti</p>
 <p className="text-2xl font-black text-white">{totalHours}h</p>
 </div>
 </div>
 <div className="bg-[#111] border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-sm">
 <div className="w-11 h-11 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
 <BarChart3 size={20} />
 </div>
 <div>
 <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Accesso a vita</p>
 <p className="text-2xl font-black text-white">Sempre</p>
 </div>
 </div>
 </div>

 {courses.length === 0 ? (
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.02 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
  className="bg-[#111] border border-dashed border-zinc-700 rounded-2xl p-12 text-center backdrop-blur-sm"
  >
 <div className="w-20 h-20 bg-zinc-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-700">
 <BookMarked size={36} className="text-zinc-500" />
 </div>
 <h2 className="text-2xl font-jakarta font-black text-white mb-3">Nessun corso acquistato</h2>
 <p className="text-zinc-400 font-medium mb-8 max-w-md mx-auto">
 Sfoglia il catalogo e scegli il corso perfetto per dare il via alla tua carriera nella programmazione.
 </p>
 <Link
 href="/courses"
 className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all"
 >
 <span>Sfoglia il catalogo</span>
 <ArrowRight size={16} />
 </Link>
 </motion.div>
 ) : (
 <motion.div
 variants={containerVariants}
 initial="hidden"
 animate="visible"
 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
 >
 {courses.map((course, index) => (
 <motion.div key={course._id} variants={itemVariants}>
 <Link
 href={`/courses/${course.slug}`}
 className="flex flex-col h-full group bg-[#111] border border-zinc-800 rounded-2xl hover:border-orange-400/30 transition-all duration-500 overflow-hidden no-underline"
 >
 <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
  <Image
  src={course.imageUrl || '/course-placeholder.jpg'}
  alt={course.title}
  fill
  className="object-cover group-hover:scale-105 transition-transform duration-700"
  />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
 <div className="absolute bottom-3 left-3 right-3">
 <div className="flex items-center justify-between text-white mb-1.5">
 <span className="text-[9px] font-black uppercase tracking-widest text-white/70">Progresso</span>
 <span className="text-[9px] font-black text-white">{(course.progress || 45)}%</span>
 </div>
 <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
 <div
 className="h-full bg-orange-400 rounded-full"
 style={{ width: `${course.progress || 45}%` }}
 />
 </div>
 </div>
 </div>

 <div className="p-5 flex flex-col flex-1 gap-3">
 <h3 className="text-base font-jakarta font-black text-white leading-snug group-hover:text-orange-400 transition-colors line-clamp-2">
 {course.title}
 </h3>

 {course.description && (
 <p className="text-xs text-zinc-500 font-medium leading-relaxed line-clamp-2">
 {course.description}
 </p>
 )}

 <div className="flex items-center gap-3 text-xs font-bold text-zinc-500 mt-auto pt-3 border-t border-zinc-800/50">
 <span className="flex items-center gap-1">
 <Clock size={12} />
 {course.duration} ore
 </span>
 </div>

 <div className="pt-1">
 <div className="w-full py-3 bg-white/5 text-white font-black text-xs uppercase tracking-widest text-center rounded-xl hover:bg-orange-400 hover:text-black transition-all flex items-center justify-center gap-2">
 <PlayCircle size={14} />
 <span>Riprendi studio</span>
 </div>
 </div>
 </div>
 </Link>
 </motion.div>
 ))}
 </motion.div>
 )}
 </div>
 </motion.div>
 );
};

export default MyCourses;
