import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Brain, 
  Code, 
  Database, 
  Palette, 
  TrendingUp, 
  Clock, 
  Users, 
  Briefcase,
  Star,
  ArrowRight,
  CheckCircle,
  Play
} from "lucide-react";

const Dashboard = () => {
  const [userType] = useState<"candidate" | "employer">("candidate"); // This will come from auth context

  // Mock data for candidate dashboard
  const skillAssessments = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of modern JavaScript concepts",
      duration: "45 min",
      difficulty: "Intermediate",
      icon: Code,
      status: "completed",
      score: 85
    },
    {
      id: 2,
      title: "React & TypeScript",
      description: "Build a real-world component with TypeScript",
      duration: "60 min",
      difficulty: "Advanced",
      icon: Code,
      status: "available",
      score: null
    },
    {
      id: 3,
      title: "Database Design",
      description: "Design and optimize database schemas",
      duration: "50 min",
      difficulty: "Intermediate",
      icon: Database,
      status: "locked",
      score: null
    },
    {
      id: 4,
      title: "UI/UX Design Principles",
      description: "Create user-centered design solutions",
      duration: "40 min",
      difficulty: "Beginner",
      icon: Palette,
      status: "available",
      score: null
    }
  ];

  const jobMatches = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "Remote",
      match: 94,
      salary: "$95k - $120k",
      skills: ["React", "TypeScript", "Node.js"],
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      match: 87,
      salary: "$110k - $140k",
      skills: ["JavaScript", "Python", "AWS"],
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "React Developer",
      company: "Digital Solutions",
      location: "Austin, TX",
      match: 82,
      salary: "$80k - $100k",
      skills: ["React", "Redux", "Jest"],
      posted: "3 days ago"
    }
  ];

  const stats = {
    assessmentsCompleted: 3,
    totalAssessments: 12,
    averageScore: 88,
    jobMatches: 15,
    profileViews: 47
  };

  const renderCandidateDashboard = () => (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assessments</p>
                <p className="text-2xl font-bold">{stats.assessmentsCompleted}/{stats.totalAssessments}</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Job Matches</p>
                <p className="text-2xl font-bold">{stats.jobMatches}</p>
              </div>
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{stats.profileViews}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assessments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assessments">Skill Assessments</TabsTrigger>
          <TabsTrigger value="matches">Job Matches</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Available Assessments
              </CardTitle>
              <CardDescription>
                Complete skill assessments to improve your job matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {skillAssessments.map((assessment) => (
                  <Card key={assessment.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-muted rounded-lg">
                            <assessment.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{assessment.title}</h3>
                            <p className="text-sm text-muted-foreground">{assessment.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {assessment.duration}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {assessment.difficulty}
                              </Badge>
                              {assessment.status === "completed" && assessment.score && (
                                <Badge variant="default" className="text-xs bg-success text-success-foreground">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {assessment.score}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          {assessment.status === "completed" ? (
                            <Button variant="ghost" size="sm">
                              View Results
                            </Button>
                          ) : assessment.status === "available" ? (
                            <Button variant="hero" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Start
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" disabled>
                              Locked
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                AI-Matched Jobs
              </CardTitle>
              <CardDescription>
                Jobs that match your skills and assessment scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobMatches.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                          <div>
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span>{job.company}</span>
                              <span>•</span>
                              <span>{job.location}</span>
                              <span>•</span>
                              <span>{job.posted}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Match:</span>
                              <Badge variant="default" className="bg-success text-success-foreground">
                                {job.match}%
                              </Badge>
                            </div>
                            <span className="text-sm font-medium text-primary">{job.salary}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <Button variant="professional" size="sm" className="ml-4">
                          Apply <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg"></div>
                <span className="text-xl font-bold">TechMatch</span>
              </div>
              <Badge variant="secondary">Dashboard</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Frontend Developer</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Track your progress and discover new opportunities</p>
        </div>

        {userType === "candidate" ? renderCandidateDashboard() : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Employer dashboard coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;