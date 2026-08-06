import type { Metadata } from 'next';

export const metadata: Metadata = {
 title: 'Privacy Policy',
 description: 'Privacy Policy di StackUp Academy',
};

export default function PrivacyPage() {
 return (
  <div className="min-h-screen bg-black pt-20 md:pt-24 pb-16">
   <div className="max-w-3xl mx-auto px-6">
    <h1 className="text-4xl font-jakarta font-black text-zinc-100 mb-8">Privacy Policy</h1>
    <p className="text-sm text-zinc-400 mb-8">Ultimo aggiornamento: Giugno 2026</p>
    <div className="prose prose-slate max-w-none space-y-6 text-zinc-400">
     <p>StackUp Academy rispetta la tua privacy. Questa policy spiega come raccogliamo, usiamo e proteggiamo i tuoi dati personali.</p>
     <h2 className="text-lg font-bold text-zinc-100">Dati raccolti</h2>
     <p>Registrandoti raccogliamo: nome, email, avatar (se Google OAuth). Durante l&apos;utilizzo: corsi acquistati, progressi esercizi, storico ordini.</p>
     <h2 className="text-lg font-bold text-zinc-100">Finalit&agrave; del trattamento</h2>
     <p>I tuoi dati vengono usati per: erogare i corsi, gestire pagamenti (Stripe), inviare comunicazioni di servizio, migliorare la piattaforma.</p>
     <h2 className="text-lg font-bold text-zinc-100">Cookie</h2>
     <p>Usiamo cookie tecnici per l&apos;autenticazione e cookie analytics. Non usiamo cookie di profilazione senza il tuo consenso esplicito.</p>
     <h2 className="text-lg font-bold text-zinc-100">Terze parti</h2>
     <p>I pagamenti sono gestiti da Stripe. L&apos;autenticazione Google OAuth &egrave; gestita da Google. Nessun dato viene venduto a terzi.</p>
     <h2 className="text-lg font-bold text-zinc-100">I tuoi diritti</h2>
     <p>Puoi richiedere la cancellazione dei tuoi dati in qualsiasi momento scrivendoci a <span className="text-orange-600">info@stackup.it</span>.</p>
    </div>
   </div>
  </div>
 );
}

