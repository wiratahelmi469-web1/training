'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Heart, Sparkles, Shield, Compass, ChevronRight, Wind, BookOpen, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingHome() {
  const router = useRouter();
  const { user, guestMode } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleGuestQuickStart = () => {
    guestMode();
    router.push('/onboarding');
  };

  return (
    <div id="landing_screen" className="min-h-screen bg-calm-bg overflow-hidden flex flex-col relative select-none">
      {/* Visual Ambient Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-calm-green/10 blur-3xl" />
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-calm-peach/20 blur-3xl" />
        {/* Animated ambient floaters */}
        <div className="absolute top-[30%] right-[20%] w-3 h-3 rounded-full bg-calm-green animate-float opacity-45" />
        <div className="absolute bottom-[40%] left-[15%] w-4 h-4 rounded-full bg-calm-peach animate-float opacity-50" />
      </div>

      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white border border-calm-border rounded-xl flex items-center justify-center text-calm-green-dark shadow-xs">
            <Heart className="w-5 h-5 fill-calm-green/20" />
          </div>
          <span className="font-display font-bold text-lg text-calm-text-primary tracking-tight">MindMate AI</span>
        </div>

        <nav className="flex items-center gap-4">
          <button
            id="nav_login"
            onClick={() => router.push('/login')}
            className="text-xs font-semibold text-calm-text-secondary hover:text-calm-text-primary transition cursor-pointer"
          >
            Masuk
          </button>
          
          <button
            id="nav_register"
            onClick={() => router.push('/register')}
            className="text-xs font-semibold bg-white hover:bg-calm-bg border border-calm-border px-4 py-2 rounded-xl transition cursor-pointer shadow-sm text-calm-text-primary"
          >
            Daftar Akun
          </button>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-12 z-10 py-12">
        {/* Left column info */}
        <div className="flex-1 space-y-6 text-center lg:text-left max-w-xl">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-calm-green/15 text-calm-green-dark px-3.5 py-1.5 rounded-full text-xs font-medium"
          >
            <Sparkles className="w-4 h-4 fill-calm-green/20" />
            <span>Pendamping Kesehatan Mental Khusus Mahasiswa</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-extrabold text-calm-text-primary leading-[1.125] tracking-tight"
          >
            Sembuhkan Lelah Akademik bersama <span className="text-calm-green-dark">MindMate</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-calm-text-secondary leading-relaxed font-sans"
          >
            Tempat aman untuk curhat kuliah anonim bebas cemas, melatih pernapasan jernih (breathwork), memecah tugas kuliah menumpuk, serta menganalisis stress mingguanmu ditenagai cerdasnya Gemini AI.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
          >
            <button
              id="start_anonymous_btn"
              onClick={handleGuestQuickStart}
              className="py-3.5 px-6 bg-calm-green hover:bg-calm-green-dark text-white font-semibold rounded-2xl text-sm transition shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Mulai Sesi Anonim (Instan)
              <ChevronRight className="w-4.5 h-4.5" />
            </button>

            <button
              id="open_register_btn"
              onClick={() => router.push('/register')}
              className="py-3.5 px-6 bg-white hover:bg-calm-bg border border-calm-border text-calm-text-primary text-sm font-semibold rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              Buat Profil Mahasiswa
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-5 justify-center lg:justify-start text-xs text-calm-text-secondary pt-4"
          >
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-calm-green-dark" />
              <span>Dukungan Enkripsi 100% Privat</span>
            </div>
            <div className="flex items-center gap-1">
              <Compass className="w-4 h-4 text-calm-green-dark" />
              <span>Dukung Kurikulum Kampus Seimbang</span>
            </div>
          </motion.div>
        </div>

        {/* Right column core feature interactive cards */}
        <div className="flex-1 w-full max-w-lg">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Box 1 */}
            <div className="p-5 bg-white/75 border border-calm-border rounded-3xl space-y-3 shadow-xs">
              <div className="w-9 h-9 bg-calm-green/20 rounded-xl flex items-center justify-center text-calm-green-dark">
                <Heart className="w-4.5 h-4.5 fill-calm-green/30" />
              </div>
              <h3 className="font-display font-bold text-xs text-calm-text-primary">Curhat Anonim AI</h3>
              <p className="text-[11px] text-calm-text-secondary leading-relaxed">
                Salurkan unek-unek kuliah dan kecemasanmu kapan saja. AI selalu siap mendengarkan tanpa menghakimi.
              </p>
            </div>

            {/* Box 2 */}
            <div className="p-5 bg-white/75 border border-calm-border rounded-3xl space-y-3 shadow-xs">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Wind className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-display font-bold text-xs text-calm-text-primary">Latihan Napas Rileks</h3>
              <p className="text-[11px] text-calm-text-secondary leading-relaxed">
                Panduan praktis pernapasan terstruktur (4-4-4) dengan animasi tenang untuk menurunkan denyut cemas.
              </p>
            </div>

            {/* Box 3 */}
            <div className="p-5 bg-white/75 border border-calm-border rounded-3xl space-y-3 shadow-xs">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-display font-bold text-xs text-calm-text-primary">Jurnal harian Emosi</h3>
              <p className="text-[11px] text-calm-text-secondary leading-relaxed">
                Tulis rasa syukur harian, tandai emosi, serta buat riwayat mood mingguan dengan mudah.
              </p>
            </div>

            {/* Box 4 */}
            <div className="p-5 bg-white/75 border border-calm-border rounded-3xl space-y-3 shadow-xs">
              <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                <BarChart3 className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-display font-bold text-xs text-calm-text-primary">Laporan Stress Mingguan</h3>
              <p className="text-[11px] text-calm-text-secondary leading-relaxed">
                Ukur dinamika kestabilan emosi dan dapatkan saran praktis dipandu Gemini AI secara berkala.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="w-full text-center py-6 text-[11px] text-calm-text-secondary border-t border-calm-border/40 bg-white/30 z-10">
        MindMate AI © 2026. Dirancang khusus untuk mahasiswa menghadapi dunia akademis dengan sehat dan berkesadaran.
      </footer>
    </div>
  );
}
