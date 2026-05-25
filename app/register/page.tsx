'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Brain, Sparkles, Shield, Eye, EyeOff, User, Mail, Lock, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function RegisterPage() {
  const router = useRouter();
  const { user, register } = useAuth();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Custom interactive eyes
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Status/Validation states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && user.id !== "student-guest") {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setValidationErrors({});

    const errors: typeof validationErrors = {};
    let hasError = false;

    // Validate Name
    if (!name.trim()) {
      errors.name = 'Nama lengkap wajib diisi.';
      hasError = true;
    }

    // Validate Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email akademis/pribadi wajib diisi.';
      hasError = true;
    } else if (!emailRegex.test(email)) {
      errors.email = 'Format email tidak valid (contoh: wirata@mahasiswa.undip.ac.id).';
      hasError = true;
    }

    // Validate Password
    if (!password) {
      errors.password = 'Password wajib dibuat.';
      hasError = true;
    } else if (password.length < 8) {
      errors.password = 'Sandi minimal harus diisi 8 karakter demi keamanan.';
      hasError = true;
    }

    // Confirm passwords
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Kata sandi konfirmasi tidak sesuai dengan password di atas.';
      hasError = true;
    }

    // Agreement compliance check
    if (!agreedToTerms) {
      errors.terms = 'Anda harus menyetujui Syarat & Ketentuan untuk membuat akun.';
      hasError = true;
    }

    if (hasError) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await register(email, name, password, semester);
      // Under the hood, context logs them in automatically and flags onboarding = false
      router.push('/onboarding');
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Registrasi gagal. Email mungkin sudah terdaftar.');
    }
  };

  return (
    <div id="register_screen" className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-calm-bg text-calm-text-primary selection:bg-calm-green/20">
      
      {/* Visual left panel for desktop screens ≥768px */}
      <div className="hidden md:flex flex-col justify-between bg-[#E8F4F0] p-12 lg:p-16 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-20 right-0 w-96 h-96 rounded-full bg-[#D1EAE2] blur-3xl opacity-80" />

        {/* Brand Link */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-calm-green-dark shadow-xs border border-white/40">
            <Brain className="w-5 h-5 fill-calm-green/25" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-calm-green-dark">MindMate AI</span>
        </div>

        {/* Informative Step Illustration Block */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="w-full max-w-[280px]"
          >
            <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-calm-green-dark/30">
              <rect x="35" y="25" width="130" height="90" rx="16" fill="white" fillOpacity="0.4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <rect x="55" y="45" width="90" height="8" rx="4" fill="currentColor" fillOpacity="0.6" />
              <rect x="55" y="61" width="60" height="8" rx="4" fill="currentColor" fillOpacity="0.3" />
              <rect x="55" y="77" width="75" height="8" rx="4" fill="currentColor" fillOpacity="0.3" />
              <circle cx="140" cy="115" r="18" fill="currentColor" fillOpacity="0.7" />
              <path d="M136 115L139 118L145 112" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          <span className="inline-block px-3 py-1 bg-[#DCEFEA] border border-calm-green/10 text-[10px] uppercase font-bold text-calm-green-dark rounded-full tracking-widest mt-4">
            Pendaftaran Gratis & Instan
          </span>
          <h2 className="text-xl lg:text-2xl font-display font-extrabold tracking-tight text-[#164436] mt-4 max-w-sm">
            Mulai kelola stress akademikmu bersama AI.
          </h2>
          <p className="text-xs text-[#2A6654] mt-2 max-w-xs leading-relaxed">
            Dapatkan rekomendasi mindfulness harian, bimbingan uraian tugas berdasar prioritas, dan ketenangan yang aman.
          </p>
        </div>

        {/* Helpful reassurance info footer */}
        <div className="relative z-10 p-5 bg-white/45 backdrop-blur-md rounded-2xl border border-white/30 text-left">
          <div className="flex gap-3 items-start">
            <Shield className="w-4 h-4 text-calm-green-dark shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-[#164436] uppercase tracking-wider font-mono">100% Bebas Biaya & Rahasia</h4>
              <p className="text-[11px] text-[#2A6654] leading-relaxed">
                Kami tidak menyimpan nama kampus Anda secara formal untuk dipublikasi. Hak privasi obrolan Anda dilingkari secara ketat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form column panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-white relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#E8F4F0]/30 blur-3xl" />
        </div>

        <div className="w-full max-w-md mx-auto space-y-7">
          
          {/* Form Title & Taglines */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="md:hidden w-12 h-12 bg-calm-green/20 rounded-2xl flex items-center justify-center text-calm-green-dark mb-4">
              <Brain className="w-6 h-6 fill-calm-green/45" />
            </div>
            
            <span className="text-[10px] font-bold text-calm-green-dark uppercase tracking-widest bg-calm-green/8 md:bg-transparent px-2.5 py-1 md:p-0 rounded-full">
              Langkah Pertama Ketenangan
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight mt-2 text-calm-text-primary">
              Registrasi MindMate
            </h1>
            <p className="text-xs sm:text-sm text-calm-text-secondary mt-1.5">
              Buat akun dengan mudah guna melacak catatan stress dan reframe jurnal emosi.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="p-4 bg-red-50 border border-red-100 text-red-850 text-xs rounded-2xl flex gap-2.5 items-center"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Tag & Input elements with accessibility labels */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on" noValidate>
            
            {/* Input Nama Lengkap */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-bold text-calm-text-secondary">
                Nama Lengkap
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-calm-text-secondary">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Contoh: Wirata Helmi"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationErrors.name) {
                      setValidationErrors(prev => ({ ...prev, name: undefined }));
                    }
                  }}
                  className={`w-full pl-11 pr-4 py-2.5 text-sm bg-calm-bg md:bg-white border rounded-2xl focus:outline-none focus:ring-4 focus:ring-calm-green/12 transition ${
                    validationErrors.name ? 'border-red-500 focus:border-red-500' : 'border-calm-border/90 focus:border-calm-green'
                  }`}
                  aria-invalid={validationErrors.name ? "true" : "false"}
                  aria-describedby={validationErrors.name ? "name-error" : undefined}
                />
              </div>
              {validationErrors.name && (
                <p id="name-error" className="text-[11px] text-red-500 font-semibold" role="alert">
                  ⚠ {validationErrors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-bold text-calm-text-secondary">
                Email Akademis (.ac.id) / Pribadi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-calm-text-secondary">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  placeholder="wirata@mahasiswa.undip.ac.id"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) {
                      setValidationErrors(prev => ({ ...prev, email: undefined }));
                    }
                  }}
                  className={`w-full pl-11 pr-4 py-2.5 text-sm bg-calm-bg md:bg-white border rounded-2xl focus:outline-none focus:ring-4 focus:ring-calm-green/12 transition ${
                    validationErrors.email ? 'border-red-500 focus:border-red-500' : 'border-calm-border/90 focus:border-calm-green'
                  }`}
                  aria-invalid={validationErrors.email ? "true" : "false"}
                  aria-describedby={validationErrors.email ? "email-error" : undefined}
                />
              </div>
              {validationErrors.email && (
                <p id="email-error" className="text-[11px] text-red-500 font-semibold" role="alert">
                  ⚠ {validationErrors.email}
                </p>
              )}
            </div>

            {/* Grid for Semester selection */}
            <div className="space-y-1">
              <label htmlFor="semester" className="block text-xs font-bold text-calm-text-secondary">
                Semester Berjalan / Jenjang
              </label>
              <select
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-calm-bg md:bg-white border border-calm-border/90 rounded-2xl focus:outline-none focus:ring-4 focus:ring-calm-green/12 transition cursor-pointer"
              >
                <option value="Semester 1">Semester 1 (Mahasiswa Baru)</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4 (Intermediate)</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8 (Tingkat Akhir)</option>
                <option value="Pascasarjana">Pascasarjana / Alumni</option>
              </select>
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-bold text-calm-text-secondary">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-calm-text-secondary">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  placeholder="Min. 8 karakter"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors(prev => ({ ...prev, password: undefined }));
                    }
                  }}
                  className={`w-full pl-11 pr-11 py-2.5 text-sm bg-calm-bg md:bg-white border rounded-2xl focus:outline-none focus:ring-4 focus:ring-calm-green/12 transition ${
                    validationErrors.password ? 'border-red-500 focus:border-red-500' : 'border-calm-border/90 focus:border-calm-green'
                  }`}
                  aria-invalid={validationErrors.password ? "true" : "false"}
                  aria-describedby={validationErrors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center px-1 text-gray-400 hover:text-gray-650 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {validationErrors.password && (
                <p id="password-error" className="text-[11px] text-red-500 font-semibold" role="alert">
                  ⚠ {validationErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password input */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-calm-text-secondary">
                Konfirmasi Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-calm-text-secondary">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  placeholder="Ketik ulan sandi baru"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword) {
                      setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  className={`w-full pl-11 pr-11 py-2.5 text-sm bg-calm-bg md:bg-white border rounded-2xl focus:outline-none focus:ring-4 focus:ring-calm-green/12 transition ${
                    validationErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-calm-border/90 focus:border-calm-green'
                  }`}
                  aria-invalid={validationErrors.confirmPassword ? "true" : "false"}
                  aria-describedby={validationErrors.confirmPassword ? "confirmPassword-error" : undefined}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center px-1 text-gray-400 hover:text-gray-650 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p id="confirmPassword-error" className="text-[11px] text-red-500 font-semibold" role="alert">
                  ⚠ {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Required Agreement Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={() => {
                    setAgreedToTerms(!agreedToTerms);
                    if (validationErrors.terms) {
                      setValidationErrors(prev => ({ ...prev, terms: undefined }));
                    }
                  }}
                  className="w-4.5 h-4.5 rounded-[6px] border-calm-border/80 text-calm-green cursor-pointer mt-0.5"
                />
                <span className="text-[11px] text-calm-text-secondary leading-normal">
                  Saya menyetujui seluruh{' '}
                  <span 
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/syarat-ketentuan');
                    }}
                    className="font-bold underline text-calm-green-dark hover:text-calm-green"
                  >
                    Syarat & Ketentuan
                  </span>{' '}
                  dan{' '}
                  <span 
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/kebijakan-privasi');
                    }}
                    className="font-bold underline text-calm-green-dark hover:text-calm-green"
                  >
                    Kebijakan Privasi
                  </span>{' '}
                  MindMate AI.
                </span>
              </label>
              {validationErrors.terms && (
                <p className="text-[10px] text-red-500 font-semibold mt-1" role="alert">
                  ⚠ {validationErrors.terms}
                </p>
              )}
            </div>

            {/* Submit Register */}
            <button
              id="btn_submit_register"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-calm-green hover:bg-calm-green-dark text-white font-bold rounded-2xl text-sm transition shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              aria-busy={loading ? "true" : "false"}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Mempersiapkan Akun...</span>
                </>
              ) : (
                <>
                  <span>Buat Akun dan Mulai</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom redirection back to login */}
          <div className="text-center pt-2">
            <p className="text-xs text-calm-text-secondary">
              Sudah punya akun akademis?{' '}
              <span 
                onClick={() => router.push('/login')} 
                className="text-calm-green-dark hover:text-calm-green font-bold underline cursor-pointer transition-colors"
              >
                Masuk di sini
              </span>
            </p>
          </div>

          {/* Safe Privacy Note */}
          <div className="flex items-center gap-1.5 justify-center text-[10px] text-calm-text-secondary select-none">
            <Shield className="w-3.5 h-3.5 text-calm-green" />
            <span>Konektivitas dienkripsi 256-bit SSL untuk kenyamanan Anda.</span>
          </div>

        </div>
      </div>

    </div>
  );
}
