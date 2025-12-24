
export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  role: string;
  matchScore: number;
  skills: string[];
  status: 'Applied' | 'Interview' | 'Offered' | 'Hired';
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export interface College {
  id: string;
  name: string;
  location: string;
  logo: string;
  contactPerson: string;
  studentsReferred: number;
}

export interface Meeting {
  id: string;
  title: string;
  time: string;
  candidateName: string;
  link?: string;
  source?: 'internal' | 'google';
  description?: string;
}
