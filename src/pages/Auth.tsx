import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Briefcase } from "lucide-react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("type") || "candidate";
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    company: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Authentication logic will be implemented with Supabase
    console.log("Form submitted:", { ...formData, userType, isSignUp });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        {/* User Type Selection */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Welcome to TechMatch</h1>
          <Tabs value={userType} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="candidate" asChild>
                <Link to="/auth?type=candidate" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Candidate
                </Link>
              </TabsTrigger>
              <TabsTrigger value="employer" asChild>
                <Link to="/auth?type=employer" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Employer
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Auth Form */}
        <Card className="shadow-xl border-0 bg-background/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <Badge variant="secondary" className="w-fit mx-auto mb-2">
              {userType === "candidate" ? "Find Your Dream Job" : "Hire Top Talent"}
            </Badge>
            <CardTitle className="text-xl">
              {isSignUp ? "Create Account" : "Sign In"}
            </CardTitle>
            <CardDescription>
              {userType === "candidate" 
                ? "Join thousands of professionals showcasing their skills"
                : "Connect with pre-vetted candidates who fit your needs"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              {isSignUp && userType === "employer" && (
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your company name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                />
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              <Button type="submit" variant="hero" size="lg" className="w-full">
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;