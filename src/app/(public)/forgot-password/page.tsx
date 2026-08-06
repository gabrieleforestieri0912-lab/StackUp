'use client';

import React, { useState, FormEvent } from'react';
import Link from'next/link';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from'lucide-react';
import { motion } from'framer-motion';

const ForgotPassword: React.FC = () => {
 const [email, setEmail] = useState<string>('');
 const [loading, setLoading] = useState<boolean>(false);
 const [sent, setSent] = useState<boolean>(false);
 const [error, setError] = useState<string>('');

 const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
 e.preventDefault();
 setLoading(true);
 setError('');

 try {
 const response = await fetch('/api/auth/forgot-password', {
 method:'POST',
 headers: {'Content-Type':'application/json' },
 body: JSON.stringify({ email }),
 });

 const data = await response.json();

 if (!response.ok) throw new Error(data.message);

 setSent(true);
 } catch (err: any) {
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="min-h-screen flex items-center justify-center px-6 py-6 bg-black"
 >
 
 <div className="max-w-sm w-full bg-black p-8 border border-zinc-800 shadow-2xl shadow-black/50 rounded-2xl">
 {sent ? (
 <div className="text-center">
<div className="w-14 h-14 bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4 rounded-xl">
  <CheckCircle2 size={28} />
 </div>
 <h1 className="text-2xl font-jakarta font-extrabold text-zinc-100 mb-2">Controlla la tua email</h1>
 <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-6">
 Se esiste un account con l&apos;email <strong className="text-zinc-300">{email}</strong>,
 riceverai un link per reimpostare la password.
 </p>
 <p className="text-xs text-zinc-400 font-medium mb-8">
 Non hai ricevuto nulla? Controlla la cartella spam o riprova.
 </p>
 <Link
 href="/login"
 className="inline-flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors"
 >
 <ArrowLeft size={16} />
 Torna al login
 </Link>
 </div>
 ) : (
 <>
 <div className="text-center mb-8">
<div className="w-14 h-14 bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4 rounded-xl">
  <Mail size={28} />
 </div>
 <h1 className="text-2xl font-jakarta font-extrabold text-zinc-100">Recupera Password</h1>
 <p className="text-sm text-zinc-400 mt-1 font-medium">
 Inserisci la tua email e ti invieremo un link per reimpostare la password.
 </p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-5">
 <div>
 <label className="block text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400 mb-1.5">Email</label>
 <div className="relative">
 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
 <input
 type="email"
 required
 className="w-full pl-11 pr-4 py-3.5 bg-black border border-zinc-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all font-medium text-zinc-100 text-sm rounded-xl"
 placeholder="nome@esempio.it"
 value={email}
 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
 disabled={loading}
 className="w-full py-3.5 bg-black text-white font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/10 disabled:opacity-50 rounded-xl"
 >
 {loading ?'Invio in corso...' :'Invia link di recupero'}
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

export default ForgotPassword;

