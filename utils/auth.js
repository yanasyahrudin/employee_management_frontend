// Authentication utilities
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

export function useAuth() {
  const [token, setToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setToken(storedToken);
    setIsLoaded(true);
    
    if (!storedToken && router.pathname !== '/login') {
      router.replace('/login');
    }
  }, [router]);

  const handleAuthError = useCallback((error) => {
    if (error?.response?.status === 401) {
      if (typeof window !== 'undefined') localStorage.removeItem('token');
      router.replace('/login');
    }
  }, [router]);

  return { token, isLoaded, handleAuthError };
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