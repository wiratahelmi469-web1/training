'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Brain, Lock, Check, Eye, EyeOff, KeyRound } from 'lucide-react';
import { LocalDb } from '@/lib/db';

export default function ResetPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      if (emailParam) {
        setTimeout(() => {
          setEmail(emailParam);
        }, 0);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email target harus diisi.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password baru minimal harus 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok dengan password baru Anda.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Find and update in Registered Users
      const list = LocalDb.getRegisteredUsers();
      const userIdx = list.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

      if (userIdx === -1) {
        setLoading(false);
        setError(`Akun dengan email ${email} tidak ditemukan dalam database lokal.`);
        return;
      }

      // Update password
      list[userIdx].password = newPassword;
      LocalDb.set("registered_users", list);

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        router.push('/login?reset=success');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-calm-bg p-4 sm:p-6 lg:p-8 relative selection:bg-calm-green/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-calm-green/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-calm-peach/10 blur-3xl animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/75 backdrop-blur-md border border-calm-border/60 rounded-[32px] p-6 sm:p-10 shadow-sm relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-calm-green/25 rounded-2xl flex items-center justify-center text-calm-green-dark mb-3">
            <KeyRound className="w-5.5 h-5.5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-calm-text-primary">
            Sandi Pengaman Baru
          </h1>
          <p className="text-xs text-calm-text-secondary mt-1">
            Silakan masukkan dan konfirmasi kombinasi password baru Anda.
          </p>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-calm-text-primary">Password Berhasil Diubah!</h3>
            <p className="text-xs text-calm-text-secondary">
              Kamu akan diarahkan kembali ke halaman login utama dalam hitungan detik...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" noValidate>
            {/* Target Email */}
            <div className="space-y-1.5">
              <label htmlFor="reset_email_field" className="block text-xs font-semibold text-calm-text-secondary">
                Email Terkait
              </label>
              <input
                id="reset_email_field"
                type="email"
                placeholder="wirata@emailmahasiswa.ac.id"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-calm-border/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-calm-green/10 text-sm placeholder-gray-400 transition"
              />
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label htmlFor="new_password_field" className="block text-xs font-semibold text-calm-text-secondary">
                Password Baru
              </label>
              <div className="relative">
                <input
                  id="new_password_field"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  placeholder="Min. 8 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full pl-4 pr-11 py-3 bg-white/50 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-calm-green/10 text-sm placeholder-gray-400 transition ${
                    error.includes('karakter') ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-calm-border/80 focus:border-calm-green'
                  }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center px-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password input */}
            <div className="space-y-1.5">
              <label htmlFor="confirm_password_field" className="block text-xs font-semibold text-calm-text-secondary">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <input
                  id="confirm_password_field"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm-password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  placeholder="Ketik ulang password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-4 pr-11 py-3 bg-white/50 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-calm-green/10 text-sm placeholder-gray-400 transition ${
                    error.includes('Konfirmasi') ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-calm-border/80 focus:border-calm-green'
                  }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center px-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs font-semibold text-red-500 flex items-center gap-1 mt-1" role="alert">
                <span>⚠</span> {error}
              </p>
            )}

            <button
              id="submit_password_reset"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-calm-green hover:bg-calm-green-dark text-white font-bold rounded-2xl text-sm transition shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75"
              aria-busy={loading ? "true" : "false"}
            >
              {loading ? "Menyimpan Password..." : "Simpan sandi & Atur Ulang"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
