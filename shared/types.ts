export interface QuizAttempt {
  attempt: number;
  grade: number;
  passed: boolean;
  date: string;
}

export interface Milestone {
  id: string;
  lessonTitle: string;
  week: number;
  subject: string;
  careerRelevance: string;
  status: 'not-started' | 'in-progress' | 'passed' | 'failed-retryable' | 'failed-permanent';
  quizAttempts: QuizAttempt[];
  points: number;
  maxAttempts: 3;
}

export interface Student {
  id: string;
  name: string;
  careerGoal: string;
  avatar: string;
  totalPoints: number;
  milestones: Milestone[];
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Teacher {
  id: string;
  name: string;
  username: string;
  password: string;
  subjects: string[];
}

export interface VisionBoardData {
  students: Student[];
  subjects: Subject[];
  teachers: Teacher[];
  currentWeek: number;
  totalWeeks: 36;
}
