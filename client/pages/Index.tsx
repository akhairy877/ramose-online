import { useState } from 'react';
import { visionBoardData } from '@shared/data';
import { Student, Milestone, Subject } from '@shared/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function Index() {
  const [selectedStudent, setSelectedStudent] = useState<Student>(visionBoardData.students[0]);
  const { subjects, currentWeek } = visionBoardData;

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'passed': return 'bg-green-100 border-green-300 text-green-800';
      case 'failed-retryable': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'failed-permanent': return 'bg-red-100 border-red-300 text-red-800';
      case 'in-progress': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'passed': return '✅';
      case 'failed-retryable': return '⚠️';
      case 'failed-permanent': return '❌';
      case 'in-progress': return '🔄';
      default: return '⏳';
    }
  };

  const getMilestonesBySubjectAndWeek = (subjectId: string, week: number): Milestone | undefined => {
    return selectedStudent.milestones.find(m => m.subject === subjectId && m.week === week);
  };

  const weeks = Array.from({ length: 36 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-rainbow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                🌟 Grade 1 Vision Boards 🌟
              </h1>
              <p className="text-gray-600 mt-2">Track your journey to achieving your career dreams!</p>
            </div>
            
            {/* Student Selector */}
            <div className="w-full lg:w-auto min-w-[300px]">
              <Select value={selectedStudent.id} onValueChange={(value) => {
                const student = visionBoardData.students.find(s => s.id === value);
                if (student) setSelectedStudent(student);
              }}>
                <SelectTrigger className="w-full bg-white border-2 border-purple-200 hover:border-purple-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {visionBoardData.students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold", student.avatar)}>
                          {student.name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-gray-500">Dreams to be a {student.careerGoal}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Student Info Card */}
          <Card className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white", selectedStudent.avatar.replace('200', '500'))}>
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-purple-800">{selectedStudent.name}</h2>
                  <p className="text-purple-600 flex items-center gap-2">
                    <span>🎯 Dreams to be a</span>
                    <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
                      {selectedStudent.careerGoal}
                    </Badge>
                  </p>
                  <p className="text-purple-600">
                    <span>⭐ Total Points: </span>
                    <span className="font-bold text-xl">{selectedStudent.totalPoints}</span>
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Main Vision Board */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Current Week:</span>
            <Badge className="bg-blue-500 text-white text-lg px-3 py-1">
              Week {currentWeek}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Progress:</span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                style={{ width: `${(currentWeek / 36) * 100}%` }}
              />
            </div>
            <span>{Math.round((currentWeek / 36) * 100)}%</span>
          </div>
        </div>

        {/* Vision Board Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[1200px] grid grid-cols-37 gap-2">
            {/* Header Row */}
            <div className="col-span-1 sticky left-0 bg-white z-10"></div>
            {weeks.map(week => (
              <div key={week} className="text-center p-2 bg-white rounded-lg shadow-sm border">
                <div className="text-xs font-medium text-gray-600">Week</div>
                <div className="text-sm font-bold text-purple-600">{week}</div>
              </div>
            ))}

            {/* Subject Rows */}
            {subjects.map((subject) => (
              <div key={subject.id} className="contents">
                {/* Subject Header */}
                <div className="sticky left-0 bg-white z-10 p-3 border rounded-lg shadow-sm">
                  <div className={cn("w-full h-16 rounded-lg flex flex-col items-center justify-center text-white font-bold", subject.color)}>
                    <div className="text-2xl">{subject.icon}</div>
                    <div className="text-xs text-center">{subject.name}</div>
                  </div>
                </div>

                {/* Milestones for this subject */}
                {weeks.map(week => {
                  const milestone = getMilestonesBySubjectAndWeek(subject.id, week);
                  return (
                    <Card key={`${subject.id}-${week}`} className={cn("h-20 relative overflow-hidden border-2 transition-all hover:shadow-lg cursor-pointer", 
                      milestone ? getStatusColor(milestone.status) : 'bg-gray-50 border-gray-200',
                      week === currentWeek ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                    )}>
                      <CardContent className="p-2 h-full flex flex-col justify-between">
                        {milestone ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-lg">{getStatusIcon(milestone.status)}</span>
                              <span className="text-xs font-bold">{milestone.points}pts</span>
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium truncate">{milestone.lessonTitle}</div>
                              {milestone.quizAttempts.length > 0 && (
                                <div className="text-xs opacity-75">
                                  Attempts: {milestone.quizAttempts.length}/{milestone.maxAttempts}
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <span className="text-lg">⏳</span>
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
        <Card className="mt-6 bg-white">
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-800">Legend</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <span className="text-sm">Passed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span className="text-sm">Can Retry</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">❌</span>
                <span className="text-sm">Failed (3 attempts)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔄</span>
                <span className="text-sm">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">⏳</span>
                <span className="text-sm">Not Started</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Access */}
        <div className="mt-6 text-center">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3">
            🏫 Teacher Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
