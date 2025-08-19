import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Milestone, QuizAttempt } from '@shared/types';
import { cn } from '@/lib/utils';

interface MilestoneDialogProps {
  milestone: Milestone | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MilestoneDialog({ milestone, isOpen, onClose }: MilestoneDialogProps) {
  if (!milestone) return null;

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

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    if (grade >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{getStatusIcon(milestone.status)}</span>
            <div>
              <div className="text-xl font-bold">{milestone.lessonTitle}</div>
              <div className="text-sm text-gray-600 font-normal">Week {milestone.week}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Points */}
          <div className="flex flex-wrap gap-4">
            <Badge className={cn("px-3 py-1", getStatusColor(milestone.status))}>
              {milestone.status.replace('-', ' ').toUpperCase()}
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
              {milestone.points} Points
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              Attempts: {milestone.quizAttempts.length}/{milestone.maxAttempts}
            </Badge>
          </div>

          {/* Career Relevance */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-purple-700">🎯 Career Relevance</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{milestone.careerRelevance}</p>
            </CardContent>
          </Card>

          {/* Quiz Attempts */}
          {milestone.quizAttempts.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-blue-700">📝 Quiz Attempts</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {milestone.quizAttempts.map((attempt) => (
                    <div key={attempt.attempt} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-gray-200 text-gray-800">
                          Attempt {attempt.attempt}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {new Date(attempt.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn("text-xl font-bold", getGradeColor(attempt.grade))}>
                          {attempt.grade}%
                        </span>
                        <span className="text-lg">
                          {attempt.passed ? '✅' : '❌'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {milestone.quizAttempts.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800 mb-2">Summary:</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Best Score:</span>
                        <span className={cn("ml-2 font-bold", getGradeColor(Math.max(...milestone.quizAttempts.map(a => a.grade))))}>
                          {Math.max(...milestone.quizAttempts.map(a => a.grade))}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Passed:</span>
                        <span className="ml-2 font-bold">
                          {milestone.quizAttempts.some(a => a.passed) ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-green-700">🚀 Next Steps</h3>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700">
                {milestone.status === 'not-started' && (
                  <p>Ready to start this lesson! Click "Begin Quiz" when you're prepared.</p>
                )}
                {milestone.status === 'in-progress' && (
                  <p>Continue working on this lesson. You can take the quiz when ready.</p>
                )}
                {milestone.status === 'passed' && (
                  <p>Congratulations! You've successfully completed this milestone. Great job! 🎉</p>
                )}
                {milestone.status === 'failed-retryable' && (
                  <p>Don't give up! You have {milestone.maxAttempts - milestone.quizAttempts.length} more attempt(s). Review the material and try again.</p>
                )}
                {milestone.status === 'failed-permanent' && (
                  <p>You've used all available attempts. Talk to your teacher about additional support or alternative assignments.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
