import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getStoredToken } from '../utils/auth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);
  
  useEffect(() => {
    const handleRedirect = () => {
      try {
        const token = getStoredToken();
        if (token) {
          router.replace('/users');
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Redirect error:', error);
        router.replace('/login');
      }
    };

    // Small delay to ensure proper state management
    const timer = setTimeout(handleRedirect, 100);
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <LoadingSpinner text="Redirecting..." />
    </div>
  );
}
