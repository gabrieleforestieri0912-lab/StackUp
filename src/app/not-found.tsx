import Link from 'next/link';

export default function NotFound() {
 return (
  <main className="min-h-screen flex items-center justify-center bg-black px-6">
   <div className="text-center max-w-md">
    <h1 className="text-6xl font-extrabold text-orange-500 mb-4">404</h1>
    <p className="text-xl text-zinc-300 mb-2 font-bold">Pagina non trovata</p>
    <p className="text-sm text-zinc-400 mb-8">
     La pagina che stai cercando non esiste o è stata spostata.
    </p>
    <Link
     href="/"
     className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-zinc-100 rounded-xl font-bold hover:bg-orange-600 hover:text-white transition-all shadow-lg"
    >
     Torna alla home
    </Link>
   </div>
  </main>
 );
}

