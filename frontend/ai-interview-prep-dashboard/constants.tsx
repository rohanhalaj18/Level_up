
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ClipboardCheck, 
  FilePlus, 
  Settings,
  Code,
  Brain,
  Terminal,
  Database,
  Cloud,
  Layers,
  Sparkles,
  PieChart
} from 'lucide-react';
import { Skill, LearningData, ScheduleItem, Suggestion, AptitudeSubject, AptitudeTrend, Benchmark } from './types';

export const SKILLS: Skill[] = [
  { name: 'Coding', percentage: 89, icon: 'Code', color: 'bg-green-100 text-green-600' },
  { name: 'System Design', percentage: 70, icon: 'Layers', color: 'bg-blue-100 text-blue-600' },
  { name: 'Aptitude', percentage: 70, icon: 'Brain', color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Python', percentage: 75, icon: 'Terminal', color: 'bg-orange-100 text-orange-600' },
  { name: 'SQL/DB', percentage: 87, icon: 'Database', color: 'bg-pink-100 text-pink-600' },
  { name: 'Cloud', percentage: 26, icon: 'Cloud', color: 'bg-yellow-100 text-yellow-600' },
  { name: 'AI Models', percentage: 20, icon: 'Sparkles', color: 'bg-teal-100 text-teal-600' },
  { name: 'Logical', percentage: 50, icon: 'PieChart', color: 'bg-purple-100 text-purple-600' },
  { name: 'React', percentage: 78, icon: 'Code', color: 'bg-red-100 text-red-600' },
];

export const LEARNING_CURVE_DATA: LearningData[] = [
  { day: 'S', coding: 10, aptitude: 5 },
  { day: 'M', coding: 35, aptitude: 25 },
  { day: 'T', coding: 40, aptitude: 75 },
  { day: 'W', coding: 45, aptitude: 40 },
  { day: 'T', coding: 85, aptitude: 20 },
  { day: 'F', coding: 65, aptitude: 90 },
  { day: 'S', coding: 80, aptitude: 70 },
];

export const SCHEDULE_ITEMS: ScheduleItem[] = [
  { id: '1', title: 'Interview with GreenTech', time: '10:00 AM', type: 'interview' },
  { id: '2', title: 'React Workshop Flow', time: '02:00 PM', type: 'workshop' },
  { id: '3', title: 'Project Meeting', time: '04:30 PM', type: 'meeting' },
];

export const SUGGESTIONS: Suggestion[] = [
  { title: 'Advanced Data Structures', topic: 'Graphs & Dynamic Programming', status: 'Completed' },
  { title: 'LLM Fundamentals', topic: 'Attention Mechanisms & Transformers', status: 'NotStarted' },
];

export const APTITUDE_SUBJECTS: AptitudeSubject[] = [
  { name: 'Quantitative', score: 42, total: 50, color: 'bg-blue-500' },
  { name: 'Logical Reasoning', score: 38, total: 50, color: 'bg-purple-500' },
  { name: 'Verbal Ability', score: 45, total: 50, color: 'bg-teal-500' },
  { name: 'Data Interpretation', score: 32, total: 50, color: 'bg-orange-500' },
];

export const APTITUDE_TREND: AptitudeTrend[] = [
  { testDate: 'Jan 10', score: 62 },
  { testDate: 'Jan 20', score: 68 },
  { testDate: 'Jan 30', score: 71 },
  { testDate: 'Feb 10', score: 78 },
  { testDate: 'Feb 20', score: 82 },
  { testDate: 'Mar 02', score: 85 },
];

export const INDUSTRY_BENCHMARKS: Benchmark[] = [
  { role: 'Full Stack Developer', averageScore: 78 },
  { role: 'Data Scientist', averageScore: 82 },
  { role: 'DevOps Engineer', averageScore: 74 },
  { role: 'Frontend Architect', averageScore: 80 },
];

export const NAVIGATION = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, active: true },
  { name: 'Tasks', icon: <ClipboardCheck size={20} />, active: false },
  { name: 'Resume & Scores', icon: <FileText size={20} />, active: false },
  { name: 'Team', icon: <Users size={20} />, active: false },
  { name: 'New Resume', icon: <FilePlus size={20} />, active: false },
  { name: 'Settings', icon: <Settings size={20} />, active: false },
];
