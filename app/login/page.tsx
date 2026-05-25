'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Heart, Sparkles, Shield, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, guestMode } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await login(email, name);
    setLoading(false);
    router.push('/onboarding');
  };

  const handleGuest = () => {
    guestMode();
    router.push('/onboarding');
  };

  return (
    <div id="login_screen" className="min-h-screen flex items-center justify-center bg-calm-bg p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-calm-green/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-calm-peach/20 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-md border border-calm-border rounded-3xl p-6 sm:p-8 shadow-sm relative"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-calm-green/20 rounded-2xl flex items-center justify-center text-calm-green-dark mb-4">
            <Heart className="w-7 h-7 fill-calm-green/40" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-calm-text-primary">
            MindMate AI
          </h1>
          <p className="text-sm text-calm-text-secondary mt-2">
            Teman tenangmu melewati ujian, tugas, dan dinamika perkuliahan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-calm-text-secondary uppercase tracking-wider mb-1">
              Nama Lengkap
            </label>
            <input
              id="input_name"
              type="text"
              required
              placeholder="Masukkan namamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-calm-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-calm-green/40 text-sm placeholder-gray-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-calm-text-secondary uppercase tracking-wider mb-1">
              Email Universitas / Pribadi
            </label>
            <input
              id="input_email"
              type="email"
              required
              placeholder="nama@mahasiswa.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-calm-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-calm-green/40 text-sm placeholder-gray-400 transition"
            />
          </div>

          <button
            id="btn_submit"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-calm-green hover:bg-calm-green-dark text-white font-medium rounded-2xl text-sm transition shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Membuat Sesi..." : "Masuk dengan Aman & Mulai"}
            <Sparkles className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-calm-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-calm-bg text-calm-text-secondary rounded-full">Atau</span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            id="btn_guest"
            onClick={handleGuest}
            type="button"
            className="w-full py-3 px-4 bg-white/80 hover:bg-white border border-calm-border text-calm-text-primary text-sm font-medium rounded-2xl transition flex items-center justify-center gap-3 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-calm-text-secondary" />
            Lanjutkan Anonim (Cepat & Privat)
          </button>

          <button
            id="btn_oauth"
            onClick={handleGuest}
            type="button"
            className="w-full py-3 px-4 bg-white/40 hover:bg-white/60 border border-dashed border-calm-border text-calm-text-secondary text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.78 0 3.32.67 4.5 1.77l2.454-2.454C17.636 1.845 15.11 1 12.24 1 6.584 1 2 5.584 2 11.24s4.584 10.24 10.24 10.24c5.795 0 10.24-4.065 10.24-10.24 0-.693-.08-1.36-.227-1.955H12.24z"/>
            </svg>
            Masuk Cepat dengan Google
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-calm-border/60 flex items-center gap-2.5 justify-center text-center text-[11px] text-calm-text-secondary">
          <Shield className="w-3.5 h-3.5 text-calm-green" />
          <span>Privasimu terjaga. Obrolan tidak akan dibagikan ke pihak kampus.</span>
        </div>
      </motion.div>
    </div>
  );
}
