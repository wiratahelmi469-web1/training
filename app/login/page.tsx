'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Brain, Sparkles, Shield, Eye, EyeOff, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, guestMode } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status and Validation states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Rate limiting UI states
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Toast from password reset redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('reset') === 'success') {
        setTimeout(() => {
          setSuccessMsg('Password berhasil diubah. Silakan masuk dengan kata sandi baru Anda.');
        }, 0);
      }
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setFailedAttempts(0); // Reset lock
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  // Handle auto-redirect if logged in
  useEffect(() => {
    if (user && user.id !== "student-guest") {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setEmailError('');
    setPasswordError('');

    // Check rate limiting lockout
    if (lockoutTime > 0) {
      setErrorMsg(`Sistem mengunci sementara. Tunggu ${lockoutTime} detik lagi sebelum mencoba.`);
      return;
    }

    // Rule 2: Front-end input validations
    let hasValidationError = false;

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email harus diisi.');
      hasValidationError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError('Format email tidak valid (contoh: nama@univ.ac.id atau nama@gmail.com).');
      hasValidationError = true;
    }

    // Password length validation
    if (!password) {
      setPasswordError('Password harus diisi.');
      hasValidationError = true;
    } else if (password.length < 8) {
      setPasswordError('Sandi minimal diisi 8 karakter demi keamanan data.');
      hasValidationError = true;
    }

    if (hasValidationError) return;

    setLoading(true);

    try {
      await login(email, password);
      setSuccessMsg('Sesi terverifikasi! Mengarahkan Anda ke dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err: any) {
      setLoading(false);
      const nextFailCount = failedAttempts + 1;
      setFailedAttempts(nextFailCount);

      // Handle Fail triggers & rate limiting
      if (nextFailCount >= 5) {
        setLockoutTime(30);
        setErrorMsg('Terlalu banyak percobaan gagal. Silakan tunggu 30 detik sebelum mencoba kembali.');
      } else {
        setErrorMsg(err.message || 'Email atau password salah. Coba lagi.');
      }
    }
  };

  // Google Sign-In Simulation
  const handleGoogleMock = () => {
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmail('wiratahelmi469@gmail.com');
      setPassword('password123');
      setErrorMsg('Simulasi Masuk Google sukses! Kredensial dimasukkan. Silakan pelatuk tombol "Masuk" di bawah.');
    }, 800);
  };

  // Guest simulation flow
  const handleGuest = () => {
    setErrorMsg('');
    guestMode();
    router.push('/onboarding');
  };

  return (
    <div id="login_screen" className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-calm-bg text-calm-text-primary selection:bg-calm-green/20">
      
      {/* 🟡 4. REDESAIN VISUAL - PANEL KIRI (Desktop Only - Sage Green Theme) */}
      <div className="hidden md:flex flex-col justify-between bg-[#E8F4F0] p-12 lg:p-16 relative overflow-hidden">
        {/* Serene organic background glow */}
        <div className="absolute -top-10 -left-10 w-80 h-80 rounded-full bg-white/20 blur-3.5xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#D1EAE2] blur-3xl" />

        {/* Logo and App name */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-calm-green-dark shadow-xs border border-white/40">
            <Brain className="w-5 h-5 fill-calm-green/25" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-calm-green-dark">MindMate AI</span>
        </div>

        {/* Floating Serene SVG Cloud/Wind Illustration */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full max-w-[280px]"
          >
            <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-calm-green-dark/40 drop-shadow-sm">
              <path d="M50 100C35 100 20 88 20 70C20 52 35 40 50 40C52 40 54 40.2 56 40.5C64 25 80 15 100 15C125 15 145 33 149 57C152 56 156 55.5 160 55.5C180 55.5 195 70.5 195 90C195 109.5 180 125 160 125L50 125" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 6" />
              <path d="M45 75C40 75 35 78 35 84C35 90 40 93 45 93" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="95" cy="70" r="1.5" fill="currentColor" />
              <circle cx="115" cy="74" r="2.5" fill="currentColor" />
              <path d="M70 115C85 115 130 115 140 115" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>

          <span className="inline-block px-3 py-1 bg-[#DCEFEA] border border-calm-green/10 text-[10px] uppercase font-bold text-calm-green-dark rounded-full tracking-widest mt-4">
            Mental Health Assistant
          </span>
          <h2 className="text-xl lg:text-2xl font-display font-extrabold tracking-tight text-[#164436] mt-4 max-w-sm">
            Selamat kembali. Ruang amanmu menunggumu.
          </h2>
          <p className="text-xs text-[#2A6654] mt-2 max-w-xs leading-relaxed">
            Menemani perjalanan perkuliahanmu dengan bimbingan stress, pernapasan, dan refleksi jurnal harian.
          </p>
        </div>

        {/* Left Side Quote block */}
        <div className="relative z-10 p-5 bg-white/45 backdrop-blur-md rounded-2xl border border-white/30 text-left">
          <p className="text-xs text-[#164436] font-medium leading-relaxed italic">
            &ldquo;Kamu tidak sendirian. Setiap tugas berat yang menghadang bisa kita lalui bersama-sama secara perlahan.&rdquo;
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-calm-green" />
            <span className="text-[10px] font-bold text-calm-green-dark uppercase tracking-wider font-mono">MindMate Teman Tenangmu</span>
          </div>
        </div>
      </div>

      {/* Panel Kanan (Clean Form Area with High Contrast & Accessibilty Labels) */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-white relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E8F4F0]/30 blur-3xl" />
        </div>

        <div className="w-full max-w-md mx-auto space-y-8">
          
          {/* Mobile visible logo header */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="md:hidden w-12 h-12 bg-calm-green/20 rounded-2xl flex items-center justify-center text-calm-green-dark mb-4">
              <Brain className="w-6 h-6 fill-calm-green/45" />
            </div>
            
            <span className="text-[10px] font-bold text-calm-green-dark uppercase tracking-widest bg-calm-green/8 md:bg-transparent px-2.5 py-1 md:p-0 rounded-full">
              Pintu Masuk Terenkripsi
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight mt-2 text-calm-text-primary">
              Masuk Akun Mahasiswa
            </h1>
            <p className="text-xs sm:text-sm text-calm-text-secondary mt-1.5">
              Silakan masuk untuk melanjutkan obrolan kedamaian pikiran Anda.
            </p>
          </div>

          {/* Animate status messages */}
          <AnimatePresence mode="wait">
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-2xl flex gap-2.5 items-center"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="p-4 bg-red-50 border border-red-100 text-red-800 text-xs rounded-2xl flex gap-2.5 items-start"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🔴 Form Login - Tag Keamanan HTML (Aksesibilitas Tinggi) */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on" noValidate>
            
            {/* 🟡 5. AKSESIBILITAS - EMAIL INPUT */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-bold text-calm-text-secondary">
                Email Universitas / Pribadi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-calm-text-secondary pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  placeholder="wirata@emailmahasiswa.ac.id"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if(emailError) setEmailError('');
                  }}
                  className={`w-full pl-11 pr-4 py-3 text-sm bg-calm-bg md:bg-white border rounded-2xl focus:outline-none focus:ring-4 focus:ring-calm-green/12 transition ${
                    emailError ? 'border-red-500 focus:border-red-500' : 'border-calm-border/90 focus:border-calm-green'
                  }`}
                  aria-describedby={emailError ? "email-error" : "email-hint"}
                  aria-invalid={emailError ? "true" : "false"}
                />
              </div>
              {emailError ? (
                <p id="email-error" className="text-[11px] text-red-500 font-semibold flex items-center gap-1" role="alert">
                  <span className="text-red-600">⚠</span> {emailError}
                </p>
              ) : (
                <p id="email-hint" className="text-[10px] text-calm-text-secondary">
                  Gunakan email kampus (.ac.id) atau email umum terdaftar Anda.
                </p>
              )}
            </div>

            {/* 🟡 5. AKSESIBILITAS - PASSWORD INPUT */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <label htmlFor="password" className="text-calm-text-secondary">Password Akun</label>
                <span 
                  onClick={() => router.push('/forgot-password')}
                  className="text-calm-green-dark hover:text-calm-green transition-colors cursor-pointer underline text-[11px]"
                >
                  Lupa password?
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-calm-text-secondary pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  minLength={8}
                  required
                  placeholder="Ketik password Anda"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if(passwordError) setPasswordError('');
                  }}
                  className={`w-full pl-11 pr-11 py-3 text-sm bg-calm-bg md:bg-white border rounded-2xl focus:outline-none focus:ring-4 focus:ring-calm-green/12 transition ${
                    passwordError ? 'border-red-500 focus:border-red-500' : 'border-calm-border/90 focus:border-calm-green'
                  }`}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  aria-invalid={passwordError ? "true" : "false"}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-650 cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan password" : "Tunjukkan password"}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="text-[11px] text-red-500 font-semibold flex items-center gap-1" role="alert">
                  <span>⚠</span> {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me Input */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4.5 h-4.5 rounded-[6px] border-calm-border/80 text-calm-green focus:ring-0 focus:outline-none cursor-pointer"
                />
                <span className="text-xs font-semibold text-calm-text-secondary">Ingat saya untuk 30 hari</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="btn_submit_login"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-calm-green hover:bg-calm-green-dark text-white font-bold rounded-2xl text-sm transition shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
              aria-busy={loading ? "true" : "false"}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk Sesi Sekarang</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Separator / Atas list */}
          <div className="relative my-6 pb-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-calm-border/60" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-calm-text-secondary select-none font-medium">Atau dengan opsi lain</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Google Signup simulation button */}
            <button
              id="btn_google_sign"
              type="button"
              onClick={handleGoogleMock}
              className="w-full py-3 px-4 bg-white hover:bg-calm-bg active:scale-99 border border-calm-border text-calm-text-primary text-xs font-bold rounded-2xl transition flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.78 0 3.32.67 4.5 1.77l2.454-2.454C17.636 1.845 15.11 1 12.24 1 6.584 1 2 5.584 2 11.24s4.584 10.24 10.24 10.24c5.795 0 10.24-4.065 10.24-10.24 0-.693-.08-1.36-.227-1.955H12.24z"/>
              </svg>
              <span>Masuk dengan Google</span>
            </button>

            {/* 🟡 8. INTERACTIVE GUEST MODE (Opsi Masuk Anonim Sementara) */}
            <button
              id="btn_guest_access"
              type="button"
              onClick={handleGuest}
              className="w-full py-3 px-4 bg-white hover:bg-emerald-50/40 hover:border-emerald-200 border border-dashed border-calm-border text-xs text-calm-text-primary font-semibold rounded-2xl transition flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-calm-green-dark">
                <span>Lanjutkan Sementara Tanpa Akun (Mode Anonim)</span>
              </div>
              <span className="text-[9px] text-calm-text-secondary font-mono mt-0.5">Mode tamu: akses Breathwork & Curhat tanpa riwayat tersimpan</span>
            </button>
          </div>

          {/* Navigation link to registration */}
          <div className="text-center pt-2">
            <p className="text-xs text-calm-text-secondary">
              Belum punya akun?{' '}
              <span 
                onClick={() => router.push('/register')} 
                className="text-calm-green-dark hover:text-calm-green font-bold underline cursor-pointer transition-colors"
              >
                Daftar gratis →
              </span>
            </p>
          </div>

          {/* 🔴 6. DOKUMEN LEGAL & STATEMENT PRIVASI */}
          <div className="pt-4 border-t border-calm-border/40 text-center space-y-2 select-none">
            <p className="text-[10px] sm:text-[11px] text-calm-text-secondary shrink-0 max-w-sm mx-auto leading-normal">
              Dengan masuk, kamu menyetujui{' '}
              <span 
                onClick={() => router.push('/syarat-ketentuan')}
                className="font-bold underline text-calm-green-dark hover:text-calm-green cursor-pointer"
              >
                Syarat & Ketentuan
              </span>{' '}
              dan{' '}
              <span 
                onClick={() => router.push('/kebijakan-privasi')}
                className="font-bold underline text-calm-green-dark hover:text-calm-green cursor-pointer"
              >
                Kebijakan Privasi
              </span>{' '}
              kami.
            </p>
            <div className="flex items-center gap-1.5 justify-center text-[10px] text-calm-text-secondary">
              <Shield className="w-3.5 h-3.5 text-calm-green" />
              <span>Obrolan kamu bersifat rahasia dan tidak dibagikan ke pihak kampus.</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
