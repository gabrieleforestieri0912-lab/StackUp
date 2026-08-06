import { Code2, Paintbrush, Terminal, Database, Globe, Cpu, Smartphone, Feather, FileJson, Globe2, Palette } from 'lucide-react';

interface Instructor {
  name: string;
  role: string;
  avatar: string;
}

interface Module {
  title: string;
  lessons: string[];
  duration: number;
}

interface CoursePreview {
  title: string;
  tag: string;
  level: string;
  duration: number;
  price: number;
  students: number;
  lastUpdated: string;
  imageUrl: string;
  instructor: Instructor;
  shortDesc: string;
  longDescription: string;
  objectives: string[];
  modules: Module[];
  requirements: string[];
  includes: string[];
  skills: string[];
}

const COURSES_DATA: Record<string, CoursePreview> = {
  'python-mastery': {
    title: 'Python Mastery',
    tag: 'Backend',
    level: 'Beginner',
    duration: 40,
    price: 0,
    students: 12450,
    lastUpdated: 'Marzo 2026',
    imageUrl: '/corsi/python.png',
    instructor: { name: 'Alice Moretti', role: 'Backend Developer Senior', avatar: '' },
    shortDesc: 'Impara Python per il web: API, database, Django e deployment.',
    longDescription: `Python è oggi il linguaggio più versatile e richiesto per lo sviluppo web. Dai backend di startup innovative alle architetture enterprise, Python alimenta alcune delle piattaforme più grandi del mondo. Questo corso parte dalle basi e ti porta fino a costruire applicazioni web complete e deployate in produzione.

Inizieremo con i fondamenti del linguaggio: sintassi, strutture dati, OOP e best practice. Subito dopo entreremo nel vivo dello sviluppo web: HTTP, API REST, database e autenticazione.

Nella seconda parte del corso esploreremo i framework più utilizzati: Flask per progetti leggeri, Django per applicazioni full-stack complesse, e FastAPI per API moderne e performanti. Ogni modulo si conclude con un progetto guidato che andrà ad arricchire il tuo portfolio.`,
    objectives: [
      'Scrivere codice Python pulito e professionale',
      'Creare API REST con FastAPI e Django REST Framework',
      'Gestire database con Django ORM e SQLAlchemy',
      'Implementare autenticazione e autorizzazione',
      'Deployare applicazioni web in produzione',
      'Testare API con pytest e strumenti dedicati'
    ],
    modules: [
      {
        title: 'Fondamenti Python per il Web',
        lessons: ['Setup ambiente di sviluppo Python', 'Sintassi, tipi e strutture dati', 'Funzioni, moduli e pacchetti', 'OOP in Python: classi ed ereditarietà', 'Gestione errori e debug'],
        duration: 480
      },
      {
        title: 'Web Foundation: HTTP e API',
        lessons: ['Protocollo HTTP e REST API', 'Richiedere dati con requests', 'JSON e formati di scambio', 'API design: risorse, metodi, stati', 'Documentazione con Postman'],
        duration: 360
      },
      {
        title: 'Flask: Web Framework Leggero',
        lessons: ['Routing e template con Jinja2', 'Form e validazione', 'Database con SQLAlchemy', 'Autenticazione con Flask-Login', 'Costruire una REST API con Flask'],
        duration: 420
      },
      {
        title: 'Django: Full-Stack Framework',
        lessons: ['Modelli MTV e Django ORM', 'Admin panel e migrations', 'View, template e URL routing', 'Django REST Framework', 'Autenticazione e permessi'],
        duration: 480
      },
      {
        title: 'FastAPI: API Moderne',
        lessons: ['Pydantic models e validazione', 'Routing avanzato e dependency injection', 'Async endpoints e WebSocket', 'Documentazione automatica OpenAPI', 'Test con TestClient'],
        duration: 360
      },
      {
        title: 'Database, Deploy e DevOps',
        lessons: ['PostgreSQL e Docker setup', 'Migration e seed data', 'CI/CD con GitHub Actions', 'Deploy su Railway e Fly.io', 'Monitoring e logging'],
        duration: 300
      }
    ],
    requirements: [
      'Nessuna esperienza di programmazione richiesta',
      'Conoscenze base di HTML',
      'Computer con qualsiasi sistema operativo',
      'Connessione internet stabile'
    ],
    includes: [
      '40 ore di video lezioni in 4K',
      '60+ esercizi pratici con correzione automatica',
      '5 progetti web guidati completi',
      'Accesso a vita e aggiornamenti futuri',
      'Certificato di completamento',
      'Supporto 1:1 via chat con il mentor',
      'Community privata studenti',
      'Codice sorgente di tutti i progetti'
    ],
    skills: ['Python 3', 'Django', 'FastAPI', 'Flask', 'API REST', 'PostgreSQL', 'Docker']
  },

  'node-express-api': {
    title: 'Node.js & Express API',
    tag: 'Backend',
    level: 'Intermedio',
    duration: 35,
    price: 0,
    students: 14900,
    lastUpdated: 'Giugno 2026',
    imageUrl: '/corsi/node.png',
    instructor: { name: 'Gabriele Forestieri', role: 'Fullstack Developer & Founder', avatar: '' },
    shortDesc: 'Backend scalabile con Node.js, Express, database e API RESTful.',
    longDescription: `Node.js ha rivoluzionato lo sviluppo backend permettendo a milioni di sviluppatori di usare JavaScript anche lato server. In questo corso costruirai API robuste e scalabili usando Express, il framework più popolare dell'ecosistema Node.js.

Partiremo dalla configurazione del progetto e arriveremo fino al deploy in produzione, passando per autenticazione, database, WebSocket, testing e containerizzazione. Ogni modulo si conclude con un progetto pratico.

Il corso copre anche argomenti avanzati come upload di file, rate limiting, caching, e pattern di sicurezza. Lavorerai su progetti reali che simulano scenari di backend production-grade.`,
    objectives: [
      'Costruire API REST con Express.js',
      'Gestire autenticazione con JWT e OAuth',
      'Lavorare con database SQL e NoSQL',
      'Implementare WebSocket in tempo reale',
      'Scrivere test di integrazione',
      'Deployare backend su Railway e Fly.io',
    ],
    modules: [
      {
        title: 'Fondamenti Node.js',
        lessons: ['Node.js runtime e npm', 'Moduli CommonJS vs ES modules', 'File system e stream', 'Event emitter e buffer', 'Debugging e profiling'],
        duration: 300,
      },
      {
        title: 'Express: API REST',
        lessons: ['Routing e middleware', 'Request/response handling', 'Error handling pattern', 'Validazione con express-validator', 'CORS e headers'],
        duration: 360,
      },
      {
        title: 'Database & ORM',
        lessons: ['PostgreSQL con node-postgres', 'MongoDB con Mongoose', 'Prisma ORM moderno', 'Migration e seed', 'Query optimization'],
        duration: 360,
      },
      {
        title: 'Autenticazione & Sicurezza',
        lessons: ['JWT: access e refresh token', 'OAuth 2.0 con Passport.js', 'Bcrypt e hashing password', 'Rate limiting e helmet', 'Input sanitization'],
        duration: 300,
      },
      {
        title: 'Real-time & WebSocket',
        lessons: ['WebSocket con Socket.io', 'Room e namespace', 'Event-driven communication', 'Presence e typing indicator', 'Broadcasting pattern'],
        duration: 240,
      },
      {
        title: 'Testing & Deploy',
        lessons: ['Test unitari con Jest', 'Supertest per integration test', 'CI/CD con GitHub Actions', 'Docker e docker-compose', 'Deploy su Railway/Fly.io'],
        duration: 300,
      },
    ],
    requirements: [
      'Conoscenze base di JavaScript',
      'Familiarità con database SQL',
      'Node.js installato',
    ],
    includes: [
      '35 ore di video lezioni in 4K',
      '50+ esercizi pratici con soluzioni',
      '4 progetti backend completi',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat con il mentor',
      'Template Express + Prisma',
      'Codice sorgente su GitHub',
    ],
    skills: ['Node.js', 'Express', 'MongoDB', 'JWT', 'API REST', 'WebSocket', 'Docker'],
  },

  'java-enterprise': {
    title: 'Java Enterprise',
    tag: 'Backend',
    level: 'Intermedio',
    duration: 60,
    price: 0,
    students: 8900,
    lastUpdated: 'Febbraio 2026',
    imageUrl: '/corsi/java.png',
    instructor: { name: 'Luca Ferrari', role: 'Enterprise Architect', avatar: '' },
    shortDesc: 'Programmazione Object-Oriented solida e architetture enterprise moderne.',
    longDescription: `Java rimane il pilastro dello sviluppo enterprise globale. Questo corso è progettato per trasformarti da sviluppatore con basi di OOP in un professionista pronto ad affrontare architetture complesse e sistemi ad alto carico.

Partiremo dal consolidamento dei fondamenti OOP e delle best practice di progettazione, per poi immergerci nel mondo delle applicazioni enterprise con Spring Boot. Imparerai a costruire API REST robuste, gestire la persistenza con JPA/Hibernate e implementare pattern architetturali come MVC, Dependency Injection e Service Layer.

La parte avanzata del corso copre microservizi, containerizzazione con Docker, message queuing e deploy su cloud. Ogni concetto è accompagnato da esercitazioni pratiche e un progetto finale che simula un'architettura enterprise reale.`,
    objectives: [
      'Padroneggiare Java 17+ e le sue feature moderne',
      'Progettare API REST con Spring Boot',
      'Gestire database relazionali con JPA/Hibernate',
      'Implementare microservizi e comunicazione asincrona',
      'Scrivere test unitari e di integrazione',
      'Deployare applicazioni su cloud'
    ],
    modules: [
      {
        title: 'Java Moderno e Best Practice',
        lessons: ['Setup ambiente di sviluppo', 'Record, pattern matching e sealed class', 'Stream API e lambda avanzate', 'Optional e gestione errori moderna', 'Concorrenza con thread e ExecutorService'],
        duration: 540
      },
      {
        title: 'Spring Boot Fondamenti',
        lessons: ['Introduzione a Spring Boot', 'Dependency Injection e IoC', 'Spring MVC e REST Controller', 'Gestione richieste e risposte', 'Validazione e error handling'],
        duration: 600
      },
      {
        title: 'Persistenza con JPA/Hibernate',
        lessons: ['Entity mapping e relazioni', 'JPQL e Criteria API', 'Spring Data JPA Repositories', 'Transazioni e isolamento', 'Migration con Flyway'],
        duration: 540
      },
      {
        title: 'Sicurezza e Autenticazione',
        lessons: ['Spring Security base', 'JWT e OAuth 2.0', 'Ruoli e permessi', 'Protezione endpoint API', 'CORS e CSRF'],
        duration: 360
      },
      {
        title: 'Microservizi e Architetture',
        lessons: ['Architettura a microservizi', 'Comunicazione con RabbitMQ', 'API Gateway e Service Discovery', 'Config centralizzata con Spring Cloud', 'Monitoring e logging'],
        duration: 600
      },
      {
        title: 'Testing e Deploy',
        lessons: ['Test unitari con JUnit 5', 'Test di integrazione con Testcontainers', 'Docker e docker-compose', 'CI/CD con GitHub Actions', 'Deploy su Railway/Heroku'],
        duration: 360
      }
    ],
    requirements: [
      'Conoscenze base di programmazione OOP',
      'Familiarità con database SQL',
      'Computer con 8GB+ di RAM',
      'JDK 17+ installato'
    ],
    includes: [
      '60 ore di video lezioni in 4K',
      '80+ esercizi e sfide di codice',
      '5 moduli di progetto completi',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat',
      'Codice sorgente enterprise-grade',
      'Template di architettura pronti'
    ],
    skills: ['Java 17+', 'Spring Boot', 'JPA/Hibernate', 'Docker', 'Microservizi', 'JUnit', 'Git']
  },

  'javascript-pro': {
    title: 'JavaScript Pro',
    tag: 'Fullstack',
    level: 'Beginner',
    duration: 45,
    price: 0,
    students: 18900,
    lastUpdated: 'Marzo 2026',
    imageUrl: '/corsi/javascript.png',
    instructor: { name: 'Sofia Romano', role: 'Fullstack Developer Senior', avatar: '' },
    shortDesc: 'Domina l\'ecosistema JS per costruire logica frontend e backend robusta.',
    longDescription: `JavaScript è il linguaggio che alimenta il web moderno. Che tu voglia costruire interfacce utente interattive, backend performanti o app mobile, JavaScript è la competenza fondamentale che apre ogni porta.

Questo corso non si limita alla sintassi: ti porterà a pensare come uno sviluppatore JavaScript professionista. Inizieremo dai fondamenti moderni (ES6+) e saliremo gradualmente fino a concetti avanzati come chiusure, prototipi, programmazione asincrona e pattern di progettazione.

Ogni argomento è accompagnato da esercizi pratici e sfide di codice. Lavorerai su progetti reali che simulano scenari di sviluppo concreti: dalla manipolazione del DOM alla gestione dello stato, dalle API calls fino all'ottimizzazione delle performance.`,
    objectives: [
      'Padroneggiare ES6+ e le feature moderne',
      'Comprendere asincronia, promise e async/await',
      'Manipolare il DOM e gestire eventi',
      'Lavorare con API REST e dati JSON',
      'Utilizzare moduli e bundler moderni',
      'Scrivere codice testabile e manutenibile'
    ],
    modules: [
      {
        title: 'JavaScript Moderno: Basi',
        lessons: ['Variabili: let, const e scope', 'Arrow function e template literal', 'Array methods: map, filter, reduce', 'Destructuring e spread operator', 'Moduli ES6: import/export'],
        duration: 420
      },
      {
        title: 'Funzioni e Closure',
        lessons: ['First-class functions', 'Closures: come e quando usarle', 'IIFE e module pattern', 'Currying e partial application', 'Callback e higher-order functions'],
        duration: 360
      },
      {
        title: 'Asincronia Professionale',
        lessons: ['Event loop e call stack', 'Promise: dall\'inizio alla fine', 'Async/await: best practice', 'API Fetch e gestione errori', 'AbortController e race conditions'],
        duration: 420
      },
      {
        title: 'DOM e Browser API',
        lessons: ['Selezione e manipolazione DOM', 'Event delegation e bubbling', 'IntersectionObserver e ResizeObserver', 'Web Storage e IndexedDB', 'Web Worker e performance'],
        duration: 360
      },
      {
        title: 'Pattern e Architettura',
        lessons: ['Module pattern e namespace', 'Observer e Pub/Sub pattern', 'Singleton e Factory pattern', 'Proxy e Reflect API', 'Clean code e refactoring'],
        duration: 360
      },
      {
        title: 'Progetti Finali',
        lessons: ['Todo App con persistenza', 'Dashboard interattiva con dati reali', 'Editor di codice in-browser', 'App meteo con API esterna', 'Git e deploy su Vercel'],
        duration: 540
      }
    ],
    requirements: [
      'Nessuna esperienza di programmazione richiesta',
      'Conoscenze base di HTML e CSS',
      'Browser moderno (Chrome, Firefox, Edge)',
      'Editor di codice (VS Code consigliato)'
    ],
    includes: [
      '45 ore di video lezioni in 4K',
      '70+ esercizi interattivi',
      '5 progetti reali da portfolio',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat',
      'Slides e cheat sheet scaricabili',
      'Community Discord privata'
    ],
    skills: ['ES6+', 'DOM API', 'Async/Await', 'Fetch API', 'Module System', 'Git', 'Vercel']
  },

  'html-strutturale': {
    title: 'HTML Strutturale',
    tag: 'Frontend',
    level: 'Beginner',
    duration: 15,
    price: 0,
    students: 22100,
    lastUpdated: 'Gennaio 2026',
    imageUrl: '/corsi/html.png',
    instructor: { name: 'Chiara Neri', role: 'Frontend Developer', avatar: '' },
    shortDesc: 'Padroneggia la semantica del web per creare interfacce accessibili e solide.',
    longDescription: `L'HTML è molto più che un semplice insieme di tag. È il fondamento del web semantico, l'impalcatura su cui si costruisce ogni esperienza digitale. Un HTML ben scritto significa migliori performance, maggiore accessibilità e SEO ottimizzata.

In questo corso apprenderai l'HTML non come una lista di elementi da memorizzare, ma come un linguaggio di strutturazione dei contenuti con regole precise e best practice consolidate. Imparerai a distinguere gli elementi semantici, a strutturare documenti complessi e a creare pagine accessibili a tutti.

Il corso copre anche le tecnologie colpite: SVG per la grafica vettoriale nel web, microformati per i dati strutturati, e le basi di come HTML si integra con CSS e JavaScript in un flusso di lavoro professionale.`,
    objectives: [
      'Scrivere HTML semantico e valido',
      'Strutturare documenti complessi',
      'Creare pagine accessibili (WCAG)',
      'Ottimizzare per SEO on-page',
      'Integrare SVG e multimedia',
      'Usare DevTools per debugging'
    ],
    modules: [
      {
        title: 'Fondamenti di HTML',
        lessons: ['Cos\'è l\'HTML e come funziona il web', 'Struttura base di un documento', 'Tag, attributi e annidamento', 'Elementi inline vs block', 'DOCTYPE e meta tag'],
        duration: 150
      },
      {
        title: 'HTML Semantico',
        lessons: ['Header, nav, main, section, article', 'Aside, footer e figure', 'Heading hierarchy e best practice', 'Liste ordinate e non ordinate', 'Table: dati tabellari'],
        duration: 180
      },
      {
        title: 'Form e Interazione',
        lessons: ['Elementi di form: input, textarea, select', 'Tipi di input HTML5', 'Validazione lato client', 'Label, fieldset e leggenda', 'Enctype e invio dati'],
        duration: 180
      },
      {
        title: 'Multimedia e Integrazione',
        lessons: ['Immagini: srcset e picture', 'Video e audio HTML5', 'SVG inline e grafica vettoriale', 'Iframe e embed', 'Microdati e schema.org'],
        duration: 150
      },
      {
        title: 'Accessibilità e SEO',
        lessons: ['ARIA: ruoli e attributi', 'Focus management e tabindex', 'Screen reader e test', 'Meta tag SEO', 'Open Graph e Twitter Cards'],
        duration: 150
      },
      {
        title: 'Progetto Finale',
        lessons: ['Pianificazione struttura contenuti', 'Creazione pagina portfolio', 'Blog post con semantica avanzata', 'Validazione e testing', 'Deploy con GitHub Pages'],
        duration: 180
      }
    ],
    requirements: [
      'Nessuna esperienza di programmazione richiesta',
      'Browser moderno e editor di testo',
      'Voglia di imparare le basi del web'
    ],
    includes: [
      '15 ore di video lezioni in 4K',
      '30+ esercizi pratici',
      '2 progetti completi',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Assistenza via chat',
      'Materiale didattico PDF',
      'Validatore HTML integrato'
    ],
    skills: ['HTML5', 'Semantic HTML', 'Accessibilità', 'SEO', 'SVG', 'Microdata', 'GitHub Pages']
  },

  'css-moderno': {
    title: 'CSS Moderno',
    tag: 'Frontend',
    level: 'Intermedio',
    duration: 25,
    price: 0,
    students: 15400,
    lastUpdated: 'Febbraio 2026',
    imageUrl: '/corsi/css.png',
    instructor: { name: 'Elena Bianchi', role: 'UI Developer Senior', avatar: '' },
    shortDesc: 'Dimentica Bootstrap: crea layout avanzati con Flexbox, Grid e animazioni.',
    longDescription: `Il CSS moderno ha fatto passi da gigante. Oggi possiamo creare layout complessi, animazioni fluide e design responsive senza framework esterni. Questo corso ti insegna a padroneggiare il CSS come un vero artigiano del frontend.

Partiremo dai fondamenti del box model e della cascata per arrivare rapidamente a concetti avanzati: Grid, Flexbox, Custom Properties, Container Queries e animazioni performanti. Ogni modulo alterna teoria ed esercizi pratici per consolidare immediatamente quanto appreso.

La parte finale del corso è dedicata ai progetti reali: ricreeremo interfacce moderne, implementeremo temi dinamici con variabili CSS, ottimizzeremo le performance di rendering e costruiremo un design system da zero utilizzando solo CSS puro.`,
    objectives: [
      'Padroneggiare Flexbox e CSS Grid',
      'Creare layout responsive senza framework',
      'Animare elementi con CSS performante',
      'Usare Custom Properties e funzioni CSS',
      'Implementare design system modulari',
      'Ottimizzare performance di rendering'
    ],
    modules: [
      {
        title: 'Fondamenti e Box Model',
        lessons: ['Cascata, specificità e ereditarietà', 'Box model: margin, padding, border', 'Display: block, inline, inline-block', 'Position: relative, absolute, fixed, sticky', 'Unità: px, rem, em, vw, vh, %'],
        duration: 210
      },
      {
        title: 'Flexbox: Layout Flessibili',
        lessons: ['Container e item properties', 'Main axis e cross axis', 'Flex grow, shrink e basis', 'Allineamento e distribuzione', 'Flexbox patterns comuni'],
        duration: 240
      },
      {
        title: 'CSS Grid: Layout 2D',
        lessons: ['Grid container e template', 'Grid lines e aree nominate', 'Auto-fit, auto-fill e minmax', 'Grid responsive senza media query', 'Flexbox vs Grid: quando usare cosa'],
        duration: 240
      },
      {
        title: 'Animazioni e Transizioni',
        lessons: ['Transition: timing e easing', 'Keyframes animation avanzate', 'Transform: scale, rotate, translate', 'Performance: transform e opacity', 'Scroll-driven animations'],
        duration: 210
      },
      {
        title: 'CSS Moderno: Custom Properties',
        lessons: ['Variabili CSS: dichiarazione e utilizzo', 'Temi dinamici con custom properties', 'Funzioni: calc, min, max, clamp', 'Container queries: responsive modulare', 'Layer @layer e import'],
        duration: 210
      },
      {
        title: 'Progetti: Design System',
        lessons: ['Sistema di spacing e tipografia', 'Componenti: button, card, input', 'Layout: header, sidebar, grid', 'Tema chiaro/scuro completo', 'Documentazione e esportazione'],
        duration: 300
      }
    ],
    requirements: [
      'Conoscenze base di HTML',
      'Browser moderno per testing',
      'Editor di codice (VS Code)'
    ],
    includes: [
      '25 ore di video lezioni in 4K',
      '50+ esercizi di layout',
      '4 progetti di interfacce reali',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat',
      'Figma design files inclusi',
      'Design system starter kit'
    ],
    skills: ['Flexbox', 'CSS Grid', 'CSS Animations', 'Custom Properties', 'Responsive Design', 'Container Queries', 'Figma']
  },

  'typescript-mastery': {
    title: 'TypeScript Mastery',
    tag: 'Fullstack',
    level: 'Intermedio',
    duration: 35,
    price: 0,
    students: 11200,
    lastUpdated: 'Marzo 2026',
    imageUrl: '/corsi/typescript.png',
    instructor: { name: 'Davide Conti', role: 'Fullstack Architect', avatar: '' },
    shortDesc: 'Tipizzazione avanzata, generics e pattern moderni per codice JS robusto.',
    longDescription: `TypeScript è diventato lo standard de facto per lo sviluppo JavaScript professionale. Aggiunge al linguaggio un sistema di tipi potente che previene errori, migliora la documentazione e rende il codice più manutenibile su larga scala.

In questo corso non ti limiterai a imparare la sintassi di base. Esploreremo la tipizzazione avanzata, i generics, i mapped types, le conditional types e i pattern che usano i team di aziende come Microsoft, Google e Airbnb per gestire codebase complesse.

Il corso include esercizi progressivi, refactoring di codice JavaScript reale in TypeScript, e progetti completi che spaziano da un'API backend a un'applicazione frontend complessa, mostrandoti come TypeScript migliora ogni aspetto dello sviluppo.`,
    objectives: [
      'Configurare progetti TypeScript da zero',
      'Tipizzare funzioni, oggetti e classi',
      'Padroneggiare generics e utility types',
      'Usare advanced types: conditional, mapped, template literal',
      'Integrare TypeScript con React e Node.js',
      'Scrivere librerie tipo-sicure'
    ],
    modules: [
      {
        title: 'TypeScript: Le Basi',
        lessons: ['Setup e tsconfig.json', 'Tipi primitivi e union', 'Interface e type alias', 'Optional e readonly', 'Type assertion e narrowing'],
        duration: 300
      },
      {
        title: 'Generics e Tipi Avanzati',
        lessons: ['Generic functions e constraints', 'Generic interfaces e classi', 'Utility types: Partial, Pick, Omit', 'Mapped types e indexed access', 'Conditional types e infer'],
        duration: 360
      },
      {
        title: 'TypeScript con React',
        lessons: ['Typing props e state', 'Event handler e refs typizzati', 'Generic components', 'Custom hooks tipizzati', 'Pattern: compound components'],
        duration: 360
      },
      {
        title: 'TypeScript con Node.js',
        lessons: ['Express request/response typing', 'Middleware e error handler', 'Database model typing', 'API response types', 'Environment variable typing'],
        duration: 300
      },
      {
        title: 'Pattern e Best Practice',
        lessons: ['Discriminated union pattern', 'Branded types e nominal typing', 'Builder pattern tipo-sicuro', 'Type-safe event emitter', 'Testing con TypeScript'],
        duration: 300
      },
      {
        title: 'Progetto: App Completa',
        lessons: ['Setup monorepo', 'Tipizzazione API e database', 'Frontend tipizzato', 'Type-safe state management', 'CI type-checking'],
        duration: 360
      }
    ],
    requirements: [
      'Buona conoscenza di JavaScript',
      'Esperienza base con React o Node.js',
      'Node.js 18+ installato'
    ],
    includes: [
      '35 ore di video lezioni in 4K',
      '50+ esercizi di tipizzazione',
      '3 progetti completi',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat',
      'Configurazioni tsconfig pronte',
      'ESLint e Prettier config inclusi'
    ],
    skills: ['TypeScript', 'Generics', 'React + TS', 'Node.js + TS', 'Utility Types', 'Pattern', 'Monorepo']
  },

  'react-modern-frontend': {
    title: 'React & Modern Frontend',
    tag: 'Frontend',
    level: 'Intermedio',
    duration: 40,
    price: 0,
    students: 19800,
    lastUpdated: 'Aprile 2026',
    imageUrl: '/corsi/react.png',
    instructor: { name: 'Alessandro Guerra', role: 'React Core Contributor', avatar: '' },
    shortDesc: 'Componenti, hooks, state management e pattern avanzati per UI moderne.',
    longDescription: `React è la libreria UI più amata e utilizzata nel mondo dello sviluppo web. Questo corso è pensato per portarti da sviluppatore con basi di React a un professionista in grado di progettare e costruire applicazioni complesse con pattern moderni e best practice consolidate.

Inizieremo con le fondamenta solide: componenti, props, hooks e contesto. Poi esploreremo gli argomenti che fanno la differenza tra uno sviluppatore junior e un senior: ottimizzazione delle performance (memo, useMemo, useCallback), gestione dello stato complessa, Server Components, SSR e pattern architetturali come Atomic Design e Component Composition.

Il corso dedica ampio spazio ai progetti pratici: costruiremo un dashboard completa, un e-commerce con carrello e checkout, e un'applicazione real-time con WebSocket. Ogni progetto è pensato per simulare scenari di lavoro reali e arricchire il tuo portfolio.`,
    objectives: [
      'Progettare componenti riutilizzabili e scalabili',
      'Padroneggiare hooks e custom hooks avanzati',
      'Gestire stato complesso con Context e reducer',
      'Ottimizzare performance e rendering',
      'Implementare Server Components e SSR',
      'Costruire applicazioni production-ready'
    ],
    modules: [
      {
        title: 'React Fondamenti Avanzati',
        lessons: ['Component composition e children', 'Fragment, Portal e Ref', 'useEffect: ciclo di vita e cleanup', 'useReducer e stati complessi', 'Custom hooks: creazione e pattern'],
        duration: 420
      },
      {
        title: 'Performance Optimization',
        lessons: ['React.memo e PureComponent', 'useMemo e useCallback', 'Code splitting e lazy loading', 'Virtualizzazione con react-window', 'React DevTools Profiler'],
        duration: 360
      },
      {
        title: 'State Management',
        lessons: ['Context API: quando e come', 'useReducer + Context pattern', 'State machine con XState', 'Zustand: alternative moderna', 'Server state con React Query'],
        duration: 420
      },
      {
        title: 'Next.js e Fullstack React',
        lessons: ['Server Components e Client Components', 'Data fetching: SSR, SSG, ISR', 'API routes e middleware', 'Autenticazione con NextAuth', 'Deploy su Vercel'],
        duration: 480
      },
      {
        title: 'Pattern Architetturali',
        lessons: ['Atomic Design methodology', 'Compound component pattern', 'Render props e slot pattern', 'Higher-order components', 'Error boundary e fallback UI'],
        duration: 300
      },
      {
        title: 'Progetto: E-commerce Dashboard',
        lessons: ['Setup progetto e routing', 'Catalogo prodotti e filtri', 'Carrello e checkout', 'Admin dashboard', 'Deploy e monitoring'],
        duration: 540
      }
    ],
    requirements: [
      'Conoscenza solida di JavaScript/ES6+',
      'Esperienza base con React (componenti, useState)',
      'Node.js 18+ installato',
      'Familiarità con terminale e Git'
    ],
    includes: [
      '40 ore di video lezioni in 4K',
      '60+ esercizi e component challenge',
      '4 progetti reali completi',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat',
      'Figma design system incluso',
      'Template Next.js pronto'
    ],
    skills: ['React 19', 'Next.js', 'TypeScript', 'Zustand', 'React Query', 'Tailwind CSS', 'Vercel']
  },



  'nextjs-fullstack-pro': {
    title: 'Next.js Fullstack Pro',
    tag: 'Frontend',
    level: 'Intermedio',
    duration: 30,
    price: 0,
    students: 4200,
    lastUpdated: 'Giugno 2026',
    imageUrl: '/corsi/next.png',
    instructor: { name: 'Davide Conti', role: 'Fullstack Architect', avatar: '' },
    shortDesc: 'Server Components, SSR, streaming e pattern avanzati per applicazioni React full-stack.',
    longDescription: `Next.js è il framework React più completo per applicazioni full-stack. Combina il meglio del rendering lato server con l'interattività lato client, offrendo un'esperienza di sviluppo senza pari.

Questo corso parte dal setup di un progetto Next.js 15 con App Router e ti guida attraverso tutti i concetti fondamentali: Server e Client Components, data fetching strategies (SSR, SSG, ISR), routing avanzato con gruppi e intercettazioni, middleware e autenticazione.

La seconda parte è dedicata alla produzione: ottimizzazione delle performance, streaming e Suspense, caching avanzato, API routes e Server Actions, deploy su Vercel con analisi e monitoring. Il progetto finale è una applicazione SaaS completa con database, autenticazione e pagamenti.`,
    objectives: [
      'Padroneggiare App Router e file-based routing',
      'Implementare SSR, SSG, ISR e streaming',
      'Costruire API e Server Actions',
      'Gestire autenticazione e autorizzazione',
      'Ottimizzare performance e Core Web Vitals',
      'Deployare e monitorare in produzione'
    ],
    modules: [
      {
        title: 'App Router & Routing',
        lessons: ['Setup Next.js 15', 'File-based routing e layout', 'Route groups e parallel routes', 'Intercepting routes e modali', 'Loading, error e not-found'],
        duration: 240
      },
      {
        title: 'Server & Client Components',
        lessons: ['Server Components: vantaggi e limiti', 'Client Components e interattività', 'Composition pattern', 'Data fetching in Server Components', 'Streaming e Suspense'],
        duration: 300
      },
      {
        title: 'Data Fetching & Caching',
        lessons: ['SSR, SSG e ISR', ' fetch e caching automatico', 'Revalidation: time-based e on-demand', 'Database queries e ORM', 'Server Actions per form'],
        duration: 300
      },
      {
        title: 'Autenticazione & API',
        lessons: ['NextAuth v5 setup', 'Middleware e route protection', 'API routes vs Server Actions', 'Rate limiting e validazione', 'Webhook e integrazioni'],
        duration: 240
      },
      {
        title: 'Produzione & Deploy',
        lessons: ['Ottimizzazione immagini e font', 'Core Web Vitals e Lighthouse', 'Static export e ISR ibrido', 'Deploy su Vercel', 'Analytics e monitoring'],
        duration: 240
      },
      {
        title: 'Progetto: SaaS Dashboard',
        lessons: ['Setup SaaS con autenticazione', 'Dashboard con dati in tempo reale', 'Piano tariffario e checkout', 'Admin panel multi-utente', 'Deploy con CI/CD'],
        duration: 360
      }
    ],
    requirements: [
      'Conoscenza solida di React e JavaScript',
      'Esperienza con TypeScript',
      'Node.js 18+ installato',
      'Familiarità con Git e terminale'
    ],
    includes: [
      '30 ore di video lezioni in 4K',
      '40+ esercizi pratici',
      'Progetto SaaS completo',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto tecnico 1:1',
      'Template Next.js pronto',
      'Deploy su Vercel incluso'
    ],
    skills: ['Next.js 15', 'React 19', 'App Router', 'Server Components', 'TypeScript', 'NextAuth', 'Vercel']
  },

  'angular-enterprise': {
    title: 'Angular Enterprise',
    tag: 'Frontend',
    level: 'Intermedio',
    duration: 35,
    price: 0,
    students: 6800,
    lastUpdated: 'Maggio 2026',
    imageUrl: '/corsi/angular.png',
    instructor: { name: 'Luca Ferrari', role: 'Enterprise Architect', avatar: '' },
    shortDesc: 'Applicazioni enterprise scalabili con Angular 18, TypeScript e RxJS.',
    longDescription: `Angular è il framework enterprise per eccellenza nello sviluppo frontend. Utilizzato da aziende di ogni dimensione per costruire applicazioni robuste, testabili e manutenibili, Angular offre un ecosistema completo e opinionato.

Questo corso parte dalle basi di Angular 18: componenti, template, direttive e dependency injection. Imparerai a strutturare un'applicazione modulare, gestire la navigazione con Angular Router, e creare form reattivi con validazione avanzata.

La parte avanzata copre RxJS e programmazione reattiva, NgRx per la gestione dello stato, testing con Jasmine e Cypress, e pattern di performance come ChangeDetection onPush e lazy loading. Il progetto finale è un'applicazione gestionale enterprise completa.`,
    objectives: [
      'Padroneggiare componenti, direttive e pipe',
      'Gestire routing e lazy loading',
      'Creare form reattivi e template-driven',
      'Usare RxJS e programmazione reattiva',
      'Gestire stato globale con NgRx',
      'Scrivere test unitari e e2e'
    ],
    modules: [
      {
        title: 'Fondamenti Angular 18',
        lessons: ['Componenti e template', 'Directive: structural e attribute', 'Pipe pure e impure', 'Dependency Injection', 'Lifecycle hooks'],
        duration: 300
      },
      {
        title: 'Routing & Navigation',
        lessons: ['Angular Router setup', 'Route parameters e query params', 'Child routes e nested layout', 'Lazy loading moduli', 'Route guards e resolvers'],
        duration: 240
      },
      {
        title: 'Form e Validazione',
        lessons: ['Template-driven forms', 'Reactive forms e FormBuilder', 'Validazione custom e cross-field', 'Dynamic forms', 'Form array e nested form'],
        duration: 240
      },
      {
        title: 'RxJS & State Management',
        lessons: ['Observable e Subject', 'Operators: map, filter, switchMap', 'BehaviorSubject e ReplaySubject', 'NgRx: Store, Actions, Reducers', 'Effects e selectors'],
        duration: 360
      },
      {
        title: 'Testing & Performance',
        lessons: ['Test unitari con Jasmine', 'Component testing con TestBed', 'E2E con Cypress', 'ChangeDetection onPush', 'Lazy loading e precarica'],
        duration: 240
      },
      {
        title: 'Progetto: Gestionale Enterprise',
        lessons: ['Setup progetto modulare', 'CRUD con Angular Material', 'Dashboard e grafici', 'Autenticazione e profili', 'Deploy e CI/CD'],
        duration: 360
      }
    ],
    requirements: [
      'Conoscenza di TypeScript',
      'Esperienza base con programmazione OOP',
      'Node.js 18+ installato',
      'Familiarità con terminale'
    ],
    includes: [
      '35 ore di video lezioni in 4K',
      '50+ esercizi e challenge',
      'Progetto gestionale completo',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto tecnico 1:1',
      'Angular Material incluso',
      'Template Figma'
    ],
    skills: ['Angular 18', 'TypeScript', 'RxJS', 'NgRx', 'Angular Material', 'Jasmine', 'Cypress']
  },




  'tailwind-css': {
    title: 'Tailwind CSS',
    tag: 'Frontend',
    level: 'Beginner',
    duration: 15,
    price: 0,
    students: 4300,
    lastUpdated: 'Giugno 2026',
    imageUrl: '/corsi/tailwind.png',
    instructor: { name: 'Elena Bianchi', role: 'UI Developer Senior', avatar: '' },
    shortDesc: 'Design system utility-first per costruire interfacce moderne e responsive rapidamente.',
    longDescription: `Tailwind CSS ha rivoluzionato il modo di scrivere CSS, introducendo un approccio utility-first che accelera lo sviluppo e mantiene il codice pulito e consistente. Questo corso ti insegna a padroneggiare Tailwind dalla configurazione ai pattern avanzati.

Inizieremo con l'installazione e la configurazione di Tailwind CSS v4 in vari progetti (HTML statico, Next.js, React). Imparerai il sistema di utility class, il responsive design, le varianti e il Dark Mode.

La parte avanzata copre componenti custom, plugin, animazioni, integrazione con design system e ottimizzazione della produzione. Il progetto finale è un dashboard amministrativo responsive completo.`,
    objectives: [
      'Configurare Tailwind CSS in qualsiasi progetto',
      'Padroneggiare utility class e responsività',
      'Creare componenti riutilizzabili con @apply',
      'Gestire temi, Dark Mode e varianti',
      'Costruire layout complessi con Grid e Flexbox',
      'Ottimizzare bundle in produzione'
    ],
    modules: [
      {
        title: 'Fondamenti Tailwind',
        lessons: ['Installazione e setup v4', 'Utility class: spacing, color, typography', 'Layout: Flexbox e Grid con utility', 'Responsive: breakpoint variants', 'Hover, focus e state variants'],
        duration: 120
      },
      {
        title: 'Design System e Tema',
        lessons: ['Configurazione tailwind.config', 'Custom colors, fonts e breakpoint', 'Dark Mode: class e media strategy', 'Arbitrary values e JIT engine', 'Plugin e preset'],
        duration: 120
      },
      {
        title: 'Componenti e Pattern',
        lessons: ['Button, card, badge: pattern', 'Form e input styling', 'Navigation e dropdown', 'Modal e overlay', 'Skeleton e loading state'],
        duration: 120
      },
      {
        title: 'Layout Avanzati',
        lessons: ['Dashboard layout con Grid', 'Sidebar e header pattern', 'Hero section e landing page', 'Card grid e gallery', 'Footer e mega menu'],
        duration: 120
      },
      {
        title: 'Animazioni e Interazioni',
        lessons: ['Transition e animation utility', 'Keyframes custom', 'Group hover e parent state', 'Peer modifier e sibling state', 'Parallax e scroll effect'],
        duration: 120
      },
      {
        title: 'Progetto: Admin Dashboard',
        lessons: ['Layout completo responsive', 'Sidebar e navigazione', 'Statistiche e grafici', 'Tabelle e data table', 'Tema chiaro/scuro'],
        duration: 180
      }
    ],
    requirements: [
      'Conoscenza base di HTML e CSS',
      'Familiarità con editor di codice',
      'Node.js 18+ installato',
      'Browser moderno'
    ],
    includes: [
      '15 ore di video lezioni in 4K',
      '30+ esercizi di styling',
      'Dashboard admin completo',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat',
      'Configurazioni pronte',
      'Design system starter'
    ],
    skills: ['Tailwind CSS v4', 'Responsive Design', 'Custom Theme', 'Dark Mode', 'CSS Grid', 'Flexbox', 'Animations']
  },

  'chrome-extensions': {
    title: 'Chrome Extensions',
    tag: 'Frontend',
    level: 'Intermedio',
    duration: 15,
    price: 0,
    students: 3200,
    lastUpdated: 'Giugno 2026',
    imageUrl: '/corsi/chrome.png',
    instructor: { name: 'Gabriele Forestieri', role: 'Fullstack Developer & Founder', avatar: '' },
    shortDesc: 'Crea estensioni Chrome: da utility semplici ad add-on complessi con API e servizi.',
    longDescription: `Le estensioni Chrome sono uno dei modi più potenti per migliorare la produttività e raggiungere milioni di utenti. Conoscere l'API delle estensioni ti permette di creare strumenti che si integrano nativamente nel browser più usato al mondo.

In questo corso imparerai tutto ciò che serve per sviluppare estensioni Chrome professionali: dal manifest.json alla pubblicazione sul Chrome Web Store. Inizieremo con i fondamenti dell'architettura delle estensioni: background script, content script, popup e service worker.

Passeremo poi alle API più utilizzate: storage, tabs, notifications, bookmarks, context menus e declarativeNetRequest. La parte avanzata copre comunicazione tra script, sicurezza, manifest V3, integrazione con API esterne e React per UI complesse. Il progetto finale è un'estensione productivity completa con dashboard, timer Pomodoro e integrazione API.`,
    objectives: [
      "Comprendere l'architettura delle estensioni Manifest V3",
      'Sviluppare background script e service worker',
      'Interagire con le pagine web tramite content script',
      'Usare Chrome API: storage, tabs, notifications',
      'Creare popup e options page con React',
      'Pubblicare estensioni sul Chrome Web Store'
    ],
    modules: [
      {
        title: 'Fondamenti Estensioni',
        lessons: ['Architettura: manifest.json e componenti', 'Manifest V3 vs V2: cosa cambia', 'Background service worker', 'Content script: iniezione e isolamento', 'Popup e action: UI base'],
        duration: 120
      },
      {
        title: 'Chrome API Core',
        lessons: ['Storage: locale, sync e session', 'Tabs: creazione, query e comunicazione', 'Notifications e badges', 'Context menus e comandi', 'Bookmarks e history API'],
        duration: 180
      },
      {
        title: 'Content Script e Comunicazione',
        lessons: ['Messaging: one-time e long-lived', 'Content script avanzato: DOM manipulation', 'Programmatic injection', 'Port e connessione persistente', 'Cross-origin messaging'],
        duration: 180
      },
      {
        title: 'API Avanzate',
        lessons: ['declarativeNetRequest: blocca e modifica', 'Downloads e file system', 'Identity API e OAuth', 'Alarms e scheduling', 'Offscreen document'],
        duration: 180
      },
      {
        title: 'UI e Integrazione',
        lessons: ['Options page con React', 'Side panel: UI persistente', 'Badge e notifiche dinamiche', 'Shortcuts e comandi da tastiera', 'Internazionalizzazione (i18n)'],
        duration: 180
      },
      {
        title: 'Progetto: Productivity Suite',
        lessons: ['Setup: React + WXT/Vite', 'Popup: task manager rapido', 'Timer Pomodoro con notifiche', 'Scheduler con alarms API', 'Pubblicazione su Chrome Web Store'],
        duration: 240
      }
    ],
    requirements: [
      'Conoscenza base di JavaScript e HTML',
      'Familiarità con React (opzionale)',
      'Chrome o Brave installato',
      'Editor di codice'
    ],
    includes: [
      '15 ore di video lezioni in 4K',
      '25+ esercizi pratici',
      'Estensione productivity completa',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat',
      'Template WXT + React',
      'Guida alla pubblicazione su Store'
    ],
    skills: ['Chrome Extensions', 'Manifest V3', 'JavaScript', 'Service Workers', 'Chrome API', 'React', 'WXT']
  },

  'landing-page-design': {
    title: 'Landing Page Design',
    tag: 'Frontend',
    level: 'Beginner',
    duration: 20,
    price: 0,
    students: 5600,
    lastUpdated: 'Giugno 2026',
    imageUrl: '/corsi/landing.png',
    instructor: { name: 'Gabriele Forestieri', role: 'Fullstack Developer & Founder', avatar: '' },
    shortDesc: 'Design e sviluppo di landing page ad alta conversione con Next.js e Tailwind.',
    longDescription: `La landing page è il front-end del tuo business. Una landing page ben progettata può triplicare il tasso di conversione e trasformare visitatori anonimi in clienti paganti.

In questo corso imparerai a progettare e sviluppare landing page professionali partendo da zero. Inizieremo con i principi di design: gerarchia visiva, tipografia, colore e composizione. Poi passeremo alla costruzione con Next.js e Tailwind CSS.

Nella parte avanzata vedrai strategie di conversione: call-to-action efficaci, social proof, storytelling visivo e A/B testing. Il progetto finale è una landing page completa per un prodotto SaaS con animazioni, form di contatto e analytics integrati.`,
    objectives: [
      'Progettare layout efficaci per la conversione',
      'Padroneggiare principi di gerarchia visiva e tipografia',
      'Sviluppare landing page con Next.js e Tailwind',
      'Implementare animazioni e interazioni fluide',
      'Ottimizzare per SEO e performance',
      'Configurare analytics e A/B testing'
    ],
    modules: [
      {
        title: 'Fondamenti di Design',
        lessons: ['Gerarchia visiva e griglie', 'Teoria del colore e palette', 'Tipografia web professionale', 'Spacing e composizione', 'Principi di psicologia del design'],
        duration: 120
      },
      {
        title: 'Wireframing e Prototipazione',
        lessons: ['Dal brief allo schema', 'Wireframe low-fi e hi-fi', 'Struttura above the fold', 'User flow e customer journey', 'Strumenti: Figma per landing'],
        duration: 150
      },
      {
        title: 'Next.js & Tailwind Setup',
        lessons: ['Setup Next.js con Tailwind', 'Componenti riutilizzabili', 'Layout responsive: mobile-first', 'Dark mode e varianti tema', 'SEO: meta tag e Open Graph'],
        duration: 180
      },
      {
        title: 'Sezioni ad Alta Conversione',
        lessons: ['Hero section impattante', 'Feature grid e benefit', 'Testimonial e social proof', 'Pricing table chiara', 'CTA section e form'],
        duration: 180
      },
      {
        title: 'Animazioni e Interazioni',
        lessons: ['Framer Motion: layout e varianti', 'Scroll-triggered animations', 'Parallax e micro-interazioni', 'Caricamento progressivo', 'Transizioni di pagina'],
        duration: 150
      },
      {
        title: 'Deploy e Ottimizzazione',
        lessons: ['Performance: Lighthouse 90+', 'Analytics: Plausible/Google', 'A/B testing con Vercel', 'Email capture e integrazione CRM', 'Dominio personale e deploy'],
        duration: 120
      }
    ],
    requirements: [
      'Conoscenza base di HTML e CSS',
      'Familiarità con React (opzionale)',
      'Nessuna esperienza di design richiesta'
    ],
    includes: [
      '20 ore di video lezioni in 4K',
      '20+ esercizi pratici',
      'Template landing page completo',
      'Figma kit con componenti',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat'
    ],
    skills: ['Design', 'Next.js', 'Tailwind', 'Figma', 'Conversion', 'Framer Motion', 'SEO']
  },

  'nextjs-saas': {
    title: "Next.js SaaS Starter",
    tag: 'Frontend',
    level: 'Intermedio',
    duration: 25,
    price: 0,
    students: 3800,
    lastUpdated: 'Luglio 2026',
    imageUrl: '/corsi/next-saas.png',
    instructor: { name: 'Gabriele Forestieri', role: 'Fullstack Developer & Founder', avatar: '' },
    shortDesc: 'Costruisci una web app SaaS completa: auth, pagamenti, dashboard e deploy.',
    longDescription: `Il modello SaaS è il modo più diffuso per monetizzare applicazioni web. In questo corso costruirai una web app SaaS completa dalla prima riga di codice al deploy in produzione.

Inizieremo con l'architettura di una SaaS: modelli di business, pricing tier e scelte tecniche fondamentali. Poi passeremo allo sviluppo con Next.js 16 App Router: autenticazione multi-provider, pagamenti con Stripe, database PostgreSQL e API sicure.

La parte avanzata copre feature essenziali per una SaaS: dashboard utente, gestione abbonamenti, webhook Stripe, email transazionali e analytics. Il deploy è su Vercel con CI/CD, monitoring e logging integrati.`,
    objectives: [
      'Architettare una SaaS con Next.js App Router',
      'Implementare autenticazione multi-provider',
      'Integrare pagamenti ricorrenti con Stripe',
      'Costruire dashboard utente completa',
      'Gestire webhook e abbonamenti',
      'Deployare in produzione con monitoring'
    ],
    modules: [
      {
        title: 'Architettura SaaS',
        lessons: ["Modelli di business: freemium e tier", 'Scelte tecniche e stack', 'Schema del database utenti', 'Setup Next.js con TypeScript', 'Struttura del progetto SaaS'],
        duration: 120
      },
      {
        title: 'Autenticazione',
        lessons: ['NextAuth: setup provider', 'OAuth: Google e GitHub', 'Email e password + magic link', 'Session management e JWT', 'Middleware e route protection'],
        duration: 180
      },
      {
        title: 'Database e API',
        lessons: ['PostgreSQL con Prisma', 'Modellazione dati SaaS', 'API Routes sicure', 'Server Actions', 'Rate limiting e validazione'],
        duration: 180
      },
      {
        title: 'Stripe e Pagamenti',
        lessons: ['Stripe setup e webhook', 'Checkout sessione', 'Abbonamenti e pricing tier', 'Customer portal', 'Gestione dei fallimenti pagamento'],
        duration: 200
      },
      {
        title: 'Dashboard e Feature',
        lessons: ['Dashboard utente con grafici', 'Gestione profilo e impostazioni', 'Fatture e storico pagamenti', 'Email transazionali con Resend', 'Feature flags per rollout graduale'],
        duration: 200
      },
      {
        title: 'Produzione e Deploy',
        lessons: ['Deploy su Vercel con env vars', 'CI/CD con GitHub Actions', 'Monitoring con Sentry', 'Analytics e metriche SaaS', 'Backup e disaster recovery'],
        duration: 150
      }
    ],
    requirements: [
      'Conoscenza solida di React e Next.js',
      'Esperienza base con TypeScript',
      'Familiarità con Terminal e Git'
    ],
    includes: [
      '25 ore di video lezioni in 4K',
      '30+ esercizi pratici',
      'Template SaaS completo',
      'Componenti Stripe già integrati',
      'Schema Prisma completo',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat'
    ],
    skills: ['Next.js', 'Stripe', 'SaaS', 'PostgreSQL', 'Prisma', 'NextAuth', 'TypeScript']
  },

  'go-backend': {
    title: 'Go Backend',
    tag: 'Backend',
    level: 'Intermedio',
    duration: 30,
    price: 0,
    students: 4100,
    lastUpdated: 'Luglio 2026',
    imageUrl: '/corsi/go.png',
    instructor: { name: 'Gabriele Forestieri', role: 'Fullstack Developer & Founder', avatar: '' },
    shortDesc: 'Backend performanti con Go: API REST, concorrenza, database e microservizi.',
    longDescription: `Go è il linguaggio scelto dalle aziende per costruire infrastrutture scalabili: Docker, Kubernetes, Prometheus e Vercel sono scritti in Go. Se vuoi lavorare su sistemi ad alte prestazioni, Go è la skill che fa la differenza.

In questo corso imparerai Go da zero partendo dalla sintassi base fino alla costruzione di microservizi distribuiti. Esploreremo tipi, strutture, interfacce e il potente sistema di concorrenza con goroutine e channel.

Costruirai API REST complete con routing, middleware, autenticazione e database PostgreSQL. Il progetto finale è una piattaforma di job queue con worker concorrenti, deployata con Docker su Railway.`,
    objectives: [
      'Padroneggiare sintassi e tipi di Go',
      'Scrivere codice concorrente con goroutine e channel',
      'Costruire API REST con router e middleware',
      'Integrare database PostgreSQL e Redis',
      'Implementare testing e benchmark',
      'Deployare microservizi con Docker'
    ],
    modules: [
      {
        title: 'Fondamenti Go',
        lessons: ['Sintassi base: variabili, tipi, funzioni', 'Struct e metodi', 'Interfacce e polimorfismo', 'Error handling e panic', 'Package management con Go Modules'],
        duration: 150
      },
      {
        title: 'Concorrenza',
        lessons: ['Goroutine: basi e lifecycle', 'Channel: comunicazione tra routine', 'Select e pattern temporali', 'Mutex e sincronizzazione', 'Worker pool pattern'],
        duration: 200
      },
      {
        title: 'API REST',
        lessons: ['Router: chi e net/http', 'Middleware: logging e auth', 'JSON request/response', 'Validazione input', 'Rate limiting e CORS'],
        duration: 180
      },
      {
        title: 'Database e Storage',
        lessons: ['PostgreSQL con pgx', 'Query builder: sqlx', 'Migrazioni con golang-migrate', 'Redis per caching', 'File storage e upload'],
        duration: 180
      },
      {
        title: 'Testing e Performance',
        lessons: ['Unit test e table-driven tests', 'Mocking e integration test', 'Benchmark e profiling', 'pprof e ottimizzazione', 'Stress test con vegeta'],
        duration: 150
      },
      {
        title: 'Microservizi e Deploy',
        lessons: ['Architettura a microservizi', 'gRPC per comunicazione interna', 'Docker multi-stage build', 'Docker Compose per sviluppo', 'Deploy su Railway e Fly.io'],
        duration: 200
      }
    ],
    requirements: [
      'Esperienza con almeno un linguaggio di programmazione',
      'Conoscenza base di terminale e Git',
      'Familiarità con API REST (concettuale)'
    ],
    includes: [
      '30 ore di video lezioni in 4K',
      '35+ esercizi pratici',
      'API completa con autenticazione',
      'Worker pool per job queue',
      'Dockerfile e Docker Compose pronti',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat'
    ],
    skills: ['Go', 'API REST', 'Concurrency', 'PostgreSQL', 'Redis', 'Docker', 'Microservizi']
  },

  'docker-devops': {
    title: 'Docker & DevOps',
    tag: 'Backend',
    level: 'Intermedio',
    duration: 20,
    price: 0,
    students: 7200,
    lastUpdated: 'Maggio 2026',
    imageUrl: '/corsi/docker.png',
    instructor: { name: 'Gabriele Forestieri', role: 'Fullstack Developer & Founder', avatar: '' },
    shortDesc: 'Containerizzazione, CI/CD e orchestrazione per ambienti di produzione moderni.',
    longDescription: `Docker ha rivoluzionato il modo in cui sviluppiamo e deployiamo software. In questo corso imparerai a containerizzare applicazioni, automatizzare deploy e gestire infrastrutture moderne con strumenti DevOps.

Partiremo dai fondamenti di Docker: immagini, container, volumi e reti. Poi passeremo a Docker Compose per ambienti multi-container e CI/CD con GitHub Actions per testing e deploy automatici.

Nella parte avanzata esploreremo Kubernetes per orchestrazione, monitoring con Prometheus e logging centralizzato. Il progetto finale è un'infrastruttura completa con pipeline CI/CD, container ottimizzati e monitoring dashboard.`,
    objectives: [
      'Padroneggiare Docker: immagini, container e networking',
      'Gestire ambienti multi-container con Docker Compose',
      'Configurare pipeline CI/CD con GitHub Actions',
      'Orchestrare container con Kubernetes',
      'Implementare monitoring e logging',
      'Ottimizzare immagini per produzione'
    ],
    modules: [
      {
        title: 'Docker Fondamenti',
        lessons: ['Cos\'è un container vs VM', 'Dockerfile: istruzioni e best practice', 'Immagini: build, tag e registry', 'Volumi e persistenza dati', 'Networking: bridge, host, overlay'],
        duration: 150
      },
      {
        title: 'Docker Compose',
        lessons: ['docker-compose.yml: struttura', 'Servizi multi-container', 'Variabili d\'ambiente e .env', 'Healthcheck e dipendenze', 'Sviluppo con hot-reload'],
        duration: 120
      },
      {
        title: 'CI/CD con GitHub Actions',
        lessons: ['Pipeline: trigger e jobs', 'Testing automatico in container', 'Build e push su registry', 'Deploy automatico su server', 'Ambienti: staging e produzione'],
        duration: 180
      },
      {
        title: 'Kubernetes',
        lessons: ['Architettura: pod, service, deployment', 'kubectl comandi essenziali', 'ConfigMap e Secrets', 'Ingress e load balancing', 'Helm: package manager'],
        duration: 200
      },
      {
        title: 'Monitoring e Logging',
        lessons: ['Prometheus: metriche e alert', 'Grafana dashboard', 'Struttura log centralizzato', 'Container logging driver', 'Tracing con OpenTelemetry'],
        duration: 150
      },
      {
        title: 'Produzione e Sicurezza',
        lessons: ['Ottimizzazione immagini: multi-stage', 'Scansione vulnerabilità con Trivy', 'Resource limits e scaling', 'Backup e restore volumi', 'Disaster recovery plan'],
        duration: 120
      }
    ],
    requirements: [
      'Esperienza con terminale Linux',
      'Conoscenza base di un linguaggio di programmazione',
      'Familiarità con Git e GitHub'
    ],
    includes: [
      '20 ore di video lezioni in 4K',
      '25+ esercizi pratici',
      'Dockerfile e Compose pronti',
      'Pipeline CI/CD template',
      'Config Kubernetes base',
      'Dashboard Grafana pre-configurata',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat'
    ],
    skills: ['Docker', 'CI/CD', 'Kubernetes', 'GitHub Actions', 'Prometheus', 'Grafana', 'DevOps']
  },

  'sql-database': {
    title: 'SQL & Database Design',
    tag: 'Backend',
    level: 'Beginner',
    duration: 25,
    price: 0,
    students: 9800,
    lastUpdated: 'Luglio 2026',
    imageUrl: '/corsi/sql.png',
    instructor: { name: 'Gabriele Forestieri', role: 'Fullstack Developer & Founder', avatar: '' },
    shortDesc: 'Progetta database relazionali solidi: modellazione, query, indici e performance.',
    longDescription: `I database relazionali sono il cuore di quasi tutte le applicazioni moderne. Saper progettare uno schema solido e scrivere query efficienti è una skill fondamentale per ogni sviluppatore.

In questo corso imparerai tutto sui database relazionali partendo dai fondamenti: modellazione entità-relazione, normalizzazione e vincoli di integrità. Poi passeremo a SQL avanzato: JOIN, subquery, CTE, window functions e indici.

La parte pratica include ottimizzazione delle performance, progettazione di schemi per applicazioni reali (e-commerce, social, SaaS), migrazioni e best practice di sicurezza. Ogni modulo ha esercizi su PostgreSQL con dataset reali.`,
    objectives: [
      'Progettare schemi di database normalizzati',
      'Scrivere query SQL complesse con JOIN e subquery',
      'Usare CTE e window functions per analisi avanzate',
      'Ottimizzare performance con indici e EXPLAIN',
      'Gestire migrazioni e versioning dello schema',
      'Implementare sicurezza e backup del database'
    ],
    modules: [
      {
        title: 'Fondamenti di Database',
        lessons: ['Modellazione entità-relazione (ER)', 'Normalizzazione: 1NF, 2NF, 3NF', 'Tipi di dato e vincoli', 'Primary key, foreign key e unique', 'Cardinalità e relazioni'],
        duration: 150
      },
      {
        title: 'SQL Essenziale',
        lessons: ['SELECT, WHERE, ORDER BY', 'Aggregazione: GROUP BY e HAVING', 'Filtri avanzati: LIKE, IN, BETWEEN', 'Subquery: scalar e tabella', 'Set operation: UNION, INTERSECT'],
        duration: 180
      },
      {
        title: 'JOIN e Relazioni',
        lessons: ['INNER JOIN: combinare tabelle', 'LEFT, RIGHT e FULL OUTER JOIN', 'Self JOIN e alberi gerarchici', 'JOIN su più tabelle', 'Cross JOIN e prodotti cartesiani'],
        duration: 150
      },
      {
        title: 'SQL Avanzato',
        lessons: ['Common Table Expressions (CTE)', 'Window functions: ROW_NUMBER, RANK', 'Transazioni e ACID', 'Stored procedure e funzioni', 'Trigger e vincoli complessi'],
        duration: 200
      },
      {
        title: 'Performance e Indici',
        lessons: ['EXPLAIN ANALYZE: leggere piani', 'Indici B-tree, hash e GIN', 'Query optimization', 'Partitioning per grandi dataset', 'Connection pooling (PgBouncer)'],
        duration: 150
      },
      {
        title: 'Progettazione Reale',
        lessons: ['Schema e-commerce: prodotti e ordini', 'Schema social: utenti e feed', 'Schema SaaS: multi-tenancy', 'Migrazioni con golang-migrate/Prisma', 'Backup, restore e disaster recovery'],
        duration: 180
      }
    ],
    requirements: [
      'Nessuna esperienza con database richiesta',
      'Conoscenza base di terminale',
      'Familiarità con linguaggi di programmazione'
    ],
    includes: [
      '25 ore di video lezioni in 4K',
      '30+ esercizi pratici con dataset reali',
      'Schema completo e-commerce',
      'Script di migrazione pronti',
      'PostgreSQL playground setup',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat'
    ],
    skills: ['SQL', 'PostgreSQL', 'Database Design', 'Query Optimization', 'Data Modeling', 'Indici', 'Migrazioni']
  },

  'git-github': {
    title: 'Git & GitHub',
    tag: 'Fullstack',
    level: 'Beginner',
    duration: 10,
    price: 0,
    students: 15300,
    lastUpdated: 'Maggio 2026',
    imageUrl: '/corsi/git.png',
    instructor: { name: 'Gabriele Forestieri', role: 'Fullstack Developer & Founder', avatar: '' },
    shortDesc: 'Controllo versione e collaborazione professionale con Git e GitHub.',
    longDescription: `Git è lo strumento più importante per la collaborazione nel software development. Ogni sviluppatore, indipendentemente dal linguaggio o framework, deve saperlo usare con sicurezza.

Questo corso ti porta da zero a eroe di Git: inizierai con commit, branch e merge per poi passare a rebase, stash, cherry-pick e conflitti. Imparerai i flussi di lavoro professionali come GitHub Flow e Git Flow.

La parte pratica include pull request, code review, GitHub Actions per CI/CD, GitHub Pages per portfolio e gestione di progetti open-source con issue e progetti board. Il corso è completamente gratuito.`,
    objectives: [
      'Padroneggiare commit, branch e merge',
      'Gestire conflitti con sicurezza',
      'Usare rebase e cherry-pick',
      'Collaborare con pull request e code review',
      'Configurare GitHub Actions per CI/CD',
      'Pubblicare progetti con GitHub Pages'
    ],
    modules: [
      {
        title: 'Fondamenti Git',
        lessons: ['Cos\'è il version control', 'init, add, commit: primo workflow', 'git log: leggere la storia', 'git diff e status', 'gitignore e file sensibili'],
        duration: 90
      },
      {
        title: 'Branch e Merge',
        lessons: ['Branch: creare e navigare', 'Merge: fast-forward e 3-way', 'Risolvere conflitti', 'Merge strategy: ours, theirs', 'Branch naming convention'],
        duration: 120
      },
      {
        title: 'Rebase e Stash',
        lessons: ['Rebase: riscrivere la storia', 'Interactive rebase: squash e edit', 'Cherry-pick: selezionare commit', 'Stash: salvare lavoro temporaneo', 'reset vs revert vs restore'],
        duration: 120
      },
      {
        title: 'GitHub Collaboration',
        lessons: ['Fork e clone', 'Pull request: aprire e recensire', 'Code review best practice', 'GitHub Issues e Projects', 'GitHub Flow vs Git Flow'],
        duration: 120
      },
      {
        title: 'GitHub Actions',
        lessons: ['Workflow: trigger e jobs', 'CI: test automatici', 'CD: deploy su Vercel/Pages', 'Actions marketplace', 'Secret management'],
        duration: 90
      },
      {
        title: 'Progetto Open Source',
        lessons: ['Contribuire a progetti esistenti', 'Issue template e CONTRIBUTING.md', 'Release e tag semantic versioning', 'CHANGELOG e documentazione', 'GitHub Pages: portfolio personale'],
        duration: 90
      }
    ],
    requirements: [
      'Nessuna esperienza con Git richiesta',
      'Account GitHub gratuito',
      'Editor di codice e terminale'
    ],
    includes: [
      '10 ore di video lezioni in 4K',
      '15+ esercizi pratici',
      'Cheat sheet Git stampabile',
      'Template pull request',
      'Workflow GitHub Actions pronto',
      'Accesso a vita e aggiornamenti',
      'Certificato di completamento',
      'Supporto 1:1 via chat'
    ],
    skills: ['Git', 'GitHub', 'Version Control', 'CI/CD', 'GitHub Actions', 'Open Source', 'Collaboration']
  }
};

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Code2, Paintbrush, Terminal, Database, Globe, Cpu, Smartphone, Feather, FileJson, Globe2, Palette
};

export default COURSES_DATA;
export { iconMap };
export type { CoursePreview, Instructor, Module };
