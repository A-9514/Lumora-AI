export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  lastUpdated: string; // formatted date or ISO
  isPinned?: boolean;
  isLocked?: boolean;
  pinCode?: string; // local verification PIN
}

export interface Folder {
  id: string;
  name: string;
  color: 'rose' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'teal';
  icon: string; // name of lucide icon
}

export interface Theme {
  id: string;
  name: string;
  bgClass: string;
  textClass: string;
  accentClass: string;
  cardBgClass: string;
  borderClass: string;
  gradientFrom: string;
  gradientTo: string;
  isDark: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  dueDate: string; // YYYY-MM-DD
  threatLevel?: number; // Calculated threat score (1-100)
  urgencyExplanation?: string; // AI urgency statement
  lifeSavingSteps?: string[]; // AI step-by-step guidance
  folderId?: string;
}

export interface Habit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  history: Record<string, boolean>; // YYYY-MM-DD -> completed status
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  progress: number; // 0 to 100
  status: 'active' | 'achieved' | 'paused';
}

export interface Reminder {
  id: string;
  title: string;
  time: string; // e.g. "14:30" or ISO or absolute statement
  type: 'panic' | 'nudge' | 'threat';
  taskId?: string;
  isDismissed?: boolean;
}

export interface AgentExecutionLog {
  time: string;
  type: 'info' | 'agent' | 'success' | 'warn';
  message: string;
}

export interface WeekBackup {
  id: string;
  timestamp: string;
  weekStart: string;
  weekEnd: string;
  taskCount: number;
  tasksJson: string;
}


