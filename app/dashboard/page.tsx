'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { 
  Heart, 
  Wind, 
  Sparkles, 
  CheckSquare, 
  BookOpen, 
  BarChart3, 
  LifeBuoy, 
  Settings, 
  Send, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Smile, 
  Bell, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Brain, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Lightbulb, 
  Compass,
  Play, 
  Pause, 
  RotateCcw,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Easy Markdown formatter for chat bubbles
function formatAIMessage(text: string) {
  if (!text) return "";
  
  // Clean special crisis token
  const cleanText = text.replace("URGENT_CRISIS_DETECTED", "").trim();

  const lines = cleanText.split('\n');
  return lines.map((line, idx) => {
    let content = line;
    let className = "text-sm text-calm-text-primary mb-1";

    // Header formats
    if (content.startsWith('###')) {
      content = content.replace('###', '').trim();
      className = "text-xs font-bold uppercase tracking-wider text-calm-green-dark mt-2 mb-1";
    } else if (content.startsWith('##')) {
      content = content.replace('##', '').trim();
      className = "text-sm font-bold text-calm-text-primary mt-2 mb-1";
    }

    // Bold highlights
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      parts.push(<strong key={match.index} className="font-semibold text-calm-green-dark">{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return (
      <p key={idx} className={className}>
        {parts.length > 0 ? parts : content}
      </p>
    );
  });
}

const CHIPS_LIST = [
  { text: "😭 Panik Deadline Tugas", prompt: "Aku sangat panik karena besok ada deadline tugas besar yang belum selesai sama sekali. Tolong bantu jalani ini." },
  { text: "🧠 Imposter Syndrome", prompt: "Aku merasa tidak pintar seperti teman-teman kelasku di kampus, rasanya seperti penipu. Bagaimana mengatasinya?" },
  { text: "🔋 Burnout Kuliah", prompt: "Semester ini rasanya melelahkan sekali, aku kehilangan motivasi belajar dan merasa burnout ekstrim." },
  { text: "⏳ Kebiasaan Nunda Tugas", prompt: "Aku selalu menunda tugas sampai menit terakhir (prokrastinasi), tolong bantu aku keluar dari lingkaran ini." },
  { text: "💔 Kesepian di Kampus", prompt: "Aku merasa kesepian di kampus baru ini dan sulit mencari teman kelompok belajar. Tolong hibur aku." }
];

export default function StudentDashboard() {
  const router = useRouter();
  const { 
    user, 
    isOnboarded, 
    activeTab, 
    setActiveTab, 
    chats, 
    journals, 
    tasks, 
    notifications,
    sendChatMessage, 
    clearChatHistory,
    saveJournalEntry,
    deleteJournalEntry,
    addNewTask,
    toggleTaskStep,
    deleteTaskItem,
    reframeThought,
    breakdownTask,
    getWeeklyAnalysis,
    readNotification,
    logout,
    updateStressLevel
  } = useAuth();

  useEffect(() => {
    if (!user || user.id === "student-guest") {
      router.push('/login');
    } else if (!isOnboarded) {
      router.push('/onboarding');
    }
  }, [user, isOnboarded, router]);

  // UI state states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  // Chat panel states
  const [userInput, setUserInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Reframe tool states
  const [reframeInput, setReframeInput] = useState('');
  const [reframeOutput, setReframeOutput] = useState('');
  const [reframeLoading, setReframeLoading] = useState(false);

  // Task breaker States
  const [breakerInput, setBreakerInput] = useState('');
  const [breakerLoading, setBreakerLoading] = useState(false);

  // Journal Panel states
  const [journalMood, setJournalMood] = useState('calm');
  const [journalGratitude, setJournalGratitude] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalTags, setJournalTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Breathing Pace Engine states
  const [breathPhase, setBreathPhase] = useState<'IDLE' | 'INHALE' | 'HOLD' | 'EXHALE'>('IDLE');
  const [breathTimer, setBreathTimer] = useState(4);
  const [isBreathActive, setIsBreathActive] = useState(false);
  const [breathPattern, setBreathPattern] = useState<'444' | '478'>('444'); // 4-4-4 Box or 4-7-8 Sleep
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Weekly Analysis state
  const [analysisText, setAnalysisText] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chats]);

  // Monitor crises on chats array changes
  useEffect(() => {
    const lastChat = chats[chats.length - 1];
    if (lastChat && lastChat.role === 'model' && lastChat.message.includes("URGENT_CRISIS_DETECTED")) {
      setTimeout(() => {
        setShowCrisisModal(true);
      }, 0);
    }
  }, [chats]);

  // Breath Pace Loop controller
  useEffect(() => {
    if (isBreathActive) {
      setTimeout(() => {
        setBreathPhase('INHALE');
        setBreathTimer(4);
      }, 0);
      
      let sec = 4;
      let phase: 'INHALE' | 'HOLD' | 'EXHALE' = 'INHALE';

      breathIntervalRef.current = setInterval(() => {
        sec -= 1;
        
        if (sec <= 0) {
          if (breathPattern === '444') {
            // Box breathing loop: Inhale 4s -> Hold 4s -> Exhale 4s -> Hold 4s
            if (phase === 'INHALE') {
              phase = 'HOLD';
              sec = 4;
            } else if (phase === 'HOLD') {
              phase = 'EXHALE';
              sec = 4;
            } else if (phase === 'EXHALE') {
              phase = 'INHALE';
              sec = 4;
            }
          } else {
            // 4-7-8 Relaxing: Inhale 4s -> Hold 7s -> Exhale 8s
            if (phase === 'INHALE') {
              phase = 'HOLD';
              sec = 7;
            } else if (phase === 'HOLD') {
              phase = 'EXHALE';
              sec = 8;
            } else if (phase === 'EXHALE') {
              phase = 'INHALE';
              sec = 4;
            }
          }
          setBreathPhase(phase);
        }
        setBreathTimer(sec);
      }, 1000);
    } else {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
      setTimeout(() => {
        setBreathPhase('IDLE');
        setBreathTimer(4);
      }, 0);
    }

    return () => {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
    };
  }, [isBreathActive, breathPattern]);

  if (!user) return null;

  // Handles text area action clicks in chat
  const handleSendChat = async (textToSend?: string) => {
    const text = textToSend || userInput;
    if (!text.trim()) return;
    
    setUserInput('');
    setChatLoading(true);
    await sendChatMessage(text);
    setChatLoading(false);
  };

  // Reframe action handler
  const handleReframe = async () => {
    if (!reframeInput.trim()) return;
    setReframeLoading(true);
    const output = await reframeThought(reframeInput);
    setReframeOutput(output);
    setReframeLoading(false);
  };

  // Task Breakdown action handler
  const handleTaskBreakdown = async () => {
    if (!breakerInput.trim()) return;
    setBreakerLoading(true);
    const steps = await breakdownTask(breakerInput);
    addNewTask(breakerInput, steps);
    setBreakerInput('');
    setBreakerLoading(false);
    setActiveTab('breaker'); // switch view
  };

  // Journal creation handler
  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;
    saveJournalEntry({
      mood: journalMood,
      gratitude: journalGratitude,
      content: journalContent,
      tags: journalTags.length > 0 ? journalTags : ["Harian"]
    });
    // Reset state values
    setJournalGratitude('');
    setJournalContent('');
    setJournalTags([]);
  };

  const addTag = () => {
    if (newTagInput.trim() && !journalTags.includes(newTagInput.trim())) {
      setJournalTags([...journalTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  // Loading Weekly Analysis callback
  const handleLoadAnalysis = async () => {
    setAnalysisLoading(true);
    const text = await getWeeklyAnalysis();
    setAnalysisText(text);
    setAnalysisLoading(false);
  };

  const toggleBreathTimer = () => {
    setIsBreathActive(!isBreathActive);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-calm-bg font-sans pr-0 select-none">
      
      {/* 1. LEFT SIDEBAR - Desktop Mode */}
      <aside className="hidden md:flex flex-col w-64 bg-white/70 backdrop-blur-md border-r border-[#D9D6CE] h-full p-6 shrink-0 z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-calm-green rounded-lg flex items-center justify-center text-white">
            <Brain className="w-4.5 h-4.5 fill-white/10" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-[#2B2B2B]">MindMate AI</span>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {[
            { id: 'chat', label: 'Curhat AI', icon: Heart, badge: chatLoading ? "..." : null },
            { id: 'breathe', label: 'Napas Sehat', icon: Wind },
            { id: 'reframe', label: 'Pikiran CBT', icon: Brain },
            { id: 'breaker', label: 'Pengurai Tugas', icon: CheckSquare, badge: tasks.filter(t => !t.completed).length || null },
            { id: 'journal', label: 'Journal Emosi', icon: BookOpen },
            { id: 'analytics', label: 'Analisis Stress', icon: BarChart3 },
            { id: 'crisis', label: 'Unit Darurat', icon: LifeBuoy, highlight: true },
          ].map((item) => {
            const ActiveIcon = item.icon;
            const isTabActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar_link_${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left text-xs font-semibold tracking-tight transition duration-200 cursor-pointer ${
                  isTabActive 
                    ? 'bg-[#E8C7B7]/20 text-[#2B2B2B] border border-[#E8C7B7]/30' 
                    : item.highlight 
                      ? 'text-red-650 hover:bg-red-50/50 bg-red-50/20' 
                      : 'text-[#6E6E6E] hover:text-[#2B2B2B] hover:bg-white/40'
                }`}
              >
                <span className="flex items-center gap-3">
                  <ActiveIcon className="w-4 h-4" />
                  <span>{item.label}</span>
                </span>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${isTabActive ? 'bg-white text-[#2B2B2B]' : 'bg-[#A8B59A]/10 text-[#A8B59A]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Lower Student Profile & Weekly Stress Pulse widget */}
        <div className="mt-auto">
          <div className="p-4 bg-white/50 border border-[#D9D6CE] rounded-2xl mb-4">
            <div className="text-[10px] uppercase tracking-wider text-[#6E6E6E] font-bold mb-2">Weekly Pulse</div>
            <div className="h-2 bg-[#D9D6CE] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#A8B59A] transition-all duration-500" 
                style={{ width: `${(user.stress_level / 10) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-[#6E6E6E]">Tingkat Stress</span>
              <span className="font-semibold text-calm-text-primary">
                {user.stress_level <= 4 ? "Rendah" : user.stress_level <= 7 ? "Sedang" : "Tinggi"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-t border-[#D9D6CE]/30 pt-4">
            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover border border-[#D9D6CE]" alt="profile" />
            <div>
              <div className="font-semibold text-xs text-[#2B2B2B] truncate max-w-[120px]">{user.name}</div>
              <div className="text-[10px] text-[#6E6E6E]">{user.semester} • BK</div>
            </div>
          </div>
          
          <button
            id="sidebar_logout_btn"
            onClick={logout}
            className="w-full mt-3 py-2 bg-white/30 hover:bg-red-50 hover:text-red-650 border border-[#D9D6CE] rounded-xl text-[10px] font-bold text-[#6E6E6E] transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            Logout Sesi
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER SYSTEM */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-calm-border flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-calm-green/20 rounded-lg flex items-center justify-center text-calm-green-dark">
            <Brain className="w-4.5 h-4.5 fill-calm-green/35" />
          </div>
          <span className="font-display font-bold text-sm tracking-tight text-calm-text-primary">MindMate AI</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 text-calm-text-secondary relative"
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => !n.read) && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-calm-peach-dark rounded-full animate-ping" />}
          </button>
          
          <button
            id="mobile_trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-calm-text-primary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Layer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-calm-border p-6 space-y-4 z-30 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'chat', label: 'Curhat AI', icon: Heart },
                { id: 'breathe', label: 'Napas Sehat', icon: Wind },
                { id: 'reframe', label: 'Pikiran CBT', icon: Brain },
                { id: 'breaker', label: 'Pengurai Tugas', icon: CheckSquare },
                { id: 'journal', label: 'Journal Emosi', icon: BookOpen },
                { id: 'analytics', label: 'Analisis Stress', icon: BarChart3 },
                { id: 'crisis', label: 'Unit Darurat', icon: LifeBuoy, highlight: true },
              ].map((item) => (
                <button
                  key={item.id}
                  id={`mobile_menu_link_${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 rounded-xl text-left font-semibold text-xs flex items-center gap-3 transition ${
                    activeTab === item.id 
                      ? 'bg-calm-green text-white shadow-sm' 
                      : item.highlight 
                        ? 'bg-red-50 text-red-600' 
                        : 'bg-calm-bg text-calm-text-secondary'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-calm-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={user.avatar} className="w-8 h-8 rounded-full" alt="profile" />
                <div>
                  <p className="text-xs font-bold text-calm-text-primary">{user.name}</p>
                  <p className="text-[10px] text-calm-text-secondary">{user.semester}</p>
                </div>
              </div>
              <button
                id="mobile_logout_btn"
                onClick={logout}
                className="px-3 py-1.5 border border-calm-border text-red-600 text-xs font-semibold rounded-lg"
              >
                Keluar Sesi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN VIEWPORT LAYOUT WRAPPER */}
      <main className="flex-1 flex flex-col h-full overflow-hidden pt-16 md:pt-0 z-10 relative">
        
        {/* UPPER DASHBOARD HEADER - STATUS INFOS */}
        <header className="hidden md:flex h-20 items-center justify-between px-8 bg-white/30 backdrop-blur-md border-b border-[#D9D6CE] shrink-0">
          <div>
            <h1 className="text-base font-semibold text-calm-text-primary">Selamat datang, {user.name.split(' ')[0]}.</h1>
            <p className="text-[11px] text-calm-text-secondary">Kamu telah menyelesaikan {journals.length} lembar refleksi emosi minggu ini.</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Stress level badge */}
            <div className="flex items-center gap-3 bg-white/95 px-4 py-2 rounded-2xl border border-calm-border shadow-xs">
              <span className="text-[10px] font-semibold text-calm-text-secondary uppercase tracking-wider">Tingkat Stress:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
                  const active = level <= user.stress_level;
                  let colorClass = "bg-calm-border";
                  if (active) {
                    if (user.stress_level <= 4) colorClass = "bg-emerald-400";
                    else if (user.stress_level <= 7) colorClass = "bg-amber-400";
                    else colorClass = "bg-red-400";
                  }
                  return (
                    <button
                      key={level}
                      id={`header_stress_level_dot_${level}`}
                      onClick={() => updateStressLevel(level)}
                      className={`w-2.5 h-4 rounded-sm transition-all duration-300 hover:scale-110 cursor-pointer ${colorClass}`}
                      title={`Ganti tingkat stress ke ${level} dari 10`}
                    />
                  );
                })}
              </div>
              <span className="text-xs font-extrabold text-calm-text-primary">{user.stress_level}/10</span>
            </div>

            {/* Notification bell icon dropdown */}
            <div className="relative">
              <button
                id="bell_btn"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2.5 bg-white/80 border border-calm-border rounded-xl shrink-0 transition text-calm-text-primary hover:bg-white relative cursor-pointer shadow-xs"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => !n.read) && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-calm-peach-dark rounded-full animate-bounce" />}
              </button>

              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-80 bg-white/95 backdrop-blur-md border border-calm-border rounded-2xl p-4 shadow-lg z-50 text-xs"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-calm-text-primary">Notifikasi Pengingat</h4>
                      <span className="text-[10px] text-calm-green-dark bg-calm-green/10 px-2 py-0.5 rounded-full">Aktif</span>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => readNotification(n.id)}
                          className={`p-2.5 rounded-xl border border-calm-border/50 text-[11px] leading-relaxed transition ${n.read ? 'opacity-65' : 'bg-calm-green/5 border-l-4 border-l-calm-green'}`}
                        >
                          <p className="text-calm-text-primary">{n.text}</p>
                          <span className="text-[9px] text-calm-text-secondary mt-1 block">Konfirmasi dibaca</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Quick action emergency button */}
            <button
              id="emergency_top_action"
              onClick={() => setActiveTab('crisis')}
              className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-2xl border border-red-200 transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              Darurat 119
            </button>
          </div>
        </header>

        {/* CONTAINER AND MODULE VIEWS GRID */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            
            {/* FEATURE 1: AI CHAT COMPANION */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat_tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="h-[calc(100vh-14rem)] md:h-[calc(100vh-12rem)] flex flex-col gap-4"
              >
                {/* Chat Log View */}
                <div 
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth"
                >
                  <div className="p-4 bg-calm-green/10 rounded-2xl border border-calm-green/20 flex gap-3 text-xs leading-relaxed max-w-xl mx-auto mb-4 items-start">
                    <Brain className="w-5 h-5 text-calm-green-dark shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-calm-text-primary">Penasehat Mental MindMate</p>
                      <p className="text-calm-text-secondary mt-1">
                        Aku adalah asisten AI dukungan emosional, bukan terapis medis berlisensi. Semua curhatanmu 100% aman disandikan lokal secara pribadi. Bila tertekan berat silakan mampir ke Unit Darurat.
                      </p>
                    </div>
                  </div>

                  {chats.map((msg) => {
                    const isModel = msg.role === 'model';
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex gap-3 max-w-2xl ${isModel ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                      >
                        {isModel ? (
                          <div className="w-8 h-8 rounded-full bg-[#A8B59A] text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold mt-1">AI</div>
                        ) : (
                          <img src={user.avatar} className="w-8 h-8 rounded-full border border-[#D9D6CE] shrink-0 shadow-sm mt-1 object-cover" alt="Me" />
                        )}

                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                          isModel 
                            ? 'bg-white border border-[#D9D6CE] rounded-tl-none text-[#2B2B2B]' 
                            : 'bg-[#A8B59A] text-white rounded-tr-none'
                        }`}>
                          {isModel ? formatAIMessage(msg.message) : <p className="text-white text-[13px]">{msg.message}</p>}
                        </div>
                      </div>
                    );
                  })}

                  {chatLoading && (
                    <div className="flex gap-3 mr-auto items-center">
                      <div className="w-8 h-8 rounded-full bg-[#A8B59A] text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold animate-pulse mt-1">AI</div>
                      <div className="p-4 bg-white border border-[#D9D6CE] rounded-2xl rounded-tl-none text-xs text-[#6E6E6E] flex items-center gap-1.5 shadow-xs">
                        <span className="w-1.5 h-1.5 bg-[#A8B59A] rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-[#A8B59A] rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-[#A8B59A] rounded-full animate-bounce [animation-delay:0.4s]" />
                        <span>MindMate sedang menyusun kata...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick chip responses list */}
                <div className="overflow-x-auto flex gap-2 pb-1 bg-transparent mb-1 scrollbar-none py-1">
                  {CHIPS_LIST.map((chip, idx) => (
                    <button
                      key={idx}
                      id={`prompt_chip_${idx}`}
                      onClick={() => handleSendChat(chip.prompt)}
                      className="px-4 py-2 bg-white border border-[#D9D6CE] rounded-full text-xs text-[#6E6E6E] hover:border-[#A8B59A] hover:text-[#A8B59A] transition-all shadow-xs shrink-0 cursor-pointer"
                    >
                      {chip.text}
                    </button>
                  ))}
                </div>

                {/* Chat input form text-area */}
                <div className="relative mt-2">
                  <textarea
                    id="chat_textarea_input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChat();
                      }
                    }}
                    placeholder="Bagikan apa yang ada di pikiranmu... (Tekan Enter untuk menceritakan)"
                    className="w-full bg-white border border-[#D9D6CE] rounded-3xl py-4 pl-6 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8B59A]/50 resize-none shadow-sm text-[#2B2B2B] font-sans"
                    rows={1}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      id="submit_chat_btn"
                      onClick={() => handleSendChat()}
                      disabled={chatLoading || !userInput.trim()}
                      className="p-2.5 bg-[#A8B59A] text-white rounded-full shadow-lg shadow-[#A8B59A]/30 hover:bg-[#8C997E] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0"
                      title="Kirim pesan"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* FEATURE 2: BREATHING EXERCISE TOOL */}
            {activeTab === 'breathe' && (
              <motion.div
                key="breathe_tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md border border-[#D9D6CE] rounded-3xl p-6 sm:p-10 shadow-xs relative text-center"
              >
                <span className="px-3 py-1 bg-[#A8B59A]/15 text-[#A8B59A] text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Mindfulness Breathwork
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#2B2B2B] mt-5">Latihan Napas Menenangkan</h3>
                <p className="text-xs text-[#6E6E6E] mt-1.5 max-w-md mx-auto leading-relaxed">
                  Gunakan teknik penstabilan ritme jantung untuk menghentikan respon cemas, panik, atau kewalahan akibat tumpukan modul kuliah.
                </p>

                {/* Breathing Concentric Circles animation */}
                <div className="my-10 flex flex-col items-center justify-center relative min-h-[220px]">
                  <div className={`w-44 h-44 rounded-full flex items-center justify-center transition-all duration-1000 relative ${
                    breathPhase === 'INHALE' ? 'scale-115 pulsing-glow' : 
                    breathPhase === 'HOLD' ? 'scale-115' : 
                    breathPhase === 'EXHALE' ? 'scale-90 shadow-inner' : 'scale-100 shadow-sm'
                  }`}>
                    {/* Pulsing overlay background circle */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#A8B59A] to-[#E8C7B7] opacity-25 animate-pulse duration-[3500ms] -z-10" />
                    
                    {/* Central gradient ball */}
                    <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-[#A8B59A] to-[#E8C7B7] flex flex-col items-center justify-center ring-8 ring-white shadow-md transition-transform duration-1000">
                      <p className="text-[10px] font-bold text-white uppercase tracking-wider mb-0.5">
                        {breathPhase === 'IDLE' ? 'Siap' : 
                         breathPhase === 'INHALE' ? 'Tarik Napas' : 
                         breathPhase === 'HOLD' ? 'Tahan Napas' : 'Buang Napas'}
                      </p>
                      <span className="text-white font-black text-2xl tracking-tight leading-none">
                        {breathTimer}s
                      </span>
                    </div>
                  </div>
                </div>

                {/* Strategy Controls Selector */}
                <div className="flex justify-center gap-3 mb-6">
                  <button
                    id="breath_mode_444"
                    onClick={() => setBreathPattern('444')}
                    disabled={isBreathActive}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition duration-200 cursor-pointer ${breathPattern === '444' ? 'bg-[#A8B59A] text-white border-[#A8B59A]' : 'bg-white border-[#D9D6CE] text-[#6E6E6E] hover:bg-slate-50'}`}
                  >
                    Box Breathing (4-4-4)
                  </button>
                  <button
                    id="breath_mode_478"
                    onClick={() => setBreathPattern('478')}
                    disabled={isBreathActive}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition duration-200 cursor-pointer ${breathPattern === '478' ? 'bg-[#A8B59A] text-white border-[#A8B59A]' : 'bg-white border-[#D9D6CE] text-[#6E6E6E] hover:bg-slate-50'}`}
                  >
                    Relaxing Sleep (4-7-8)
                  </button>
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    id="breath_toggle_btn"
                    onClick={toggleBreathTimer}
                    className="py-3 px-8 bg-[#A8B59A] hover:bg-[#8C997E] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition shadow-sm"
                  >
                    {isBreathActive ? (
                      <>
                        <Pause className="w-4 h-4" /> Istirahatkan Sesi
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-white fill-white" /> Mulai Olah Napas
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* FEATURE 3: CBT REFRAME THOUGHT ENGINE */}
            {activeTab === 'reframe' && (
              <motion.div
                key="reframe_tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="max-w-2xl mx-auto space-y-6"
              >
                <div className="bg-white/70 backdrop-blur-md border border-[#D9D6CE] rounded-3xl p-6 sm:p-8 shadow-xs">
                  <div className="flex gap-3 items-start mb-6">
                    <div className="w-10 h-10 bg-[#A8B59A]/10 rounded-xl flex items-center justify-center text-[#A8B59A] shrink-0">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#2B2B2B]">Penata Kembali Pola Pikir (CBT Reframe)</h3>
                      <p className="text-xs text-[#6E6E6E] mt-1 leading-relaxed">
                        Pikiran negatif atau perasaan &quot;tidak cukup pintar&quot; (imposter syndrome) sering kali timbul di universitas. Tulis pikiran tersebut di bawah dan dapatkan konstruksi pemikiran yang jauh lebih sehat dari asisten AI.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#6E6E6E] uppercase mb-2">Pikiran Negatif Kuliahmu</label>
                      <textarea
                        id="reframe_input"
                        value={reframeInput}
                        onChange={(e) => setReframeInput(e.target.value)}
                        placeholder="Contoh: Aku pasti dapat nilai jelek di ujian RPL ini, teman yang lain jauh lebih pintar daripada aku..."
                        className="w-full p-4 bg-white/65 border border-[#D9D6CE] rounded-2xl h-24 focus:outline-none focus:ring-2 focus:ring-[#A8B59A]/30 text-sm leading-relaxed text-[#2B2B2B] font-sans"
                      />
                    </div>

                    <button
                      id="submit_reframe_btn"
                      onClick={handleReframe}
                      disabled={reframeLoading || !reframeInput.trim()}
                      className="py-3 px-6 bg-[#A8B59A] hover:bg-[#8C997E] disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-xs font-bold rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      {reframeLoading ? "Menata Pola Pikir Baru..." : "Konstruksikan Pikiran Baru"}
                      <Sparkles className="w-4 h-4 fill-white" />
                    </button>
                  </div>
                </div>

                {reframeOutput && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-gradient-to-r from-[#A8B59A]/5 via-[#E8C7B7]/10 to-transparent border border-[#D9D6CE] rounded-3xl"
                  >
                    <div className="flex items-center gap-2 text-[#A8B59A] mb-3">
                      <Sparkles className="w-4 h-4 fill-[#A8B59A]/10" />
                      <span className="text-xs font-bold uppercase tracking-wider">CBT Perspektif Sehat</span>
                    </div>
                    
                    <div className="text-sm leading-relaxed text-[#2B2B2B] pr-4 italic">
                      &quot;{reframeOutput}&quot;
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* FEATURE 4: TASK BREAKDOWN CHECKLIST */}
            {activeTab === 'breaker' && (
              <motion.div
                key="breaker_tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                <div className="bg-white/70 backdrop-blur-md border border-[#D9D6CE] rounded-3xl p-6 sm:p-8 shadow-xs">
                  <div className="flex gap-3 items-start mb-6">
                    <div className="w-10 h-10 bg-[#A8B59A]/15 rounded-xl flex items-center justify-center text-[#A8B59A] shrink-0">
                      <CheckSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#2B2B2B]">Pengurai Tugas Universitas (Task Breaker)</h3>
                      <p className="text-xs text-[#6E6E6E] leading-relaxed mt-1">
                        Punya paper riset yang panjang tebal atau deadline RPL semester akhir yang membuat pusing? Cukup tulis nama tugas besar tersebut, kami urai menjadi daftar sub-tugas kecil yang gampang dicapai.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <input
                      id="breaker_input"
                      type="text"
                      value={breakerInput}
                      onChange={(e) => setBreakerInput(e.target.value)}
                      placeholder="Masukkan nama tugas (Contoh: Menulis Paper Sosiologi Hukum)"
                      className="flex-1 px-4 py-3 bg-white border border-[#D9D6CE] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A8B59A]/30 text-[#2B2B2B]"
                    />
                    <button
                      id="submit_breaker_btn"
                      onClick={handleTaskBreakdown}
                      disabled={breakerLoading || !breakerInput.trim()}
                      className="py-3 px-6 bg-[#A8B59A] hover:bg-[#8C997E] disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-2xl transition cursor-pointer shadow-sm"
                    >
                      {breakerLoading ? "Mengurai..." : "Urai Tugas"}
                    </button>
                  </div>
                </div>

                {/* Tasks List showing checklists */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-[#6E6E6E] uppercase tracking-wider">Tugas Aktif yang Sedang Diurai:</h4>
                  
                  {tasks.length === 0 ? (
                    <div className="p-8 text-center bg-white/40 border border-dashed border-[#D9D6CE] rounded-2xl">
                      <p className="text-xs text-[#6E6E6E]">Belum ada tugas yang diurai. Silakan tulis di atas!</p>
                    </div>
                  ) : (
                    tasks.map((task) => {
                      const totalSteps = task.breakdown.length;
                      const doneSteps = task.breakdown.filter(s => s.completed).length;
                      const percent = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
                      
                      return (
                        <div key={task.id} className="p-5 bg-white border border-[#D9D6CE] rounded-3xl space-y-4 shadow-xs">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                               <h3 className="text-sm font-bold text-[#2B2B2B]">{task.title}</h3>
                               <p className="text-[10px] text-[#6E6E6E] mt-0.5">Mulai diproses tanggal {new Date(task.created_at).toLocaleDateString("id-ID")}</p>
                            </div>
                            <button
                              id={`delete_task_btn_${task.id}`}
                              onClick={() => deleteTaskItem(task.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer"
                              title="Hapus urutan tugas ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Progress indicators bar */}
                          <div>
                            <div className="flex justify-between text-[11px] font-bold text-[#6E6E6E] mb-1">
                              <span>Kemajuan Pengerjaan</span>
                              <span>{doneSteps}/{totalSteps} Mikro ({percent}%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#D9D6CE] rounded-full overflow-hidden">
                              <div className="h-full bg-[#A8B59A] transition-all duration-300" style={{ width: `${percent}%` }} />
                            </div>
                          </div>

                          {/* Sub Steps checklists */}
                          <div className="space-y-2">
                            {task.breakdown.map((step) => (
                              <div
                                key={step.id}
                                onClick={() => toggleTaskStep(task.id, step.id)}
                                className={`p-3 rounded-2xl border flex items-center gap-3 text-xs font-semibold cursor-pointer transition duration-150 group ${
                                  step.completed 
                                    ? 'bg-[#A8B59A]/5 border-[#A8B59A]/20 text-[#6E6E6E] line-through' 
                                    : 'bg-white/40 border-[#D9D6CE]/60 text-[#2B2B2B] hover:border-[#A8B59A] hover:bg-white'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                                  step.completed ? 'border-[#A8B59A] bg-[#A8B59A] text-white font-extrabold' : 'border-[#D9D6CE] group-hover:border-[#A8B59A]'
                                }`}>
                                  {step.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </span>
                                <span>{step.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

            {/* FEATURE 5: JOURNAL AND MOOD DIARY */}
            {activeTab === 'journal' && (
              <motion.div
                key="journal_tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Save diary entry */}
                <div className="lg:col-span-2 bg-white/70 backdrop-blur-md border border-[#D9D6CE] rounded-3xl p-6 shadow-xs h-fit space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#E8C7B7]/15 text-[#E8C7B7]/80 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-md font-bold text-[#2B2B2B]">Naluri Cepat Syukur & Menulis Mood</h3>
                  </div>

                  <form onSubmit={handleSaveJournal} className="space-y-4">
                    {/* Mood radio selector lists with nice custom icons */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#6E6E6E] uppercase mb-2 font-display">Bagaimana Keadaan Hatimu Sekarang?</label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {[
                          { id: 'happy', label: '😊 Bahang', text: 'Senang' },
                          { id: 'calm', label: '🍃 Rileks', text: 'Tenang' },
                          { id: 'stressed', label: '🤯 Stress', text: 'Pusing' },
                          { id: 'tired', label: '🥱 Lelah', text: 'Selesai' },
                          { id: 'sad', label: '😢 Sedih', text: 'Sendu' },
                          { id: 'anxious', label: '😰 Cemas', text: 'Gelap' }
                        ].map((m) => (
                          <button
                            key={m.id}
                            id={`mood_option_${m.id}`}
                            type="button"
                            onClick={() => setJournalMood(m.id)}
                            className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer duration-150 ${
                              journalMood === m.id 
                                ? 'bg-[#E8C7B7]/30 border-[#E8C7B7] text-[#2B2B2B] font-bold shadow-xs' 
                                : 'bg-white border-[#D9D6CE] text-[#6E6E6E] hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-base">{m.label.split(' ')[0]}</span>
                            <span className="text-[10px]">{m.label.split(' ')[1]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gratitude text area */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#6E6E6E] uppercase mb-1.5">Sebutkan 1 rasa syukur kecil hari ini:</label>
                      <input
                        id="journal_gratitude_input"
                        type="text"
                        value={journalGratitude}
                        onChange={(e) => setJournalGratitude(e.target.value)}
                        placeholder="Contoh: Penjual kantin yang ramah & cuaca sore yang adem..."
                        className="w-full px-4 py-2.5 bg-white border border-[#D9D6CE] rounded-xl text-xs focus:ring-2 focus:ring-[#A8B59A]/30 text-[#2B2B2B]"
                      />
                    </div>

                    {/* Content text area */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#6E6E6E] uppercase mb-1.5 font-display">Ceritakan secara bebas (Gratis Curhat):</label>
                      <textarea
                        id="journal_content_input"
                        required
                        value={journalContent}
                        onChange={(e) => setJournalContent(e.target.value)}
                        placeholder="Tuliskan pengalaman kuliahmu, emosi, atau keluh kesah yang mengganjal..."
                        className="w-full p-4 bg-white border border-[#D9D6CE] rounded-xl h-36 text-xs focus:ring-2 focus:ring-[#A8B59A]/30 leading-relaxed text-[#2B2B2B] font-sans"
                      />
                    </div>

                    {/* TAGS SELECTOR */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#6E6E6E] uppercase mb-1.5 font-display">Kategori Emosi:</label>
                      <div className="flex gap-1.5 mb-2 flex-wrap">
                        {journalTags.map((t, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 bg-[#E8C7B7]/15 border border-[#E8C7B7]/25 text-[10px] text-[#2B2B2B] rounded-lg font-bold flex items-center gap-1.5">
                            {t}
                            <button type="button" onClick={() => setJournalTags(journalTags.filter(tag => tag !== t))} className="text-xs hover:text-red-500 font-extrabold font-sans">×</button>
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-2.5 max-w-xs">
                        <input
                          id="journal_tag_field"
                          type="text"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          placeholder="Nilai, Asmara, Kuis, Ortu"
                          className="w-full px-3 py-1.5 bg-white border border-[#D9D6CE] rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-[#A8B59A]/40 text-[#2B2B2B]"
                        />
                        <button
                          id="add_journal_tag_btn"
                          type="button"
                          onClick={addTag}
                          className="px-3 bg-slate-50 hover:bg-slate-100 text-xs text-[#2B2B2B] border border-[#D9D6CE] rounded-lg cursor-pointer"
                        >
                          Sematkan
                        </button>
                      </div>
                    </div>

                    <button
                      id="save_journal_submit_btn"
                      type="submit"
                      disabled={!journalContent.trim()}
                      className="py-3 px-6 bg-[#A8B59A] hover:bg-[#8C997E] disabled:bg-gray-350 disabled:cursor-not-allowed text-white text-xs font-bold rounded-2xl cursor-pointer shadow-sm transition"
                    >
                      Simpan Lembar Jurnal
                    </button>
                  </form>
                </div>

                {/* Calendar History Logs */}
                <div className="bg-white/70 backdrop-blur-md border border-[#D9D6CE] rounded-3xl p-6 shadow-xs h-fit space-y-4">
                  <h3 className="text-xs font-bold text-[#6E6E6E] uppercase tracking-wider mb-2">Riwayat Jurnal Emosi:</h3>
                  
                  {journals.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#6E6E6E] italic">
                      Belum ada lembar jurnal tersimpan. Mulai menulis satu hari ini!
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                      {journals.map((j) => {
                        let moodLabel = "🍃 Rileks";
                        if (j.mood === 'happy') moodLabel = "😊 Bahagia";
                        else if (j.mood === 'stressed') moodLabel = "🤯 Stress";
                        else if (j.mood === 'tired') moodLabel = "🥱 Lelah";
                        else if (j.mood === 'sad') moodLabel = "😢 Sedih";
                        else if (j.mood === 'anxious') moodLabel = "😰 Cemas";

                        return (
                          <div key={j.id} className="p-3.5 bg-white border border-[#D9D6CE] rounded-2xl relative space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="px-2 py-0.5 bg-slate-50 border border-[#D9D6CE]/45 text-[9px] font-bold text-[#6E6E6E] rounded-lg">
                                {new Date(j.created_at).toLocaleDateString("id-ID", { month: "short", day: "numeric" })}
                              </span>
                              
                              <span className="text-[10px] font-bold text-[#2B2B2B] capitalize">{moodLabel}</span>
                            </div>

                            <p className="text-[11px] text-[#6E6E6E] leading-relaxed line-clamp-3 font-sans">
                              {j.content}
                            </p>

                            {j.gratitude && (
                              <div className="text-[9px] text-[#2B2B2B] italic bg-[#E8C7B7]/15 p-1.5 rounded-lg border border-[#E8C7B7]/20 font-sans">
                                🌟 Syukur: {j.gratitude}
                              </div>
                            )}

                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100/50">
                              <div className="flex gap-1.5">
                                {j.tags?.slice(0, 3).map((tag, i) => (
                                  <span key={i} className="text-[9px] text-[#6E6E6E] bg-slate-50 px-1 rounded">#{tag}</span>
                                ))}
                              </div>
                              <button
                                id={`delete_journal_entry_${j.id}`}
                                onClick={() => deleteJournalEntry(j.id)}
                                className="text-slate-300 hover:text-red-500 transition cursor-pointer"
                                title="Hapus lembar jurnal ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
                       {/* FEATURE 6: WEEKLY ANNALYTICS WORKSPACE */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics_tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                {/* Header widget */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Stress summary card */}
                  <div className="p-5 bg-white border border-[#D9D6CE] rounded-3xl shrink-0">
                    <p className="text-[11px] font-bold text-[#6E6E6E] uppercase tracking-wider mb-2 font-display">Risiko Kelelahan (Burnout)</p>
                    <div className="flex items-end gap-3 mt-1.5">
                      <span className="text-3xl font-display font-black text-[#2B2B2B]">
                        {user.stress_level > 7 ? "Tinggi" : user.stress_level >= 5 ? "Sedang" : "Sangat Rendah"}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold mb-1.5 ${user.stress_level > 7 ? 'bg-[#E8C7B7]/25 text-[#2B2B2B] border border-[#E8C7B7]/30' : 'bg-[#A8B59A]/15 text-[#A8B59A]'}`}>
                        Skala {user.stress_level}/10
                      </span>
                    </div>
                    <p className="text-[10px] text-[#6E6E6E] mt-2">Dianalisis berkala berdasarkan data fluktuasi stress harianmu.</p>
                  </div>

                  {/* Mood consistency meter card */}
                  <div className="p-5 bg-white border border-[#D9D6CE] rounded-3xl shrink-0">
                    <p className="text-[11px] font-bold text-[#6E6E6E] uppercase tracking-wider mb-2 font-display">Konsistensi Refleksi Jurnal</p>
                    <div className="flex items-end gap-3 mt-1.5">
                      <span className="text-3xl font-display font-black text-[#2B2B2B]">
                        {journals.length} Kali
                      </span>
                      <span className="px-2 py-0.5 bg-[#A8B59A]/15 text-[#A8B59A] border border-[#A8B59A]/20 rounded-full text-[10px] font-bold mb-1.5">Aktif</span>
                    </div>
                    <p className="text-[10px] text-[#6E6E6E] mt-2">Menulis ekspresi secara konsisten terbukti mengurangi beban mental.</p>
                  </div>

                  {/* Tasks status block */}
                  <div className="p-5 bg-white border border-[#D9D6CE] rounded-3xl shrink-0">
                    <p className="text-[11px] font-bold text-[#6E6E6E] uppercase tracking-wider mb-2 font-display">Status Sub-tugas Terurai</p>
                    <div className="flex items-end gap-3 mt-1.5">
                      <span className="text-3xl font-display font-black text-[#2B2B2B]">
                        {tasks.filter(t => !t.completed).length} Tugas
                      </span>
                      <span className="px-2 py-0.5 bg-[#E8C7B7]/15 text-[#2B2B2B] border border-[#E8C7B7]/20 rounded-full text-[10px] font-bold mb-1.5">Urung Selesai</span>
                    </div>
                    <p className="text-[10px] text-[#6E6E6E] mt-2">Menyelesaikan sub-tugas kecil memberikan stimulus endorfin positif.</p>
                  </div>
                </div>

                {/* Highly visual dynamic Pure SVG Stress Level chart */}
                <div className="bg-white/70 backdrop-blur-md border border-[#D9D6CE] rounded-3xl p-6 shadow-xs">
                  <h3 className="text-xs font-bold text-[#6E6E6E] uppercase tracking-wider mb-4 font-display">Grafik Tren Tingkat Stress (Weekly Visualizer)</h3>
                  
                  {/* Elegant custom drawing of dynamic bar charts */}
                  <div className="w-full py-6 flex items-end justify-around gap-2 bg-slate-50/55 border border-[#D9D6CE]/40 rounded-2xl min-h-[220px] px-2 sm:px-6">
                    {[
                      { day: "Senin", score: 6 },
                      { day: "Selasa", score: 4 },
                      { day: "Rabu", score: 7 },
                      { day: "Kamis", score: 5 },
                      { day: "Jumat", score: 8 },
                      { day: "Sabtu", score: 3 },
                      { day: "Minggu", score: user.stress_level }
                    ].map((item, i) => {
                      // Height represented as height calculation percentage
                      const heightPercent = `${item.score * 10}%`;
                      let colorClass = "bg-[#A8B59A]/40 hover:bg-[#A8B59A]";
                      if (item.score > 7) colorClass = "bg-[#E8C7B7]/50 hover:bg-[#E8C7B7]";
                      else if (item.score >= 5) colorClass = "bg-[#A8B59A]/75 hover:bg-[#A8B59A]";

                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <span className="text-[10px] font-extrabold text-[#6E6E6E] opacity-0 group-hover:opacity-100 transition duration-150">Skor {item.score}</span>
                          <div className="w-6 sm:w-10 bg-slate-100 rounded-lg relative overflow-hidden flex items-end transition duration-300" style={{ height: "120px" }}>
                            <div className={`w-full rounded-t-md transition-all duration-700 ${colorClass}`} style={{ height: heightPercent }} />
                          </div>
                          <span className="text-[10px] font-bold text-[#2B2B2B]">{item.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Gemini-power AI analysis summary insight section */}
                <div className="bg-gradient-to-r from-[#A8B59A]/5 via-[#E8C7B7]/10 to-transparent border border-[#D9D6CE] rounded-3xl p-6 sm:p-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center text-[#A8B59A]">
                      <Sparkles className="w-5 h-5 fill-[#A8B59A]/10" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B]">AI Laporan Ringkasan Stress Mingguan</h4>
                    </div>
                    
                    <button
                      id="generate_ai_weekly_insight"
                      onClick={handleLoadAnalysis}
                      disabled={analysisLoading}
                      className="py-2.5 px-4 bg-[#A8B59A] hover:bg-[#8C997E] disabled:bg-gray-400 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      {analysisLoading ? "Membaca Analisis..." : "Riset Pola Kesehatan Emosimu"}
                    </button>
                  </div>

                  {analysisText ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs sm:text-sm text-[#2B2B2B] leading-relaxed border-t border-[#D9D6CE]/30 pt-4"
                    >
                      {formatAIMessage(analysisText)}
                    </motion.div>
                  ) : (
                    <div className="text-xs text-[#6E6E6E] border-t border-[#D9D6CE]/30 pt-4 flex items-center gap-2.5">
                      <Lightbulb className="w-4 h-4 text-[#A8B59A] shrink-0" />
                      <span>Sistem siap merangkum laporan kesehatan mentalmu. Kami akan memeriksa catatan jurnal harian, emosi, dan penanda stress lokalmu untuk merancang kesimpulan yang hangat ditenagai oleh Gemini AI.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* FEATURE 7: SETTINGS MODULE */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings_tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md border border-[#D9D6CE] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div className="flex gap-3 items-start border-b border-[#D9D6CE]/60 pb-4">
                  <div className="w-10 h-10 bg-slate-50 border border-[#D9D6CE]/55 rounded-xl flex items-center justify-center shrink-0">
                    <Settings className="w-5 h-5 text-[#6E6E6E]" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-[#2B2B2B]">Setelan Konsol & Privasi Aplikasi</h3>
                    <p className="text-xs text-[#6E6E6E] leading-relaxed mt-0.5">Kelola identitas maba/mahasiswa, kesandian lokal, serta perizinan notifikasi privat di sini.</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Account detail */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <p className="font-bold text-[#2B2B2B]">Email Akun Aktif</p>
                      <p className="text-[#6E6E6E] mt-0.5">Digunakan untuk sinkronisasi lokal</p>
                    </div>
                    <div className="text-neutral-500 font-mono text-xs select-text text-left sm:text-right self-center">{user.email}</div>
                  </div>

                  {/* Dark Mode Simulation (Standard Palette preference) */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <p className="font-bold text-[#2B2B2B]">Preferensi Visual Soft Calming Theme</p>
                      <p className="text-[#6E6E6E] mt-0.5">Visual warm eye-safe, ramah kelopak mata mahasiswa</p>
                    </div>
                    <span className="px-3 py-1.5 bg-[#A8B59A]/15 text-[#A8B59A] border border-[#A8B59A]/20 rounded-full text-[10px] font-bold">Palette Aktif</span>
                  </div>

                  {/* Data protection */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <p className="font-bold text-[#2B2B2B]">Pencegahan Bocor Data Kampus (Sandian Sandboxing)</p>
                      <p className="text-[#6E6E6E] mt-0.5">Semua data terisolasi di penyimpanan peramban lokal</p>
                    </div>
                    <span className="px-2.5 py-1 bg-[#A8B59A]/10 text-[#A8B59A] font-bold border border-[#A8B59A]/20 rounded text-[10px]">Aman Enkripsi</span>
                  </div>

                  {/* Action values */}
                  <div className="pt-4 space-y-3">
                    <h4 className="font-bold text-red-650">Wilayah Khusus (Danger Zone)</h4>
                    <p className="text-[11px] text-[#6E6E6E]">Tindakan berikut akan membersihkan seluruh sejarah obrolan AI chat, riwayat jurnal mood, pengurai tugas, dan mengembalikan setelan seperti awal.</p>
                    
                    <button
                      id="reset_entire_storage_btn"
                      onClick={() => {
                        if (confirm("Apakah kamu yakin ingin menghapus semua catatan MindMate di perambanmu?")) {
                          clearChatHistory();
                          localStorage.clear();
                          alert("Database lokal dibersihkan. Memuat ulang aplikasi.");
                          window.location.reload();
                        }
                      }}
                      className="px-4 py-2 bg-white hover:bg-red-50 border border-red-200 text-red-650 font-bold rounded-xl transition cursor-pointer"
                    >
                      Bersihkan Total Database Lokal
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
                       {/* FEATURE 8: EXPANDED CRISIS LIST */}
            {activeTab === 'crisis' && (
              <motion.div
                key="crisis_tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                <div className="bg-white border border-[#D9D6CE] p-6 sm:p-10 rounded-3xl shadow-xs overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-red-400" />
                  
                  <div className="text-center space-y-4 max-w-xl mx-auto mb-8">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto border-2 border-red-100 pulsing-glow animate-pulse">
                      <LifeBuoy className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#2B2B2B]">Pusat Bantuan & Kontak Krisis Remaja</h3>
                    <p className="text-xs text-[#6E6E6E] leading-relaxed">
                      Pikiran krisis atau kesepian akademis yang ekstrim kadang sulit dibendung sendiri. Silakan mampir ke portal darurat kami secara gratis rahasia kapan saja.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-stone-50/50 border border-[#D9D6CE] rounded-2xl text-xs space-y-3">
                      <h4 className="font-bold text-[#2B2B2B] uppercase tracking-wider font-display text-[11px]">Saluran Krisis Indonesia</h4>
                      <p className="text-[#6E6E6E] leading-relaxed">
                        Layanan darurat intervensi pencegahan bunuh diri dan gawat darurat mental:
                      </p>
                      <div className="space-y-1 sm:space-y-1.5 font-sans font-bold">
                        <p className="flex items-center gap-1.5 text-[#2B2B2B]">📞 Telepon: <span className="text-red-600 hover:underline">119 (Ekstensi 8)</span></p>
                        <p className="flex items-center gap-1.5 text-[#2B2B2B]">🌎 Web: <a href="https://www.intothelightid.org" target="_blank" className="text-[#A8B59A] hover:underline">intothelightid.org</a></p>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50/50 border border-[#D9D6CE] rounded-2xl text-xs space-y-3">
                      <h4 className="font-bold text-[#2B2B2B] uppercase tracking-wider font-display text-[11px]">Unit Konseling Kampus Utama</h4>
                      <p className="text-[#6E6E6E] leading-relaxed font-sans">
                        Konselor akademik wali, BK krisis kemahasiswaan, dan dosen penanggung jawab selalu siap membantumu menjadwalkan cuti atau keringanan tugas belajar.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-[#2B2B2B] font-bold font-sans">
                        <li>Dosen Wali Kelas</li>
                        <li>Pusat Layanan Konseling Kampus</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* 2. STICKY BOTTOM NAVIGATION BAR - Mobile View only */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#F5F4EF]/95 backdrop-blur-md border-t border-[#D9D6CE] flex items-center justify-around z-30 px-2 shadow-xs">
          {[
            { id: 'chat', label: 'Curhat', icon: Heart },
            { id: 'breathe', label: 'Napas', icon: Wind },
            { id: 'reframe', label: 'CBT', icon: Brain },
            { id: 'breaker', label: 'Tugas', icon: CheckSquare },
            { id: 'journal', label: 'Jurnal', icon: BookOpen }
          ].map((item) => {
            const ActiveIcon = item.icon;
            const isTabActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`bottom_nav_link_${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold py-1 px-3.5 rounded-lg transition duration-200 cursor-pointer ${
                  isTabActive ? 'text-[#A8B59A]' : 'text-[#6E6E6E] hover:text-[#2B2B2B]'
                }`}
              >
                <ActiveIcon className="w-5 h-5" style={{ strokeWidth: isTabActive ? 2.5 : 2 }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </main>

      {/* EMERGENCY CRISIS WARNING POP-UP MODAL */}
      <AnimatePresence>
        {showCrisisModal && (
          <div id="crisis_dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-2 border-red-500 rounded-3xl p-6 sm:p-8 max-w-md w-full relative space-y-4 shadow-xl"
            >
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="w-8 h-8 animate-bounce shrink-0" />
                <h3 className="text-lg font-bold">Kami Sangat Peduli Denganmu</h3>
              </div>

              <p className="text-xs text-[#2B2B2B] leading-relaxed font-sans">
                Kami mendeteksi bahasa atau ungkapan krisis dari pesanmu. Harap diingat, <strong>kamu tidak sendirian</strong>, dan bantuan nyata dari manusia berkuasa menyelamatkan hidup selalu tersedia kapan saja.
              </p>

              <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 text-xs text-[#2B2B2B] space-y-1.5">
                <p className="font-bold text-red-700 uppercase tracking-wide">📍 Kontak Penyelamat Jiwa (24 Jam)</p>
                <p className="font-bold flex items-center gap-1 font-sans">Hubungi Kemenkes RI: <a href="tel:119" className="text-red-600 hover:underline font-extrabold text-sm pl-0.5">119 (Ekstensi 8)</a></p>
                <p className="font-medium text-[#6E6E6E] leading-relaxed mt-1 font-sans">Layanan gratis rahasia preventif depresi berat dan intervensi bunuh diri nasional.</p>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  id="close_crisis_dialog_btn"
                  onClick={() => setShowCrisisModal(false)}
                  className="px-4 py-2 border border-[#D9D6CE] text-xs font-semibold text-[#6E6E6E] rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Tutup Notifikasi Darurat
                </button>
                <button
                  id="dialog_open_emergency_tab"
                  onClick={() => {
                    setShowCrisisModal(false);
                    setActiveTab('crisis');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Buka Portal Krisis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
