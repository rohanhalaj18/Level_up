
export interface Skill {
  name: string;
  percentage: number;
  icon: string;
  color: string;
}

export interface LearningData {
  day: string;
  coding: number;
  aptitude: number;
}

export interface Suggestion {
  title: string;
  topic: string;
  status: 'Completed' | 'InProgress' | 'NotStarted';
}

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  type: 'interview' | 'workshop' | 'meeting';
}

export interface AptitudeSubject {
  name: string;
  score: number;
  total: number;
  color: string;
}

export interface AptitudeTrend {
  testDate: string;
  score: number;
}

export interface Benchmark {
  role: string;
  averageScore: number;
}
