import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  visionBoardData,
  subjects,
  updateMilestoneStatus,
  updateStudentCareerGoal,
  updateMilestoneCareerRelevance,
  updateMilestoneUsedAttempts,
  updateQuizAttemptScore,
  getCurrentVisionBoardData,
} from "@shared/data";
import { Teacher, Student, Milestone } from "@shared/types";
import { cn } from "@/lib/utils";

export default function TeacherDashboard() {
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [currentData, setCurrentData] = useState(visionBoardData);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<string>(""); // Track which milestone is being updated
  const navigate = useNavigate();

  // Refresh data function
  const refreshData = () => {
    const newData = getCurrentVisionBoardData();
    setCurrentData(newData);

    // Update selected student with fresh data
    if (selectedStudent) {
      const updatedStudent = newData.students.find(
        (s) => s.id === selectedStudent.id,
      );
      if (updatedStudent) {
        setSelectedStudent(updatedStudent);
      }
    }
  };

  useEffect(() => {
    const teacherData = localStorage.getItem("currentTeacher");
    if (teacherData) {
      setCurrentTeacher(JSON.parse(teacherData));
    } else {
      navigate("/teacher/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentTeacher");
    navigate("/");
  };

  const getStudentsForTeacher = () => {
    if (!currentTeacher) return [];
    return currentData.students;
  };

  const getSubjectsForTeacher = () => {
    if (!currentTeacher) return [];
    return subjects.filter((subject) =>
      currentTeacher.subjects.includes(subject.id),
    );
  };

  const getMilestonesForStudentAndSubject = (
    studentId: string,
    subjectId: string,
  ) => {
    const student = currentData.students.find((s) => s.id === studentId);
    if (!student) return [];
    return student.milestones.filter((m) => m.subject === subjectId);
  };

  const handleMilestoneStatusUpdate = async (
    studentId: string,
    milestoneId: string,
    newStatus: Milestone["status"],
  ) => {
    setIsUpdating(milestoneId);

    try {
      const success = updateMilestoneStatus(studentId, milestoneId, newStatus);

      if (success) {
        setFeedbackMessage(
          `Successfully updated milestone status to ${newStatus.replace("-", " ")}`,
        );
        refreshData();

        // Clear feedback after 3 seconds
        setTimeout(() => setFeedbackMessage(""), 3000);
      } else {
        setFeedbackMessage("Failed to update milestone status");
      }
    } catch (error) {
      setFeedbackMessage("Error updating milestone status");
      console.error("Error updating milestone:", error);
    } finally {
      setIsUpdating("");
    }
  };

  const handleCareerGoalUpdate = (studentId: string, newGoal: string) => {
    const success = updateStudentCareerGoal(studentId, newGoal);

    if (success) {
      setFeedbackMessage("Career goal updated successfully");
      refreshData();

      // Clear feedback after 3 seconds
      setTimeout(() => setFeedbackMessage(""), 3000);
    } else {
      setFeedbackMessage("Failed to update career goal");
    }
  };

  const handleCareerRelevanceUpdate = (
    studentId: string,
    milestoneId: string,
    newRelevance: string,
  ) => {
    const success = updateMilestoneCareerRelevance(
      studentId,
      milestoneId,
      newRelevance,
    );

    if (success) {
      setFeedbackMessage("Career relevance updated successfully");
      refreshData();

      // Clear feedback after 3 seconds
      setTimeout(() => setFeedbackMessage(""), 3000);
    } else {
      setFeedbackMessage("Failed to update career relevance");
    }
  };

  const handleUsedAttemptsUpdate = (
    studentId: string,
    milestoneId: string,
    newUsedAttempts: number,
  ) => {
    const success = updateMilestoneUsedAttempts(
      studentId,
      milestoneId,
      newUsedAttempts,
    );

    if (success) {
      setFeedbackMessage(`Used attempts updated to ${newUsedAttempts}`);
      refreshData();

      // Clear feedback after 3 seconds
      setTimeout(() => setFeedbackMessage(""), 3000);
    } else {
      setFeedbackMessage(
        "Failed to update used attempts (must be between 0-3)",
      );
    }
  };

  const handleQuizScoreUpdate = (
    studentId: string,
    milestoneId: string,
    attemptNumber: number,
    newScore: number,
  ) => {
    const success = updateQuizAttemptScore(
      studentId,
      milestoneId,
      attemptNumber,
      newScore,
    );

    if (success) {
      setFeedbackMessage(`Quiz score updated to ${newScore}%`);
      refreshData();

      // Clear feedback after 3 seconds
      setTimeout(() => setFeedbackMessage(""), 3000);
    } else {
      setFeedbackMessage("Failed to update quiz score (must be between 0-100)");
    }
  };

  if (!currentTeacher) {
    return <div>Loading...</div>;
  }

  const teacherSubjects = getSubjectsForTeacher();
  const students = getStudentsForTeacher();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-indigo-500 to-purple-500">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row lg:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                🏫 Teacher Dashboard
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Welcome back, {currentTeacher.name}!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-purple-200 text-purple-600"
              >
                👁️ View Vision Board
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-200 text-red-600"
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Teacher Info */}
          <Card className="mt-4 bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {currentTeacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-800">
                    {currentTeacher.name}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    {teacherSubjects.map((subject) => (
                      <Badge
                        key={subject.id}
                        className={cn("text-white", subject.color)}
                      >
                        {subject.icon} {subject.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 py-6">
        {/* Feedback Message */}
        {feedbackMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">
              {feedbackMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Student Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-indigo-700">
                📚 Select Student
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedStudent?.id || ""}
                onValueChange={(value) => {
                  const student = students.find((s) => s.id === value);
                  setSelectedStudent(student || null);
                }}
              >
                <SelectTrigger className="border-2 border-indigo-200">
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                            student.avatar,
                          )}
                        >
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-gray-500">
                            {student.careerGoal}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedStudent && (
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Label className="text-sm font-medium text-purple-700">
                      Career Goal
                    </Label>
                    <Input
                      defaultValue={selectedStudent.careerGoal}
                      className="mt-1 border-purple-200"
                      onBlur={(e) =>
                        handleCareerGoalUpdate(
                          selectedStudent.id,
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    <div>
                      <strong>Total Points:</strong>{" "}
                      {selectedStudent.totalPoints}
                    </div>
                    <div>
                      <strong>Total Milestones:</strong>{" "}
                      {selectedStudent.milestones.length}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subject Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-700">
                📖 Your Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teacherSubjects.map((subject) => (
                  <Button
                    key={subject.id}
                    variant={
                      selectedSubject === subject.id ? "default" : "outline"
                    }
                    className={cn(
                      "w-full justify-start gap-3 h-auto p-4",
                      selectedSubject === subject.id
                        ? `${subject.color} text-white`
                        : "border-2 hover:border-purple-300",
                    )}
                    onClick={() => setSelectedSubject(subject.id)}
                  >
                    <span className="text-2xl">{subject.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-sm sm:text-base">
                        {subject.name}
                      </div>
                      <div className="text-xs opacity-75">
                        36 weeks curriculum
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">
                📊 Student Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStudent && selectedSubject ? (
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-700">
                    {selectedStudent.name} -{" "}
                    {subjects.find((s) => s.id === selectedSubject)?.name}
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {getMilestonesForStudentAndSubject(
                      selectedStudent.id,
                      selectedSubject,
                    )
                      .slice(0, 8) // Show first 8 weeks for better UX
                      .map((milestone) => (
                        <Card
                          key={milestone.id}
                          className="p-4 border rounded-lg bg-white shadow-sm"
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-medium">
                              Week {milestone.week}
                            </div>
                            <Badge
                              className={cn(
                                "text-xs",
                                milestone.status === "passed"
                                  ? "bg-green-100 text-green-800"
                                  : milestone.status === "failed-retryable"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : milestone.status === "failed-permanent"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800",
                              )}
                            >
                              {milestone.status.replace("-", " ")}
                            </Badge>
                          </div>

                          {/* Lesson Title */}
                          <div className="text-xs text-gray-600 mb-3 font-medium">
                            {milestone.lessonTitle}
                          </div>

                          {/* Career Relevance */}
                          <div className="mb-3">
                            <Label className="text-xs font-medium text-purple-700 mb-1 block">
                              Career Relevance
                            </Label>
                            <Textarea
                              defaultValue={milestone.careerRelevance}
                              className="text-xs min-h-[60px] border-purple-200"
                              placeholder="Explain how this lesson relates to career goals..."
                              onBlur={(e) =>
                                handleCareerRelevanceUpdate(
                                  selectedStudent.id,
                                  milestone.id,
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          {/* Used Attempts */}
                          <div className="mb-3">
                            <Label className="text-xs font-medium text-blue-700 mb-1 block">
                              Used Attempts
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max="3"
                                defaultValue={milestone.quizAttempts.length}
                                className="w-20 text-xs border-blue-200"
                                onBlur={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (value >= 0 && value <= 3) {
                                    handleUsedAttemptsUpdate(
                                      selectedStudent.id,
                                      milestone.id,
                                      value,
                                    );
                                  }
                                }}
                              />
                              <span className="text-xs text-gray-500">
                                / 3 attempts
                              </span>
                              {milestone.quizAttempts.length >= 3 &&
                                !milestone.quizAttempts.some(
                                  (a) => a.passed,
                                ) && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">
                                    Max reached
                                  </Badge>
                                )}
                            </div>
                          </div>

                          {/* Quiz Attempts Scores */}
                          {milestone.quizAttempts.length > 0 && (
                            <div className="mb-3">
                              <Label className="text-xs font-medium text-green-700 mb-2 block">
                                Quiz Attempts & Scores
                              </Label>
                              <div className="space-y-2">
                                {milestone.quizAttempts.map((attempt) => (
                                  <div
                                    key={attempt.attempt}
                                    className="flex items-center gap-3 p-2 bg-gray-50 rounded border"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-gray-200 text-gray-800 text-xs">
                                        Attempt {attempt.attempt}
                                      </Badge>
                                      <span className="text-xs text-gray-500">
                                        {new Date(
                                          attempt.date,
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        defaultValue={attempt.grade}
                                        className="w-16 text-xs border-green-200"
                                        onBlur={(e) => {
                                          const value = parseInt(
                                            e.target.value,
                                          );
                                          if (value >= 0 && value <= 100) {
                                            handleQuizScoreUpdate(
                                              selectedStudent.id,
                                              milestone.id,
                                              attempt.attempt,
                                              value,
                                            );
                                          }
                                        }}
                                      />
                                      <span className="text-xs text-gray-500">
                                        %
                                      </span>
                                      <Badge
                                        className={cn(
                                          "text-xs",
                                          attempt.passed
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800",
                                        )}
                                      >
                                        {attempt.passed ? "✅ Pass" : "❌ Fail"}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Status Buttons */}
                          <div className="flex gap-1 flex-wrap">
                            {[
                              "not-started",
                              "in-progress",
                              "passed",
                              "failed-retryable",
                              "failed-permanent",
                            ].map((status) => (
                              <Button
                                key={status}
                                size="sm"
                                variant={
                                  milestone.status === status
                                    ? "default"
                                    : "outline"
                                }
                                className="text-xs px-2 py-1 h-auto"
                                onClick={() =>
                                  handleMilestoneStatusUpdate(
                                    selectedStudent.id,
                                    milestone.id,
                                    status as Milestone["status"],
                                  )
                                }
                                disabled={isUpdating === milestone.id}
                              >
                                {status === "not-started"
                                  ? "⏳"
                                  : status === "in-progress"
                                    ? "🔄"
                                    : status === "passed"
                                      ? "✅"
                                      : status === "failed-retryable"
                                        ? "⚠️"
                                        : "❌"}
                              </Button>
                            ))}
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Select a student and subject to view progress</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Class Overview */}
        <Card className="mt-4 sm:mt-6">
          <CardHeader>
            <CardTitle className="text-blue-700 text-lg sm:text-xl">
              📈 Class Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {students.length}
                </div>
                <div className="text-sm text-blue-700">Total Students</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {teacherSubjects.length}
                </div>
                <div className="text-sm text-green-700">Subjects Teaching</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {teacherSubjects.length * 36}
                </div>
                <div className="text-sm text-purple-700">Total Lessons</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
