'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Brain, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setLoading(true);
    await register(email, name, semester);
    setLoading(false);
    router.push('/onboarding');
  };

  return (
    <div id="register_screen" className="min-h-screen flex items-center justify-center bg-calm-bg p-4 sm:p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-calm-peach/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-calm-green/10 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white/70 backdrop-blur-md border border-calm-border rounded-3xl p-6 shadow-sm"
      >
        <div className="text-center mb-6">
          <span className="inline-flex px-3 py-1 bg-calm-green/10 text-xs font-medium text-calm-green-dark rounded-full mb-3">
            Daftar Akun Mahasiswa
          </span>
          <h2 className="text-xl font-bold text-calm-text-primary">Registrasi MindMate</h2>
          <p className="text-xs text-calm-text-secondary mt-1">
            Mulai kelola stress akademikmu dengan bantuan asisten AI.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-calm-text-secondary mb-1">
              Nama Lengkap
            </label>
            <input
              id="reg_name"
              type="text"
              required
              placeholder="Contoh: Wirata Helmi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/50 border border-calm-border rounded-xl focus:outline-none focus:ring-2 focus:ring-calm-green/45 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-calm-text-secondary mb-1">
              Email Akademis (.ac.id)
            </label>
            <input
              id="reg_email"
              type="email"
              required
              placeholder="wirata@mahasiswa.undip.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/50 border border-calm-border rounded-xl focus:outline-none focus:ring-2 focus:ring-calm-green/45 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-calm-text-secondary mb-1">
              Semester Aktif
            </label>
            <select
              id="reg_semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/50 border border-calm-border rounded-xl focus:outline-none focus:ring-2 focus:ring-calm-green/45 text-sm transition"
            >
              <option value="Semester 1">Semester 1 (Maba)</option>
              <option value="Semester 2">Semester 2</option>
              <option value="Semester 3">Semester 3</option>
              <option value="Semester 4">Semester 4 (Intermediate)</option>
              <option value="Semester 5">Semester 5</option>
              <option value="Semester 6">Semester 6</option>
              <option value="Semester 7">Semester 7</option>
              <option value="Semester 8">Semester 8 (Akhir)</option>
              <option value="Pascasarjana">Pascasarjana / S2</option>
            </select>
          </div>

          <button
            id="reg_submit"
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-calm-green hover:bg-calm-green-dark text-white font-medium rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Menyimpan Data..." : "Daftar Akun Baru"}
            <Sparkles className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-calm-text-secondary mt-5">
          Sudah punya akun?{" "}
          <span 
            onClick={() => router.push('/login')} 
            className="text-calm-green-dark font-medium underline cursor-pointer"
          >
            Masuk di sini
          </span>
        </p>
      </motion.div>
    </div>
  );
}
