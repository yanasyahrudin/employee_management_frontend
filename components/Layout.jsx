import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingActionButton from "./FloatingActionButton";
import { useLogout } from "../hooks/useLogout";
import {
  FaUsers,
  FaUserTie,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";

export default function Layout({ children }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const { logout, isLoggingOut } = useLogout();

  useEffect(() => {
    // This only runs on client-side after hydration
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setIsLoaded(true);
  }, []);

  const handleLogout = () => {
    setToken(null); 
    logout(); 
  };

  return (
    <>
      <motion.nav
        className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/" className="navbar-brand">
              PT. Lyrid Prima Indonesia
            </Link>
          </motion.div>
          {/* Mobile toggler */}
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setNavOpen((s) => !s)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <AnimatePresence>
            <motion.div
              className={`collapse navbar-collapse ${navOpen ? "show" : ""}`}
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="navbar-nav me-auto">
                {isLoaded && token && (
                  <>
                    <motion.li
                      className="nav-item"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <Link href="/users" className="nav-link">
                        <FaUsers className="me-1" /> Users
                      </Link>
                    </motion.li>
                    <motion.li
                      className="nav-item"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <Link href="/employees" className="nav-link">
                        <FaUserTie className="me-1" /> Employees
                      </Link>
                    </motion.li>
                  </>
                )}
              </ul>
              <ul className="navbar-nav ms-auto">
                {isLoaded && (
                  <motion.li
                    className="nav-item"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    {token ? (
                      <motion.button
                        className="btn btn-sm btn-outline-light"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        whileHover={{ scale: isLoggingOut ? 1 : 1.05 }}
                        whileTap={{ scale: isLoggingOut ? 1 : 0.95 }}
                      >
                        {isLoggingOut ? (
                          <motion.span
                            className="d-flex align-items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="spinner-border spinner-border-sm me-1"
                              style={{ width: "12px", height: "12px" }}
                            />
                            Logging out...
                          </motion.span>
                        ) : (
                          <>
                            <FaSignOutAlt className="me-1" /> Logout
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <Link href="/login" className="nav-link">
                        <FaSignInAlt className="me-1" /> Login
                      </Link>
                    )}
                  </motion.li>
                )}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.nav>

      <motion.div
        className="container mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {children}
      </motion.div>

      <FloatingActionButton />
    </>
  );
}
