export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  semester: string;
  stress_level: number; // 1 to 10
  stress_factors: string[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  role: 'user' | 'model';
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  mood: string; // "happy" | "calm" | "stressed" | "tired" | "sad" | "anxious"
  gratitude: string;
  content: string;
  tags: string[];
  created_at: string;
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  breakdown: TaskItem[];
  completed: boolean;
  created_at: string;
}

export interface AnalyticsRecord {
  id: string;
  user_id: string;
  weekly_score: number; // calculated stress score
  burnout_risk: 'Low' | 'Moderate' | 'High';
  insight: string;
  created_at: string;
}

export interface RegisteredUser extends User {
  password?: string;
}

// Initial Mock Seed Data to make the app feel alive and populated out of the box!
const DEFAULT_USER: User = {
  id: "student-1",
  name: "Wirata Helmi",
  email: "wiratahelmi469@gmail.com",
  avatar: "https://picsum.photos/seed/wirata/150",
  semester: "Semester 4",
  stress_level: 6,
  stress_factors: ["Deadlines", "Exam Stress", "Procrastination"],
  created_at: new Date().toISOString(),
};

const SEED_REGISTERED_USERS: RegisteredUser[] = [
  {
    ...DEFAULT_USER,
    password: "password123",
  }
];

const DEFAULT_CHATS: ChatMessage[] = [
  {
    id: "chat-m-1",
    user_id: "student-1",
    role: "model",
    message: "Halo! Aku MindMate AI, teman curhat setiamu selama masa kuliah. Bagaimana perasaanmu hari ini? Ada tugas berat yang menumpuk atau sekadar butuh tempat bercerita?",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  }
];

const DEFAULT_JOURNALS: JournalEntry[] = [
  {
    id: "j-1",
    user_id: "student-1",
    mood: "stressed",
    gratitude: "Kopi hangat di pagi hari & teman kelompok tugas yang kooperatif.",
    content: "Minggu ini rasanya luar biasa melelahkan. Banyak kuis mendadak ditambah project akhir semester 4 yang bertumpuk. Untung masih ada waktu istirahat sejenak tadi sore.",
    tags: ["Akademik", "Kelelahan"],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "j-2",
    user_id: "student-1",
    mood: "calm",
    gratitude: "Tidur 8 jam semalam dan menyelesaikan satu slide presentasi.",
    content: "Hari ini lumayan tenang. Latihan napas 5 menit di pagi hari membantu mengurangi deg-degan sebelum presentasi. Ternyata tidak seburuk yang kubayangkan.",
    tags: ["Kesehatan", "Pemberdayaan"],
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const DEFAULT_TASKS: Task[] = [
  {
    id: "t-1",
    user_id: "student-1",
    title: "Project Akhir Rekayasa Perangkat Lunak",
    breakdown: [
      { id: "b-1", text: "Merancang Blueprint database PostgreSQL", completed: true },
      { id: "b-2", text: "Membuat Mockup UI Tailwind", completed: true },
      { id: "b-3", text: "Integrasi API Client & Test Server", completed: false },
      { id: "b-4", text: "Menulis User Manual & Deployment Guide", completed: false },
    ],
    completed: false,
    created_at: new Date().toISOString(),
  }
];

const DEFAULT_NOTIFICATIONS = [
  { id: "n-1", text: "💧 Waktunya minum air putih untuk menjaga hidrasi otakmu!", type: "hydration", read: false },
  { id: "n-2", text: "🍃 Ambil napas dalam-dalam sejenak (4-4-4) untuk meredakan ketegangan deadlines.", type: "breathe", read: false },
];

export class LocalDb {
  static isServer() {
    return typeof window === 'undefined';
  }

  static get<T>(key: string, defaultValue: T): T {
    if (this.isServer()) return defaultValue;
    try {
      const val = localStorage.getItem(`mindmate_${key}`);
      return val ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    if (this.isServer()) return;
    try {
      localStorage.setItem(`mindmate_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error("LocalDb writing error", e);
    }
  }

  // Registered Users Registry for custom accounts
  static getRegisteredUsers(): RegisteredUser[] {
    return this.get<RegisteredUser[]>("registered_users", SEED_REGISTERED_USERS);
  }

  static saveRegisteredUser(user: RegisteredUser): void {
    const list = this.getRegisteredUsers();
    const idx = list.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      list[idx] = user;
    } else {
      list.push(user);
    }
    this.set("registered_users", list);
  }

  // Active User session
  static getActiveUser(): User | null {
    return this.get<User | null>("user", null);
  }

  static setActiveUser(user: User | null): void {
    this.set("user", user);
    if (user) {
      this.set("isOnboarded", true);
    } else {
      this.set("isOnboarded", false);
    }
  }

  static getIsOnboarded(): boolean {
    return this.get<boolean>("isOnboarded", false); // Default false, onboarding required
  }

  // Chats
  static getChats(): ChatMessage[] {
    return this.get<ChatMessage[]>("chats", DEFAULT_CHATS);
  }

  static saveChat(chat: ChatMessage): void {
    const list = this.getChats();
    list.push(chat);
    this.set("chats", list);
  }

  static clearChats(): void {
    this.set("chats", [DEFAULT_CHATS[0]]);
  }

  // Journal
  static getJournals(): JournalEntry[] {
    return this.get<JournalEntry[]>("journals", DEFAULT_JOURNALS);
  }

  static saveJournal(entry: JournalEntry): void {
    const list = this.getJournals();
    // Prevent duplicated inserts
    const idx = list.findIndex(j => j.id === entry.id);
    if (idx >= 0) {
      list[idx] = entry;
    } else {
      list.unshift(entry); // Newest first
    }
    this.set("journals", list);
  }

  static deleteJournal(id: string): void {
    const list = this.getJournals().filter(j => j.id !== id);
    this.set("journals", list);
  }

  // Tasks
  static getTasks(): Task[] {
    return this.get<Task[]>("tasks", DEFAULT_TASKS);
  }

  static saveTask(task: Task): void {
    const list = this.getTasks();
    const idx = list.findIndex(t => t.id === task.id);
    if (idx >= 0) {
      list[idx] = task;
    } else {
      list.unshift(task);
    }
    this.set("tasks", list);
  }

  static deleteTask(id: string): void {
    const list = this.getTasks().filter(t => t.id !== id);
    this.set("tasks", list);
  }

  // Notifications
  static getNotifications() {
    return this.get("notifications", DEFAULT_NOTIFICATIONS);
  }

  static setNotifications(list: any[]) {
    this.set("notifications", list);
  }
}
