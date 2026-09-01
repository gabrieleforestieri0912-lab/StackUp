import type { AppProps } from "next/app";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { AuthProvider } from "../context/AuthContext";

import { Toaster } from "react-hot-toast";


const jetbrainsMono = JetBrains_Mono({
 variable: "--font-mono",
 subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

import { useRouter } from "next/router";

import SEO from "../components/ui/SEO";

export default function App({ Component, pageProps }: AppProps) {
 const router = useRouter();
 const noLayoutPages = ["/login", "/register", "/auth/callback"];
 const isNoLayoutPage = noLayoutPages.includes(router.pathname);

 return (
 <div className={`${jetbrainsMono.variable} flex flex-col min-h-screen bg-black text-zinc-100`}>
 <Analytics />
 <SpeedInsights />
 <AuthProvider>
 {!isNoLayoutPage && <Navbar />}
  <Toaster
    position="bottom-right"
    toastOptions={{
      style: {
        background: '#1a1a1a',
        color: '#e4e4e7',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: 600,
      },
      success: {
        iconTheme: { primary: '#f97316', secondary: '#1a1a1a' },
      },
    }}
  />
 <main className="flex-1">
 <Component {...pageProps} />
 </main>
 {!isNoLayoutPage && <Footer />}
 </AuthProvider>
 </div>
 );
}
