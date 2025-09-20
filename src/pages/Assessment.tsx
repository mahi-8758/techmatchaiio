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
  Clock,
  CheckCircle,
  XCircle,
  Brain,
  Timer,
  AlertCircle
} from "lucide-react";

const Assessment = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Mock questions for demonstration
  const questions = [
    {
      id: 1,
      question: "What is the correct way to declare a variable in JavaScript ES6?",
      options: [
        "var myVar = 'value';",
        "let myVar = 'value';", 
        "const myVar = 'value';",
        "Both let and const are correct"
      ],
      correct: 3
    },
    {
      id: 2,
      question: "Which method is used to add an element to the end of an array?",
      options: [
        "push()",
        "pop()",
        "shift()",
        "unshift()"
      ],
      correct: 0
    },
    {
      id: 3,
      question: "What is the purpose of the 'use strict' directive in JavaScript?",
      options: [
        "To enable strict mode which catches common coding mistakes",
        "To make JavaScript run faster",
        "To enable ES6 features",
        "To disable console warnings"
      ],
      correct: 0
    },
    {
      id: 4,
      question: "Which of the following is NOT a primitive data type in JavaScript?",
      options: [
        "string",
        "number",
        "object",
        "boolean"
      ],
      correct: 2
    },
    {
      id: 5,
      question: "What does the '===' operator do in JavaScript?",
      options: [
        "Checks for equality with type coercion",
        "Checks for strict equality without type coercion",
        "Assigns a value to a variable",
        "Compares object references"
      ],
      correct: 1
    }
  ];

  useEffect(() => {
    const fetchAssessment = async () => {
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
          if (data.duration_minutes) {
            setTimeLeft(data.duration_minutes * 60); // Convert to seconds
          }
        }
      } catch (error) {
        console.error('Error fetching assessment:', error);
        toast({
          title: "Error",
          description: "Failed to load assessment",
          variant: "destructive"
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [user, assessmentId, toast, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isStarted && timeLeft > 0 && !isCompleted) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isStarted) {
      completeAssessment();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isStarted, isCompleted]);

  const startAssessment = async () => {
    setIsStarted(true);
    
    // Update assessment status to 'in_progress'
    try {
      await supabase
        .from('skill_assessments')
        .update({ status: 'in_progress' })
        .eq('id', assessmentId);
    } catch (error) {
      console.error('Error updating assessment status:', error);
    }
  };

  const selectAnswer = (answerIndex: number) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answerIndex.toString()
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeAssessment = async () => {
    setIsCompleted(true);
    
    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (parseInt(answers[index]) === question.correct) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    try {
      const { error } = await supabase
        .from('skill_assessments')
        .update({ 
          status: 'completed',
          score: score,
          max_score: 100,
          completed_at: new Date().toISOString()
        })
        .eq('id', assessmentId);

      if (error) throw error;

      toast({
        title: "Assessment Completed!",
        description: `You scored ${score}% on this assessment.`,
      });

      // Redirect to results page
      navigate(`/assessment-result/${assessmentId}`);
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save assessment results",
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <p>Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Assessment Not Found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                  <Brain className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">{assessment.title}</CardTitle>
                <CardDescription>{assessment.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-lg">{assessment.duration_minutes} minutes</p>
                  </div>
                  <div className="text-center">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Questions</p>
                    <p className="text-lg">{questions.length}</p>
                  </div>
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Difficulty</p>
                    <Badge variant="outline">{assessment.difficulty_level}</Badge>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Instructions</h3>
                  <ul className="text-sm text-muted-foreground text-left space-y-1">
                    <li>• You have {assessment.duration_minutes} minutes to complete this assessment</li>
                    <li>• Each question has only one correct answer</li>
                    <li>• You can navigate between questions freely</li>
                    <li>• The assessment will auto-submit when time runs out</li>
                    <li>• Make sure you have a stable internet connection</li>
                  </ul>
                </div>

                <Button onClick={startAssessment} size="lg" variant="hero" className="w-full">
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">{assessment.title}</h1>
              <Badge variant="secondary">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-lg font-mono">
              <Timer className="h-4 w-4" />
              <span className={timeLeft < 300 ? "text-destructive" : ""}>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name="answer"
                      value={index}
                      checked={answers[currentQuestion] === index.toString()}
                      onChange={() => selectAnswer(index)}
                      className="w-4 h-4 text-primary"
                    />
                    <label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-6">
                <Button 
                  variant="outline" 
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>

                <div className="text-sm text-muted-foreground">
                  {Object.keys(answers).length} of {questions.length} answered
                </div>

                {currentQuestion === questions.length - 1 ? (
                  <Button 
                    onClick={completeAssessment}
                    variant="hero"
                    disabled={!answers[currentQuestion]}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Assessment
                  </Button>
                ) : (
                  <Button 
                    onClick={nextQuestion}
                    disabled={!answers[currentQuestion]}
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Question Navigator */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {questions.map((_, index) => (
                  <Button
                    key={index}
                    variant={index === currentQuestion ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-full ${
                      answers[index] ? "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700" : ""
                    }`}
                  >
                    {index + 1}
                    {answers[index] && <CheckCircle className="h-3 w-3 ml-1" />}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Assessment;