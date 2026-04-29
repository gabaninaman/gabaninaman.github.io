import Head from "next/head";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import Analytics from "../components/Analytics";
import { registerServiceWorker } from "../lib/utils/serviceWorker";

function MyApp({ Component, pageProps }) {
  // Register service worker on mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    }
  }, []);

  return (
    <>
      <Head>
        {/* Essential Meta Tags */}
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Favicon & App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme Color for browsers */}
        <meta name="theme-color" content="#030712" />
        <meta name="msapplication-TileColor" content="#030712" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://linkedin.com" />

        {/* Preload critical images */}
        <link rel="preload" as="image" href="/gabaninaman.jpg" />

        {/* Preload critical fonts if using web fonts */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <Analytics gaId="G-PGHBTZGRC6" />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
