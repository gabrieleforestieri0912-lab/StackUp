/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Lock, CheckCircle } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { AI_SKILLS } from '@/data/aiSkillsData';

const AISkillPage: React.FC = () => {
  const skill = AI_SKILLS[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-orange-500/5 blur-[120px]" />
        </div>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/#metodo"
              className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-orange-400 transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Torna ai Playbooks
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center">
                <skill.icon size={28} />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  {skill.category}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-jakarta font-black text-white tracking-tight">
                  {skill.title}
                </h1>
              </div>
            </div>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl leading-relaxed font-medium mb-8">
              {skill.desc}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {skill.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 bg-zinc-900 text-zinc-300 text-xs font-bold rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 relative">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-[#111] border border-zinc-800 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-black text-white mb-4">
                  Cosa include questa skill
                </h2>
                <div className="space-y-3">
                  {[
                    "Prompt template pronti all'uso",
                    'Workflow automatizzato',
                    'Documentazione completa',
                    'Esempi pratici e use case',
                    'Aggiornamenti continui',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-orange-400 shrink-0 mt-0.5" />
                      <p className="text-zinc-300 font-medium">{feature}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-[#111] border border-zinc-800 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-black text-white mb-4">
                  Come funziona
                </h2>
                <p className="text-zinc-400 font-medium leading-relaxed">
                  Questa skill è progettata per essere installata e utilizzata immediatamente.
                  Segui la documentazione per configurare l'ambiente e iniziare a utilizzare
                  l'agente AI in pochi minuti.
                </p>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-[#111] border border-zinc-800 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Lock size={16} className="text-orange-400" />
                  <p className="text-sm text-zinc-400 font-medium">
                    {skill.memberNote}
                  </p>
                </div>
                <button className="w-full py-3 bg-orange-400 text-black rounded-xl font-bold text-sm hover:bg-orange-300 transition-all flex items-center justify-center gap-2">
                  <Download size={16} />
                  Scarica la Skill
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-black text-white mb-3">
                  Requisiti
                </h3>
                <ul className="space-y-2 text-sm text-zinc-400 font-medium">
                  <li>• Node.js 18+</li>
                  <li>• npm o yarn</li>
                  <li>• API key (se necessario)</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AISkillPage;