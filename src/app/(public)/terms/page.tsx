import type { Metadata } from 'next';

export const metadata: Metadata = {
 title: 'Termini e Condizioni',
 description: 'Termini e Condizioni di StackUp Academy',
};

export default function TermsPage() {
 return (
  <div className="min-h-screen bg-black pt-20 md:pt-24 pb-16">
   <div className="max-w-3xl mx-auto px-6">
    <h1 className="text-4xl font-jakarta font-black text-zinc-100 mb-8">Termini e Condizioni</h1>
    <p className="text-sm text-zinc-400 mb-8">Ultimo aggiornamento: Giugno 2026</p>
    <div className="prose prose-slate max-w-none space-y-6 text-zinc-400">
     <p>Benvenuto su StackUp Academy. Utilizzando la piattaforma accetti i seguenti termini.</p>
     <h2 className="text-lg font-bold text-zinc-100">Account</h2>
     <p>Sei responsabile della sicurezza delle tue credenziali. L&apos;account &egrave; personale e non cedibile.</p>
     <h2 className="text-lg font-bold text-zinc-100">Acquisti</h2>
     <p>I corsi acquistati rimangono accessibili a vita. I rimborsi sono gestiti caso per caso entro 14 giorni dall&apos;acquisto.</p>
     <h2 className="text-lg font-bold text-zinc-100">Servizi di coaching</h2>
     <p>Le sessioni di coaching devono essere prenotate con almeno 48 ore di anticipo. Le disdette entro 24 ore non danno diritto a recupero.</p>
     <h2 className="text-lg font-bold text-zinc-100">Propriet&agrave; intellettuale</h2>
     <p>Tutti i materiali didattici sono di propriet&agrave; di StackUp Academy. &Egrave; vietata la redistribuzione non autorizzata.</p>
     <h2 className="text-lg font-bold text-zinc-100">Contatti</h2>
     <p>Per qualsiasi questione legale, scrivi a <span className="text-orange-600">info@stackup.it</span>.</p>
    </div>
   </div>
  </div>
 );
}

