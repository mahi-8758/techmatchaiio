import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Bot, User, MapPin, Star, Mail, ExternalLink } from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  required_skills: string[];
}

interface CandidateMatch {
  id: string;
  full_name: string;
  location: string;
  skills: string[];
  experience_level: string;
  bio: string;
  match_score: number;
  matching_skills: string[];
  email?: string;
}

export function AIMatchingTool() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [matches, setMatches] = useState<CandidateMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('id, title, required_skills')
        .eq('employer_id', user?.id)
        .eq('status', 'active');

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load job postings.",
        variant: "destructive",
      });
    }
  };

  const runAIMatching = async () => {
    if (!selectedJob) {
      toast({
        title: "Error",
        description: "Please select a job posting first.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    setLoading(true);

    try {
      // Get the selected job details
      const selectedJobData = jobs.find(job => job.id === selectedJob);
      if (!selectedJobData) return;

      // Call the AI matching edge function
      const { data, error } = await supabase.functions.invoke('ai-candidate-matching', {
        body: {
          jobId: selectedJob,
          requiredSkills: selectedJobData.required_skills,
          jobTitle: selectedJobData.title
        }
      });

      if (error) throw error;

      setMatches(data.matches || []);
      
      toast({
        title: "AI Analysis Complete",
        description: `Found ${data.matches?.length || 0} potential candidates.`,
      });
    } catch (error: any) {
      console.error('Error running AI matching:', error);
      toast({
        title: "Error",
        description: "Failed to run AI matching analysis.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Partial Match";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI-Powered Candidate Matching
          </CardTitle>
          <CardDescription>
            Use AI to find the best candidates for your job postings based on skills, experience, and compatibility.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a job posting to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={runAIMatching} disabled={loading || !selectedJob}>
              {analyzing ? (
                <>
                  <Bot className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </div>

          {analyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analyzing candidate profiles...</span>
                <span>Processing</span>
              </div>
              <Progress value={75} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {matches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Matched Candidates</CardTitle>
            <CardDescription>
              Top candidates ranked by AI compatibility score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matches.map((candidate) => (
                <Card key={candidate.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold">{candidate.full_name}</h3>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className={`text-sm font-medium ${getMatchColor(candidate.match_score)}`}>
                            {candidate.match_score}% Match
                          </div>
                          <Badge variant={candidate.match_score >= 80 ? 'default' : candidate.match_score >= 60 ? 'secondary' : 'outline'}>
                            {getMatchLabel(candidate.match_score)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {candidate.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {candidate.location}
                          </div>
                        )}
                        
                        {candidate.experience_level && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {candidate.experience_level} Level
                          </div>
                        )}
                      </div>

                      {candidate.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {candidate.bio}
                        </p>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Matching Skills:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {candidate.matching_skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-medium">Match Breakdown:</div>
                        <Progress value={candidate.match_score} className="w-full h-2" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                      <Button size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && matches.length === 0 && selectedJob && (
        <Card>
          <CardContent className="text-center py-8">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No matches found yet. Run AI analysis to find compatible candidates.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}