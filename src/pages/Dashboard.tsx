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
                {assessments.length > 0 ? assessments.map((assessment) => {
                  const IconComponent = getAssessmentIcon(assessment.assessment_type);
                  return (
                    <Card key={assessment.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-muted rounded-lg">
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{assessment.title}</h3>
                              <p className="text-sm text-muted-foreground">{assessment.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {assessment.duration_minutes} min
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {assessment.difficulty_level}
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
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => viewResults(assessment.id)}
                              >
                                View Results
                              </Button>
                            ) : assessment.status === "available" ? (
                              <Button 
                                variant="hero" 
                                size="sm"
                                onClick={() => startAssessment(assessment.id)}
                              >
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
                  );
                }) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No assessments available yet. Check back soon!</p>
                  </div>
                )}
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