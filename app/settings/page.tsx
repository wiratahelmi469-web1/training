'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { LocalDb } from '@/lib/db';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Moon, 
  Sun, 
  EyeOff, 
  Lock, 
  LogOut, 
  Globe, 
  Save, 
  CheckCircle, 
  Sparkles, 
  Trash2, 
  ShieldCheck, 
  Clock, 
  Heart, 
  BookOpen, 
  Briefcase, 
  AlertCircle,
  Brain,
  ChevronRight,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, onboardUser, logout, clearChatHistory } = useAuth();
  
  // Client hydration protection
  const [mounted, setMounted] = useState(false);

  // Settings states stored in LocalStorage for persistence
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAnonymousChat, setIsAnonymousChat] = useState(false);

  // Reminder Notification toggles
  const [journalReminder, setJournalReminder] = useState(true);
  const [journalTime, setJournalTime] = useState('20:00');
  const [breathingReminder, setBreathingReminder] = useState(true);
  const [pendingTasksReminder, setPendingTasksReminder] = useState(false);

  // Profile Edit states
  const [editMode, setEditMode] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileSemester, setProfileSemester] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Password Change fields
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');
  const [passSuccessMsg, setPassSuccessMsg] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Load persists on initial mount securely
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      if (user) {
        setProfileName(user.name);
        setProfileSemester(user.semester);
        setProfileAvatar(user.avatar);
      }

      // Retreive existing local preferences
      const savedLang = localStorage.getItem('mindmate_settings_language');
      if (savedLang === 'en' || savedLang === 'id') {
        setLanguage(savedLang as 'id' | 'en');
      }

      const savedDark = localStorage.getItem('mindmate_settings_dark_mode') === 'true';
      setIsDarkMode(savedDark);
      if (savedDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      const savedAnon = localStorage.getItem('mindmate_settings_anonymous') === 'true';
      setIsAnonymousChat(savedAnon);

      const savedJNotif = localStorage.getItem('mindmate_reminder_journal') !== 'false';
      setJournalReminder(savedJNotif);

      const savedBNotif = localStorage.getItem('mindmate_reminder_breathe') !== 'false';
      setBreathingReminder(savedBNotif);

      const savedTNotif = localStorage.getItem('mindmate_reminder_tasks') === 'true';
      setPendingTasksReminder(savedTNotif);

      const savedJTime = localStorage.getItem('mindmate_reminder_journal_time') || '20:00';
      setJournalTime(savedJTime);
    }, 0);
  }, [user]);

  // Handle routing redirects securely
  useEffect(() => {
    if (mounted && (!user || user.id === "student-guest")) {
      router.push('/login');
    }
  }, [user, router, mounted]);

  // Helper translations object for instant dual-language switching (id / en)
  const t = {
    id: {
      title: 'Pengaturan & Personalitas',
      subtitle: 'Sesuaikan asisten MindMate AI agar sesuai dengan kenyamanan pikiranmu.',
      back: 'Kembali ke Dashboard',
      profileTitle: 'Profil Mahasiswa',
      profileDesc: 'Informasi dasar identitas perkuliahan Anda.',
      editProfile: 'Ubah Data Profil',
      saveProfile: 'Simpan Perubahan',
      cancel: 'Batal',
      nameLabel: 'Nama Panggilan / Lengkap',
      semesterLabel: 'Semester Perkuliahan',
      savedMsg: 'Profil berhasil diperbarui!',
      notifTitle: 'Pengaturan Notifikasi Pengingat',
      notifDesc: 'Kelola pendorong sela kegiatan agar kesehatan mental tatap terjaga.',
      reminderj: 'Reminder Journal Harian',
      reminderjDesc: 'Asisten AI mengingatkan Anda merekam kesyukuran & mood harian.',
      selectTime: 'Pilih Waktu Pengingat',
      reminderb: 'Reminder Latihan Pernapasan',
      reminderbDesc: 'Mengajak jeda relaksasi kognitif saat tugas kampus mulai menumpuk.',
      remindert: 'Reminder Tugas yang Tertunda',
      remindertDesc: 'Pemberitahuan ramah untuk urutan microtasks kognitif yang belum lengkap.',
      displayTitle: 'Tampilan & Visual Temaram',
      displayDesc: 'Atur warna kontras konsol demi memelihara kesegaran mata.',
      darkMode: 'Mode Gelap Rileks (Night Mode)',
      darkModeDesc: 'Menerapkan warna temaram lavender/mint gelap, ramah kelopak mata mahasiswa.',
      themeStatusLight: 'Tema Tenang Terang Aktif',
      themeStatusDark: 'Tema Terang Terlampaui (Mode Gelap)',
      privacyTitle: 'Keamanan & Kebijakan Privasi',
      privacyDesc: 'Kelola perlindungan rekap obrolan emosional Anda.',
      anonMode: 'Mode Anonimobilitas Curhat',
      anonModeDesc: 'Sembunyikan profil & semester asli dari log pemrosesan text kecerdasan buatan.',
      accountTitle: 'Manajemen Akun Akademik',
      accountDesc: 'Ubah sandi rahasia lokal atau bersihkan jejak database instan.',
      changePass: 'Ubah Kata Sandi Kredensial',
      logout: 'Keluar Sesi Sekarang',
      dangerTitle: 'Zona Berbahaya (Wipe Storage)',
      dangerDesc: 'Tindakan ini akan menghapus permanen seluruh sejarah chat, entri jurnal, tugas, dan setelan.',
      resetBtn: 'Bersihkan Seluruh Database',
      resetConfirm: 'Apakah Anda yakin ingin melenyapkan semua rekap kesehatan emosi Anda di device ini? Tindakan ini tidak dapat dibatalkan.',
      langTitle: 'Bahasa Antarmuka (Language)',
      langDesc: 'Mengubah teks pengaturan dan menu sistem.',
      idLabel: 'Bahasa Indonesia (ID)',
      enLabel: 'English (EN)',
      currPass: 'Kata Sandi Sekarang',
      newPass: 'Kata Sandi Baru (Min. 8 karakter)',
      confPass: 'Konfirmasi Sandi Baru',
      passErrorLen: 'Password baru minimal harus 8 karakter.',
      passErrorMatch: 'Konfirmasi password tidak cocok.',
      passErrorWrong: 'Sandi saat ini salah atau akun terganggu.',
      passSuccess: 'Sandi berhasil didefinisikan ulang!',
      anonymizedText: 'Disamarkan demi keamanan data',
      quickStat: 'Level Tekanan Pikiran Saat Ini',
      quickFactors: 'Faktor Pemicu Gelisah'
    },
    en: {
      title: 'Settings & Care Center',
      subtitle: 'Customize the MindMate AI assistant to suit your emotional well-being.',
      back: 'Back to Dashboard',
      profileTitle: 'Student Profile',
      profileDesc: 'Your primary profile identification details.',
      editProfile: 'Edit Profile Data',
      saveProfile: 'Save Changes',
      cancel: 'Cancel',
      nameLabel: 'Full Name / Nickname',
      semesterLabel: 'Academic Semester',
      savedMsg: 'Profile successfully updated!',
      notifTitle: 'Notification Preferences',
      notifDesc: 'Configure reminders to keep your psychological health on track.',
      reminderj: 'Daily Journal Reminder',
      reminderjDesc: 'AI assistant prompts you to write daily gratitude logs and moods.',
      selectTime: 'Choose Reminder Time',
      reminderb: 'Breathing Practice Reminder',
      reminderbDesc: 'Invites you to take a brief cognitive breathing break under academic pressure.',
      remindert: 'Pending Task Reminders',
      remindertDesc: 'Friendly prompt for unfinished task lists mapped in Task Breaker.',
      displayTitle: 'Appearance & Comfort Theme',
      displayDesc: 'Adjust color contrasts to reduce screen eye strain.',
      darkMode: 'Relaxing Dark Mode (Night Mode)',
      darkModeDesc: 'Launches a smooth lavender/mint dark palette suitable for late-night reading.',
      themeStatusLight: 'Warm Calming Light Theme Enabled',
      themeStatusDark: 'Relaxed Dark Mode Enabled',
      privacyTitle: 'Privacy & Security Control',
      privacyDesc: 'Manage security configurations for your sensitive chat recaps.',
      anonMode: 'Anonymous Chat Safeguard',
      anonModeDesc: 'Strips real student details from text generative prompt payloads.',
      accountTitle: 'Academic Account Controls',
      accountDesc: 'Change your login credentials or sign out of this browser safely.',
      changePass: 'Change Secure Password',
      logout: 'Log Out of Current Session',
      dangerTitle: 'Danger Zone (Wipe Storage)',
      dangerDesc: 'This permanently clears all chats, diaries, goals, stress stats, and configuration.',
      resetBtn: 'Clear All Local Database',
      resetConfirm: 'Are you absolutely sure you want to delete all historical logs on this device? This cannot be undone.',
      langTitle: 'Language Preference',
      langDesc: 'Alters menu headings and system parameters instantly.',
      idLabel: 'Indonesian (ID)',
      enLabel: 'English (EN)',
      currPass: 'Current Password',
      newPass: 'New Password (Min. 8 characters)',
      confPass: 'Confirm New Password',
      passErrorLen: 'New password must be at least 8 characters long.',
      passErrorMatch: 'Confirm password does not match.',
      passErrorWrong: 'Incorrect current password or session corrupted.',
      passSuccess: 'Password successfully re-defined!',
      anonymizedText: 'Anonymized for protection',
      quickStat: 'Current Mood Stress Rating',
      quickFactors: 'Discovered Stress Triggers'
    }
  }[language];

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-calm-bg text-calm-text-primary flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-calm-green border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-calm-text-secondary">Loading MindMate settings...</p>
      </div>
    );
  }

  // Handle dark mode state trigger
  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem('mindmate_settings_dark_mode', String(checked));
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle language trigger
  const handleLanguageChange = (lang: 'id' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('mindmate_settings_language', lang);
  };

  // Handle Profile Update submit
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');

    if (!profileName.trim()) return;

    // Use onboardUser to commit changes back into context state
    onboardUser(
      profileName, 
      profileSemester, 
      user.stress_level || 5, 
      user.stress_factors || []
    );

    // Save also in registered users list
    const list = LocalDb.getRegisteredUsers();
    const userIdx = list.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (userIdx >= 0) {
      list[userIdx].name = profileName;
      list[userIdx].semester = profileSemester;
      list[userIdx].avatar = profileAvatar;
      LocalDb.set("registered_users", list);
    }

    setProfileSuccessMsg(t.savedMsg);
    setTimeout(() => {
      setEditMode(false);
      setProfileSuccessMsg('');
    }, 1200);
  };

  // Handle password modification submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassErrorMsg('');
    setPassSuccessMsg('');

    if (newPassword.length < 8) {
      setPassErrorMsg(t.passErrorLen);
      return;
    }

    if (newPassword !== confPassword) {
      setPassErrorMsg(t.passErrorMatch);
      return;
    }

    // Load registered user and verify current password
    const list = LocalDb.getRegisteredUsers();
    const userIdx = list.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    
    if (userIdx >= 0) {
      const dbUser = list[userIdx];
      if (dbUser.password && dbUser.password !== currPassword) {
        setPassErrorMsg(t.passErrorWrong);
        return;
      }

      // Commit new password
      list[userIdx].password = newPassword;
      LocalDb.set("registered_users", list);
      
      setPassSuccessMsg(t.passSuccess);
      setCurrPassword('');
      setNewPassword('');
      setConfPassword('');
      
      setTimeout(() => {
        setPasswordOpen(false);
        setPassSuccessMsg('');
      }, 1500);
    } else {
      setPassErrorMsg("Sesi bermasalah. Akun Anda tidak ditemukan di internal storage.");
    }
  };

  // Notification Storage commits
  const handleJournalReminderToggle = (checked: boolean) => {
    setJournalReminder(checked);
    localStorage.setItem('mindmate_reminder_journal', String(checked));
  };

  const handleJournalTimeChange = (time: string) => {
    setJournalTime(time);
    localStorage.setItem('mindmate_reminder_journal_time', time);
  };

  const handleBreathingReminderToggle = (checked: boolean) => {
    setBreathingReminder(checked);
    localStorage.setItem('mindmate_reminder_breathe', String(checked));
  };

  const handleTasksReminderToggle = (checked: boolean) => {
    setPendingTasksReminder(checked);
    localStorage.setItem('mindmate_reminder_tasks', String(checked));
  };

  // Anonymous Toggle commit
  const handleAnonymousToggle = (checked: boolean) => {
    setIsAnonymousChat(checked);
    localStorage.setItem('mindmate_settings_anonymous', String(checked));
  };

  // Full database resets
  const handleEntireReset = () => {
    if (confirm(t.resetConfirm)) {
      clearChatHistory();
      localStorage.clear();
      router.push('/login');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-450 selection:bg-indigo-300/30 ${
      isDarkMode ? 'bg-[#151B17] text-stone-100' : 'bg-calm-bg text-calm-text-primary'
    }`}>
      
      {/* Absolute calming background ambient bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-10 left-10 w-80 h-80 rounded-full blur-3.5xl transition-opacity ${
          isDarkMode ? 'bg-indigo-900/10' : 'bg-indigo-100/35'
        }`} />
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3.5xl transition-opacityAndDelay ${
          isDarkMode ? 'bg-emerald-950/10' : 'bg-emerald-100/25'
        }`} style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-14 relative z-10 space-y-7">
        
        {/* Navigation back */}
        <button 
          onClick={() => router.push('/dashboard')}
          className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider py-2 px-3 border rounded-xl shadow-2xs transition-all pointer-events-auto cursor-pointer ${
            isDarkMode 
              ? 'bg-[#1E2521] border-[#2E3732] text-stone-300 hover:text-white hover:bg-[#2A352E]' 
              : 'bg-white/80 border-[#D9D6CE] text-calm-text-secondary hover:text-calm-text-primary'
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-calm-green-dark" />
          <span>{t.back}</span>
        </button>

        {/* Top title header */}
        <div className="flex gap-4 items-center mb-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/70 dark:border-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Brain className="w-6 h-6 fill-indigo-200/40" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-black tracking-tight">{t.title}</h1>
            <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-calm-text-secondary'}`}>
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* 1. SECTION CARD: PROFILE INFORMATION */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 sm:p-8 border shadow-xs ${
            isDarkMode ? 'bg-[#1D2421]/95 border-[#2D3833]/80' : 'bg-white/85 backdrop-blur-md border-[#D9D6CE]/80'
          }`}
        >
          <div className="flex justify-between items-start gap-4 flex-wrap border-b border-gray-150/10 dark:border-stone-800 pb-5 mb-5">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-display">{t.profileTitle}</h2>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-calm-text-secondary'}`}>{t.profileDesc}</p>
              </div>
            </div>
            
            {!editMode && (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#29322D] hover:bg-[#344039] text-stone-200 border-[#384841]' 
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100'
                }`}
              >
                {t.editProfile}
              </button>
            )}
          </div>

          {!editMode ? (
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
              {/* Profile Avatar */}
              <div className="relative group shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={profileAvatar || `https://picsum.photos/seed/default/150`} 
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-150 shadow-sm"
                />
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-450/20" />
              </div>

              {/* Profile details */}
              <div className="space-y-3.5 flex-1 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-[#212925] border-stone-800' : 'bg-stone-50/50 border-gray-100'}`}>
                    <span className="text-[10px] uppercase font-bold text-calm-green-dark tracking-wider block mb-1">{t.nameLabel}</span>
                    <span className="text-sm font-bold block">{profileName}</span>
                  </div>
                  
                  <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-[#212925] border-stone-800' : 'bg-stone-50/50 border-gray-100'}`}>
                    <span className="text-[10px] uppercase font-bold text-calm-green-dark tracking-wider block mb-1">{t.semesterLabel}</span>
                    <span className="text-sm font-bold block">{profileSemester}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed pt-1.5 border-t border-dashed dark:border-stone-800 border-stone-200">
                  <div>
                    <span className="font-semibold text-calm-text-secondary block mb-0.5">{t.quickStat}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-calm-green h-full rounded-full transition-all" 
                          style={{ width: `${(user.stress_level || 5) * 10}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-calm-green-dark">{user.stress_level || 5}/10</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-calm-text-secondary block mb-0.5">{t.quickFactors}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.stress_factors && user.stress_factors.length > 0 ? (
                        user.stress_factors.map((f, i) => (
                          <span 
                            key={i} 
                            className="text-[9px] font-bold py-0.5 px-2 bg-calm-peach/25 text-calm-peach-dark rounded-full border border-calm-peach/30"
                          >
                            {f}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 block">-</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="edit_profile_name" className="block text-xs font-bold text-calm-text-secondary">
                    {t.nameLabel}
                  </label>
                  <input
                    id="edit_profile_name"
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                      isDarkMode 
                        ? 'bg-[#222925] border-stone-800 focus:border-calm-green' 
                        : 'bg-white border-calm-border/70 focus:border-indigo-400'
                    } focus:outline-none focus:ring-4 focus:ring-indigo-150/10`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="edit_profile_semester" className="block text-xs font-bold text-calm-text-secondary">
                    {t.semesterLabel}
                  </label>
                  <select
                    id="edit_profile_semester"
                    value={profileSemester}
                    onChange={(e) => setProfileSemester(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm cursor-pointer ${
                      isDarkMode 
                        ? 'bg-[#222925] border-stone-800' 
                        : 'bg-white border-calm-border/70'
                    } focus:outline-none`}
                  >
                    <option value="Semester 1">Semester 1 (Maba)</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4 (Intermediate)</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8 (Tingkat Akhir)</option>
                    <option value="Pascasarjana">Pascasarjana</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="avatar_seed" className="block text-xs font-bold text-calm-text-secondary">
                  Avatar Seed Generative (Picsum)
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    id="avatar_seed"
                    type="text"
                    placeholder="Contoh kata kunci avatar"
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-xl border text-xs ${
                      isDarkMode 
                        ? 'bg-[#222925] border-stone-800' 
                        : 'bg-white border-calm-border/70'
                    } focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const randomKeywords = ['forest', 'lotus', 'calm', 'ocean', 'peace', 'star', 'sun', 'sky', 'bloom'];
                      const key = randomKeywords[Math.floor(Math.random() * randomKeywords.length)] + '-' + Math.floor(Math.random() * 100);
                      setProfileAvatar(`https://picsum.photos/seed/${key}/150`);
                    }}
                    className="py-2 px-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Generate Random
                  </button>
                </div>
              </div>

              {profileSuccessMsg && (
                <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> {profileSuccessMsg}
                </p>
              )}

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setProfileName(user.name);
                    setProfileSemester(user.semester);
                    setProfileAvatar(user.avatar);
                    setEditMode(false);
                  }}
                  className="py-2 px-4 bg-stone-100 dark:bg-stone-800 text-xs font-bold rounded-xl hover:bg-stone-200 cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-indigo-600 border border-indigo-700 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.saveProfile}</span>
                </button>
              </div>
            </form>
          )}

        </motion.div>

        {/* 2. SECTION CARD: LANGUAGE PREFERENCES */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`rounded-3xl p-6 sm:p-8 border shadow-xs ${
            isDarkMode ? 'bg-[#1D2421]/95 border-[#2D3833]/80' : 'bg-white/85 backdrop-blur-md border-[#D9D6CE]/80'
          }`}
        >
          <div className="flex gap-4 items-start border-b border-gray-150/10 dark:border-stone-800 pb-5 mb-5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-400/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display">{t.langTitle}</h2>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-calm-text-secondary'}`}>{t.langDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <button
              onClick={() => handleLanguageChange('id')}
              className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                language === 'id' 
                  ? 'bg-orange-50/50 border-orange-200 text-orange-700 shadow-xs dark:bg-orange-950/20 dark:border-orange-800 dark:text-orange-400' 
                  : 'bg-stone-50/50 hover:bg-stone-100 border-stone-200 dark:bg-[#202824] dark:border-stone-800 hover:dark:bg-stone-800 opacity-70'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-red-500 block shrink-0 border border-red-200" />
              <span>{t.idLabel}</span>
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                language === 'en' 
                  ? 'bg-orange-50/50 border-orange-200 text-orange-700 shadow-xs dark:bg-orange-950/20 dark:border-orange-800 dark:text-orange-400' 
                  : 'bg-stone-50/50 hover:bg-stone-100 border-stone-200 dark:bg-[#202824] dark:border-stone-800 hover:dark:bg-stone-800 opacity-70'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-blue-600 block shrink-0 border border-blue-250" />
              <span>{t.enLabel}</span>
            </button>
          </div>
        </motion.div>

        {/* 3. SECTION CARD: NOTIFICATION PREFERENCES */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-3xl p-6 sm:p-8 border shadow-xs ${
            isDarkMode ? 'bg-[#1D2421]/95 border-[#2D3833]/80' : 'bg-white/85 backdrop-blur-md border-[#D9D6CE]/80'
          }`}
        >
          <div className="flex gap-4 items-start border-b border-gray-150/10 dark:border-stone-800 pb-5 mb-5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 fill-teal-150/20" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display">{t.notifTitle}</h2>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-calm-text-secondary'}`}>{t.notifDesc}</p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Reminder Journal Daily */}
            <div className="flex justify-between items-start gap-3.5">
              <div className="space-y-1">
                <p className="text-xs font-bold font-display">{t.reminderj}</p>
                <p className={`text-[11px] leading-relaxed max-w-md ${isDarkMode ? 'text-gray-400' : 'text-calm-text-secondary'}`}>
                  {t.reminderjDesc}
                </p>
                
                {journalReminder && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex gap-2 items-center pt-2"
                  >
                    <Clock className="w-3.5 h-3.5 text-calm-green-dark" />
                    <span className="text-[11px] font-semibold text-calm-text-secondary">{t.selectTime}:</span>
                    <input
                      type="time"
                      value={journalTime}
                      onChange={(e) => handleJournalTimeChange(e.target.value)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold border transition ${
                        isDarkMode 
                          ? 'bg-stone-800 border-stone-700 text-stone-200' 
                          : 'bg-stone-100 border-[#D9D6CE] text-calm-text-primary'
                      }`}
                    />
                  </motion.div>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => handleJournalReminderToggle(!journalReminder)}
                className={`w-11 h-6 rounded-full transition-colors relative duration-300 flex items-center shrink-0 cursor-pointer ${
                  journalReminder ? 'bg-[#A8B59A]' : 'bg-stone-300 dark:bg-stone-700'
                }`}
                aria-label="Toggle Journal Reminder"
              >
                <span className={`w-4.5 h-4.5 bg-white rounded-full shadow-xs transform absolute transition-transform duration-300 ${
                  journalReminder ? 'translate-x-5.5' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Reminder Breathing Practice */}
            <div className="flex justify-between items-start gap-4 pt-4 border-t border-dashed dark:border-stone-800 border-stone-200">
              <div className="space-y-1">
                <p className="text-xs font-bold font-display">{t.reminderb}</p>
                <p className={`text-[11px] leading-relaxed max-w-md ${isDarkMode ? 'text-gray-400' : 'text-calm-text-secondary'}`}>
                  {t.reminderbDesc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleBreathingReminderToggle(!breathingReminder)}
                className={`w-11 h-6 rounded-full transition-colors relative duration-300 flex items-center shrink-0 cursor-pointer ${
                  breathingReminder ? 'bg-[#A8B59A]' : 'bg-stone-300 dark:bg-stone-700'
                }`}
                aria-label="Toggle Breathing Reminder"
              >
                <span className={`w-4.5 h-4.5 bg-white rounded-full shadow-xs transform absolute transition-transform duration-300 ${
                  breathingReminder ? 'translate-x-5.5' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Reminder Pending Tasks */}
            <div className="flex justify-between items-start gap-4 pt-4 border-t border-dashed dark:border-stone-800 border-stone-200">
              <div className="space-y-1">
                <p className="text-xs font-bold font-display">{t.remindert}</p>
                <p className={`text-[11px] leading-relaxed max-w-md ${isDarkMode ? 'text-gray-400' : 'text-calm-text-secondary'}`}>
                  {t.remindertDesc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleTasksReminderToggle(!pendingTasksReminder)}
                className={`w-11 h-6 rounded-full transition-colors relative duration-300 flex items-center shrink-0 cursor-pointer ${
                  pendingTasksReminder ? 'bg-[#A8B59A]' : 'bg-stone-300 dark:bg-stone-700'
                }`}
                aria-label="Toggle Tasks Reminder"
              >
                <span className={`w-4.5 h-4.5 bg-white rounded-full shadow-xs transform absolute transition-transform duration-300 ${
                  pendingTasksReminder ? 'translate-x-5.5' : 'translate-x-1'
                }`} />
              </button>
            </div>

          </div>
        </motion.div>

        {/* 4. SECTION CARD: APPEARANCE PREFERENCES */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`rounded-3xl p-6 sm:p-8 border shadow-xs ${
            isDarkMode ? 'bg-[#1D2421]/95 border-[#2D3833]/80' : 'bg-white/85 backdrop-blur-md border-[#D9D6CE]/80'
          }`}
        >
          <div className="flex gap-4 items-start border-b border-gray-150/10 dark:border-stone-800 pb-5 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              {isDarkMode ? <Moon className="w-5 h-5 fill-purple-150/10" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold font-display">{t.displayTitle}</h2>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-calm-text-secondary'}`}>{t.displayDesc}</p>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold font-display">{t.darkMode}</p>
              <p className={`text-[11px] leading-relaxed max-w-md ${isDarkMode ? 'text-gray-400' : 'text-calm-text-secondary'}`}>
                {t.darkModeDesc}
              </p>
              <span className={`inline-block py-0.5 px-2 rounded-md font-mono text-[9px] font-bold mt-1 ${
                isDarkMode ? 'bg-[#3A2A47]/40 text-[#CDD1F1] border border-[#523F61]' : 'bg-yellow-55/65 text-yellow-800 border border-yellow-200'
              }`}>
                {isDarkMode ? t.themeStatusDark : t.themeStatusLight}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleDarkModeToggle(!isDarkMode)}
              className={`w-11 h-6 rounded-full transition-colors relative duration-300 flex items-center shrink-0 cursor-pointer ${
                isDarkMode ? 'bg-[#9370DB]' : 'bg-stone-300 dark:bg-stone-700'
              }`}
              aria-label="Toggle Dark Mode"
            >
              <span className={`w-4.5 h-4.5 bg-white rounded-full shadow-xs transform absolute transition-transform duration-300 ${
                isDarkMode ? 'translate-x-5.5' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </motion.div>

        {/* 5. SECTION CARD: PRIVACY SAFEGUARD */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-3xl p-6 sm:p-8 border shadow-xs ${
            isDarkMode ? 'bg-[#1D2421]/95 border-[#2D3833]/80' : 'bg-white/85 backdrop-blur-md border-[#D9D6CE]/80'
          }`}
        >
          <div className="flex gap-4 items-start border-b border-gray-150/10 dark:border-stone-800 pb-5 mb-5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 dark:bg-pink-400/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display">{t.privacyTitle}</h2>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-calm-text-secondary'}`}>{t.privacyDesc}</p>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold font-display">{t.anonMode}</p>
              <p className={`text-[11px] leading-relaxed max-w-md ${isDarkMode ? 'text-gray-400' : 'text-calm-text-secondary'}`}>
                {t.anonModeDesc}
              </p>
              {isAnonymousChat && (
                <span className="inline-block py-0.5 px-2 bg-emerald-50 dark:bg-emerald-950/25 text-emerald-700 dark:text-emerald-400 rounded-md text-[9px] font-bold tracking-wide mt-1 animate-pulse border border-emerald-100 dark:border-emerald-900/40">
                  {t.anonymizedText}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleAnonymousToggle(!isAnonymousChat)}
              className={`w-11 h-6 rounded-full transition-colors relative duration-300 flex items-center shrink-0 cursor-pointer ${
                isAnonymousChat ? 'bg-[#A8B59A]' : 'bg-stone-300 dark:bg-stone-700'
              }`}
              aria-label="Toggle Anonymous Mode"
            >
              <span className={`w-4.5 h-4.5 bg-white rounded-full shadow-xs transform absolute transition-transform duration-300 ${
                isAnonymousChat ? 'translate-x-5.5' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </motion.div>

        {/* 6. SECTION CARD: ACCOUNT MANAGEMENT */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`rounded-3xl p-6 sm:p-8 border shadow-xs space-y-5 ${
            isDarkMode ? 'bg-[#1D2421]/95 border-[#2D3833]/80' : 'bg-white/85 backdrop-blur-md border-[#D9D6CE]/80'
          }`}
        >
          <div className="flex gap-4 items-start border-b border-gray-150/10 dark:border-stone-800 pb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 fill-blue-150/10" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display">{t.accountTitle}</h2>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-calm-text-secondary'}`}>{t.accountDesc}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPasswordOpen(!passwordOpen)}
              className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-xs font-semibold rounded-2xl border dark:border-stone-700 transition flex items-center gap-2 cursor-pointer"
            >
              <span>{t.changePass}</span>
              <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${passwordOpen ? 'rotate-90' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl transition flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.logout}</span>
            </button>
          </div>

          <AnimatePresence>
            {passwordOpen && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handlePasswordSubmit}
                className={`p-4 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-4 pt-4 mt-4 ${
                  isDarkMode ? 'bg-[#1E2522]' : 'bg-stone-50/50'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="curr_pass" className="block text-[11px] font-bold text-calm-text-secondary">{t.currPass}</label>
                    <input
                      id="curr_pass"
                      type={showPass ? "text" : "password"}
                      required
                      value={currPassword}
                      onChange={(e) => setCurrPassword(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        isDarkMode ? 'bg-[#29322E] border-stone-700' : 'bg-white border-[#D9D6CE]'
                      } focus:outline-none`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="new_pass" className="block text-[11px] font-bold text-calm-text-secondary">{t.newPass}</label>
                    <input
                      id="new_pass"
                      type={showPass ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        isDarkMode ? 'bg-[#29322E] border-stone-700' : 'bg-white border-[#D9D6CE]'
                      } focus:outline-none`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="conf_pass" className="block text-[11px] font-bold text-calm-text-secondary">{t.confPass}</label>
                    <div className="relative">
                      <input
                        id="conf_pass"
                        type={showPass ? "text" : "password"}
                        required
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                        className={`w-full pl-3 pr-8 py-2 text-xs rounded-xl border ${
                          isDarkMode ? 'bg-[#29322E] border-stone-700' : 'bg-white border-[#D9D6CE]'
                        } focus:outline-none`}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPass(!showPass)}
                        className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPass ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {passErrorMsg && (
                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1" role="alert">
                    <span>⚠</span> {passErrorMsg}
                  </p>
                )}

                {passSuccessMsg && (
                  <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> {passSuccessMsg}
                  </p>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    id="btn_save_password_settings"
                    type="submit"
                    className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Atur Sandi Baru
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Danger Zone */}
          <div className="border-t dark:border-stone-850 border-stone-200/50 pt-5 space-y-3.5">
            <div className="flex items-center gap-1.5 text-rose-500">
              <AlertCircle className="w-4.5 h-4.5" />
              <h4 className="text-xs font-bold uppercase tracking-wider font-display">{t.dangerTitle}</h4>
            </div>
            <p className={`text-[11px] leading-relaxed max-w-xl ${isDarkMode ? 'text-gray-400' : 'text-calm-text-secondary'}`}>
              {t.dangerDesc}
            </p>
            <button
              id="settings_full_reset_btn"
              type="button"
              onClick={handleEntireReset}
              className="py-2.5 px-4 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-bold rounded-2xl text-xs transition cursor-pointer flex items-center gap-2 active:scale-98"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.resetBtn}</span>
            </button>
          </div>

        </motion.div>

        {/* Support campaign metadata footer block */}
        <div className="pt-6 border-t border-calm-border/40 text-center text-xs text-calm-text-secondary tracking-wide select-none">
          <p>MindMate AI • Kampanye Sehat Akademis Universitas Indonesia</p>
          <div className="flex gap-4 justify-center items-center mt-2 font-semibold">
            <span onClick={() => router.push('/syarat-ketentuan')} className="hover:underline cursor-pointer">Syarat & Ketentuan</span>
            <span>•</span>
            <span onClick={() => router.push('/kebijakan-privasi')} className="hover:underline cursor-pointer">Kebijakan Privasi</span>
          </div>
        </div>

      </div>
    </div>
  );
}
