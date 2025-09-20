import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles, Book, Code, Users, Zap, Shield, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Documentation = () => {
  const sections = [
    {
      title: "Getting Started",
      icon: Book,
      items: [
        "Quick Start Guide",
        "Account Setup",
        "First Assessment",
        "Understanding Results"
      ]
    },
    {
      title: "API Documentation",
      icon: Code,
      items: [
        "Authentication",
        "Candidate Management",
        "Assessment API",
        "Webhooks"
      ]
    },
    {
      title: "For Employers",
      icon: Users,
      items: [
        "Creating Job Postings",
        "Setting Assessment Criteria",
        "Reviewing Candidates",
        "Team Collaboration"
      ]
    },
    {
      title: "AI Features",
      icon: Brain,
      items: [
        "AI Matching Algorithm",
        "Skill Assessment",
        "Bias Detection",
        "Predictive Analytics"
      ]
    },
    {
      title: "Security & Privacy",
      icon: Shield,
      items: [
        "Data Protection",
        "GDPR Compliance",
        "Security Measures",
        "Privacy Policy"
      ]
    },
    {
      title: "Advanced Features",
      icon: Zap,
      items: [
        "Custom Assessments",
        "Integration Options",
        "Reporting & Analytics",
        "White-label Solutions"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Main animated gradient background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'var(--gradient-animated)',
            backgroundSize: '400% 400%',
            animation: 'gradient-shift 8s ease-in-out infinite'
          }}
        />
        
        {/* Floating gradient orbs */}
        <div 
          className="absolute top-20 left-20 w-96 h-96 rounded-full animate-float-slow"
          style={{
            background: 'var(--gradient-orb-1)',
            filter: 'blur(40px)'
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full animate-float-medium"
          style={{
            background: 'var(--gradient-orb-2)',
            filter: 'blur(35px)'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full animate-pulse-glow"
          style={{
            background: 'var(--gradient-orb-3)',
            filter: 'blur(30px)'
          }}
        />
      </div>

      {/* Content with higher z-index */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-background/80 border-b border-border">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">TechMatch AI</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                <Link to="/#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                <Link to="/docs" className="text-foreground font-medium">Documentation</Link>
              </div>

              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <section className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">Documentation</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Everything you need to know about TechMatch AI. From getting started to advanced features and API integration.
                </p>
              </div>

              {/* Documentation Sections */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {sections.map((section, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border bg-card">
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <section.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{section.title}</h3>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <a 
                              href="#" 
                              className="text-muted-foreground hover:text-foreground transition-colors text-sm block py-1"
                            >
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Start Guide */}
              <Card className="border-border bg-card mb-8">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6">Quick Start Guide</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">For Employers</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium">1. Create Your Account</h4>
                          <p className="text-muted-foreground text-sm">Sign up and complete your company profile with basic information about your organization.</p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium">2. Post a Job</h4>
                          <p className="text-muted-foreground text-sm">Create detailed job postings with required skills and experience levels.</p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium">3. Set Assessment Criteria</h4>
                          <p className="text-muted-foreground text-sm">Define the skills and competencies you want to evaluate in candidates.</p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium">4. Review AI Matches</h4>
                          <p className="text-muted-foreground text-sm">Get ranked candidates with detailed insights on skills and cultural fit.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">For Candidates</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium">1. Create Your Profile</h4>
                          <p className="text-muted-foreground text-sm">Sign up and build your professional profile with skills and experience.</p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium">2. Take Assessments</h4>
                          <p className="text-muted-foreground text-sm">Complete skill-based assessments to showcase your capabilities.</p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium">3. Get Matched</h4>
                          <p className="text-muted-foreground text-sm">Our AI will match you with relevant job opportunities.</p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium">4. Connect with Employers</h4>
                          <p className="text-muted-foreground text-sm">Engage with employers who are interested in your profile.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Reference */}
              <Card className="border-border bg-card">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6">API Reference</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Authentication</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <code className="text-sm">
                          POST /api/auth/login<br />
                          Content-Type: application/json<br />
                          {`{ "email": "user@example.com", "password": "password" }`}
                        </code>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Create Assessment</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <code className="text-sm">
                          POST /api/assessments<br />
                          Authorization: Bearer {`{token}`}<br />
                          Content-Type: application/json<br />
                          {`{ "title": "Frontend Developer Assessment", "skills": ["React", "JavaScript"] }`}
                        </code>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Get Candidates</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <code className="text-sm">
                          GET /api/candidates?job_id=123<br />
                          Authorization: Bearer {`{token}`}
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Documentation;