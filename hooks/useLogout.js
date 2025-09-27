import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const useLogout = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    if (isLoggingOut) return; 
    
    setIsLoggingOut(true);
    
    try {
      // Clear localStorage immediately
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.clear();
      }
      
      toast.success('Logout berhasil');
      
      await router.push('/login');
      
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Terjadi kesalahan saat logout');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
};

export default useLogout;