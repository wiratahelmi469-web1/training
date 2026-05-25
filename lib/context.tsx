'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ChatMessage, JournalEntry, Task, TaskItem, LocalDb } from './db';

let idCounter = 0;
export function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Math.random().toString(36).substring(2, 9)}`;
}

interface AuthContextType {
  user: User | null;
  isOnboarded: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  chats: ChatMessage[];
  journals: JournalEntry[];
  tasks: Task[];
  notifications: Array<{ id: string; text: string; type: string; read: boolean }>;
  
  // Auth actions
  login: (email: string, name: string) => Promise<boolean>;
  register: (email: string, name: string, semester: string) => Promise<boolean>;
  guestMode: () => void;
  onboardUser: (name: string, semester: string, stressLevel: number, factors: string[]) => void;
  logout: () => void;
  updateStressLevel: (level: number) => void;

  // Feature actions
  sendChatMessage: (content: string) => Promise<void>;
  clearChatHistory: () => void;
  saveJournalEntry: (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>) => void;
  deleteJournalEntry: (id: string) => void;
  addNewTask: (title: string, steps: string[]) => void;
  toggleTaskStep: (taskId: string, stepId: string) => void;
  deleteTaskItem: (taskId: string) => void;
  
  // AI Tools actions
  reframeThought: (thought: string) => Promise<string>;
  breakdownTask: (taskName: string) => Promise<string[]>;
  getWeeklyAnalysis: () => Promise<string>;

  // Notification actions
  readNotification: (id: string) => void;
  addNotification: (text: string, type: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const [activeTab, setActiveTabState] = useState<string>('chat');
  
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Load from database on startup
  useEffect(() => {
    let activeUser = LocalDb.getActiveUser();
    // Invalidate guest users to enforce mandatory registration/login
    if (activeUser && activeUser.id === "student-guest") {
      activeUser = null;
      LocalDb.setActiveUser(null);
    }
    const onboarded = LocalDb.getIsOnboarded();
    const loadedChats = LocalDb.getChats();
    const loadedJournals = LocalDb.getJournals();
    const loadedTasks = LocalDb.getTasks();
    const loadedNotifications = LocalDb.getNotifications();

    setTimeout(() => {
      setUser(activeUser);
      setIsOnboarded(onboarded);
      setChats(loadedChats);
      setJournals(loadedJournals);
      setTasks(loadedTasks);
      setNotifications(loadedNotifications);

      // Switch tab helper based on URL hash if any
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '');
        if (['chat', 'breathe', 'reframe', 'breaker', 'journal', 'analytics', 'settings', 'crisis'].includes(hash)) {
          setActiveTabState(hash);
        }
      }
    }, 0);
  }, []);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  };

  // Auth actions
  const login = async (email: string, name: string): Promise<boolean> => {
    const mockUser: User = {
      id: "student-" + Math.random().toString(36).substr(2, 9),
      name: name || "Teman Mahasiswa",
      email: email,
      avatar: `https://picsum.photos/seed/${name || 'mindmate'}/150`,
      semester: "Semester 3",
      stress_level: 5,
      stress_factors: ["Academic Workload"],
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    setIsOnboarded(true);
    LocalDb.setActiveUser(mockUser);
    // Reload database state
    LocalDb.clearChats();
    setChats(LocalDb.getChats());
    return true;
  };

  const register = async (email: string, name: string, semester: string): Promise<boolean> => {
    const mockUser: User = {
      id: "student-" + Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      avatar: `https://picsum.photos/seed/${name}/150`,
      semester: semester,
      stress_level: 6,
      stress_factors: ["Ujian", "Deadlines"],
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    setIsOnboarded(true);
    LocalDb.setActiveUser(mockUser);
    return true;
  };

  const guestMode = () => {
    const guestUser: User = {
      id: "student-guest",
      name: "Sahabat Anonim",
      email: "anon@univ.edu",
      avatar: "https://picsum.photos/seed/anonymous/150",
      semester: "Semester Berjalan",
      stress_level: 4,
      stress_factors: ["Gaya Hidup", "Overthinking"],
      created_at: new Date().toISOString(),
    };
    setUser(guestUser);
    setIsOnboarded(false); // To let them onboard and choose factors!
    LocalDb.setActiveUser(guestUser);
    LocalDb.set("isOnboarded", false);
  };

  const onboardUser = (name: string, semester: string, stressLevel: number, factors: string[]) => {
    if (!user) return;
    const updated = {
      ...user,
      name,
      semester,
      stress_level: stressLevel,
      stress_factors: factors,
    };
    setUser(updated);
    setIsOnboarded(true);
    LocalDb.setActiveUser(updated);
  };

  const logout = () => {
    setUser(null);
    setIsOnboarded(false);
    LocalDb.setActiveUser(null);
    LocalDb.clearChats();
  };

  const updateStressLevel = (level: number) => {
    if (!user) return;
    const updated = { ...user, stress_level: level };
    setUser(updated);
    LocalDb.setActiveUser(updated);
  };

  // Chats handling
  const sendChatMessage = async (content: string) => {
    if (!user) return;

    // Save user message
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      user_id: user.id,
      role: 'user',
      message: content,
      created_at: new Date().toISOString(),
    };

    const newChats = [...chats, userMsg];
    setChats(newChats);
    LocalDb.saveChat(userMsg);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          payload: { messages: newChats },
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Save model message
      const modelMsg: ChatMessage = {
        id: "msg-ai-" + Date.now(),
        user_id: user.id,
        role: "model",
        message: data.text,
        created_at: new Date().toISOString(),
      };

      setChats(prev => [...prev, modelMsg]);
      LocalDb.saveChat(modelMsg);

    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: "msg-err-" + Date.now(),
        user_id: user.id,
        role: "model",
        message: "Maaf, aku sedang kesulitan terhubung dengan jaringan pikiran kita. Mari coba sebentar lagi. ♥",
        created_at: new Date().toISOString(),
      };
      setChats(prev => [...prev, errMsg]);
      LocalDb.saveChat(errMsg);
    }
  };

  const clearChatHistory = () => {
    LocalDb.clearChats();
    setChats(LocalDb.getChats());
  };

  // Journal Entry
  const saveJournalEntry = (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    const item: JournalEntry = {
      ...entry,
      id: generateId("journal"),
      user_id: user.id,
      created_at: new Date().toISOString(),
    };
    LocalDb.saveJournal(item);
    setJournals(LocalDb.getJournals());
    addNotification(`Jurnal Keadaan Mood "${entry.mood}" berhasil disimpan ke sejarah kesehatan riwayatmu.`, "checkin");
  };

  const deleteJournalEntry = (id: string) => {
    LocalDb.deleteJournal(id);
    setJournals(LocalDb.getJournals());
  };

  // Tasks
  const addNewTask = (title: string, steps: string[]) => {
    if (!user) return;
    const taskItems: TaskItem[] = steps.map((s) => ({
      id: generateId("step"),
      text: s,
      completed: false,
    }));

    const item: Task = {
      id: generateId("task"),
      user_id: user.id,
      title: title,
      breakdown: taskItems,
      completed: false,
      created_at: new Date().toISOString(),
    };

    LocalDb.saveTask(item);
    setTasks(LocalDb.getTasks());
    addNotification(`Task "${title}" diurai menjadi microtasks yang siap dikerjakan!`, "task");
  };

  const toggleTaskStep = (taskId: string, stepId: string) => {
    const list = [...tasks];
    const item = list.find(t => t.id === taskId);
    if (item) {
      const step = item.breakdown.find(s => s.id === stepId);
      if (step) {
        step.completed = !step.completed;
      }
      
      // Update overall completion
      item.completed = item.breakdown.every(s => s.completed);
      LocalDb.saveTask(item);
      setTasks(LocalDb.getTasks());
    }
  };

  const deleteTaskItem = (taskId: string) => {
    LocalDb.deleteTask(taskId);
    setTasks(LocalDb.getTasks());
  };

  // AI Actions with Gemini
  const reframeThought = async (thought: string): Promise<string> => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reframe",
          payload: { thought },
        }),
      });
      const data = await response.json();
      return data.text || "Tidak ada hasil reframe yang didapat.";
    } catch {
      return "Koneksi terganggu. Tarik napas dalam-dalam, hargai dirimu, dan coba kembali sesaat lagi.";
    }
  };

  const breakdownTask = async (taskName: string): Promise<string[]> => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "breakdown",
          payload: { task: taskName },
        }),
      });
      const data = await response.json();
      const rawText = data.text || "";
      // Parse list from Markdown text
      const steps = rawText
        .split("\n")
        .map((line: string) => line.trim())
        .filter((line: string) => line.startsWith("-") || line.startsWith("*") || /^\d+\./.test(line))
        .map((line: string) => line.replace(/^[-*\d.]+\s*/, ""));
      
      return steps.length > 0 ? steps : ["Langkah 1: Siapkan agenda tulis", "Langkah 2: Selesaikan subbab pertama", "Langkah 3: Beri dirimu istirahat 5 menit"];
    } catch {
      return [
        "Persiapan: Jauhkan gangguan dari sekitarmu",
        "Tahap 1: Kerjakan 25 menit pertama dengan teknik Pomodoro",
        "Tahap 2: Tinjau kembali pekerjaan draf awal",
        "Penyelesaian: Kirim atau simpan cadangan hasil tugas"
      ];
    }
  };

  const getWeeklyAnalysis = async (): Promise<string> => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analytics",
          payload: {
            journals,
            stressScore: user?.stress_level || 5,
            recentMoods: journals.map(j => j.mood),
          },
        }),
      });
      const data = await response.json();
      return data.text || "Tidak dapat memuat ringkasan emosional minggu ini.";
    } catch {
      return "Analisis stress mingguanmu menunjukkan bahwa belajar konsisten dan sela waktu jeda 10 menit sangat direkomendasikan untuk menghindari burnout akademis.";
    }
  };

  // Notification management
  const readNotification = (id: string) => {
    const list = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(list);
    LocalDb.setNotifications(list);
  };

  const addNotification = (text: string, type: string) => {
    const newNotif = {
      id: "notif-" + Date.now(),
      text,
      type,
      read: false,
    };
    const list = [newNotif, ...notifications.slice(0, 9)];
    setNotifications(list);
    LocalDb.setNotifications(list);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isOnboarded,
        activeTab,
        setActiveTab,
        chats,
        journals,
        tasks,
        notifications,
        login,
        register,
        guestMode,
        onboardUser,
        logout,
        updateStressLevel,
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
        addNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
