import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { visionBoardData, getCurrentVisionBoardData } from "@shared/data";
import { Student, Milestone, Subject } from "@shared/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MilestoneDialog } from "@/components/MilestoneDialog";
import { cn } from "@/lib/utils";

export default function Index() {
  const [currentData, setCurrentData] = useState(() =>
    getCurrentVisionBoardData(),
  );
  const [selectedStudent, setSelectedStudent] = useState<Student>(
    () => getCurrentVisionBoardData().students[0],
  );
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { subjects, currentWeek } = currentData;
  const navigate = useNavigate();

  // Refresh data on component mount and periodically
  useEffect(() => {
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

    // Initial refresh
    refreshData();

    // Set up interval to refresh every 5 seconds
    const interval = setInterval(refreshData, 5000);

    return () => clearInterval(interval);
  }, [selectedStudent?.id]);

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsDialogOpen(true);
  };

  const handleTeacherDashboardClick = () => {
    navigate("/teacher/login");
  };

  const handleAdminDashboardClick = () => {
    navigate("/admin/login");
  };

  const getStatusColor = (status: Milestone["status"]) => {
    switch (status) {
      case "passed":
        return "bg-green-100 border-green-300 text-green-800";
      case "failed-retryable":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "failed-permanent":
        return "bg-red-100 border-red-300 text-red-800";
      case "in-progress":
        return "bg-blue-100 border-blue-300 text-blue-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-600";
    }
  };

  const getStatusIcon = (status: Milestone["status"]) => {
    switch (status) {
      case "passed":
        return "✅";
      case "failed-retryable":
        return "⚠️";
      case "failed-permanent":
        return "❌";
      case "in-progress":
        return "🔄";
      default:
        return "⏳";
    }
  };

  const getMilestonesBySubjectAndWeek = (
    subjectId: string,
    week: number,
  ): Milestone | undefined => {
    return selectedStudent.milestones.find(
      (m) => m.subject === subjectId && m.week === week,
    );
  };

  const weeks = Array.from({ length: 36 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-rainbow">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row lg:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="text-center sm:text-left lg:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                🌟 Grade 1 Vision Boards 🌟
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Track your journey to achieving your career dreams!
              </p>
            </div>

            {/* Cooperation Button + Student Selector */}
            <div className="w-full sm:w-auto lg:w-auto min-w-[250px] sm:min-w-[300px] flex flex-col items-end gap-2">
              <Button
                asChild
                className="self-end bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 py-2 text-sm shadow-md border-2 border-green-200"
                title="Cooperate to make this app available worldwide"
              >
                <a href="mailto:ramose.online@gmail.com?subject=Grade%201%20Vision%20Boards">
                  🤝 Help students worldwide
                </a>
              </Button>
              <Select
                value={selectedStudent.id}
                onValueChange={(value) => {
                  const student = currentData.students.find(
                    (s) => s.id === value,
                  );
                  if (student) setSelectedStudent(student);
                }}
              >
                <SelectTrigger className="w-full bg-white border-2 border-purple-200 hover:border-purple-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {currentData.students.map((student) => (
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
                        <div className="text-left">
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-gray-500">
                            Dreams to be a {student.careerGoal}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Student Info Card */}
          <Card className="mt-4 sm:mt-6 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
            <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                <div
                  className={cn(
                    "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white",
                    selectedStudent.avatar.replace("200", "500"),
                  )}
                >
                  {selectedStudent.name.charAt(0)}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-800">
                    {selectedStudent.name}
                  </h2>
                  <div className="text-purple-600 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                    <span className="text-sm sm:text-base">
                      🎯 Dreams to be a
                    </span>
                    <Badge className="bg-purple-500 hover:bg-purple-600 text-white text-xs sm:text-sm">
                      {selectedStudent.careerGoal}
                    </Badge>
                  </div>
                  <p className="text-purple-600 text-sm sm:text-base mt-1">
                    <span>⭐ Total Points: </span>
                    <span className="font-bold text-lg sm:text-xl">
                      {selectedStudent.totalPoints}
                    </span>
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Main Vision Board */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Current Week:
            </span>
            <Badge className="bg-blue-500 text-white text-sm sm:text-lg px-2 sm:px-3 py-1">
              Week {currentWeek}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <span>Progress:</span>
            <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                style={{ width: `${(currentWeek / 36) * 100}%` }}
              />
            </div>
            <span>{Math.round((currentWeek / 36) * 100)}%</span>
          </div>
        </div>

        {/* Vision Board Grid */}
        <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg">
          <div
            className="min-w-[4500px] grid gap-3"
            style={{
              gridTemplateColumns: "160px repeat(36, minmax(120px, 1fr))",
            }}
          >
            {" "}
            {/* Header Row */}
            <div className="sticky left-0 bg-white z-10 p-2 rounded border">
              <div className="font-bold text-center text-purple-700 text-sm">
                Subjects
              </div>
            </div>
            {weeks.map((week) => (
              <div
                key={week}
                className={cn(
                  "text-center p-1 sm:p-2 lg:p-3 bg-white rounded-lg shadow-sm border-2",
                  week === currentWeek
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200",
                  week < currentWeek ? "bg-green-50 border-green-200" : "",
                  week > currentWeek ? "bg-gray-50 border-gray-200" : "",
                )}
              >
                <div className="text-xs font-medium text-gray-600 mb-1">
                  Week
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-bold text-purple-600 mb-1">
                  {week}
                </div>
                <div className="text-xs text-gray-500 hidden sm:block">
                  {week < currentWeek
                    ? "Past"
                    : week === currentWeek
                      ? "Current"
                      : "Future"}
                </div>
              </div>
            ))}
            {/* Subject Rows */}
            {subjects.map((subject) => (
              <div key={subject.id} className="contents">
                {/* Subject Header */}
                <div className="sticky left-0 bg-white z-10 p-2 border-2 rounded-lg shadow-md">
                  <div
                    className={cn(
                      "w-full h-20 rounded-lg flex flex-col items-center justify-center font-bold relative",
                      subject.id === "english"
                        ? "bg-green-500 text-white"
                        : subject.id === "art"
                          ? "bg-pink-500 text-white"
                          : subject.id === "pe"
                            ? "bg-orange-500 text-white"
                            : subject.id === "music"
                              ? "bg-yellow-500 text-gray-800"
                              : subject.color + " text-white",
                    )}
                  >
                    <div className="text-2xl mb-1">{subject.icon}</div>
                    <div className="text-xs text-center font-bold leading-tight px-1">
                      {subject.name}
                    </div>
                    <div className="text-xs text-center opacity-90 mt-1">
                      36 Lessons
                    </div>
                  </div>
                </div>

                {/* Milestones for this subject */}
                {weeks.map((week) => {
                  const milestone = getMilestonesBySubjectAndWeek(
                    subject.id,
                    week,
                  );
                  return (
                    <Card
                      key={`${subject.id}-${week}`}
                      className={cn(
                        "h-20 sm:h-24 lg:h-32 relative overflow-hidden border-2 transition-all hover:shadow-lg cursor-pointer hover:scale-105",
                        milestone
                          ? getStatusColor(milestone.status)
                          : "bg-gray-50 border-gray-200",
                        week === currentWeek
                          ? "ring-2 ring-blue-400 ring-offset-2"
                          : "",
                      )}
                      onClick={() =>
                        milestone && handleMilestoneClick(milestone)
                      }
                    >
                      <CardContent className="p-1 sm:p-2 lg:p-3 h-full flex flex-col justify-between">
                        {milestone ? (
                          <>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm sm:text-lg lg:text-xl">
                                {getStatusIcon(milestone.status)}
                              </span>
                              <Badge className="text-xs px-1 py-0 bg-white/50 text-gray-800">
                                {milestone.points}pts
                              </Badge>
                            </div>
                            <div className="text-center flex-1">
                              <div className="text-xs font-bold mb-1 leading-tight hidden sm:block">
                                {milestone.lessonTitle}
                              </div>
                              <div className="text-xs text-gray-600 mb-2 leading-tight hidden lg:block">
                                {milestone.careerRelevance.substring(0, 40)}...
                              </div>
                              {milestone.quizAttempts.length > 0 ? (
                                <div className="space-y-1">
                                  <div className="text-xs font-medium hidden sm:block">
                                    Attempts: {milestone.quizAttempts.length}/
                                    {milestone.maxAttempts}
                                  </div>
                                  <div className="text-xs hidden lg:block">
                                    Best:{" "}
                                    {Math.max(
                                      ...milestone.quizAttempts.map(
                                        (a) => a.grade,
                                      ),
                                    )}
                                    %
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-gray-500 hidden sm:block">
                                  {milestone.status === "not-started"
                                    ? "Not Started"
                                    : "Ready to Start"}
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <div className="text-center">
                              <span className="text-lg sm:text-xl lg:text-2xl block mb-1">
                                ⏳
                              </span>
                              <span className="text-xs hidden sm:block">
                                Not Started
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <Card className="mt-4 sm:mt-6 bg-white">
          <CardHeader>
            <h3 className="text-base sm:text-lg font-bold text-gray-800">
              Legend
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">✅</span>
                <span className="text-xs sm:text-sm">Passed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">⚠️</span>
                <span className="text-xs sm:text-sm">Can Retry</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">❌</span>
                <span className="text-xs sm:text-sm">Failed (3 attempts)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">🔄</span>
                <span className="text-xs sm:text-sm">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">⏳</span>
                <span className="text-xs sm:text-sm">Not Started</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Buttons */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              onClick={handleTeacherDashboardClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            >
              🏫 Teacher Dashboard
            </Button>
            <Button
              onClick={handleAdminDashboardClick}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            >
              🔐 Admin Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Milestone Detail Dialog */}
      <MilestoneDialog
        milestone={selectedMilestone}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
