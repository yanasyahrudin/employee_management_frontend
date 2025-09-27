import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiClient } from '../lib/api';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import RequiredFieldIndicator from '../components/RequiredFieldIndicator';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setError(null);
    
    const timeoutId = setTimeout(() => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        setIsLoading(true);
        router.replace('/users').finally(() => {
          setIsLoading(false);
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await apiClient().post('/auth/login', { username, password });
      
      // Store auth data
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      toast.success('Login berhasil');
      
      setTimeout(async () => {
        await router.push('/users');
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }, 500);
      
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.error || err.message || 'Login gagal. Silakan coba lagi.';
      setError(message);
      toast.error(message);
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <motion.div 
        className="row justify-content-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="col-lg-5 col-md-7">
          <motion.div 
            className="card shadow-sm"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            <motion.div 
              className="card-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h5 className="mb-0">Login</h5>
            </motion.div>
            <div className="card-body">
              <motion.p 
                className="text-muted small"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Silakan masuk menggunakan akun Anda.
              </motion.p>

              <motion.form 
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.div 
                  className="mb-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <label className="form-label">
                    <FaUser className="me-1" /> Username
                    <RequiredFieldIndicator />
                  </label>
                  <motion.input 
                    className="form-control" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    required 
                    placeholder="Enter your username"
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(13, 110, 253, 0.25)" }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.div 
                  className="mb-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <label className="form-label">
                    <FaLock className="me-1" /> Password
                    <RequiredFieldIndicator />
                  </label>
                  <motion.input 
                    type="password" 
                    className="form-control" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    placeholder="Enter your password"
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(13, 110, 253, 0.25)" }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.div 
                  className="d-grid"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <motion.button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isLoading ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Logging in...
                      </motion.span>
                    ) : (
                      <>
                        <FaSignInAlt className="me-1" /> Login
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>

              {error && (
                <motion.div 
                  className="alert alert-danger mt-3" 
                  role="alert"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}
