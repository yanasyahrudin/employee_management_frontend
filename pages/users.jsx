import Layout from '../components/Layout';
import React, { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../lib/api';
import { useAuth } from '../utils/auth';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FaUsers, 
  FaUserPlus, 
  FaUser, 
  FaLock, 
  FaIdCard,
  FaCalendarAlt,
  FaUserTag
} from 'react-icons/fa';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', fullname: '' });
  const [submitting, setSubmitting] = useState(false);
  const { token, isLoaded, handleAuthError, isRedirecting } = useAuth();

  // Fetch users when token is available (useCallback to satisfy hook deps)
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await apiClient(token).get('/users');
      setUsers(data);
    } catch (e) {
      console.error(e);
      handleAuthError(e);
    } finally {
      setLoading(false);
    }
  }, [token, handleAuthError]);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, fetchUsers]);

  // Show loading spinner while redirecting or not loaded
  if (isRedirecting || !isLoaded) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  async function createUser(e) {
    e.preventDefault();
    if (!token) return;
    
    if (!form.username.trim()) {
      toast.warning('Username tidak boleh kosong');
      return;
    }
    if (!form.password.trim()) {
      toast.warning('Password tidak boleh kosong');
      return;
    }
    if (form.password.length < 6) {
      toast.warning('Password minimal 6 karakter');
      return;
    }
    
    setSubmitting(true);
    try {
      await apiClient(token).post('/users', form);
      toast.success('User berhasil ditambahkan!');
      setForm({ username: '', password: '', fullname: '' });
      fetchUsers();
    } catch (e) { 
      console.error(e);
      const errorMessage = e.response?.data?.error || e.message;
      toast.error('Gagal menambahkan user: ' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <motion.div 
        className="d-flex justify-content-between align-items-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Manajemen User
        </motion.h3>
        <motion.span 
          className="badge bg-info fs-6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
        >
          <FaUsers className="me-1" />
          Total: {users.length} Users
        </motion.span>
      </motion.div>

      <motion.div 
        className="card mb-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
      >
        <motion.div 
          className="card-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h5 className="mb-0">
            <FaUserPlus className="me-2" /> Tambah User Baru
          </h5>
        </motion.div>
        <motion.div 
          className="card-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <motion.form 
            className="row g-2" 
            onSubmit={createUser}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div 
              className="col-md-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <motion.div className="input-group">
                <span className="input-group-text">
                  <FaUser />
                </span>
                <motion.input 
                  placeholder="Username" 
                  className="form-control" 
                  value={form.username} 
                  onChange={e=>setForm({...form, username:e.target.value.toLowerCase().trim()})} 
                  required 
                  minLength={3}
                  maxLength={50}
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(25, 135, 84, 0.25)" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
              <small className="text-muted">Min 3 karakter</small>
            </motion.div>
            <motion.div 
              className="col-md-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <motion.div className="input-group">
                <span className="input-group-text">
                  <FaLock />
                </span>
                <motion.input 
                  placeholder="Password" 
                  type="password" 
                  className="form-control" 
                  value={form.password} 
                  onChange={e=>setForm({...form, password:e.target.value})} 
                  required 
                  minLength={6}
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(25, 135, 84, 0.25)" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
              <small className="text-muted">Minimal 6 karakter</small>
            </motion.div>
            <motion.div 
              className="col-md-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <motion.div className="input-group">
                <span className="input-group-text">
                  <FaIdCard />
                </span>
                <motion.input 
                  placeholder="Nama Lengkap (Opsional)" 
                  className="form-control" 
                  value={form.fullname} 
                  onChange={e=>setForm({...form, fullname:e.target.value})} 
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(25, 135, 84, 0.25)" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </motion.div>
            <motion.div 
              className="col-md-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <motion.button 
                className="btn btn-success w-100" 
                type="submit" 
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.05 }}
                whileTap={{ scale: submitting ? 1 : 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {submitting ? (
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
                    Adding...
                  </motion.span>
                ) : (
                  <>
                    <FaUserPlus className="me-1" /> Tambah User
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
      >
        <div className="card-body">
          {loading ? (
            <LoadingSpinner text="Memuat data users..." />
          ) : (
            <motion.div 
              className="table-responsive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <table className="table table-striped">
                <motion.thead 
                  className="table-dark"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <tr>
                    <th>#</th>
                    <th><FaUser className="me-1" />Username</th>
                    <th><FaIdCard className="me-1" />Fullname</th>
                    <th><FaUserTag className="me-1" />Role</th>
                    <th><FaCalendarAlt className="me-1" />Created</th>
                  </tr>
                </motion.thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((u, index) => (
                      <motion.tr 
                        key={u.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      >
                        <td>{u.id}</td>
                        <td>{u.username}</td>
                        <td>{u.fullname || '-'}</td>
                        <td>
                          <motion.span 
                            className="badge bg-primary"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 * index }}
                          >
                            {u.role}
                          </motion.span>
                        </td>
                        <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
