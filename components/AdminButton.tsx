// components/AdminButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AdminButton() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem("admin_authenticated") === "true";
      setIsAuthenticated(isAuth);
    };
    
    checkAuth();
  }, []);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      // Already logged in - go directly to dashboard
      router.push("/admin/dashboard");
    } else {
      // Not logged in - show login modal
      setShowLogin(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "barber2025";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      router.push("/admin/dashboard");
    } else {
      setError("Ungültige Anmeldedaten");
    }
  };

  const closeModal = () => {
    setShowLogin(false);
    setError("");
    setUsername("");
    setPassword("");
  };

  return (
    <>
      {/* Admin Button - Same size as Share Button */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleButtonClick}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-[#E8C7C3]/30 text-[#1E1E1E] hover:bg-[#E8C7C3] hover:text-white transition-all"
        aria-label="Admin"
      >
        <Shield size={22} />
      </motion.button>

      {/* Login Modal - Only shown when NOT logged in and button clicked */}
      <AnimatePresence>
        {showLogin && !isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border-2 border-[#E8C7C3]/30"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#1E1E1E]">Admin Login</h3>
                <button
                  onClick={closeModal}
                  className="rounded-full p-1 text-[#8A8A8A] hover:bg-[#F5EDEB] hover:text-[#1E1E1E] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#8A8A8A]">
                    Benutzername
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border-2 border-[#E8C7C3]/30 p-2 text-[#1E1E1E] focus:border-[#E8C7C3] focus:outline-none"
                    placeholder="admin"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[#8A8A8A]">
                    Passwort
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border-2 border-[#E8C7C3]/30 p-2 text-[#1E1E1E] focus:border-[#E8C7C3] focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-red-50 p-2 text-sm text-red-700 border border-red-200"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-lg bg-[#F5EDEB] px-4 py-2 text-sm font-semibold text-[#1E1E1E] hover:bg-[#E8C7C3] hover:text-white transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-gradient-to-r from-[#E8C7C3] to-[#D8B0AC] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    Anmelden
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center text-xs text-[#8A8A8A]">
                Standard: admin / barber2025
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}