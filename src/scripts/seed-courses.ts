import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface NewCourse {
  title: string;
  slug: string;
  description: string;
  long_description: string;
  category: string;
  level: string;
  duration: number;
  price: number;
  icon: string;
  image_url: string;
  tags: string[];
  prerequisites: string[];
  learning_objectives: string[];
  instructor_name: string;
  instructor_bio: string;
  instructor_avatar: string;
  is_published: boolean;
}

const newCourses: NewCourse[] = [
  {
    title: 'Landing Page Design',
    slug: 'landing-page-design',
    description: 'Design e sviluppo di landing page ad alta conversione con Next.js e Tailwind.',
    long_description: 'La landing page è il front-end del tuo business. Una landing page ben progettata può triplicare il tasso di conversione. In questo corso imparerai a progettare e sviluppare landing page professionali con Next.js e Tailwind CSS.',
    category: 'Frontend',
    level: 'Beginner',
    duration: 20,
    price: 49,
    icon: 'Paintbrush',
    image_url: '/corsi/landing.png',
    tags: ['design', 'landing-page', 'next.js', 'tailwind'],
    prerequisites: ['Conoscenza base di HTML e CSS'],
    learning_objectives: [
      'Progettare layout efficaci per la conversione',
      'Sviluppare landing page con Next.js e Tailwind',
      'Implementare animazioni e interazioni fluide',
      'Ottimizzare per SEO e performance',
    ],
    instructor_name: 'Gabriele Forestieri',
    instructor_bio: 'Fullstack Developer & Founder',
    instructor_avatar: '',
    is_published: true,
  },
  {
    title: 'Next.js SaaS Starter',
    slug: 'nextjs-saas',
    description: 'Costruisci una web app SaaS completa: auth, pagamenti, dashboard e deploy.',
    long_description: 'Il modello SaaS è il modo più diffuso per monetizzare applicazioni web. In questo corso costruirai una web app SaaS completa in Next.js con autenticazione, pagamenti Stripe e deploy in produzione.',
    category: 'Frontend',
    level: 'Intermedio',
    duration: 25,
    price: 99,
    icon: 'Globe',
    image_url: '/corsi/next-saas.png',
    tags: ['saas', 'next.js', 'stripe', 'fullstack'],
    prerequisites: ['Conoscenza solida di React e Next.js', 'Esperienza base con TypeScript'],
    learning_objectives: [
      'Architettare una SaaS con Next.js App Router',
      'Implementare autenticazione multi-provider',
      'Integrare pagamenti ricorrenti con Stripe',
      'Deployare in produzione con monitoring',
    ],
    instructor_name: 'Gabriele Forestieri',
    instructor_bio: 'Fullstack Developer & Founder',
    instructor_avatar: '',
    is_published: true,
  },
  {
    title: 'Go Backend',
    slug: 'go-backend',
    description: 'Backend performanti con Go: API REST, concorrenza, database e microservizi.',
    long_description: 'Go è il linguaggio scelto dalle aziende per costruire infrastrutture scalabili. Imparerai Go da zero fino a microservizi distribuiti con goroutine, channel e API REST.',
    category: 'Backend',
    level: 'Intermedio',
    duration: 30,
    price: 99,
    icon: 'Terminal',
    image_url: '/corsi/go.png',
    tags: ['go', 'backend', 'api-rest', 'microservizi'],
    prerequisites: ['Esperienza con almeno un linguaggio di programmazione'],
    learning_objectives: [
      'Padroneggiare sintassi e tipi di Go',
      'Scrivere codice concorrente con goroutine e channel',
      'Costruire API REST complete',
      'Deployare microservizi con Docker',
    ],
    instructor_name: 'Gabriele Forestieri',
    instructor_bio: 'Fullstack Developer & Founder',
    instructor_avatar: '',
    is_published: true,
  },
  {
    title: 'Docker & DevOps',
    slug: 'docker-devops',
    description: 'Containerizzazione, CI/CD e orchestrazione per ambienti di produzione moderni.',
    long_description: 'Docker ha rivoluzionato il deploy software. Imparerai a containerizzare applicazioni, automatizzare deploy con CI/CD e gestire infrastrutture moderne.',
    category: 'Backend',
    level: 'Intermedio',
    duration: 20,
    price: 79,
    icon: 'Cpu',
    image_url: '/corsi/docker.png',
    tags: ['docker', 'devops', 'ci-cd', 'kubernetes'],
    prerequisites: ['Esperienza con terminale Linux', 'Conoscenza base di un linguaggio di programmazione'],
    learning_objectives: [
      'Padroneggiare Docker: immagini, container e networking',
      'Configurare pipeline CI/CD con GitHub Actions',
      'Orchestrare container con Kubernetes',
      'Implementare monitoring e logging',
    ],
    instructor_name: 'Gabriele Forestieri',
    instructor_bio: 'Fullstack Developer & Founder',
    instructor_avatar: '',
    is_published: true,
  },
  {
    title: 'SQL & Database Design',
    slug: 'sql-database',
    description: 'Progetta database relazionali solidi: modellazione, query, indici e performance.',
    long_description: 'I database relazionali sono il cuore delle applicazioni moderne. Imparerai modellazione, SQL avanzato, ottimizzazione performance e progettazione per applicazioni reali.',
    category: 'Backend',
    level: 'Beginner',
    duration: 25,
    price: 49,
    icon: 'Database',
    image_url: '/corsi/sql.png',
    tags: ['sql', 'database', 'postgresql', 'data-modeling'],
    prerequisites: ['Nessuna esperienza con database richiesta'],
    learning_objectives: [
      'Progettare schemi di database normalizzati',
      'Scrivere query SQL complesse',
      'Ottimizzare performance con indici',
      'Gestire migrazioni e versioning',
    ],
    instructor_name: 'Gabriele Forestieri',
    instructor_bio: 'Fullstack Developer & Founder',
    instructor_avatar: '',
    is_published: true,
  },
  {
    title: 'Git & GitHub',
    slug: 'git-github',
    description: 'Controllo versione e collaborazione professionale con Git e GitHub.',
    long_description: 'Git è lo strumento più importante per la collaborazione nel software development. Corso gratuito da zero a hero: commit, branch, merge, PR, code review e GitHub Actions.',
    category: 'Fullstack',
    level: 'Beginner',
    duration: 10,
    price: 0,
    icon: 'Code2',
    image_url: '/corsi/git.png',
    tags: ['git', 'github', 'version-control', 'ci-cd'],
    prerequisites: ['Nessuna esperienza con Git richiesta'],
    learning_objectives: [
      'Padroneggiare commit, branch e merge',
      'Gestire conflitti con sicurezza',
      'Collaborare con pull request e code review',
      'Configurare GitHub Actions per CI/CD',
    ],
    instructor_name: 'Gabriele Forestieri',
    instructor_bio: 'Fullstack Developer & Founder',
    instructor_avatar: '',
    is_published: true,
  },
];

async function seed() {
  console.log('Checking existing courses...');

  const { data: existing } = await supabase
    .from('courses')
    .select('slug');

  const existingSlugs = new Set((existing || []).map((c: { slug: string }) => c.slug));
  const toInsert = newCourses.filter((c) => !existingSlugs.has(c.slug));

  if (toInsert.length === 0) {
    console.log('All courses already exist in the database.');
    return;
  }

  console.log(`Inserting ${toInsert.length} new courses...`);

  const { error } = await supabase
    .from('courses')
    .insert(toInsert);

  if (error) {
    console.error('Error inserting courses:', error);
    process.exit(1);
  }

  console.log(`✓ Successfully inserted ${toInsert.length} courses!`);
}

seed();
