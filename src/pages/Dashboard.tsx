import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  Play,
  LogOut,
  Video,
  ExternalLink
} from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [jobMatches, setJobMatches] = useState<any[]>([]);
  const [stats, setStats] = useState({
    assessmentsCompleted: 0,
    totalAssessments: 0,
    averageScore: 0,
    jobMatches: 0,
    profileViews: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (profileData) {
          setUserProfile(profileData);
        }

        // Fetch skill assessments
        const { data: assessmentData } = await supabase
          .from('skill_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (assessmentData) {
          setAssessments(assessmentData);
        }

        // Fetch job postings for matches (simplified matching)
        const { data: jobData } = await supabase
          .from('job_postings')
          .select('*')
          .eq('status', 'active')
          .limit(10);

        if (jobData) {
          // Simple matching based on user skills
          const userSkills = profileData?.skills || [];
          const matchedJobs = jobData.map(job => {
            const requiredSkills = job.required_skills || [];
            const matchingSkills = userSkills.filter((skill: string) => 
              requiredSkills.some((req: string) => 
                req.toLowerCase().includes(skill.toLowerCase())
              )
            );
            const matchScore = Math.min(95, Math.max(20, (matchingSkills.length / Math.max(requiredSkills.length, 1)) * 100 + Math.random() * 20));
            
            return {
              ...job,
              match: Math.round(matchScore),
              matchingSkills
            };
          }).filter(job => job.match > 50)
            .sort((a, b) => b.match - a.match);

          setJobMatches(matchedJobs);
        }

        // Calculate stats
        const completedAssessments = assessmentData?.filter(a => a.status === 'completed') || [];
        const avgScore = completedAssessments.length > 0 
          ? Math.round(completedAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssessments.length)
          : 0;

        setStats({
          assessmentsCompleted: completedAssessments.length,
          totalAssessments: assessmentData?.length || 0,
          averageScore: avgScore,
          jobMatches: jobData?.length || 0,
          profileViews: Math.floor(Math.random() * 100) + 20 // Simulated for now
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  const userType = userProfile?.user_type || "candidate";

  // YouTube learning videos
  const learningVideos = [
    {
      id: 1,
      title: "JavaScript ES6 Features",
      channel: "Programming with Mosh",
      videoId: "NCwa_xi0Uuc",
      duration: "1:38:49",
      views: "2.1M",
      category: "JavaScript"
    },
    {
      id: 2,
      title: "React Tutorial for Beginners",
      channel: "Programming with Mosh",
      videoId: "SqcY0GlETPk",
      duration: "1:48:43",
      views: "1.8M",
      category: "React"
    },
    {
      id: 3,
      title: "TypeScript Course for Beginners",
      channel: "Programming with Mosh",
      videoId: "d56mG7DezGs",
      duration: "1:44:29",
      views: "953K",
      category: "TypeScript"
    },
    {
      id: 4,
      title: "Database Design Course",
      channel: "freeCodeCamp.org",
      videoId: "ztHopE5Wnpc",
      duration: "8:34:27",
      views: "1.2M",
      category: "Database"
    }
  ];

  const startAssessment = async (assessmentId: string) => {
    navigate(`/assessment/${assessmentId}`);
  };

  const viewResults = (assessmentId: string) => {
    navigate(`/assessment-result/${assessmentId}`);
  };

  const getAssessmentIcon = (assessmentType: string) => {
    switch (assessmentType?.toLowerCase()) {
      case 'javascript':
      case 'react':
      case 'typescript':
        return Code;
      case 'database':
        return Database;
      case 'design':
      case 'ui/ux':
        return Palette;
      default:
        return Brain;
    }
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessments">Skill Assessments</TabsTrigger>
          <TabsTrigger value="matches">Job Matches</TabsTrigger>
          <TabsTrigger value="learning">Learning Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="space-y-6">
          {/* Assessment Categories */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="text-center border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-sm">Programming</h3>
                <p className="text-xs text-muted-foreground">{assessments.filter(a => ['javascript', 'react', 'python'].includes(a.assessment_type)).length} tests</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-dashed border-secondary/20 hover:border-secondary/40 transition-colors">
              <CardContent className="p-4">
                <Database className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <h3 className="font-semibold text-sm">Database</h3>
                <p className="text-xs text-muted-foreground">{assessments.filter(a => ['database', 'sql'].includes(a.assessment_type)).length} tests</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-dashed border-accent/20 hover:border-accent/40 transition-colors">
              <CardContent className="p-4">
                <Palette className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold text-sm">Design</h3>
                <p className="text-xs text-muted-foreground">{assessments.filter(a => ['design', 'ui-ux'].includes(a.assessment_type)).length} tests</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors">
              <CardContent className="p-4">
                <Brain className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <h3 className="font-semibold text-sm">System Design</h3>
                <p className="text-xs text-muted-foreground">{assessments.filter(a => a.assessment_type === 'system-design').length} tests</p>
              </CardContent>
            </Card>
          </div>

          {/* Assessment Progress Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.assessmentsCompleted}/{stats.totalAssessments} completed
                  </span>
                </div>
                <Progress value={(stats.assessmentsCompleted / Math.max(stats.totalAssessments, 1)) * 100} className="h-2" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{stats.averageScore}%</p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-secondary">{stats.assessmentsCompleted}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">{stats.totalAssessments - stats.assessmentsCompleted}</p>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-muted-foreground">#{Math.ceil(Math.random() * 1000)}</p>
                    <p className="text-xs text-muted-foreground">Global Rank</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Assessments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Skill Assessments
              </CardTitle>
              <CardDescription>
                Complete assessments to showcase your skills and improve job matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {assessments.length > 0 ? assessments.map((assessment) => {
                  const IconComponent = getAssessmentIcon(assessment.assessment_type);
                  const isCompleted = assessment.status === "completed";
                  const isPracticeMode = assessment.assessment_type && Math.random() > 0.7; // Random practice mode availability
                  
                  return (
                    <Card key={assessment.id} className={`border-l-4 ${
                      isCompleted ? 'border-l-green-500' : 
                      assessment.status === 'in_progress' ? 'border-l-yellow-500' :
                      'border-l-primary'
                    } hover:shadow-md transition-shadow`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${
                              isCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'
                            }`}>
                              <IconComponent className={`h-6 w-6 ${
                                isCompleted ? 'text-green-600 dark:text-green-400' : ''
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{assessment.title}</h3>
                                {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{assessment.description}</p>
                              
                              <div className="flex items-center gap-4 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {assessment.duration_minutes} min
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {assessment.difficulty_level}
                                </Badge>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {assessment.assessment_type?.replace('-', ' ')}
                                </Badge>
                                {assessment.status === "completed" && assessment.score && (
                                  <Badge variant="default" className="text-xs bg-green-600 text-white">
                                    <Star className="h-3 w-3 mr-1" />
                                    {assessment.score}%
                                  </Badge>
                                )}
                                {assessment.status === "in_progress" && (
                                  <Badge variant="default" className="text-xs bg-yellow-600 text-white">
                                    <Clock className="h-3 w-3 mr-1" />
                                    In Progress
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {assessment.status === "completed" ? (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => viewResults(assessment.id)}
                                >
                                  View Results
                                </Button>
                                {isPracticeMode && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => startAssessment(assessment.id)}
                                  >
                                    Practice Mode
                                  </Button>
                                )}
                              </>
                            ) : assessment.status === "available" ? (
                              <Button 
                                variant="hero" 
                                size="sm"
                                onClick={() => startAssessment(assessment.id)}
                                className="min-w-[100px]"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Start Test
                              </Button>
                            ) : assessment.status === "in_progress" ? (
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => startAssessment(assessment.id)}
                                className="min-w-[100px]"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Continue
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" disabled>
                                <Clock className="h-4 w-4 mr-2" />
                                Locked
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Progress bar for completed assessments */}
                        {assessment.status === "completed" && assessment.score && (
                          <div className="mt-4 pt-3 border-t">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Performance</span>
                              <span>{assessment.score}%</span>
                            </div>
                            <Progress 
                              value={assessment.score} 
                              className="h-2"
                            />
                          </div>
                        )}

                        {/* Recommendation for incomplete assessments */}
                        {assessment.status === "available" && (
                          <div className="mt-4 pt-3 border-t">
                            <p className="text-xs text-muted-foreground">
                              💡 Complete this assessment to unlock new job opportunities
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                }) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Assessments Available</h3>
                    <p className="mb-4">Assessments are being prepared for you. Check back soon!</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      Refresh Page
                    </Button>
                  </div>
                )}
              </div>

              {/* Quick Action Cards */}
              {assessments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t">
                  <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                    <CardContent className="p-4 text-center">
                      <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-1">Practice Mode</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        Take unlimited practice tests to improve your skills
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Browse Practice Tests
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-secondary/5 to-accent/5 border-secondary/20">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-secondary" />
                      <h3 className="font-semibold mb-1">Skill Analysis</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        Get detailed insights about your strengths and weaknesses
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Analysis
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
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
                {jobMatches.length > 0 ? jobMatches.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                          <div>
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span>{job.company_name}</span>
                              <span>•</span>
                              <span>{job.location || 'Location not specified'}</span>
                              <span>•</span>
                              <span>{new Date(job.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Match:</span>
                              <Badge variant="default" className="bg-success text-success-foreground">
                                {job.match}%
                              </Badge>
                            </div>
                            {job.salary_min && job.salary_max && (
                              <span className="text-sm font-medium text-primary">
                                ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {(job.required_skills || []).slice(0, 5).map((skill: string) => (
                              <Badge 
                                key={skill} 
                                variant={job.matchingSkills?.includes(skill) ? "default" : "secondary"} 
                                className="text-xs"
                              >
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
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No job matches found. Complete more assessments to improve your matches!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Learning Videos
              </CardTitle>
              <CardDescription>
                Curated video content to boost your skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {learningVideos.map((video) => (
                  <Card key={video.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <iframe
                            src={`https://www.youtube.com/embed/${video.videoId}`}
                            title={video.title}
                            className="w-full h-full rounded-lg"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{video.title}</h3>
                          <p className="text-xs text-muted-foreground">{video.channel}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {video.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{video.duration}</span>
                            <span className="text-xs text-muted-foreground">{video.views} views</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Watch on YouTube
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
                <AvatarFallback>
                  {userProfile?.full_name ? userProfile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium">{userProfile?.full_name || user?.email}</p>
                <p className="text-xs text-muted-foreground">
                  {userType === 'candidate' ? 'Candidate' : 'Employer'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userProfile?.full_name?.split(' ')[0] || 'User'}!
          </h1>
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