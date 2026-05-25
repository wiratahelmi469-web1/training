'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Sparkles, Calendar, Zap, Smile, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const STRESS_FACTORS_LIST = [
  { id: "deadlines", label: "Deadlines & Tugas Susul-menyusul", emoji: "📅" },
  { id: "exams", label: "Persiapan Ujian Akhir / Kuis", emoji: "✏️" },
  { id: "procrastination", label: "Kebiasaan Menunda Tugas", emoji: "⏳" },
  { id: "social", label: "Tekanan Sosial & Ekpektasi Ortu", emoji: "👥" },
  { id: "burnout", label: "Burnout Kuliah / Lelah Mental", emoji: "🔋" },
  { id: "future", label: "Kecemasan Karir & Masa Depan", emoji: "🎯" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, onboardUser } = useAuth();

  const [name, setName] = useState('');
  const [semester, setSemester] = useState('Semester 4');
  const [stressLevel, setStressLevel] = useState(5);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setTimeout(() => {
        setName(user.name);
        setSemester(user.semester || 'Semester 4');
        setStressLevel(user.stress_level || 5);
        setSelectedFactors(user.stress_factors || []);
      }, 0);
    }
  }, [user, router]);

  const toggleFactor = (factorLabel: string) => {
    setSelectedFactors(prev => 
      prev.includes(factorLabel) 
        ? prev.filter(f => f !== factorLabel) 
        : [...prev, factorLabel]
    );
  };

  const handleComplete = () => {
    if (!name) return;
    onboardUser(name, semester, stressLevel, selectedFactors);
    router.push('/dashboard');
  };

  return (
    <div id="onboarding_screen" className="min-h-screen bg-calm-bg py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-calm-green/10 blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-calm-peach/15 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white/60 backdrop-blur-md border border-calm-border rounded-3xl p-6 sm:p-10 shadow-sm relative"
      >
        <div className="mb-8">
          <div className="flex items-center gap-2 text-calm-green-dark mb-2">
            <Sparkles className="w-5 h-5 fill-calm-green/20" />
            <span className="text-xs font-semibold uppercase tracking-wider">Perkenalan Personal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-calm-text-primary tracking-tight">
            Mari Sesuaikan MindMate AI
          </h1>
          <p className="text-sm text-calm-text-secondary mt-1">
            Membantumu tetap seimbang melintasi tugas dan jadwal padat universitas.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-calm-text-secondary uppercase tracking-wider mb-2">
                Panggilan Nyamanmu
              </label>
              <input
                id="ob_name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-calm-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-calm-green/40 text-sm transition"
                placeholder="Namamu"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-calm-text-secondary uppercase tracking-wider mb-2">
                Semester Saat Ini
              </label>
              <select
                id="ob_semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-calm-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-calm-green/40 text-sm transition"
              >
                <option value="Semester 1">Semester 1 (Maba)</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4 (Dua Tahun)</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8 (Menjelang Lulus)</option>
                <option value="Lulus/Alumni">Alumni / Tingkat Lanjut</option>
              </select>
            </div>
          </div>

          {/* Step 2: Stress score bar */}
          <div className="bg-white/40 p-4 rounded-2xl border border-calm-border/60">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-calm-text-secondary uppercase tracking-wider">
                Indikator Tingkat Stress Hari Ini
              </span>
              <span className="text-sm font-semibold text-calm-green-dark px-2 py-0.5 bg-calm-green/10 rounded-full">
                Skala: {stressLevel}/10
              </span>
            </div>
            <input
              id="ob_stress_slider"
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full h-2 bg-calm-border rounded-lg appearance-none cursor-pointer accent-calm-green"
            />
            <div className="flex justify-between text-[11px] text-calm-text-secondary mt-2">
              <span className="flex items-center gap-1"><Smile className="w-3.5 h-3.5" /> Sangat Rileks</span>
              <span>Cukup Melelahkan</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Butuh Dukungan AI</span>
            </div>
          </div>

          {/* Step 3: Checkbox tags of academic stressors */}
          <div>
            <label className="block text-xs font-medium text-calm-text-secondary uppercase tracking-wider mb-3">
              Faktor Utama Penyebab Overthinking / Stress (Pilih Semua yang Relevan)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STRESS_FACTORS_LIST.map((factor) => {
                const active = selectedFactors.includes(factor.label);
                return (
                  <button
                    key={factor.id}
                    id={`ob_factor_${factor.id}`}
                    onClick={() => toggleFactor(factor.label)}
                    type="button"
                    className={`p-3.5 rounded-2xl text-left border text-xs font-medium transition duration-300 flex items-center justify-between cursor-pointer ${
                      active 
                        ? 'bg-calm-green/20 border-calm-green text-calm-text-primary shadow-sm' 
                        : 'bg-white/50 border-calm-border text-calm-text-secondary hover:bg-white hover:border-gray-400'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[15px]">{factor.emoji}</span>
                      <span>{factor.label}</span>
                    </span>
                    {active && <span className="w-2 h-2 rounded-full bg-calm-green-dark" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="mt-10 pt-6 border-t border-calm-border/60 flex items-center justify-between">
          <div className="text-xs text-calm-text-secondary flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-calm-green-dark" />
            <span>Kondisimu dienkripsi di peramban lokal secara privat.</span>
          </div>

          <button
            id="btn_complete_onboarding"
            onClick={handleComplete}
            disabled={!name}
            className="py-3 px-6 bg-calm-green hover:bg-calm-green-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-2xl transition shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
          >
            Masuk ke Konsol Dashboard
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
