'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Brain, Sparkles, Shield, UserCheck } from 'lucide-react';
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
            <Brain className="w-7 h-7 fill-calm-green/40" />
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

        <div className="mt-6 pt-4 border-t border-calm-border/60 flex flex-col gap-4 items-center">
          <p className="text-center text-xs text-calm-text-secondary">
            Belum punya akun?{" "}
            <span 
              onClick={() => router.push('/register')} 
              className="text-calm-green-dark font-medium underline cursor-pointer"
            >
              Daftar di sini
            </span>
          </p>

          <div className="flex items-center gap-2.5 justify-center text-center text-[11px] text-calm-text-secondary">
            <Shield className="w-3.5 h-3.5 text-calm-green" />
            <span>Privasimu terjaga. Obrolan tidak akan dibagikan ke pihak kampus.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
