import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Brain, Target, Zap, ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Advanced algorithms match candidates based on actual skills and performance"
    },
    {
      icon: Target,
      title: "Practical Assessments",
      description: "Real-world skill tests that predict job performance better than resumes"
    },
    {
      icon: Users,
      title: "Bias-Free Hiring",
      description: "Focus on demonstrated abilities rather than background or credentials"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get qualified candidate matches in minutes, not weeks"
    }
  ];

  const benefits = [
    "Reduce time-to-hire by 75%",
    "Improve candidate quality matches",
    "Eliminate unconscious hiring bias",
    "Lower recruitment costs significantly"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg"></div>
              <span className="text-xl font-bold">TechMatch</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button variant="hero">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  🚀 AI-Powered Recruitment
                </Badge>
                <h1 className="text-5xl font-bold leading-tight">
                  Hire Based on 
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Skills</span>,
                  Not Resumes
                </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Our AI-powered platform matches candidates to roles through practical skill assessments, 
              eliminating bias and finding the perfect fit every time.
            </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?type=employer">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Start Hiring <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth?type=candidate">
                  <Button variant="professional" size="lg" className="w-full sm:w-auto">
                    Find Opportunities
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
              <img 
                src={heroImage} 
                alt="AI-powered recruitment platform" 
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">How TechMatch Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionary recruitment that focuses on what candidates can actually do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of companies using TechMatch to find exceptional talent
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?type=employer">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-6 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded"></div>
              <span className="font-semibold">TechMatch</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 TechMatch. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;