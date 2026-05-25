'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { 
  Heart, 
  Sparkles, 
  Shield, 
  ChevronRight, 
  Wind, 
  BookOpen, 
  BarChart3, 
  MessageSquare, 
  Menu, 
  X, 
  Lock, 
  Star, 
  ArrowRight, 
  Smile, 
  Brain, 
  Compass,
  PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LandingHome() {
  const router = useRouter();
  const { user, guestMode } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll tracking for sticky transparent-to-solid navbar transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleGuestQuickStart = () => {
    router.push('/register');
  };

  return (
    <div id="landing_screen" className="min-h-screen bg-calm-bg overflow-x-hidden flex flex-col relative">
      {/* Decorative Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-calm-green/8 blur-[120px]" />
        <div className="absolute top-[40%] right-[-5%] w-[600px] h-[600px] rounded-full bg-calm-peach/12 blur-[140px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[450px] h-[450px] rounded-full bg-calm-green/10 blur-[110px]" />
        
        {/* Soothing animated background floaters */}
        <div className="absolute top-[25%] right-[15%] w-3 h-3 rounded-full bg-calm-peach animate-float opacity-40" />
        <div className="absolute bottom-[35%] left-[10%] w-4 h-4 rounded-full bg-calm-green animate-float opacity-30" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[75%] right-[8%] w-5 h-5 rounded-full bg-calm-green/30 animate-float opacity-20" style={{ animationDelay: '3s' }} />
      </div>

      {/* 1. STICKY HEADER NAVBAR */}
      <header 
        id="navbar" 
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/85 backdrop-blur-md border-b border-calm-border/30 py-4 shadow-xs' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo Left */}
          <div 
            id="brand_logo" 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => router.push('/')}
          >
            <div className="w-9 h-9 bg-white border border-calm-border/70 rounded-xl flex items-center justify-center text-calm-green-dark shadow-xs transition-transform group-hover:scale-105">
              <Brain className="w-4.5 h-4.5 fill-calm-green/20" />
            </div>
            <span className="font-display font-bold text-lg text-calm-text-primary tracking-tight">
              MindMate<span className="text-calm-green-dark">.</span>
            </span>
          </div>

          {/* Menu Center (Desktop Only) */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#fitur" 
              className="text-sm font-medium text-calm-text-secondary hover:text-calm-text-primary transition-colors duration-150"
            >
              Fitur
            </a>
            <a 
              href="#cara-kerja" 
              className="text-sm font-medium text-calm-text-secondary hover:text-calm-text-primary transition-colors duration-150"
            >
              Cara Kerja
            </a>
            <a 
              href="#tentang" 
              className="text-sm font-medium text-calm-text-secondary hover:text-calm-text-primary transition-colors duration-150"
            >
              Tentang
            </a>
          </nav>

          {/* Auth Right Buttons (Desktop Only) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="nav_login"
              onClick={() => router.push('/login')}
              className="text-sm font-semibold text-calm-text-secondary hover:text-calm-text-primary px-4 py-2 transition-colors cursor-pointer"
            >
              Masuk
            </button>
            <button
              id="nav_register"
              onClick={() => router.push('/register')}
              className="text-sm font-semibold bg-white hover:bg-calm-bg text-calm-text-primary border border-calm-border/70 px-4.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-98"
            >
              Daftar
            </button>
          </div>

          {/* Hamburger Menu (Mobile Only) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="text-calm-text-primary hover:text-calm-green-dark focus:outline-none transition-colors p-1"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navbar Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 bg-white border-b border-calm-border shadow-md py-6 px-6 flex flex-col gap-4 z-40 md:hidden"
            >
              <a 
                href="#fitur" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-calm-text-secondary hover:text-calm-text-primary transition-colors py-1.5"
              >
                Fitur
              </a>
              <a 
                href="#cara-kerja" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-calm-text-secondary hover:text-calm-text-primary transition-colors py-1.5"
              >
                Cara Kerja
              </a>
              <a 
                href="#tentang" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-calm-text-secondary hover:text-calm-text-primary transition-colors py-1.5"
              >
                Tentang
              </a>
              <div className="h-px bg-calm-border/30 my-2" />
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => { setMobileMenuOpen(false); router.push('/login'); }}
                  className="w-full py-2.5 text-center font-semibold text-calm-text-secondary bg-calm-bg rounded-xl hover:bg-calm-border/40 transition-colors"
                >
                  Masuk
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); router.push('/register'); }}
                  className="w-full py-2.5 text-center font-semibold text-white bg-calm-green hover:bg-calm-green-dark rounded-xl transition-colors"
                >
                  Daftar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* spacer to push content below fixed header */}
      <div className="h-24" />

      {/* Hero Display Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 w-full flex flex-col items-center justify-center py-8 z-10">
        
        {/* HERO HEADER & TITLE */}
        <div className="text-center max-w-3xl mx-auto space-y-6 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-calm-green/12 text-calm-green-dark px-3.5 py-1.5 rounded-full text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 fill-calm-green/10" />
            <span>Pendamping Kesehatan Mental Khusus Mahasiswa</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-[54px] font-display font-extrabold text-calm-text-primary leading-[1.1] tracking-tight text-center"
          >
            Sembuhkan Lelah Akademik bersama <span className="text-calm-green-dark relative inline-block">MindMate</span>
          </motion.h1>

          {/* Subtitle updated directly to user request */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-calm-text-secondary max-w-2xl leading-relaxed text-center font-sans"
          >
            Tempat aman untuk cerita, bernapas, dan mengurai beban kuliah. Tanpa dihakimi. Kapan saja.
          </motion.p>

          {/* 2. CTA BUTTON HIERARCHY */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-4"
          >
            {/* Primary Button */}
            <button
              id="start_anonymous_btn"
              onClick={handleGuestQuickStart}
              className="w-full sm:w-auto py-3.5 px-8 bg-calm-green hover:bg-calm-green-dark text-white font-bold rounded-2xl text-sm transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              Mulai Sekarang — Daftar Gratis
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Secondary Button */}
            <button
              id="open_register_btn"
              onClick={() => router.push('/login')}
              className="w-full sm:w-auto py-3.5 px-8 bg-white hover:bg-calm-bg border border-calm-border/80 text-calm-text-primary text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
            >
              Masuk ke Akun
            </button>
          </motion.div>

          {/* Secure / Privacy indicator row */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-2 text-xs text-calm-text-secondary text-center select-none pt-2"
          >
            <Lock className="w-3.5 h-3.5 text-calm-green-dark" />
            <span>Pendaftaran aman & 100% rahasia</span>
          </motion.div>
        </div>

        {/* Ambient Pulsing Zen Breathing Bubble graphic to balance space visually */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-md mx-auto my-12 flex flex-col items-center justify-center p-8 bg-white/45 border border-calm-border/40 rounded-[32px] shadow-xs cursor-pointer group"
          onClick={handleGuestQuickStart}
        >
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 bg-calm-green/15 rounded-full animate-breathe" />
            <div className="absolute inset-4 bg-calm-green/20 rounded-full animate-breathe" style={{ animationDelay: '2.5s' }} />
            <div className="w-16 h-16 bg-white border border-calm-border rounded-full flex items-center justify-center text-calm-green shadow-xs group-hover:scale-105 transition-transform">
              <Compass className="w-8 h-8 fill-calm-green/10" />
            </div>
          </div>
          <span className="mt-5 text-xs text-calm-text-secondary group-hover:text-calm-text-primary transition-colors font-mono tracking-wider uppercase">
            Sesi Napas Singkat • Sentuh untuk Memulai
          </span>
        </motion.div>

        {/* 4. SECTION FITUR */}
        <section id="fitur" className="w-full py-16 border-t border-calm-border/20 mt-8 scroll-mt-24">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-display font-extrabold text-calm-text-primary">
              Ruang Tenang Pembasmi Stress Kuliah
            </h2>
            <p className="text-sm text-calm-text-secondary leading-relaxed">
              Modul ramah mental yang dirancang untuk menjaga fokus dan stabilitas emosionalmu di tengah padatnya deadline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
            {/* Fitur Card 1 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={handleGuestQuickStart}
              className="bg-white/70 border border-calm-border/70 p-7 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                <div className="w-14 h-14 bg-calm-green/15 text-calm-green-dark rounded-2xl flex items-center justify-center mb-6 shadow-xs group-hover:bg-calm-green/25 transition-colors">
                  <MessageSquare className="w-7 h-7 fill-calm-green/15" />
                </div>
                <h3 className="font-display font-bold text-lg text-calm-text-primary mb-2">Curhat Anonim AI</h3>
                <p className="text-sm text-calm-text-secondary leading-relaxed mb-6">
                  Pendengar setia 24/7 yang menerima segala keluh kesah akademikmu tanpa pernah menghakimi.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-calm-green-dark group-hover:translate-x-1 transition-transform">
                <span>Coba Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            {/* Fitur Card 2 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={handleGuestQuickStart}
              className="bg-white/70 border border-calm-border/70 p-7 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-xs group-hover:bg-amber-100 transition-colors">
                  <Wind className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-lg text-calm-text-primary mb-2">Pernapasan Rileks</h3>
                <p className="text-sm text-calm-text-secondary leading-relaxed mb-6">
                  Tenangkan degup jantung seketika dengan pemandu napas berirama untuk meredakan kepanikan ujian.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
                <span>Coba Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            {/* Fitur Card 3 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={handleGuestQuickStart}
              className="bg-white/70 border border-calm-border/70 p-7 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xs group-hover:bg-indigo-100 transition-colors">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-lg text-calm-text-primary mb-2">Jurnal Emosi Harian</h3>
                <p className="text-sm text-calm-text-secondary leading-relaxed mb-6">
                  Catat refleksi harian dan ungkapan rasa syukur untuk memperkuat kepedulian mentalmu secara mandiri.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition-transform">
                <span>Coba Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            {/* Fitur Card 4 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={handleGuestQuickStart}
              className="bg-white/70 border border-calm-border/70 p-7 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-xs group-hover:bg-teal-100 transition-colors">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-lg text-calm-text-primary mb-2">Laporan Stress Interaktif</h3>
                <p className="text-sm text-calm-text-secondary leading-relaxed mb-6">
                  Evaluasi fluktuasi suasanamu tiap minggu untuk mengetahui pola kelelahan dan cara mengatasinya.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform">
                <span>Coba Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. SECTION HOW IT WORKS */}
        <section id="cara-kerja" className="w-full py-16 border-t border-calm-border/20 scroll-mt-24">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl font-display font-extrabold text-calm-text-primary">
              Bagaimana Seluruhnya Bekerja?
            </h2>
            <p className="text-sm text-calm-text-secondary leading-relaxed">
              Hanya butuh tiga langkah santai untuk mendapatkan pendampingan pikiran yang kokoh di sisa masa kuliahmu.
            </p>
          </div>

          {/* Stepper horizontal di desktop, dan vertical di mobile */}
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 max-w-5xl mx-auto w-full">
            {/* Step 1 */}
            <div className="flex-1 bg-white/45 border border-calm-border/40 p-6 rounded-2xl relative shadow-xs flex flex-col items-center text-center">
              <div className="absolute top-4 left-4 font-mono text-[11px] bg-calm-green/20 text-calm-green-dark px-2.5 py-1 rounded-full font-bold">
                01
              </div>
              <div className="w-12 h-12 rounded-full bg-calm-green/15 text-calm-green-dark flex items-center justify-center mb-4 mt-2">
                <Smile className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-base text-calm-text-primary mb-2">
                Pilih Mood Hari Ini
              </h4>
              <p className="text-xs text-calm-text-secondary leading-relaxed">
                Refleksikan perasaanmu hari ini dengan visualisasi emoji emosi yang ramah dan intuitif.
              </p>
            </div>

            {/* Stepper spacer line on desktop */}
            <div className="hidden md:flex items-center justify-center text-calm-border">
              <div className="w-4 h-0.5 bg-calm-border" />
            </div>

            {/* Step 2 */}
            <div className="flex-1 bg-white/45 border border-calm-border/40 p-6 rounded-2xl relative shadow-xs flex flex-col items-center text-center">
              <div className="absolute top-4 left-4 font-mono text-[11px] bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-bold">
                02
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4 mt-2">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-base text-calm-text-primary mb-2">
                Pilih Sesi Layanan
              </h4>
              <p className="text-xs text-calm-text-secondary leading-relaxed">
                Sesuaikan kebutuhan: curhat ke asisten mental AI, ikuti latihan napas rileks, atau isi jurnal syukur.
              </p>
            </div>

            {/* Stepper spacer line on desktop */}
            <div className="hidden md:flex items-center justify-center text-calm-border">
              <div className="w-4 h-0.5 bg-calm-border" />
            </div>

            {/* Step 3 */}
            <div className="flex-1 bg-white/45 border border-calm-border/40 p-6 rounded-2xl relative shadow-xs flex flex-col items-center text-center">
              <div className="absolute top-4 left-4 font-mono text-[11px] bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-bold">
                03
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 mt-2">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-base text-calm-text-primary mb-2">
                Dapatkan Insight Mingguan
              </h4>
              <p className="text-xs text-calm-text-secondary leading-relaxed">
                Evaluasi progres stabilitas mentalmu dari ringkasan laporan visual interaktif terpercaya.
              </p>
            </div>
          </div>
        </section>

        {/* 5. SOCIAL PROOF */}
        <section className="w-full py-16 border-t border-calm-border/20">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
            <h2 className="text-3xl font-display font-extrabold text-calm-text-primary">
              Suara Teman Mahasiswa
            </h2>
            <p className="text-sm text-calm-text-secondary leading-relaxed">
              Membantu ribuan mahasiswa mengarungi lautan perkuliahan dengan tenang, fokus, dan stabil.
            </p>
          </div>

          {/* Core Stat Bar */}
          <div className="bg-white/60 border border-calm-border/40 rounded-2xl p-5 mb-10 max-w-4xl mx-auto flex flex-col sm:flex-row justify-around items-center text-center gap-5">
            <div className="space-y-0.5">
              <span className="block text-xl font-extrabold text-calm-green-dark">2.400+</span>
              <span className="text-xs text-calm-text-secondary font-medium uppercase tracking-wider">Mahasiswa Aktif</span>
            </div>
            <div className="hidden sm:block w-px h-10 bg-calm-border" />
            
            <div className="space-y-0.5">
              <span className="text-xl font-extrabold text-calm-green-dark flex items-center justify-center gap-1">
                4.8 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </span>
              <span className="text-xs text-calm-text-secondary font-medium uppercase tracking-wider">Rating Kepuasan</span>
            </div>
            <div className="hidden sm:block w-px h-10 bg-calm-border" />
            
            <div className="space-y-0.5">
              <span className="block text-xl font-extrabold text-calm-green-dark">12</span>
              <span className="text-xs text-calm-text-secondary font-medium uppercase tracking-wider">Kampus Bergabung</span>
            </div>
          </div>

          {/* Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
            {/* Testimonial 1 */}
            <div className="bg-white/45 border border-calm-border/40 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
              <p className="text-xs text-calm-text-secondary italic leading-relaxed mb-6">
                &ldquo;MindMate membantu banget pas tugas akhir menumpuk. Sesi pernapasan ngebantu aku tetap tenang sebelum presentasi.&rdquo;
              </p>
              <div className="border-t border-calm-border/40 pt-4 flex items-center gap-3">
                <div className="w-7 h-7 bg-calm-green/20 rounded-full flex items-center justify-center text-[10px] font-bold text-calm-green-dark">
                  RA
                </div>
                <span className="text-[11px] font-bold text-calm-text-primary">
                  R.A., Mahasiswa Semester 6
                </span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/45 border border-calm-border/40 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
              <p className="text-xs text-calm-text-secondary italic leading-relaxed mb-6">
                &ldquo;Bisa curhat tanpa takut dihakimi atau bocor ke orang lain. Bener-bener tempat ternyaman saat burnout kuliah.&rdquo;
              </p>
              <div className="border-t border-calm-border/40 pt-4 flex items-center gap-3">
                <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-[10px] font-bold text-amber-700">
                  MF
                </div>
                <span className="text-[11px] font-bold text-calm-text-primary">
                  M.F., Mahasiswa Semester 4
                </span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white/45 border border-calm-border/40 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
              <p className="text-xs text-calm-text-secondary italic leading-relaxed mb-6">
                &ldquo;Laporan mini mingguan ngasih tahu kapan aku harus istirahat. Dashboard-nya sangat menenangkan dan mudah dipakai.&rdquo;
              </p>
              <div className="border-t border-calm-border/40 pt-4 flex items-center gap-3">
                <div className="w-7 h-7 bg-indigo-50 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-700">
                  LK
                </div>
                <span className="text-[11px] font-bold text-calm-text-primary">
                  L.K., Mahasiswa Semester 8
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tentang Section to perfectly back-link Tentang nav button */}
        <section id="tentang" className="w-full py-16 border-t border-calm-border/20 scroll-mt-24">
          <div className="max-w-3xl mx-auto bg-white/50 border border-calm-border/50 rounded-[32px] p-8 md:p-12 text-center space-y-5">
            <div className="mx-auto w-12 h-12 rounded-full bg-calm-green/20 text-calm-green-dark flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-display font-extrabold text-calm-text-primary">
              Misi Kedamaian Pikiran MindMate AI
            </h2>
            <p className="text-sm text-calm-text-secondary leading-relaxed max-w-xl mx-auto">
              Kami percaya tekanan akademis bukanlah halangan untuk tetap sehat secara mental. MindMate AI hadir sebagai pendamping emosional yang siap menemanimu melangkah melewati ujian, proyek, dan tantangan kampus dengan penuh kesadaran dan kehangatan.
            </p>
            <div className="pt-2">
              <button 
                onClick={handleGuestQuickStart}
                className="inline-flex items-center gap-2 bg-calm-green hover:bg-calm-green-dark text-white text-xs font-bold py-3 px-6 rounded-xl transition shadow-xs hover:shadow-sm"
              >
                Daftar Akun MindMate Sekarang
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* 7. FOOTER EXPANDED TO 3 COLUMNS */}
      <footer className="w-full bg-white border-t border-calm-border/45 pt-12 pb-8 z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* Column 1: Logo & Slogan */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-calm-bg border border-calm-border/60 rounded-lg flex items-center justify-center text-calm-green-dark">
                <Brain className="w-4 h-4 fill-calm-green/10" />
              </div>
              <span className="font-display font-bold text-base text-calm-text-primary tracking-tight">
                MindMate<span className="text-calm-green-dark">.</span>
              </span>
            </div>
            <p className="text-xs text-calm-text-secondary leading-relaxed max-w-sm">
              Teman setia perjalanan akademismu menuju pikiran yang lebih tenang, jernih, dan tangguh menghadapi tantangan dunia perkuliahan.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-calm-text-primary font-mono">Pranala</h4>
            <ul className="space-y-2.5 text-xs text-calm-text-secondary">
              <li>
                <a href="#fitur" className="hover:text-calm-green-dark transition-colors">Fitur Utama</a>
              </li>
              <li>
                <a href="#cara-kerja" className="hover:text-calm-green-dark transition-colors">Cara Kerja</a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-calm-green-dark transition-colors">Visi & Misi</a>
              </li>
              <li>
                <a href="#" className="hover:text-calm-green-dark transition-colors">Syarat Penggunaan</a>
              </li>
              <li>
                <a href="#" className="hover:text-calm-green-dark transition-colors">Kebijakan Privasi</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Emergency Crisis Hotline */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-calm-text-primary font-mono flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              Kontak Darurat
            </h4>
            <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl text-xs space-y-2">
              <p className="text-rose-950/80 font-medium leading-relaxed">
                Jika kamu dalam kondisi krisis emosional ekstrim atau membutuhkan bantuan segera, hubungi Into The Light Indonesia:
              </p>
              <div className="flex items-center gap-2 font-display font-bold text-rose-700 bg-white border border-rose-100/50 px-3 py-1.5 rounded-xl w-fit">
                <span>Hotline Nasional: 119 (ext 8)</span>
              </div>
              <p className="text-[10px] text-rose-800/60 leading-normal font-medium">
                Kamu tidak pernah sendirian. Bantuan profesional terpercaya selalu tersedia.
              </p>
            </div>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-calm-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-calm-text-secondary select-none">
          <span>MindMate AI © 2026. Dirancang dengan penuh empati untuk kesehatan dan stabilitas mental mahasiswa.</span>
          <span className="font-mono text-[10px] opacity-75">Terkonfigurasi Secara Privat & Aman</span>
        </div>
      </footer>
    </div>
  );
}
