import Layout from '../components/Layout';
import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../lib/api';
import { useAuth } from '../utils/auth';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FaUsers, 
  FaSearchPlus, 
  FaUserCircle, 
  FaEdit, 
  FaTrash, 
  FaUser, 
  FaTimes, 
  FaDownload,
  FaUserTie,
  FaUserPlus,
  FaBriefcase,
  FaImage,
  FaIdCard,
  FaCalendarAlt
} from 'react-icons/fa';

export default function Employees() {
  const [emps, setEmps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', position: '', photo: null });
  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState({ src: '', name: '', position: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState(null);
  const { token, isLoaded, handleAuthError, isRedirecting } = useAuth();

  const fetchEmps = useCallback(async () => {
    if (!token) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiClient(token).get('/employees');
      setEmps(data);
    } catch (e) {
      console.error(e);
      handleAuthError(e);
    } finally {
      setLoading(false);
    }
  }, [token, handleAuthError]);

  useEffect(() => {
    if (token) {
      fetchEmps();
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [token, fetchEmps, isLoaded]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; 
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

 
  if (isRedirecting || !isLoaded) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  function onFile(e) {
    const f = e.target.files[0];
    setForm({ ...form, photo: f });
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function submit(e) {
    e.preventDefault();
    if (!token) return;
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('position', form.position);
      if (form.photo) fd.append('photo', form.photo);

      if (editMode) {
        await apiClient(token).put(`/employees/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success(`Karyawan "${form.name}" berhasil diupdate!`);
      } else {
        await apiClient(token).post('/employees', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success(`Karyawan "${form.name}" berhasil ditambahkan!`);
      }

      resetForm();
      fetchEmps();
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.error || e.message);
    }
  }

  function resetForm() {
    setForm({ name: '', position: '', photo: null });
    setPreview(null);
    setEditMode(false);
    setEditId(null);
  }

  function editEmployee(emp) {
    setForm({ name: emp.name, position: emp.position, photo: null });
    setPreview(emp.photo ? process.env.NEXT_PUBLIC_API_BASE?.replace('/api', '') + emp.photo : null);
    setEditMode(true);
    setEditId(emp.id);
  }

  function cancelEdit() {
    resetForm();
  }

  function showImageModal(employee) {
    setModalImage({
      src: process.env.NEXT_PUBLIC_API_BASE?.replace('/api', '') + employee.photo,
      name: employee.name,
      position: employee.position,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setModalImage({ src: '', name: '', position: '' });
  }

  async function del(id) {
    const employee = emps.find((e) => e.id === id);
    // open confirm modal
    setConfirmTargetId(id);
    setShowConfirm(true);
  }

  async function confirmDelete() {
    const id = confirmTargetId;
    setShowConfirm(false);
    if (!id) return;
    if (!token) return;
    const employee = emps.find((e) => e.id === id);
    try {
      await apiClient(token).delete('/employees/' + id);
      toast.success(`Karyawan "${employee?.name}" berhasil dihapus.`);
      fetchEmps();
    } catch (e) {
      console.error(e);
      toast.error('Gagal menghapus karyawan: ' + (e.response?.data?.error || e.message));
    }
  }

  if (!isLoaded) {
    return (
      <Layout>
        <LoadingSpinner text="Memuat halaman karyawan..." />
      </Layout>
    );
  }

  const confirmEmployee = confirmTargetId ? emps.find((e) => e.id === confirmTargetId) : null;

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
          Manajemen Pegawai
        </motion.h3>
        <motion.span 
          className="badge bg-info fs-6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
        >
          <FaUserTie className="me-1" />
          Total: {emps.length} Karyawan
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
          <AnimatePresence mode="wait">
            <motion.h5 
              key={editMode ? 'edit' : 'add'}
              className="mb-0"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {editMode ? (
                <><FaEdit className="me-2" />Edit Pegawai - {form.name}</>
              ) : (
                <><FaUserPlus className="me-2" />Tambah Pegawai Baru</>
              )}
            </motion.h5>
          </AnimatePresence>
        </motion.div>
        <motion.div 
          className="card-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <motion.form 
            onSubmit={submit} 
            className="row g-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div 
              className="col-md-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <motion.div className="input-group">
                <span className="input-group-text">
                  <FaUser />
                </span>
                <motion.input 
                  className="form-control" 
                  placeholder="Nama" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  required 
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(13, 110, 253, 0.25)" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </motion.div>
            <motion.div 
              className="col-md-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <motion.div className="input-group">
                <span className="input-group-text">
                  <FaBriefcase />
                </span>
                <motion.input 
                  className="form-control" 
                  placeholder="Jabatan" 
                  value={form.position} 
                  onChange={(e) => setForm({ ...form, position: e.target.value })} 
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(13, 110, 253, 0.25)" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </motion.div>
            <motion.div 
              className="col-md-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <motion.div className="input-group">
                <span className="input-group-text">
                  <FaImage />
                </span>
                <motion.input 
                  type="file" 
                  accept=".jpg,.jpeg" 
                  className="form-control" 
                  onChange={onFile} 
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(13, 110, 253, 0.25)" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
              <small className="text-muted">{editMode ? 'Kosongkan jika tidak ingin mengubah foto' : 'Format: JPG, JPEG (maks 300KB)'}</small>
            </motion.div>
            <motion.div 
              className="col-md-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <motion.button 
                className="btn btn-primary w-100" 
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {editMode ? 'Update' : 'Simpan'}
              </motion.button>
              <AnimatePresence>
                {editMode && (
                  <motion.button 
                    type="button" 
                    className="btn btn-secondary w-100 mt-1" 
                    onClick={cancelEdit}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Batal
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {preview && (
                <motion.div 
                  className="col-12 mt-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div 
                    style={{ maxWidth: '150px', borderRadius: '8px', overflow: 'hidden' }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img className="preview-img" src={preview} alt="preview" style={{ width: '150px', height: 'auto', display: 'block' }} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
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
            <LoadingSpinner text="Memuat data karyawan..." />
          ) : emps.length === 0 ? (
            <motion.div 
              className="text-center py-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-muted">
                <motion.div 
                  style={{ fontSize: '3rem', marginBottom: '1rem' }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <FaUsers />
                </motion.div>
                <motion.h5
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Belum ada data karyawan
                </motion.h5>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Silakan tambahkan karyawan baru menggunakan form di atas
                </motion.p>
              </div>
            </motion.div>
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
                    <th><FaUser className="me-1" />Nama</th>
                    <th><FaBriefcase className="me-1" />Jabatan</th>
                    <th><FaImage className="me-1" />Foto</th>
                    <th>Aksi</th>
                  </tr>
                </motion.thead>

                <tbody>
                  <AnimatePresence>
                    {emps.map((e, index) => (
                      <motion.tr 
                        key={e.id} 
                        className={editMode && editId === e.id ? 'editing-row' : ''}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      >
                        <td>
                          <motion.span 
                            className="badge bg-secondary"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 * index }}
                          >
                            {e.id}
                          </motion.span>
                        </td>

                        <td>
                          <motion.strong
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 * index }}
                          >
                            {e.name}
                          </motion.strong>
                        </td>

                        <td>
                          <motion.span 
                            className="badge bg-primary"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 * index }}
                          >
                            {e.position || 'Tidak Ada Jabatan'}
                          </motion.span>
                        </td>

                        <td>
                          {e.photo ? (
                            <motion.div 
                              className="position-relative photo-container"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: 0.2 * index }}
                              whileHover={{ scale: 1.1 }}
                            >
                              <img src={process.env.NEXT_PUBLIC_API_BASE?.replace('/api', '') + e.photo} className="preview-img clickable-photo" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }} alt={e.name} onClick={() => showImageModal(e)} />

                              {/* Hover Preview - Large tooltip */}
                              <img src={process.env.NEXT_PUBLIC_API_BASE?.replace('/api', '') + e.photo} className="large-photo-preview" alt={`${e.name} - Preview`} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />

                              <div className="photo-overlay">
                                <FaSearchPlus />
                              </div>
                            </motion.div>
                          ) : (
                            <motion.span 
                              className="text-muted"
                              initial={{ opacity: 0, rotate: -180 }}
                              animate={{ opacity: 1, rotate: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 * index }}
                              style={{ fontSize: '2rem' }}
                            >
                              <FaUserCircle />
                            </motion.span>
                          )}
                        </td>

                        <td>
                          <motion.div 
                            className="btn-group" 
                            role="group"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 * index }}
                          >
                            <motion.button 
                              className="btn btn-sm btn-warning" 
                              onClick={() => editEmployee(e)} 
                              disabled={editMode && editId === e.id} 
                              title="Edit karyawan"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FaEdit className="me-1" /> {editMode && editId === e.id ? 'Editing...' : 'Edit'}
                            </motion.button>

                            <motion.button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => del(e.id)} 
                              disabled={editMode} 
                              title="Hapus karyawan"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FaTrash className="me-1" /> Hapus
                            </motion.button>
                          </motion.div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>

              </table>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Modal for Image Preview */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal fade show" 
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.8)' }} 
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="modal-dialog modal-lg modal-dialog-centered"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="modal-content" 
                onClick={(e) => e.stopPropagation()}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="modal-header"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h5 className="modal-title">
                    <FaUser className="me-2" /> {modalImage.name}
                  </h5>
                  <motion.button 
                    type="button" 
                    className="btn-close" 
                    onClick={closeModal} 
                    aria-label="Close" 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </motion.div>
                <motion.div 
                  className="modal-body text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <motion.div 
                    className="mb-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3, type: "spring" }}
                  >
                    <span className="badge bg-primary fs-6">{modalImage.position}</span>
                  </motion.div>
                  <motion.div 
                    className="position-relative d-inline-block"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div style={{ display: 'inline-block', maxHeight: '70vh' }}>
                      <img src={modalImage.src} alt={modalImage.name} className="img-fluid rounded shadow modal-image" style={{ objectFit: 'contain', maxHeight: '70vh' }} />
                    </div>
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="modal-footer"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <motion.button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={closeModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTimes className="me-1" /> Tutup
                  </motion.button>
                  <motion.a 
                    href={modalImage.src} 
                    download={`${modalImage.name}_photo.jpg`} 
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaDownload className="me-1" /> Download
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm delete modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            className="modal fade show" 
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)' }} 
            onClick={() => setShowConfirm(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="modal-dialog modal-sm modal-dialog-centered"
              initial={{ scale: 0.7, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="modal-content" 
                onClick={(e) => e.stopPropagation()}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="modal-header"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h5 className="modal-title">Konfirmasi Hapus</h5>
                  <motion.button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowConfirm(false)} 
                    aria-label="Close" 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </motion.div>
                <motion.div 
                  className="modal-body"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <p>
                    Apakah Anda yakin ingin menghapus karyawan <strong>{confirmEmployee?.name || 'ini'}</strong>?
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </motion.div>
                <motion.div 
                  className="modal-footer"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <motion.button 
                    className="btn btn-secondary" 
                    onClick={() => setShowConfirm(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Batal
                  </motion.button>
                  <motion.button 
                    className="btn btn-danger" 
                    onClick={confirmDelete}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Hapus
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
