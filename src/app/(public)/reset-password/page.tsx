'use client';

import React, { Suspense, useState, useEffect, FormEvent } from'react';
import { useRouter, useSearchParams } from'next/navigation';
import Link from'next/link';
import { Lock, CheckCircle2, AlertCircle, ArrowLeft } from'lucide-react';
import { motion } from'framer-motion';

const ResetPasswordForm: React.FC = () => {
 const router = useRouter();
 const searchParams = useSearchParams();
 const token: string | null = searchParams?.get('token') ?? null;

 const [password, setPassword] = useState<string>('');
 const [confirmPassword, setConfirmPassword] = useState<string>('');
 const [loading, setLoading] = useState<boolean>(false);
 const [done, setDone] = useState<boolean>(false);
 const [error, setError] = useState<string>('');

 useEffect(() => {
 if (!token) {
 setError('Token mancante. Richiedi un nuovo link di recupero.');
 }
 }, [token]);

 const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
 e.preventDefault();
 setError('');

 if (password !== confirmPassword) {
 setError('Le password non coincidono');
 return;
 }

 if (password.length < 6) {
 setError('La password deve essere di almeno 6 caratteri');
 return;
 }

 setLoading(true);

 try {
 const response = await fetch('/api/auth/reset-password', {
 method:'POST',
 headers: {'Content-Type':'application/json' },
 body: JSON.stringify({ token, password }),
 });

 const data = await response.json();

 if (!response.ok) throw new Error(data.message);

 setDone(true);
 } catch (err: any) {
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

 if (!token && !error) return null;

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="min-h-screen flex items-center justify-center px-6 py-6 bg-black"
 >
 
 <div className="max-w-sm w-full bg-black p-8 border border-zinc-800 shadow-2xl shadow-black/50 rounded-2xl">
 {done ? (
 <div className="text-center">
<div className="w-14 h-14 bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4 rounded-xl">
  <CheckCircle2 size={28} />
 </div>
 <h1 className="text-2xl font-jakarta font-extrabold text-zinc-100 mb-2">Password reimpostata!</h1>
 <p className="text-sm text-zinc-400 font-medium mb-8">
 La tua password &egrave; stata aggiornata con successo. Ora puoi accedere con la nuova password.
 </p>
 <Link
 href="/login"
 className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white font-bold hover:bg-orange-600 transition-all shadow-lg rounded-xl"
 >
 Accedi ora
 <ArrowLeft size={16} className="rotate-180" />
 </Link>
 </div>
 ) : (
 <>
 <div className="text-center mb-8">
<div className="w-14 h-14 bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4 rounded-xl">
  <Lock size={28} />
 </div>
 <h1 className="text-2xl font-jakarta font-extrabold text-zinc-100">Nuova Password</h1>
 <p className="text-sm text-zinc-400 mt-1 font-medium">
 Scegli una nuova password per il tuo account.
 </p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-5">
 <div>
 <label className="block text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400 mb-1.5">Nuova Password</label>
 <div className="relative">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
 <input
 type="password"
 required
 minLength={6}
 className="w-full pl-11 pr-4 py-3.5 bg-black border border-zinc-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all font-medium text-zinc-100 text-sm rounded-xl"
 placeholder="Almeno 6 caratteri"
 value={password}
 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
 />
 </div>
 </div>

 <div>
 <label className="block text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400 mb-1.5">Conferma Password</label>
 <div className="relative">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
 <input
 type="password"
 required
 minLength={6}
 className="w-full pl-11 pr-4 py-3.5 bg-black border border-zinc-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all font-medium text-zinc-100 text-sm rounded-xl"
 placeholder="Reinserisci la password"
 value={confirmPassword}
 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
 />
 </div>
 </div>

 {error && (
 <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-900/50 rounded-xl">
 <AlertCircle size={16} className="text-red-500 shrink-0" />
 <span className="text-sm font-medium text-red-600">{error}</span>
 </div>
 )}

 <button
 type="submit"
 disabled={loading || !token}
 className="w-full py-3.5 bg-black text-white font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/10 disabled:opacity-50 rounded-xl"
 >
 {loading ?'Reimpostazione...' :'Reimposta Password'}
 </button>
 </form>

 <div className="mt-6 text-center">
 <Link
 href="/login"
 className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-orange-600 transition-colors"
 >
 <ArrowLeft size={16} />
 Torna al login
 </Link>
 </div>
 </>
 )}
 </div>
 </motion.div>
 );
};

const ResetPassword: React.FC = () => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center px-6 py-6 bg-black">
      <div className="max-w-sm w-full bg-black p-8 border border-zinc-800 shadow-2xl shadow-black/50 rounded-2xl text-center">
        <p className="text-zinc-400 font-medium">Caricamento...</p>
      </div>
    </div>
  }>
    <ResetPasswordForm />
  </Suspense>
);

export default ResetPassword;

