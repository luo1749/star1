export type UserRole = 'teacher' | 'parent' | 'admin' | 'expert';

export interface User {
  username: string;
  password: string;
  role: UserRole;
  phone: string;
  realName: string;
  avatar?: string;
}

export interface Student {
  id: number;
  name: string;
  class: string;
  condition: string;
  heartRate: number;
  bodyTemp: number;
  emotion: string;
  location: string;
  steps: number;
  battery: number;
  deviceStatus: 'online' | 'offline';
  parent: string;
  teachers: string[];
  hasCondition: boolean;
  avatar?: string;
  sleepHours?: number;
  screenTime?: number;
  socialInteraction?: number;
  appetite?: string;
  medicationTaken?: boolean;
}

export interface Alert {
  id: number;
  level: 1 | 2 | 3;
  student: string;
  type: string;
  message: string;
  time: string;
  solution: string;
  handled: boolean;
}

export interface MedicalRecord {
  id: number;
  student: string;
  date: string;
  title: string;
  content: string;
  aiSolution: string;
  parentSolution: string;
  expertName: string;
  expertSolution: string;
  teacherActions: ActionRecord[];
  parentActions: ActionRecord[];
  expertActions: ActionRecord[];
  isPublic: boolean;
}

export interface ActionRecord {
  id: number;
  author: string;
  role: string;
  content: string;
  time: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
  battery: number;
  lastSync: string;
  student: string;
}

export interface Expert {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  experience: number;
  rate: number;
  certification: string;
  intro: string;
  isPublic: boolean;
  posts: any[];
  hospital?: string;
  education?: string;
  publications?: string[];
  workSchedule?: string;
  contact?: string;
}

export interface Consultation {
  id: number;
  student: string;
  parent: string;
  expert: string;
  type: 'video' | 'audio' | 'chat';
  scheduledTime: string;
  status: 'scheduled' | 'completed';
  topic: string;
  notes: string;
  expertNotes: string | null;
  prescription: string | null;
  followUp: boolean;
  followUpDate: string | null;
}

export interface ConsultationRequest {
  id: number;
  student: string;
  parent: string;
  expert: string;
  description: string;
  requestTime: string;
  preferredTime: string;
  agreedTime: string | null;
  fee: number | null;
  paymentMethod: string | null;
  isPaid: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

export interface ForumPost {
  id: number;
  author: string;
  avatar: string;
  time: string;
  title: string;
  content: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
}

export interface ExpertForumPost {
  id: number;
  author: string;
  avatar: string;
  time: string;
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  likes: number;
  likedBy: string[];
  comments: Comment[];
}

export interface Comment {
  id: number;
  author: string;
  avatar?: string;
  content: string;
  time: string;
}

export interface Feedback {
  id: number;
  author: string;
  role: string;
  content: string;
  time: string;
  status: string;
}

export interface HistoricalData {
  date: string;
  heartRate: number;
  bodyTemp: number;
  steps: number;
  emotion: string;
  sleepHours: number;
  screenTime: number;
  medicationTaken: boolean;
  therapyMinutes: number;
  alertCount: number;
  socialInteraction: number;
  appetite: string;
}

export interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
}

export interface MedicalComment {
  id: number;
  recordId: number;
  expert: string;
  content: string;
  isPublic: boolean;
  time: string;
}

export interface MoodJournalEntry {
  id: number;
  student: string;
  date: string;
  mood: 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'excited';
  intensity: number;
  trigger: string;
  notes: string;
  strategies: string[];
}

export interface IEPGoal {
  id: number;
  student: string;
  area: string;
  goal: string;
  objectives: string[];
  startDate: string;
  targetDate: string;
  progress: number;
  status: 'active' | 'completed' | 'pending';
  createdBy: string;
  source: 'parent' | 'expert' | 'ai' | 'teacher';
}

export interface ResourceItem {
  id: number;
  title: string;
  category: string;
  type: 'article' | 'video' | 'tool' | 'guide';
  description: string;
  tags: string[];
  detailContent?: string;
}

export type MenuItem = { id: string; name: string; icon: string };
