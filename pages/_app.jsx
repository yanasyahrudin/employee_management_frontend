import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import ErrorBoundary from '../components/ErrorBoundary';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <ErrorBoundary>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>PT. Lyrid Prima Indonesia - Management System</title>
      </Head>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div 
          key={router.route}
          style={{ minHeight: '100vh' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>

      <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4aed88',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ff6b6b',
            },
          },
        }} 
      />
    </ErrorBoundary>
  );
}
