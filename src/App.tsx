import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  User,
  FolderKanban,
  Lightbulb,
  Compass,
  Heart,
  Search,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Trash2,
  Pin,
  Lock,
  Unlock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowLeft,
  Home,
  Save,
  Moon,
  Sun,
  Palette,
  Tag,
  Eye,
  EyeOff,
  Check,
  X,
  FileText,
  Info,
  Clock,
  AlarmClock,
  Folder as FolderIcon,
  Calendar,
  ListTodo,
  CheckSquare,
  Square,
  Brain,
  AlertCircle,
  Activity,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Mic,
  Zap,
  Target,
  Award,
  Flame,
  Bell,
  Play,
  Terminal,
  RotateCcw,
  Send,
  Volume2,
  Download,
  Database,
  Upload
} from 'lucide-react';
import { Note, Folder, Theme, Task, Habit, Goal, Reminder, AgentExecutionLog, WeekBackup } from './types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// -------------------------------------------------------------
// DATA CONSTANTS
// -------------------------------------------------------------

const DEFAULT_FOLDERS: Folder[] = [
  { id: 'work', name: 'Work', color: 'indigo', icon: 'Briefcase' },
  { id: 'personal', name: 'Personal', color: 'rose', icon: 'User' },
  { id: 'projects', name: 'Projects', color: 'purple', icon: 'FolderKanban' },
  { id: 'ideas', name: 'Ideas', color: 'amber', icon: 'Lightbulb' },
  { id: 'inspiration', name: 'Inspiration', color: 'teal', icon: 'Compass' },
  { id: 'health', name: 'Health', color: 'emerald', icon: 'Heart' }
];

const DEFAULT_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Weekly Team Meeting',
    content: 'Discuss project timeline, action tasks, and milestone targets for the next sprint. Focus on the final delivery and resolve any blockers with the tech leads.',
    folderId: 'work',
    tags: ['meeting', 'team'],
    lastUpdated: '2 hours ago',
    isPinned: true
  },
  {
    id: 'note-2',
    title: 'Project Requirements',
    content: 'Detailed requirements for the new client dashboard. Ensure that we include all API specs, multi-view tabs, and mobile-responsive layouts.',
    folderId: 'work',
    tags: ['project', 'requirements'],
    lastUpdated: '2 days ago'
  },
  {
    id: 'note-3',
    title: 'Weekly Groceries',
    content: 'Buy fresh tomatoes, spinach, organic milk, sourdough bread, avocado, and Greek yogurt for the meal prep.',
    folderId: 'personal',
    tags: ['shopping', 'grocery'],
    lastUpdated: '1 hour ago'
  },
  {
    id: 'note-4',
    title: 'Journal Entry: Morning Reflections',
    content: 'Today I woke up early and watched the sunrise. Feeling clear-headed and ready to tackle the coding challenges today.',
    folderId: 'personal',
    tags: ['journal', 'mindfulness'],
    lastUpdated: '3 days ago'
  },
  {
    id: 'note-5',
    title: 'Website Redesign Specs',
    content: 'Modern minimalist styling using Tailwind CSS, fluid animations with Motion, and customized typography. Keep it clean and high-contrast.',
    folderId: 'projects',
    tags: ['design', 'tailwind'],
    lastUpdated: '4 hours ago',
    isPinned: true
  },
  {
    id: 'note-6',
    title: 'Watercolor Brush Physics App',
    content: 'A web canvas paint program that simulates fluid watercolor bleeding and blending with realistic brush friction. Could use WebGL.',
    folderId: 'ideas',
    tags: ['coding', 'design'],
    lastUpdated: '30 minutes ago'
  },
  {
    id: 'note-7',
    title: "Nature's Own Light Show",
    content: "There is something intriguing about how light filters through leaves in the morning. Watching the shapes dance on the floor is pure art.",
    folderId: 'inspiration',
    tags: ['nature', 'creative'],
    lastUpdated: '3 hours ago'
  },
  {
    id: 'note-8',
    title: 'Cardio & Strength Routine',
    content: '30 minutes zone-2 jogging on Mondays, kettlebell full body circuit on Wednesdays, and deep stretching/yoga flow on Fridays.',
    folderId: 'health',
    tags: ['fitness', 'workout'],
    lastUpdated: '12 hours ago'
  }
];

const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finalize Project Launch Specification',
    description: 'Complete the full system diagram, write API request/response schemas, and detail the security rules for deployment.',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-06-29',
    threatLevel: 85,
    urgencyExplanation: 'Due tonight! This blocks the entire front-end engineering timeline if delayed.',
    lifeSavingSteps: [
      'Document key collection paths and rules.',
      'Test API endpoints locally using curl and test scripts.',
      'Commit specs to the repository and approval channel.'
    ]
  },
  {
    id: 'task-2',
    title: 'Prepare Presentation Slides for Showcase',
    description: 'Create 10 high-impact visual slides detailing achievements and milestone plans.',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-06-30'
  },
  {
    id: 'task-3',
    title: 'Review Frontend Code Pull Requests',
    description: 'Check quality, run local build to verify zero errors, and approve staging merge.',
    priority: 'low',
    status: 'completed',
    dueDate: '2026-06-29'
  },
  {
    id: 'task-4',
    title: 'Draft Content Outline for Marketing Campaign',
    description: 'List 5 topics, formulate social hooks, and outline distribution templates.',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-07-02'
  }
];

const THEMES: Theme[] = [
  {
    id: 'classic',
    name: 'Lumora Light',
    bgClass: 'bg-slate-50',
    textClass: 'text-slate-950',
    accentClass: 'text-purple-700 bg-purple-100 hover:bg-purple-200 border-purple-200',
    cardBgClass: 'bg-white border-slate-200',
    borderClass: 'border-slate-200',
    gradientFrom: '#f1f5f9',
    gradientTo: '#f8fafc',
    isDark: false
  },
  {
    id: 'amber',
    name: 'Lumora Amber',
    bgClass: 'bg-amber-50/60',
    textClass: 'text-slate-950',
    accentClass: 'text-amber-850 bg-amber-100 hover:bg-amber-200 border-amber-200',
    cardBgClass: 'bg-white border-amber-150',
    borderClass: 'border-amber-200',
    gradientFrom: '#fdfbf7',
    gradientTo: '#fefcf9',
    isDark: false
  },
  {
    id: 'mint',
    name: 'Lumora Mint',
    bgClass: 'bg-emerald-50/60',
    textClass: 'text-slate-950',
    accentClass: 'text-emerald-850 bg-emerald-100 hover:bg-emerald-200 border-emerald-200',
    cardBgClass: 'bg-white border-emerald-150',
    borderClass: 'border-emerald-200',
    gradientFrom: '#f4fbf7',
    gradientTo: '#f9fdfb',
    isDark: false
  },
  {
    id: 'cosmic',
    name: 'Lumora Cosmic',
    bgClass: 'bg-[#030014] text-slate-100',
    textClass: 'text-slate-100',
    accentClass: 'text-fuchsia-300 bg-purple-950/60 hover:bg-purple-900 border-purple-900/40',
    cardBgClass: 'bg-[#0a0524] border-purple-950/80',
    borderClass: 'border-purple-950/60',
    gradientFrom: '#030014',
    gradientTo: '#0b0128',
    isDark: true
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function App() {
  // -------------------------------------------------------------
  // STATE DEFINITIONS
  // -------------------------------------------------------------
  const [isEntered, setIsEntered] = useState(() => {
    return sessionStorage.getItem('hub_entered') === 'true';
  });

  const [activeTheme, setActiveTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('active_theme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const found = THEMES.find((t) => t.id === parsed.id);
        if (found) return found;
      } catch (e) {
        // Fallback
      }
    }
    return THEMES[0];
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('bliss_notes');
    return saved ? JSON.parse(saved) : DEFAULT_NOTES;
  });

  const [activeFolderId, setActiveFolderId] = useState<string>('all'); // 'all' or specific ID
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

  // Carousel slider active page (0 to 4)
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  // Editor states (temporary)
  const [editorTitle, setEditorTitle] = useState<string>('');
  const [editorContent, setEditorContent] = useState<string>('');
  const [editorFolderId, setEditorFolderId] = useState<string>('work');
  const [editorTagsText, setEditorTagsText] = useState<string>('');

  // Lock note secure states
  const [lockPIN, setLockPIN] = useState<string>('');
  const [noteToLockUnlock, setNoteToLockUnlock] = useState<Note | null>(null);
  const [isLockingModalOpen, setIsLockingModalOpen] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [unlockedNotes, setUnlockedNotes] = useState<string[]>([]); // Temp session unlocks

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tab control: 'notes' | 'planner'
  const [activeTab, setActiveTab] = useState<'notes' | 'planner'>('notes');

  // Tasks states
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('bliss_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  // Demo States for high-fidelity interactive simulation
  const [demoActive, setDemoActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);
  const [demoStatusText, setDemoStatusText] = useState<string>('');

  // Selected date on the Calendar (default is today: June 29, 2026)
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-29');

  // Task creation/editing modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form states for adding/editing a task
  const [taskTitleInput, setTaskTitleInput] = useState<string>('');
  const [taskDescInput, setTaskDescInput] = useState<string>('');
  const [taskPriorityInput, setTaskPriorityInput] = useState<'high' | 'medium' | 'low'>('medium');
  const [taskDateInput, setTaskDateInput] = useState<string>('2026-06-29');

  // AI Scheduling and recommendation results
  const [aiPlan, setAiPlan] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Floating Assistant States
  const [assistantOpen, setAssistantOpen] = useState<boolean>(false);
  const [assistantMessage, setAssistantMessage] = useState<string>('Want me to rearrange your evening?');

  // User Vibe inputs for AI scheduling assistance
  const [userStress, setUserStress] = useState<string>('Moderate');
  const [userVibe, setUserVibe] = useState<string>('Focused');
  const [hoursLeft, setHoursLeft] = useState<number>(4);

  // Current view of the calendar month (June is 5, 0-indexed)
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(5);

  // --- New features state variables ---
  const [innerPlannerTab, setInnerPlannerTab] = useState<'calendar' | 'habits'>('calendar');

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('bliss_habits');
    return saved ? JSON.parse(saved) : [
      { id: 'h-1', title: '🚀 Deep Work Block (1h)', frequency: 'daily', streak: 4, history: { '2026-06-28': true, '2026-06-27': true, '2026-06-26': true }, createdAt: '2026-06-25' },
      { id: 'h-2', title: '💧 Standard Hydration', frequency: 'daily', streak: 12, history: { '2026-06-28': true }, createdAt: '2026-06-15' },
      { id: 'h-3', title: '📚 Weekly Goal Alignment Review', frequency: 'weekly', streak: 2, history: { '2026-06-28': true }, createdAt: '2026-06-10' }
    ];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('bliss_goals');
    return saved ? JSON.parse(saved) : [
      { id: 'g-1', title: 'Release Lumora AI Beta', description: 'Complete development, run tests, and publish preview link to showcase.', category: 'work', targetDate: '2026-07-05', progress: 80, status: 'active' },
      { id: 'g-2', title: 'Complete Mindful Sprinting', description: 'Run daily deep focus routines without panicking or stress blockages.', category: 'personal', targetDate: '2026-07-15', progress: 45, status: 'active' }
    ];
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('bliss_reminders');
    return saved ? JSON.parse(saved) : [
      { id: 'rem-1', title: '🚨 OVERDUE WARNING: Finalize Project Launch Specification is due tonight!', time: '18:00', type: 'panic', taskId: 'task-1' },
      { id: 'rem-2', title: '💡 AI Nudge: Your stress level is Moderate. Consider doing a 5-min breathing pause.', time: '12:00', type: 'nudge' }
    ];
  });

  // State for Automatic Task Execution simulation
  const [executingTaskId, setExecutingTaskId] = useState<string | null>(null);
  const [agentLogs, setAgentLogs] = useState<AgentExecutionLog[]>([]);
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState<boolean>(false);

  // Weekly local backups list
  const [weekBackups, setWeekBackups] = useState<WeekBackup[]>(() => {
    const saved = localStorage.getItem('lumora_week_backups');
    return saved ? JSON.parse(saved) : [];
  });

  // State for voice activation
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [voiceInputText, setVoiceInputText] = useState<string>('');
  const [lastVoiceTranscript, setLastVoiceTranscript] = useState<string>('');
  const [lastAiVoiceFeedback, setLastAiVoiceFeedback] = useState<string>('');

  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'week'>('month');

  // --- Trajectory & Cognitive Addition Prediction States ---
  const [trajectory, setTrajectory] = useState<{
    oneMonthOutlook: string;
    threeMonthOutlook: string;
    oneYearOutlook: string;
    skillsGained: string[];
    cognitiveRoiExplanation: string;
    academicDomain: string;
    learningOpportunities: string[];
  } | null>(() => {
    const saved = localStorage.getItem('lumora_trajectory');
    return saved ? JSON.parse(saved) : null;
  });
  const [isTrajectoryLoading, setIsTrajectoryLoading] = useState<boolean>(false);

  // Landing Page AI Simulator States
  const [landingAiState, setLandingAiState] = useState<'idle' | 'thinking' | 'result'>('idle');
  const [landingInput, setLandingInput] = useState('');
  const [thinkingStep, setThinkingStep] = useState(0);
  const [simulatedTaskName, setSimulatedTaskName] = useState('DBMS project');
  const [animatedProgressVal, setAnimatedProgressVal] = useState(0);

  // Helper to find days of the week for the week containing selectedDate
  const getDaysInSelectedWeek = (selectedDateStr: string) => {
    const current = new Date(selectedDateStr);
    const dayOfWeek = current.getDay(); // 0 is Sunday
    const startOfWeek = new Date(current);
    startOfWeek.setDate(current.getDate() - dayOfWeek); // Go back to Sunday
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      weekDays.push(d);
    }
    return weekDays;
  };

  // Helper to dynamically calculate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDayIndex = getFirstDayOfMonth(calendarYear, calendarMonth);
  const calendarDays: (number | null)[] = [];
  
  // Fill leading empty cells for padding
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  // Fill actual day numbers
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Auto scroll carousel reference
  const carouselTimer = useRef<NodeJS.Timeout | null>(null);

  // -------------------------------------------------------------
  // EFFECTS
  // -------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem('bliss_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('bliss_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('active_theme', JSON.stringify(activeTheme));
  }, [activeTheme]);

  useEffect(() => {
    localStorage.setItem('bliss_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('bliss_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('bliss_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('lumora_week_backups', JSON.stringify(weekBackups));
  }, [weekBackups]);

  useEffect(() => {
    if (trajectory) {
      localStorage.setItem('lumora_trajectory', JSON.stringify(trajectory));
    } else {
      localStorage.removeItem('lumora_trajectory');
    }
  }, [trajectory]);

  useEffect(() => {
    if (!trajectory && (habits.length > 0 || goals.length > 0)) {
      calculateTrajectory(habits, goals);
    }
  }, []);

  // AI Future Simulation step sequencer and percentage counter animator
  useEffect(() => {
    if (landingAiState === 'thinking') {
      setThinkingStep(0);
      let currentStep = 0;
      
      const interval = setInterval(() => {
        if (currentStep < 3) {
          currentStep += 1;
          setThinkingStep(currentStep);
        } else {
          clearInterval(interval);
          setLandingAiState('result');
        }
      }, 850); // ~3.4 seconds total sequence

      return () => clearInterval(interval);
    } else if (landingAiState === 'result') {
      setAnimatedProgressVal(0);
      let count = 0;
      const interval = setInterval(() => {
        if (count < 96) {
          count += 2;
          if (count > 96) count = 96;
          setAnimatedProgressVal(count);
        } else {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [landingAiState]);

  // Landing page auto-rotating slides
  useEffect(() => {
    if (!isEntered) {
      carouselTimer.current = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % 5);
      }, 4000);
    }
    return () => {
      if (carouselTimer.current) clearInterval(carouselTimer.current);
    };
  }, [isEntered]);

  // Floating Assistant speech bubble auto-rotation effect
  useEffect(() => {
    const speechPhrases = [
      'Want me to rearrange your evening?',
      'I found a better schedule.',
      'Need to study for Friday\'s Database Exam?',
      'Want to log your progress into AI Insights?',
      'Let\'s review cognitive trajectory multipliers!'
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % speechPhrases.length;
      setAssistantMessage(speechPhrases[index]);
    }, 7000); // changes every 7 seconds
    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------
  // UTILITY ACTIONS
  // -------------------------------------------------------------
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const rotateTheme = () => {
    const currentIndex = THEMES.findIndex((t) => t.id === activeTheme.id);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setActiveTheme(THEMES[nextIndex]);
    showToast(`Fresh Design Applied: Switched to the '${THEMES[nextIndex].name}' theme`);
  };

  const handleCreateNote = () => {
    const targetFolder = activeFolderId === 'all' ? 'work' : activeFolderId;
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '',
      folderId: targetFolder,
      tags: [],
      lastUpdated: 'Just now'
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setEditorTitle('');
    setEditorContent('');
    setEditorFolderId(targetFolder);
    setEditorTagsText('');
    showToast('New note created successfully.');
  };

  const handleAddSuggestedLog = (title: string, content: string, tag: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title,
      content,
      folderId: 'folder-personal',
      tags: ['AI-Suggested', tag],
      lastUpdated: 'Just now'
    };
    setNotes([newNote, ...notes]);
    showToast(`💡 Log entry "${title}" successfully committed to AI Insights!`);
    speakText(`Committed new intelligence log to your AI insights.`);
  };

  const handleEditNote = (note: Note) => {
    if (note.isLocked && !unlockedNotes.includes(note.id)) {
      setNoteToLockUnlock(note);
      setPinInput('');
      setIsLockingModalOpen(true);
      return;
    }
    setSelectedNote(note);
    setIsEditing(true);
    setEditorTitle(note.title);
    setEditorContent(note.content);
    setEditorFolderId(note.folderId);
    setEditorTagsText(note.tags.join(', '));
  };

  const handleSaveNote = () => {
    if (!selectedNote) return;
    const processedTags = editorTagsText
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const updated = notes.map((n) => {
      if (n.id === selectedNote.id) {
        return {
          ...n,
          title: editorTitle.trim() || 'Untitled Note',
          content: editorContent,
          folderId: editorFolderId,
          tags: processedTags,
          lastUpdated: 'Just now'
        };
      }
      return n;
    });

    setNotes(updated);
    setIsEditing(false);
    setSelectedNote(null);
    showToast('Note saved securely.');
  };

  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter((n) => n.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setIsEditing(false);
      }
      showToast('Note deleted.');
    }
  };

  const togglePinNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes(
      notes.map((n) => {
        if (n.id === id) {
          const isPinned = !n.isPinned;
          showToast(isPinned ? 'Note pinned to top.' : 'Note unpinned.');
          return { ...n, isPinned };
        }
        return n;
      })
    );
  };

  const handleLockNoteSubmit = () => {
    if (!noteToLockUnlock) return;
    if (noteToLockUnlock.isLocked && !unlockedNotes.includes(noteToLockUnlock.id)) {
      // Trying to unlock
      if (pinInput === noteToLockUnlock.pinCode) {
        setUnlockedNotes([...unlockedNotes, noteToLockUnlock.id]);
        setIsLockingModalOpen(false);
        showToast('Note unlocked successfully.');
        // Go straight to edit
        setSelectedNote(noteToLockUnlock);
        setIsEditing(true);
        setEditorTitle(noteToLockUnlock.title);
        setEditorContent(noteToLockUnlock.content);
        setEditorFolderId(noteToLockUnlock.folderId);
        setEditorTagsText(noteToLockUnlock.tags.join(', '));
      } else {
        alert('Invalid PIN code! Please try again.');
      }
    } else {
      // Locking the note
      if (!lockPIN || lockPIN.length < 4) {
        alert('Please enter a secure 4-digit PIN to lock.');
        return;
      }
      const updated = notes.map((n) => {
        if (n.id === noteToLockUnlock.id) {
          return { ...n, isLocked: true, pinCode: lockPIN };
        }
        return n;
      });
      setNotes(updated);
      setIsLockingModalOpen(false);
      setLockPIN('');
      showToast('Note locked with security PIN.');
    }
  };

  const triggerLockNote = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setNoteToLockUnlock(note);
    setLockPIN('');
    setPinInput('');
    setIsLockingModalOpen(true);
  };

  const triggerUnlockNote = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setNoteToLockUnlock(note);
    setPinInput('');
    setIsLockingModalOpen(true);
  };

  // -------------------------------------------------------------
  // TASK PLANNER & CALENDAR ACTIONS
  // -------------------------------------------------------------
  const handleOpenCreateTask = (dateString?: string) => {
    setSelectedTask(null);
    setTaskTitleInput('');
    setTaskDescInput('');
    setTaskPriorityInput('medium');
    const defaultDate = dateString || selectedDate || '2026-06-29';
    setTaskDateInput(defaultDate);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedTask(task);
    setTaskTitleInput(task.title);
    setTaskDescInput(task.description);
    setTaskPriorityInput(task.priority);
    setTaskDateInput(task.dueDate);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!taskTitleInput.trim()) {
      alert('Task title is required.');
      return;
    }

    if (selectedTask) {
      // Update existing task
      const updated = tasks.map((t) => {
        if (t.id === selectedTask.id) {
          return {
            ...t,
            title: taskTitleInput.trim(),
            description: taskDescInput.trim(),
            priority: taskPriorityInput,
            dueDate: taskDateInput
          };
        }
        return t;
      });
      setTasks(updated);
      showToast('Task updated successfully.');
    } else {
      // Create new task
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskTitleInput.trim(),
        description: taskDescInput.trim(),
        priority: taskPriorityInput,
        status: 'pending',
        dueDate: taskDateInput
      };
      setTasks([newTask, ...tasks]);
      showToast('New task added to schedule.');
    }
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((t) => t.id !== id));
      showToast('Task removed.');
    }
  };

  const toggleTaskStatus = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextStatus = t.status === 'pending' ? 'completed' : 'pending';
        showToast(nextStatus === 'completed' ? 'Task checked off! Great job.' : 'Task marked as pending.');
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setTasks(updated);
  };

  const handleAiPrioritize = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks })
      });
      const data = await response.json();
      
      if (data.prioritizedTasks) {
        const updatedTasks = tasks.map(t => {
          const aiMatch = data.prioritizedTasks.find((pt: any) => pt.id === t.id);
          if (aiMatch) {
            return {
              ...t,
              threatLevel: aiMatch.threatLevel,
              urgencyExplanation: aiMatch.urgencyExplanation,
              lifeSavingSteps: aiMatch.lifeSavingSteps
            };
          }
          return t;
        });
        setTasks(updatedTasks);
        showToast('AI Prioritization complete! Threats and micro-steps calculated.');
      } else {
        showToast('AI response parsed but no tasks returned.');
      }
    } catch (err) {
      console.error(err);
      showToast('AI failed. Used rules-based triage.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiSchedule = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          stressLevel: userStress,
          userVibe: userVibe,
          hoursRemaining: hoursLeft
        })
      });
      const data = await response.json();
      setAiPlan(data);
      showToast('AI-Powered Schedule Routine generated!');
    } catch (err) {
      console.error(err);
      showToast('AI scheduling failed. Using high-quality layout generator.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- New Feature triggers: Automatic Task Planning, Reminders, Voice-Enablement & Auto-Task Execution ---

  // TTS utility to speak feedback
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Shared Voice & Typed Command Processor
  const processCommandText = async (commandText: string) => {
    if (!commandText.trim()) return;
    setLastVoiceTranscript(commandText);
    
    try {
      setIsAiLoading(true);
      const response = await fetch('/api/ai/voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commandText, currentTasks: tasks })
      });
      const data = await response.json();
      
      if (data.spokenFeedback) {
        setLastAiVoiceFeedback(data.spokenFeedback);
        speakText(data.spokenFeedback);
        showToast(`AI Assistant: "${data.spokenFeedback}"`);
      }

      if (data.detectedAction === 'ADD_TASK' && data.parsedTask) {
        const hours = data.parsedTask.deadlineOffsetHours || 4;
        const targetDate = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString().split('T')[0];
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title: data.parsedTask.title,
          description: `Voice Command Task: "${commandText}"`,
          priority: data.parsedTask.priority || 'high',
          status: 'pending',
          dueDate: targetDate
        };
        setTasks((prev) => [newTask, ...prev]);
        
        // Enhance reminders list immediately with a custom context reminder!
        const newRem: Reminder = {
          id: `rem-vc-${Date.now()}`,
          title: `🔔 Task added via Voice: "${newTask.title}" scheduled on ${newTask.dueDate}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'nudge',
          taskId: newTask.id
        };
        setReminders((prev) => [newRem, ...prev]);
        showToast(`Task '${newTask.title}' scheduled on ${newTask.dueDate}.`);
      } else if (data.detectedAction === 'PANIC_RELIEF') {
        setUserStress('Chill');
        const newRem: Reminder = {
          id: `rem-vc-panic-${Date.now()}`,
          title: `💚 Stress reduced: AI reduced stress index to Chill. Take a slow 5s breath.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'nudge'
        };
        setReminders((prev) => [newRem, ...prev]);
        showToast('Stress level updated to Chill ☕.');
      } else if (data.detectedAction === 'CLEAR_COMPLETED_TASKS') {
        const completedCount = tasks.filter(t => t.status === 'completed').length;
        setTasks((prev) => prev.filter(t => t.status !== 'completed'));
        const newRem: Reminder = {
          id: `rem-vc-clear-${Date.now()}`,
          title: `🧹 Cleared completed: Successfully removed ${completedCount} completed tasks.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'nudge'
        };
        setReminders((prev) => [newRem, ...prev]);
        showToast(`Cleared ${completedCount} completed tasks.`);
      } else if (data.detectedAction === 'MOVE_TASK_TO_FOLDER' && data.parsedTask) {
        const folderId = data.targetFolderId || 'work';
        const matchTitle = data.parsedTask.title.toLowerCase();
        
        // Find existing task
        const existingTask = tasks.find(t => t.title.toLowerCase().includes(matchTitle));
        
        if (existingTask) {
          setTasks((prev) => prev.map(t => t.id === existingTask.id ? { ...t, folderId } : t));
          showToast(`Moved task '${existingTask.title}' to the ${folderId} folder.`);
          
          const newRem: Reminder = {
            id: `rem-vc-move-${Date.now()}`,
            title: `📁 Moved task: '${existingTask.title}' moved to ${folderId}.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'nudge'
          };
          setReminders((prev) => [newRem, ...prev]);
        } else {
          // Task not found - let's create a new task directly inside that folder!
          const targetDate = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().split('T')[0];
          const newTask: Task = {
            id: `task-${Date.now()}`,
            title: data.parsedTask.title,
            description: `Voice Command Task moved to folder`,
            priority: 'medium',
            status: 'pending',
            dueDate: targetDate,
            folderId
          };
          setTasks((prev) => [newTask, ...prev]);
          showToast(`Task not found. Created and moved '${newTask.title}' to ${folderId} folder.`);
          
          const newRem: Reminder = {
            id: `rem-vc-move-new-${Date.now()}`,
            title: `📁 Created task: '${newTask.title}' and placed in ${folderId}.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'nudge'
          };
          setReminders((prev) => [newRem, ...prev]);
        }
      } else if (data.detectedAction === 'GET_SUMMARY') {
        const newRem: Reminder = {
          id: `rem-vc-sum-${Date.now()}`,
          title: `📋 Summary Readout complete. AI read back your active timeline tasks.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'nudge'
        };
        setReminders((prev) => [newRem, ...prev]);
      } else if (data.detectedAction === 'GET_RECOMMENDATIONS') {
        handleAiSchedule();
        const newRem: Reminder = {
          id: `rem-vc-rec-${Date.now()}`,
          title: `💡 AI Advice Activated: Generated a personalized productivity sprint routine for your vibe.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'nudge'
        };
        setReminders((prev) => [newRem, ...prev]);
      } else if (data.detectedAction === 'EXECUTE_TASK' && data.parsedTask) {
        // Look for matching task title
        const matchTitle = data.parsedTask.title.toLowerCase();
        let targetTask = tasks.find(t => t.title.toLowerCase().includes(matchTitle));
        if (!targetTask) {
          // Dynamically add the task first
          const targetDate = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().split('T')[0];
          targetTask = {
            id: `task-${Date.now()}`,
            title: data.parsedTask.title,
            description: `Voice Command task created for execution`,
            priority: data.parsedTask.priority || 'high',
            status: 'pending',
            dueDate: targetDate
          };
          setTasks((prev) => [targetTask!, ...prev]);
        }
        // Start autonomous execution on this task
        const finalTask = targetTask;
        setTimeout(() => {
          handleExecuteTask(finalTask);
        }, 500);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to process voice command via AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Voice recognition and processing
  const handleVoiceCommand = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech Recognition not supported in this browser.');
      speakText('Speech recognition is not supported in this browser. Please type your command inside our AI command box.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsVoiceListening(true);
      showToast('🎤 Listening for spoken commands...');
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsVoiceListening(false);
      showToast(`Heard: "${transcript}"`);
      await processCommandText(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error(event);
      setIsVoiceListening(false);
      showToast('Voice recognition error occurred.');
    };

    recognition.onend = () => {
      setIsVoiceListening(false);
    };

    recognition.start();
  };

  // Automatic Task Planning from Notes
  const handleAutoPlan = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/auto-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      const data = await response.json();
      
      if (data.plannedTasks && data.plannedTasks.length > 0) {
        const newPlannedTasks: Task[] = data.plannedTasks.map((pt: any) => ({
          id: `task-planned-${Math.random().toString(36).substring(7)}`,
          title: pt.title,
          description: pt.description,
          priority: pt.priority || 'medium',
          status: 'pending',
          dueDate: pt.dueDate || '2026-06-29'
        }));
        
        // Exclude duplicates
        const uniqueTasks = newPlannedTasks.filter(nt => !tasks.some(et => et.title.toLowerCase() === nt.title.toLowerCase()));
        if (uniqueTasks.length > 0) {
          setTasks((prev) => [...uniqueTasks, ...prev]);
          showToast(`Success: Scheduled ${uniqueTasks.length} tasks automatically from your notes context!`);
          speakText(`I scanned your files and automatically planned ${uniqueTasks.length} new items on your calendar grid.`);
        } else {
          showToast('Checked notes: All identified tasks are already scheduled!');
          speakText('All tasks inside your notes are already scheduled.');
        }
      } else {
        showToast('Scanning notes completed. No new task requirements found.');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to plan automatically.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- Task Backup & Export Handlers ---
  const handleExportWeekTasksToFile = () => {
    const weekDays = getDaysInSelectedWeek(selectedDate);
    const weekDatesStr = weekDays.map((d) => {
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const dateNum = d.getDate();
      return `${y}-${String(m).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
    });
    const weekTasks = tasks.filter((t) => weekDatesStr.includes(t.dueDate));

    if (weekTasks.length === 0) {
      showToast("Warning: No tasks in the current week to export. Downloading empty set.");
    }

    const exportObj = {
      appName: "Lumora AI",
      exportTimestamp: new Date().toISOString(),
      weekStart: weekDatesStr[0],
      weekEnd: weekDatesStr[6],
      tasks: weekTasks
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lumora-week-tasks-${weekDatesStr[0]}-to-${weekDatesStr[6]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast("JSON export downloaded successfully!");
  };

  const handleBackupWeekToLocalStorage = () => {
    const weekDays = getDaysInSelectedWeek(selectedDate);
    const weekDatesStr = weekDays.map((d) => {
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const dateNum = d.getDate();
      return `${y}-${String(m).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
    });
    const weekTasks = tasks.filter((t) => weekDatesStr.includes(t.dueDate));

    if (weekTasks.length === 0) {
      showToast("No tasks in the current week to back up.");
      return;
    }

    const newBackup: WeekBackup = {
      id: `backup-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      weekStart: weekDatesStr[0],
      weekEnd: weekDatesStr[6],
      taskCount: weekTasks.length,
      tasksJson: JSON.stringify(weekTasks)
    };

    setWeekBackups((prev) => [newBackup, ...prev]);
    showToast("Week's task list backed up to local storage!");
  };

  const handleRestoreBackup = (backup: WeekBackup) => {
    try {
      const restoredTasks: Task[] = JSON.parse(backup.tasksJson);
      if (!Array.isArray(restoredTasks)) {
        showToast("Invalid backup structure.");
        return;
      }

      setTasks((prev) => {
        const existingIds = new Set(restoredTasks.map(t => t.id));
        const filteredPrev = prev.filter(t => !existingIds.has(t.id));
        return [...restoredTasks, ...filteredPrev];
      });

      showToast(`Restored ${restoredTasks.length} tasks from backup!`);
    } catch (e) {
      showToast("Error restoring backup.");
    }
  };

  const handleDeleteBackup = (id: string) => {
    setWeekBackups((prev) => prev.filter(b => b.id !== id));
    showToast("Backup deleted.");
  };

  const handleImportTasksFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const parsed = JSON.parse(result);
        
        let importedTasks: Task[] = [];
        if (Array.isArray(parsed)) {
          importedTasks = parsed;
        } else if (parsed && Array.isArray(parsed.tasks)) {
          importedTasks = parsed.tasks;
        } else {
          showToast("Invalid import format. Could not locate tasks array.");
          return;
        }

        if (importedTasks.length === 0) {
          showToast("No tasks found in the imported file.");
          return;
        }

        setTasks((prev) => {
          const existingIds = new Set(importedTasks.map(t => t.id));
          const filteredPrev = prev.filter(t => !existingIds.has(t.id));
          return [...importedTasks, ...filteredPrev];
        });

        showToast(`Successfully imported and merged ${importedTasks.length} tasks!`);
      } catch (err) {
        showToast("Error reading or parsing JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Automatic Task Execution Simulation
  const handleExecuteTask = async (task: Task) => {
    if (executingTaskId) return; // one at a time
    
    setExecutingTaskId(task.id);
    setAgentLogs([]);
    setIsAgentPanelOpen(true);
    
    const appendLog = (msg: string, type: 'info' | 'agent' | 'success' | 'warn' = 'info') => {
      setAgentLogs((prev) => [...prev, { time: new Date().toLocaleTimeString().substring(3, 8), type, message: msg }]);
    };
    
    appendLog(`Acquiring execution lock for task: "${task.title}"`, 'info');
    
    try {
      const response = await fetch('/api/ai/execute-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
      });
      const data = await response.json();
      
      if (data.logs && data.completedArtifact) {
        // Animate incoming steps
        for (let i = 0; i < data.logs.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          appendLog(data.logs[i].message, data.logs[i].type as any);
        }
        
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Append completed note deliverable
        const newNote: Note = {
          id: `note-exec-${Date.now()}`,
          title: data.completedArtifact.title,
          content: data.completedArtifact.content,
          folderId: 'work',
          tags: ['automated', 'deliverable', 'executed'],
          lastUpdated: 'Just Now'
        };
        
        setNotes((prev) => [newNote, ...prev]);
        
        // Complete the task status
        setTasks((prev) => prev.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
        
        appendLog(`Task executed! Artifact generated: "${newNote.title}" inside Work folder.`, 'success');
        showToast(`Successfully executed: ${task.title}! Artifact added to notes.`);
        speakText(`Task execution completed. I generated the finalized report file for ${task.title} inside your Work folder.`);
      } else {
        throw new Error("Invalid execution response");
      }
    } catch (err) {
      console.error(err);
      appendLog("Error: Execution pipeline aborted unexpectedly.", 'warn');
      showToast("Automatic execution failed.");
    } finally {
      setExecutingTaskId(null);
    }
  };

  // Habit management
  const calculateHabitStreak = (history: Record<string, boolean>) => {
    let streak = 0;
    const baseDate = new Date('2026-06-29');
    const todayStr = '2026-06-29';
    
    const yesterday = new Date(baseDate);
    yesterday.setDate(baseDate.getDate() - 1);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (!history[todayStr] && !history[yStr]) {
      return 0;
    }

    const start = new Date(baseDate);
    if (!history[todayStr] && history[yStr]) {
      start.setDate(start.getDate() - 1);
    }

    while (true) {
      const yyyy = start.getFullYear();
      const mm = String(start.getMonth() + 1).padStart(2, '0');
      const dd = String(start.getDate()).padStart(2, '0');
      const dStr = `${yyyy}-${mm}-${dd}`;
      if (history[dStr]) {
        streak++;
        start.setDate(start.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const getHabitLast7Days = (habit: Habit) => {
    const baseDate = new Date('2026-06-29');
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      days.push({
        dateStr,
        dayName: dayNames[d.getDay()],
        completed: !!habit.history[dateStr]
      });
    }
    return days;
  };

  const toggleHabit = (id: string) => {
    const todayStr = '2026-06-29';
    const updated = habits.map(h => {
      if (h.id === id) {
        const historyCopy = { ...h.history };
        const currentlyDone = historyCopy[todayStr];
        historyCopy[todayStr] = !currentlyDone;
        
        const nextStreak = calculateHabitStreak(historyCopy);
        if (!currentlyDone) {
          showToast(`Habit checked! Streak is now ${nextStreak}! 🔥`);
        } else {
          showToast(`Habit unchecked. Streak is now ${nextStreak}.`);
        }
        return {
          ...h,
          streak: nextStreak,
          history: historyCopy
        };
      }
      return h;
    });
    setHabits(updated);
  };

  const toggleHabitDate = (habitId: string, dateStr: string) => {
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const historyCopy = { ...h.history };
        const currentlyDone = historyCopy[dateStr];
        historyCopy[dateStr] = !currentlyDone;
        
        const nextStreak = calculateHabitStreak(historyCopy);
        showToast(`Updated history for ${dateStr}. Streak is now ${nextStreak}!`);
        return {
          ...h,
          streak: nextStreak,
          history: historyCopy
        };
      }
      return h;
    });
    setHabits(updated);
  };

  const calculateTrajectory = async (forcedHabits: Habit[] = habits, forcedGoals: Goal[] = goals) => {
    setIsTrajectoryLoading(true);
    try {
      const response = await fetch('/api/ai/trajectory-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habits: forcedHabits, goals: forcedGoals })
      });
      if (response.ok) {
        const data = await response.json();
        setTrajectory(data);
      } else {
        showToast('Error generating future trajectory.');
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error during trajectory prediction.');
    } finally {
      setIsTrajectoryLoading(false);
    }
  };

  const scheduleStudyTask = (title: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: `Study: ${title}`,
      description: `Automatically scheduled educational deep dive to support current habits and goals.`,
      priority: 'medium',
      status: 'pending',
      dueDate: '2026-06-29'
    };
    setTasks([newTask, ...tasks]);
    showToast(`Scheduled learning activity: "${newTask.title}"`);
    speakText(`Scheduled new educational study task: ${title}`);
  };

  const handleRunDemoMode = () => {
    if (demoActive) return;
    setDemoActive(true);
    setIsAiLoading(true);
    setDemoStep(1);
    setDemoStatusText('Registering milestone inputs: Exam Friday, Project Sunday, Interview Monday...');
    speakText('Initiating Lumora Demo Mode. Ingesting core milestones: Exam on Friday, Project on Sunday, and Technical Interview next Monday.');

    setTimeout(() => {
      setDemoStep(2);
      setDemoStatusText('Synthesizing priority vectors and detecting latent stress triggers...');
      speakText('Detecting calendar bottlenecks. Monday coding schedules require early Tuesday learning intervals.');
    }, 1800);

    setTimeout(() => {
      setDemoStep(3);
      setDemoStatusText('Securing optimal focus windows and calculating success probability multipliers...');
      speakText('Recalculating success probability. Inserting glowing study recommendations.');
    }, 3600);

    setTimeout(() => {
      // Create the 3 tasks
      const examTask: Task = {
        id: `task-demo-1-${Date.now()}`,
        title: '🎓 Advanced Database Exam',
        description: 'Comprehensive testing on transactional isolation levels (ACID), locking protocols, and replication scaling.',
        priority: 'high',
        status: 'pending',
        dueDate: '2026-07-03',
        threatLevel: 85,
        urgencyExplanation: 'Urgent major milestone. Represents 30% of course grade.',
        lifeSavingSteps: [
          'Review ACID transaction isolates (Serializable, Repeatable Read)',
          'Solve deadlocks & multi-version concurrency control exercises',
          'Optimize sample indexes with EXPLAIN ANALYZE'
        ]
      };

      const projectTask: Task = {
        id: `task-demo-2-${Date.now()}`,
        title: '🚀 Capstone AI Engine Delivery',
        description: 'Deploy final model endpoint weights and verify client-side secure pipeline latency holds below 120ms.',
        priority: 'high',
        status: 'pending',
        dueDate: '2026-07-05',
        threatLevel: 90,
        urgencyExplanation: 'Ultimate submission deadline. No extension permitted.',
        lifeSavingSteps: [
          'Freeze core model weights & compile server bundle',
          'Deploy client-side offline storage fallbacks to localStorage',
          'Benchmark multi-thread API query times on container cold-starts'
        ]
      };

      const interviewTask: Task = {
        id: `task-demo-3-${Date.now()}`,
        title: '💼 Google AI Studio Staff Interview',
        description: 'System design briefing and technical presentation with the DeepMind Antigravity framework team.',
        priority: 'high',
        status: 'pending',
        dueDate: '2026-07-06',
        threatLevel: 95,
        urgencyExplanation: 'Highest stakes career pivot milestone.',
        lifeSavingSteps: [
          'Practice system architecture whiteboarding for real-time web agents',
          'Review Google Cloud SQL PostgreSQL scaling limits & Cloud Run parameters',
          'Refine project demonstration talking points'
        ]
      };

      // Also create supportive recommendations automatically
      const recTask1: Task = {
        id: `task-demo-rec-1-${Date.now()}`,
        title: '💡 AI Study: Database Isolation Deep-dive',
        description: 'Recommended preparation block to ensure 95% pass rate on Fridays examination.',
        priority: 'medium',
        status: 'pending',
        dueDate: '2026-06-30', // Tuesday
        threatLevel: 45
      };

      const recTask2: Task = {
        id: `task-demo-rec-2-${Date.now()}`,
        title: '💡 AI Prep: Staff System Mock Panel',
        description: 'Recommended mock board presentation scheduled during optimal cognitive readiness window.',
        priority: 'medium',
        status: 'pending',
        dueDate: '2026-07-02', // Thursday
        threatLevel: 50
      };

      // Merge into tasks
      setTasks([examTask, projectTask, interviewTask, recTask1, recTask2, ...tasks]);
      setDemoStep(4);
      setDemoStatusText('Synchronizing database nodes and deploying predictive advice...');
    }, 5400);

    setTimeout(() => {
      setDemoActive(false);
      setIsAiLoading(false);
      setDemoStep(0);
      setDemoStatusText('');
      showToast('⭐ Demo loaded! Monday coding linked with recommended Tuesday database study. Chrono-schedule rebuilt.');
      speakText('Lumora Demo Mode Loaded. Review your newly scheduled high-priority milestones and interactive recommendations.');
    }, 7000);
  };

  const handleCreateHabit = (title: string, freq: 'daily' | 'weekly') => {
    if (!title.trim()) return;
    const newH: Habit = {
      id: `h-${Date.now()}`,
      title: title.trim(),
      frequency: freq,
      streak: 0,
      history: {},
      createdAt: '2026-06-29'
    };
    const updated = [...habits, newH];
    setHabits(updated);
    showToast(`Added new habit: ${newH.title}`);
    calculateTrajectory(updated, goals);
  };

  const handleDeleteHabit = (id: string) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    showToast('Habit removed.');
    calculateTrajectory(updated, goals);
  };

  // Goal management
  const handleUpdateGoalProgress = (id: string, progress: number) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const nextStatus = progress >= 100 ? 'achieved' : 'active';
        if (progress >= 100 && g.progress < 100) {
          showToast(`🏆 Congratulations! Goal achieved: ${g.title}!`);
          speakText(`Incredible achievement! You have fully accomplished your goal: ${g.title}!`);
        }
        return { ...g, progress, status: nextStatus as any };
      }
      return g;
    });
    setGoals(updated);
  };

  const handleCreateGoal = (title: string, desc: string, target: string, category: string) => {
    if (!title.trim()) return;
    const newG: Goal = {
      id: `g-${Date.now()}`,
      title: title.trim(),
      description: desc.trim(),
      category,
      targetDate: target || '2026-07-05',
      progress: 0,
      status: 'active'
    };
    const updated = [...goals, newG];
    setGoals(updated);
    showToast(`Target goal set: ${newG.title}`);
    calculateTrajectory(habits, updated);
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    showToast('Goal deleted.');
    calculateTrajectory(habits, updated);
  };

  // -------------------------------------------------------------
  // GETTERS & DERIVED STATES
  // -------------------------------------------------------------
  const filteredNotes = notes.filter((n) => {
    const matchesFolder = activeFolderId === 'all' || n.folderId === activeFolderId;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    if (sortBy === 'newest') {
      return b.id.localeCompare(a.id); // Simple fallback using ID timestamp
    } else if (sortBy === 'oldest') {
      return a.id.localeCompare(b.id);
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  // Folder helper icon renderer
  const renderFolderIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'User':
        return <User className={className} />;
      case 'FolderKanban':
        return <FolderKanban className={className} />;
      case 'Lightbulb':
        return <Lightbulb className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      default:
        return <FileText className={className} />;
    }
  };

  const getFolderColorClass = (colorName: string) => {
    switch (colorName) {
      case 'rose':
        return 'border-rose-300 bg-rose-50/50 text-rose-700 shadow-rose-100';
      case 'indigo':
        return 'border-indigo-300 bg-indigo-50/50 text-indigo-700 shadow-indigo-100';
      case 'emerald':
        return 'border-emerald-300 bg-emerald-50/50 text-emerald-700 shadow-emerald-100';
      case 'amber':
        return 'border-amber-300 bg-amber-50/50 text-amber-700 shadow-amber-100';
      case 'purple':
        return 'border-purple-300 bg-purple-50/50 text-purple-700 shadow-purple-100';
      case 'teal':
        return 'border-teal-300 bg-teal-50/50 text-teal-700 shadow-teal-100';
      default:
        return 'border-slate-300 bg-slate-50/50 text-slate-700';
    }
  };

  // -------------------------------------------------------------
  // CAROUSEL MOCKUP RENDERING (LANDING PAGE)
  // -------------------------------------------------------------
  const renderMockupFrame = () => {
    switch (carouselIndex) {
      case 0: // Folder Grid
        return (
          <div className="bg-white/95 rounded-2xl p-5 border border-purple-150 shadow-lg space-y-4 text-left select-none">
            <div className="flex items-center justify-between border-b border-purple-50 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#e0486c] rounded-full"></span>
                <span className="font-serif italic font-bold text-xs text-purple-950">Lumora AI - Active Directory</span>
              </div>
              <span className="text-[10px] bg-purple-50 text-purple-900 px-2 py-0.5 rounded-full font-bold">Grid View</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {DEFAULT_FOLDERS.map((f) => {
                const noteCount = DEFAULT_NOTES.filter((n) => n.folderId === f.id).length;
                return (
                  <div key={f.id} className={`p-3 rounded-xl border border-purple-100 shadow-xs flex flex-col justify-between h-20 bg-[#fdfcff] hover:shadow-sm`}>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-900">{renderFolderIcon(f.icon, 'w-4 h-4')}</span>
                      <span className="text-[9px] text-slate-500 font-semibold">{noteCount} notes</span>
                    </div>
                    <span className="text-xs font-bold text-purple-950">{f.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 1: // Focus Editor View
        return (
          <div className="bg-white/95 rounded-2xl p-5 border border-purple-150 shadow-lg space-y-3 text-left select-none">
            <div className="flex items-center justify-between border-b border-purple-50 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                <span className="font-serif italic font-bold text-xs text-purple-950">Editing: Nature&apos;s Own Light Show</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">● Saved</span>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-purple-950">Nature&apos;s Own Light Show</div>
              <div className="text-[11px] text-slate-600 leading-relaxed min-h-[70px]">
                There is something intriguing about how light filters through leaves in the morning. Watching the shapes dance on the floor is pure art and keeps my mind clear...
              </div>
              <div className="flex gap-1.5 pt-2">
                <span className="text-[9px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-100">#nature</span>
                <span className="text-[9px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-100">#creative</span>
              </div>
            </div>
          </div>
        );

      case 2: // Search Result Filter
        return (
          <div className="bg-white/95 rounded-2xl p-5 border border-purple-150 shadow-lg space-y-3 text-left select-none">
            <div className="flex items-center justify-between border-b border-purple-50 pb-2">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  value="meeting notes"
                  className="w-full bg-slate-50 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-purple-100 focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/40">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-purple-950">Weekly Team Meeting</span>
                  <span className="text-[8px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-bold uppercase">Work</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">Discuss project timeline, action tasks...</p>
              </div>
              <p className="text-[10px] text-center text-slate-400">1 results matching your request</p>
            </div>
          </div>
        );

      case 3: // Advanced Keyboard Shortcuts View
        return (
          <div className="bg-white/95 rounded-2xl p-5 border border-purple-150 shadow-lg space-y-4 text-left select-none">
            <div className="flex items-center justify-between border-b border-purple-50 pb-2">
              <span className="font-serif italic font-bold text-xs text-purple-950">Master Your Workflow</span>
              <span className="text-[10px] font-mono font-bold bg-purple-950 text-white px-2 py-0.5 rounded-md">Shortcuts</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Quick Search</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold">⌘ K</kbd>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">New Note</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold">⌘ N</kbd>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Pin Note</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold">⌘ P</kbd>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Close Editor</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold">Esc</kbd>
              </div>
            </div>
          </div>
        );

      case 4: // Themes Grid Showcase
        return (
          <div className="bg-white/95 rounded-2xl p-5 border border-purple-150 shadow-lg space-y-3 text-left select-none">
            <div className="flex items-center justify-between border-b border-purple-50 pb-2">
              <span className="font-serif italic font-bold text-xs text-purple-950">Dynamic App Themes</span>
              <span className="text-[10px] bg-purple-50 text-purple-950 px-2 py-0.5 rounded-full font-bold">4 Themes</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setActiveTheme(theme);
                    showToast(`Switched to the '${theme.name}' theme`);
                  }}
                  className={`p-2 rounded-xl border text-[9px] font-bold transition-all ${
                    activeTheme.id === theme.id ? 'border-purple-600 ring-2 ring-purple-200 bg-purple-50/50' : 'border-slate-100 bg-white'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 mx-auto mb-1 text-purple-950" />
                  {theme.name.split(' ')[1] || theme.name}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getCarouselTitle = () => {
    switch (carouselIndex) {
      case 0:
        return {
          header: 'Experience fluid note-taking',
          desc: 'Easily organize notes with distinct, beautiful color folders to streamline your daily workflow.'
        };
      case 1:
        return {
          header: 'Distraction-Free Focus Writing',
          desc: 'Immerse yourself into a beautiful editing space designed specifically to keep your output rate high.'
        };
      case 2:
        return {
          header: 'Lightning-Fast Search Engine',
          desc: 'Instant lookup lets you find any notes by titles, paragraphs, or tags in milliseconds.'
        };
      case 3:
        return {
          header: 'Intuitive Keyboard Accelerators',
          desc: 'Never let your hands leave the keyboard. Save notes, initiate searches, or toggle settings seamlessly.'
        };
      case 4:
        return {
          header: 'Artistic Personal Themes',
          desc: 'Breathe life into your workspace. Rotates colors and gradients so your digital notes match your mood.'
        };
      default:
        return { header: '', desc: '' };
    }
  };

  const handleLandingSubmit = (text: string) => {
    if (!text.trim()) return;
    setSimulatedTaskName(text.trim());
    setLandingAiState('thinking');
  };

  const handleLockInPlan = () => {
    const newTask: Task = {
      id: `task-sim-${Date.now()}`,
      title: simulatedTaskName,
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'high',
      folderId: 'work',
      description: 'AI Optimized Task scheduled from Future Alpha simulation.',
      lifeSavingSteps: [
        'Review assignment requirements',
        'Break down tasks into daily micro-goals',
        'Consolidate resources and execute',
        'Refine final draft and submit ahead of time'
      ],
      threatLevel: 88,
      urgencyExplanation: 'Optimized via Future Alpha to boost your weekly success rate by 29%.'
    };
    setTasks((prev) => [newTask, ...prev]);
    
    setIsEntered(true);
    sessionStorage.setItem('hub_entered', 'true');
    showToast(`Plan Locked! '${simulatedTaskName}' has been added to your optimized workspace.`);
  };

  // -------------------------------------------------------------
  // PRIMARY PORTAL RENDER
  // -------------------------------------------------------------

  if (!isEntered) {
    return (
      <div className={`min-h-screen font-sans flex flex-col justify-between selection:bg-purple-100 p-4 sm:p-6 md:p-12 relative overflow-hidden transition-all duration-300 ${activeTheme.bgClass} ${activeTheme.textClass} ${activeTheme.isDark ? 'dark' : ''}`}>
        
        {/* Subtle animated background enhancements */}
        <div className="absolute inset-0 bg-gradient-animate bg-gradient-to-tr from-purple-950/5 via-[#030014]/5 to-fuchsia-950/5 pointer-events-none z-0" />
        
        {/* Soft decorative blur background auroras */}
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-[-15%] right-[15%] w-[700px] h-[700px] bg-fuchsia-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[12000ms]"></div>
        
        {/* Floating light effects / particles */}
        <div className="absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-purple-400/30 blur-[2px] pointer-events-none particle-slow-1"></div>
        <div className="absolute top-[60%] right-[8%] w-3 h-3 rounded-full bg-fuchsia-400/25 blur-[3px] pointer-events-none particle-slow-2"></div>
        <div className="absolute bottom-[25%] left-[45%] w-1.5 h-1.5 rounded-full bg-indigo-400/40 blur-[1px] pointer-events-none particle-slow-3"></div>

        {/* Header bar of Landing Page */}
        <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-purple-100 dark:border-purple-900/40 relative z-10">
          <div 
            onClick={() => {
              setIsEntered(true);
              sessionStorage.setItem('hub_entered', 'true');
              showToast('Workspace loaded.');
            }}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity group"
            title="Enter Workspace"
          >
            <div className="p-2.5 bg-purple-950 rounded-xl text-white shadow-xs group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-fuchsia-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-600 block leading-none">CRAFTED</span>
              <span className="font-serif italic font-bold text-lg text-purple-950">Lumora AI</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 px-3 py-1.5 rounded-full border border-purple-100 dark:border-purple-900/30 hidden sm:inline-block">
              🕒 Future Scheduling Workspace
            </span>
          </div>
        </header>

        {/* Main Hero & Presentation Area */}
        <main className="max-w-6xl mx-auto w-full py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 flex-1">
          {/* Left Column: Headline and Call to action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-fuchsia-50/80 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-300 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider border border-fuchsia-100 dark:border-fuchsia-900/40">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-600 dark:text-fuchsia-400 animate-pulse" />
              <span>LUMORA AI: PREDICT & SCHEDULE</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-purple-950 dark:text-white tracking-tight font-semibold italic leading-none">
              Your Future, <br />
              Simulated <span className="text-fuchsia-600 font-sans not-italic font-bold">Before It Happens</span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              This AI predicts deadlines and builds my future schedule. Seamlessly organize notes, track smart habits, and automate calendar events in one unified, highly secure workspace.
            </p>

            {/* AI Prompt Input replacing Get Started CTA */}
            <div className="space-y-4 pt-2">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLandingSubmit(landingInput);
                }}
                className="relative flex items-center bg-white/70 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-purple-200/60 dark:border-purple-900/30 p-1 shadow-md focus-within:ring-2 focus-within:ring-purple-500/30 focus-within:border-purple-500 transition-all duration-300 max-w-xl"
              >
                <input
                  type="text"
                  value={landingInput}
                  onChange={(e) => setLandingInput(e.target.value)}
                  placeholder="What are your deadlines today?"
                  disabled={landingAiState === 'thinking'}
                  className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm pl-4 pr-12 py-3.5 focus:outline-none font-medium"
                />
                <button
                  type="submit"
                  disabled={landingAiState === 'thinking' || !landingInput.trim()}
                  className="absolute right-2 p-3 bg-[#3b0764] hover:bg-[#2e0550] disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer glass-reflection group"
                  title="Run Simulation"
                >
                  {landingAiState === 'thinking' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-fuchsia-300 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </form>

              {/* Suggestions / Chips */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Try simulating deadlines:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Finish DBMS project by Friday",
                    "Interview on Monday",
                    "Exam next Tuesday",
                    "Complete React assignment"
                  ].map((chipText) => (
                    <button
                      key={chipText}
                      type="button"
                      onClick={() => {
                        setLandingInput(chipText);
                        handleLandingSubmit(chipText);
                      }}
                      disabled={landingAiState === 'thinking'}
                      className="text-[11px] font-bold text-purple-950 bg-white hover:bg-purple-50/50 dark:bg-slate-900/60 dark:text-purple-300 dark:hover:bg-slate-900 border border-purple-150 dark:border-purple-900/30 px-3 py-1.5 rounded-xl cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <Sparkles className="w-3 h-3 text-fuchsia-500" />
                      <span>{chipText}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* direct workspace skip */}
              <div className="pt-2">
                <button
                  id="btn-access-workspace"
                  onClick={() => {
                    setIsEntered(true);
                    sessionStorage.setItem('hub_entered', 'true');
                    showToast('Workspace loaded.');
                  }}
                  className="text-[11px] font-bold tracking-wider text-slate-400 hover:text-purple-950 dark:hover:text-white transition-all flex items-center gap-1 uppercase bg-transparent border-0 cursor-pointer"
                >
                  <span>Skip simulation & open workspace directly</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Future Simulation Panel */}
          <div className="lg:col-span-5 relative">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-3xl blur-md opacity-25 group-hover:opacity-35 transition-all duration-300"></div>
              
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 border border-purple-200/50 dark:border-purple-950/50 shadow-xl text-left select-none min-h-[360px] flex flex-col justify-between relative z-10 glass-reflection float-slow">
                
                {/* IDLE STATE */}
                {landingAiState === 'idle' && (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/40 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">AI SCANNER READY</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-900/30">V3.2_LIVE</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-purple-950 dark:text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-fuchsia-500" />
                        AI Future Simulation
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Input or select deadlines to recalculate scheduling paths across three predicted timelines.
                      </p>
                    </div>

                    {/* Scenario predictions */}
                    <div className="space-y-2.5 my-2">
                      {/* Scenario 1: Alpha */}
                      <div className="border-2 border-fuchsia-400/80 dark:border-fuchsia-500/80 bg-fuchsia-50/20 dark:bg-fuchsia-950/10 p-2.5 rounded-xl flex items-center justify-between relative shadow-xs">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-purple-950 dark:text-white">Future Alpha</span>
                            <span className="text-[8px] bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-700 dark:text-fuchsia-300 font-mono font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider">CHOSEN</span>
                          </div>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Increments workload. Pre-empts deadlines perfectly.</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">96%</span>
                          <p className="text-[8px] text-slate-400 font-semibold uppercase">PROBABILITY</p>
                        </div>
                      </div>

                      {/* Scenario 2: Beta */}
                      <div className="border border-purple-100 dark:border-purple-900/40 bg-white/40 dark:bg-slate-900/40 p-2.5 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Future Beta</span>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">High density load. Works closely up to targets.</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">74%</span>
                          <p className="text-[8px] text-slate-400 uppercase">PROBABILITY</p>
                        </div>
                      </div>

                      {/* Scenario 3: Gamma */}
                      <div className="border border-purple-150 dark:border-purple-900/20 bg-white/40 dark:bg-slate-900/40 p-2.5 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Future Gamma</span>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Late action. Heavy bottleneck conflicts detected.</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-rose-500 dark:text-rose-400 font-mono">42%</span>
                          <p className="text-[8px] text-slate-400 uppercase">PROBABILITY</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-purple-100 dark:border-purple-900/40 pt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>CONFIDENCE METRIC INDEX</span>
                      <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400 font-mono text-xs">96%</span>
                    </div>
                  </div>
                )}

                {/* THINKING STATE */}
                {landingAiState === 'thinking' && (
                  <div className="flex flex-col items-center justify-center py-10 text-center min-h-[320px] w-full">
                    <div className="relative w-28 h-28 flex items-center justify-center mb-6">
                      {/* Halos */}
                      <motion.div 
                        animate={{ scale: [1, 1.25, 1], rotate: 360 }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/20 via-purple-500/10 to-indigo-500/20 rounded-full blur-xl"
                      />
                      <motion.div 
                        animate={{ scale: [1.15, 0.9, 1.15], rotate: -360 }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 bg-gradient-to-tr from-purple-500/20 to-fuchsia-500/20 rounded-full blur-lg"
                      />
                      {/* Orb core */}
                      <motion.div 
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-700 shadow-[0_0_35px_rgba(217,70,239,0.55)] border border-white/20 flex items-center justify-center relative z-10"
                      >
                        <Sparkles className="w-6 h-6 text-white animate-pulse" />
                      </motion.div>
                    </div>
                    
                    {/* Animated changing text steps */}
                    <div className="h-6 overflow-hidden">
                      <AnimatePresence mode="wait">
                        {thinkingStep === 0 && (
                          <motion.p 
                            key="step-0"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-xs font-mono font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider"
                          >
                            Analyzing deadlines...
                          </motion.p>
                        )}
                        {thinkingStep === 1 && (
                          <motion.p 
                            key="step-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider"
                          >
                            Estimating effort...
                          </motion.p>
                        )}
                        {thinkingStep === 2 && (
                          <motion.p 
                            key="step-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider"
                          >
                            Simulating future schedules...
                          </motion.p>
                        )}
                        {thinkingStep === 3 && (
                          <motion.p 
                            key="step-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider"
                          >
                            Selecting optimal plan...
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">Lumora Predictive Engine Modeling Scenarios</p>
                  </div>
                )}

                {/* RESULT STATE */}
                {landingAiState === 'result' && (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/40 pb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-fuchsia-500 rounded-full"></span>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-fuchsia-600">PLAN FORMULATED</span>
                      </div>
                      <span className="text-[8px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full uppercase">Optimal</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      
                      {/* Left: Progress score circular widget */}
                      <div className="sm:col-span-5 flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          {/* Inner Circle Tracker */}
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="42"
                              stroke={activeTheme.isDark ? '#1e1b4b' : '#f3e8ff'}
                              strokeWidth="8"
                              fill="transparent"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="42"
                              stroke="url(#resultGlowGradient)"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray="264"
                              strokeDashoffset={264 - (264 * animatedProgressVal) / 100}
                              strokeLinecap="round"
                              className="transition-all duration-300"
                            />
                            <defs>
                              <linearGradient id="resultGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#d946ef" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-xl font-bold font-mono tracking-tight text-purple-950 dark:text-white leading-none">
                              {Math.round(animatedProgressVal)}%
                            </span>
                            <span className="text-[8px] text-fuchsia-600 dark:text-fuchsia-400 uppercase font-extrabold tracking-wide leading-none mt-0.5">Success</span>
                          </div>
                        </div>
                        <p className="text-[8px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-wider">Chance of Success</p>
                      </div>

                      {/* Right: Recommendation details */}
                      <div className="sm:col-span-7 space-y-1 bg-purple-50/30 dark:bg-purple-950/10 p-3 rounded-xl border border-purple-100/40 dark:border-purple-900/20 text-left">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-fuchsia-500" />
                          <span className="text-[10px] font-mono font-extrabold uppercase text-fuchsia-600">AI Recommendation</span>
                        </div>
                        <p className="text-[11px] font-bold text-purple-950 dark:text-white mt-0.5">"I recommend Future Alpha."</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-1">
                          Starting your <span className="font-bold text-purple-950 dark:text-slate-200">"{simulatedTaskName}"</span> today increases your chance of completing all deadlines by <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">29%</span>.
                        </p>
                        <p className="text-[9px] font-mono text-slate-400 dark:text-slate-500 pt-1">
                          Confidence rating: <span className="font-extrabold text-indigo-600 dark:text-indigo-400">96%</span>
                        </p>
                      </div>
                    </div>

                    {/* Lock in Action Button */}
                    <button
                      onClick={handleLockInPlan}
                      className="w-full bg-[#3b0764] hover:bg-[#2e0550] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer border border-white/10 glass-reflection"
                    >
                      <span>Lock in Future Alpha Plan</span>
                      <ChevronRight className="w-3.5 h-3.5 text-fuchsia-300" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Scroll-Animated "How It Works" Section */}
        <section className="max-w-4xl mx-auto w-full py-16 border-t border-purple-100 dark:border-purple-900/40 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-mono uppercase tracking-widest text-fuchsia-600 font-bold block mb-2">OPERATIONAL ARCHITECTURE</span>
            <h2 className="text-2xl sm:text-3xl font-serif text-purple-950 dark:text-white italic font-bold">
              How Lumora AI Protects Your Time
            </h2>
            <p className="text-slate-500 text-xs mt-2">
              Our simulation engine runs continuously to optimize your productivity in five fluid, automated stages.
            </p>
          </div>
          
          <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-[13px] sm:before:left-[21px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-fuchsia-500 before:via-purple-500 before:to-indigo-500">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="relative flex gap-4 sm:gap-6 items-start group"
            >
              <div className="absolute left-[-26px] sm:left-[-35px] w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-fuchsia-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md ring-4 ring-white dark:ring-slate-950 z-10 group-hover:scale-110 transition-transform">
                1
              </div>
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-purple-100 dark:border-purple-900/20 shadow-xs hover:shadow-md hover:border-purple-200/60 dark:hover:border-purple-800/40 transition-all flex-1 text-left glass-reflection">
                <h3 className="font-bold text-xs sm:text-sm text-purple-950 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="p-1 bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-600 dark:text-fuchsia-400 rounded-lg">
                    <FileText className="w-3.5 h-3.5" />
                  </span>
                  Understand Your Tasks
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                  Lumora ingests your deadlines, notes, and goals, immediately establishing a deep cognitive understanding of your workload, task descriptions, and core priorities.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative flex gap-4 sm:gap-6 items-start group"
            >
              <div className="absolute left-[-26px] sm:left-[-35px] w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md ring-4 ring-white dark:ring-slate-950 z-10 group-hover:scale-110 transition-transform">
                2
              </div>
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-purple-100 dark:border-purple-900/20 shadow-xs hover:shadow-md hover:border-purple-200/60 dark:hover:border-purple-800/40 transition-all flex-1 text-left glass-reflection">
                <h3 className="font-bold text-xs sm:text-sm text-purple-950 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="p-1 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-lg">
                    <Activity className="w-3.5 h-3.5" />
                  </span>
                  Estimate Effort
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                  It calculates the dynamic threat score and cognitive complexity of each task. Then, it maps these requirements against your productivity history and focus hour levels.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative flex gap-4 sm:gap-6 items-start group"
            >
              <div className="absolute left-[-26px] sm:left-[-35px] w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-fuchsia-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md ring-4 ring-white dark:ring-slate-950 z-10 group-hover:scale-110 transition-transform">
                3
              </div>
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-purple-100 dark:border-purple-900/20 shadow-xs hover:shadow-md hover:border-purple-200/60 dark:hover:border-purple-800/40 transition-all flex-1 text-left glass-reflection">
                <h3 className="font-bold text-xs sm:text-sm text-purple-950 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="p-1 bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-600 dark:text-fuchsia-400 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  Simulate Multiple Futures
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                  The engine simulates thousands of alternative calendar layouts in parallel (Future Alpha, Beta, Gamma), modeling various timing, pacing, and sleep adjustments.
                </p>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative flex gap-4 sm:gap-6 items-start group"
            >
              <div className="absolute left-[-26px] sm:left-[-35px] w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md ring-4 ring-white dark:ring-slate-950 z-10 group-hover:scale-110 transition-transform">
                4
              </div>
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-purple-100 dark:border-purple-900/20 shadow-xs hover:shadow-md hover:border-purple-200/60 dark:hover:border-purple-800/40 transition-all flex-1 text-left glass-reflection">
                <h3 className="font-bold text-xs sm:text-sm text-purple-950 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="p-1 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-lg">
                    <CheckSquare className="w-3.5 h-3.5" />
                  </span>
                  Select the Best Schedule
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                  By reviewing simulated outcomes, Lumora extracts the single pathway that exhibits the highest chance of success, locking in a clear, optimized roadmap.
                </p>
              </div>
            </motion.div>

            {/* Step 5 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative flex gap-4 sm:gap-6 items-start group"
            >
              <div className="absolute left-[-26px] sm:left-[-35px] w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md ring-4 ring-white dark:ring-slate-950 z-10 group-hover:scale-110 transition-transform">
                5
              </div>
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-purple-100 dark:border-purple-900/20 shadow-xs hover:shadow-md hover:border-purple-200/60 dark:hover:border-purple-800/40 transition-all flex-1 text-left glass-reflection">
                <h3 className="font-bold text-xs sm:text-sm text-purple-950 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="p-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                  </span>
                  Continuously Adapt
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                  As you complete tasks or introduce new obligations, the system recalibrates in real-time, fluidly adjusting future timeblocks to prevent burnout.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Floating custom Toast warning system if needed */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-purple-950 text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-purple-800 flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-fuchsia-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Footer */}
        <footer className="max-w-6xl mx-auto w-full py-4 text-center text-[10px] text-slate-400 border-t border-purple-100 relative z-10">
          <p>© 2026 Lumora AI. All rights reserved. Your local privacy is safe with us.</p>
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // APPLICATION WORKSPACE RENDER (AFTER ENTERING)
  // -------------------------------------------------------------

  return (
    <div className={`min-h-screen font-sans p-4 sm:p-6 md:p-8 flex flex-col justify-between transition-all duration-300 ${activeTheme.bgClass} ${activeTheme.textClass} ${activeTheme.isDark ? 'dark' : ''} relative overflow-hidden`}>
      
      {/* Subtle animated background enhancements */}
      <div className="absolute inset-0 bg-gradient-animate bg-gradient-to-tr from-purple-950/2 via-[#030014]/2 to-fuchsia-950/2 pointer-events-none z-0" />
      
      {/* Soft decorative blur background auroras */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[10000ms]"></div>
      <div className="absolute bottom-[30%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[15000ms]"></div>
      
      {/* Floating subtle dots / particles */}
      <div className="absolute top-[10%] right-[15%] w-1.5 h-1.5 rounded-full bg-purple-400/20 blur-[1px] pointer-events-none animate-bounce duration-[8000ms]"></div>
      <div className="absolute bottom-[20%] left-[10%] w-2.5 h-2.5 rounded-full bg-fuchsia-400/15 blur-[2px] pointer-events-none animate-bounce duration-[12000ms]"></div>

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6 relative z-10">
        
        {/* Simplified and polished Header */}
        <header className={`p-5 rounded-2xl border backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs transition-colors duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold italic text-purple-950 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-fuchsia-500" />
              <span>Lumora AI</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Intelligent task prioritization, note vault, and calendar scheduler.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleVoiceCommand}
              disabled={isVoiceListening || isAiLoading}
              className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                isVoiceListening 
                  ? 'bg-rose-600 border-rose-500 text-white animate-pulse shadow-md'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/20 dark:border-slate-700 dark:text-rose-400'
              }`}
              title={isVoiceListening ? 'Listening...' : 'Speak Command'}
            >
              <Mic className={`w-4 h-4 ${isVoiceListening ? 'scale-110' : ''}`} />
            </button>
            <button
              id="btn-return-to-landing"
              onClick={() => {
                setIsEntered(false);
                sessionStorage.setItem('hub_entered', 'false');
              }}
              className="text-[10px] font-bold text-purple-950 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-all uppercase tracking-wider dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
              title="Return to Info Landing Page"
            >
              ← Landing
            </button>
            <button
              id="btn-rotate-theme-app"
              onClick={rotateTheme}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-purple-950 dark:text-slate-300 rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Change Colors"
            >
              <Palette className="w-4 h-4 text-fuchsia-500" />
            </button>
          </div>
        </header>

        {/* Navigation Tabs for Notes vs Planner */}
        <div className={`p-2 rounded-2xl border flex gap-2 transition-all duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
          <button
            onClick={() => {
              setActiveTab('notes');
              setIsEditing(false);
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-purple-950 text-white dark:bg-purple-900 shadow-md transform scale-[1.01]'
                : 'hover:bg-purple-50 dark:hover:bg-slate-800 text-purple-950 dark:text-slate-300'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-fuchsia-400 animate-pulse" />
            <span>💡 AI Insights</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${activeTab === 'notes' ? 'bg-purple-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              {notes.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('planner');
              setIsEditing(false);
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'planner'
                ? 'bg-purple-950 text-white dark:bg-purple-900 shadow-md transform scale-[1.01]'
                : 'hover:bg-purple-50 dark:hover:bg-slate-800 text-purple-950 dark:text-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>📅 Planner &amp; Calendar</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${activeTab === 'planner' ? 'bg-purple-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              {tasks.filter(t => t.status === 'pending').length}
            </span>
          </button>
        </div>

        {/* Core Interactive Workspace Content */}
        {activeTab === 'notes' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          
          {/* ==========================================
              COLUMN 1: FOLDER LIST & note catalog (4 Cols)
              ========================================== */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* Folder selection sidebar */}
            <div className={`p-5 rounded-2xl border shadow-xs flex flex-col gap-4 transition-colors duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
              <div className="flex items-center justify-between border-b border-purple-50 pb-2">
                <h3 className="text-xs font-mono font-bold tracking-wider text-purple-950 dark:text-white uppercase flex items-center gap-2">
                  <FolderIcon className="w-4 h-4 text-fuchsia-500" />
                  Folders
                </h3>
                <span className="text-[10px] bg-purple-50 dark:bg-slate-800 text-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
                  {DEFAULT_FOLDERS.length} total
                </span>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    setActiveFolderId('all');
                    setSelectedNote(null);
                    setIsEditing(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                    activeFolderId === 'all'
                      ? 'bg-purple-950 text-white dark:bg-purple-900 shadow-sm'
                      : 'hover:bg-purple-50 dark:hover:bg-slate-800/50 text-purple-950 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>All Insights</span>
                  </span>
                  <span className="text-[10px] opacity-65">{notes.length}</span>
                </button>

                {DEFAULT_FOLDERS.map((folder) => {
                  const noteCount = notes.filter((n) => n.folderId === folder.id).length;
                  const isActive = activeFolderId === folder.id;
                  return (
                    <button
                      key={folder.id}
                      onClick={() => {
                        setActiveFolderId(folder.id);
                        setSelectedNote(null);
                        setIsEditing(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-purple-950 text-white dark:bg-purple-900 shadow-sm'
                          : 'hover:bg-purple-50 dark:hover:bg-slate-800/50 text-purple-950 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {renderFolderIcon(folder.icon, 'w-4 h-4')}
                        <span>{folder.name}</span>
                      </span>
                      <span className="text-[10px] opacity-65">{noteCount}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Note Button */}
              <button
                id="btn-add-note"
                onClick={handleCreateNote}
                className="w-full mt-2 bg-purple-950 hover:bg-purple-900 dark:bg-purple-900 dark:hover:bg-purple-850 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs text-xs uppercase cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add New Insight
              </button>
            </div>

            {/* Note search and control header */}
            <div className={`p-5 rounded-2xl border shadow-xs flex flex-col gap-3 transition-colors duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  id="input-note-search"
                  type="text"
                  placeholder="Search insights, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-purple-500 focus:outline-none dark:text-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                {/* Sort By */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Sort:</span>
                  <select
                    id="select-note-sort"
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-transparent text-[11px] font-bold text-purple-950 dark:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                </div>

                {/* Grid vs List View toggle */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setIsGridView(true)}
                    className={`p-1 rounded-md transition-all cursor-pointer ${isGridView ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-400'}`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsGridView(false)}
                    className={`p-1 rounded-md transition-all cursor-pointer ${!isGridView ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-400'}`}
                    title="List View"
                  >
                    <ListIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ==========================================
              COLUMN 2: NOTES LIST OR EDITOR (8 Cols)
              ========================================== */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            
            {/* If in edit/creation mode */}
            {isEditing && selectedNote ? (
              <div className={`p-6 rounded-2xl border shadow-xs flex-1 flex flex-col gap-4 transition-colors duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
                <div className="flex items-center justify-between border-b border-purple-50 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedNote(null);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {editorTitle ? `Editing: ${editorTitle}` : 'Create New Note'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-1.5 bg-purple-950 hover:bg-purple-900 dark:bg-purple-900 dark:hover:bg-purple-850 text-white font-bold rounded-lg text-xs tracking-wide transition-all flex items-center gap-1.5 cursor-pointer shadow-xs uppercase"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                </div>

                <div className="space-y-4 flex-1 flex flex-col">
                  {/* Title and Folder input row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8">
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Note Title</label>
                      <input
                        id="editor-note-title"
                        type="text"
                        placeholder="Enter title..."
                        value={editorTitle}
                        onChange={(e) => setEditorTitle(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-sm font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none dark:text-white"
                      />
                    </div>
                    
                    <div className="md:col-span-4">
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Move to Folder</label>
                      <select
                        id="editor-note-folder"
                        value={editorFolderId}
                        onChange={(e) => setEditorFolderId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none dark:text-white"
                      >
                        {DEFAULT_FOLDERS.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags text row */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-fuchsia-500" />
                      Tags (comma separated)
                    </label>
                    <input
                      id="editor-note-tags"
                      type="text"
                      placeholder="e.g. brainstorming, design, personal"
                      value={editorTagsText}
                      onChange={(e) => setEditorTagsText(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none dark:text-white"
                    />
                  </div>

                  {/* Core content textarea */}
                  <div className="flex-1 flex flex-col min-h-[300px]">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Body Text</label>
                    <textarea
                      id="editor-note-content"
                      placeholder="Start writing down your beautiful thoughts..."
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      className="w-full flex-1 bg-slate-50 dark:bg-slate-800 text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none leading-relaxed resize-none dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Display filtered list of notes
              <div className={`p-6 rounded-2xl border shadow-xs flex-1 flex flex-col gap-4 transition-colors duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
                <div className="flex items-center justify-between border-b border-purple-50 pb-2.5">
                  <div>
                    <h2 className="text-sm font-bold text-purple-950 dark:text-white uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="w-4.5 h-4.5 text-fuchsia-500" />
                      {activeFolderId === 'all' ? 'All Insights' : `${DEFAULT_FOLDERS.find((f) => f.id === activeFolderId)?.name} Directory`}
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Displaying {sortedNotes.length} matching priorities
                    </p>
                  </div>
                  
                  {sortedNotes.length > 0 && (
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      Click note to edit / unlock
                    </span>
                  )}
                </div>

                {sortedNotes.length === 0 ? (
                  <div className="text-center py-24 text-slate-400 flex flex-col items-center justify-center gap-3">
                    <div className="p-3 bg-purple-50 dark:bg-slate-800 rounded-full text-purple-950 dark:text-slate-300">
                      <FileText className="w-8 h-8 opacity-60" />
                    </div>
                    <p className="text-xs font-semibold">No notes found here yet.</p>
                    <p className="text-[11px] text-slate-400 max-w-xs">
                      Create a note or modify your search query to see items in this directory.
                    </p>
                    <button
                      onClick={handleCreateNote}
                      className="mt-2 bg-purple-950 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase cursor-pointer"
                    >
                      Create First Note
                    </button>
                  </div>
                ) : (
                  // Grid vs List view rendering
                  <div className={isGridView ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
                    {sortedNotes.map((note) => {
                      const isNoteUnlocked = unlockedNotes.includes(note.id);
                      const folderName = DEFAULT_FOLDERS.find((f) => f.id === note.folderId)?.name || 'General';
                      const folderColor = DEFAULT_FOLDERS.find((f) => f.id === note.folderId)?.color || 'indigo';
                      
                      return (
                        <div
                          id={`note-card-${note.id}`}
                          key={note.id}
                          onClick={() => handleEditNote(note)}
                          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden group ${
                            note.isLocked && !isNoteUnlocked
                              ? 'bg-indigo-50/20 border-indigo-200/50'
                              : 'bg-[#fdfcff] dark:bg-slate-900 border-purple-100 dark:border-slate-800'
                          }`}
                        >
                          {/* Folder tiny header tab */}
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${getFolderColorClass(folderColor)}`}>
                              {folderName}
                            </span>
                            
                            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              {/* Pin status icon */}
                              <button
                                onClick={(e) => togglePinNote(note.id, e)}
                                className={`p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${note.isPinned ? 'text-fuchsia-500' : 'text-slate-300'}`}
                                title={note.isPinned ? 'Unpin' : 'Pin to top'}
                              >
                                <Pin className="w-3.5 h-3.5" />
                              </button>

                              {/* Secure Lock icon */}
                              {note.isLocked ? (
                                <button
                                  onClick={(e) => triggerUnlockNote(note, e)}
                                  className="p-1 rounded-md text-indigo-600 hover:bg-indigo-50 transition-all"
                                  title="Locked note. Click to verify PIN."
                                >
                                  {isNoteUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => triggerLockNote(note, e)}
                                  className="p-1 rounded-md text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                  title="Lock note with PIN"
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete button */}
                              <button
                                onClick={(e) => handleDeleteNote(note.id, e)}
                                className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Title and Description */}
                          <div className="space-y-1.5">
                            <h3 className="text-sm font-bold text-purple-950 dark:text-white flex items-center gap-1.5">
                              {note.isPinned && <Pin className="w-3.5 h-3.5 text-fuchsia-500 shrink-0" />}
                              <span className="truncate">{note.title}</span>
                            </h3>

                            {note.isLocked && !isNoteUnlocked ? (
                              <div className="p-2 bg-indigo-50/40 rounded-xl border border-dashed border-indigo-100 flex items-center gap-2 text-indigo-950 text-[11px] font-medium my-2">
                                <Lock className="w-4 h-4 text-indigo-600" />
                                <span>Note is secure. Click to unlock with PIN.</span>
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                {note.content || <span className="italic text-slate-300">No content inside. Click to write...</span>}
                              </p>
                            )}
                          </div>

                          {/* Footer details */}
                          <div className="mt-3 pt-2.5 border-t border-purple-50 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                            <div className="flex flex-wrap gap-1">
                              {note.tags.map((tag) => (
                                <span key={tag} className="bg-slate-100 dark:bg-slate-800 text-[9px] px-1.5 py-0.2 rounded text-slate-600 dark:text-slate-400">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {note.lastUpdated}
                            </span>
                          </div>

                          {/* Pinned visual dot tag */}
                          {note.isPinned && (
                            <div className="absolute top-0 right-0 w-8 h-8 bg-linear-to-bl from-fuchsia-500/20 to-transparent pointer-events-none"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
        ) : (
          /* ==========================================
              THE INTELLIGENT PLANNER & CALENDAR VIEW
             ========================================== */
          <div className="flex flex-col gap-6 flex-1 text-slate-900 dark:text-white text-left">
            
            {/* SUB-NAVIGATION HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-150 dark:border-slate-800 pb-4 gap-3">
              <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setInnerPlannerTab('calendar')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                    innerPlannerTab === 'calendar'
                      ? 'bg-purple-950 dark:bg-purple-900 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Calendar & AI Planning
                </button>
                <button
                  onClick={() => setInnerPlannerTab('habits')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                    innerPlannerTab === 'habits'
                      ? 'bg-purple-950 dark:bg-purple-900 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  Habits & Goals Board
                </button>
              </div>

              {/* Reminders Pill Banner */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/40 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shrink-0">
                  <Bell className="w-3 h-3 animate-bounce text-amber-500" />
                  {reminders.length} Active Context Alerts
                </span>
              </div>
            </div>

            {innerPlannerTab === 'calendar' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 text-slate-900 dark:text-white">
                
                {/* COLUMN 1: AI COCKPIT & TRIAGED TASKS */}
                <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* AI Scheduling Assistant cockpit */}
              <div className={`p-5 rounded-2xl border shadow-xs flex flex-col gap-4 transition-colors duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
                <div className="flex items-center justify-between border-b border-purple-50 dark:border-slate-800/80 pb-2">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-purple-950 dark:text-white uppercase flex items-center gap-2">
                    <Brain className="w-4.5 h-4.5 text-fuchsia-500 animate-pulse" />
                    AI Scheduling Assistant
                  </h3>
                  <span className="text-[9px] bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full font-bold uppercase">
                    Gemini Active
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Stress Level</label>
                    <select
                      value={userStress}
                      onChange={(e) => setUserStress(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-purple-950 dark:text-white border border-slate-200 dark:border-slate-700 text-[11px] font-bold p-2 rounded-xl focus:outline-none"
                    >
                      <option value="Panic" className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Panic 🚨</option>
                      <option value="Moderate" className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Moderate ⚠️</option>
                      <option value="Chill" className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Cool ☕</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Current Vibe</label>
                    <select
                      value={userVibe}
                      onChange={(e) => setUserVibe(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-purple-950 dark:text-white border border-slate-200 dark:border-slate-700 text-[11px] font-bold p-2 rounded-xl focus:outline-none"
                    >
                      <option value="Focused" className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Focused 🎯</option>
                      <option value="Wired" className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Wired ⚡</option>
                      <option value="Sluggish" className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Sluggish 🔋</option>
                      <option value="Exhausted" className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Exhausted 💤</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Hours Left</label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      value={hoursLeft}
                      onChange={(e) => setHoursLeft(parseInt(e.target.value) || 4)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-purple-950 dark:text-white border border-slate-200 dark:border-slate-700 text-[11px] font-bold p-2 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAiPrioritize}
                    disabled={isAiLoading}
                    className="flex-1 py-2.5 px-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    Prioritize tasks
                  </button>
                  <button
                    onClick={handleAiSchedule}
                    disabled={isAiLoading}
                    className="flex-1 py-2.5 px-3 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Plan Schedule
                  </button>
                </div>

                {/* Voice Assistant & Command Hub Section */}
                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                      AI Voice Assistant Active
                    </span>
                  </div>

                  {/* Soundwave wave indicator */}
                  {isVoiceListening && (
                    <div className="flex items-center justify-center gap-1.5 py-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/30 rounded-xl">
                      <span className="w-1.5 h-4 bg-rose-500 rounded animate-pulse [animation-duration:0.6s]"></span>
                      <span className="w-1.5 h-6 bg-fuchsia-500 rounded animate-pulse [animation-duration:0.4s]"></span>
                      <span className="w-1.5 h-8 bg-rose-600 rounded animate-pulse [animation-duration:0.7s]"></span>
                      <span className="w-1.5 h-5 bg-rose-500 rounded animate-pulse [animation-duration:0.5s]"></span>
                      <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 animate-pulse ml-2">Capturing Spoken Speech...</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleVoiceCommand}
                      disabled={isVoiceListening || isAiLoading}
                      className={`flex-1 py-2.5 px-3 ${
                        isVoiceListening 
                          ? 'bg-rose-600 animate-pulse text-white' 
                          : 'bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 dark:text-rose-300'
                      } font-bold rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-xs`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      {isVoiceListening ? 'Listening...' : 'Speak Command'}
                    </button>
                    <button
                      onClick={handleAutoPlan}
                      disabled={isAiLoading}
                      className="flex-1 py-2.5 px-3 bg-purple-100 hover:bg-purple-200 text-purple-950 dark:bg-purple-950/40 dark:hover:bg-purple-950/60 dark:text-purple-300 font-bold rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Auto-Plan Insights
                    </button>
                  </div>

                  {/* Typing fallback form */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (voiceInputText.trim()) {
                        processCommandText(voiceInputText);
                        setVoiceInputText('');
                      }
                    }}
                    className="flex gap-2 text-left"
                  >
                    <input
                      type="text"
                      value={voiceInputText}
                      onChange={(e) => setVoiceInputText(e.target.value)}
                      placeholder="Or type e.g. 'panic' or 'remind me to print specs'..."
                      className="flex-1 bg-slate-50 dark:bg-slate-800 text-purple-950 dark:text-white border border-slate-200 dark:border-slate-700 text-xs p-2.5 rounded-xl focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
                    />
                    <button
                      type="submit"
                      disabled={isAiLoading || !voiceInputText.trim()}
                      className="bg-purple-950 dark:bg-purple-900 text-white p-2.5 rounded-xl hover:bg-fuchsia-700 disabled:opacity-45 transition-all cursor-pointer flex items-center justify-center"
                      title="Send typed command to AI voice assistant"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {/* AI Response and Transcript Dialogue Readout */}
                  {(lastVoiceTranscript || lastAiVoiceFeedback) && (
                    <div className="bg-fuchsia-50/45 dark:bg-purple-950/25 border border-fuchsia-100 dark:border-purple-900/35 p-3.5 rounded-xl space-y-2.5 text-left animate-in fade-in duration-300">
                      {lastVoiceTranscript && (
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Latest Request:</span>
                          <p className="text-xs text-purple-950 dark:text-purple-200 italic font-medium leading-relaxed">
                            "{lastVoiceTranscript}"
                          </p>
                        </div>
                      )}
                      {lastAiVoiceFeedback && (
                        <div className="space-y-1 border-t border-fuchsia-100/60 dark:border-purple-900/20 pt-2 flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-fuchsia-600 dark:text-fuchsia-400 font-bold uppercase block">AI Verbal Feedback:</span>
                            <button 
                              type="button"
                              onClick={() => speakText(lastAiVoiceFeedback)}
                              className="text-[9px] text-indigo-500 hover:text-indigo-600 font-bold flex items-center gap-1 cursor-pointer dark:text-indigo-400"
                              title="Play spoken text"
                            >
                              <Volume2 className="w-3 h-3 animate-bounce" /> Speak Again
                            </button>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                            {lastAiVoiceFeedback}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic AI Plan Schedule Output Display */}
              {isAiLoading && (
                <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full border-2 border-fuchsia-500 border-t-transparent animate-spin mx-auto"></div>
                  <p className="text-xs font-mono text-slate-500">Gemini Model is optimizing and organizing your day...</p>
                </div>
              )}

              {!isAiLoading && aiPlan && (
                <div className="bg-linear-to-br from-indigo-950/95 to-slate-900/95 text-white p-5 rounded-2xl border border-indigo-500/30 space-y-4 shadow-xl animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between border-b border-indigo-800/60 pb-2">
                    <div>
                      <span className="text-[9px] font-mono text-fuchsia-400 font-bold uppercase tracking-wider">
                        {aiPlan.strategyName || 'Optimized Survival Blueprint'}
                      </span>
                      <h4 className="font-serif italic font-semibold text-xs text-white/90">
                        {aiPlan.headline || 'Your tailgated daily timeline'}
                      </h4>
                    </div>
                    <button
                      onClick={() => setAiPlan(null)}
                      className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Dismiss Plan
                    </button>
                  </div>

                  {aiPlan.sprintRoutine && aiPlan.sprintRoutine.length > 0 ? (
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {aiPlan.sprintRoutine.map((sprint: any, idx: number) => (
                        <div key={idx} className="flex gap-3 text-left relative">
                          {idx !== aiPlan.sprintRoutine.length - 1 && (
                            <div className="absolute left-[13px] top-6 bottom-0 w-[1px] bg-slate-700"></div>
                          )}
                          <div className="w-7 h-7 rounded-full bg-indigo-900 border border-indigo-400 flex items-center justify-center text-[9px] font-mono font-bold shrink-0 text-indigo-200">
                            {idx + 1}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono font-bold text-fuchsia-300">{sprint.time}</span>
                            <p className="text-xs text-slate-300 font-medium leading-relaxed">{sprint.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No specific sprints generated. Use the prioritized checklist.</p>
                  )}

                  {aiPlan.emergencyEmailTemplate && (
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-left space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-slate-400">Auto Emergency Buffer Email</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(aiPlan.emergencyEmailTemplate);
                            showToast('Email template copied!');
                          }}
                          className="text-[9px] text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                        >
                          Copy Text
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-300 font-mono leading-relaxed line-clamp-3 select-all bg-black/30 p-2 rounded">
                        {aiPlan.emergencyEmailTemplate}
                      </p>
                    </div>
                  )}

                  {aiPlan.encouragementPhrase && (
                    <p className="text-[11px] italic font-serif text-slate-300 text-center border-t border-indigo-900/40 pt-2.5">
                      &quot;{aiPlan.encouragementPhrase}&quot;
                    </p>
                  )}
                </div>
              )}

              {/* WEEKLY ANALYTICS CARD */}
              {(() => {
                const weekDays = getDaysInSelectedWeek(selectedDate);
                const weekDatesStr = weekDays.map((d) => {
                  const y = d.getFullYear();
                  const m = d.getMonth() + 1;
                  const dateNum = d.getDate();
                  return `${y}-${String(m).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
                });

                const weekTasks = tasks.filter((t) => weekDatesStr.includes(t.dueDate));
                const weekCompleted = weekTasks.filter((t) => t.status === 'completed').length;
                const weekPending = weekTasks.filter((t) => t.status !== 'completed').length;
                const weekTotal = weekTasks.length;
                
                const weekCompletedPercent = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
                const weekPendingPercent = weekTotal > 0 ? Math.round((weekPending / weekTotal) * 100) : 0;

                const chartData = [
                  { name: 'Completed', value: weekCompleted, percentage: weekCompletedPercent, color: '#10b981' },
                  { name: 'Pending', value: weekPending, percentage: weekPendingPercent, color: '#6366f1' }
                ];

                const dailyBarData = weekDays.map((d) => {
                  const y = d.getFullYear();
                  const m = d.getMonth() + 1;
                  const dateNum = d.getDate();
                  const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
                  
                  const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
                  const completedCount = dayTasks.filter((t) => t.status === 'completed').length;
                  const pendingCount = dayTasks.filter((t) => t.status !== 'completed').length;
                  const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
                  
                  return {
                    day: dayLabel,
                    completed: completedCount,
                    pending: pendingCount,
                    total: dayTasks.length
                  };
                });

                const CustomTooltip = ({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl text-left font-sans text-xs">
                        <p className="font-extrabold text-slate-900 dark:text-white">{data.name}</p>
                        <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                          Tasks: <span className="font-mono font-extrabold">{data.value}</span> ({data.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                };

                return (
                  <div className={`p-5 rounded-2xl border shadow-xs flex flex-col gap-4 transition-colors duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
                    <div className="flex items-center justify-between border-b border-purple-50 dark:border-slate-800/80 pb-2">
                      <h3 className="text-xs font-mono font-bold tracking-wider text-purple-950 dark:text-white uppercase flex items-center gap-2">
                        <Activity className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                        Weekly Analytics Dashboard
                      </h3>
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold px-2.5 py-0.5 rounded-full font-mono">
                        {weekCompletedPercent}% Done
                      </span>
                    </div>

                    {weekTotal === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">No tasks scheduled for this week</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Add tasks to any date to generate live visual metrics.</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Recharts Pie Chart container */}
                        <div className="w-[120px] h-[120px] relative shrink-0 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={38}
                                outerRadius={52}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                          {/* Centered text in Pie Chart */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-sm font-black text-slate-900 dark:text-white leading-none">
                              {weekCompletedPercent}%
                            </span>
                            <span className="text-[7px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight mt-0.5">
                              Done
                            </span>
                          </div>
                        </div>

                        {/* Legend / Metrics */}
                        <div className="flex-1 space-y-2.5 w-full">
                          <div>
                            <div className="flex justify-between items-center text-[10.5px] mb-1">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 block shrink-0"></span>
                                Completed Tasks
                              </span>
                              <span className="font-mono font-extrabold text-slate-800 dark:text-white">
                                {weekCompleted} / {weekTotal}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${weekCompletedPercent}%` }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center text-[10.5px] mb-1">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 block shrink-0"></span>
                                Pending Tasks
                              </span>
                              <span className="font-mono font-extrabold text-slate-800 dark:text-white">
                                {weekPending} / {weekTotal}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${weekPendingPercent}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Productivity Bar Chart Comparison */}
                      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3.5 mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                            Daily Completion Comparison
                          </span>
                          <span className="text-[8px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full">
                            Weekly Trend
                          </span>
                        </div>
                        
                        <div className="w-full h-[140px] mt-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyBarData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={activeTheme.isDark ? '#334155' : '#e2e8f0'} />
                              <XAxis 
                                dataKey="day" 
                                tickLine={false} 
                                axisLine={false}
                                tick={{ fill: activeTheme.isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 'bold' }}
                              />
                              <YAxis 
                                allowDecimals={false}
                                tickLine={false} 
                                axisLine={false}
                                tick={{ fill: activeTheme.isDark ? '#94a3b8' : '#64748b', fontSize: 9 }}
                              />
                              <Tooltip 
                                cursor={{ fill: activeTheme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                                content={({ active, payload }: any) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl text-left font-sans text-xs">
                                        <p className="font-extrabold text-slate-900 dark:text-white">{data.day} Productivity</p>
                                        <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                                          Completed: <span className="font-mono font-extrabold">{data.completed}</span>
                                        </p>
                                        <p className="text-indigo-600 dark:text-indigo-400 font-bold">
                                          Pending: <span className="font-mono font-extrabold">{data.pending}</span>
                                        </p>
                                        <p className="text-slate-500 font-mono text-[10px] mt-0.5">
                                          Total scheduled: {data.total}
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Bar 
                                dataKey="completed" 
                                radius={[3, 3, 0, 0]}
                                maxBarSize={24}
                              >
                                {dailyBarData.map((entry, idx) => {
                                  const maxCompleted = Math.max(...dailyBarData.map(d => d.completed));
                                  const isMax = entry.completed === maxCompleted && maxCompleted > 0;
                                  return (
                                    <Cell 
                                      key={`cell-${idx}`} 
                                      fill={isMax ? '#10b981' : (activeTheme.isDark ? '#6366f1' : '#818cf8')} 
                                    />
                                  );
                                })}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </>
                  )}

                    {/* Backup & Export Controls */}
                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3.5 mt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                          Backup & Portability
                        </span>
                        <div className="flex gap-2">
                          {/* Hidden File Input */}
                          <label className="text-[10px] flex items-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all border border-slate-200/55 dark:border-slate-700/50">
                            <Upload className="w-3 h-3" />
                            Import JSON
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleImportTasksFile}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleExportWeekTasksToFile}
                          className="text-[10.5px] font-bold text-emerald-850 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/60 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-600" />
                          Export Week JSON
                        </button>
                        <button
                          onClick={handleBackupWeekToLocalStorage}
                          className="text-[10.5px] font-bold text-indigo-850 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-950/60 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Database className="w-3.5 h-3.5 text-indigo-600" />
                          Local Backup
                        </button>
                      </div>

                      {/* Display of Backups from LocalStorage */}
                      {weekBackups.length > 0 && (
                        <div className="space-y-1.5 pt-1.5">
                          <span className="text-[9px] font-mono font-bold text-slate-400 block text-left">
                            In-Browser Backup History ({weekBackups.length})
                          </span>
                          <div className="max-h-[110px] overflow-y-auto space-y-1.5 pr-1">
                            {weekBackups.map((backup) => (
                              <div
                                key={backup.id}
                                className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-2 rounded-xl flex items-center justify-between gap-2"
                              >
                                <div className="text-left">
                                  <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                    {backup.timestamp}
                                  </div>
                                  <div className="text-[8px] font-mono text-slate-400">
                                    {backup.taskCount} tasks ({backup.weekStart} to {backup.weekEnd})
                                  </div>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                  <button
                                    onClick={() => handleRestoreBackup(backup)}
                                    className="text-[8.5px] font-mono bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer"
                                    title="Restore this backup, merging with your current tasks"
                                  >
                                    Restore
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBackup(backup.id)}
                                    className="text-slate-400 hover:text-rose-500 p-0.5 transition-all cursor-pointer"
                                    title="Delete backup"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* THE TRIAGED TASK DIRECTORIES */}
              <div className={`p-5 rounded-2xl border shadow-xs flex-1 flex flex-col gap-4 transition-colors duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
                
                {/* Accordion 1: 🔥 Prioritized Tasks */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-red-100 dark:border-rose-950/40 pb-1.5">
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <TrendingUp className="w-4 h-4" />
                      🔥 AI Prioritized Tasks
                    </span>
                    <span className="text-[10px] bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full">
                      {tasks.filter(t => t.priority === 'high' && t.status === 'pending').length} High
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {tasks.filter(t => t.priority === 'high' && t.status === 'pending').length === 0 ? (
                      <p className="text-[10.5px] italic text-slate-400">No active high-priority tasks. Use &quot;Prioritize&quot; to calculate threats.</p>
                    ) : (
                      tasks.filter(t => t.priority === 'high' && t.status === 'pending').map(task => (
                        <div
                          key={task.id}
                          className="p-3 bg-rose-50/50 dark:bg-rose-950/10 rounded-xl border border-rose-100 dark:border-rose-900/30 text-left space-y-2 relative group overflow-hidden"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <button
                              onClick={(e) => toggleTaskStatus(task.id, e)}
                              className="mt-0.5 text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                            >
                              <Square className="w-4 h-4" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-[11.5px] font-bold text-slate-950 dark:text-slate-50 leading-tight truncate">
                                {task.title}
                              </h5>
                              <p className="text-[10px] text-slate-800 dark:text-slate-200 line-clamp-2 mt-0.5 leading-snug font-medium">
                                {task.description}
                              </p>
                            </div>
                            
                            {task.threatLevel && (
                              <span className="text-[9px] font-mono font-bold bg-rose-600 text-white px-1.5 py-0.2 rounded shrink-0">
                                {task.threatLevel}% Urg
                              </span>
                            )}
                          </div>

                          {task.urgencyExplanation && (
                            <div className="text-[9px] text-rose-800 dark:text-rose-300 font-medium bg-rose-100/40 dark:bg-rose-950/20 p-2 rounded-lg leading-relaxed">
                              <strong>Why:</strong> {task.urgencyExplanation}
                            </div>
                          )}

                          {task.lifeSavingSteps && task.lifeSavingSteps.length > 0 && (
                            <div className="space-y-1 bg-white/70 dark:bg-slate-900/60 p-2 rounded-lg border border-rose-100/40 dark:border-rose-900/40">
                              <span className="text-[9px] font-bold uppercase text-slate-700 dark:text-slate-300 tracking-wider block">AI Survival Micro-Steps:</span>
                              {task.lifeSavingSteps.map((step, sIdx) => (
                                <div key={sIdx} className="flex gap-1.5 text-[10px] text-slate-950 dark:text-slate-100 leading-relaxed font-medium">
                                  <span className="text-fuchsia-500 font-bold">{sIdx + 1}.</span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-rose-100/30">
                            <div className="flex items-center gap-1.5">
                              <span>Due: {task.dueDate}</span>
                              {task.folderId && (
                                <span className="bg-purple-100 text-purple-950 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-[7px] border border-purple-200">
                                  📁 {task.folderId}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleExecuteTask(task); }}
                                className="text-emerald-600 hover:underline cursor-pointer font-bold flex items-center gap-0.5"
                              >
                                <Play className="w-2.5 h-2.5 text-emerald-500" />
                                Execute
                              </button>
                              <button
                                onClick={(e) => handleOpenEditTask(task, e)}
                                className="text-indigo-600 hover:underline cursor-pointer font-bold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => handleDeleteTask(task.id, e)}
                                className="text-rose-600 hover:underline cursor-pointer font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Accordion 2: ⏳ Pending Tasks */}
                <div className="space-y-2.5 mt-2">
                  <div className="flex items-center justify-between border-b border-purple-50 dark:border-slate-800/60 pb-1.5">
                    <span className="text-xs font-bold text-purple-950 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
                      <ListTodo className="w-4 h-4 text-indigo-500" />
                      ⏳ Pending Tasks
                    </span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 font-bold px-2 py-0.5 rounded-full">
                      {tasks.filter(t => t.priority !== 'high' && t.status === 'pending').length} Left
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {tasks.filter(t => t.priority !== 'high' && t.status === 'pending').length === 0 ? (
                      <p className="text-[10.5px] italic text-slate-400">No pending medium or low priority tasks.</p>
                    ) : (
                      tasks.filter(t => t.priority !== 'high' && t.status === 'pending').map(task => (
                        <div
                          key={task.id}
                          className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-150 dark:border-slate-800/80 text-left space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <button
                              onClick={(e) => toggleTaskStatus(task.id, e)}
                              className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
                            >
                              <Square className="w-4 h-4" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <h6 className="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                                {task.title}
                              </h6>
                              <p className="text-[9.5px] text-slate-800 dark:text-slate-200 line-clamp-1 mt-0.5 font-medium">
                                {task.description}
                              </p>
                            </div>
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded shrink-0 ${task.priority === 'medium' ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400' : 'bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400'}`}>
                              {task.priority}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[8px] text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <span>Due: {task.dueDate}</span>
                              {task.folderId && (
                                <span className="bg-purple-100 text-purple-950 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-[7px] border border-purple-200">
                                  📁 {task.folderId}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleExecuteTask(task); }}
                                className="text-emerald-600 hover:underline cursor-pointer font-bold flex items-center gap-0.5"
                              >
                                <Play className="w-2.5 h-2.5 text-emerald-500" />
                                Execute
                              </button>
                              <button
                                onClick={(e) => handleOpenEditTask(task, e)}
                                className="text-indigo-600 hover:underline cursor-pointer font-bold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => handleDeleteTask(task.id, e)}
                                className="text-rose-600 hover:underline cursor-pointer font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Accordion 3: ✅ Completed Tasks */}
                <div className="space-y-2.5 mt-2">
                  <div className="flex items-center justify-between border-b border-purple-50 dark:border-slate-800/60 pb-1.5">
                    <span className="text-xs font-bold text-emerald-750 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                      ✅ Completed Tasks
                    </span>
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                      {tasks.filter(t => t.status === 'completed').length} Done
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {tasks.filter(t => t.status === 'completed').length === 0 ? (
                      <p className="text-[10.5px] italic text-slate-400">No completed tasks yet. Finish a task and watch it land here!</p>
                    ) : (
                      tasks.filter(t => t.status === 'completed').map(task => (
                        <div
                          key={task.id}
                          className="p-2 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-xl border border-emerald-100/50 dark:border-emerald-900/20 text-left flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <button
                              onClick={(e) => toggleTaskStatus(task.id, e)}
                              className="text-emerald-600 cursor-pointer shrink-0"
                            >
                              <CheckSquare className="w-4 h-4" />
                            </button>
                            <span className="text-[10.5px] text-slate-700 dark:text-slate-300 line-through truncate font-medium">
                              {task.title}
                            </span>
                            {task.folderId && (
                              <span className="bg-emerald-100/60 text-emerald-850 px-1 py-0.2 rounded font-bold uppercase text-[7px] border border-emerald-250 shrink-0">
                                📁 {task.folderId}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleDeleteTask(task.id, e)}
                            className="p-1 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* COLUMN 2: THE INTERACTIVE MONTHLY CALENDAR GRID */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              <div className={`p-6 rounded-2xl border shadow-xs flex-1 flex flex-col gap-5 transition-colors duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
                
                {/* Calendar Header with Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-50 dark:border-slate-800 pb-3 gap-3">
                  <div>
                    <h2 className="text-base font-bold text-purple-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-fuchsia-500" />
                      {MONTH_NAMES[calendarMonth]} {calendarYear}
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      Select any date to schedule or filter task cards
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* ⭐ Try Demo Button */}
                    <button
                      onClick={handleRunDemoMode}
                      disabled={demoActive}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 via-purple-600 to-fuchsia-600 hover:from-amber-600 hover:via-purple-700 hover:to-fuchsia-700 text-white font-extrabold rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transform hover:scale-[1.03] active:scale-[0.98] transition-all disabled:opacity-50 shrink-0"
                      title="Simulate high-priority academic timeline with AI generation"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                      ⭐ Try Demo
                    </button>

                    {/* View Mode Toggle */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 mr-1">
                      <button
                        onClick={() => setCalendarViewMode('month')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          calendarViewMode === 'month'
                            ? 'bg-purple-950 dark:bg-purple-900 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        Month
                      </button>
                      <button
                        onClick={() => setCalendarViewMode('week')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          calendarViewMode === 'week'
                            ? 'bg-purple-950 dark:bg-purple-900 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        Week
                      </button>
                    </div>

                    <button
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-purple-950 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCalendarYear(2026);
                        setCalendarMonth(5);
                        setSelectedDate('2026-06-29');
                        showToast('Reset back to June 2026 Today!');
                      }}
                      className="px-2.5 py-1.5 bg-purple-950 hover:bg-purple-900 dark:bg-purple-900 text-white font-bold rounded-xl text-[10px] uppercase cursor-pointer tracking-wider"
                    >
                      Today
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-purple-950 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Simulated Demo Mode AI Overlay */}
                {demoActive && (
                  <div className="p-4 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-fuchsia-500/10 border border-amber-300/40 rounded-2xl flex flex-col gap-3 shadow-sm animate-pulse text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                        </span>
                        <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">Demo Simulation Mode Active</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">Step {demoStep} of 4</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{demoStatusText}</p>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-fuchsia-600 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${demoStep * 25}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {calendarViewMode === 'month' ? (
                  /* Monthly Grid */
                  <div className="flex-1 flex flex-col gap-4">
                    {/* Days of Week label row */}
                    <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span>Sun</span>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>

                    {/* Calendar day grid cells */}
                    <div className="grid grid-cols-7 gap-2.5 flex-1 min-h-[360px]">
                      {calendarDays.map((day, cellIdx) => {
                        if (day === null) {
                          return (
                            <div
                              key={`pad-${cellIdx}`}
                              className="bg-slate-50/20 dark:bg-slate-900/10 rounded-xl border border-dashed border-slate-100/50 dark:border-slate-800/30 opacity-30"
                            ></div>
                          );
                        }

                        // Check against our YYYY-MM-DD
                        const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
                        const isSelected = selectedDate === dateStr;
                        const isToday = dateStr === '2026-06-29';
                        
                        const isRecommended = dateStr === '2026-06-30' || dateStr === '2026-07-02' || dayTasks.some(t => t.title.toLowerCase().includes('recommended') || t.title.startsWith('💡 AI'));
                        const busyHours = dayTasks.length >= 3 ? "2-6 PM" : dayTasks.length === 2 ? "1-4 PM" : dayTasks.length === 1 ? "10-12 AM" : null;

                        return (
                          <div
                            key={`day-${day}`}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 cursor-pointer relative group min-h-[75px] ${
                              isSelected
                                ? 'bg-purple-50 border-purple-300 dark:bg-slate-800 dark:border-purple-500 ring-2 ring-purple-200 dark:ring-purple-900'
                                : isToday
                                  ? 'bg-[#fdfcff] dark:bg-slate-900 border-fuchsia-400 dark:border-fuchsia-600 shadow-xs'
                                  : isRecommended
                                    ? 'bg-amber-50/55 dark:bg-amber-950/20 border-amber-450 dark:border-amber-500/80 ring-2 ring-amber-300/70 dark:ring-amber-500/40 shadow-[0_0_14px_rgba(245,158,11,0.5)]'
                                    : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className={`text-xs font-bold leading-none ${isToday ? 'text-fuchsia-600 dark:text-fuchsia-400 font-extrabold underline' : 'text-slate-500 dark:text-slate-400'}`}>
                                {day}
                              </span>
                              {isRecommended && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" title="AI Optimal Day" />
                              )}
                              {busyHours && (
                                <span className="text-[7.5px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-0.5 bg-rose-50 dark:bg-rose-950/30 px-1 py-0.2 rounded font-mono">
                                  <Clock className="w-1.5 h-1.5" />
                                  {busyHours}
                                </span>
                              )}
                              {isToday && !busyHours && (
                                <span className="text-[7px] font-bold uppercase tracking-wide bg-fuchsia-100 text-fuchsia-700 px-1.5 py-0.2 rounded shrink-0">
                                  Today
                                </span>
                              )}
                            </div>

                            {/* Task Pips */}
                            <div className="space-y-1 mt-1 max-h-[50px] overflow-hidden">
                              {dayTasks.map((t) => (
                                <div
                                  key={t.id}
                                  onClick={(e) => handleOpenEditTask(t, e)}
                                  className={`text-[8px] font-bold px-1.5 py-0.5 rounded truncate leading-none ${
                                    t.status === 'completed'
                                      ? 'bg-emerald-600 text-white dark:bg-emerald-700 dark:text-emerald-50 line-through animate-pulse'
                                      : t.priority === 'high'
                                        ? 'bg-rose-600 text-white dark:bg-rose-700 dark:text-rose-50'
                                        : t.priority === 'medium'
                                          ? 'bg-amber-500 text-slate-950 dark:bg-amber-600 dark:text-slate-950 font-black'
                                          : 'bg-blue-600 text-white dark:bg-blue-700 dark:text-blue-50'
                                  }`}
                                  title={t.title}
                                >
                                  {t.title}
                                </div>
                              ))}
                            </div>

                            {/* Hover plus button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCreateTask(dateStr);
                              }}
                              className="absolute bottom-1 right-1 p-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-purple-950 dark:hover:bg-purple-900 hover:text-white rounded text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Add Task to this date"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Weekly Time-Blocked Schedule */
                  <div className="flex-1 flex flex-col gap-4">
                    {/* Days of Week label row */}
                    <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span>Sun</span>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>

                    {/* Weekly day grid cells */}
                    <div className="grid grid-cols-7 gap-2.5 flex-1 min-h-[360px] overflow-x-auto">
                      {getDaysInSelectedWeek(selectedDate).map((dateObj, idx) => {
                        const year = dateObj.getFullYear();
                        const month = dateObj.getMonth();
                        const dayNum = dateObj.getDate();
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
                        const isSelected = selectedDate === dateStr;
                        const isToday = dateStr === '2026-06-29';
                        
                        const isRecommended = dateStr === '2026-06-30' || dateStr === '2026-07-02' || dayTasks.some(t => t.title.toLowerCase().includes('recommended') || t.title.startsWith('💡 AI'));
                        const busyHours = dayTasks.length >= 3 ? "2-6 PM" : dayTasks.length === 2 ? "1-4 PM" : dayTasks.length === 1 ? "10-12 AM" : null;

                        // 4 custom time-blocked sections to simulate a schedule layout
                        const timeBlocks = [
                          { label: '09:00 AM - Deep Focus', priorityFilter: 'high' },
                          { label: '12:00 PM - Routine', priorityFilter: 'medium' },
                          { label: '03:00 PM - Collabs', priorityFilter: 'low' },
                          { label: '06:00 PM - Review', showCompleted: true }
                        ];

                        return (
                          <div
                            key={`week-day-${idx}`}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`p-2 rounded-xl border text-left flex flex-col gap-2 transition-all duration-150 cursor-pointer relative group min-w-[100px] sm:min-w-0 ${
                              isSelected
                                ? 'bg-purple-50/50 border-purple-300 dark:bg-slate-800 dark:border-purple-500 ring-2 ring-purple-150 dark:ring-purple-900/50'
                                : isToday
                                  ? 'bg-[#fdfcff] dark:bg-slate-900 border-fuchsia-400 dark:border-fuchsia-600 shadow-xs'
                                  : isRecommended
                                    ? 'bg-amber-50/55 dark:bg-amber-950/20 border-amber-450 dark:border-amber-500/85 ring-2 ring-amber-300/60 dark:ring-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.45)]'
                                    : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/40 pb-1.5 shrink-0">
                              <span className={`text-xs font-bold leading-none ${isToday ? 'text-fuchsia-600 dark:text-fuchsia-400 font-extrabold underline' : 'text-slate-500 dark:text-slate-400'}`}>
                                {dayNum}
                              </span>
                              {isRecommended && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                              )}
                              {busyHours && (
                                <span className="text-[7px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-0.5 bg-rose-50 dark:bg-rose-950/25 px-1 py-0.2 rounded font-mono">
                                  <Clock className="w-1.5 h-1.5" />
                                  {busyHours}
                                </span>
                              )}
                              {isToday && !busyHours && (
                                <span className="text-[7px] font-bold bg-fuchsia-100 text-fuchsia-700 px-1 py-0.2 rounded shrink-0">
                                  Today
                                </span>
                              )}
                            </div>

                            {/* Time Blocks Container */}
                            <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[300px]">
                              {timeBlocks.map((block, bIdx) => {
                                // Filter tasks for this block
                                const blockTasks = block.showCompleted
                                  ? dayTasks.filter(t => t.status === 'completed')
                                  : dayTasks.filter(t => t.status !== 'completed' && t.priority === block.priorityFilter);

                                return (
                                  <div key={bIdx} className="bg-slate-100 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800/60 flex-1 min-h-[55px] flex flex-col justify-between">
                                    <span className="text-[8px] font-mono text-slate-800 dark:text-slate-100 uppercase tracking-tight block font-extrabold">
                                      {block.label}
                                    </span>

                                    <div className="space-y-1 mt-1">
                                      {blockTasks.length > 0 ? (
                                        blockTasks.map((t) => (
                                          <div
                                            key={t.id}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleOpenEditTask(t, e);
                                            }}
                                            className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded truncate leading-tight cursor-pointer hover:opacity-85 ${
                                              t.status === 'completed'
                                                ? 'bg-emerald-600 text-white dark:bg-emerald-700 dark:text-emerald-50 line-through'
                                                : t.priority === 'high'
                                                  ? 'bg-rose-600 text-white dark:bg-rose-700 dark:text-rose-50'
                                                  : t.priority === 'medium'
                                                    ? 'bg-amber-500 text-slate-950 dark:bg-amber-600 dark:text-slate-950 font-black'
                                                    : 'bg-blue-600 text-white dark:bg-blue-700 dark:text-blue-50'
                                            }`}
                                            title={t.title}
                                          >
                                            {t.title}
                                          </div>
                                        ))
                                      ) : (
                                        <div className="text-[6.5px] italic text-slate-300 dark:text-slate-600 text-center py-1">
                                          -
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Plus button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCreateTask(dateStr);
                              }}
                              className="absolute bottom-1 right-1 p-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-purple-950 dark:hover:bg-purple-900 hover:text-white rounded text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Add Task to this date"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Active Date Panel Details */}
                <div className="space-y-4 text-left">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-150 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Selected Target Date</span>
                      <h4 className="text-xs font-bold text-purple-950 dark:text-white flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-fuchsia-500" />
                        {selectedDate === '2026-06-29' ? 'Today, June 29, 2026' : selectedDate}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenCreateTask(selectedDate)}
                        className="px-3.5 py-2 bg-purple-950 hover:bg-purple-900 dark:bg-purple-900 dark:hover:bg-purple-850 text-white font-bold rounded-lg text-[10px] tracking-wider flex items-center gap-1 cursor-pointer uppercase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Task to Date
                      </button>
                    </div>
                  </div>

                  {/* AI Prediction & Recommendations Deck */}
                  <div className="p-4 bg-gradient-to-br from-purple-50/40 to-slate-50/30 dark:from-purple-950/15 dark:to-slate-900/10 rounded-2xl border border-purple-100 dark:border-slate-850 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950 dark:text-purple-300 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        <span>AI Chrono-Prediction Deck</span>
                      </div>
                      <span className="text-[9.5px] bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded">Optimal Flow Active</span>
                    </div>

                    {/* Conditional recommendations based on date */}
                    {selectedDate === '2026-06-30' ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/40 rounded-xl space-y-1.5">
                          <p className="text-[11px] font-bold text-amber-800 dark:text-amber-400">💡 Monday Coding Completed & Link Found!</p>
                          <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            AI recommended study window: <strong>Tuesday Study Block (10:00 AM)</strong>. Perfect timing to anchor yesterday&apos;s coding experience.
                          </p>
                          <button
                            onClick={() => scheduleStudyTask('Database isolation & transaction MVCC theory')}
                            className="text-[9.5px] font-extrabold text-amber-700 dark:text-amber-300 underline hover:text-amber-900 flex items-center gap-1 mt-1 cursor-pointer"
                          >
                            Accept & Schedule recommended study block now →
                          </button>
                        </div>

                        <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-200/40 rounded-xl space-y-1.5">
                          <p className="text-[11px] font-bold text-indigo-800 dark:text-indigo-400">📝 AI Suggested Log Entry (Database Isolation)</p>
                          <p className="text-[10px] italic text-slate-500 dark:text-slate-400 leading-relaxed">
                            &quot;Explored transactional locking protocols, MVCC isolation under concurrent workloads, and resolved indexing deadlocks on the DB cluster.&quot;
                          </p>
                          <button
                            onClick={() => handleAddSuggestedLog(
                              '💡 AI Suggested Log: Database Isolation',
                              'Explored transactional locking protocols (MVCC), repeatable read conflicts under concurrent workloads, and resolved indexing deadlocks on the Postgres DB cluster.',
                              'Database-Systems'
                            )}
                            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-indigo-950/50 dark:hover:bg-indigo-950/85 dark:text-indigo-300 px-2.5 py-1 rounded text-[9.5px] font-bold cursor-pointer transition-colors"
                          >
                            Commit Log to AI Insights
                          </button>
                        </div>
                      </div>
                    ) : selectedDate === '2026-07-02' ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/40 rounded-xl space-y-1.5">
                          <p className="text-[11px] font-bold text-amber-800 dark:text-amber-400">💡 Exam Friday Looming!</p>
                          <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            AI recommended study window: <strong>Thursday Mock Panel Board (2:00 PM)</strong>. Optimizes mental retention and schema recall by 42%.
                          </p>
                          <button
                            onClick={() => scheduleStudyTask('Staff Mock Interview Presentation Practice')}
                            className="text-[9.5px] font-extrabold text-amber-700 dark:text-amber-300 underline hover:text-amber-900 flex items-center gap-1 mt-1 cursor-pointer"
                          >
                            Accept & Schedule mock board practice block now →
                          </button>
                        </div>

                        <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-200/40 rounded-xl space-y-1.5">
                          <p className="text-[11px] font-bold text-indigo-800 dark:text-indigo-400">📝 AI Suggested Log Entry (Staff Mock Preparation)</p>
                          <p className="text-[10px] italic text-slate-500 dark:text-slate-400 leading-relaxed">
                            &quot;Conducted mock presentation representing system architecture choices. Verified replication lag constraints and container cold-start margins.&quot;
                          </p>
                          <button
                            onClick={() => handleAddSuggestedLog(
                              '💡 AI Suggested Log: Staff System Mock Practice',
                              'Conducted simulated panel board presentation representing real-time agents architecture. Evaluated Cloud SQL latency tolerances and container cold-start mitigation strategies.',
                              'System-Design'
                            )}
                            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-indigo-950/50 dark:hover:bg-indigo-950/85 dark:text-indigo-300 px-2.5 py-1 rounded text-[9.5px] font-bold cursor-pointer transition-colors"
                          >
                            Commit Log to AI Insights
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="p-2.5 bg-slate-100/50 dark:bg-slate-900/30 rounded-xl">
                            <span className="text-[8.5px] font-mono font-bold text-slate-400 uppercase">Predicted Focus Window</span>
                            <span className="block text-[11px] font-extrabold text-purple-955 dark:text-purple-300 mt-0.5">09:00 AM - 11:30 AM</span>
                          </div>
                          <div className="p-2.5 bg-slate-100/50 dark:bg-slate-900/30 rounded-xl">
                            <span className="text-[8.5px] font-mono font-bold text-slate-400 uppercase">Busy Hours Load</span>
                            <span className="block text-[11px] font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
                              {tasks.filter(t => t.dueDate === selectedDate).length > 0 ? "14:00 - 16:30 PM (Peak)" : "No busy blocks predicted"}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-indigo-50/20 dark:bg-indigo-950/5 border border-indigo-250/20 rounded-xl space-y-1.5">
                          <p className="text-[10.5px] font-bold text-indigo-800 dark:text-indigo-400">📝 Proactive AI Suggested Log Entry</p>
                          <p className="text-[10px] italic text-slate-500 dark:text-slate-400 leading-relaxed">
                            &quot;Completed focused deep review session for scheduled tasks, structuring academic schemata and reviewing milestone objectives.&quot;
                          </p>
                          <button
                            onClick={() => handleAddSuggestedLog(
                              `💡 AI Focus Log (${selectedDate})`,
                              'Conducted focused learning reviews. Synthesized domain knowledge schemas and structured milestone task schedules.',
                              'Core-Disciplines'
                            )}
                            className="bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-950/40 dark:hover:bg-purple-950/80 dark:text-purple-300 px-2.5 py-1 rounded text-[9.5px] font-bold cursor-pointer transition-colors"
                          >
                            Commit Suggested Log to AI Insights
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 text-slate-900 dark:text-white">
                
                {/* 📚 LUMORA COGNITIVE ROI & FUTURE TRAJECTORY ANALYZER */}
                <div className="lg:col-span-12 flex flex-col gap-4 text-left">
                  <div className={`p-5 rounded-2xl border shadow-xs flex flex-col gap-4 transition-colors duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-purple-50 dark:border-slate-850 pb-3 gap-3">
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-purple-50 dark:bg-purple-950/40 rounded-lg">
                            <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
                          </span>
                          <h3 className="text-sm font-bold text-purple-950 dark:text-white uppercase tracking-wider">
                            Future Trajectory & Cognitive Addition Engine
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          Calculates where your current disciplines lead and how they educate your intellect.
                        </p>
                      </div>
                      <button
                        onClick={() => calculateTrajectory(habits, goals)}
                        disabled={isTrajectoryLoading}
                        className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 dark:bg-purple-900 dark:hover:bg-purple-850 text-white font-mono font-bold rounded-lg text-[9.5px] uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0"
                      >
                        <RotateCcw className={`w-3 h-3 ${isTrajectoryLoading ? 'animate-spin' : ''}`} />
                        {isTrajectoryLoading ? 'Synthesizing...' : 'Predict Trajectory'}
                      </button>
                    </div>

                    {/* Loader */}
                    {isTrajectoryLoading && (
                      <div className="py-12 flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-mono text-purple-600 dark:text-purple-400 animate-pulse font-bold uppercase tracking-widest">Processing neural projection vectors...</p>
                      </div>
                    )}

                    {/* Content */}
                    {!isTrajectoryLoading && trajectory && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in duration-500">
                        
                        {/* Domain & Skills Tagging */}
                        <div className="md:col-span-4 space-y-4 text-left">
                          <div>
                            <span className="text-[8.5px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest block mb-1">Focus Domain</span>
                            <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
                              <h4 className="text-xs font-bold text-purple-950 dark:text-purple-200 flex items-center gap-1.5 leading-tight">
                                <Award className="w-4 h-4 text-fuchsia-500 shrink-0" />
                                {trajectory.academicDomain}
                              </h4>
                            </div>
                          </div>

                          <div>
                            <span className="text-[8.5px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Core Skills Added</span>
                            <div className="flex flex-wrap gap-1.5">
                              {trajectory.skillsGained.map((skill, index) => (
                                <span
                                  key={index}
                                  className="text-[10px] font-bold px-2.5 py-0.8 rounded-full border border-slate-150 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 flex items-center gap-1 hover:border-purple-300 dark:hover:border-purple-900/60 transition-colors"
                                >
                                  <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Projections timeline */}
                        <div className="md:col-span-8 flex flex-col gap-4">
                          <span className="text-[8.5px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Compounding Value Projections</span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3 bg-slate-50/60 dark:bg-slate-900/30 rounded-xl border border-slate-150/50 dark:border-slate-850/60 text-left relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                              <span className="text-[8px] font-mono font-bold text-indigo-500 uppercase block tracking-wider">30-Day Trajectory</span>
                              <p className="text-[11px] text-slate-700 dark:text-slate-350 font-medium mt-1.5 leading-relaxed">{trajectory.oneMonthOutlook}</p>
                            </div>

                            <div className="p-3 bg-slate-50/60 dark:bg-slate-900/30 rounded-xl border border-slate-150/50 dark:border-slate-850/60 text-left relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                              <span className="text-[8px] font-mono font-bold text-purple-500 uppercase block tracking-wider">90-Day Compounding</span>
                              <p className="text-[11px] text-slate-700 dark:text-slate-350 font-medium mt-1.5 leading-relaxed">{trajectory.threeMonthOutlook}</p>
                            </div>

                            <div className="p-3 bg-slate-50/60 dark:bg-slate-900/30 rounded-xl border border-slate-150/50 dark:border-slate-850/60 text-left relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                              <span className="text-[8px] font-mono font-bold text-amber-500 uppercase block tracking-wider">1-Year Mastery</span>
                              <p className="text-[11px] text-slate-700 dark:text-slate-350 font-medium mt-1.5 leading-relaxed">{trajectory.oneYearOutlook}</p>
                            </div>
                          </div>
                        </div>

                        {/* Cognitive ROI & Actionable Learning Opportunities */}
                        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-150/40 dark:border-slate-800/60">
                          
                          <div className="text-left space-y-1.5">
                            <span className="text-[8.5px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Cognitive & Educational ROI</span>
                            <div className="p-3 bg-amber-50/20 dark:bg-amber-950/5 rounded-xl border border-amber-100/40 dark:border-amber-950/20">
                              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-serif italic">
                                "{trajectory.cognitiveRoiExplanation}"
                              </p>
                            </div>
                          </div>

                          <div className="text-left space-y-2">
                            <span className="text-[8.5px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Supporting Learning Actions</span>
                            <div className="space-y-1.5">
                              {trajectory.learningOpportunities.map((op, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-3 p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-150/60 dark:border-slate-850/60 text-left">
                                  <div className="flex items-start gap-2 min-w-0">
                                    <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold mt-0.5 shrink-0">0{idx+1}.</span>
                                    <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-normal truncate">{op}</span>
                                  </div>
                                  <button
                                    onClick={() => scheduleStudyTask(op)}
                                    className="px-2 py-1 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold rounded text-[9px] uppercase tracking-wide flex items-center gap-1 cursor-pointer shrink-0 transition-all"
                                    title="Instantly schedule this study task to your active timeline"
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                    Schedule
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                      </div>
                    )}

                    {!isTrajectoryLoading && !trajectory && (
                      <div className="py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-6 gap-3">
                        <Compass className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                        <div className="max-w-xs">
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-350">Trajectory mapping offline</p>
                          <p className="text-[10.5px] text-slate-400 mt-1">Add habits or goals above, then click 'Predict Trajectory' to map out your educational ROI.</p>
                        </div>
                        <button
                          onClick={() => calculateTrajectory(habits, goals)}
                          className="px-3.5 py-1.5 bg-purple-950 dark:bg-purple-900 text-white font-mono font-bold rounded-lg text-[9.5px] uppercase tracking-wider flex items-center gap-1 hover:bg-purple-900 cursor-pointer"
                        >
                          <Zap className="w-3 h-3 text-amber-400" />
                          Initialize Analysis
                        </button>
                      </div>
                    )}

                  </div>
                </div>
                
                {/* COLUMN 1: SMART HABITS & STREAKS (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-6 text-left">
                  <div className={`p-5 rounded-2xl border shadow-xs flex flex-col gap-4 transition-colors duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
                    <div className="flex items-center justify-between border-b border-purple-50 dark:border-slate-850 pb-2">
                      <h3 className="text-xs font-mono font-bold tracking-wider text-purple-950 dark:text-white uppercase flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                        Habits streak tracking
                      </h3>
                      <span className="text-[9px] bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 px-2.5 py-0.5 rounded-full font-bold uppercase">
                        Real-Time
                      </span>
                    </div>

                    {/* Add Habit Sub-Form */}
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const input = form.elements.namedItem('habitTitle') as HTMLInputElement;
                      const freq = form.elements.namedItem('habitFreq') as HTMLSelectElement;
                      if (input.value.trim()) {
                        handleCreateHabit(input.value, freq.value as any);
                        form.reset();
                      }
                    }} className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-800">
                      <input
                        name="habitTitle"
                        type="text"
                        placeholder="Establish a new daily ritual..."
                        className="flex-1 bg-transparent text-xs font-bold text-purple-950 dark:text-white focus:outline-none placeholder:text-slate-400"
                      />
                      <select name="habitFreq" className="bg-transparent text-[10px] text-purple-950 dark:text-white font-bold focus:outline-none">
                        <option value="daily" className="text-slate-900">Daily</option>
                        <option value="weekly" className="text-slate-900">Weekly</option>
                      </select>
                      <button type="submit" className="px-2.5 py-1.5 bg-purple-950 dark:bg-purple-900 text-white text-[10px] font-bold uppercase rounded-lg cursor-pointer hover:bg-purple-900">
                        Add
                      </button>
                    </form>

                    {/* Habits List */}
                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                      {habits.length === 0 ? (
                        <p className="text-xs italic text-slate-400 p-4 text-center">No habits added yet. Formulate daily disciplines to build rhythm.</p>
                      ) : (
                        habits.map((habit) => {
                          const isDoneToday = !!habit.history['2026-06-29'];
                          return (
                            <div key={habit.id} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-150 dark:border-slate-850 flex flex-col gap-2.5 group">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <button
                                    onClick={() => toggleHabit(habit.id)}
                                    className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                                      isDoneToday 
                                        ? 'bg-orange-500 border-orange-500 text-white' 
                                        : 'border-slate-300 hover:border-orange-400 dark:border-slate-700'
                                    }`}
                                  >
                                    {isDoneToday && <Check className="w-3.5 h-3.5" />}
                                  </button>
                                  <div className="min-w-0 text-left">
                                    <span className={`text-[11.5px] font-bold block truncate ${isDoneToday ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                                      {habit.title}
                                    </span>
                                    <span className="text-[9px] font-mono font-bold text-slate-600 dark:text-slate-350 uppercase tracking-widest">
                                      {habit.frequency}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-left">
                                  <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                    <Flame className="w-3 h-3 text-orange-500" />
                                    {habit.streak} streak
                                  </span>
                                  <button
                                    onClick={() => handleDeleteHabit(habit.id)}
                                    className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Interactive Sparkline Chart & Day Trackers */}
                              <div className="border-t border-slate-150/40 dark:border-slate-800/60 pt-2 flex flex-col gap-1.5">
                                <div className="flex items-center justify-between gap-4 w-full">
                                  <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 dark:text-slate-500 shrink-0">7-Day History</span>
                                  
                                  <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                                    {/* SVG sparkline */}
                                    <div className="relative h-6 w-[120px] shrink-0">
                                      {(() => {
                                        const historyData = getHabitLast7Days(habit);
                                        const width = 120;
                                        const height = 24;
                                        const paddingY = 4;
                                        const points = historyData.map((d, index) => {
                                          const x = (index * width) / 6;
                                          const y = d.completed ? paddingY : height - paddingY;
                                          return { x, y, ...d };
                                        });

                                        let pathD = '';
                                        points.forEach((p, i) => {
                                          if (i === 0) {
                                            pathD += `M ${p.x} ${p.y}`;
                                          } else {
                                            const prev = points[i - 1];
                                            const cpX1 = prev.x + (p.x - prev.x) / 2;
                                            const cpY1 = prev.y;
                                            const cpX2 = prev.x + (p.x - prev.x) / 2;
                                            const cpY2 = p.y;
                                            pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
                                          }
                                        });

                                        const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

                                        return (
                                          <svg width={width} height={height} className="overflow-visible">
                                            <defs>
                                              <linearGradient id={`sparkline-grad-${habit.id}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                                                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                                              </linearGradient>
                                            </defs>
                                            
                                            {/* Filled Area */}
                                            <path
                                              d={areaD}
                                              fill={`url(#sparkline-grad-${habit.id})`}
                                              className="transition-all duration-300"
                                            />
                                            
                                            {/* Stroke Line */}
                                            <path
                                              d={pathD}
                                              fill="none"
                                              stroke="#f97316"
                                              strokeWidth="1.75"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              className="transition-all duration-300"
                                            />
                                            
                                            {/* Interactive Nodes */}
                                            {points.map((p, idx) => (
                                              <g key={idx} className="group/node cursor-pointer" onClick={() => toggleHabitDate(habit.id, p.dateStr)}>
                                                <circle
                                                  cx={p.x}
                                                  cy={p.y}
                                                  r="3.2"
                                                  className={`transition-all duration-200 hover:r-4 ${
                                                    p.completed
                                                      ? 'fill-orange-500 stroke-white dark:stroke-slate-900 stroke-2'
                                                      : 'fill-slate-200 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700 stroke-1'
                                                  }`}
                                                />
                                                <title>{`${p.dayName} (${p.dateStr}): ${p.completed ? 'Completed' : 'Incomplete'} (Click to toggle)`}</title>
                                              </g>
                                            ))}
                                          </svg>
                                        );
                                      })()}
                                    </div>
                                    
                                    {/* Simple letter list for days */}
                                    <div className="flex gap-0.5 text-[7.5px] font-mono font-bold shrink-0">
                                      {getHabitLast7Days(habit).map((d, idx) => (
                                        <button
                                          type="button"
                                          key={idx}
                                          onClick={() => toggleHabitDate(habit.id, d.dateStr)}
                                          title={`${d.dateStr}: ${d.completed ? 'Completed' : 'Incomplete'} (Click to toggle)`}
                                          className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center cursor-pointer transition-colors ${
                                            d.completed
                                              ? 'bg-orange-500 text-white'
                                              : 'bg-slate-100 text-slate-400 dark:bg-slate-900/60 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800'
                                          }`}
                                        >
                                          {d.dayName[0]}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* SMART REMINDERS & NUDGES LIST */}
                  <div className={`p-5 rounded-2xl border shadow-xs flex flex-col gap-3 transition-colors duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
                    <div className="flex items-center justify-between border-b border-purple-50 dark:border-slate-800 pb-2">
                      <h3 className="text-xs font-mono font-bold tracking-wider text-purple-950 dark:text-white uppercase flex items-center gap-2">
                        <Bell className="w-4 h-4 text-fuchsia-500" />
                        AI Context-Aware Alerts
                      </h3>
                      <button
                        onClick={() => {
                          const phrases = [
                            "💡 AI Nudge: You completed 1 work file today. Keep the momentum going!",
                            "⚠️ Threat Detection: Draft Marketing Content Outline deadline is in 3 days.",
                            "🚨 Panic Alert: Moderate stress detected. Take a slow 5 second inhale."
                          ];
                          const newRem: Reminder = {
                            id: `rem-${Date.now()}`,
                            title: phrases[Math.floor(Math.random() * phrases.length)],
                            time: 'Just Now',
                            type: 'nudge'
                          };
                          setReminders((prev) => [newRem, ...prev]);
                          showToast('AI calculated active contexts!');
                        }}
                        className="text-[9px] font-bold text-indigo-500 hover:underline uppercase"
                      >
                        Recalculate
                      </button>
                    </div>

                    <div className="space-y-2">
                      {reminders.map((rem) => (
                        <div key={rem.id} className="p-2.5 bg-amber-50/20 dark:bg-slate-900/40 rounded-xl border border-amber-200/40 dark:border-slate-850 flex justify-between items-start gap-2 text-left">
                          <div className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                            {rem.title}
                          </div>
                          <button
                            onClick={() => setReminders(reminders.filter(r => r.id !== rem.id))}
                            className="p-0.5 text-slate-300 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: TARGET GOALS & PROGRESS BOARD (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                  <div className={`p-5 rounded-2xl border shadow-xs flex-1 flex flex-col gap-5 transition-colors duration-300 ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}>
                    <div className="flex items-center justify-between border-b border-purple-50 dark:border-slate-800 pb-2">
                      <h2 className="text-sm font-bold text-purple-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Award className="w-4.5 h-4.5 text-fuchsia-500" />
                        Target Goals Progress
                      </h2>
                      <span className="text-[10px] bg-purple-50 dark:bg-slate-800 text-purple-900 dark:text-purple-300 px-2.5 py-0.5 rounded-full font-bold">
                        {goals.filter(g => g.status === 'active').length} Active
                      </span>
                    </div>

                    {/* Add Goal Form */}
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const title = form.elements.namedItem('gTitle') as HTMLInputElement;
                      const desc = form.elements.namedItem('gDesc') as HTMLInputElement;
                      const date = form.elements.namedItem('gDate') as HTMLInputElement;
                      const cat = form.elements.namedItem('gCat') as HTMLSelectElement;
                      if (title.value.trim()) {
                        handleCreateGoal(title.value, desc.value, date.value, cat.value);
                        form.reset();
                      }
                    }} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-800 space-y-2 text-left">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Add New Target Milestone</span>
                      <div className="grid grid-cols-2 gap-2">
                        <input name="gTitle" required type="text" placeholder="Goal Title (e.g. Launch Lumora AI)" className="p-1.5 text-xs font-bold bg-white dark:bg-slate-800 text-purple-950 dark:text-white rounded border border-slate-200 dark:border-slate-700 focus:outline-none placeholder:text-slate-400" />
                        <input name="gDesc" type="text" placeholder="Description details..." className="p-1.5 text-xs bg-white dark:bg-slate-800 text-purple-950 dark:text-white rounded border border-slate-200 dark:border-slate-700 focus:outline-none placeholder:text-slate-400" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <input name="gDate" type="date" defaultValue="2026-07-05" className="p-1.5 text-[10.5px] bg-white dark:bg-slate-800 text-purple-950 dark:text-white rounded border border-slate-200 dark:border-slate-700 focus:outline-none" />
                        <select name="gCat" className="p-1.5 text-[10.5px] bg-white dark:bg-slate-800 text-purple-950 dark:text-white rounded border border-slate-200 dark:border-slate-700 focus:outline-none">
                          <option value="work">Work</option>
                          <option value="personal">Personal</option>
                        </select>
                        <button type="submit" className="p-2 bg-purple-950 hover:bg-purple-900 dark:bg-purple-900 dark:hover:bg-purple-850 text-white text-[10px] font-bold uppercase rounded-lg cursor-pointer">
                          Set Goal
                        </button>
                      </div>
                    </form>

                    {/* Goals List */}
                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 text-left">
                      {goals.length === 0 ? (
                        <p className="text-xs italic text-slate-400 p-8 text-center">No goals set yet. Set a milestone above to start tracking achievements.</p>
                      ) : (
                        goals.map((goal) => (
                          <div key={goal.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3 relative group">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded-full border ${goal.category === 'work' ? 'border-indigo-200 text-indigo-700 bg-indigo-50 dark:border-indigo-950 dark:text-indigo-400' : 'border-rose-200 text-rose-700 bg-rose-50 dark:border-rose-950 dark:text-rose-400'}`}>
                                  {goal.category}
                                </span>
                                <h4 className="text-xs font-bold text-slate-800 dark:text-white mt-1.5">{goal.title}</h4>
                                <p className="text-[11px] text-slate-700 dark:text-slate-350 mt-0.5">{goal.description}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteGoal(goal.id)}
                                className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Success Probability & Weekly Progress */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10.5px] font-mono font-bold text-slate-700 dark:text-slate-300">
                                <span>Target: {goal.targetDate}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Success Probability: {goal.progress === 100 ? '100%' : `${Math.round(80 + (goal.progress * 0.15))}%`}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Weekly Momentum</span>
                                <span className="bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 px-2 py-0.5 rounded-md text-[9px] font-bold">Progress: 8% this week</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={goal.progress}
                                  onChange={(e) => handleUpdateGoalProgress(goal.id, parseInt(e.target.value))}
                                  className="flex-1 accent-fuchsia-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                                />
                                <span className={`text-[9px] font-bold uppercase px-2 py-0.2 rounded ${goal.status === 'achieved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400'}`}>
                                  {goal.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

      {/* ==========================================
          MODAL: PIN LOCK & DECRYPTION SECURE VERIFIER
          ========================================== */}
      {isLockingModalOpen && noteToLockUnlock && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-purple-150 p-6 max-w-sm w-full space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsLockingModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-serif italic font-bold text-lg text-purple-950">
                {noteToLockUnlock.isLocked && !unlockedNotes.includes(noteToLockUnlock.id)
                  ? 'Unlock Private Note'
                  : 'Lock Note securely'}
              </h3>
              <p className="text-xs text-slate-500">
                {noteToLockUnlock.isLocked && !unlockedNotes.includes(noteToLockUnlock.id)
                  ? 'Input your secure 4-digit PIN code to view the confidential details of this note.'
                  : 'Set a custom 4-digit PIN to prevent anyone else on this browser from reading your note.'}
              </p>
            </div>

            <div className="space-y-3">
              {noteToLockUnlock.isLocked && !unlockedNotes.includes(noteToLockUnlock.id) ? (
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1 text-center">Verify PIN Code</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-lg tracking-widest font-mono font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1 text-center">Configure 4-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="1234"
                    value={lockPIN}
                    onChange={(e) => setLockPIN(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-lg tracking-widest font-mono font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              )}

              <button
                onClick={handleLockNoteSubmit}
                className="w-full bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wide cursor-pointer"
              >
                Confirm Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal task details modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-purple-150 dark:border-slate-800 p-6 max-w-md w-full space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 text-left text-slate-900 dark:text-white">
            <button
              onClick={() => setIsTaskModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5 border-b border-slate-150 dark:border-slate-800 pb-2.5 text-left">
              <h3 className="font-serif italic font-bold text-lg text-purple-950 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-fuchsia-500 animate-pulse" />
                {selectedTask ? 'Edit Task Details' : 'Schedule New Task'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Plot this task on your active calendar grid and organize with smart priority.
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Launch product presentation"
                  value={taskTitleInput}
                  onChange={(e) => setTaskTitleInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-purple-950 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-1">Description / Details</label>
                <textarea
                  placeholder="Add additional guidelines or checklist..."
                  value={taskDescInput}
                  onChange={(e) => setTaskDescInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-purple-950 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none text-xs min-h-[70px] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-1">Priority</label>
                  <select
                    value={taskPriorityInput}
                    onChange={(e) => setTaskPriorityInput(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-purple-950 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-bold text-xs"
                  >
                    <option value="high" className="text-slate-900 bg-white">High Priority 🔥</option>
                    <option value="medium" className="text-slate-900 bg-white">Medium Priority ⚡</option>
                    <option value="low" className="text-slate-900 bg-white">Low Priority ☕</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-1">Target Date</label>
                  <input
                    type="date"
                    value={taskDateInput}
                    onChange={(e) => setTaskDateInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-purple-950 dark:text-white p-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-bold text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setIsTaskModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 font-bold rounded-xl text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTask}
                  className="flex-1 py-2.5 px-4 bg-purple-950 dark:bg-purple-900 hover:bg-purple-900 text-white font-bold rounded-xl text-xs uppercase cursor-pointer"
                >
                  Confirm Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL / OVERLAY: AUTONOMOUS AGENT RUNTIME CONSOLE
          ========================================== */}
      {isAgentPanelOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-6 max-w-2xl w-full space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 font-mono text-left">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-left">
                <Terminal className="w-5 h-5 text-emerald-400 animate-pulse animate-duration-1000" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Agent Execution Environment</h3>
                  <span className="text-[9px] text-slate-400 block">TaskID: {executingTaskId || 'System Daemon'} • Status: Executing</span>
                </div>
              </div>
              <button
                onClick={() => setIsAgentPanelOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Live Terminal logs output */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 h-64 overflow-y-auto space-y-1 text-xs">
              {agentLogs.length === 0 ? (
                <div className="text-slate-500 italic">Initializing safe virtual environment sandboxed containers...</div>
              ) : (
                agentLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2.5 leading-relaxed text-left">
                    <span className="text-slate-500 shrink-0 select-none">[{log.time}]</span>
                    <span className={`
                      ${log.type === 'info' ? 'text-slate-300' : ''}
                      ${log.type === 'success' ? 'text-emerald-400 font-bold' : ''}
                      ${log.type === 'warn' ? 'text-amber-400' : ''}
                      ${log.type === 'agent' ? 'text-fuchsia-400 font-semibold' : ''}
                    `}>
                      {log.type === 'agent' ? '📦 ' : ''}
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Quick Status and Close buttons */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 text-left">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Container active on sandbox port 9999</span>
              </div>
              <button
                onClick={() => setIsAgentPanelOpen(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg uppercase tracking-wider text-[10px] cursor-pointer"
              >
                Close Environment
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          ⭐ FLOATING ASSISTANT: BOTTOM-RIGHT BUBBLE
          ========================================== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 font-sans">
        
        {/* Floating Speech / Action Dialog Card */}
        {assistantOpen && (
          <div className="bg-white dark:bg-slate-950 border border-purple-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl max-w-sm w-80 text-left animate-in slide-in-from-bottom-5 duration-200 space-y-3.5 relative overflow-hidden">
            {/* Top glowing aura */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-purple-600 to-fuchsia-600" />
            
            <div className="flex justify-between items-center pb-2 border-b border-purple-50 dark:border-slate-900">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin animate-duration-3000" />
                <span className="text-[10px] font-black uppercase text-purple-950 dark:text-purple-300 tracking-wider">Proactive Intelligence Scout</span>
              </div>
              <button 
                onClick={() => setAssistantOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Scout Broadcast</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                &quot;{assistantMessage}&quot;
              </p>
            </div>

            {/* Micro Quick Actions */}
            <div className="space-y-2 pt-2 border-t border-purple-50 dark:border-slate-900 text-left">
              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Quick Command Actions</span>
              
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    setHoursLeft(2);
                    handleAiSchedule();
                    setAssistantOpen(false);
                    showToast('⏳ Squeezed evening window! AI rearranged active tasks.');
                    speakText('Rearranging your active tasks to safeguard your evening.');
                  }}
                  className="w-full text-left p-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/80 rounded-xl text-[10.5px] font-bold text-purple-950 dark:text-purple-300 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>🌙 Yes, rearrange my evening</span>
                  <ChevronRight className="w-3 h-3 text-purple-400" />
                </button>

                <button
                  onClick={() => {
                    handleAiSchedule();
                    setAssistantOpen(false);
                  }}
                  className="w-full text-left p-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 rounded-xl text-[10.5px] font-bold text-amber-800 dark:text-amber-400 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>⚡ Deploy better schedule optimization</span>
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                </button>

                <button
                  onClick={() => {
                    // Navigate directly to scheduler date
                    setSelectedDate('2026-06-30');
                    scheduleStudyTask('Database Isolation & MVCC deep-dive');
                    handleAddSuggestedLog(
                      '💡 AI Suggested Log: Database Isolation',
                      'Explored transactional locking protocols (MVCC), repeatable read conflicts under concurrent workloads, and resolved indexing deadlocks on the Postgres DB cluster.',
                      'Database-Systems'
                    );
                    setAssistantOpen(false);
                  }}
                  className="w-full text-left p-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 rounded-xl text-[10.5px] font-bold text-indigo-800 dark:text-indigo-400 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>📚 Log DB isolation & Study Tuesday</span>
                  <ChevronRight className="w-3 h-3 text-indigo-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Small Assistant Bubble Trigger Button */}
        <button
          onClick={() => {
            setAssistantOpen(!assistantOpen);
            speakText("Lumora assistant active. Ready to coordinate your calendar.");
          }}
          className={`h-12 w-12 rounded-full bg-gradient-to-tr from-amber-500 via-purple-600 to-fuchsia-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer relative group border-2 border-white/20 ${
            assistantOpen ? 'ring-4 ring-purple-300 dark:ring-purple-900/60' : 'animate-bounce'
          }`}
          title="Open Lumora AI Assistant"
        >
          {/* Active Ping Dot */}
          <span className="absolute top-0.5 right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          
          <Sparkles className="w-5 h-5 text-amber-100 group-hover:rotate-12 transition-transform" />
        </button>

      </div>

      {/* Dynamic Toast system */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-950 text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-purple-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-fuchsia-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Universal footer */}
      <footer className="max-w-7xl mx-auto w-full py-4 text-center text-[10px] text-slate-400 dark:text-slate-500 border-t border-purple-100/40 mt-8">
        <p>© 2026 Lumora AI • Anti-AI-slop Compliance</p>
      </footer>
    </div>
  );
}
