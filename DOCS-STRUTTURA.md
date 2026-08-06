# StackUp — Documentazione della Struttura

## Architettura Generale

StackUp è una piattaforma Next.js 16 (Pages Router) per l'apprendimento della programmazione. Offre corsi, programmi bundle e servizi di coaching, con autenticazione Supabase, pagamenti Stripe e database PostgreSQL.

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase (Auth + PostgreSQL), Stripe, Resend, Framer Motion, react-hot-toast.

---

## 1. Variabili d'Ambiente (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL              # URL del tuo progetto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY         # Chiave anonima Supabase (pubblica)
SUPABASE_SERVICE_ROLE_KEY             # Chiave service role Supabase (solo server)
STRIPE_SECRET_KEY                     # Chiave segreta Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY    # Chiave pubblicabile Stripe
STRIPE_WEBHOOK_SECRET                 # Chiave webhook Stripe
NEXT_PUBLIC_APP_URL                   # URL base app (es. http://localhost:3000)
NEXT_PUBLIC_CONTACT_EMAIL             # Email di contatto (es. hello@stackup.academy)
RESEND_API_KEY                        # API key Resend per email
RESEND_FROM_EMAIL                     # Mittente email Resend
```

---

## 2. Struttura delle Directory

```
/
├── .env.local                    # Variabili d'ambiente
├── next.config.mjs               # Config Next.js
├── package.json                  # Dipendenze e script
│
└── src/
    ├── lib/                      # Utility condivise
    │   ├── supabase.ts           # Client Supabase (lato client)
    │   ├── supabase-admin.ts     # Client Supabase (service role, lato server)
    │   └── rateLimit.ts          # Rate limiter in-memory
    │
    ├── context/                  # React Context (Provider)
    │   ├── AuthContext.tsx        #   Stato auth globale (Supabase session)
    │   └── CartContext.tsx        #   Carrello acquisti (localStorage)
    │
    ├── constants/
    │   └── navigation.ts         #   Voci di navigazione per Navbar
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx        #   Navbar responsive con menu mobile
    │   │   ├── Footer.tsx        #   Footer con link rapidi e social
    │   │   └── DashboardSidebar.tsx  # Sidebar dashboard utente
    │   ├── course/
    │   │   └── ExerciseComponent.tsx  # Render esercizio interattivo
    │   └── ui/
    │       ├── SEO.tsx           #   Meta tag SEO (react-helmet-async)
    │       ├── Card.tsx          #   Card generica (hero/medium/small/wide)
    │       └── SectionTitle.tsx  #   Titolo sezione stilizzato
    │
    └── pages/                    # PAGINE (Pages Router)
        ├── _app.tsx              #   Wrapper globale: Provider + Navbar + Footer
        ├── _document.tsx         #   Custom Document
        ├── index.tsx             #   Homepage
        ├── courses.tsx           #   Catalogo corsi (da API)
        ├── courses/
        │   ├── [slug].tsx        #   Dettaglio corso (da API)
        │   └── preview/
        │       └── [slug].tsx    #   Preview corso / upsell
        ├── programs.tsx          #   Programmi bundle
        ├── services/
        │   └── coaching.tsx      #   Pagina coaching
        ├── cart.tsx              #   Carrello + checkout Stripe
        ├── orders.tsx            #   Storico ordini
        ├── dashboard.tsx         #   Dashboard utente
        ├── settings.tsx          #   Impostazioni profilo
        ├── my-courses.tsx        #   Corsi acquistati
        ├── certificates/
        │   └── index.tsx         #   Certificati ottenuti
        ├── login.tsx             #   Login (email + OAuth)
        ├── register.tsx          #   Registrazione
        ├── forgot-password.tsx   #   Reset password
        ├── reset-password.tsx    #   Nuova password
        ├── auth/
        │   └── callback.tsx      #   Callback OAuth Supabase
        ├── contact.tsx           #   Contatti
        ├── blog/
        │   ├── index.tsx         #   Blog
        │   └── [slug].tsx        #   Articolo blog
        ├── logic.tsx             #   Logica & Algoritmi
        ├── logic/
        │   └── visualizer.tsx    #   Visualizer interattivo
        ├── projects.tsx          #   Progetti showcase
        ├── docs/
        │   └── index.tsx         #   Documentazione tecnica
        ├── bundles.tsx           #   Bundle pricing
        ├── privacy.tsx           #   Privacy Policy
        ├── terms.tsx             #   Termini e Condizioni
        ├── cookie.tsx            #   Cookie Policy
        ├── legal.tsx             #   Legal
        ├── 404.tsx               #   Pagina 404
        │
        └── api/                  # API ROUTES
            ├── contact.ts        #   Invia email contatto (Resend)
            ├── esercizi/
            │   └── index.ts      #   GET esercizi da Supabase
            ├── auth/
            │   ├── [...].ts      #   Route Supabase Auth helpers
            │   ├── register.ts   #   Registrazione con Supabase
            │   ├── login.ts      #   Login con Supabase
            │   ├── me.ts         #   Profilo utente corrente
            │   ├── update-profile.ts # Aggiorna profilo
            │   ├── change-password.ts # Cambia password
            │   └── supabase-callback.ts # Callback OAuth sync
            ├── blog/
            │   └── index.ts      #   GET articoli blog
            ├── courses/
            │   ├── index.ts      #   GET lista corsi
            │   └── [slug].ts     #   GET singolo corso
            ├── certificates/
            │   └── index.ts      #   GET certificati utente
            ├── orders/
            │   └── index.ts      #   GET ordini utente
            └── payments/
                ├── create-checkout.ts  # POST Stripe Checkout
                └── webhook.ts          # POST webhook Stripe
```

---

## 3. Pagine — Mappa e Descrizione

| Route | File | Auth | Contenuto |
|-------|------|------|-----------|
| `/` | `index.tsx` | No | Hero + stats + corsi + servizi + company marquee + FAQ |
| `/courses` | `courses.tsx` | No | Catalogo corsi con cards + prezzo |
| `/courses/[slug]` | `courses/[slug].tsx` | No | Dettaglio corso + acquisto |
| `/courses/preview/[slug]` | `courses/preview/[slug].tsx` | No | Preview corso / upsell |
| `/programs` | `programs.tsx` | No | Programmi bundle |
| `/services/coaching` | `services/coaching.tsx` | No | Piani coaching |
| `/cart` | `cart.tsx` | No | Carrello + checkout Stripe |
| `/orders` | `orders.tsx` | Sì | Storico ordini |
| `/dashboard` | `dashboard.tsx` | Sì | Dashboard utente |
| `/settings` | `settings.tsx` | Sì | Impostazioni profilo |
| `/my-courses` | `my-courses.tsx` | Sì | Corsi acquistati |
| `/certificates` | `certificates/index.tsx` | Sì | Certificati ottenuti |
| `/login` | `login.tsx` | No | Login |
| `/register` | `register.tsx` | No | Registrazione |
| `/forgot-password` | `forgot-password.tsx` | No | Reset password |
| `/reset-password` | `reset-password.tsx` | No | Nuova password |
| `/auth/callback` | `auth/callback.tsx` | No | Callback OAuth |
| `/contact` | `contact.tsx` | No | Form contatti |
| `/blog` | `blog/index.tsx` | No | Blog |
| `/blog/[slug]` | `blog/[slug].tsx` | No | Articolo |
| `/logic` | `logic.tsx` | No | Logica & Algoritmi |
| `/logic/visualizer` | `logic/visualizer.tsx` | No | Visualizer interattivo |
| `/projects` | `projects.tsx` | No | Progetti showcase |
| `/docs` | `docs/index.tsx` | No | Documentazione tecnica |
| `/bundles` | `bundles.tsx` | No | Bundle pricing |
| `/privacy` | `privacy.tsx` | No | Privacy Policy |
| `/terms` | `terms.tsx` | No | Termini e Condizioni |
| `/cookie` | `cookie.tsx` | No | Cookie Policy |
| `/legal` | `legal.tsx` | No | Legal |

---

## 4. API Routes

| Metodo | Route | Auth | Descrizione |
|--------|-------|------|-------------|
| POST | `/api/contact` | No | Invia email contatto (Resend) |
| POST | `/api/auth/register` | No | Registrazione Supabase |
| POST | `/api/auth/login` | No | Login Supabase |
| GET | `/api/auth/me` | Bearer | Profilo utente |
| PUT | `/api/auth/update-profile` | Bearer | Aggiorna profilo |
| PUT | `/api/auth/change-password` | Bearer | Cambia password |
| POST | `/api/auth/supabase-callback` | No | Sync OAuth → DB |
| GET | `/api/courses` | No | Lista corsi |
| GET | `/api/courses/[slug]` | No | Singolo corso |
| GET | `/api/blog` | No | Lista articoli |
| GET | `/api/esercizi` | No | Esercizi |
| GET | `/api/certificates` | Bearer | Certificati utente |
| GET | `/api/orders` | Bearer | Ordini utente |
| POST | `/api/payments/create-checkout` | No | Stripe Checkout |
| POST | `/api/payments/webhook` | Stripe | Webhook pagamento |

---

## 5. Database (Supabase PostgreSQL)

Tabelle principali:
- **users** — Profili utente (sync da Supabase Auth)
- **courses** — Corsi con slug, titolo, prezzo, livello, etc.
- **sections** — Sezioni di un corso
- **exercises** — Esercizi dentro una sezione
- **enrollments** — Iscrizioni utente ai corsi
- **certificates** — Certificati rilasciati
- **transactions** — Pagamenti Stripe
- **blog_posts** — Articoli del blog

---

## 6. Autenticazione (Supabase Auth)

- Gestita da `@supabase/auth-helpers-nextjs`
- Provider supportati: email/password, Google OAuth, GitHub OAuth
- `AuthContext.tsx` gestisce sessione e utente globale
- `supabase-admin.ts` usa service role per operazioni server-side

---

## 7. Pagamenti (Stripe)

1. Utente aggiunge corsi al carrello (CartContext + localStorage)
2. Checkout → `POST /api/payments/create-checkout` → sessione Stripe
3. Redirect a Stripe → webhook `POST /api/payments/webhook` → create enrollment + transaction

---

## 8. SEO

Componente `<SEO />` in `src/components/ui/SEO.tsx`:
- title, description, og:title, og:description, og:image
- Canonical URL da `NEXT_PUBLIC_APP_URL`

---

## 9. Comandi di Sviluppo

```bash
npm run dev      # Avvia dev server (localhost:3000)
npm run build    # Build di produzione
npm run start    # Avvia server produzione
npm run lint     # ESLint
```
