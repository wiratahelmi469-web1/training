'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { ShieldAlert, PhoneCall, HeartHandshake, Home, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function CrisisSupportPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div id="crisis_support_screen" className="min-h-screen bg-calm-bg py-10 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-red-100/30 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-orange-100/20 blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative">
        <div className="flex justify-between items-center mb-8">
          <button
            id="back_to_hub"
            onClick={() => router.push(user ? '/dashboard' : '/login')}
            className="flex items-center gap-2 text-sm text-calm-text-secondary hover:text-calm-text-primary transition bg-white/80 px-4 py-2 rounded-xl border border-calm-border cursor-pointer shadow-sm"
          >
            <Home className="w-4 h-4" />
            Kembali ke Dashboard
          </button>
          
          <span className="text-xs bg-red-100 text-red-700 font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" /> Portal Darurat Aktif
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-md border border-red-200/60 rounded-3xl p-6 sm:p-10 shadow-sm overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 via-amber-400 to-red-500" />
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4 ring-4 ring-red-100">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-calm-text-primary">
              Kamu Tidak Sendirian. Bantuan Tersedia Sekarang.
            </h1>
            <p className="text-sm text-calm-text-secondary mt-3 max-w-xl">
              Tekanan kuliah, kecemasan yang berat, atau pikiran menyakitkan bisa sangat membebani. Silakan hubungi layanan di bawah ini secara bebas rahasia gratis 24 jam.
            </p>
          </div>

          <div className="space-y-6">
            {/* Hotline 1 */}
            <div className="p-5 bg-red-50/50 rounded-2xl border border-red-100 hover:border-red-200 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-calm-text-primary">Teman Curhat & Layanan Krisis Nasional (Kemenkes)</h3>
                    <p className="text-xs text-calm-text-secondary mt-1">Layanan pertolongan psikologis & crisis intervention cepat tanggap.</p>
                  </div>
                </div>
                <a
                  href="tel:119"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 self-start sm:self-center transition shadow-sm"
                >
                  Panggil 119
                </a>
              </div>
            </div>

            {/* Hotline 2 */}
            <div className="p-5 bg-orange-50/35 rounded-2xl border border-orange-100 hover:border-orange-200 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-calm-text-primary">Into The Light Indonesia</h3>
                    <p className="text-xs text-calm-text-secondary mt-1">Komunitas pencegahan bunuh diri dan kesehatan jiwa remaja & mahasiswa.</p>
                  </div>
                </div>
                <a
                  href="tel:119"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 self-start sm:self-center transition shadow-sm"
                >
                  Ekstensi 8
                </a>
              </div>
            </div>

            {/* Campus Info Card */}
            <div className="p-6 bg-stone-50 rounded-2xl border border-calm-border flex flex-col sm:flex-row gap-5">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-calm-text-primary uppercase tracking-wider">Unit Konseling Kampus</h3>
                <p className="text-xs text-calm-text-secondary leading-relaxed">
                  Sebagian besar universitas menyediakan layanan Bimbingan Konseling (BK) gratis untuk mahasiswanya. Silakan kunjungi:
                </p>
                <ul className="text-xs text-calm-text-primary list-disc list-inside space-y-1.5 pl-2">
                  <li>Gedung Pusat Pelayanan Mahasiswa Terpadu</li>
                  <li>Situs resmi kemahasiswaan kampusmu</li>
                  <li>Dosen Wali / Dosen Penasihat Akademik terdekat</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-calm-border/60 text-center">
            <p className="text-xs text-calm-text-secondary italic">
              &quot;Ingatlah, beristirahat sejenak bukanlah kegagalan. Kamu berharga, dan masa depanmu jauh lebih luas daripada tumpukan tugas hari ini.&quot;
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
