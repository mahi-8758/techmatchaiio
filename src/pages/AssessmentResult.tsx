import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  Brain
} from "lucide-react";

const AssessmentResult = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessmentResult = async () => {
      if (!user || !assessmentId) return;

      try {
        const { data, error } = await supabase
          .from('skill_assessments')
          .select('*')
          .eq('id', assessmentId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setAssessment(data);
        }
      } catch (error) {
        console.error('Error fetching assessment result:', error);
        toast({
          title: "Error",
          description: "Failed to load assessment result",
          variant: "destructive"
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentResult();
  }, [user, assessmentId, toast, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <p>Loading assessment results...</p>
        </div>
      </div>
    );
  }

  if (!assessment || assessment.status !== 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Assessment Not Found</h2>
          <p className="text-muted-foreground mb-4">This assessment is not completed or doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const scorePercentage = (assessment.score / assessment.max_score) * 100;
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: "Excellent", icon: Trophy, color: "text-green-600" };
    if (score >= 80) return { level: "Very Good", icon: Award, color: "text-green-500" };
    if (score >= 70) return { level: "Good", icon: Target, color: "text-yellow-600" };
    if (score >= 60) return { level: "Average", icon: TrendingUp, color: "text-yellow-500" };
    return { level: "Below Average", icon: XCircle, color: "text-red-600" };
  };

  const performance = getPerformanceLevel(scorePercentage);
  const PerformanceIcon = performance.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Badge variant="secondary">Assessment Result</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Card */}
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                <PerformanceIcon className={`h-12 w-12 ${performance.color}`} />
              </div>
              <CardTitle className="text-2xl">{assessment.title}</CardTitle>
              <CardDescription>{assessment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(scorePercentage)}`}>
                    {assessment.score}/{assessment.max_score}
                  </div>
                  <p className="text-sm text-muted-foreground">Final Score</p>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${performance.color}`}>
                    {Math.round(scorePercentage)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Percentage</p>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-semibold ${performance.color}`}>
                    {performance.level}
                  </div>
                  <p className="text-sm text-muted-foreground">Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Score Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Performance</span>
                    <span className="text-sm text-muted-foreground">{Math.round(scorePercentage)}%</span>
                  </div>
                  <Progress value={scorePercentage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Strengths
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {scorePercentage >= 80 && <li>• Excellent problem-solving skills</li>}
                      {scorePercentage >= 70 && <li>• Good understanding of core concepts</li>}
                      {scorePercentage >= 60 && <li>• Solid foundation knowledge</li>}
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Target className="h-4 w-4 text-yellow-600" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {scorePercentage < 90 && <li>• Practice more complex scenarios</li>}
                      {scorePercentage < 80 && <li>• Review fundamental concepts</li>}
                      {scorePercentage < 70 && <li>• Focus on practical applications</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Assessment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="text-lg">{assessment.duration_minutes} minutes</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                  <Badge variant="outline">{assessment.difficulty_level}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed On</p>
                  <p className="text-lg">{new Date(assessment.completed_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Based on your performance, here are some recommendations:
                </p>
                <div className="grid gap-4">
                  {scorePercentage >= 80 ? (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Excellent Work!</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        You've demonstrated strong skills in this area. Consider taking advanced assessments or exploring related topics.
                      </p>
                    </div>
                  ) : scorePercentage >= 60 ? (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Good Progress!</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        You have a solid foundation. Review the learning materials and try some practice exercises to improve further.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Keep Learning!</h4>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Focus on building your foundation in this area. Check out the learning videos and consider retaking this assessment later.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button variant="hero" onClick={() => navigate('/dashboard?tab=learning')}>
              <Brain className="h-4 w-4 mr-2" />
              Continue Learning
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssessmentResult;