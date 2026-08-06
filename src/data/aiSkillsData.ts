import { Terminal, Search, Sparkles } from 'lucide-react'

export interface AISkill {
  id: string
  icon: React.ElementType
  category: string
  title: string
  desc: string
  tags: string[]
  href: string
  memberNote: string
}

export const AI_SKILLS: AISkill[] = [
  {
    id: 'saas-agent-interfaces',
    icon: Terminal,
    category: 'AGENT SKILL BUNDLE',
    title: 'Trasforma il tuo SaaS in Agent Interfaces',
    desc: 'Converti il tuo SaaS in una CLI, server MCP o API surface per agenti AI.',
    tags: ['CLI skill', 'MCP skill', 'API skill'],
    href: '/ai-skills/saas-agent-interfaces',
    memberNote: 'Skill installabile inclusa per i membri',
  },
  {
    id: 'reddit-research',
    icon: Search,
    category: 'CUSTOMER DISCOVERY',
    title: 'Reddit Research Skill',
    desc: 'Trova thread Reddit rilevanti e prepara bozze di risposta che i founder possono revisionare.',
    tags: ['Agent skill', 'Search workflow', 'Reply drafts'],
    href: '/ai-skills/reddit-research',
    memberNote: 'Skill installabile inclusa per i membri',
  },
  {
    id: 'ugc-generator',
    icon: Sparkles,
    category: 'CREATIVE MARKETING',
    title: 'Higgsfield UGC Generator Skill',
    desc: 'Crea bozze di prompt UGC realistici per demo, clip e annunci organici.',
    tags: ['Agent skill', 'Prompt generator', 'UGC patterns'],
    href: '/ai-skills/ugc-generator',
    memberNote: 'Skill installabile inclusa per i membri',
  },
]