'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, AlertCircle, Heart, CheckCircle } from 'lucide-react';

export default function SyaratKetentuanPage() {
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
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-calm-green-dark uppercase tracking-wider font-mono">Aturan Penggunaan</span>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">Syarat & Ketentuan</h1>
          </div>
        </div>

        <p className="text-sm text-calm-text-secondary leading-relaxed mb-8">
          Selamat datang di MindMate AI. Dengan mengakses akun atau masuk ke platform kami, Anda menyetujui seluruh ketentuan dan pedoman tanggung jawab di bawah ini demi kenyamanan bersama.
        </p>

        {/* Vital Health Disclaimer Box */}
        <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl mb-8 flex gap-3.5 items-start">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-rose-950">PERINGATAN DAN SANGGAHAN MEDIS (CRITICAL DISCLAIMER)</h3>
            <p className="text-[11px] text-rose-900/85 leading-relaxed">
              MindMate AI adalah asisten pendamping kesehatan mental yang didukung kecerdasan buatan, dirancang murni untuk dukungan emosi dan manajemen stres akademis tingkat awal. **Kami bukan psikolog, psikiater, dokter, atau terapi medis formal.** Kami tidak mendiagnosis penyakit medis, tidak mersepkan obat-obatan, dan tidak bermaksud menggantikan terapi tatap muka formal. Jika Anda mengalami krisis psikologis ekstrem atau ada pikiran menyakiti diri sendiri, segera hubungi kontak krisis atau layanan medis profesional.
            </p>
          </div>
        </div>

        {/* Section Contents */}
        <div className="space-y-6 text-sm text-calm-text-secondary">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-calm-text-primary font-display">1. Akun dan Hak Pengguna</h2>
            <p className="leading-relaxed text-xs">
              Layanan ini disediakan khusus untuk mahasiswa aktif yang membutuhkan ruang curhat dan pernapasan rileks. Anda bertanggung jawab penuh untuk menjaga keamanan akses kredensial password saat mendaftarkan diri secara privat.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-calm-text-primary font-display">2. Etika Penggunaan</h2>
            <p className="leading-relaxed text-xs">
              Anda setuju untuk menggunakan platform dengan bijak. Dilarang melakukan manipulasi data, melakukan injeksi pesan berbahaya yang bermaksud merusak respon Gemini API atau bot, serta dilarang menyamar sebagai pihak medis berwenang.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-calm-text-primary font-display">3. Batasan Tanggung Jawab</h2>
            <p className="leading-relaxed text-xs">
              Mengingat sifat respons kecerdasan buatan (Gemini AI) yang merujuk pada pemrosesan bahasa, seluruh masukan, tanggapan, reframe pikiran, atau asisten breakdown kognitif ditujukan sebagai bahan diskusi dan tidak wajib ditelan mentah-mentah jika bertentangan dengan preferensi pribadi Anda.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-calm-text-primary font-display">4. Penghapusan Seluruh Data</h2>
            <p className="leading-relaxed text-xs">
              Kami mendukung penuh privasi modular. Melalui menu pengaturan dashboard, pengguna dapat mengeklik &ldquo;Hapus Seluruh Data&rdquo; untuk secara permanen memusnahkan semua chat, sejarah pernapasan, entri jurnal syukur, dan riwayat stress dari local storage peramban mereka seketika.
            </p>
          </section>
        </div>

        {/* Footer info change */}
        <div className="border-t border-calm-border/40 mt-12 pt-6 text-center text-xs text-calm-text-secondary flex justify-between items-center flex-wrap gap-2">
          <span>Pembaruan terakhir: 25 Mei 2026</span>
          <span className="flex items-center gap-1.5 text-calm-green-dark font-medium text-[11px]">
            <Heart className="w-3.5 h-3.5 fill-calm-green/20" /> Misi Kedamaian Pikiran
          </span>
        </div>
      </div>
    </div>
  );
}
