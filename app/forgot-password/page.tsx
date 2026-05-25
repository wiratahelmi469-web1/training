'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Brain, ArrowLeft, Mail, Send, CheckCircle, HelpCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Rule 2: Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Email wajib diisi.');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid (contoh: nama@univ.ac.id/gmail.com).');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-calm-bg p-4 sm:p-6 lg:p-8 relative selection:bg-calm-green/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-calm-green/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-calm-peach/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/75 backdrop-blur-md border border-calm-border/60 rounded-[32px] p-6 sm:p-10 shadow-sm relative z-10"
      >
        {/* Back Button */}
        <button 
          onClick={() => router.push('/login')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-calm-text-secondary hover:text-calm-text-primary mb-6 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Login</span>
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-calm-green/20 rounded-2xl flex items-center justify-center text-calm-green-dark mb-3">
            <Brain className="w-5.5 h-5.5 fill-calm-green/30" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-calm-text-primary">
            Lupa Password
          </h1>
          <p className="text-xs text-calm-text-secondary mt-1 max-w-xs leading-relaxed">
            Tenang, kami akan membantu memulihkan akses masuk ke akun kedamaian pikiran Anda.
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleResetRequest} className="space-y-5" autoComplete="on" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email_reset" className="block text-xs font-semibold text-calm-text-secondary">
                Email Terdaftar
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-calm-text-secondary">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email_reset"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  placeholder="masukkan@emailkamu.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 bg-white/50 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-calm-green/10 text-sm placeholder-gray-400 transition ${
                    error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-calm-border/80 focus:border-calm-green'
                  }`}
                  aria-describedby={error ? "reset-error" : "reset-hint"}
                  aria-invalid={error ? "true" : "false"}
                />
              </div>
              
              {error ? (
                <p id="reset-error" className="text-xs font-medium text-red-500 flex items-center gap-1" role="alert">
                  <span>⚠</span> {error}
                </p>
              ) : (
                <p id="reset-hint" className="text-[10px] text-calm-text-secondary leading-normal">
                  Gunakan email universitas (.ac.id) atau email pribadi yang Anda daftarkan di MindMate.
                </p>
              )}
            </div>

            <button
              id="btn_request_reset"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-calm-green hover:bg-calm-green-dark text-white font-bold rounded-2xl text-sm transition shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-70 disabled:pointer-events-none"
              aria-busy={loading ? "true" : "false"}
            >
              {loading ? "Menghubungi Server..." : "Kirim Link Reset"}
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <div className="p-4.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center gap-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 fill-emerald-50" />
              <h3 className="text-sm font-bold text-emerald-950">Intruksi Pemulihan Dikirim</h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Link reset telah dikirim ke email <strong>{email}</strong>. Cek inbox & spam folder Anda.
              </p>
            </div>

            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Simulasi Preview Developer</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-normal">
                Karena berjalan di preview AI Studio lokal, Anda bisa mengeklik tombol di bawah ini langsung untuk memasukkan password baru bagi akun email <strong>{email}</strong>:
              </p>
              <button
                type="button"
                onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
                className="w-full mt-1.5 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition shadow-xs active:scale-97 cursor-pointer text-center"
              >
                Simulasikan Atur Password Baru
              </button>
            </div>

            <p className="text-[10px] text-calm-text-secondary leading-normal">
              Link reset berlaku selama 1 jam. Tidak menerima email? Tunggu 2 menit lalu ajukan kembali.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
