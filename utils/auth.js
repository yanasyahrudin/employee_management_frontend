// Authentication utilities
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

export function useAuth() {
  const [token, setToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isRedirecting) return;
    
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setToken(storedToken);
    
    const timeoutId = setTimeout(() => {
      setIsLoaded(true);
      
      if (!storedToken && router.pathname !== '/login') {
        setIsRedirecting(true);
        router.replace('/login').then(() => {
          setIsRedirecting(false);
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [router, isRedirecting]);

  const handleAuthError = useCallback((error) => {
    if (error?.response?.status === 401 && !isRedirecting) {
      setIsRedirecting(true);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      router.replace('/login').then(() => {
        setIsRedirecting(false);
      });
    }
  }, [router, isRedirecting]);

  return { token, isLoaded, handleAuthError, isRedirecting };
}

export function getStoredToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}