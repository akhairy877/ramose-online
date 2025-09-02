import {
  VisionBoardData,
  Student,
  Subject,
  Teacher,
  Admin,
  Milestone,
  QuizAttempt,
} from "./types";

export const subjects: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    color: "bg-blue-500 hover:bg-blue-600",
    icon: "🔢",
  },
  {
    id: "english",
    name: "English",
    color: "bg-green-500 hover:bg-green-600",
    icon: "📚",
  },
  {
    id: "science",
    name: "Science",
    color: "bg-purple-500 hover:bg-purple-600",
    icon: "🔬",
  },
  {
    id: "art",
    name: "Art",
    color: "bg-pink-500 hover:bg-pink-600",
    icon: "🎨",
  },
  {
    id: "pe",
    name: "Physical Education",
    color: "bg-orange-500 hover:bg-orange-600",
    icon: "⚽",
  },
  {
    id: "music",
    name: "Music",
    color: "bg-yellow-500 hover:bg-yellow-600",
    icon: "🎵",
  },
];

export const admins: Admin[] = [
  {
    id: "admin-1",
    name: "System Administrator",
    username: "admin",
    password: "NeverSayCan't",
    role: "admin",
  },
];

export const teachers: Teacher[] = [];

const careerGoals = [
  "Doctor",
  "Engineer",
  "Teacher",
  "Artist",
  "Scientist",
  "Musician",
  "Athlete",
  "Writer",
  "Chef",
  "Pilot",
  "Veterinarian",
  "Firefighter",
  "Police Officer",
  "Nurse",
  "Architect",
];

const avatarColors = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-indigo-200",
  "bg-gray-200",
  "bg-orange-200",
  "bg-teal-200",
];

const generateMilestones = (studentId: string): Milestone[] => {
  const milestones: Milestone[] = [];
  const currentWeek = 12; // Current week from visionBoardData

  subjects.forEach((subject) => {
    for (let week = 1; week <= 36; week++) {
      const id = `${studentId}-${subject.id}-${week}`;
      let attempts: QuizAttempt[] = [];
      let status: Milestone["status"] = "not-started";

      if (week < currentWeek) {
        // Past weeks - MUST have either passed or failed (3 attempts)
        const shouldPass = Math.random() > 0.3; // 70% chance to pass

        if (shouldPass) {
          // Generate passing attempts (1-2 attempts usually)
          const numAttempts =
            Math.random() > 0.6 ? 1 : Math.random() > 0.8 ? 2 : 3;
          attempts = generatePassingAttempts(numAttempts);
          status = "passed";
        } else {
          // Generate 3 failing attempts
          attempts = generateFailingAttempts();
          status = "failed-permanent";
        }
      } else if (week === currentWeek) {
        // Current week - may be in progress, passed, or failed
        const currentStatus = Math.random();
        if (currentStatus > 0.6) {
          attempts = generateAttempts();
          status = getStatusFromAttempts(attempts, true);
        } else {
          status = "in-progress";
        }
      } else {
        // Future weeks - not started
        attempts = [];
        status = "not-started";
      }

      milestones.push({
        id,
        lessonTitle: `${subject.name} Lesson ${week}`,
        week,
        subject: subject.id,
        careerRelevance: getCareerRelevance(subject.name),
        status,
        quizAttempts: attempts,
        points: calculatePoints(attempts),
        maxAttempts: 3,
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
      passed: grade >= 50,
      date: new Date(2024, 0, Math.random() * 365).toISOString(),
    });

    if (grade >= 50) break; // Stop if passed
  }

  return attempts;
};

const generatePassingAttempts = (maxAttempts: number): QuizAttempt[] => {
  const attempts: QuizAttempt[] = [];

  for (let i = 1; i <= maxAttempts; i++) {
    const isLastAttempt = i === maxAttempts;
    const grade = isLastAttempt
      ? Math.floor(Math.random() * 51) + 50 // 50-100 for passing
      : Math.floor(Math.random() * 101); // Any grade for non-final attempts

    attempts.push({
      attempt: i,
      grade,
      passed: grade >= 50,
      date: new Date(2024, 0, Math.random() * 365).toISOString(),
    });

    if (grade >= 50) break; // Stop if passed
  }

  return attempts;
};

const generateFailingAttempts = (): QuizAttempt[] => {
  const attempts: QuizAttempt[] = [];

  // Always generate exactly 3 failing attempts
  for (let i = 1; i <= 3; i++) {
    const grade = Math.floor(Math.random() * 50); // 0-49 (failing grades)
    attempts.push({
      attempt: i,
      grade,
      passed: false,
      date: new Date(2024, 0, Math.random() * 365).toISOString(),
    });
  }

  return attempts;
};

const getStatusFromAttempts = (
  attempts: QuizAttempt[],
  isCurrentOrPast: boolean = false,
): Milestone["status"] => {
  if (attempts.length === 0) {
    return isCurrentOrPast ? "not-started" : "not-started";
  }

  const lastAttempt = attempts[attempts.length - 1];
  if (lastAttempt.passed) return "passed";

  if (attempts.length >= 3) return "failed-permanent";
  return "failed-retryable";
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
    Mathematics:
      "Builds logical thinking and problem-solving skills essential for any career",
    English:
      "Develops communication skills crucial for expressing ideas and collaborating",
    Science:
      "Fosters curiosity and analytical thinking for understanding the world",
    Art: "Enhances creativity and visual communication abilities",
    "Physical Education":
      "Promotes teamwork, discipline, and healthy lifestyle habits",
    Music: "Develops rhythm, coordination, and emotional expression",
  };
  return (
    relevanceMap[subject] || "Contributes to well-rounded personal development"
  );
};

const studentNames = [
  "Emma Johnson",
  "Liam Smith",
  "Olivia Brown",
  "Noah Davis",
  "Ava Wilson",
  "Ethan Miller",
  "Sophia Moore",
  "Mason Taylor",
  "Isabella Anderson",
  "William Thomas",
  "Mia Jackson",
  "James White",
  "Charlotte Harris",
  "Benjamin Martin",
  "Amelia Thompson",
  "Lucas Garcia",
  "Harper Martinez",
  "Henry Robinson",
  "Evelyn Clark",
  "Alexander Rodriguez",
  "Abigail Lewis",
  "Michael Lee",
  "Emily Walker",
  "Daniel Hall",
  "Elizabeth Allen",
  "Matthew Young",
  "Sofia Hernandez",
  "Joseph King",
  "Avery Wright",
  "Samuel Lopez",
  "Ella Hill",
  "David Scott",
  "Scarlett Green",
  "Carter Adams",
  "Victoria Baker",
  "Wyatt Gonzalez",
  "Grace Nelson",
  "Owen Carter",
  "Chloe Mitchell",
  "Luke Perez",
  "Zoey Roberts",
  "Gabriel Turner",
  "Penelope Phillips",
  "Anthony Campbell",
  "Layla Parker",
  "Isaac Evans",
  "Riley Edwards",
  "Dylan Collins",
  "Aria Stewart",
  "Nathan Sanchez",
];

const generateStudents = (): Student[] => {
  const students: Student[] = [];

  for (let i = 1; i <= 50; i++) {
    const id = `student-${i}`;
    const milestones = generateMilestones(id);
    const totalPoints = milestones.reduce((sum, m) => sum + m.points, 0);

    students.push({
      id,
      name: studentNames[i - 1] || `Student ${i}`,
      careerGoal: careerGoals[Math.floor(Math.random() * careerGoals.length)],
      avatar: avatarColors[i % avatarColors.length],
      totalPoints,
      milestones,
    });
  }

  return students;
};

// Create a global data store that can be updated
let globalVisionBoardData: VisionBoardData = {
  students: generateStudents(),
  subjects,
  teachers,
  admins,
  currentWeek: 12,
  totalWeeks: 36,
};

// Force data regeneration for debugging
console.log("Generated students:", globalVisionBoardData.students.length);
console.log("Available subjects:", globalVisionBoardData.subjects);
console.log(
  "Sample student milestones:",
  globalVisionBoardData.students[0]?.milestones?.slice(0, 3),
);

export const visionBoardData: VisionBoardData = globalVisionBoardData;

// Function to update milestone status
export const updateMilestoneStatus = (
  studentId: string,
  milestoneId: string,
  newStatus: Milestone["status"],
): boolean => {
  const student = globalVisionBoardData.students.find(
    (s) => s.id === studentId,
  );
  if (!student) return false;

  const milestone = student.milestones.find((m) => m.id === milestoneId);
  if (!milestone) return false;

  milestone.status = newStatus;

  // Recalculate points based on new status
  if (newStatus === "passed" && milestone.quizAttempts.length === 0) {
    // If marking as passed but no attempts exist, create a passing attempt
    milestone.quizAttempts = [
      {
        attempt: 1,
        grade: 85,
        passed: true,
        date: new Date().toISOString(),
      },
    ];
  } else if (
    newStatus === "failed-permanent" &&
    milestone.quizAttempts.length < 3
  ) {
    // If marking as permanently failed, ensure 3 attempts exist
    while (milestone.quizAttempts.length < 3) {
      milestone.quizAttempts.push({
        attempt: milestone.quizAttempts.length + 1,
        grade: Math.floor(Math.random() * 50),
        passed: false,
        date: new Date().toISOString(),
      });
    }
  }

  milestone.points = calculatePoints(milestone.quizAttempts);

  // Recalculate student's total points
  student.totalPoints = student.milestones.reduce(
    (sum, m) => sum + m.points,
    0,
  );

  if (typeof window !== "undefined") DataStorage.save(globalVisionBoardData);
  return true;
};

// Function to update student career goal
export const updateStudentCareerGoal = (
  studentId: string,
  newGoal: string,
): boolean => {
  const student = globalVisionBoardData.students.find(
    (s) => s.id === studentId,
  );
  if (!student) return false;

  student.careerGoal = newGoal;
  if (typeof window !== "undefined") DataStorage.save(globalVisionBoardData);
  return true;
};

// Function to update milestone career relevance
export const updateMilestoneCareerRelevance = (
  studentId: string,
  milestoneId: string,
  newRelevance: string,
): boolean => {
  const student = globalVisionBoardData.students.find(
    (s) => s.id === studentId,
  );
  if (!student) return false;

  const milestone = student.milestones.find((m) => m.id === milestoneId);
  if (!milestone) return false;

  milestone.careerRelevance = newRelevance;
  if (typeof window !== "undefined") DataStorage.save(globalVisionBoardData);
  return true;
};

// Function to update milestone used attempts
export const updateMilestoneUsedAttempts = (
  studentId: string,
  milestoneId: string,
  newUsedAttempts: number,
): boolean => {
  const student = globalVisionBoardData.students.find(
    (s) => s.id === studentId,
  );
  if (!student) return false;

  const milestone = student.milestones.find((m) => m.id === milestoneId);
  if (!milestone) return false;

  // Validate used attempts (should be between 0 and 3)
  if (newUsedAttempts < 0 || newUsedAttempts > 3) return false;

  // Adjust quiz attempts array to match the new count
  const currentAttempts = milestone.quizAttempts.length;

  if (newUsedAttempts > currentAttempts) {
    // Add attempts (failing attempts by default)
    for (let i = currentAttempts; i < newUsedAttempts; i++) {
      milestone.quizAttempts.push({
        attempt: i + 1,
        grade: Math.floor(Math.random() * 50), // Failing grade (0-59)
        passed: false,
        date: new Date().toISOString(),
      });
    }
  } else if (newUsedAttempts < currentAttempts) {
    // Remove attempts from the end
    milestone.quizAttempts = milestone.quizAttempts.slice(0, newUsedAttempts);
  }

  // Update status based on new attempts
  if (newUsedAttempts === 0) {
    milestone.status = "not-started";
  } else if (milestone.quizAttempts.some((a) => a.passed)) {
    milestone.status = "passed";
  } else if (newUsedAttempts >= 3) {
    milestone.status = "failed-permanent";
  } else {
    milestone.status = "failed-retryable";
  }

  // Recalculate points
  milestone.points = calculatePoints(milestone.quizAttempts);

  // Recalculate student's total points
  student.totalPoints = student.milestones.reduce(
    (sum, m) => sum + m.points,
    0,
  );

  if (typeof window !== "undefined") DataStorage.save(globalVisionBoardData);
  return true;
};

// Function to update quiz attempt score
export const updateQuizAttemptScore = (
  studentId: string,
  milestoneId: string,
  attemptNumber: number,
  newScore: number,
): boolean => {
  const student = globalVisionBoardData.students.find(
    (s) => s.id === studentId,
  );
  if (!student) return false;

  const milestone = student.milestones.find((m) => m.id === milestoneId);
  if (!milestone) return false;

  const attempt = milestone.quizAttempts.find(
    (a) => a.attempt === attemptNumber,
  );
  if (!attempt) return false;

  // Validate score (should be between 0 and 100)
  if (newScore < 0 || newScore > 100) return false;

  // Update score and passed status
  attempt.grade = newScore;
  attempt.passed = newScore >= 50;

  // Update milestone status based on attempts
  if (milestone.quizAttempts.some((a) => a.passed)) {
    milestone.status = "passed";
  } else if (milestone.quizAttempts.length >= 3) {
    milestone.status = "failed-permanent";
  } else {
    milestone.status = "failed-retryable";
  }

  // Recalculate points
  milestone.points = calculatePoints(milestone.quizAttempts);

  // Recalculate student's total points
  student.totalPoints = student.milestones.reduce(
    (sum, m) => sum + m.points,
    0,
  );

  if (typeof window !== "undefined") DataStorage.save(globalVisionBoardData);
  return true;
};

// Admin functions for teacher management
export const addTeacher = (teacher: Omit<Teacher, "id">): boolean => {
  const newId = (globalVisionBoardData.teachers.length + 1).toString();
  const newTeacher: Teacher = {
    ...teacher,
    id: newId,
  };

  // Check if username already exists
  if (
    globalVisionBoardData.teachers.some((t) => t.username === teacher.username)
  ) {
    return false;
  }

  globalVisionBoardData.teachers.push(newTeacher);
  if (typeof window !== "undefined") DataStorage.save(globalVisionBoardData);
  return true;
};

export const updateTeacher = (
  teacherId: string,
  updatedTeacher: Partial<Teacher>,
): boolean => {
  const teacherIndex = globalVisionBoardData.teachers.findIndex(
    (t) => t.id === teacherId,
  );
  if (teacherIndex === -1) return false;

  // Check if username already exists (excluding current teacher)
  if (
    updatedTeacher.username &&
    globalVisionBoardData.teachers.some(
      (t) => t.username === updatedTeacher.username && t.id !== teacherId,
    )
  ) {
    return false;
  }

  globalVisionBoardData.teachers[teacherIndex] = {
    ...globalVisionBoardData.teachers[teacherIndex],
    ...updatedTeacher,
  };
  return true;
};

export const deleteTeacher = (teacherId: string): boolean => {
  const teacherIndex = globalVisionBoardData.teachers.findIndex(
    (t) => t.id === teacherId,
  );
  if (teacherIndex === -1) return false;

  globalVisionBoardData.teachers.splice(teacherIndex, 1);
  return true;
};

export const getTeacherById = (teacherId: string): Teacher | null => {
  return globalVisionBoardData.teachers.find((t) => t.id === teacherId) || null;
};

export const getAllTeachers = (): Teacher[] => {
  return [...globalVisionBoardData.teachers];
};

export const getAdminByCredentials = (
  username: string,
  password: string,
): Admin | null => {
  return (
    globalVisionBoardData.admins.find(
      (a) => a.username === username && a.password === password,
    ) || null
  );
};

// Function to get current data (for React components to re-render)
export const getCurrentVisionBoardData = (): VisionBoardData => {
  return { ...globalVisionBoardData };
};
