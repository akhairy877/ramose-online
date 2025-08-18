import { VisionBoardData, Student, Subject, Teacher, Milestone, QuizAttempt } from './types';

export const subjects: Subject[] = [
  { id: 'math', name: 'Mathematics', color: 'bg-blue-500', icon: '🔢' },
  { id: 'english', name: 'English', color: 'bg-green-500', icon: '📚' },
  { id: 'science', name: 'Science', color: 'bg-purple-500', icon: '🔬' },
  { id: 'art', name: 'Art', color: 'bg-pink-500', icon: '🎨' },
  { id: 'pe', name: 'Physical Education', color: 'bg-orange-500', icon: '⚽' },
  { id: 'music', name: 'Music', color: 'bg-yellow-500', icon: '🎵' }
];

export const teachers: Teacher[] = [
  { id: '1', name: 'Ahmed El-Agamy', username: 'ahmed.elagamy', password: '12345678', subjects: ['math', 'science'] },
  { id: '2', name: 'Sarah Johnson', username: 'sarah.johnson', password: 'password123', subjects: ['english', 'art'] },
  { id: '3', name: 'Mike Chen', username: 'mike.chen', password: 'password123', subjects: ['pe', 'music'] }
];

const careerGoals = [
  'Doctor', 'Engineer', 'Teacher', 'Artist', 'Scientist', 'Musician', 'Athlete', 'Writer',
  'Chef', 'Pilot', 'Veterinarian', 'Firefighter', 'Police Officer', 'Nurse', 'Architect'
];

const avatarColors = [
  'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200',
  'bg-pink-200', 'bg-indigo-200', 'bg-gray-200', 'bg-orange-200', 'bg-teal-200'
];

const generateMilestones = (studentId: string): Milestone[] => {
  const milestones: Milestone[] = [];
  
  subjects.forEach(subject => {
    for (let week = 1; week <= 36; week++) {
      const id = `${studentId}-${subject.id}-${week}`;
      const attempts = Math.random() > 0.7 ? [] : generateAttempts();
      const status = getStatusFromAttempts(attempts);
      
      milestones.push({
        id,
        lessonTitle: `${subject.name} Week ${week}`,
        week,
        subject: subject.id,
        careerRelevance: getCareerRelevance(subject.name),
        status,
        quizAttempts: attempts,
        points: calculatePoints(attempts),
        maxAttempts: 3
      });
    }
  });
  
  return milestones;
};

const generateAttempts = (): QuizAttempt[] => {
  const numAttempts = Math.floor(Math.random() * 3) + 1;
  const attempts: QuizAttempt[] = [];
  
  for (let i = 1; i <= numAttempts; i++) {
    const grade = Math.floor(Math.random() * 101);
    attempts.push({
      attempt: i,
      grade,
      passed: grade >= 60,
      date: new Date(2024, 0, (Math.random() * 365)).toISOString()
    });
    
    if (grade >= 60) break; // Stop if passed
  }
  
  return attempts;
};

const getStatusFromAttempts = (attempts: QuizAttempt[]): Milestone['status'] => {
  if (attempts.length === 0) return 'not-started';
  
  const lastAttempt = attempts[attempts.length - 1];
  if (lastAttempt.passed) return 'passed';
  
  if (attempts.length >= 3) return 'failed-permanent';
  return 'failed-retryable';
};

const calculatePoints = (attempts: QuizAttempt[]): number => {
  if (attempts.length === 0) return 0;
  
  const lastAttempt = attempts[attempts.length - 1];
  if (!lastAttempt.passed) return 0;
  
  // More points for fewer attempts
  const basePoints = lastAttempt.grade;
  const attemptPenalty = (attempts.length - 1) * 10;
  return Math.max(basePoints - attemptPenalty, 0);
};

const getCareerRelevance = (subject: string): string => {
  const relevanceMap: Record<string, string> = {
    'Mathematics': 'Builds logical thinking and problem-solving skills essential for any career',
    'English': 'Develops communication skills crucial for expressing ideas and collaborating',
    'Science': 'Fosters curiosity and analytical thinking for understanding the world',
    'Art': 'Enhances creativity and visual communication abilities',
    'Physical Education': 'Promotes teamwork, discipline, and healthy lifestyle habits',
    'Music': 'Develops rhythm, coordination, and emotional expression'
  };
  return relevanceMap[subject] || 'Contributes to well-rounded personal development';
};

const generateStudents = (): Student[] => {
  const students: Student[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const id = `student-${i}`;
    const milestones = generateMilestones(id);
    const totalPoints = milestones.reduce((sum, m) => sum + m.points, 0);
    
    students.push({
      id,
      name: `Student ${i}`,
      careerGoal: careerGoals[Math.floor(Math.random() * careerGoals.length)],
      avatar: avatarColors[i % avatarColors.length],
      totalPoints,
      milestones
    });
  }
  
  return students;
};

export const visionBoardData: VisionBoardData = {
  students: generateStudents(),
  subjects,
  teachers,
  currentWeek: 12,
  totalWeeks: 36
};
