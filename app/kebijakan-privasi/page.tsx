'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, CheckCircle2, Lock, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-calm-bg text-calm-text-primary px-6 py-12 md:py-20">
      <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md border border-calm-border/60 rounded-3xl p-8 md:p-12 shadow-xs">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-calm-text-secondary hover:text-calm-text-primary mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        {/* Title */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 bg-calm-green/20 rounded-2xl flex items-center justify-center text-calm-green-dark">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-calm-green-dark uppercase tracking-wider font-mono">Keamanan & Kerahasiaan</span>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">Kebijakan Privasi</h1>
          </div>
        </div>

        <p className="text-sm text-calm-text-secondary leading-relaxed mb-8">
          Privasimu adalah prioritas mutlak kami. Di MindMate AI, kami percaya bahwa setiap mahasiswa berhak mendapatkan ruang aman yang sepenuhnya aman, privat, dan bebas dari penghakiman.
        </p>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-4 bg-calm-green/8 border border-calm-green/12 rounded-2xl">
            <EyeOff className="w-5 h-5 text-calm-green-dark mb-2" />
            <h3 className="text-xs font-bold font-display text-calm-text-primary mb-1">Kerahasiaan Kampus</h3>
            <p className="text-[11px] text-calm-text-secondary leading-relaxed">
              Data atau isi curhat kamu 100% rahasia & tidak akan pernah dibagikan kepada universitas/dosen.
            </p>
          </div>
          <div className="p-4 bg-calm-green/8 border border-calm-green/12 rounded-2xl">
            <Lock className="w-5 h-5 text-calm-green-dark mb-2" />
            <h3 className="text-xs font-bold font-display text-calm-text-primary mb-1">Penyimpanan Terenkripsi</h3>
            <p className="text-[11px] text-calm-text-secondary leading-relaxed">
              Percakapan dan jurnal dienkripsi secara lokal di perangkatmu dan basis data internal yang aman.
            </p>
          </div>
          <div className="p-4 bg-calm-green/8 border border-calm-green/12 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 text-calm-green-dark mb-2" />
            <h3 className="text-xs font-bold font-display text-calm-text-primary mb-1">Kontrol Penuh Anda</h3>
            <p className="text-[11px] text-calm-text-secondary leading-relaxed">
              Kamu bisa membersihkan semua jejak percakapan dan menghapus seluruh data kapan saja lewat Settings.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-sm text-calm-text-secondary">
          <section className="space-y-2.5">
            <h2 className="text-base font-bold text-calm-text-primary font-display">1. Data apa yang kami kumpulkan?</h2>
            <p className="leading-relaxed">
              Untuk mengoptimalkan sesi kesehatan mentalmu, kami mengumpulkan:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 list-inside text-xs leading-relaxed">
              <li>Informasi profil dasar (nama panggilan, email, dan semester perkuliahan).</li>
              <li>Respons emosi dan entri jurnal kesyukuran harian yang kamu simpan sendiri.</li>
              <li>Umpan balik stress level untuk menyusun grafik peningkatan emosi mingguan.</li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-bold text-calm-text-primary font-display">2. Bagaimana data digunakan?</h2>
            <p className="leading-relaxed">
              Kami menggunakan data kamu murni untuk membantu kecerdasan asisten AI merespons emosimu secara personal, menghitung skor burnout, dan memberikan tips relaksasi yang tepat. Kami **tidak pernah menyalahgunakan, menyewakan, atau menjual** data kamu untuk kepentingan iklan.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-bold text-calm-text-primary font-display">3. Keamanan Tingkat Tinggi</h2>
            <p className="leading-relaxed">
              Semua komunikasi dengan Google Gemini API dilakukan secara privat langsung melalui server tepercaya kami menggunakan perlindungan key yang tersembunyi. Tidak ada identitas personal sensitif yang dikirim langsung ke penyedia kecerdasan buatan.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-bold text-calm-text-primary font-display">4. Kontak & Layanan Pengaduan</h2>
            <p className="leading-relaxed">
              Jika kamu memiliki pertanyaan, pengajuan penghapusan akun instan, atau ingin berkonsultasi seputar kebijakan perlindungan data, silakan hubungi Data Protection Officer (DPO) kami di:
            </p>
            <div className="p-4 border border-calm-border/60 bg-white/50 rounded-2xl font-mono text-xs text-calm-text-primary">
              <p>Email: dpo-privacy@mindmate.or.id</p>
              <p>Waktu Layanan: Senin - Jumat (09:00 - 17:00 WIB)</p>
            </div>
          </section>
        </div>

        {/* Footer info change */}
        <div className="border-t border-calm-border/40 mt-12 pt-6 text-center text-xs text-calm-text-secondary">
          <span>Pembaruan terakhir: 25 Mei 2026. MindMate AI mendukung Kampanye Sehat Akademik.</span>
        </div>
      </div>
    </div>
  );
}
