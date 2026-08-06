/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Rocket, Zap, Globe, Layout, Map,
  Lock, Clock, Tag, ArrowRight,
  Terminal, Search, Sparkles, BookOpen, Star, Target, Users,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { RESOURCE_HUBS, ALL_RESOURCES } from '@/data/landingData';

const ResourcesPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 flex flex-col gap-24"
    >
      {/* Resource Hubs */}
      <section className="relative text-left">
        <div className="absolute inset-0 bg-orange-500/3 blur-3xl -z-10" />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge small>Resource Hub</Badge>
          <h1 className="max-w-5xl text-balance text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight text-white mb-6">
            Centro <span className="text-orange-400">Risorse.</span>
          </h1>
          <p className="text-lg text-zinc-400 font-medium leading-relaxed max-w-lg">
            Template, guide, checklist e strumenti organizzati per macro-argomento.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
        >
          {[
            { value: `${RESOURCE_HUBS.length}`, label: 'Hub tematici' },
            { value: `${ALL_RESOURCES.length}`, label: 'Risorse totali' },
            { value: `${ALL_RESOURCES.filter(r => r.free).length}`, label: 'Gratuite' },
            { value: '5-30', label: 'Minuti per risorsa' },
          ].map((stat, i) => (
            <div key={i} className="p-5 bg-black/40 border border-zinc-800 rounded-xl text-center">
              <div className="text-xl sm:text-2xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {RESOURCE_HUBS.map((hub, i) => {
            return (
              <motion.div
                key={hub.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
              <Link
                href="/guide"
                className="block p-6 bg-[#111] border border-zinc-800 rounded-2xl hover:border-orange-300/30 transition-all duration-500 h-full group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
              >
                <ArrowRight size={16} className="absolute top-5 right-5 text-orange-300/40 group-hover:text-orange-300 transition-colors" />
                <h3 className="text-lg font-black text-white pr-8 mb-2 group-hover:text-orange-300 transition-colors">{hub.title}</h3>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed line-clamp-3">{hub.desc}</p>
              </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* AI Skills Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <Badge small>AI Skills</Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-jakarta font-black text-white tracking-tight">
            Agent Skills <span className="text-orange-400">Installabili.</span>
          </h2>
          <p className="text-zinc-400 font-medium text-base sm:text-lg mt-4 max-w-xl mx-auto">
            Skill AI pronte all'uso per automatizzare il tuo workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto mb-20">
          {[
            {
              icon: Terminal,
              category: 'AGENT SKILL BUNDLE',
              title: 'Trasforma il tuo SaaS in Agent Interfaces',
              desc: 'Converti il tuo SaaS in una CLI, server MCP o API surface per agenti AI.',
              tags: ['CLI skill', 'MCP skill', 'API skill'],
              href: '/ai-skills/saas-agent-interfaces',
              memberNote: 'Skill installabile inclusa per i membri',
            },
            {
              icon: Search,
              category: 'CUSTOMER DISCOVERY',
              title: 'Reddit Research Skill',
              desc: 'Trova thread Reddit rilevanti e prepara bozze di risposta che i founder possono revisionare.',
              tags: ['Agent skill', 'Search workflow', 'Reply drafts'],
              href: '/ai-skills/reddit-research',
              memberNote: 'Skill installabile inclusa per i membri',
            },
            {
              icon: Sparkles,
              category: 'CREATIVE MARKETING',
              title: 'Higgsfield UGC Generator Skill',
              desc: 'Crea bozze di prompt UGC realistici per demo, clip e annunci organici.',
              tags: ['Agent skill', 'Prompt generator', 'UGC patterns'],
              href: '/ai-skills/ugc-generator',
              memberNote: 'Skill installabile inclusa per i membri',
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-[#111] border border-zinc-800 rounded-2xl hover:border-orange-300/30 transition-all duration-500 flex flex-col"
              >
                  <div className="w-12 h-12 bg-orange-500/10 text-orange-300 rounded-xl flex items-center justify-center mb-6">
                  <Icon size={22} />
                </div>
                    <span className="inline-block px-3 py-1 rounded-lg bg-orange-500/10 text-orange-300 text-[10px] font-black uppercase tracking-widest mb-4 self-start">
                  {card.category}
                </span>
                <h3 className="text-lg font-black text-white mb-3">{card.title}</h3>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed flex-1">{card.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {card.tags.map((t, j) => (
                    <span key={j} className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-900 text-zinc-400 text-[9px] font-bold uppercase tracking-wider rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 font-bold">
                    <Lock size={12} />
                    {card.memberNote}
                  </span>
                  <Link
                    href={card.href}
                    className="text-sm font-black text-white hover:text-orange-400 transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 rounded-lg"
                  >
                    Anteprima →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Griglia risorse */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <Badge small>Tutte le Risorse</Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-jakarta font-black text-white tracking-tight">
            Toolkit <span className="text-orange-400">completo.</span>
          </h2>
          <p className="text-zinc-400 font-medium text-base sm:text-lg mt-4 max-w-xl mx-auto">
            {ALL_RESOURCES.length} risorse pronte all'uso. Filtra per quello che ti serve.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {ALL_RESOURCES.map((res, i) => {
            const Icon = res.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
              >
              <Link
                href={res.href}
                className="p-5 bg-[#111] border border-zinc-800 rounded-2xl hover:border-orange-300/30 transition-all duration-500 flex flex-col group h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
              >
                  <div className="w-11 h-11 bg-orange-500/10 text-orange-300 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {res.tags.slice(0, 3).map((t, j) => (
                    <span key={j} className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-900 text-zinc-400 text-[9px] font-bold uppercase tracking-wider rounded-md">
                      <Tag size={9} />
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-base font-black text-white mb-1.5 leading-snug group-hover:text-orange-300 transition-colors">{res.title}</h3>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed flex-1">{res.desc}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 font-bold">
                    <Clock size={12} />
                    {res.minutes} min
                  </span>
                  {res.free ? (
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Gratuita</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                      <Lock size={10} />
                      Anteprima riservata
                    </span>
                  )}
                </div>
              </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
};

export default ResourcesPage;