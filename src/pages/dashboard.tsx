import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import SEO from '../components/ui/SEO';
import { getAccessToken } from '../lib/auth-token';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Trophy,
  Layout,
  Settings,
  LogOut,
  PlayCircle,
  CheckCircle2,
  Zap,
  TrendingUp,
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  Flame,
  Target,
  ChevronRight,
  Star,
} from 'lucide-react';

interface User {
  name: string;
  email: string;
  enrolledCourses?: string[];
  studyStreak?: number;
  studyHours?: number;
  exp?: number;
  certificates?: { courseId: string; completedAt: string; certificateId: string }[];
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  duration?: number;
  progress?: number;
}

interface OrderItem {
  _id: string;
  items?: { title: string }[];
  totalAmount?: number;
  status?: string;
  createdAt: string;
}

const RANKS = [
  { min: 0, title: 'Novizio', icon: '🌱', color: 'text-zinc-400' },
  { min: 100, title: 'Apprendista', icon: '🔰', color: 'text-blue-400' },
  { min: 300, title: 'Sviluppatore', icon: '💻', color: 'text-emerald-400' },
  { min: 600, title: 'Ingegnere', icon: '⚙️', color: 'text-cyan-400' },
  { min: 1000, title: 'Senior', icon: '🔥', color: 'text-orange-400' },
  { min: 1500, title: 'Architetto', icon: '🏛️', color: 'text-purple-400' },
  { min: 2200, title: 'Maestro', icon: '👑', color: 'text-yellow-400' },
  { min: 3000, title: 'Leggenda', icon: '⭐', color: 'text-red-400' },
  { min: 4000, title: 'StackUp Elite', icon: '💎', color: 'text-orange-400' },
];

function getRank(exp: number) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (exp >= r.min) rank = r;
  }
  return rank;
}

function getLevel(exp: number) {
  return Math.floor(exp / 100) + 1;
}

function getNextLevelExp(exp: number) {
  const currentLevel = getLevel(exp);
  return currentLevel * 100;
}

function getExpProgress(exp: number) {
  const currentLevel = getLevel(exp);
  const currentLevelMin = (currentLevel - 1) * 100;
  const nextLevelMin = currentLevel * 100;
  return ((exp - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
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
          <div className="w-12 h-12 bg-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-600/20 shrink-0 rounded-xl">
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
            className={`flex items-center gap-3 px-4 py-3.5 font-bold text-sm transition-all rounded-xl ${
              pathname === '/dashboard'
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent'
            }`}
          >
            <Layout size={18} />
            <span>I miei corsi</span>
          </Link>
          <Link
            href="/certificates"
            onClick={onNavClick}
            className={`flex items-center gap-3 px-4 py-3.5 font-bold text-sm transition-all rounded-xl ${
              pathname === '/certificates'
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent'
            }`}
          >
            <Trophy size={18} />
            <span>Certificati</span>
          </Link>
          <Link
            href="/settings"
            onClick={onNavClick}
            className={`flex items-center gap-3 px-4 py-3.5 font-bold text-sm transition-all rounded-xl ${
              pathname === '/settings'
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent'
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
          className="flex items-center gap-3 px-4 py-3.5 text-red-400 hover:bg-red-500/10 font-bold text-sm transition-all w-full rounded-xl"
        >
          <LogOut size={18} />
          <span>Esci</span>
        </button>
      </div>
    </>
  );
};

const Dashboard: React.FC = () => {
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;
  const authLoading = auth?.loading;
  const refreshUser = auth?.refreshUser;
  const router = useRouter();
  const { pathname } = router;
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (auth !== null && !authLoading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, authLoading, auth, router]);

  // Aggiorna XP / livello / streak in tempo reale:
  // al ritorno sulla scheda (focus) e periodicamente.
  useEffect(() => {
    if (!refreshUser) return;

    const onFocus = () => {
      refreshUser();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refreshUser();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    const interval = setInterval(() => {
      refreshUser();
    }, 30000);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      clearInterval(interval);
    };
  }, [refreshUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const token = await getAccessToken();

        const [coursesRes, ordersRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/orders', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const coursesData = await coursesRes.json();
        if (coursesData.success && coursesData.data) {
          const filtered = coursesData.data.filter((course: Course) =>
            user.enrolledCourses?.includes(course._id)
          );
          setEnrolledCourses(filtered);
        }

        const ordersData = await ordersRes.json();
        if (ordersData.success) {
          setRecentOrders(ordersData.data || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (authLoading || (loading && user)) {
    return (
      <>
        <SEO title="Dashboard" description="Gestisci i tuoi corsi e i tuoi progressi su StackUp." />
        <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto pt-28 md:pt-32 px-6 sm:px-10 lg:px-12 pb-20">
          <div className="flex gap-10">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-zinc-900/50 p-6 space-y-6 border border-zinc-800 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 skeleton rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 skeleton" />
                    <div className="h-3 w-32 skeleton" />
                  </div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <div key={i} className="h-11 w-full skeleton rounded-xl" />)}
                </div>
              </div>
            </aside>
            <main className="flex-1 space-y-8">
              <div className="space-y-4">
                <div className="h-10 w-64 skeleton" />
                <div className="h-5 w-48 skeleton" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-28 skeleton rounded-2xl" />)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map(i => (
                  <div key={i} className="flex flex-col h-full overflow-hidden bg-black border border-zinc-800 rounded-2xl">
                    <div className="relative aspect-video w-full skeleton" />
                    <div className="p-6 flex flex-col flex-grow space-y-4">
                      <div className="h-5 w-3/4 skeleton" />
                      <div className="flex items-center gap-4">
                        <div className="h-3 w-24 skeleton" />
                        <div className="h-3 w-28 skeleton" />
                      </div>
                      <div className="h-12 w-full skeleton mt-auto rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
      </>
    );
  }

  if (!user || !logout) return <SEO title="Dashboard" description="Gestisci i tuoi corsi e i tuoi progressi su StackUp." />;

  const completedCourses = enrolledCourses.filter(c => c.progress && c.progress >= 80);
  const today = new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const exp = user.exp || 0;
  const rank = getRank(exp);
  const level = getLevel(exp);
  const expProgress = getExpProgress(exp);
  const nextLevelExp = getNextLevelExp(exp);
  const completedCount = completedCourses.length;
  const certCount = user.certificates?.length || 0;

  const Sidebar = ({ onNavClick }: { onNavClick?: () => void }) => (
    <aside className="bg-zinc-900/50 border border-zinc-800/70 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden rounded-2xl">
      <SidebarContent user={user} pathname={pathname} logout={logout} onNavClick={onNavClick} />
    </aside>
  );

  return (
    <div className="min-h-screen bg-black">
      <SEO title="Dashboard" description="Gestisci i tuoi corsi e i tuoi progressi su StackUp." />

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
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
            className="fixed top-0 left-0 bottom-0 w-72 bg-zinc-900/95 backdrop-blur-2xl z-50 flex flex-col pt-6 shadow-2xl lg:hidden"
          >
            <div className="flex justify-end px-6 mb-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-zinc-800 transition-colors text-zinc-400 rounded-lg"
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
            <header className="mb-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="lg:hidden p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 transition-colors rounded-xl"
                      aria-label="Apri menu"
                    >
                      <Menu size={18} />
                    </button>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-jakarta font-black text-zinc-100 mb-1">
                    Bentornato, <span className="text-orange-400">{user.name.split(' ')[0]}</span>!
                  </h1>
                  <p className="text-zinc-500 text-sm font-medium capitalize">{today}</p>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900/80 via-black to-zinc-950 p-6 border border-zinc-800/60 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/5 blur-[100px]" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.25em]">Livello {level}</span>
                      <h2 className="text-2xl font-jakarta font-black text-zinc-100 mt-1">
                        <span className={rank.color}>{rank.icon}</span>{' '}
                        <span className={rank.color}>{rank.title}</span>
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-orange-400">{exp}</p>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">EXP</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500 font-medium">Progresso al prossimo livello</span>
                      <span className="text-zinc-400 font-bold">{exp} / {nextLevelExp} EXP</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(expProgress, 100)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.3)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800/60 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-orange-500/5 blur-[80px]" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500/10 flex items-center justify-center rounded-xl">
                      <Flame size={20} className="text-orange-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Serie di Studio</p>
                      <p className="text-lg font-black text-zinc-100">
                        {user.studyStreak || 0} {user.studyStreak === 1 ? 'Giorno' : 'Giorni'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Target size={12} />
                    <span>Studia ogni giorno per mantenere la serie!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-zinc-900/30 border border-zinc-800/50 p-5 rounded-xl">
                <Clock size={18} className="text-orange-400 mb-3" />
                <p className="text-2xl font-black text-zinc-100">{user.studyHours || 0}h</p>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Ore Studiate</p>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800/50 p-5 rounded-xl">
                <CheckCircle2 size={18} className="text-emerald-400 mb-3" />
                <p className="text-2xl font-black text-zinc-100">{completedCount}</p>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Completati</p>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800/50 p-5 rounded-xl">
                <Trophy size={18} className="text-yellow-400 mb-3" />
                <p className="text-2xl font-black text-zinc-100">{certCount}</p>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Certificati</p>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800/50 p-5 rounded-xl">
                <TrendingUp size={18} className="text-blue-400 mb-3" />
                <p className="text-2xl font-black text-zinc-100">{enrolledCourses.length}</p>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Corsi Attivi</p>
              </div>
            </div>

            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-jakarta font-black text-zinc-100">Continua a studiare</h2>
                <Link href="/courses" className="text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
                  <span>Catalogo</span>
                  <ChevronRight size={16} />
                </Link>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="bg-zinc-900/30 border border-dashed border-zinc-700/50 p-12 text-center rounded-2xl">
                  <div className="w-16 h-16 bg-zinc-800/50 flex items-center justify-center mx-auto mb-6 rounded-xl">
                    <BookOpen size={24} className="text-zinc-500" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-2">Nessun corso attivo</h3>
                  <p className="text-zinc-500 mb-8 max-w-sm mx-auto">Non hai ancora acquistato alcun corso. Inizia oggi il tuo percorso nel mondo della programmazione.</p>
                  <Link href="/courses" className="inline-flex px-6 py-3 bg-orange-600 text-white font-bold hover:bg-orange-500 transition-all rounded-xl shadow-lg shadow-orange-500/20">
                    Sfoglia il catalogo
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCourses.map((course, index) => {
                    const isCompleted = course.progress && course.progress >= 80;
                    return (
                      <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`relative flex flex-col h-full group transition-all duration-500 overflow-hidden bg-zinc-900/30 border rounded-2xl ${
                          isCompleted ? 'border-emerald-500/30 hover:border-emerald-400/50' : 'border-zinc-800/60 hover:border-orange-400/30'
                        } hover:shadow-[0_12px_40px_rgba(249,115,22,0.06)]`}>
                          {isCompleted && (
                            <div className="absolute top-3 right-3 z-10">
                              <div className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20">
                                Completato
                              </div>
                            </div>
                          )}
                          <div className="relative aspect-video w-full overflow-hidden">
                            <Image
                              src={course.imageUrl || '/course-placeholder.jpg'}
                              alt={course.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex items-center justify-between text-white mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Progresso</span>
                                <span className="text-[10px] font-bold">{course.progress || 0}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-1000 rounded-full ${
                                    isCompleted ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                                  }`}
                                  style={{ width: `${course.progress || 0}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-lg font-jakarta font-bold text-zinc-100 mb-3 group-hover:text-orange-400 transition-colors">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-4 mb-6">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                <Clock size={12} />
                                <span>{course.duration} ore</span>
                              </div>
                              {isCompleted && (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                  <CheckCircle2 size={12} />
                                  <span>Completato</span>
                                </div>
                              )}
                            </div>
                            <Link
                              href={`/courses/${course.slug}`}
                              className={`mt-auto w-full py-3.5 font-bold text-sm text-center transition-all flex items-center justify-center gap-2 group/btn rounded-xl ${
                                isCompleted
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                  : 'bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-500/20'
                              }`}
                            >
                              <span>{isCompleted ? 'Rivedi corso' : 'Riprendi studio'}</span>
                              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>

            {recentOrders.length > 0 && (
              <section>
                <h2 className="text-xl font-jakarta font-black text-zinc-100 mb-6">Attività recente</h2>
                <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl overflow-hidden">
                  {recentOrders.slice(0, 5).map((order, index) => (
                    <div
                      key={order._id}
                      className={`flex items-center justify-between p-5 ${
                        index !== recentOrders.length - 1 ? 'border-b border-zinc-800/60' : ''
                      } hover:bg-zinc-900/50 transition-colors`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-500/10 flex items-center justify-center shrink-0 rounded-xl">
                          <ShoppingBag size={18} className="text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-100">
                            {order.items && order.items.length > 0
                              ? `Acquisto: ${order.items.map(i => i.title).join(', ')}`
                              : 'Acquisto effettuato'}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                            {new Date(order.createdAt).toLocaleDateString('it-IT', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-zinc-100">
                          {order.totalAmount ? `€${order.totalAmount.toFixed(2)}` : ''}
                        </p>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          order.status === 'completed' ? 'text-emerald-400' : 'text-zinc-500'
                        }`}>
                          {order.status === 'completed' ? 'Completato' : order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {recentOrders.length > 5 && (
                    <Link
                      href="/orders"
                      className="flex items-center justify-center gap-2 p-5 text-sm font-bold text-orange-400 hover:bg-orange-500/5 transition-colors border-t border-zinc-800/60"
                    >
                      <span>Vedi tutti gli ordini</span>
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
