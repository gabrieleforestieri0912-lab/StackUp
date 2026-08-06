/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle, ArrowRight, Lock, Lightbulb, Code2, DollarSign, TrendingUp, Rocket, Target, Wrench, Brain, Clock, BookOpen, Star,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';

const SECTIONS_DATA: Record<string, { title: string; desc: string; steps: string[] }> = {
  'validare-idea': {
    title: "Validare un'idea",
    desc: "Non serve l'idea del secolo. Serve un problema reale che puoi risolvere.",
    steps: [
      'Identifica un dolore concreto nel tuo lavoro o nella vita di tutti i giorni',
      'Chiediti: "una AI può automatizzare o migliorare questo processo?"',
      'Parla con 5 potenziali utenti prima di scrivere una riga di codice',
      'Verifica che qualcuno sia disposto a pagare per la soluzione',
      "Riduci l'idea a un singolo problema risolvibile in 2-4 settimane",
    ],
  },
  'scegliere-stack': {
    title: 'Scegliere lo stack',
    desc: "Non serve un'architettura enterprise. Scegli strumenti che ti permettano di shipvare veloce.",
    steps: [
      'Frontend: Next.js + Tailwind CSS per un MVP rapido',
      'AI/ML: OpenAI API, Anthropic Claude o modelli open-source via Replicate',
      'Backend: Next.js API routes o Python FastAPI per task complessi',
      'Database: Supabase (PostgreSQL) per dati strutturati + Vector store',
      'Auth: NextAuth o Clerk per autenticazione in 10 minuti',
      'Deploy: Vercel per frontend, Railway o Fly.io per backend',
    ],
  },
  'pricing-gtm': {
    title: 'Pricing & go-to-market',
    desc: 'Non regalare il tuo prodotto. Il prezzo giusto è quello che il mercato sostiene.',
    steps: [
      'Modello freemium: tier gratuito limitato, tier Pro a €9-29/mese',
      'Pay-per-use per API AI: fattura in base a crediti/token consumati',
      'Offri prova gratuita di 7-14 giorni senza carta di credito',
      'Prezzo annuale con 20-30% di sconto per revenue prevedibile',
      'Aggiungi un tier Enterprise per customizzazione e SLA',
    ],
  },
  'go-to-market': {
    title: 'Go-to-market per solitari',
    desc: 'Non hai un team di marketing. Usa strategie che funzionano per founder solitari.',
    steps: [
      'Launch su Product Hunt con una demo video di 60 secondi',
      'Posta su Reddit e Hacker News con una storia autentica',
      'Costruisci in pubblico su Twitter/X: mostra il progresso quotidianamente',
      'Crea contenuti che risolvono il problema che il tuo prodotto affronta',
      'Raggiungi creator e newsletter nel tuo nicchia con demo personalizzate',
      'Chiedi feedback a ogni utente e iterazione rapida (48h max)',
    ],
  },
  'ai-first-strategy': {
    title: 'AI-first product strategy',
    desc: 'Il prodotto non è un\'app con l\'AI aggiunta. L\'AI è il prodotto.',
    steps: [
      'Identifica task che oggi richiedono tempo umano e possono essere automatizzati',
      'Scegli il modello giusto: GPT-4 per linguaggio, Claude per analisi, modelli open-source per economia',
      'Progetta l\'UX attorno all\'AI: input utente → elaborazione AI → output strutturato',
      'Gestisci fallimenti graceful: quando l\'AI sbaglia, l\'utente deve capire perché',
      'Implementa feedback loop: ogni risposta può migliorare il modello con fine-tuning o RAG',
      'Misura qualità: latenza, accuratezza, tasso di allucinazione e costo per richiesta',
    ],
  },
  'tooling-automation': {
    title: 'Tooling & automazione',
    desc: 'Se lo fai più di due volte, automatizzalo.',
    steps: [
      'CI/CD: GitHub Actions per test, build e deploy automatico su Vercel/Railway',
      'Monitoring: Sentry per errori, Logtail per log, Better Stack per uptime',
      'Email: Resend o Loops.so per transazionali e marketing',
      'Billing: Stripe con webhook per gestione abbonamenti e fatturazione',
      'Customer support: Intercom o Crisp con chatbot AI per risposte immediate',
      'Backup: automatico su S3 o Supabase per database e file upload',
      'Scheduled job: Cron su GitHub Actions o Trigger.dev per task periodici',
    ],
  },
  'debugging-mentale': {
    title: 'Debugging mentale',
    desc: 'Il founder solitario non combatte solo bug. Combatte anche la propria testa.',
    steps: [
      'Riconosci il pattern: procrastinazione quando il task è troppo grande o ambiguo',
      'Spezza il problema: se un task richiede > 2 ore, dividilo in sotto-task da 30 minuti',
      'Imposta un timer: 25 minuti di focus, 5 di pausa (Pomodoro) per uscire dal blocco',
      'Accetta il "done is better than perfect": shipvare imperfetto batte non shipvare',
      'Trova un accountability partner: qualcuno che controlli i tuoi progressi ogni settimana',
      'Celebra le piccole vittorie: deploy, primo utente, primo feedback — ogni passo conta',
    ],
  },
};

const GUIDE_META: Record<string, { icon: React.ElementType; tag: string; color: string }> = {
  'validare-idea': { icon: Lightbulb, tag: 'Ideazione', color: 'orange' },
  'scegliere-stack': { icon: Code2, tag: 'Tecnologia', color: 'blue' },
  'pricing-gtm': { icon: DollarSign, tag: 'Business', color: 'emerald' },
  'go-to-market': { icon: TrendingUp, tag: 'Marketing', color: 'purple' },
  'ai-first-strategy': { icon: Target, tag: 'Prodotto', color: 'red' },
  'tooling-automation': { icon: Wrench, tag: 'Tooling', color: 'cyan' },
  'debugging-mentale': { icon: Brain, tag: 'Mindset', color: 'yellow' },
};

const GuideSlugPage: React.FC = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const section = SECTIONS_DATA[slug];
  const meta = GUIDE_META[slug];

  if (!section) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-black text-white mb-4">Guida non trovata</h1>
        <p className="text-zinc-400 font-medium mb-8">La guida che cerchi non esiste o &egrave; stata rimossa.</p>
        <Link
          href="/guide"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all"
        >
          Torna alle guide <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const Icon = meta?.icon || Rocket;
  const tag = meta?.tag || 'Guida';
  const color = meta?.color || 'orange';

  const benefits = [
    { icon: Clock, text: `${section.steps.length} step pratici, azione immediata` },
    { icon: CheckCircle, text: 'Strategia validata da founder reali' },
    { icon: BookOpen, text: 'Nessuna teoria astratta, solo pratica' },
    { icon: Star, text: 'Applicabile subito al tuo progetto' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-6 py-12 sm:py-16"
    >
      <Link
        href="/guide"
        className="text-sm text-zinc-500 hover:text-zinc-300 font-medium mb-6 inline-flex items-center gap-1 transition-colors"
      >
        ← Torna alle guide
      </Link>

      <section className="mb-12">
        <div className="flex items-center gap-3 mt-6 mb-4">
          <div className="w-10 h-10 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center">
            <Icon size={20} />
          </div>
          <Badge small>{tag}</Badge>
        </div>
        <h1 className="max-w-5xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-7xl mb-4">
          {section.title}
        </h1>
        <p className="text-lg text-zinc-400 font-medium leading-relaxed max-w-2xl">
          {section.desc}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-zinc-500 font-bold">
          <span className="flex items-center gap-1.5">
            <BookOpen size={16} />
            {section.steps.length} step
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={16} />
            5-10 min di lettura
          </span>
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {benefits.map((benefit, i) => {
            const BenIcon = benefit.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-4 bg-black/40 border border-zinc-800 rounded-xl">
                <div className="w-8 h-8 bg-orange-500/10 text-orange-400 rounded-lg flex items-center justify-center shrink-0">
                  <BenIcon size={16} />
                </div>
                <span className="text-sm text-zinc-300 font-medium">{benefit.text}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-black/40 border border-zinc-800 p-6 sm:p-8 rounded-2xl">
          <h2 className="text-lg font-black text-white mb-6">Passi da seguire</h2>
          <ul className="space-y-5">
            {section.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="w-7 h-7 bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 mt-0.5 rounded-lg text-sm font-black">
                  {i + 1}
                </div>
                <span className="text-sm text-zinc-300 font-medium leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-linear-to-br from-orange-500/10 to-transparent border border-orange-500/20 p-8 sm:p-10 text-center rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/8 blur-[100px] -z-10" />
        <div className="relative z-10 space-y-5">
          <div className="w-14 h-14 mx-auto bg-orange-500/15 text-orange-400 rounded-2xl flex items-center justify-center">
            <Lock size={24} />
          </div>
          <h2 className="text-xl sm:text-2xl font-jakarta font-black text-white tracking-tight">
            Questa &egrave; solo l'anteprima.
          </h2>
          <p className="text-zinc-400 font-medium text-base leading-relaxed max-w-lg mx-auto">
            Entra in StackUp Room per accedere alla guida completa con esempi, template e mentoring 1:1.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/20 inline-flex items-center gap-2 rounded-xl"
            >
              Entra in StackUp Room <ArrowRight size={16} />
            </Link>
            <Link
              href="/guide"
              className="px-8 py-3.5 bg-black border border-zinc-800 text-zinc-200 font-bold text-sm hover:border-orange-400 hover:text-orange-400 transition-all rounded-xl"
            >
              Altre guide
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default GuideSlugPage;